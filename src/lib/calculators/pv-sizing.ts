import {
  PV_ORIENTATION_FACTORS,
  PV_SHADING_FACTORS,
} from "@/lib/calculators/pv-model";
import { parsePvSizingCalculatorInput } from "@/lib/validation/pv-sizing-calculator";
import type {
  PvSizingCalculatorInput,
  PvSizingCalculatorResult,
} from "@/types/pv-sizing-calculator";



function round(value: number, fractionDigits = 2): number {
  const factor = 10 ** fractionDigits;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

/**
 * Erstellt eine unverbindliche Dimensionierungs- und
 * Kostenorientierung für eine Photovoltaikanlage.
 *
 * Modellannahmen:
 *
 * - Die Jahreserzeugung wird aus einem Basis-Jahresertrag,
 *   einem Ausrichtungsfaktor und einem Verschattungsfaktor
 *   abgeleitet.
 * - Die gewünschte PV-Erzeugung wird als Prozentsatz des
 *   Jahresstromverbrauchs angegeben.
 * - Die tatsächliche Anlagenleistung wird auf vollständige
 *   Module aufgerundet.
 * - Die Dachfläche begrenzt die maximal mögliche Modulanzahl.
 * - Die Speicherempfehlung ist eine vereinfachte Orientierung
 *   und keine technische Speicherplanung.
 * - Alle Kostenwerte beruhen auf den eingegebenen
 *   Modellannahmen.
 */
export function calculatePvSizing(input: PvSizingCalculatorInput): PvSizingCalculatorResult {
  const values = parsePvSizingCalculatorInput(input);

  const orientationFactor = PV_ORIENTATION_FACTORS[values.roofOrientation];

  const shadingFactor = PV_SHADING_FACTORS[values.shadingLevel];

  const adjustedSpecificYieldKwhPerKwp =
    values.baseSpecificYieldKwhPerKwp * orientationFactor * shadingFactor;

  const usableRoofAreaM2 = values.availableRoofAreaM2 * (values.usableRoofAreaPercent / 100);

  const maximumModuleCount = Math.floor(usableRoofAreaM2 / values.moduleAreaM2);

  if (maximumModuleCount < 1) {
    throw new Error("Auf der nutzbaren Dachfläche kann kein PV-Modul eingeplant werden.");
  }

  const maximumSystemSizeKwp = (maximumModuleCount * values.modulePowerWattPeak) / 1_000;

  const targetAnnualGenerationKwh =
    values.annualConsumptionKwh * (values.targetGenerationCoveragePercent / 100);

  const requiredSystemSizeKwp = targetAnnualGenerationKwh / adjustedSpecificYieldKwhPerKwp;

  const requiredModuleCount = Math.max(
    1,
    Math.ceil((requiredSystemSizeKwp * 1_000) / values.modulePowerWattPeak),
  );

  const recommendedModuleCount = Math.min(requiredModuleCount, maximumModuleCount);

  const recommendedSystemSizeKwp = (recommendedModuleCount * values.modulePowerWattPeak) / 1_000;

  const usedRoofAreaM2 = recommendedModuleCount * values.moduleAreaM2;

  const remainingRoofAreaM2 = Math.max(values.availableRoofAreaM2 - usedRoofAreaM2, 0);

  const roofUtilizationPercent = (usedRoofAreaM2 / values.availableRoofAreaM2) * 100;

  const expectedAnnualGenerationKwh = recommendedSystemSizeKwp * adjustedSpecificYieldKwhPerKwp;

  const generationCoveragePercent =
    (expectedAnnualGenerationKwh / values.annualConsumptionKwh) * 100;

  const averageDailyConsumptionKwh = values.annualConsumptionKwh / 365;

  const rawBatteryCapacityKwh = Math.min(
    recommendedSystemSizeKwp * values.batteryCapacityPerKwp,
    averageDailyConsumptionKwh,
  );

  const recommendedBatteryCapacityKwh = values.includeBattery
    ? Math.max(0.5, roundToStep(rawBatteryCapacityKwh, 0.5))
    : 0;

  const pvSystemCostEuro = recommendedSystemSizeKwp * values.pvCostEuroPerKwp;

  const batteryCostEuro = recommendedBatteryCapacityKwh * values.batteryCostEuroPerKwh;

  const estimatedTotalCostEuro =
    pvSystemCostEuro + batteryCostEuro + values.fixedAdditionalCostEuro;

  const uncertaintyFactor = values.costUncertaintyPercent / 100;

  const estimatedMinimumCostEuro = estimatedTotalCostEuro * (1 - uncertaintyFactor);

  const estimatedMaximumCostEuro = estimatedTotalCostEuro * (1 + uncertaintyFactor);

  return {
    input: values,

    orientationFactor: round(orientationFactor, 4),
    shadingFactor: round(shadingFactor, 4),
    adjustedSpecificYieldKwhPerKwp: round(adjustedSpecificYieldKwhPerKwp),

    usableRoofAreaM2: round(usableRoofAreaM2),
    maximumModuleCount,
    maximumSystemSizeKwp: round(maximumSystemSizeKwp),

    requiredSystemSizeKwp: round(requiredSystemSizeKwp),
    requiredModuleCount,

    recommendedModuleCount,
    recommendedSystemSizeKwp: round(recommendedSystemSizeKwp),

    usedRoofAreaM2: round(usedRoofAreaM2),
    remainingRoofAreaM2: round(remainingRoofAreaM2),
    roofUtilizationPercent: round(roofUtilizationPercent),

    expectedAnnualGenerationKwh: round(expectedAnnualGenerationKwh),

    generationCoveragePercent: round(generationCoveragePercent),

    recommendedBatteryCapacityKwh: round(recommendedBatteryCapacityKwh),

    pvSystemCostEuro: round(pvSystemCostEuro),
    batteryCostEuro: round(batteryCostEuro),

    fixedAdditionalCostEuro: round(values.fixedAdditionalCostEuro),

    estimatedTotalCostEuro: round(estimatedTotalCostEuro),

    estimatedMinimumCostEuro: round(estimatedMinimumCostEuro),

    estimatedMaximumCostEuro: round(estimatedMaximumCostEuro),

    roofLimited: requiredModuleCount > maximumModuleCount,
  };
}
