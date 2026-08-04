import { describe, expect, it } from "vitest";

import { calculatePvSizing } from "@/lib/calculators/pv-sizing";
import { pvSizingCalculatorInputSchema } from "@/lib/validation/pv-sizing-calculator";
import type { PvSizingCalculatorInput } from "@/types/pv-sizing-calculator";

const validInput: PvSizingCalculatorInput = {
  annualConsumptionKwh: 4_500,
  availableRoofAreaM2: 55,
  roofOrientation: "south",
  shadingLevel: "none",
  targetGenerationCoveragePercent: 110,
  modulePowerWattPeak: 440,
  moduleAreaM2: 2,
  usableRoofAreaPercent: 80,
  baseSpecificYieldKwhPerKwp: 1_000,
  pvCostEuroPerKwp: 1_500,
  includeBattery: true,
  batteryCostEuroPerKwh: 700,
  batteryCapacityPerKwp: 1,
  fixedAdditionalCostEuro: 2_000,
  costUncertaintyPercent: 15,
};

describe("pvSizingCalculatorInputSchema", () => {
  it("accepts valid sizing input", () => {
    const result = pvSizingCalculatorInputSchema.safeParse(validInput);

    expect(result.success).toBe(true);
  });

  it("rejects invalid ranges and unusable roof area", () => {
    const result = pvSizingCalculatorInputSchema.safeParse({
      ...validInput,
      availableRoofAreaM2: 5,
      usableRoofAreaPercent: 20,
      moduleAreaM2: 4,
      costUncertaintyPercent: 51,
    });

    expect(result.success).toBe(false);
  });
});

describe("calculatePvSizing", () => {
  it("calculates the default PV sizing and costs", () => {
    const result = calculatePvSizing(validInput);

    expect(result).toMatchObject({
      orientationFactor: 1,
      shadingFactor: 1,
      adjustedSpecificYieldKwhPerKwp: 1_000,

      usableRoofAreaM2: 44,
      maximumModuleCount: 22,
      maximumSystemSizeKwp: 9.68,

      requiredSystemSizeKwp: 4.95,
      requiredModuleCount: 12,

      recommendedModuleCount: 12,
      recommendedSystemSizeKwp: 5.28,

      usedRoofAreaM2: 24,
      remainingRoofAreaM2: 31,
      roofUtilizationPercent: 43.64,

      expectedAnnualGenerationKwh: 5_280,
      generationCoveragePercent: 117.33,

      recommendedBatteryCapacityKwh: 5.5,

      pvSystemCostEuro: 7_920,
      batteryCostEuro: 3_850,
      fixedAdditionalCostEuro: 2_000,

      estimatedTotalCostEuro: 13_770,
      estimatedMinimumCostEuro: 11_704.5,
      estimatedMaximumCostEuro: 15_835.5,

      roofLimited: false,
    });
  });

  it("limits the recommendation when the roof is too small", () => {
    const result = calculatePvSizing({
      ...validInput,
      annualConsumptionKwh: 10_000,
      availableRoofAreaM2: 10,
    });

    expect(result.maximumModuleCount).toBe(4);
    expect(result.recommendedModuleCount).toBe(4);
    expect(result.recommendedSystemSizeKwp).toBe(1.76);
    expect(result.expectedAnnualGenerationKwh).toBe(1_760);
    expect(result.generationCoveragePercent).toBe(17.6);
    expect(result.roofLimited).toBe(true);
  });

  it("applies orientation and shading factors", () => {
    const result = calculatePvSizing({
      ...validInput,
      roofOrientation: "eastWest",
      shadingLevel: "medium",
    });

    expect(result.adjustedSpecificYieldKwhPerKwp).toBe(722.5);

    expect(result.requiredModuleCount).toBe(16);
    expect(result.recommendedSystemSizeKwp).toBe(7.04);

    expect(result.expectedAnnualGenerationKwh).toBe(5_086.4);

    expect(result.generationCoveragePercent).toBe(113.03);
  });

  it("removes storage capacity and storage costs when disabled", () => {
    const result = calculatePvSizing({
      ...validInput,
      includeBattery: false,
    });

    expect(result.recommendedBatteryCapacityKwh).toBe(0);
    expect(result.batteryCostEuro).toBe(0);
    expect(result.estimatedTotalCostEuro).toBe(9_920);
  });

  it("returns one exact cost value when uncertainty is zero", () => {
    const result = calculatePvSizing({
      ...validInput,
      costUncertaintyPercent: 0,
    });

    expect(result.estimatedMinimumCostEuro).toBe(result.estimatedTotalCostEuro);

    expect(result.estimatedMaximumCostEuro).toBe(result.estimatedTotalCostEuro);
  });

  it("never recommends more modules than fit on the roof", () => {
    const result = calculatePvSizing({
      ...validInput,
      annualConsumptionKwh: 100_000,
      targetGenerationCoveragePercent: 200,
    });

    expect(result.recommendedModuleCount).toBeLessThanOrEqual(result.maximumModuleCount);

    expect(result.usedRoofAreaM2).toBeLessThanOrEqual(result.usableRoofAreaM2);
  });
});
