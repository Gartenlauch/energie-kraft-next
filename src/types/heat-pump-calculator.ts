export const HEAT_PUMP_FLOW_TEMPERATURE_ASSESSMENTS = [
  "ntReady",
  "individualReview",
] as const;

export type HeatPumpFlowTemperatureAssessment =
  (typeof HEAT_PUMP_FLOW_TEMPERATURE_ASSESSMENTS)[number];

export interface HeatPumpCalculatorInput {
  /**
   * Beheizte Wohn- oder Nutzfläche des Gebäudes.
   */
  heatedAreaM2: number;

  /**
   * Modellierter jährlicher Raumwärmebedarf je Quadratmeter.
   */
  specificSpaceHeatingDemandKwhPerM2Year: number;

  /**
   * Anzahl der Personen für die Warmwasserorientierung.
   */
  occupancyPersons: number;

  /**
   * Modellierter jährlicher Warmwasser-Wärmebedarf je Person.
   */
  hotWaterDemandKwhPerPersonYear: number;

  /**
   * Erwartete Jahresarbeitszahl der Wärmepumpe.
   */
  annualPerformanceFactor: number;

  /**
   * Modellierte äquivalente Volllaststunden zur
   * überschlägigen Leistungsdimensionierung.
   */
  equivalentFullLoadHours: number;

  /**
   * Sicherheits- und Leistungsreserve für die
   * überschlägige Wärmepumpenleistung.
   */
  capacityReservePercent: number;

  /**
   * Benötigte maximale Vorlauftemperatur des Heizsystems.
   */
  requiredFlowTemperatureC: number;

  /**
   * Angenommener Wärmepumpen-Strompreis.
   */
  electricityPriceEuroPerKwh: number;

  /**
   * Angenommener Energiepreis des bestehenden Heizsystems.
   */
  currentHeatingEnergyPriceEuroPerKwh: number;

  /**
   * Modellierter Wirkungsgrad des bestehenden Heizsystems.
   */
  currentHeatingEfficiencyPercent: number;

  /**
   * Veränderbare Kostenannahme der Wärmepumpe
   * je kW thermischer Leistung.
   */
  heatPumpCostEuroPerKw: number;

  /**
   * Modellierte Grundkosten für Installation und Einbindung.
   */
  installationBaseCostEuro: number;

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

export type HeatPumpNumericInputKey = {
  [Key in keyof HeatPumpCalculatorInput]:
    HeatPumpCalculatorInput[Key] extends number
      ? Key
      : never;
}[keyof HeatPumpCalculatorInput];

export interface HeatPumpCalculatorResult {
  input: HeatPumpCalculatorInput;

  spaceHeatingDemandKwh: number;
  hotWaterDemandKwh: number;
  totalAnnualHeatDemandKwh: number;

  requiredCapacityBeforeReserveKw: number;
  requiredCapacityWithReserveKw: number;
  recommendedHeatPumpCapacityKw: number;

  flowTemperatureAssessment: HeatPumpFlowTemperatureAssessment;
  ntReady: boolean;

  annualHeatPumpElectricityConsumptionKwh: number;
  annualHeatPumpOperatingCostEuro: number;

  currentHeatingEnergyConsumptionKwh: number;
  currentHeatingOperatingCostEuro: number;

  /**
   * Positiver Wert:
   * Das Wärmepumpenmodell besitzt niedrigere jährliche
   * Energiekosten als das bestehende Heizsystem.
   *
   * Negativer Wert:
   * Das Wärmepumpenmodell besitzt höhere jährliche
   * Energiekosten.
   */
  annualOperatingCostDifferenceEuro: number;

  heatPumpEquipmentCostEuro: number;
  installationBaseCostEuro: number;
  fixedAdditionalCostEuro: number;

  estimatedTotalCostEuro: number;
  estimatedMinimumCostEuro: number;
  estimatedMaximumCostEuro: number;
}