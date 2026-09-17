import type { ConfiguratorSettings } from "./configurator-settings-model.js";
import {
  calculateHeatingSavings,
  calculateSolarEconomics,
  calculateSolarEnergyFlow,
  type HeatingSavings,
  type SolarEconomics,
  type SolarEquipment,
  type StorageEquipment,
} from "./configurator-solar-economics.ts";

export type ComponentId = "photovoltaic" | "battery_storage" | "heat_pump" | "climate" | "wallbox";
export type InvestmentSource = "photovoltaic.pricing" | "batteryStorage.pricing" | "heatPump" | "climate" | "wallbox";
export type EconomicScenarioId = "conservative" | "base" | "favorable";
export type EconomicValueSource = "user_input" | "modeled" | "default_assumption";
export interface ProjectCostSummary {
  investmentMinEuro: number | null;
  investmentBaseEuro: number | null;
  investmentMaxEuro: number | null;
}
export interface ComponentEconomics extends ProjectCostSummary {
  component: ComponentId;
  investmentSource: InvestmentSource;
  pricingMode: "modeled" | "individual_quote_required";
  analysisKind: "economic_effect" | "operating_cost" | "investment_only";
  firstYearEconomicEffectEuro: number;
  economicLifetimeYears: number;
  explanation: string;
}
export interface ProjectYearProjection {
  year: number;
  quantifiedEconomicEffectEuro: number;
  cumulativeCashFlowEuro: number;
}
export interface ProjectEconomicScenario extends ProjectCostSummary {
  id: EconomicScenarioId;
  firstYearQuantifiedEffectEuro: number;
  paybackYears: number | null;
  paybackStatus: SolarEconomics["paybackStatus"] | "not_applicable";
  annualizedReturnPercent: number | null;
  irrStatus: SolarEconomics["irrStatus"] | "not_applicable";
  finalCumulativeCashFlowEuro: number | null;
}
export interface EconomicAssumption {
  key: string;
  label: string;
  value: string;
  source: EconomicValueSource;
}
export interface ProjectEconomicsResult extends ProjectCostSummary {
  pricingMode: "modeled" | "individual_quote_required";
  modeledComponentsInvestmentMinEuro: number;
  modeledComponentsInvestmentBaseEuro: number;
  modeledComponentsInvestmentMaxEuro: number;
  missingInvestmentComponents: ComponentId[];
  missingInvestmentSources: InvestmentSource[];
  horizonYears: number;
  firstYearQuantifiedEffectEuro: number;
  paybackYears: number | null;
  paybackStatus: SolarEconomics["paybackStatus"] | "not_applicable";
  annualizedReturnPercent: number | null;
  irrStatus: SolarEconomics["irrStatus"] | "not_applicable";
  finalCumulativeCashFlowEuro: number | null;
  solar: SolarEconomics | null;
  heating: HeatingSavings | null;
  components: ComponentEconomics[];
  projections: ProjectYearProjection[];
  scenarios: ProjectEconomicScenario[];
  assumptions: EconomicAssumption[];
  limitations: string[];
}

interface CostResult {
  estimatedTotalCostEuro: number | null;
  estimatedMinimumCostEuro: number | null;
  estimatedMaximumCostEuro: number | null;
  pricingMode?: "modeled" | "individual_quote_required";
}
interface StorageResult extends StorageEquipment, CostResult {
  annualConsumptionKwh: number;
  pvPowerKwpMin: number;
  pvPowerKwpMax: number;
}
interface HeatPumpResult extends CostResult {
  heatingComparisonLabel: string;
  currentHeatingOperatingCostEuro: number | null;
  annualHeatPumpOperatingCostEuro: number;
  annualOperatingCostDifferenceEuro: number | null;
  comparisonFuelPriceEuroPerUnit: number | null;
  comparisonFuelUnit: "kWh" | "litre" | null;
  comparisonEfficiencyPercent: number | null;
  oilEnergyContentKwhPerLitre: number | null;
}
export interface EconomicProducts {
  photovoltaic?: SolarEquipment & CostResult;
  batteryStorage?: StorageResult;
  heatPump?: HeatPumpResult;
  climate?: CostResult;
  wallbox?: CostResult;
}

const round = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
const investmentSources: Record<ComponentId, InvestmentSource> = {
  photovoltaic: "photovoltaic.pricing",
  battery_storage: "batteryStorage.pricing",
  heat_pump: "heatPump",
  climate: "climate",
  wallbox: "wallbox",
};
type InvestmentKey = keyof ProjectCostSummary;

function knownSum(components: readonly ComponentEconomics[], key: InvestmentKey): number {
  return round(components.reduce((sum, component) => sum + (component[key] ?? 0), 0));
}

function completeSum(components: readonly ComponentEconomics[], key: InvestmentKey): number | null {
  return components.some((component) => component[key] === null) ? null : knownSum(components, key);
}

