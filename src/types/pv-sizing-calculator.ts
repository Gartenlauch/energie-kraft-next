export const PV_ROOF_ORIENTATIONS = ["south", "southEastSouthWest", "eastWest", "north"] as const;

export type PvRoofOrientation = (typeof PV_ROOF_ORIENTATIONS)[number];

export const PV_SHADING_LEVELS = ["none", "light", "medium", "strong"] as const;

export type PvShadingLevel = (typeof PV_SHADING_LEVELS)[number];

export interface PvSizingCalculatorInput {
  /**
   * Aktueller oder erwarteter jährlicher Stromverbrauch.
   */
  annualConsumptionKwh: number;

  /**
   * Insgesamt verfügbare Dachfläche.
   */
  availableRoofAreaM2: number;

  /**
   * Hauptausrichtung der nutzbaren Dachfläche.
   */
  roofOrientation: PvRoofOrientation;

  /**
   * Vereinfachte Einordnung der Verschattung.
   */
  shadingLevel: PvShadingLevel;

  /**
   * Gewünschte jährliche PV-Erzeugung bezogen auf den
   * aktuellen Jahresstromverbrauch.
   */
  targetGenerationCoveragePercent: number;

  /**
   * Nennleistung eines einzelnen PV-Moduls.
   */
  modulePowerWattPeak: number;

  /**
   * Fläche eines einzelnen PV-Moduls.
   */
  moduleAreaM2: number;

  /**
   * Anteil der Dachfläche, der nach Berücksichtigung von
   * Abständen, Rändern, Fenstern und Hindernissen nutzbar ist.
   */
  usableRoofAreaPercent: number;

  /**
   * Erwarteter Jahresertrag bei optimaler Ausrichtung vor
   * Anwendung der Ausrichtungs- und Verschattungsfaktoren.
   */
  baseSpecificYieldKwhPerKwp: number;

  /**
   * Modellierter Preis der PV-Anlage je installiertem kWp.
   */
  pvCostEuroPerKwp: number;

  /**
   * Soll ein Stromspeicher in die Orientierung einbezogen werden?
   */
  includeBattery: boolean;

  /**
   * Modellierter Speicherpreis je nutzbarer kWh.
   */
  batteryCostEuroPerKwh: number;

  /**
   * Gewünschte Speichergröße je installiertem kWp.
   */
  batteryCapacityPerKwp: number;

  /**
   * Weitere angenommene Projektkosten.
   */
  fixedAdditionalCostEuro: number;

  /**
   * Prozentualer Kostenkorridor oberhalb und unterhalb
   * des errechneten Orientierungswertes.
   */
  costUncertaintyPercent: number;
}

export type PvSizingNumericInputKey = {
  [Key in keyof PvSizingCalculatorInput]: PvSizingCalculatorInput[Key] extends number ? Key : never;
}[keyof PvSizingCalculatorInput];

export interface PvSizingCalculatorResult {
  input: PvSizingCalculatorInput;

  orientationFactor: number;
  shadingFactor: number;
  adjustedSpecificYieldKwhPerKwp: number;

  usableRoofAreaM2: number;
  maximumModuleCount: number;
  maximumSystemSizeKwp: number;

  requiredSystemSizeKwp: number;
  requiredModuleCount: number;

  recommendedModuleCount: number;
  recommendedSystemSizeKwp: number;

  usedRoofAreaM2: number;
  remainingRoofAreaM2: number;
  roofUtilizationPercent: number;

  expectedAnnualGenerationKwh: number;
  generationCoveragePercent: number;

  recommendedBatteryCapacityKwh: number;

  pvSystemCostEuro: number;
  batteryCostEuro: number;
  fixedAdditionalCostEuro: number;

  estimatedTotalCostEuro: number;
  estimatedMinimumCostEuro: number;
  estimatedMaximumCostEuro: number;

  /**
   * True, wenn für die gewünschte Erzeugungsmenge mehr Module
   * erforderlich wären, als auf die nutzbare Dachfläche passen.
   */
  roofLimited: boolean;
}
