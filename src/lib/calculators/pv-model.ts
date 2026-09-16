import type { PvRoofOrientation, PvShadingLevel } from "@/types/pv-sizing-calculator";
import {
  DEFAULT_CONFIGURATOR_SETTINGS,
  calculateTieredCostCorridor,
  type ConfiguratorSettings,
} from "@/lib/configurator/settings-model";

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
  pvCostEuroPerKwp: 1_200,
  batteryCostEuroPerKwh: 1_000,
  fixedAdditionalCostEuro: DEFAULT_CONFIGURATOR_SETTINGS.photovoltaic.fixedAdditionalCostEuro,
  costUncertaintyPercent: DEFAULT_CONFIGURATOR_SETTINGS.general.costUncertaintyPercent,
} as const;

export const PV_ECONOMIC_ASSUMPTIONS = {
  specificYieldKwhPerKwpFallback:
    DEFAULT_CONFIGURATOR_SETTINGS.photovoltaic.specificYieldKwhPerKwpFallback,
  selfConsumptionRatePercent:
    DEFAULT_CONFIGURATOR_SETTINGS.photovoltaic.defaultSelfConsumptionPercent,
  electricityPriceEuroPerKwh:
    DEFAULT_CONFIGURATOR_SETTINGS.economics.gridElectricityPriceEuroPerKwh,
  feedInTariffEuroPerKwh: DEFAULT_CONFIGURATOR_SETTINGS.economics.feedInValueEuroPerKwh,
  annualOperatingCostEuro: DEFAULT_CONFIGURATOR_SETTINGS.photovoltaic.annualOperatingCostEuro,
  annualDegradationPercent: DEFAULT_CONFIGURATOR_SETTINGS.photovoltaic.annualDegradationPercent,
  electricityPriceIncreasePercent:
    DEFAULT_CONFIGURATOR_SETTINGS.economics.electricityPriceDevelopmentPercent,
  calculationYears: DEFAULT_CONFIGURATOR_SETTINGS.economics.projectHorizonYears,
} as const;

export function calculatePvProjectCostCorridor(
  powerKwpMin: number,
  powerKwpMax: number,
  settings: ConfiguratorSettings = DEFAULT_CONFIGURATOR_SETTINGS,
) {
  return calculateTieredCostCorridor({
    sizeMin: powerKwpMin,
    sizeMax: powerKwpMax,
    pricing: settings.photovoltaic.pricing,
    fixedAdditionalCostEuro: settings.photovoltaic.fixedAdditionalCostEuro,
    costUncertaintyPercent: settings.general.costUncertaintyPercent,
  });
}

export function calculateBatteryProjectCostCorridor(
  capacityKwhMin: number,
  capacityKwhMax: number,
  settings: ConfiguratorSettings = DEFAULT_CONFIGURATOR_SETTINGS,
) {
  return calculateTieredCostCorridor({
    sizeMin: capacityKwhMin,
    sizeMax: capacityKwhMax,
    pricing: settings.batteryStorage.pricing,
    costUncertaintyPercent: settings.general.costUncertaintyPercent,
  });
}
