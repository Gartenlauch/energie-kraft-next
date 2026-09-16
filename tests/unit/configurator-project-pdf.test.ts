import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { generateConfiguratorProjectPdf } from "../../functions/src/configurator-project-pdf";
import { configuratorLeadPayloadSchema } from "../../functions/src/configurator-lead-validation";
import { applyAuthoritativeConfiguratorModel } from "../../functions/src/configurator-server-model";
import { DEFAULT_CONFIGURATOR_SETTINGS } from "@/lib/configurator/settings-model";
import { buildBatteryStorageConfiguratorResult } from "@/lib/configurator/battery-storage";
import { buildClimateConfiguratorResult } from "@/lib/configurator/climate";
import { buildHeatPumpConfiguratorResult } from "@/lib/configurator/heat-pump";
import { buildConfiguratorLeadInput } from "@/lib/configurator/lead";
import { buildPhotovoltaicConfiguratorResult } from "@/lib/configurator/photovoltaic";
import {
  createInitialConfiguratorState,
  normalizeConfiguratorState,
} from "@/lib/configurator/state";
import { buildWallboxConfiguratorResult } from "@/lib/configurator/wallbox";
import type { ConfiguratorState } from "@/types/configurator";

function baseJourney(entryPoint: "photovoltaic" | "heat_pump") {
  return {
    entryPoint,
    selectedProducts: [],
    completedProducts: [],
    additionalSolutionsReviewed: true,
  };
}

function createPvOnlyProject(): ConfiguratorState {
  const state: ConfiguratorState = {
    ...createInitialConfiguratorState(),
    activeConfigurator: "photovoltaic",
    journey: baseJourney("photovoltaic"),
    household: {
      persons: 3,
      annualConsumptionKwh: 4_500,
      futureIncreasePercent: 10,
      projectedConsumptionKwh: 4_950,
    },
    building: { ownership: "owner", type: "detached_house" },
    roof: {
      pitch: 30,
      material: "roof_tile",
      orientation: "south",
      renovationPeriod: "after_1990",
    },
    notes: { hasNotes: false },
  };
  const photovoltaic = buildPhotovoltaicConfiguratorResult(state);
  if (!photovoltaic) throw new Error("PV fixture failed");
  return normalizeConfiguratorState({ ...state, results: { photovoltaic } });
}

function createHeatPumpOnlyProject(): ConfiguratorState {
  const state: ConfiguratorState = {
    ...createInitialConfiguratorState(),
    activeConfigurator: "heat_pump",
    journey: baseJourney("heat_pump"),
    heatPump: {
      existingHeatingSystem: "oil",
      annualOilConsumptionLitres: 2_000,
      heatedAreaM2: 160,
      specificSpaceHeatingDemandKwhPerM2Year: 90,
      occupancyPersons: 4,
      requiredFlowTemperatureC: 50,
      annualPerformanceFactor: 3.5,
    },
  };
  const heatPump = buildHeatPumpConfiguratorResult(state);
  if (!heatPump) throw new Error("Heat-pump fixture failed");
  return normalizeConfiguratorState({ ...state, results: { heatPump } });
}

function createPvStorageProject(): ConfiguratorState {
  const state: ConfiguratorState = {
    ...createPvOnlyProject(),
    interests: { ...createPvOnlyProject().interests, batteryStorage: true },
    batteryStorage: {
      consumptionPattern: "mixed",
      backupPreference: "selected_loads",
      goal: "balanced",
    },
  };
  const batteryStorage = buildBatteryStorageConfiguratorResult(state);
  if (!batteryStorage) throw new Error("Storage fixture failed");
  return normalizeConfiguratorState({
    ...state,
    results: { ...state.results, batteryStorage },
  });
}

