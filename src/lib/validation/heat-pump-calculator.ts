import { z } from "zod";

import type { HeatPumpCalculatorInput } from "@/types/heat-pump-calculator";

export const heatPumpCalculatorInputSchema: z.ZodType<HeatPumpCalculatorInput> =
  z.object({
    heatedAreaM2: z
      .number()
      .finite()
      .min(20)
      .max(5_000),

    specificSpaceHeatingDemandKwhPerM2Year: z
      .number()
      .finite()
      .min(10)
      .max(400),

    occupancyPersons: z
      .number()
      .int()
      .min(1)
      .max(100),

    hotWaterDemandKwhPerPersonYear: z
      .number()
      .finite()
      .min(0)
      .max(3_000),

    annualPerformanceFactor: z
      .number()
      .finite()
      .min(2)
      .max(7),

    equivalentFullLoadHours: z
      .number()
      .finite()
      .min(1_000)
      .max(3_500),

    capacityReservePercent: z
      .number()
      .finite()
      .min(0)
      .max(50),

    requiredFlowTemperatureC: z
      .number()
      .finite()
      .min(25)
      .max(80),

    electricityPriceEuroPerKwh: z
      .number()
      .finite()
      .min(0.01)
      .max(2),

    currentHeatingEnergyPriceEuroPerKwh: z
      .number()
      .finite()
      .min(0.01)
      .max(2),

    currentHeatingEfficiencyPercent: z
      .number()
      .finite()
      .min(30)
      .max(100),

    heatPumpCostEuroPerKw: z
      .number()
      .finite()
      .min(200)
      .max(10_000),

    installationBaseCostEuro: z
      .number()
      .finite()
      .min(0)
      .max(1_000_000),

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
  });

export function parseHeatPumpCalculatorInput(
  input: unknown,
): HeatPumpCalculatorInput {
  return heatPumpCalculatorInputSchema.parse(input);
}