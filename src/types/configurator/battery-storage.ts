export type BatteryStorageConsumptionPattern =
  | "mostly_daytime"
  | "mixed"
  | "mostly_evening";

export type BatteryStorageGoal =
  | "economic"
  | "balanced"
  | "high_autonomy";

export type BatteryStorageBackupPreference =
  | "none"
  | "selected_loads"
  | "whole_home";

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

export interface BatteryStorageConfiguratorState {
  /**
   * Nur für einen eigenständigen Einstieg ohne
   * vorhandenes PV-Ergebnis.
   *
   * PV-Handoff-Werte werden hier bewusst NICHT kopiert.
   */
  annualConsumptionKwh?: number;
  pvPowerKwp?: number;

  consumptionPattern?: BatteryStorageConsumptionPattern;

  backupPreference?: BatteryStorageBackupPreference;

  goal?: BatteryStorageGoal;
}

export interface BatteryStorageConfiguratorResult {
  source: "photovoltaic" | "standalone";

  annualConsumptionKwh: number;

  pvPowerKwpMin: number;
  pvPowerKwpMax: number;

  recommendedUsableCapacityKwhMin: number;
  recommendedUsableCapacityKwhMax: number;

  technicalUpperBoundUsableCapacityKwh: number;

  consumptionPattern: BatteryStorageConsumptionPattern;
  backupPreference: BatteryStorageBackupPreference;
  goal: BatteryStorageGoal;

  pvSurplusLikely: boolean;

  backupPowerRequested: boolean;
  wholeHomeBackupRequested: boolean;

  modularExpansionRecommended: boolean;

  technicalReviewRecommended: boolean;
}