function createCompleteProject(): ConfiguratorState {
  let state: ConfiguratorState = {
    ...createPvOnlyProject(),
    interests: {
      photovoltaic: false,
      batteryStorage: true,
      wallbox: true,
      heatPump: true,
      climate: true,
    },
    batteryStorage: {
      consumptionPattern: "mixed",
      backupPreference: "selected_loads",
      goal: "balanced",
    },
    heatPump: {
      existingHeatingSystem: "gas",
      heatedAreaM2: 160,
      specificSpaceHeatingDemandKwhPerM2Year: 90,
      occupancyPersons: 4,
      requiredFlowTemperatureC: 50,
      annualPerformanceFactor: 3.5,
    },
    climate: {
      conditionedAreaM2: 80,
      roomCount: 4,
      insulationLevel: "average",
      solarLoad: "medium",
      occupancyPersons: 4,
    },
    wallbox: {
      annualDrivingKm: 15_000,
      vehicleConsumptionKwhPer100Km: 18,
      batteryCapacityKwh: 60,
      homeChargingSharePercent: 80,
      chargingPowerKw: 11,
      pvChargingSharePercent: 30,
    },
  };
  const photovoltaic = state.results.photovoltaic;
  if (!photovoltaic) throw new Error("PV result missing");
  const batteryStorage = buildBatteryStorageConfiguratorResult(state);
  const heatPump = buildHeatPumpConfiguratorResult(state);
  const climate = buildClimateConfiguratorResult(state);
  const wallbox = buildWallboxConfiguratorResult(state);
  if (!batteryStorage || !heatPump || !climate || !wallbox) {
    throw new Error("Project fixture failed");
  }
  state = {
    ...state,
    results: { photovoltaic, batteryStorage, heatPump, climate, wallbox },
  };
  return normalizeConfiguratorState(state);
}

function buildPdfLead(state: ConfiguratorState) {
  const input = buildConfiguratorLeadInput(
    state,
    {
      firstName: "Max",
      lastName: "Mustermann",
      email: "max@example.de",
      phone: "",
      installationAtResidence: true,
      street: "Musterstraße 1",
      postalCode: "83395",
      city: "Freilassing",
      privacyAccepted: true,
      website: "",
    },
    Date.now() - 10_000,
  );
  if (!input) throw new Error("Lead fixture failed");
  return configuratorLeadPayloadSchema.parse(input);
}

