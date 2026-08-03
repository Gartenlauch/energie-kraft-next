export interface PvCalculatorInput {
  /**
   * Jährlicher Stromverbrauch des Haushalts oder Betriebs.
   */
  annualConsumptionKwh: number;

  /**
   * Installierte Nennleistung der Photovoltaikanlage.
   */
  systemSizeKwp: number;

  /**
   * Erwarteter Jahresertrag je installiertem kWp.
   */
  specificYieldKwhPerKwp: number;

  /**
   * Anteil des erzeugten Solarstroms, der direkt selbst verbraucht wird.
   */
  selfConsumptionRatePercent: number;

  /**
   * Aktueller Bezugspreis für Netzstrom.
   */
  electricityPriceEuroPerKwh: number;

  /**
   * Vergütung für in das Stromnetz eingespeisten Solarstrom.
   */
  feedInTariffEuroPerKwh: number;

  /**
   * Investitionskosten nach bereits berücksichtigten Förderungen.
   */
  netInvestmentCostEuro: number;

  /**
   * Erwartete jährliche Betriebs-, Wartungs- und Versicherungskosten.
   */
  annualOperatingCostEuro: number;

  /**
   * Jährlicher prozentualer Leistungsverlust der PV-Anlage.
   */
  annualDegradationPercent: number;

  /**
   * Erwartete jährliche Veränderung des Netzstrompreises.
   */
  electricityPriceIncreasePercent: number;

  /**
   * Betrachtungszeitraum der Wirtschaftlichkeitsberechnung.
   */
  calculationYears: number;
}

export interface PvYearProjection {
  year: number;

  generationKwh: number;
  selfConsumedKwh: number;
  exportedKwh: number;

  electricityPriceEuroPerKwh: number;

  savingsEuro: number;
  feedInRevenueEuro: number;
  grossBenefitEuro: number;
  operatingCostEuro: number;
  netCashFlowEuro: number;

  /**
   * Kumulierter Cashflow einschließlich der anfänglichen Investition.
   */
  cumulativeCashFlowEuro: number;
}

export interface PvCalculatorResult {
  input: PvCalculatorInput;

  firstYear: PvYearProjection;

  totalGenerationKwh: number;
  totalSelfConsumedKwh: number;
  totalExportedKwh: number;

  totalSavingsEuro: number;
  totalFeedInRevenueEuro: number;
  totalGrossBenefitEuro: number;
  totalOperatingCostEuro: number;

  /**
   * Summe aller jährlichen Netto-Cashflows vor Abzug der Investition.
   */
  totalNetCashFlowEuro: number;

  /**
   * Wirtschaftliches Gesamtergebnis nach Abzug der Investition.
   */
  totalNetBenefitEuro: number;

  /**
   * Amortisationsdauer inklusive eines anteiligen Jahres.
   * Null bedeutet, dass innerhalb des Betrachtungszeitraums
   * keine Amortisation erreicht wird.
   */
  paybackYears: number | null;

  /**
   * Gesamtrendite bezogen auf die anfängliche Nettoinvestition.
   */
  roiPercent: number;

  projections: readonly PvYearProjection[];
}