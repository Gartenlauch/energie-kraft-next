import { describe, expect, it } from "vitest";

import { calculateHeatPumpCost } from "@/lib/calculators/heat-pump-cost";
import { heatPumpCalculatorInputSchema } from "@/lib/validation/heat-pump-calculator";
import type { HeatPumpCalculatorInput } from "@/types/heat-pump-calculator";

const validInput: HeatPumpCalculatorInput = {
  heatedAreaM2: 160,
  specificSpaceHeatingDemandKwhPerM2Year: 90,
  occupancyPersons: 4,
  hotWaterDemandKwhPerPersonYear: 800,
  annualPerformanceFactor: 3.5,
  equivalentFullLoadHours: 2_000,
  capacityReservePercent: 15,
  requiredFlowTemperatureC: 50,
  electricityPriceEuroPerKwh: 0.3,
  currentHeatingEnergyPriceEuroPerKwh: 0.12,
  currentHeatingEfficiencyPercent: 85,
  heatPumpCostEuroPerKw: 1_200,
  installationBaseCostEuro: 12_000,
  fixedAdditionalCostEuro: 3_000,
  costUncertaintyPercent: 15,
};

describe("heatPumpCalculatorInputSchema", () => {
  it("accepts valid heat pump calculator input", () => {
    const result =
      heatPumpCalculatorInputSchema.safeParse(
        validInput,
      );

    expect(result.success).toBe(true);
  });

  it("rejects invalid input ranges", () => {
    const result =
      heatPumpCalculatorInputSchema.safeParse({
        ...validInput,
        heatedAreaM2: 10,
        occupancyPersons: 0,
        annualPerformanceFactor: 1.5,
        requiredFlowTemperatureC: 90,
        costUncertaintyPercent: 60,
      });

    expect(result.success).toBe(false);
  });
});

describe("calculateHeatPumpCost", () => {
  it("calculates the default heat demand, capacity and costs", () => {
    const result = calculateHeatPumpCost(validInput);

    expect(result).toMatchObject({
      spaceHeatingDemandKwh: 14_400,
      hotWaterDemandKwh: 3_200,
      totalAnnualHeatDemandKwh: 17_600,

      requiredCapacityBeforeReserveKw: 8.8,
      requiredCapacityWithReserveKw: 10.12,
      recommendedHeatPumpCapacityKw: 10.5,

      flowTemperatureAssessment: "ntReady",
      ntReady: true,

      annualHeatPumpElectricityConsumptionKwh:
        5_028.57,

      annualHeatPumpOperatingCostEuro: 1_508.57,

      currentHeatingEnergyConsumptionKwh:
        20_705.88,

      currentHeatingOperatingCostEuro: 2_484.71,

      annualOperatingCostDifferenceEuro: 976.13,

      heatPumpEquipmentCostEuro: 12_600,
      installationBaseCostEuro: 12_000,
      fixedAdditionalCostEuro: 3_000,

      estimatedTotalCostEuro: 27_600,
      estimatedMinimumCostEuro: 23_460,
      estimatedMaximumCostEuro: 31_740,
    });
  });

  it("uses 55 degrees as the NT-ready model boundary", () => {
    const boundaryResult = calculateHeatPumpCost({
      ...validInput,
      requiredFlowTemperatureC: 55,
    });

    const aboveBoundaryResult =
      calculateHeatPumpCost({
        ...validInput,
        requiredFlowTemperatureC: 55.1,
      });

    expect(boundaryResult.ntReady).toBe(true);

    expect(
      boundaryResult.flowTemperatureAssessment,
    ).toBe("ntReady");

    expect(aboveBoundaryResult.ntReady).toBe(false);

    expect(
      aboveBoundaryResult.flowTemperatureAssessment,
    ).toBe("individualReview");
  });

  it("reduces electricity consumption when the annual performance factor increases", () => {
    const lowerEfficiency = calculateHeatPumpCost({
      ...validInput,
      annualPerformanceFactor: 3,
    });

    const higherEfficiency = calculateHeatPumpCost({
      ...validInput,
      annualPerformanceFactor: 4.5,
    });

    expect(
      higherEfficiency
        .annualHeatPumpElectricityConsumptionKwh,
    ).toBeLessThan(
      lowerEfficiency
        .annualHeatPumpElectricityConsumptionKwh,
    );

    expect(
      higherEfficiency
        .annualHeatPumpOperatingCostEuro,
    ).toBeLessThan(
      lowerEfficiency
        .annualHeatPumpOperatingCostEuro,
    );
  });

  it("increases existing heating costs when its efficiency decreases", () => {
    const efficientExistingHeating =
      calculateHeatPumpCost({
        ...validInput,
        currentHeatingEfficiencyPercent: 95,
      });

    const inefficientExistingHeating =
      calculateHeatPumpCost({
        ...validInput,
        currentHeatingEfficiencyPercent: 60,
      });

    expect(
      inefficientExistingHeating
        .currentHeatingEnergyConsumptionKwh,
    ).toBeGreaterThan(
      efficientExistingHeating
        .currentHeatingEnergyConsumptionKwh,
    );

    expect(
      inefficientExistingHeating
        .currentHeatingOperatingCostEuro,
    ).toBeGreaterThan(
      efficientExistingHeating
        .currentHeatingOperatingCostEuro,
    );
  });

  it("returns identical minimum and maximum costs when uncertainty is zero", () => {
    const result = calculateHeatPumpCost({
      ...validInput,
      costUncertaintyPercent: 0,
    });

    expect(result.estimatedMinimumCostEuro).toBe(
      result.estimatedTotalCostEuro,
    );

    expect(result.estimatedMaximumCostEuro).toBe(
      result.estimatedTotalCostEuro,
    );
  });

  it("can return a negative operating cost difference", () => {
    const result = calculateHeatPumpCost({
      ...validInput,
      electricityPriceEuroPerKwh: 0.6,
      currentHeatingEnergyPriceEuroPerKwh: 0.08,
      currentHeatingEfficiencyPercent: 95,
    });

    expect(
      result.annualOperatingCostDifferenceEuro,
    ).toBeLessThan(0);
  });
});