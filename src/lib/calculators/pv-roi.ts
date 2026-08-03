import { parsePvCalculatorInput } from "@/lib/validation/pv-calculator";
import type {
    PvCalculatorInput,
    PvCalculatorResult,
    PvYearProjection,
} from "@/types/pv-calculator";

function round(value: number, fractionDigits = 2): number {
    const factor = 10 ** fractionDigits;

    return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Berechnet die jährliche Energie- und Wirtschaftlichkeitsentwicklung
 * einer Photovoltaikanlage.
 *
 * Modellannahmen:
 *
 * - Der Jahresstromverbrauch bleibt über den Betrachtungszeitraum konstant.
 * - Der PV-Ertrag sinkt jährlich entsprechend der angegebenen Degradation.
 * - Der Netzstrompreis verändert sich jährlich entsprechend der
 *   Strompreissteigerung.
 * - Die Einspeisevergütung bleibt über den Zeitraum konstant.
 * - Betriebskosten bleiben nominal konstant.
 * - Finanzierungskosten, Steuern und Inflation der Betriebskosten werden
 *   in diesem Basismodell nicht berücksichtigt.
 * - Die Investitionskosten werden zu Beginn vollständig als negativer
 *   Cashflow angesetzt.
 */
export function calculatePvRoi(
    input: PvCalculatorInput,
): PvCalculatorResult {
    const values = parsePvCalculatorInput(input);

    const degradationFactor =
        1 - values.annualDegradationPercent / 100;

    const electricityPriceGrowthFactor =
        1 + values.electricityPriceIncreasePercent / 100;

    const selfConsumptionRate =
        values.selfConsumptionRatePercent / 100;

    const projections: PvYearProjection[] = [];

    let cumulativeCashFlowEuro = -values.netInvestmentCostEuro;
    let paybackYears: number | null = null;

    let totalGenerationKwh = 0;
    let totalSelfConsumedKwh = 0;
    let totalExportedKwh = 0;

    let totalSavingsEuro = 0;
    let totalFeedInRevenueEuro = 0;
    let totalGrossBenefitEuro = 0;
    let totalOperatingCostEuro = 0;
    let totalNetCashFlowEuro = 0;

    for (let yearIndex = 0; yearIndex < values.calculationYears; yearIndex += 1) {
        const year = yearIndex + 1;

        const generationKwh =
            values.systemSizeKwp *
            values.specificYieldKwhPerKwp *
            degradationFactor ** yearIndex;

        const potentialSelfConsumptionKwh =
            generationKwh * selfConsumptionRate;

        const selfConsumedKwh = Math.min(
            potentialSelfConsumptionKwh,
            values.annualConsumptionKwh,
        );

        const exportedKwh = Math.max(
            generationKwh - selfConsumedKwh,
            0,
        );

        const electricityPriceEuroPerKwh =
            values.electricityPriceEuroPerKwh *
            electricityPriceGrowthFactor ** yearIndex;

        const savingsEuro =
            selfConsumedKwh * electricityPriceEuroPerKwh;

        const feedInRevenueEuro =
            exportedKwh * values.feedInTariffEuroPerKwh;

        const grossBenefitEuro =
            savingsEuro + feedInRevenueEuro;

        const netCashFlowEuro =
            grossBenefitEuro - values.annualOperatingCostEuro;

        const previousCumulativeCashFlowEuro =
            cumulativeCashFlowEuro;

        cumulativeCashFlowEuro += netCashFlowEuro;

        if (
            paybackYears === null &&
            cumulativeCashFlowEuro >= 0 &&
            netCashFlowEuro > 0
        ) {
            const completedYears = year - 1;

            const fractionOfCurrentYear =
                Math.abs(previousCumulativeCashFlowEuro) /
                netCashFlowEuro;

            paybackYears =
                completedYears +
                Math.min(Math.max(fractionOfCurrentYear, 0), 1);
        }

        totalGenerationKwh += generationKwh;
        totalSelfConsumedKwh += selfConsumedKwh;
        totalExportedKwh += exportedKwh;

        totalSavingsEuro += savingsEuro;
        totalFeedInRevenueEuro += feedInRevenueEuro;
        totalGrossBenefitEuro += grossBenefitEuro;
        totalOperatingCostEuro += values.annualOperatingCostEuro;
        totalNetCashFlowEuro += netCashFlowEuro;

        projections.push({
            year,
            generationKwh: round(generationKwh),
            selfConsumedKwh: round(selfConsumedKwh),
            exportedKwh: round(exportedKwh),
            electricityPriceEuroPerKwh: round(
                electricityPriceEuroPerKwh,
                4,
            ),
            savingsEuro: round(savingsEuro),
            feedInRevenueEuro: round(feedInRevenueEuro),
            grossBenefitEuro: round(grossBenefitEuro),
            operatingCostEuro: round(values.annualOperatingCostEuro),
            netCashFlowEuro: round(netCashFlowEuro),
            cumulativeCashFlowEuro: round(cumulativeCashFlowEuro),
        });
    }

    const firstYear = projections[0];

    if (!firstYear) {
        throw new Error(
            "Die PV-Berechnung hat keine Jahresprojektion erzeugt.",
        );
    }

    const totalNetBenefitEuro =
        totalNetCashFlowEuro - values.netInvestmentCostEuro;

    const roiPercent =
        (totalNetBenefitEuro / values.netInvestmentCostEuro) * 100;

    return {
        input: values,

        firstYear,

        totalGenerationKwh: round(totalGenerationKwh),
        totalSelfConsumedKwh: round(totalSelfConsumedKwh),
        totalExportedKwh: round(totalExportedKwh),

        totalSavingsEuro: round(totalSavingsEuro),
        totalFeedInRevenueEuro: round(totalFeedInRevenueEuro),
        totalGrossBenefitEuro: round(totalGrossBenefitEuro),
        totalOperatingCostEuro: round(totalOperatingCostEuro),
        totalNetCashFlowEuro: round(totalNetCashFlowEuro),
        totalNetBenefitEuro: round(totalNetBenefitEuro),

        paybackYears:
            paybackYears === null
                ? null
                : round(paybackYears),

        roiPercent: round(roiPercent),

        projections,
    };
}