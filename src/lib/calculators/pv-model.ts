import type { PvRoofOrientation, PvShadingLevel } from "@/types/pv-sizing-calculator";

export const PV_ORIENTATION_FACTORS = {
  south: 1,
  southEastSouthWest: 0.95,
  eastWest: 0.85,
  north: 0.65,
} satisfies Record<PvRoofOrientation, number>;

export const PV_SHADING_FACTORS = {
  none: 1,
  light: 0.95,
  medium: 0.85,
  strong: 0.7,
} satisfies Record<PvShadingLevel, number>;

export const PV_DEFAULT_BASE_SPECIFIC_YIELD_KWH_PER_KWP = 1_000;

export const PV_DEFAULT_TARGET_GENERATION_COVERAGE_PERCENT = 110;

/** Gemeinsame, sichtbare Kostenannahmen fuer PV und Speicher. */
export const PV_PROJECT_COST_ASSUMPTIONS = {
  pvCostEuroPerKwp: 1_500,
  batteryCostEuroPerKwh: 700,
  fixedAdditionalCostEuro: 2_000,
  costUncertaintyPercent: 15,
} as const;

export const PV_ECONOMIC_ASSUMPTIONS = {
  specificYieldKwhPerKwpFallback: 1_000,
  selfConsumptionRatePercent: 35,
  electricityPriceEuroPerKwh: 0.32,
  feedInTariffEuroPerKwh: 0.08,
  annualOperatingCostEuro: 200,
  annualDegradationPercent: 0.5,
  electricityPriceIncreasePercent: 2,
  calculationYears: 20,
} as const;

function roundEuro(value: number): number {
  return Math.round(value);
}

export function calculatePvProjectCostCorridor(powerKwpMin: number, powerKwpMax: number) {
  const assumptions = PV_PROJECT_COST_ASSUMPTIONS;
  const uncertainty = assumptions.costUncertaintyPercent / 100;
  const basePowerKwp = (powerKwpMin + powerKwpMax) / 2;

  return {
    estimatedTotalCostEuro: roundEuro(
      basePowerKwp * assumptions.pvCostEuroPerKwp + assumptions.fixedAdditionalCostEuro,
    ),
    estimatedMinimumCostEuro: roundEuro(
      (powerKwpMin * assumptions.pvCostEuroPerKwp + assumptions.fixedAdditionalCostEuro) *
        (1 - uncertainty),
    ),
    estimatedMaximumCostEuro: roundEuro(
      (powerKwpMax * assumptions.pvCostEuroPerKwp + assumptions.fixedAdditionalCostEuro) *
        (1 + uncertainty),
    ),
  };
}

export function calculateBatteryProjectCostCorridor(
  capacityKwhMin: number,
  capacityKwhMax: number,
) {
  const assumptions = PV_PROJECT_COST_ASSUMPTIONS;
  const uncertainty = assumptions.costUncertaintyPercent / 100;
  const baseCapacityKwh = (capacityKwhMin + capacityKwhMax) / 2;

  return {
    estimatedTotalCostEuro: roundEuro(baseCapacityKwh * assumptions.batteryCostEuroPerKwh),
    estimatedMinimumCostEuro: roundEuro(
      capacityKwhMin * assumptions.batteryCostEuroPerKwh * (1 - uncertainty),
    ),
    estimatedMaximumCostEuro: roundEuro(
      capacityKwhMax * assumptions.batteryCostEuroPerKwh * (1 + uncertainty),
    ),
  };
}
