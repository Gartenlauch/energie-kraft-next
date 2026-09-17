import type { ConfiguratorSettings } from "./configurator-settings-model.js";

export interface SolarEquipment {
  recommendedPowerKwpMin: number;
  recommendedPowerKwpMax: number;
  specificYieldKwhPerKwpMin: number;
  specificYieldKwhPerKwpMax: number;
  projectedAnnualConsumptionKwh: number;
  estimatedTotalCostEuro: number | null;
  estimatedMinimumCostEuro: number | null;
  estimatedMaximumCostEuro: number | null;
}

export interface StorageEquipment {
  recommendedUsableCapacityKwhMin: number;
  recommendedUsableCapacityKwhMax: number;
  estimatedTotalCostEuro: number | null;
  estimatedMinimumCostEuro: number | null;
  estimatedMaximumCostEuro: number | null;
}

export interface SolarEnergyFlow {
  generationKwh: number;
  demandKwh: number;
  directUseKwh: number;
  storageChargeKwh: number;
  storageDeliveredKwh: number;
  storageLossesKwh: number;
  gridPurchaseKwh: number;
  feedInKwh: number;
  selfConsumptionPercent: number;
  autarkyPercent: number;
}

export interface SolarYear {
  year: number;
  electricityCostSavingsEuro: number;
  feedInRevenueEuro: number;
  storageAdditionalBenefitEuro: number;
  operatingCostsEuro: number;
  netAnnualBenefitEuro: number | null;
  cumulativeCashFlowEuro: number | null;
}

export interface SolarEconomics {
  investmentEuro: number | null;
  storageInvestmentEuro: number | null;
  storageUsableCapacityKwh: number;
  withoutStorage: SolarEnergyFlow;
  withStorage: SolarEnergyFlow;
  storageAvoidedGridPurchaseKwh: number;
  storageReducedFeedInKwh: number;
  withoutStorageFirstYearBenefitEuro: number;
  withStorageFirstYearBenefitEuro: number;
  storageAdditionalAnnualBenefitEuro: number;
  firstYearElectricitySavingsEuro: number;
  firstYearFeedInRevenueEuro: number;
  firstYearOperatingCostsEuro: number;
  firstYearNetBenefitEuro: number;
  annualCashflows: SolarYear[];
  paybackYears: number | null;
  paybackStatus: "reached" | "not_reached_within_horizon" | "unavailable_missing_investment";
  annualizedReturnPercent: number | null;
  irrStatus: "valid" | "unavailable_missing_investment" | "unavailable_no_valid_irr";
  netSurplus20YearsEuro: number | null;
}

const round = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function calculatePayback(investment: number, annual: readonly number[]): number | null {
  if (!(investment > 0)) return null;
  let cumulative = -investment;
  for (let index = 0; index < annual.length; index += 1) {
    const previous = cumulative;
    const effect = annual[index] ?? 0;
    cumulative += effect;
    if (previous < 0 && cumulative >= 0 && effect > 0) return round(index + -previous / effect);
  }
  return null;
}

/** One real IRR for a conventional initial outflow and subsequent nonnegative inflows.
 * A later outflow introduces further sign changes, so no unique IRR is reported.
 * Negative IRR is a valid internal result when inflows do not recover the investment.
 */
export function calculateAnnualizedReturn(investment: number, annual: readonly number[]): number | null {
  if (!(investment > 0) || annual.length === 0 ||
      annual.some((value) => !Number.isFinite(value) || value < 0) ||
      annual.every((value) => value === 0)) return null;
  const npv = (rate: number) => annual.reduce(
    (sum, value, index) => sum + value / (1 + rate) ** (index + 1), -investment,
  );
  let low = -0.999999;
  let high = 1;
  if (npv(low) <= 0) return null;
  while (npv(high) > 0 && high < 1024) high *= 2;
  if (npv(high) > 0) return null;
  for (let index = 0; index < 80; index += 1) {
    const middle = (low + high) / 2;
    if (npv(middle) > 0) low = middle;
    else high = middle;
  }
  return round(((low + high) / 2) * 100);
}

