import { describe, expect, it } from "vitest";

import { calculateWallboxCost } from "@/lib/calculators/wallbox-cost";
import { wallboxCalculatorInputSchema } from "@/lib/validation/wallbox-calculator";
import type { WallboxCalculatorInput } from "@/types/wallbox-calculator";

const validInput: WallboxCalculatorInput = {
  annualDrivingKm: 15_000,
  vehicleConsumptionKwhPer100Km: 18,
  homeChargingSharePercent: 80,

  batteryCapacityKwh: 60,
  startStateOfChargePercent: 20,
  targetStateOfChargePercent: 80,

  chargingPowerKw: 11,
  chargingEfficiencyPercent: 90,

  electricityPriceEuroPerKwh: 0.32,
  publicChargingPriceEuroPerKwh: 0.59,

  pvChargingSharePercent: 30,
  pvElectricityValueEuroPerKwh: 0.08,

  wallboxCostEuro: 1_000,
  installationBaseCostEuro: 1_500,
  fixedAdditionalCostEuro: 500,
  costUncertaintyPercent: 15,
};

describe("wallboxCalculatorInputSchema", () => {
  it("accepts valid wallbox calculator input", () => {
    const result =
      wallboxCalculatorInputSchema.safeParse(validInput);

    expect(result.success).toBe(true);
  });

  it("rejects invalid ranges and an invalid charging window", () => {
    const result =
      wallboxCalculatorInputSchema.safeParse({
        ...validInput,
        annualDrivingKm: 500,
        chargingPowerKw: 1,
        startStateOfChargePercent: 80,
        targetStateOfChargePercent: 20,
      });

    expect(result.success).toBe(false);
  });
});

describe("calculateWallboxCost", () => {
  it("calculates the default charging and cost values", () => {
    const result = calculateWallboxCost(validInput);

    expect(result).toMatchObject({
      systemRecommendation: "standard11Kw",

      annualVehicleEnergyDemandKwh: 2_700,

      annualHomeChargingBatteryEnergyKwh: 2_160,
      annualHomeChargingInputEnergyKwh: 2_400,

      annualPvChargingEnergyKwh: 720,
      annualGridChargingEnergyKwh: 1_680,

      typicalBatteryEnergyAddedKwh: 36,
      typicalChargingInputEnergyKwh: 40,
      typicalChargingTimeHours: 3.64,

      annualHomeChargingCostEuro: 595.2,
      monthlyHomeChargingCostEuro: 49.6,

      comparablePublicChargingCostEuro: 1_416,
      annualChargingCostDifferenceEuro: 820.8,

      wallboxCostEuro: 1_000,
      installationBaseCostEuro: 1_500,
      fixedAdditionalCostEuro: 500,

      estimatedTotalCostEuro: 3_000,
      estimatedMinimumCostEuro: 2_550,
      estimatedMaximumCostEuro: 3_450,
    });
  });

  it("classifies the selected charging power", () => {
    const basicResult = calculateWallboxCost({
      ...validInput,
      chargingPowerKw: 3.7,
    });

    const standardResult = calculateWallboxCost({
      ...validInput,
      chargingPowerKw: 11,
    });

    const highPowerResult = calculateWallboxCost({
      ...validInput,
      chargingPowerKw: 22,
    });

    expect(basicResult.systemRecommendation).toBe(
      "basicCharging",
    );

    expect(standardResult.systemRecommendation).toBe(
      "standard11Kw",
    );

    expect(highPowerResult.systemRecommendation).toBe(
      "highPowerReview",
    );
  });

  it("reduces grid energy and charging costs when PV charging is used", () => {
    const withoutPv = calculateWallboxCost({
      ...validInput,
      pvChargingSharePercent: 0,
    });

    const withPv = calculateWallboxCost(validInput);

    expect(
      withPv.annualGridChargingEnergyKwh,
    ).toBeLessThan(
      withoutPv.annualGridChargingEnergyKwh,
    );

    expect(
      withPv.annualHomeChargingCostEuro,
    ).toBeLessThan(
      withoutPv.annualHomeChargingCostEuro,
    );
  });

  it("returns zero annual home charging values when no energy is charged at home", () => {
    const result = calculateWallboxCost({
      ...validInput,
      homeChargingSharePercent: 0,
    });

    expect(
      result.annualHomeChargingInputEnergyKwh,
    ).toBe(0);

    expect(result.annualHomeChargingCostEuro).toBe(0);

    expect(
      result.comparablePublicChargingCostEuro,
    ).toBe(0);

    expect(
      result.annualChargingCostDifferenceEuro,
    ).toBe(0);
  });

  it("reduces input energy and charging time when efficiency increases", () => {
    const lowerEfficiency = calculateWallboxCost({
      ...validInput,
      chargingEfficiencyPercent: 80,
    });

    const higherEfficiency = calculateWallboxCost({
      ...validInput,
      chargingEfficiencyPercent: 95,
    });

    expect(
      higherEfficiency.typicalChargingInputEnergyKwh,
    ).toBeLessThan(
      lowerEfficiency.typicalChargingInputEnergyKwh,
    );

    expect(
      higherEfficiency.typicalChargingTimeHours,
    ).toBeLessThan(
      lowerEfficiency.typicalChargingTimeHours,
    );
  });

  it("returns identical minimum and maximum costs when uncertainty is zero", () => {
    const result = calculateWallboxCost({
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
});