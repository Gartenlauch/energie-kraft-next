import type { HouseholdPersons } from "@/types/configurator";

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