import { z } from "zod";

import type { PvCalculatorInput } from "@/types/pv-calculator";

export const pvCalculatorInputSchema: z.ZodType<PvCalculatorInput> = z.object({
    annualConsumptionKwh: z.number().finite().positive().max(100_000),

    systemSizeKwp: z.number().finite().positive().max(1_000),

    specificYieldKwhPerKwp: z.number().finite().positive().max(2_500),

    selfConsumptionRatePercent: z.number().finite().min(0).max(100),

    electricityPriceEuroPerKwh: z.number().finite().positive().max(5),

    feedInTariffEuroPerKwh: z.number().finite().min(0).max(5),

    netInvestmentCostEuro: z.number().finite().positive().max(10_000_000),

    annualOperatingCostEuro: z.number().finite().min(0).max(1_000_000),

    annualDegradationPercent: z.number().finite().min(0).max(10),

    electricityPriceIncreasePercent: z.number().finite().min(-10).max(20),

    calculationYears: z.number().int().min(1).max(35),
});

export function parsePvCalculatorInput(
    input: unknown,
): PvCalculatorInput {
    return pvCalculatorInputSchema.parse(input);
}