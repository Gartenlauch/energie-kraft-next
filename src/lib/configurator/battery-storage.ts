import type {
  BatteryStorageConfiguratorResult,
  BatteryStorageGoal,
  BatteryStoragePhotovoltaicHandoff,
  ConfiguratorState,
} from "@/types/configurator";

export const BATTERY_STORAGE_ANNUAL_CONSUMPTION_MIN_KWH =
  500;

export const BATTERY_STORAGE_ANNUAL_CONSUMPTION_MAX_KWH =
  100_000;

export const BATTERY_STORAGE_PV_POWER_MIN_KWP =
  1;

export const BATTERY_STORAGE_PV_POWER_MAX_KWP =
  100;

/**
 * HTW Berlin:
 * max. 1,5 kWh nutzbare Speicherkapazität
 * je 1 kWp PV-Leistung.
 */
export const BATTERY_STORAGE_MAX_KWH_PER_KWP =
  1.5;

/**
 * HTW Berlin:
 * max. 1,5 kWh nutzbare Speicherkapazität
 * je 1.000 kWh Jahresstromverbrauch.
 */
export const BATTERY_STORAGE_MAX_KWH_PER_1000_KWH_CONSUMPTION =
  1.5;

/**
 * HTW Berlin:
 * ausreichend PV-Überschüsse sind typischerweise
 * gegeben, wenn die PV-Leistung 0,5 kW je
 * 1.000 kWh Jahresverbrauch übersteigt.
 */
export const BATTERY_STORAGE_MIN_PV_KW_PER_1000_KWH_CONSUMPTION =
  0.5;

const GOAL_FACTORS: Record<
  BatteryStorageGoal,
  number
> = {
  economic: 0.7,
  balanced: 0.9,
  high_autonomy: 1,
};

const CONSUMPTION_PATTERN_FACTORS = {
  mostly_daytime: 0.85,
  mixed: 1,
  mostly_evening: 1.05,
} as const;

interface ResolvedBatteryStorageSizingInput {
  source: "photovoltaic" | "standalone";

  annualConsumptionKwh: number;

  pvPowerKwpMin: number;
  pvPowerKwpMax: number;

  inheritedTechnicalReviewRecommended: boolean;
}

function roundToHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

function roundToTwoDecimals(
  value: number,
): number {
  return (
    Math.round(
      (value + Number.EPSILON) * 100,
    ) / 100
  );
}

export function buildBatteryStoragePhotovoltaicHandoff(
  state: ConfiguratorState,
): BatteryStoragePhotovoltaicHandoff | null {
  const photovoltaicResult =
    state.results.photovoltaic;

  if (!photovoltaicResult) {
    return null;
  }

  return {
    source: "photovoltaic",

    projectedAnnualConsumptionKwh:
      photovoltaicResult.projectedAnnualConsumptionKwh,

    recommendedPvPowerKwpMin:
      photovoltaicResult.recommendedPowerKwpMin,

    recommendedPvPowerKwpMax:
      photovoltaicResult.recommendedPowerKwpMax,

    estimatedAnnualPvYieldKwhMin:
      photovoltaicResult.estimatedAnnualYieldKwhMin,

    estimatedAnnualPvYieldKwhMax:
      photovoltaicResult.estimatedAnnualYieldKwhMax,

    batteryStorageRequested:
      photovoltaicResult.batteryStorageRequested,

    technicalReviewRecommended:
      photovoltaicResult.technicalReviewRecommended,
  };
}

