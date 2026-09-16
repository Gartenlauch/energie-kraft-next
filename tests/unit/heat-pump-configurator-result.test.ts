import { describe, expect, it } from "vitest";

import { buildHeatPumpConfiguratorResult } from "@/lib/configurator/heat-pump";
import { configuratorReducer, createInitialConfiguratorState } from "@/lib/configurator/state";
import type { ExistingHeatingSystem, HeatPumpConfiguratorState } from "@/types/configurator";

function createCompleteHeatPumpState(
  existingHeatingSystem: ExistingHeatingSystem = "gas",
  consumption: Partial<HeatPumpConfiguratorState> = {},
) {
  return configuratorReducer(createInitialConfiguratorState(), {
    type: "UPDATE_HEAT_PUMP",
    payload: {
      existingHeatingSystem,
      heatedAreaM2: 160,
      specificSpaceHeatingDemandKwhPerM2Year: 90,
      occupancyPersons: 4,
      requiredFlowTemperatureC: 50,
      annualPerformanceFactor: 3.5,
      ...consumption,
    },
  });
}

describe("heat pump configurator result", () => {
  it("returns null while required data is incomplete", () => {
    expect(buildHeatPumpConfiguratorResult(createInitialConfiguratorState())).toBeNull();
  });

  it("uses the centralized gas baseline and fallback heat demand", () => {
    const result = buildHeatPumpConfiguratorResult(createCompleteHeatPumpState("gas"));
    expect(result).toMatchObject({
      recommendedHeatPumpCapacityKw: 10.5,
      totalAnnualHeatDemandKwh: 17_600,
      annualHeatPumpOperatingCostEuro: 1_508.57,
      currentHeatingOperatingCostEuro: 2_484.71,
      annualOperatingCostDifferenceEuro: 976.13,
      heatingComparisonKind: "existing_system",
      heatingComparisonBasis: "modeled_heat_demand",
      heatingComparisonLabel: "Gasheizung",
      comparisonFuelPriceEuroPerUnit: 0.12,
      comparisonEfficiencyPercent: 85,
    });
  });

  it("uses the centralized oil baseline and exposes the litre conversion", () => {
    const result = buildHeatPumpConfiguratorResult(createCompleteHeatPumpState("oil"));
    expect(result).toMatchObject({
      currentHeatingOperatingCostEuro: 2_420,
      annualOperatingCostDifferenceEuro: 911.43,
      heatingComparisonLabel: "Ölheizung",
      heatingComparisonBasis: "modeled_heat_demand",
      comparisonFuelPriceEuroPerUnit: 1.1,
      comparisonFuelUnit: "litre",
      comparisonEfficiencyPercent: 80,
      oilEnergyContentKwhPerLitre: 10,
    });
  });

  it("labels a new build as an explicit oil reference scenario", () => {
    const result = buildHeatPumpConfiguratorResult(createCompleteHeatPumpState("new_build"));
    expect(result).toMatchObject({
      heatingComparisonKind: "reference_scenario",
      heatingComparisonBasis: "modeled_heat_demand",
      heatingComparisonLabel: "Modelliertes Referenzszenario: Öl-Zentralheizung",
      currentHeatingOperatingCostEuro: 2_420,
    });
  });

  it("does not fabricate an existing-system saving when the heating system is unknown", () => {
    const result = buildHeatPumpConfiguratorResult(createCompleteHeatPumpState("other_unknown"));
    expect(result).toMatchObject({
      heatingComparisonKind: "unavailable",
      heatingComparisonBasis: "unavailable",
      currentHeatingOperatingCostEuro: null,
      annualOperatingCostDifferenceEuro: null,
    });
  });

  it("prefers actual gas and oil consumption when supplied", () => {
    const gas = buildHeatPumpConfiguratorResult(
      createCompleteHeatPumpState("gas", { annualGasConsumptionKwh: 20_000 }),
    );
    const oil = buildHeatPumpConfiguratorResult(
      createCompleteHeatPumpState("oil", { annualOilConsumptionLitres: 2_000 }),
    );
    expect(gas).toMatchObject({
      currentHeatingOperatingCostEuro: 2_400,
      annualOperatingCostDifferenceEuro: 891.43,
      heatingComparisonBasis: "user_consumption",
    });
    expect(oil).toMatchObject({
      currentHeatingOperatingCostEuro: 2_200,
      annualOperatingCostDifferenceEuro: 691.43,
      heatingComparisonBasis: "user_consumption",
    });
  });

  it("keeps the existing technical assessment behavior", () => {
    let state = createCompleteHeatPumpState();
    state = configuratorReducer(state, {
      type: "UPDATE_HEAT_PUMP",
      payload: { requiredFlowTemperatureC: 60 },
    });
    const result = buildHeatPumpConfiguratorResult(state);
    expect(result?.flowTemperatureAssessment).toBe("individualReview");
    expect(result?.technicalReviewRecommended).toBe(true);
  });

  it("invalidates an existing result after changing input data", () => {
    let state = createCompleteHeatPumpState();
    const result = buildHeatPumpConfiguratorResult(state);
    if (!result) throw new Error("Expected heat pump result.");
    state = configuratorReducer(state, { type: "SET_HEAT_PUMP_RESULT", payload: result });
    state = configuratorReducer(state, {
      type: "UPDATE_HEAT_PUMP",
      payload: { heatedAreaM2: 180 },
    });
    expect(state.results.heatPump).toBeUndefined();
  });
});
