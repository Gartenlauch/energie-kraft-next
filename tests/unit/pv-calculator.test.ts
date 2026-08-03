import { describe, expect, it } from "vitest";

import { calculatePvRoi } from "@/lib/calculators/pv-roi";
import { pvCalculatorInputSchema } from "@/lib/validation/pv-calculator";
import type { PvCalculatorInput } from "@/types/pv-calculator";

const validInput: PvCalculatorInput = {
    annualConsumptionKwh: 4_500,
    systemSizeKwp: 10,
    specificYieldKwhPerKwp: 1_000,
    selfConsumptionRatePercent: 35,
    electricityPriceEuroPerKwh: 0.32,
    feedInTariffEuroPerKwh: 0.08,
    netInvestmentCostEuro: 18_000,
    annualOperatingCostEuro: 200,
    annualDegradationPercent: 0.5,
    electricityPriceIncreasePercent: 2,
    calculationYears: 20,
};

describe("pvCalculatorInputSchema", () => {
    it("accepts a valid PV calculator input", () => {
        const result = pvCalculatorInputSchema.safeParse(validInput);

        expect(result.success).toBe(true);
    });

    it("rejects invalid percentage and time values", () => {
        const result = pvCalculatorInputSchema.safeParse({
            ...validInput,
            selfConsumptionRatePercent: 101,
            calculationYears: 0,
        });

        expect(result.success).toBe(false);
    });
});

describe("calculatePvRoi", () => {
    it("calculates the first year energy and cash flow", () => {
        const result = calculatePvRoi(validInput);

        expect(result.firstYear).toMatchObject({
            year: 1,
            generationKwh: 10_000,
            selfConsumedKwh: 3_500,
            exportedKwh: 6_500,
            electricityPriceEuroPerKwh: 0.32,
            savingsEuro: 1_120,
            feedInRevenueEuro: 520,
            grossBenefitEuro: 1_640,
            operatingCostEuro: 200,
            netCashFlowEuro: 1_440,
            cumulativeCashFlowEuro: -16_560,
        });
    });

    it("limits self-consumption to the annual electricity demand", () => {
        const result = calculatePvRoi({
            ...validInput,
            annualConsumptionKwh: 2_000,
            selfConsumptionRatePercent: 80,
            calculationYears: 1,
        });

        expect(result.firstYear.selfConsumedKwh).toBe(2_000);
        expect(result.firstYear.exportedKwh).toBe(8_000);
    });

    it("calculates payback period and total ROI", () => {
        const result = calculatePvRoi(validInput);

        expect(result.paybackYears).toBe(11.83);
        expect(result.totalNetBenefitEuro).toBe(13_793.53);
        expect(result.roiPercent).toBe(76.63);
        expect(result.projections).toHaveLength(20);
    });

    it("returns no payback when the investment is not recovered", () => {
        const result = calculatePvRoi({
            ...validInput,
            netInvestmentCostEuro: 100_000,
            electricityPriceIncreasePercent: 0,
            calculationYears: 10,
        });

        expect(result.paybackYears).toBeNull();
        expect(result.totalNetBenefitEuro).toBeLessThan(0);
        expect(result.roiPercent).toBeLessThan(0);
    });

    it("applies annual degradation and electricity price growth", () => {
        const result = calculatePvRoi({
            ...validInput,
            calculationYears: 2,
        });

        const firstYear = result.projections[0];
        const secondYear = result.projections[1];

        expect(firstYear).toBeDefined();
        expect(secondYear).toBeDefined();

        expect(secondYear?.generationKwh).toBeLessThan(
            firstYear?.generationKwh ?? 0,
        );

        expect(secondYear?.electricityPriceEuroPerKwh).toBeGreaterThan(
            firstYear?.electricityPriceEuroPerKwh ?? 0,
        );
    });
});