function resolveBatteryStorageSizingInput(
  state: ConfiguratorState,
): ResolvedBatteryStorageSizingInput | null {
  const handoff =
    buildBatteryStoragePhotovoltaicHandoff(
      state,
    );

  if (handoff) {
    return {
      source: "photovoltaic",

      annualConsumptionKwh:
        handoff.projectedAnnualConsumptionKwh,

      pvPowerKwpMin:
        handoff.recommendedPvPowerKwpMin,

      pvPowerKwpMax:
        handoff.recommendedPvPowerKwpMax,

      inheritedTechnicalReviewRecommended:
        handoff.technicalReviewRecommended,
    };
  }

  const annualConsumptionKwh =
    state.batteryStorage.annualConsumptionKwh;

  const pvPowerKwp =
    state.batteryStorage.pvPowerKwp;

  if (
    annualConsumptionKwh === undefined ||
    pvPowerKwp === undefined
  ) {
    return null;
  }

  return {
    source: "standalone",

    annualConsumptionKwh,

    pvPowerKwpMin: pvPowerKwp,
    pvPowerKwpMax: pvPowerKwp,

    inheritedTechnicalReviewRecommended:
      false,
  };
}

export function buildBatteryStorageConfiguratorResult(
  state: ConfiguratorState,
): BatteryStorageConfiguratorResult | null {
  const sizingInput =
    resolveBatteryStorageSizingInput(
      state,
    );

  const consumptionPattern =
    state.batteryStorage.consumptionPattern;

  const backupPreference =
    state.batteryStorage.backupPreference;

  const goal =
    state.batteryStorage.goal;

  if (
    !sizingInput ||
    consumptionPattern === undefined ||
    backupPreference === undefined ||
    goal === undefined
  ) {
    return null;
  }

  const annualConsumptionInThousands =
    sizingInput.annualConsumptionKwh /
    1_000;

  const consumptionUpperBoundKwh =
    annualConsumptionInThousands *
    BATTERY_STORAGE_MAX_KWH_PER_1000_KWH_CONSUMPTION;

  const pvUpperBoundKwh =
    sizingInput.pvPowerKwpMax *
    BATTERY_STORAGE_MAX_KWH_PER_KWP;

  const technicalUpperBoundUsableCapacityKwh =
    Math.min(
      consumptionUpperBoundKwh,
      pvUpperBoundKwh,
    );

  const targetCapacityKwh =
    Math.min(
      technicalUpperBoundUsableCapacityKwh,
      technicalUpperBoundUsableCapacityKwh *
        GOAL_FACTORS[goal] *
        CONSUMPTION_PATTERN_FACTORS[
          consumptionPattern
        ],
    );

  const recommendedUsableCapacityKwhMin =
    Math.max(
      0.5,
      roundToHalf(
        targetCapacityKwh * 0.85,
      ),
    );

  const recommendedUsableCapacityKwhMax =
    Math.max(
      recommendedUsableCapacityKwhMin,
      roundToHalf(
        Math.min(
          technicalUpperBoundUsableCapacityKwh,
          targetCapacityKwh * 1.15,
        ),
      ),
    );

  const minimumPvPowerForLikelySurplus =
    annualConsumptionInThousands *
    BATTERY_STORAGE_MIN_PV_KW_PER_1000_KWH_CONSUMPTION;

  const pvSurplusLikely =
    sizingInput.pvPowerKwpMin >
    minimumPvPowerForLikelySurplus;

  const backupPowerRequested =
    backupPreference !== "none";

  const wholeHomeBackupRequested =
    backupPreference === "whole_home";

  const modularExpansionRecommended =
    state.interests.wallbox ||
    state.interests.heatPump ||
    state.interests.climate;

  const technicalReviewRecommended =
    sizingInput.inheritedTechnicalReviewRecommended ||
    !pvSurplusLikely ||
    wholeHomeBackupRequested;

  return {
    source: sizingInput.source,

    annualConsumptionKwh:
      sizingInput.annualConsumptionKwh,

    pvPowerKwpMin:
      sizingInput.pvPowerKwpMin,

    pvPowerKwpMax:
      sizingInput.pvPowerKwpMax,

    recommendedUsableCapacityKwhMin,
    recommendedUsableCapacityKwhMax,

    technicalUpperBoundUsableCapacityKwh:
      roundToTwoDecimals(
        technicalUpperBoundUsableCapacityKwh,
      ),

    consumptionPattern,
    backupPreference,
    goal,

    pvSurplusLikely,

    backupPowerRequested,
    wholeHomeBackupRequested,

    modularExpansionRecommended,

    technicalReviewRecommended,
  };
}