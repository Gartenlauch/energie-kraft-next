export const WALLBOX_SYSTEM_RECOMMENDATIONS = [
  "basicCharging",
  "standard11Kw",
  "highPowerReview",
] as const;

export type WallboxSystemRecommendation =
  (typeof WALLBOX_SYSTEM_RECOMMENDATIONS)[number];

export interface WallboxCalculatorInput {
  /**
   * Erwartete jährliche Fahrleistung.
   */
  annualDrivingKm: number;

  /**
   * Durchschnittlicher Fahrzeugverbrauch.
   */
  vehicleConsumptionKwhPer100Km: number;

  /**
   * Anteil des Fahrstroms, der zu Hause geladen wird.
   */
  homeChargingSharePercent: number;

  /**
   * Nutzbare oder verwendete Batteriekapazität.
   */
  batteryCapacityKwh: number;

  /**
   * Typischer Ladebeginn in Prozent.
   */
  startStateOfChargePercent: number;

  /**
   * Typisches Ladeziel in Prozent.
   */
  targetStateOfChargePercent: number;

  /**
   * Gewählte Ladeleistung der Wallbox.
   */
  chargingPowerKw: number;

  /**
   * Modellierter Gesamtwirkungsgrad des Ladevorgangs.
   */
  chargingEfficiencyPercent: number;

  /**
   * Angenommener Netzstrompreis.
   */
  electricityPriceEuroPerKwh: number;

  /**
   * Veränderbarer Vergleichspreis für öffentliches Laden.
   */
  publicChargingPriceEuroPerKwh: number;

  /**
   * Anteil der Heimladeenergie, der rechnerisch aus
   * Photovoltaik stammt.
   */
  pvChargingSharePercent: number;

  /**
   * Modellierter wirtschaftlicher Wert des verwendeten
   * PV-Stroms.
   */
  pvElectricityValueEuroPerKwh: number;

  /**
   * Kostenannahme für die Wallbox.
   */
  wallboxCostEuro: number;

  /**
   * Grundkosten für Montage und elektrischen Anschluss.
   */
  installationBaseCostEuro: number;

  /**
   * Weitere projektabhängige Kosten.
   */
  fixedAdditionalCostEuro: number;

  /**
   * Prozentualer Kostenkorridor.
   */
  costUncertaintyPercent: number;
}

export type WallboxNumericInputKey = {
  [Key in keyof WallboxCalculatorInput]:
    WallboxCalculatorInput[Key] extends number
      ? Key
      : never;
}[keyof WallboxCalculatorInput];

export interface WallboxCalculatorResult {
  input: WallboxCalculatorInput;

  systemRecommendation: WallboxSystemRecommendation;

  annualVehicleEnergyDemandKwh: number;

  annualHomeChargingBatteryEnergyKwh: number;
  annualHomeChargingInputEnergyKwh: number;

  annualPvChargingEnergyKwh: number;
  annualGridChargingEnergyKwh: number;

  typicalBatteryEnergyAddedKwh: number;
  typicalChargingInputEnergyKwh: number;
  typicalChargingTimeHours: number;

  annualHomeChargingCostEuro: number;
  monthlyHomeChargingCostEuro: number;

  comparablePublicChargingCostEuro: number;

  /**
   * Positiver Wert:
   * Das modellierte Heimladen ist günstiger als die
   * eingegebene öffentliche Ladepreis-Annahme.
   *
   * Negativer Wert:
   * Das modellierte Heimladen ist teurer.
   */
  annualChargingCostDifferenceEuro: number;

  wallboxCostEuro: number;
  installationBaseCostEuro: number;
  fixedAdditionalCostEuro: number;

  estimatedTotalCostEuro: number;
  estimatedMinimumCostEuro: number;
  estimatedMaximumCostEuro: number;
}