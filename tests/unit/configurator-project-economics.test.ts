import { describe, expect, it } from "vitest";
import { buildBatteryStorageConfiguratorResult } from "@/lib/configurator/battery-storage";
import { buildClimateConfiguratorResult } from "@/lib/configurator/climate";
import { buildHeatPumpConfiguratorResult } from "@/lib/configurator/heat-pump";
import { buildPhotovoltaicConfiguratorResult } from "@/lib/configurator/photovoltaic";
import { calculateProjectEconomics } from "@/lib/configurator/project-economics";
import { createInitialConfiguratorState } from "@/lib/configurator/state";
import { buildWallboxConfiguratorResult } from "@/lib/configurator/wallbox";
import { projectEconomicsSchema } from "@/lib/validation/configurator/economics";
import { calculateTieredCostCorridor } from "@/lib/configurator/settings-model";
import { calculateAnnualizedReturn, calculateSolarEnergyFlow } from "../../functions/src/configurator-solar-economics";
import type { ConfiguratorState } from "@/types/configurator";

function withPv(state = createInitialConfiguratorState()): ConfiguratorState {
  const configured: ConfiguratorState = {
    ...state,
    household: {
      persons: 3,
      annualConsumptionKwh: 4_500,
      futureIncreasePercent: 10,
      projectedConsumptionKwh: 4_950,
    },
    roof: {
      orientation: "south",
      pitch: 30,
      material: "roof_tile",
      renovationPeriod: "after_1990",
    },
  };
  const result = buildPhotovoltaicConfiguratorResult(configured);
  if (!result) throw new Error("PV test result missing");
  return { ...configured, results: { ...configured.results, photovoltaic: result } };
}

function withStorage(state: ConfiguratorState): ConfiguratorState {
  const configured: ConfiguratorState = {
    ...state,
    interests: { ...state.interests, batteryStorage: true },
    batteryStorage: { consumptionPattern: "mixed", backupPreference: "none", goal: "balanced" },
  };
  const result = buildBatteryStorageConfiguratorResult(configured);
  if (!result) throw new Error("Storage test result missing");
  return { ...configured, results: { ...configured.results, batteryStorage: result } };
}

function withHeatPump(state = createInitialConfiguratorState()): ConfiguratorState {
  const configured: ConfiguratorState = {
    ...state,
    heatPump: {
      existingHeatingSystem: "gas",
      heatedAreaM2: 160,
      specificSpaceHeatingDemandKwhPerM2Year: 90,
      occupancyPersons: 4,
      requiredFlowTemperatureC: 50,
      annualPerformanceFactor: 3.5,
    },
  };
  const result = buildHeatPumpConfiguratorResult(configured);
  if (!result) throw new Error("Heat-pump test result missing");
  return { ...configured, results: { ...configured.results, heatPump: result } };
}

function withClimate(state = createInitialConfiguratorState()): ConfiguratorState {
  const configured: ConfiguratorState = {
    ...state,
    climate: {
      conditionedAreaM2: 80,
      roomCount: 4,
      insulationLevel: "average",
      solarLoad: "medium",
      occupancyPersons: 4,
    },
  };
  const result = buildClimateConfiguratorResult(configured);
  if (!result) throw new Error("Climate test result missing");
  return { ...configured, results: { ...configured.results, climate: result } };
}

function withWallbox(state = createInitialConfiguratorState()): ConfiguratorState {
  const configured: ConfiguratorState = {
    ...state,
    wallbox: {
      annualDrivingKm: 15_000,
      vehicleConsumptionKwhPer100Km: 18,
      batteryCapacityKwh: 60,
      homeChargingSharePercent: 80,
      chargingPowerKw: 11,
      pvChargingSharePercent: 30,
    },
  };
  const result = buildWallboxConfiguratorResult(configured);
  if (!result) throw new Error("Wallbox test result missing");
  return { ...configured, results: { ...configured.results, wallbox: result } };
}