describe("premium configurator project PDF", () => {
  it("keeps the submitted and authoritative project economics aligned", () => {
    const lead = buildPdfLead(createCompleteProject());
    const authoritative = applyAuthoritativeConfiguratorModel(lead, DEFAULT_CONFIGURATOR_SETTINGS);

    expect(authoritative.economics.investmentBaseEuro).toBe(lead.economics.investmentBaseEuro);
    expect(authoritative.economics.firstYearQuantifiedEffectEuro)
      .toBe(lead.economics.firstYearQuantifiedEffectEuro);
    expect(authoritative.economics.projections).toEqual(lead.economics.projections);
    expect(authoritative.economics.scenarios).toEqual(lead.economics.scenarios);
  });

  it("recomputes manipulated client pricing and economics from the authoritative snapshot", () => {
    const lead = buildPdfLead(createPvOnlyProject());
    const photovoltaic = lead.configurators[0];
    if (!photovoltaic || photovoltaic.type !== "photovoltaic") throw new Error("PV fixture missing");
    photovoltaic.result.estimatedTotalCostEuro = 1;
    photovoltaic.result.estimatedMinimumCostEuro = 1;
    photovoltaic.result.estimatedMaximumCostEuro = 1;
    lead.economics.firstYearQuantifiedEffectEuro = 999_999;
    lead.economics.projections = [
      { year: 0, quantifiedEconomicEffectEuro: 999_999, cumulativeCashFlowEuro: 999_999 },
    ];

    const authoritative = applyAuthoritativeConfiguratorModel(lead, DEFAULT_CONFIGURATOR_SETTINGS);
    const authoritativePv = authoritative.configurators[0];
    expect(authoritativePv?.result.estimatedTotalCostEuro).not.toBe(1);
    expect(authoritative.economics.firstYearQuantifiedEffectEuro).not.toBe(999_999);
    expect(authoritative.economics.projections).toHaveLength(21);
  });

  it("derives PV and storage sizing from answers, not manipulated client results", () => {
    const lead = buildPdfLead(createPvStorageProject());
    const photovoltaic = lead.configurators.find((item) => item.type === "photovoltaic");
    const storage = lead.configurators.find((item) => item.type === "battery_storage");
    if (!photovoltaic || !storage) throw new Error("PV/storage fixture missing");
    photovoltaic.answers.household.projectedConsumptionKwh = 100_000;
    photovoltaic.result.recommendedPowerKwpMin = 1;
    photovoltaic.result.recommendedPowerKwpMax = 1;
    photovoltaic.result.estimatedAnnualYieldKwhMax = 100_000;
    storage.result.recommendedUsableCapacityKwhMin = 0.5;
    storage.result.recommendedUsableCapacityKwhMax = 0.5;

    const authoritative = applyAuthoritativeConfiguratorModel(lead, DEFAULT_CONFIGURATOR_SETTINGS);
    const authoritativePv = authoritative.configurators.find((item) => item.type === "photovoltaic");
    const authoritativeStorage = authoritative.configurators.find((item) => item.type === "battery_storage");
    if (!authoritativePv || !authoritativeStorage) throw new Error("Canonical result missing");
    expect(authoritativePv.result.projectedAnnualConsumptionKwh).toBe(4_950);
    expect(authoritativePv.answers.household.projectedConsumptionKwh).toBe(4_950);
    expect(authoritativePv.result.recommendedPowerKwpMin).toBeGreaterThan(1);
    expect(authoritativeStorage.result.recommendedUsableCapacityKwhMin).toBeGreaterThan(0.5);
    expect(authoritativeStorage.result.pvPowerKwpMin).toBe(authoritativePv.result.recommendedPowerKwpMin);
  });

  it("derives heating, cooling and charging from answers instead of browser results", () => {
    const lead = buildPdfLead(createCompleteProject());
    const heatPump = lead.configurators.find((item) => item.type === "heat_pump");
    const climate = lead.configurators.find((item) => item.type === "climate");
    const wallbox = lead.configurators.find((item) => item.type === "wallbox");
    if (!heatPump || !climate || !wallbox) throw new Error("Complete fixture missing");
    heatPump.result.recommendedHeatPumpCapacityKw = 0.1;
    heatPump.result.annualHeatPumpElectricityConsumptionKwh = 0;
    climate.result.recommendedCoolingCapacityKw = 0.1;
    climate.result.annualElectricityConsumptionKwh = 0;
    wallbox.result.annualHomeChargingInputEnergyKwh = 0;
    wallbox.result.annualGridChargingEnergyKwh = 0;
    lead.economics.limitations = [];

    const authoritative = applyAuthoritativeConfiguratorModel(lead, DEFAULT_CONFIGURATOR_SETTINGS);
    const canonicalHeatPump = authoritative.configurators.find((item) => item.type === "heat_pump");
    const canonicalClimate = authoritative.configurators.find((item) => item.type === "climate");
    const canonicalWallbox = authoritative.configurators.find((item) => item.type === "wallbox");
    expect(canonicalHeatPump?.result.recommendedHeatPumpCapacityKw).toBeGreaterThan(0.1);
    expect(canonicalHeatPump?.result.annualHeatPumpElectricityConsumptionKwh).toBeGreaterThan(0);
    expect(canonicalClimate?.result.recommendedCoolingCapacityKw).toBeGreaterThan(0.1);
    expect(canonicalClimate?.result.annualElectricityConsumptionKwh).toBeGreaterThan(0);
    expect(canonicalWallbox?.result.annualHomeChargingInputEnergyKwh).toBeGreaterThan(0);
    expect(canonicalWallbox?.result.annualGridChargingEnergyKwh).toBeGreaterThan(0);
    expect(authoritative.economics.limitations).toHaveLength(3);
  });

  it("renders a valid complete-project dossier and creates the visual-QA file", async () => {
    const pdf = await generateConfiguratorProjectPdf({
      leadId: "PV-BS-WP-KA-WB-00005",
      lead: buildPdfLead(createCompleteProject()),
    });
    writeFileSync(path.join(tmpdir(), "energie-kraft-sprint9-project-analysis-review.pdf"), pdf);

    expect(pdf.length).toBeGreaterThan(30_000);
    expect(pdf.subarray(0, 4).toString("ascii")).toBe("%PDF");
    expect(pdf.toString("latin1").match(/\/Type \/Page\b/g)?.length ?? 0).toBeGreaterThan(8);
  });

  it.each([
    ["PV only", createPvOnlyProject],
    ["PV and storage", createPvStorageProject],
    ["heat pump only", createHeatPumpOnlyProject],
  ])("renders a valid %s dossier", async (_label, createProject) => {
    const pdf = await generateConfiguratorProjectPdf({
      leadId: "must-not-be-visible",
      lead: buildPdfLead(createProject()),
    });
    expect(pdf.length).toBeGreaterThan(25_000);
    expect(pdf.subarray(0, 4).toString("ascii")).toBe("%PDF");
  });
});
