export const CLIMATE_INSULATION_LEVELS = ["good", "average", "weak"] as const;

export type ClimateInsulationLevel = (typeof CLIMATE_INSULATION_LEVELS)[number];

export const CLIMATE_SOLAR_LOADS = ["low", "medium", "high"] as const;

export type ClimateSolarLoad = (typeof CLIMATE_SOLAR_LOADS)[number];

export type ClimateSystemRecommendation = "singleSplit" | "multiSplit" | "projectPlanning";

export interface ClimateCalculatorInput {
  /**
   * Gesamte zu klimatisierende Wohn- oder Nutzfläche.
   */
  conditionedAreaM2: number;

  /**
   * Anzahl der Räume, die klimatisiert werden sollen.
   */
  roomCount: number;

  /**
   * Mittlere Raumhöhe.
   */
  ceilingHeightM: number;

  /**
   * Vereinfachte Einordnung des energetischen
   * Gebäudezustands.
   */
  insulationLevel: ClimateInsulationLevel;

  /**
   * Vereinfachte Einordnung des solaren Wärmeeintrags.
   */
  solarLoad: ClimateSolarLoad;

  /**
   * Übliche Anzahl gleichzeitig anwesender Personen.
   */
  occupancyPersons: number;

  /**
   * Zusätzliche interne Wärmelasten, beispielsweise durch
   * Computer, Geräte oder Beleuchtung.
   */
  internalHeatLoadWatt: number;

  /**
   * Modellierte jährliche äquivalente Volllaststunden
   * im Kühlbetrieb.
   */
  annualEquivalentFullLoadHours: number;

  /**
   * Saisonale Effizienz des Klimasystems.
   */
  seasonalEfficiencySeer: number;

  /**
   * Angenommener Strompreis.
   */
  electricityPriceEuroPerKwh: number;

  /**
   * Veränderbare Kostenannahme je kW Kühlleistung.
   */
  equipmentCostEuroPerKw: number;

  /**
   * Veränderbare Kostenannahme je Innengerät.
   */
  indoorUnitCostEuro: number;

  /**
   * Grundkosten der Installation.
   */
  installationBaseCostEuro: number;

  /**
   * Zusätzliche Installationskosten je Innengerät.
   */
  installationCostPerIndoorUnitEuro: number;

  /**
   * Weitere projektabhängige Kosten.
   */
  fixedAdditionalCostEuro: number;

  /**
   * Prozentualer Kostenkorridor oberhalb und unterhalb
   * des errechneten Orientierungswertes.
   */
  costUncertaintyPercent: number;
}

export type ClimateNumericInputKey = {
  [Key in keyof ClimateCalculatorInput]: ClimateCalculatorInput[Key] extends number ? Key : never;
}[keyof ClimateCalculatorInput];

export interface ClimateCalculatorResult {
  input: ClimateCalculatorInput;

  insulationBaseLoadWattPerM2: number;
  solarFactor: number;
  ceilingHeightFactor: number;

  areaCoolingLoadKw: number;
  occupancyHeatLoadKw: number;
  internalHeatLoadKw: number;

  /**
   * Überschlägige Last einschließlich einer
   * zehnprozentigen Modellreserve.
   */
  calculatedCoolingLoadKw: number;

  /**
   * Auf 0,5 kW aufgerundete Orientierungsleistung.
   */
  recommendedCoolingCapacityKw: number;

  recommendedIndoorUnitCount: number;
  averageCapacityPerRoomKw: number;

  systemRecommendation: ClimateSystemRecommendation;

  annualCoolingEnergyKwh: number;
  annualElectricityConsumptionKwh: number;
  annualOperatingCostEuro: number;

  equipmentCostEuro: number;
  installationCostEuro: number;
  fixedAdditionalCostEuro: number;

  estimatedTotalCostEuro: number;
  estimatedMinimumCostEuro: number;
  estimatedMaximumCostEuro: number;
}
