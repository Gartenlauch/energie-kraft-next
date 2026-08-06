import { z } from "zod";

import type { WallboxCalculatorInput } from "@/types/wallbox-calculator";

export const wallboxCalculatorInputSchema = z
  .object({
    annualDrivingKm: z
      .number()
      .finite()
      .min(1_000)
      .max(100_000),

    vehicleConsumptionKwhPer100Km: z
      .number()
      .finite()
      .min(8)
      .max(50),

    homeChargingSharePercent: z
      .number()
      .finite()
      .min(0)
      .max(100),

    batteryCapacityKwh: z
      .number()
      .finite()
      .min(10)
      .max(250),

    startStateOfChargePercent: z
      .number()
      .finite()
      .min(0)
      .max(99),

    targetStateOfChargePercent: z
      .number()
      .finite()
      .min(1)
      .max(100),

    chargingPowerKw: z
      .number()
      .finite()
      .min(2.3)
      .max(22),

    chargingEfficiencyPercent: z
      .number()
      .finite()
      .min(70)
      .max(100),

    electricityPriceEuroPerKwh: z
      .number()
      .finite()
      .min(0.01)
      .max(2),

    publicChargingPriceEuroPerKwh: z
      .number()
      .finite()
      .min(0.01)
      .max(3),

    pvChargingSharePercent: z
      .number()
      .finite()
      .min(0)
      .max(100),

    pvElectricityValueEuroPerKwh: z
      .number()
      .finite()
      .min(0)
      .max(2),

    wallboxCostEuro: z
      .number()
      .finite()
      .min(0)
      .max(20_000),

    installationBaseCostEuro: z
      .number()
      .finite()
      .min(0)
      .max(100_000),

    fixedAdditionalCostEuro: z
      .number()
      .finite()
      .min(0)
      .max(1_000_000),

    costUncertaintyPercent: z
      .number()
      .finite()
      .min(0)
      .max(50),
  })
  .superRefine((values, context) => {
    if (
      values.targetStateOfChargePercent <=
      values.startStateOfChargePercent
    ) {
      context.addIssue({
        code: "custom",
        path: ["targetStateOfChargePercent"],
        message:
          "Das Ladeziel muss über dem Ladebeginn liegen.",
      });
    }
  });

export function parseWallboxCalculatorInput(
  input: unknown,
): WallboxCalculatorInput {
  return wallboxCalculatorInputSchema.parse(input);
}