import type {
  BatteryStorageConfiguratorResult,
  BatteryStoragePhotovoltaicHandoff,
  ConfiguratorState,
} from "@/types/configurator";
import { deriveBatteryStorageResult } from "../../../functions/src/configurator-technical-model";

export {
  BATTERY_STORAGE_MAX_KWH_PER_KWP,
  BATTERY_STORAGE_MAX_KWH_PER_1000_KWH_CONSUMPTION,
  BATTERY_STORAGE_MIN_PV_KW_PER_1000_KWH_CONSUMPTION,
} from "../../../functions/src/configurator-technical-model";

export const BATTERY_STORAGE_ANNUAL_CONSUMPTION_MIN_KWH = 500;
export const BATTERY_STORAGE_ANNUAL_CONSUMPTION_MAX_KWH = 100_000;
export const BATTERY_STORAGE_PV_POWER_MIN_KWP = 1;
export const BATTERY_STORAGE_PV_POWER_MAX_KWP = 100;

export function buildBatteryStoragePhotovoltaicHandoff(
  state: ConfiguratorState,
): BatteryStoragePhotovoltaicHandoff | null {
  const photovoltaicResult = state.results.photovoltaic;
  if (!photovoltaicResult) return null;
  return {
    source: "photovoltaic",
    projectedAnnualConsumptionKwh: photovoltaicResult.projectedAnnualConsumptionKwh,
    recommendedPvPowerKwpMin: photovoltaicResult.recommendedPowerKwpMin,
    recommendedPvPowerKwpMax: photovoltaicResult.recommendedPowerKwpMax,
    estimatedAnnualPvYieldKwhMin: photovoltaicResult.estimatedAnnualYieldKwhMin,
    estimatedAnnualPvYieldKwhMax: photovoltaicResult.estimatedAnnualYieldKwhMax,
    batteryStorageRequested: photovoltaicResult.batteryStorageRequested,
    technicalReviewRecommended: photovoltaicResult.technicalReviewRecommended,
  };
}

export function buildBatteryStorageConfiguratorResult(
  state: ConfiguratorState,
): BatteryStorageConfiguratorResult | null {
  const { annualConsumptionKwh, pvPowerKwp, consumptionPattern, backupPreference, goal } =
    state.batteryStorage;
  if (
    consumptionPattern === undefined ||
    backupPreference === undefined ||
    goal === undefined ||
    (!state.results.photovoltaic &&
      (annualConsumptionKwh === undefined || pvPowerKwp === undefined))
  ) {
    return null;
  }
  return deriveBatteryStorageResult(
    { annualConsumptionKwh, pvPowerKwp, consumptionPattern, backupPreference, goal },
    state.results.photovoltaic,
    state.interests.wallbox || state.interests.heatPump || state.interests.climate,
    state.settings,
  );
}
