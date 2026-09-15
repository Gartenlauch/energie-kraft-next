import { describe, expect, it } from "vitest";
import { buildBatteryStorageConfiguratorResult } from "@/lib/configurator/battery-storage";
import { buildClimateConfiguratorResult } from "@/lib/configurator/climate";
import { buildHeatPumpConfiguratorResult } from "@/lib/configurator/heat-pump";
import { buildPhotovoltaicConfiguratorResult } from "@/lib/configurator/photovoltaic";
import { calculateProjectEconomics } from "@/lib/configurator/project-economics";
import { createInitialConfiguratorState } from "@/lib/configurator/state";
import { buildWallboxConfiguratorResult } from "@/lib/configurator/wallbox";
import { projectEconomicsSchema } from "@/lib/validation/configurator/economics";
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
  it("models PV only with its configurator-specific investment", () => {
    const economics = calculateProjectEconomics(withPv());
    expect(economics.components).toHaveLength(1);
    expect(economics.components[0]?.component).toBe("photovoltaic");
    expect(economics.investmentBaseEuro).not.toBe(18_000);
    expect(economics.projections).toHaveLength(21);
  });

  it("models storage as an incremental PV-surplus benefit", () => {
    const economics = calculateProjectEconomics(withStorage(withPv()));
    const pv = economics.components.find((component) => component.component === "photovoltaic");
    const storage = economics.components.find(
      (component) => component.component === "battery_storage",
    );
    expect(storage?.firstYearEconomicEffectEuro).toBeGreaterThan(0);
    expect(storage?.firstYearEconomicEffectEuro).toBeLessThan(pv?.firstYearEconomicEffectEuro ?? 0);
    expect(storage?.explanation).toContain("zusätzliche");
  });

  it("reuses the heat-pump operating-cost difference and excludes funding", () => {
    const state = withHeatPump();
    const economics = calculateProjectEconomics(state);
    expect(economics.firstYearQuantifiedEffectEuro).toBe(
      state.results.heatPump?.annualOperatingCostDifferenceEuro,
    );
    expect(economics.components[0]?.explanation).toContain("Förderung nicht eingerechnet");
  });

  it("does not fabricate payback for climate-only or wallbox-only projects", () => {
    const climate = calculateProjectEconomics(withClimate());
    const wallbox = calculateProjectEconomics(withWallbox());
    expect(climate.components[0]?.analysisKind).toBe("operating_cost");
    expect(climate.paybackYears).toBeNull();
    expect(wallbox.components[0]?.analysisKind).toBe("investment_only");
    expect(wallbox.firstYearQuantifiedEffectEuro).toBe(0);
    expect(wallbox.paybackYears).toBeNull();
  });

  it("sums every component investment exactly once in a full project", () => {
    const state = withWallbox(withClimate(withHeatPump(withStorage(withPv()))));
    const economics = calculateProjectEconomics(state);
    const componentSum = economics.components.reduce(
      (sum, component) => sum + component.investmentBaseEuro,
      0,
    );
    expect(economics.components).toHaveLength(5);
    expect(economics.investmentBaseEuro).toBe(componentSum);
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
