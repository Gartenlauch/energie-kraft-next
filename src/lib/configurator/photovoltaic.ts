import type {
  ConfiguratorState,
  HouseholdPersons,
  PhotovoltaicConfiguratorResult,
  RoofOrientation,
} from "@/types/configurator";
import type { PvRoofOrientation } from "@/types/pv-sizing-calculator";

import {
  PV_DEFAULT_BASE_SPECIFIC_YIELD_KWH_PER_KWP,
  PV_DEFAULT_TARGET_GENERATION_COVERAGE_PERCENT,
  PV_ORIENTATION_FACTORS,
} from "@/lib/calculators/pv-model";

export const PHOTOVOLTAIC_ANNUAL_CONSUMPTION_MIN_KWH = 500;
export const PHOTOVOLTAIC_ANNUAL_CONSUMPTION_MAX_KWH = 100_000;

export const PHOTOVOLTAIC_FUTURE_INCREASE_MIN_PERCENT = 0;
export const PHOTOVOLTAIC_FUTURE_INCREASE_MAX_PERCENT = 200;

export const PHOTOVOLTAIC_HOUSEHOLD_CONSUMPTION_DEFAULTS_KWH = {
  1: 2_000,
  2: 2_500,
  3: 3_000,
  "4_5": 4_500,
} satisfies Record<HouseholdPersons, number>;

export function getPhotovoltaicHouseholdConsumptionDefault(
  persons: HouseholdPersons,
): number {
  return PHOTOVOLTAIC_HOUSEHOLD_CONSUMPTION_DEFAULTS_KWH[persons];
}

export function calculateAdditionalConsumptionKwh(
  annualConsumptionKwh: number | undefined,
  futureIncreasePercent: number,
): number | undefined {
  if (annualConsumptionKwh === undefined) {
    return undefined;
  }

  return Math.round(
    annualConsumptionKwh * (futureIncreasePercent / 100),
  );
}

export const PV_CONFIGURATOR_YIELD_UNCERTAINTY_PERCENT = 10;

const CONFIGURATOR_TO_SIZING_ORIENTATION = {
  south: "south",
  south_east_south_west: "southEastSouthWest",
  east_west: "eastWest",
  north: "north",
} satisfies Record<RoofOrientation, PvRoofOrientation>;

function roundToStep(
  value: number,
  step: number,
): number {
  return Math.round(value / step) * step;
}

function getConfiguratorOrientationFactor(
  orientation: RoofOrientation,
): number {
  const sizingOrientation =
    CONFIGURATOR_TO_SIZING_ORIENTATION[orientation];

  return PV_ORIENTATION_FACTORS[sizingOrientation];
}

export function buildPhotovoltaicConfiguratorResult(
  state: ConfiguratorState,
): PhotovoltaicConfiguratorResult | null {
  const projectedAnnualConsumptionKwh =
    state.household.projectedConsumptionKwh;

  const orientation = state.roof.orientation;

  if (
    projectedAnnualConsumptionKwh === undefined ||
    orientation === undefined
  ) {
    return null;
  }

  const orientationFactor =
    getConfiguratorOrientationFactor(orientation);

  const nominalSpecificYieldKwhPerKwp =
    PV_DEFAULT_BASE_SPECIFIC_YIELD_KWH_PER_KWP *
    orientationFactor;

  const uncertaintyFactor =
    PV_CONFIGURATOR_YIELD_UNCERTAINTY_PERCENT / 100;

  const specificYieldKwhPerKwpMin =
    nominalSpecificYieldKwhPerKwp *
    (1 - uncertaintyFactor);

  const specificYieldKwhPerKwpMax =
    nominalSpecificYieldKwhPerKwp *
    (1 + uncertaintyFactor);

  const targetAnnualGenerationKwh = Math.round(
    projectedAnnualConsumptionKwh *
    (PV_DEFAULT_TARGET_GENERATION_COVERAGE_PERCENT /
      100),
  );

  const requiredPowerKwpMin =
    targetAnnualGenerationKwh /
    specificYieldKwhPerKwpMax;

  const requiredPowerKwpMax =
    targetAnnualGenerationKwh /
    specificYieldKwhPerKwpMin;

  const recommendedPowerKwpMin = Math.max(
    1,
    Math.ceil(requiredPowerKwpMin),
  );

  const recommendedPowerKwpMax = Math.max(
    recommendedPowerKwpMin + 1,
    Math.ceil(requiredPowerKwpMax),
  );

  const estimatedAnnualYieldKwhMin =
    roundToStep(
      recommendedPowerKwpMin *
      specificYieldKwhPerKwpMin,
      100,
    );

  const estimatedAnnualYieldKwhMax =
    roundToStep(
      recommendedPowerKwpMax *
      specificYieldKwhPerKwpMax,
      100,
    );

  return {
    recommendedPowerKwpMin,
    recommendedPowerKwpMax,

    estimatedAnnualYieldKwhMin,
    estimatedAnnualYieldKwhMax,

    projectedAnnualConsumptionKwh,
    targetAnnualGenerationKwh,

    orientationFactor,

    specificYieldKwhPerKwpMin: Math.round(
      specificYieldKwhPerKwpMin,
    ),
    specificYieldKwhPerKwpMax: Math.round(
      specificYieldKwhPerKwpMax,
    ),

    batteryStorageRequested:
      state.interests.batteryStorage,

    technicalReviewRecommended:
      orientation === "north" ||
      state.roof.renovationPeriod === "before_1960",
  };
}