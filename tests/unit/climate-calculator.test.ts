import { describe, expect, it } from "vitest";

import { calculateClimateCost } from "@/lib/calculators/climate-cost";
import { climateCalculatorInputSchema } from "@/lib/validation/climate-calculator";
import type { ClimateCalculatorInput } from "@/types/climate-calculator";

const validInput: ClimateCalculatorInput = {
  conditionedAreaM2: 80,
  roomCount: 4,
  ceilingHeightM: 2.5,
  insulationLevel: "average",
  solarLoad: "medium",
  occupancyPersons: 4,
  internalHeatLoadWatt: 500,
  annualEquivalentFullLoadHours: 500,
  seasonalEfficiencySeer: 6.5,
  electricityPriceEuroPerKwh: 0.32,
  equipmentCostEuroPerKw: 800,
  indoorUnitCostEuro: 800,
  installationBaseCostEuro: 2_500,
  installationCostPerIndoorUnitEuro: 700,
  fixedAdditionalCostEuro: 500,
  costUncertaintyPercent: 15,
};

describe("climateCalculatorInputSchema", () => {
  it("accepts valid climate calculator input", () => {
    const result = climateCalculatorInputSchema.safeParse(validInput);

    expect(result.success).toBe(true);
  });

  it("rejects invalid input ranges", () => {
    const result = climateCalculatorInputSchema.safeParse({
      ...validInput,
      conditionedAreaM2: 5,
      roomCount: 0,
      seasonalEfficiencySeer: 2,
      costUncertaintyPercent: 51,
    });

    expect(result.success).toBe(false);
  });
});

describe("calculateClimateCost", () => {
  it("calculates the default cooling load and costs", () => {
    const result = calculateClimateCost(validInput);

    expect(result).toMatchObject({
      insulationBaseLoadWattPerM2: 80,
      solarFactor: 1,
      ceilingHeightFactor: 1,

      areaCoolingLoadKw: 6.4,
      occupancyHeatLoadKw: 0.4,
      internalHeatLoadKw: 0.5,

      calculatedCoolingLoadKw: 8.03,
      recommendedCoolingCapacityKw: 8.5,

      recommendedIndoorUnitCount: 4,
      averageCapacityPerRoomKw: 2.13,

      systemRecommendation: "multiSplit",

      annualCoolingEnergyKwh: 4_250,
      annualElectricityConsumptionKwh: 653.85,
      annualOperatingCostEuro: 209.23,

      equipmentCostEuro: 10_000,
      installationCostEuro: 5_300,
      fixedAdditionalCostEuro: 500,

      estimatedTotalCostEuro: 15_800,
      estimatedMinimumCostEuro: 13_430,
      estimatedMaximumCostEuro: 18_170,
    });
  });

  it("increases the recommendation for weak insulation and high solar load", () => {
    const favorableResult = calculateClimateCost({
      ...validInput,
      insulationLevel: "good",
      solarLoad: "low",
    });

    const unfavorableResult = calculateClimateCost({
      ...validInput,
      insulationLevel: "weak",
      solarLoad: "high",
    });

    expect(unfavorableResult.calculatedCoolingLoadKw).toBeGreaterThan(
      favorableResult.calculatedCoolingLoadKw,
    );

    expect(unfavorableResult.recommendedCoolingCapacityKw).toBeGreaterThan(
      favorableResult.recommendedCoolingCapacityKw,
    );
  });

  it("selects a system recommendation based on the room count", () => {
    const singleRoom = calculateClimateCost({
      ...validInput,
      roomCount: 1,
    });

    const threeRooms = calculateClimateCost({
      ...validInput,
      roomCount: 3,
    });

    const sixRooms = calculateClimateCost({
      ...validInput,
      roomCount: 6,
    });

    expect(singleRoom.systemRecommendation).toBe("singleSplit");

    expect(threeRooms.systemRecommendation).toBe("multiSplit");

    expect(sixRooms.systemRecommendation).toBe("projectPlanning");
  });

  it("updates annual operating costs when the electricity price changes", () => {
    const lowerPriceResult = calculateClimateCost({
      ...validInput,
      electricityPriceEuroPerKwh: 0.2,
    });

    const higherPriceResult = calculateClimateCost({
      ...validInput,
      electricityPriceEuroPerKwh: 0.4,
    });

    expect(higherPriceResult.annualOperatingCostEuro).toBeCloseTo(
      lowerPriceResult.annualOperatingCostEuro * 2,
      2,
    );
  });

  it("returns one exact cost value when uncertainty is zero", () => {
    const result = calculateClimateCost({
      ...validInput,
      costUncertaintyPercent: 0,
    });

    expect(result.estimatedMinimumCostEuro).toBe(result.estimatedTotalCostEuro);

    expect(result.estimatedMaximumCostEuro).toBe(result.estimatedTotalCostEuro);
  });
});