export function calculateSolarEnergyFlow(
  generationKwh: number,
  demandKwh: number,
  storageCapacityKwh: number,
  settings: ConfiguratorSettings,
  selfConsumptionPercent = settings.photovoltaic.defaultSelfConsumptionPercent,
): SolarEnergyFlow {
  const generation = Math.max(0, generationKwh);
  const demand = Math.max(0, demandKwh);
  const direct = Math.min(generation * selfConsumptionPercent / 100, demand);
  const efficiency = settings.batteryStorage.roundTripEfficiencyPercent / 100;
  const charge = Math.min(
    Math.max(0, generation - direct),
    Math.max(0, storageCapacityKwh) * settings.batteryStorage.equivalentFullCyclesPerYear,
    Math.max(0, demand - direct) / efficiency,
  );
  const delivered = charge * efficiency;
  const used = direct + delivered;
  return {
    generationKwh: round(generation), demandKwh: round(demand), directUseKwh: round(direct),
    storageChargeKwh: round(charge), storageDeliveredKwh: round(delivered),
    storageLossesKwh: round(charge - delivered),
    gridPurchaseKwh: round(Math.max(0, demand - used)),
    feedInKwh: round(Math.max(0, generation - direct - charge)),
    selfConsumptionPercent: generation > 0 ? round(used / generation * 100) : 0,
    autarkyPercent: demand > 0 ? round(used / demand * 100) : 0,
  };
}

export function calculateSolarEconomics(
  pv: SolarEquipment,
  storage: StorageEquipment | undefined,
  settings: ConfiguratorSettings,
  scenario: "conservative" | "base" | "favorable" = "base",
): SolarEconomics {
  const size = scenario === "conservative" ? pv.recommendedPowerKwpMin
    : scenario === "favorable" ? pv.recommendedPowerKwpMax
      : (pv.recommendedPowerKwpMin + pv.recommendedPowerKwpMax) / 2;
  const yieldPerKwp = scenario === "conservative" ? pv.specificYieldKwhPerKwpMin
    : scenario === "favorable" ? pv.specificYieldKwhPerKwpMax
      : (pv.specificYieldKwhPerKwpMin + pv.specificYieldKwhPerKwpMax) / 2;
  const capacity = !storage ? 0 : scenario === "conservative"
    ? storage.recommendedUsableCapacityKwhMin
    : scenario === "favorable" ? storage.recommendedUsableCapacityKwhMax
      : (storage.recommendedUsableCapacityKwhMin + storage.recommendedUsableCapacityKwhMax) / 2;
  // The configured tier model already supplies a base price; the corridor bounds
  // are used only for the conservative and favorable sensitivity scenarios.
  const investmentKey = scenario === "conservative" ? "estimatedMaximumCostEuro"
    : scenario === "favorable" ? "estimatedMinimumCostEuro" : "estimatedTotalCostEuro";
  const pvInvestment = pv[investmentKey];
  const storageInvestment = storage?.[investmentKey];
  const investment = pvInvestment === null || (storage && storageInvestment == null)
    ? null : pvInvestment + (storageInvestment ?? 0);
  const generation = size * yieldPerKwp;
  const demand = pv.projectedAnnualConsumptionKwh;
  const withoutStorage = calculateSolarEnergyFlow(generation, demand, 0, settings);
  const withStorage = calculateSolarEnergyFlow(generation, demand, capacity, settings);
  let cumulative = investment === null ? null : -investment;
  const annualCashflows: SolarYear[] = [{
    year: 0, electricityCostSavingsEuro: 0, feedInRevenueEuro: 0,
    storageAdditionalBenefitEuro: 0, operatingCostsEuro: 0,
    netAnnualBenefitEuro: investment === null ? null : -investment,
    cumulativeCashFlowEuro: cumulative,
  }];
  let withoutStorageFirstYearBenefitEuro = 0;
  let storageAdditionalAnnualBenefitEuro = 0;
  for (let year = 1; year <= settings.economics.projectHorizonYears; year += 1) {
    const yearlyGeneration = generation *
      (1 - settings.photovoltaic.annualDegradationPercent / 100) ** (year - 1);
    const baseline = calculateSolarEnergyFlow(yearlyGeneration, demand, 0, settings);
    const flow = calculateSolarEnergyFlow(
      yearlyGeneration, demand,
      year <= settings.batteryStorage.economicLifetimeYears ? capacity : 0,
      settings,
    );
    const gridPrice = settings.economics.gridElectricityPriceEuroPerKwh *
      (1 + settings.economics.electricityPriceDevelopmentPercent / 100) ** (year - 1);
    const directSaving = round(baseline.directUseKwh * gridPrice);
    const baselineFeedIn = round(baseline.feedInKwh * settings.economics.feedInValueEuroPerKwh);
    const actualFeedIn = round(flow.feedInKwh * settings.economics.feedInValueEuroPerKwh);
    const storedSaving = round(flow.storageDeliveredKwh * gridPrice);
    const storageBenefit = round(storedSaving - (baselineFeedIn - actualFeedIn));
    const operating = round(settings.photovoltaic.annualOperatingCostEuro);
    const benefit = round(directSaving + storedSaving + actualFeedIn - operating);
    if (year === 1) {
      withoutStorageFirstYearBenefitEuro = round(directSaving + baselineFeedIn - operating);
      storageAdditionalAnnualBenefitEuro = storageBenefit;
    }
    if (cumulative !== null) cumulative = round(cumulative + benefit);
    annualCashflows.push({
      year, electricityCostSavingsEuro: directSaving, feedInRevenueEuro: actualFeedIn,
      storageAdditionalBenefitEuro: storedSaving, operatingCostsEuro: operating,
      netAnnualBenefitEuro: benefit, cumulativeCashFlowEuro: cumulative,
    });
  }
  const first = annualCashflows[1]!;
  const annual = annualCashflows.slice(1).map((row) => row.netAnnualBenefitEuro!);
  const paybackYears = investment === null ? null : calculatePayback(investment, annual);
  const annualizedReturnPercent = investment === null ? null : calculateAnnualizedReturn(investment, annual);
  return {
    investmentEuro: investment,
    storageInvestmentEuro: storage?.estimatedTotalCostEuro ?? null,
    storageUsableCapacityKwh: round(capacity),
    withoutStorage, withStorage,
    storageAvoidedGridPurchaseKwh: round(withoutStorage.gridPurchaseKwh - withStorage.gridPurchaseKwh),
    storageReducedFeedInKwh: round(withoutStorage.feedInKwh - withStorage.feedInKwh),
    withoutStorageFirstYearBenefitEuro,
    withStorageFirstYearBenefitEuro: first.netAnnualBenefitEuro!,
    storageAdditionalAnnualBenefitEuro,
    firstYearElectricitySavingsEuro: first.electricityCostSavingsEuro,
    firstYearFeedInRevenueEuro: first.feedInRevenueEuro,
    firstYearOperatingCostsEuro: first.operatingCostsEuro,
    firstYearNetBenefitEuro: first.netAnnualBenefitEuro!,
    annualCashflows,
    paybackYears,
    paybackStatus: investment === null ? "unavailable_missing_investment"
      : paybackYears === null ? "not_reached_within_horizon" : "reached",
    annualizedReturnPercent,
    irrStatus: investment === null ? "unavailable_missing_investment"
      : annualizedReturnPercent === null ? "unavailable_no_valid_irr" : "valid",
    netSurplus20YearsEuro: cumulative,
  };
}

