export interface BatteryStoragePhotovoltaicHandoff {
  source: "photovoltaic";

  projectedAnnualConsumptionKwh: number;

  recommendedPvPowerKwpMin: number;
  recommendedPvPowerKwpMax: number;

  estimatedAnnualPvYieldKwhMin: number;
  estimatedAnnualPvYieldKwhMax: number;

  batteryStorageRequested: boolean;

  technicalReviewRecommended: boolean;
}