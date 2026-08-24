import type {
  BatteryStoragePhotovoltaicHandoff,
  ConfiguratorState,
} from "@/types/configurator";

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