export interface HeatingSavings {
  referenceSource: string;
  currentAnnualEuro: number | null;
  heatPumpAnnualEuro: number;
  annualSavingEuro: number | null;
  savingPercent: number | null;
  saving10YearsEuro: number | null;
  saving20YearsEuro: number | null;
}

export function calculateHeatingSavings(input: {
  referenceSource: string;
  currentAnnualEuro: number | null;
  heatPumpAnnualEuro: number;
  authoritativeAnnualDifferenceEuro: number | null;
}): HeatingSavings {
  const currentAnnualEuro = input.currentAnnualEuro;
  const annual = currentAnnualEuro === null ? null
    : input.authoritativeAnnualDifferenceEuro ?? round(currentAnnualEuro - input.heatPumpAnnualEuro);
  // No heating-fuel price growth assumption exists in the versioned settings.
  return {
    referenceSource: input.referenceSource,
    currentAnnualEuro,
    heatPumpAnnualEuro: input.heatPumpAnnualEuro,
    annualSavingEuro: annual,
    savingPercent: annual === null || currentAnnualEuro === null || currentAnnualEuro === 0
      ? null : round(annual / currentAnnualEuro * 100),
    saving10YearsEuro: annual === null ? null : round(annual * 10),
    saving20YearsEuro: annual === null ? null : round(annual * 20),
  };
}