function standaloneStorageEffect(storage: StorageResult, settings: ConfiguratorSettings): number {
  const generation = (storage.pvPowerKwpMin + storage.pvPowerKwpMax) / 2 *
    settings.photovoltaic.specificYieldKwhPerKwpFallback;
  const capacity = (storage.recommendedUsableCapacityKwhMin + storage.recommendedUsableCapacityKwhMax) / 2;
  const before = calculateSolarEnergyFlow(generation, storage.annualConsumptionKwh, 0, settings);
  const after = calculateSolarEnergyFlow(generation, storage.annualConsumptionKwh, capacity, settings);
  return round(
    after.storageDeliveredKwh * settings.economics.gridElectricityPriceEuroPerKwh -
    (before.feedInKwh - after.feedInKwh) * settings.economics.feedInValueEuroPerKwh,
  );
}

export function calculateCanonicalProjectEconomics(
  products: EconomicProducts,
  settings: ConfiguratorSettings,
): ProjectEconomicsResult {
  const solar = products.photovoltaic
    ? calculateSolarEconomics(products.photovoltaic, products.batteryStorage, settings)
    : null;
  const heating = products.heatPump ? calculateHeatingSavings({
    referenceSource: products.heatPump.heatingComparisonLabel,
    currentAnnualEuro: products.heatPump.currentHeatingOperatingCostEuro,
    heatPumpAnnualEuro: products.heatPump.annualHeatPumpOperatingCostEuro,
    authoritativeAnnualDifferenceEuro: products.heatPump.annualOperatingCostDifferenceEuro,
  }) : null;
  const components: ComponentEconomics[] = [];
  const add = (
    component: ComponentId, result: CostResult, analysisKind: ComponentEconomics["analysisKind"],
    firstYearEconomicEffectEuro: number, explanation: string,
  ) => components.push({
    component,
    investmentSource: investmentSources[component],
    pricingMode: result.pricingMode ?? "modeled",
    analysisKind,
    investmentMinEuro: result.estimatedMinimumCostEuro,
    investmentBaseEuro: result.estimatedTotalCostEuro,
    investmentMaxEuro: result.estimatedMaximumCostEuro,
    firstYearEconomicEffectEuro,
    economicLifetimeYears: component === "battery_storage"
      ? settings.batteryStorage.economicLifetimeYears : settings.economics.projectHorizonYears,
    explanation,
  });
  if (products.photovoltaic) add(
    "photovoltaic", products.photovoltaic, "economic_effect",
    solar?.withoutStorageFirstYearBenefitEuro ?? 0,
    "Direkt genutzter Solarstrom und Einspeisung abzüglich modellierter Betriebskosten.",
  );
  if (products.batteryStorage) add(
    "battery_storage", products.batteryStorage, "economic_effect",
    solar?.storageAdditionalAnnualBenefitEuro ?? standaloneStorageEffect(products.batteryStorage, settings),
    "Nur der zusätzliche Wert verschobener PV-Überschüsse nach Speicherverlusten und entgangener Einspeisung.",
  );
  if (products.heatPump) add(
    "heat_pump", products.heatPump,
    heating?.annualSavingEuro === null ? "operating_cost" : "economic_effect",
    heating?.annualSavingEuro ?? -products.heatPump.annualHeatPumpOperatingCostEuro,
    heating?.annualSavingEuro === null
      ? "Wärmepumpen-Betriebskosten ohne verfügbaren Heizkostenvergleich; Förderung nicht eingerechnet."
      : `Differenz zwischen ${products.heatPump.heatingComparisonLabel} und Wärmepumpenmodell; Förderung nicht eingerechnet.`,
  );
  if (products.climate) add(
    "climate", products.climate, "investment_only", 0,
    "Komfortinvestition ohne Einsparungs-, Amortisations- oder Renditemodell.",
  );
  if (products.wallbox) add(
    "wallbox", products.wallbox, "investment_only", 0,
    "Ladeinfrastruktur ohne Einsparungs-, Amortisations- oder Renditemodell.",
  );
  const missingInvestmentComponents = components
    .filter((component) => component.investmentBaseEuro === null)
    .map((component) => component.component);
  const missingInvestmentSources = components
    .filter((component) => component.investmentBaseEuro === null)
    .map((component) => component.investmentSource);
  const investmentMinEuro = completeSum(components, "investmentMinEuro");
  const investmentBaseEuro = completeSum(components, "investmentBaseEuro");
  const investmentMaxEuro = completeSum(components, "investmentMaxEuro");
  const projections: ProjectYearProjection[] = solar?.investmentEuro === null || !solar ? []
    : solar.annualCashflows.map((row) => ({
      year: row.year,
      quantifiedEconomicEffectEuro: row.year === 0 ? 0 : row.netAnnualBenefitEuro ?? 0,
      cumulativeCashFlowEuro: row.cumulativeCashFlowEuro!,
    }));
  const scenarios: ProjectEconomicScenario[] = (["conservative", "base", "favorable"] as const)
    .map((id) => {
      const scenarioSolar = products.photovoltaic
        ? id === "base" ? solar : calculateSolarEconomics(
          products.photovoltaic, products.batteryStorage, settings, id,
        ) : null;
      return {
        id,
        investmentMinEuro,
        investmentBaseEuro,
        investmentMaxEuro,
        firstYearQuantifiedEffectEuro: scenarioSolar?.firstYearNetBenefitEuro ?? 0,
        paybackYears: scenarioSolar?.paybackYears ?? null,
        paybackStatus: scenarioSolar?.paybackStatus ?? "not_applicable",
        annualizedReturnPercent: scenarioSolar?.annualizedReturnPercent ?? null,
        irrStatus: scenarioSolar?.irrStatus ?? "not_applicable",
        finalCumulativeCashFlowEuro: scenarioSolar?.netSurplus20YearsEuro ?? null,
      };
    });
  const heat = products.heatPump;
  const heatPumpAssumptions: EconomicAssumption[] = heat ? [
    { key: "heating_comparison", label: "Heizungsvergleich", value: heat.heatingComparisonLabel, source: "user_input" },
    ...(heat.comparisonFuelPriceEuroPerUnit === null ? [] : [{
      key: "heating_fuel_price", label: heat.comparisonFuelUnit === "litre" ? "Heizölpreis im Modell" : "Gaspreis im Modell",
      value: `${heat.comparisonFuelPriceEuroPerUnit.toLocaleString("de-DE")} €/${heat.comparisonFuelUnit === "litre" ? "Liter" : "kWh"}`,
      source: "default_assumption" as const,
    }]),
    ...(heat.comparisonEfficiencyPercent === null ? [] : [{
      key: "heating_efficiency", label: "Wirkungsgrad Vergleichsheizung",
      value: `${heat.comparisonEfficiencyPercent} %`, source: "default_assumption" as const,
    }]),
    ...(heat.oilEnergyContentKwhPerLitre === null ? [] : [{
      key: "oil_energy_content", label: "Heizöl-Umrechnung",
      value: `${heat.oilEnergyContentKwhPerLitre} kWh/Liter`, source: "default_assumption" as const,
    }]),
  ] : [];
  return {
    horizonYears: settings.economics.projectHorizonYears,
    pricingMode: missingInvestmentComponents.length ? "individual_quote_required" : "modeled",
    modeledComponentsInvestmentMinEuro: knownSum(components, "investmentMinEuro"),
    modeledComponentsInvestmentBaseEuro: knownSum(components, "investmentBaseEuro"),
    modeledComponentsInvestmentMaxEuro: knownSum(components, "investmentMaxEuro"),
    missingInvestmentComponents,
    missingInvestmentSources,
    investmentMinEuro, investmentBaseEuro, investmentMaxEuro,
    firstYearQuantifiedEffectEuro: solar?.firstYearNetBenefitEuro ?? 0,
    paybackYears: solar?.paybackYears ?? null,
    paybackStatus: solar?.paybackStatus ?? "not_applicable",
    annualizedReturnPercent: solar?.annualizedReturnPercent ?? null,
    irrStatus: solar?.irrStatus ?? "not_applicable",
    finalCumulativeCashFlowEuro: solar?.netSurplus20YearsEuro ?? null,
    solar, heating, components, projections, scenarios,
    assumptions: [
      { key: "settings_version", label: "Modellversion", value: `${settings.version}`, source: "modeled" },
      { key: "electricity_price", label: "Netzstrompreis", value: `${settings.economics.gridElectricityPriceEuroPerKwh.toLocaleString("de-DE")} €/kWh`, source: "default_assumption" },
      { key: "feed_in", label: "Einspeisewert", value: `${settings.economics.feedInValueEuroPerKwh.toLocaleString("de-DE")} €/kWh`, source: "default_assumption" },
      { key: "price_growth", label: "Strompreisentwicklung", value: `${settings.economics.electricityPriceDevelopmentPercent.toLocaleString("de-DE")} %/Jahr`, source: "default_assumption" },
      { key: "pv_degradation", label: "PV-Degradation", value: `${settings.photovoltaic.annualDegradationPercent.toLocaleString("de-DE")} %/Jahr`, source: "default_assumption" },
      { key: "storage_efficiency", label: "Speicherwirkungsgrad", value: `${settings.batteryStorage.roundTripEfficiencyPercent.toLocaleString("de-DE")} %`, source: "default_assumption" },
      { key: "storage_lifetime", label: "Speicherhorizont", value: `${settings.batteryStorage.economicLifetimeYears} Jahre`, source: "default_assumption" },
      { key: "project_horizon", label: "Projektbetrachtung", value: `${settings.economics.projectHorizonYears} Jahre`, source: "modeled" },
      ...heatPumpAssumptions,
    ],
    limitations: [
      "Jahresmodell ohne stündliche Lastgangsimulation oder doppelte Solarertragszählung.",
      "Finanzierung, Steuern und Förderung sind nicht eingerechnet.",
      "Heizkosteneinsparungen sind bei konstanten Jahreskosten separat modelliert.",
    ],
  };
}