describe("canonical configurator project economics", () => {
  const reconciles = (left: number, right: number) => expect(Math.abs(left - right)).toBeLessThanOrEqual(0.03);

  it("models PV only with its configurator-specific investment", () => {
    const state = withPv();
    const result = state.results.photovoltaic!;
    const economics = calculateProjectEconomics(state);
    const authoritativeCorridor = calculateTieredCostCorridor({
      sizeMin: result.recommendedPowerKwpMin,
      sizeMax: result.recommendedPowerKwpMax,
      pricing: state.settings.photovoltaic.pricing,
      fixedAdditionalCostEuro: state.settings.photovoltaic.fixedAdditionalCostEuro,
      costUncertaintyPercent: state.settings.general.costUncertaintyPercent,
    });
    expect(result.pricingMode).toBe("modeled");
    expect(economics.investmentBaseEuro).toBe(authoritativeCorridor.estimatedTotalCostEuro);
    expect(economics.components[0]?.investmentSource).toBe("photovoltaic.pricing");
    expect(economics.components).toHaveLength(1);
    expect(economics.components[0]?.component).toBe("photovoltaic");
    expect(economics.investmentBaseEuro).not.toBe(18_000);
    expect(economics.projections).toHaveLength(21);
    const solar = economics.solar!;
    const first = solar.annualCashflows[1]!;
    expect(solar.investmentEuro).toBe(result.estimatedTotalCostEuro);
    expect(solar.withoutStorage.generationKwh).toBeGreaterThan(0);
    expect(solar.withoutStorage.directUseKwh).toBeGreaterThan(0);
    expect(solar.withoutStorage.feedInKwh).toBeGreaterThan(0);
    expect(first.electricityCostSavingsEuro).toBe(solar.firstYearElectricitySavingsEuro);
    expect(first.feedInRevenueEuro).toBe(solar.firstYearFeedInRevenueEuro);
    expect(first.operatingCostsEuro).toBe(solar.firstYearOperatingCostsEuro);
    reconciles(first.netAnnualBenefitEuro!, first.electricityCostSavingsEuro + first.feedInRevenueEuro - first.operatingCostsEuro);
    expect(solar.annualCashflows[0]?.cumulativeCashFlowEuro).toBe(-result.estimatedTotalCostEuro!);
    expect(economics.projections.at(-1)?.cumulativeCashFlowEuro).toBe(solar.netSurplus20YearsEuro);
    expect(economics.paybackYears).toBe(solar.paybackYears);
    expect(economics.paybackStatus).toBe("reached");
    expect(economics.annualizedReturnPercent).toBe(solar.annualizedReturnPercent);
    expect(economics.irrStatus).toBe("valid");
    expect(economics.annualizedReturnPercent).not.toBeNull();
  });

  it("models storage as an incremental PV-surplus benefit", () => {
    const state = withStorage(withPv());
    const economics = calculateProjectEconomics(state);
    const pv = economics.components.find((component) => component.component === "photovoltaic");
    const storage = economics.components.find(
      (component) => component.component === "battery_storage",
    );
    expect(storage?.firstYearEconomicEffectEuro).toBeGreaterThan(0);
    expect(storage?.firstYearEconomicEffectEuro).toBeLessThan(pv?.firstYearEconomicEffectEuro ?? 0);
    expect(storage?.explanation).toContain("zusätzliche");
    expect(storage?.investmentBaseEuro).toBe(state.results.batteryStorage?.estimatedTotalCostEuro);
    expect(storage?.investmentSource).toBe("batteryStorage.pricing");
    expect(economics.solar?.investmentEuro).toBe(
      state.results.photovoltaic!.estimatedTotalCostEuro! + state.results.batteryStorage!.estimatedTotalCostEuro!,
    );
    const without = economics.solar!.withoutStorage;
    const withBattery = economics.solar!.withStorage;
    expect(withBattery.selfConsumptionPercent).toBeGreaterThan(without.selfConsumptionPercent);
    expect(withBattery.autarkyPercent).toBeGreaterThan(without.autarkyPercent);
    expect(withBattery.gridPurchaseKwh).toBeLessThan(without.gridPurchaseKwh);
    expect(withBattery.feedInKwh).toBeLessThan(without.feedInKwh);
    expect(economics.solar?.storageUsableCapacityKwh).toBe(
      (state.results.batteryStorage!.recommendedUsableCapacityKwhMin +
       state.results.batteryStorage!.recommendedUsableCapacityKwhMax) / 2,
    );
    expect(economics.solar?.storageInvestmentEuro).toBe(storage?.investmentBaseEuro);
    expect(economics.solar?.storageAvoidedGridPurchaseKwh).toBeCloseTo(
      without.gridPurchaseKwh - withBattery.gridPurchaseKwh, 2,
    );
    expect(economics.solar?.storageReducedFeedInKwh).toBeCloseTo(
      without.feedInKwh - withBattery.feedInKwh, 2,
    );
    reconciles(withBattery.generationKwh, withBattery.directUseKwh + withBattery.storageChargeKwh + withBattery.feedInKwh);
    reconciles(withBattery.storageChargeKwh, withBattery.storageDeliveredKwh + withBattery.storageLossesKwh);
    reconciles(withBattery.demandKwh, withBattery.directUseKwh + withBattery.storageDeliveredKwh + withBattery.gridPurchaseKwh);
    expect(Object.values(withBattery).every((value) => value >= 0)).toBe(true);
    reconciles(
      economics.solar!.storageAdditionalAnnualBenefitEuro,
      withBattery.storageDeliveredKwh * state.settings.economics.gridElectricityPriceEuroPerKwh -
      (without.feedInKwh - withBattery.feedInKwh) * state.settings.economics.feedInValueEuroPerKwh,
    );
    reconciles(
      economics.solar!.withStorageFirstYearBenefitEuro - economics.solar!.withoutStorageFirstYearBenefitEuro,
      economics.solar!.storageAdditionalAnnualBenefitEuro,
    );
    const first = economics.solar!.annualCashflows[1]!;
    reconciles(first.netAnnualBenefitEuro!,
      first.electricityCostSavingsEuro + first.storageAdditionalBenefitEuro +
      first.feedInRevenueEuro - first.operatingCostsEuro);
    expect(first.feedInRevenueEuro).toBeCloseTo(
      withBattery.feedInKwh * state.settings.economics.feedInValueEuroPerKwh, 2,
    );
    expect(economics.solar?.annualCashflows[0]?.cumulativeCashFlowEuro).toBe(-economics.solar!.investmentEuro!);
    expect(economics.annualizedReturnPercent).toBe(economics.solar?.annualizedReturnPercent);
  });

  it("does not turn missing PV or storage investment into zero or a return judgement", () => {
    const priced = withStorage(withPv());
    for (const product of ["photovoltaic", "batteryStorage"] as const) {
      const state = structuredClone(priced);
      const result = state.results[product]!;
      result.pricingMode = "individual_quote_required";
      result.estimatedTotalCostEuro = null;
      result.estimatedMinimumCostEuro = null;
      result.estimatedMaximumCostEuro = null;
      const economics = calculateProjectEconomics(state);
      expect(economics.missingInvestmentComponents).toContain(
        product === "photovoltaic" ? "photovoltaic" : "battery_storage",
      );
      expect(economics.missingInvestmentSources).toContain(
        product === "photovoltaic" ? "photovoltaic.pricing" : "batteryStorage.pricing",
      );
      expect(economics.investmentBaseEuro).toBeNull();
      expect(economics.solar?.investmentEuro).toBeNull();
      expect(economics.solar?.annualCashflows[0]?.netAnnualBenefitEuro).toBeNull();
      expect(economics.paybackYears).toBeNull();
      expect(economics.paybackStatus).toBe("unavailable_missing_investment");
      expect(economics.annualizedReturnPercent).toBeNull();
      expect(economics.irrStatus).toBe("unavailable_missing_investment");
      expect(economics.finalCumulativeCashFlowEuro).toBeNull();
      expect(economics.projections).toEqual([]);
    }
  });

  it("reports absent approved tiers as missing investments", () => {
    const settings = createInitialConfiguratorState().settings;
    for (const [pricing, maxModeledSize] of [
      [settings.photovoltaic.pricing, 50],
      [settings.batteryStorage.pricing, 54],
    ] as const) {
      const corridor = calculateTieredCostCorridor({
        sizeMin: maxModeledSize + 1,
        sizeMax: maxModeledSize + 2,
        pricing,
        costUncertaintyPercent: settings.general.costUncertaintyPercent,
      });
      expect(corridor).toEqual({
        pricingMode: "individual_quote_required",
        estimatedTotalCostEuro: null,
        estimatedMinimumCostEuro: null,
        estimatedMaximumCostEuro: null,
      });
    }
  });

  it("uses a valid negative IRR internally and rejects ambiguous cashflows", () => {
    expect(calculateAnnualizedReturn(1_000, [600, 600])).toBeCloseTo(13.07, 1);
    expect(calculateAnnualizedReturn(1_000, [100, 100])).toBeLessThan(0);
    expect(calculateAnnualizedReturn(1_000, [1_500, -500, 1_200])).toBeNull();
    expect(calculateAnnualizedReturn(1_000, [0, 0])).toBeNull();
    expect(calculateAnnualizedReturn(0, [600, 600])).toBeNull();
  });

  it("distinguishes a modeled no-payback case from missing price data", () => {
    const state = withPv();
    state.settings.photovoltaic.annualOperatingCostEuro = 10_000;
    const economics = calculateProjectEconomics(state);
    expect(economics.investmentBaseEuro).not.toBeNull();
    expect(economics.paybackYears).toBeNull();
    expect(economics.paybackStatus).toBe("not_reached_within_horizon");
    expect(economics.irrStatus).toBe("unavailable_no_valid_irr");
    expect(economics.missingInvestmentSources).toEqual([]);
  });

  it("caps storage discharge at unmet demand and preserves annual energy balance", () => {
    const state = withStorage(withPv());
    const flow = calculateSolarEnergyFlow(8_000, 2_000, 100, state.settings);
    reconciles(flow.generationKwh, flow.directUseKwh + flow.storageChargeKwh + flow.feedInKwh);
    reconciles(flow.storageChargeKwh, flow.storageDeliveredKwh + flow.storageLossesKwh);
    reconciles(flow.demandKwh, flow.directUseKwh + flow.storageDeliveredKwh + flow.gridPurchaseKwh);
    expect(flow.gridPurchaseKwh).toBe(0);
  });

  it("reuses the heat-pump operating-cost difference and excludes funding", () => {
    const state = withHeatPump();
    const economics = calculateProjectEconomics(state);
    expect(economics.heating?.annualSavingEuro).toBe(
      state.results.heatPump?.annualOperatingCostDifferenceEuro,
    );
    expect(economics.firstYearQuantifiedEffectEuro).toBe(0);
    expect(economics.annualizedReturnPercent).toBeNull();
    expect(economics.paybackStatus).toBe("not_applicable");
    expect(economics.heating?.currentAnnualEuro).toBe(state.results.heatPump?.currentHeatingOperatingCostEuro);
    expect(economics.heating?.heatPumpAnnualEuro).toBe(state.results.heatPump?.annualHeatPumpOperatingCostEuro);
    expect(economics.heating?.savingPercent).toBeCloseTo(
      economics.heating!.annualSavingEuro! / economics.heating!.currentAnnualEuro! * 100, 2,
    );
    expect(economics.heating?.saving10YearsEuro).toBe(economics.heating!.annualSavingEuro! * 10);
    expect(economics.heating?.saving20YearsEuro).toBe(economics.heating!.annualSavingEuro! * 20);
    expect(economics.components[0]?.explanation).toContain("Förderung nicht eingerechnet");
  });

  it("does not fabricate payback for climate-only or wallbox-only projects", () => {
    const climate = calculateProjectEconomics(withClimate());
    const wallbox = calculateProjectEconomics(withWallbox());
    expect(climate.components[0]?.analysisKind).toBe("investment_only");
    expect(climate.paybackYears).toBeNull();
    expect(wallbox.components[0]?.analysisKind).toBe("investment_only");
    expect(wallbox.firstYearQuantifiedEffectEuro).toBe(0);
    expect(wallbox.paybackYears).toBeNull();
  });

  it("sums every component investment exactly once in a full project", () => {
    const state = withWallbox(withClimate(withHeatPump(withStorage(withPv()))));
    const economics = calculateProjectEconomics(state);
    const componentSum = economics.components.reduce(
      (sum, component) => sum + (component.investmentBaseEuro ?? 0),
      0,
    );
    expect(economics.components).toHaveLength(5);
    expect(economics.investmentBaseEuro).toBe(componentSum);
    expect(economics.missingInvestmentComponents).toEqual([]);
    expect(economics.missingInvestmentSources).toEqual([]);
    expect(economics.solar?.investmentEuro).toBe(
      economics.components.find((component) => component.component === "photovoltaic")!.investmentBaseEuro! +
      economics.components.find((component) => component.component === "battery_storage")!.investmentBaseEuro!,
    );
    const solarOnly = calculateProjectEconomics(withStorage(withPv()));
    expect(economics.solar).toEqual(solarOnly.solar);
    expect(economics.paybackYears).toBe(solarOnly.paybackYears);
    expect(economics.annualizedReturnPercent).toBe(solarOnly.annualizedReturnPercent);
    expect(economics.components.filter((component) => component.analysisKind === "investment_only")
      .map((component) => component.component)).toEqual(["climate", "wallbox"]);
    console.info("FULL_PROJECT_RECONCILIATION", JSON.stringify({
      pv: economics.components[0]?.investmentBaseEuro,
      storage: economics.components[1]?.investmentBaseEuro,
      solar: economics.solar?.investmentEuro,
      heatPump: economics.components[2]?.investmentBaseEuro,
      climate: economics.components[3]?.investmentBaseEuro,
      wallbox: economics.components[4]?.investmentBaseEuro,
      total: economics.investmentBaseEuro,
      solarYearOne: economics.solar?.firstYearNetBenefitEuro,
      solarPayback: economics.paybackYears,
      solarIrr: economics.annualizedReturnPercent,
      solarYear20Result: economics.finalCumulativeCashFlowEuro,
    }));
    expect(new Set(economics.components.map((component) => component.component)).size).toBe(5);
    expect(economics.scenarios.map((scenario) => scenario.id)).toEqual([
      "conservative",
      "base",
      "favorable",
    ]);
  });

  it("survives validated JSON serialization", () => {
    const economics = calculateProjectEconomics(withStorage(withPv()));
    expect(projectEconomicsSchema.parse(JSON.parse(JSON.stringify(economics)))).toEqual(economics);
  });
});
