import { calculatePvRoi } from "@/lib/calculators/pv-roi";
import type {
  ComponentEconomics,
  ConfiguratorState,
  EconomicScenarioId,
  ProjectEconomicScenario,
  ProjectEconomicsResult,
} from "@/types/configurator";

function round(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function getPaybackYears(investmentEuro: number, annualEffects: readonly number[]): number | null {
  let cumulative = -investmentEuro;
  for (let index = 0; index < annualEffects.length; index += 1) {
    const effect = annualEffects[index] ?? 0;
    const previous = cumulative;
    cumulative += effect;
    if (previous < 0 && cumulative >= 0 && effect > 0) {
      return round(index + Math.abs(previous) / effect);
    }
  }
  return null;
}

function buildPvEffects(state: ConfiguratorState, scenario: EconomicScenarioId): number[] {
  const settings = state.settings;
  const result = state.results.photovoltaic;
  if (!result || result.pricingMode !== "modeled") {
    return Array(settings.economics.projectHorizonYears).fill(0) as number[];
  }

  const isConservative = scenario === "conservative";
  const isFavorable = scenario === "favorable";
  const systemSizeKwp = isConservative
    ? result.recommendedPowerKwpMin
    : isFavorable
      ? result.recommendedPowerKwpMax
      : (result.recommendedPowerKwpMin + result.recommendedPowerKwpMax) / 2;
  const specificYieldKwhPerKwp = isConservative
    ? result.specificYieldKwhPerKwpMin
    : isFavorable
      ? result.specificYieldKwhPerKwpMax
      : (result.specificYieldKwhPerKwpMin + result.specificYieldKwhPerKwpMax) / 2;
  const investment = isConservative
    ? result.estimatedMaximumCostEuro
    : isFavorable
      ? result.estimatedMinimumCostEuro
      : result.estimatedTotalCostEuro;
  if (investment === null) return Array(settings.economics.projectHorizonYears).fill(0) as number[];

  return calculatePvRoi({
    annualConsumptionKwh: result.projectedAnnualConsumptionKwh,
    systemSizeKwp,
    specificYieldKwhPerKwp,
    selfConsumptionRatePercent:
      settings.photovoltaic.defaultSelfConsumptionPercent +
      (isConservative ? -5 : isFavorable ? 5 : 0),
    electricityPriceEuroPerKwh: settings.economics.gridElectricityPriceEuroPerKwh,
    feedInTariffEuroPerKwh: settings.economics.feedInValueEuroPerKwh,
    netInvestmentCostEuro: investment,
    annualOperatingCostEuro: settings.photovoltaic.annualOperatingCostEuro,
    annualDegradationPercent: settings.photovoltaic.annualDegradationPercent,
    electricityPriceIncreasePercent: settings.economics.electricityPriceDevelopmentPercent,
    calculationYears: settings.economics.projectHorizonYears,
  }).projections.map((projection) => projection.netCashFlowEuro);
}

function getStorageFirstYearEffect(state: ConfiguratorState): number {
  const storage = state.results.batteryStorage;
  if (!storage) return 0;
  const pv = state.results.photovoltaic;
  const generationKwh = pv
    ? (pv.estimatedAnnualYieldKwhMin + pv.estimatedAnnualYieldKwhMax) / 2
    : ((storage.pvPowerKwpMin + storage.pvPowerKwpMax) / 2) *
      state.settings.photovoltaic.specificYieldKwhPerKwpFallback;
  const directUseKwh = Math.min(
    generationKwh * (state.settings.photovoltaic.defaultSelfConsumptionPercent / 100),
    storage.annualConsumptionKwh,
  );
  const availableSurplusKwh = Math.max(generationKwh - directUseKwh, 0);
  const usableCapacityKwh =
    (storage.recommendedUsableCapacityKwhMin + storage.recommendedUsableCapacityKwhMax) / 2;
  const chargedEnergyKwh = Math.min(
    availableSurplusKwh,
    usableCapacityKwh * state.settings.batteryStorage.equivalentFullCyclesPerYear,
  );
  const deliveredEnergyKwh =
    chargedEnergyKwh * (state.settings.batteryStorage.roundTripEfficiencyPercent / 100);
  return round(
    deliveredEnergyKwh * state.settings.economics.gridElectricityPriceEuroPerKwh -
      chargedEnergyKwh * state.settings.economics.feedInValueEuroPerKwh,
  );
}

function buildComponentEconomics(state: ConfiguratorState): ComponentEconomics[] {
  const components: ComponentEconomics[] = [];
  const horizon = state.settings.economics.projectHorizonYears;
  const pv = state.results.photovoltaic;
  if (pv) {
    components.push({
      component: "photovoltaic",
      pricingMode: pv.pricingMode,
      analysisKind: "economic_effect",
      investmentMinEuro: pv.estimatedMinimumCostEuro,
      investmentBaseEuro: pv.estimatedTotalCostEuro,
      investmentMaxEuro: pv.estimatedMaximumCostEuro,
      firstYearEconomicEffectEuro: buildPvEffects(state, "base")[0] ?? 0,
      economicLifetimeYears: horizon,
      explanation: "Direkt genutzter Solarstrom plus Einspeisung, abzüglich modellierter Betriebskosten.",
    });
  }
  const storage = state.results.batteryStorage;
  if (storage) {
    components.push({
      component: "battery_storage",
      pricingMode: storage.pricingMode,
      analysisKind: "economic_effect",
      investmentMinEuro: storage.estimatedMinimumCostEuro,
      investmentBaseEuro: storage.estimatedTotalCostEuro,
      investmentMaxEuro: storage.estimatedMaximumCostEuro,
      firstYearEconomicEffectEuro: getStorageFirstYearEffect(state),
      economicLifetimeYears: state.settings.batteryStorage.economicLifetimeYears,
      explanation: "Nur der zusätzliche Wert verschobener PV-Überschüsse nach Speicherverlusten und entgangener Einspeisung.",
    });
  }
  const heatPump = state.results.heatPump;
  if (heatPump) {
    const hasComparison = heatPump.annualOperatingCostDifferenceEuro !== null;
    components.push({
      component: "heat_pump",
      pricingMode: "modeled",
      analysisKind: hasComparison ? "economic_effect" : "operating_cost",
      investmentMinEuro: heatPump.estimatedMinimumCostEuro,
      investmentBaseEuro: heatPump.estimatedTotalCostEuro,
      investmentMaxEuro: heatPump.estimatedMaximumCostEuro,
      firstYearEconomicEffectEuro:
        heatPump.annualOperatingCostDifferenceEuro ?? -heatPump.annualHeatPumpOperatingCostEuro,
      economicLifetimeYears: horizon,
      explanation: hasComparison
        ? `Differenz zwischen ${heatPump.heatingComparisonLabel} und Wärmepumpenmodell; Förderung nicht eingerechnet.`
        : "Wärmepumpen-Betriebskosten ohne erfundenen Vergleich zum unbekannten Heizsystem; Förderung nicht eingerechnet.",
    });
  }
  const climate = state.results.climate;
  if (climate) {
    components.push({
      component: "climate",
      pricingMode: "modeled",
      analysisKind: "operating_cost",
      investmentMinEuro: climate.estimatedMinimumCostEuro,
      investmentBaseEuro: climate.estimatedTotalCostEuro,
      investmentMaxEuro: climate.estimatedMaximumCostEuro,
      firstYearEconomicEffectEuro: -climate.annualOperatingCostEuro,
      economicLifetimeYears: horizon,
      explanation: "Betriebskostenanalyse ohne erfundene Einsparung oder Amortisation.",
    });
  }
  const wallbox = state.results.wallbox;
  if (wallbox) {
    components.push({
      component: "wallbox",
      pricingMode: "modeled",
      analysisKind: "investment_only",
      investmentMinEuro: wallbox.estimatedMinimumCostEuro,
      investmentBaseEuro: wallbox.estimatedTotalCostEuro,
      investmentMaxEuro: wallbox.estimatedMaximumCostEuro,
      firstYearEconomicEffectEuro: 0,
      economicLifetimeYears: horizon,
      explanation: "Investition und Ladebetrieb werden gezeigt; ein Wallbox-ROI wird nicht unterstellt.",
    });
  }
  return components;
}

function buildAnnualEffects(
  state: ConfiguratorState,
  components: readonly ComponentEconomics[],
  scenario: EconomicScenarioId,
): number[] {
  const pvEffects = buildPvEffects(state, scenario);
  const factor = scenario === "conservative" ? 0.9 : scenario === "favorable" ? 1.1 : 1;
  const growth = 1 + state.settings.economics.electricityPriceDevelopmentPercent / 100;
  return Array.from({ length: state.settings.economics.projectHorizonYears }, (_, index) => {
    let effect = pvEffects[index] ?? 0;
    for (const component of components) {
      if (component.component === "photovoltaic" || component.component === "wallbox") continue;
      if (index >= component.economicLifetimeYears) continue;
      const baseEffect = component.firstYearEconomicEffectEuro * growth ** index;
      effect += baseEffect > 0 ? baseEffect * factor : baseEffect;
    }
    return round(effect);
  });
}

type InvestmentKey = "investmentMinEuro" | "investmentBaseEuro" | "investmentMaxEuro";

function sumKnownInvestment(components: readonly ComponentEconomics[], key: InvestmentKey): number {
  return round(components.reduce((sum, component) => sum + (component[key] ?? 0), 0));
}

function sumCompleteInvestment(
  components: readonly ComponentEconomics[],
  key: InvestmentKey,
): number | null {
  return components.some((component) => component[key] === null)
    ? null
    : sumKnownInvestment(components, key);
}

function buildScenario(
  id: EconomicScenarioId,
  state: ConfiguratorState,
  components: readonly ComponentEconomics[],
): ProjectEconomicScenario {
  const investmentMinEuro = sumCompleteInvestment(components, "investmentMinEuro");
  const investmentBaseEuro = sumCompleteInvestment(components, "investmentBaseEuro");
  const investmentMaxEuro = sumCompleteInvestment(components, "investmentMaxEuro");
  const investment = id === "conservative" ? investmentMaxEuro : id === "favorable" ? investmentMinEuro : investmentBaseEuro;
  const effects = buildAnnualEffects(state, components, id);
  return {
    id,
    investmentMinEuro,
    investmentBaseEuro,
    investmentMaxEuro,
    firstYearQuantifiedEffectEuro: effects[0] ?? 0,
    paybackYears: investment === null ? null : getPaybackYears(investment, effects),
    finalCumulativeCashFlowEuro:
      investment === null ? null : round(effects.reduce((sum, effect) => sum + effect, -investment)),
  };
}

export function calculateProjectEconomics(state: ConfiguratorState): ProjectEconomicsResult {
  const components = buildComponentEconomics(state);
  const investmentMinEuro = sumCompleteInvestment(components, "investmentMinEuro");
  const investmentBaseEuro = sumCompleteInvestment(components, "investmentBaseEuro");
  const investmentMaxEuro = sumCompleteInvestment(components, "investmentMaxEuro");
  const annualEffects = buildAnnualEffects(state, components, "base");
  let cumulative = -(investmentBaseEuro ?? 0);
  const projections = investmentBaseEuro === null ? [] : [
    { year: 0, quantifiedEconomicEffectEuro: 0, cumulativeCashFlowEuro: cumulative },
    ...annualEffects.map((effect, index) => {
      cumulative += effect;
      return { year: index + 1, quantifiedEconomicEffectEuro: effect, cumulativeCashFlowEuro: round(cumulative) };
    }),
  ];
  const heatPump = state.results.heatPump;
  const heatPumpAssumptions = heatPump
    ? [
        { key: "heating_comparison", label: "Heizungsvergleich", value: heatPump.heatingComparisonLabel, source: "user_input" as const },
        ...(heatPump.comparisonFuelPriceEuroPerUnit === null ? [] : [{ key: "heating_fuel_price", label: heatPump.comparisonFuelUnit === "litre" ? "Heizölpreis im Modell" : "Gaspreis im Modell", value: `${heatPump.comparisonFuelPriceEuroPerUnit.toLocaleString("de-DE")} €/${heatPump.comparisonFuelUnit === "litre" ? "Liter" : "kWh"}`, source: "default_assumption" as const }]),
        ...(heatPump.comparisonEfficiencyPercent === null ? [] : [{ key: "heating_efficiency", label: "Wirkungsgrad Vergleichsheizung", value: `${heatPump.comparisonEfficiencyPercent} %`, source: "default_assumption" as const }]),
        ...(heatPump.oilEnergyContentKwhPerLitre === null ? [] : [{ key: "oil_energy_content", label: "Heizöl-Umrechnung", value: `${heatPump.oilEnergyContentKwhPerLitre} kWh/Liter`, source: "default_assumption" as const }]),
      ]
    : [];

  return {
    horizonYears: state.settings.economics.projectHorizonYears,
    pricingMode: investmentBaseEuro === null ? "individual_quote_required" : "modeled",
    modeledComponentsInvestmentMinEuro: sumKnownInvestment(components, "investmentMinEuro"),
    modeledComponentsInvestmentBaseEuro: sumKnownInvestment(components, "investmentBaseEuro"),
    modeledComponentsInvestmentMaxEuro: sumKnownInvestment(components, "investmentMaxEuro"),
    investmentMinEuro,
    investmentBaseEuro,
    investmentMaxEuro,
    firstYearQuantifiedEffectEuro: annualEffects[0] ?? 0,
    paybackYears: investmentBaseEuro === null ? null : getPaybackYears(investmentBaseEuro, annualEffects),
    finalCumulativeCashFlowEuro:
      investmentBaseEuro === null ? null : (projections.at(-1)?.cumulativeCashFlowEuro ?? -investmentBaseEuro),
    components,
    projections,
    scenarios: (["conservative", "base", "favorable"] as const).map((id) => buildScenario(id, state, components)),
    assumptions: [
      { key: "electricity_price", label: "Netzstrompreis", value: `${state.settings.economics.gridElectricityPriceEuroPerKwh.toLocaleString("de-DE")} €/kWh`, source: "default_assumption" },
      { key: "feed_in", label: "Einspeisewert", value: `${state.settings.economics.feedInValueEuroPerKwh.toLocaleString("de-DE")} €/kWh`, source: "default_assumption" },
      { key: "price_growth", label: "Strompreisentwicklung", value: `${state.settings.economics.electricityPriceDevelopmentPercent.toLocaleString("de-DE")} %/Jahr`, source: "default_assumption" },
      { key: "pv_degradation", label: "PV-Degradation", value: `${state.settings.photovoltaic.annualDegradationPercent.toLocaleString("de-DE")} %/Jahr`, source: "default_assumption" },
      { key: "storage_efficiency", label: "Speicherwirkungsgrad", value: `${state.settings.batteryStorage.roundTripEfficiencyPercent.toLocaleString("de-DE")} %`, source: "default_assumption" },
      { key: "storage_lifetime", label: "Speicherhorizont", value: `${state.settings.batteryStorage.economicLifetimeYears} Jahre`, source: "default_assumption" },
      { key: "project_horizon", label: "Projektbetrachtung", value: `${state.settings.economics.projectHorizonYears} Jahre`, source: "modeled" },
      ...heatPumpAssumptions,
    ],
    limitations: [
      "Jahresmodell ohne stündliche Lastgangsimulation.",
      "Finanzierung, Steuern und Förderung sind nicht eingerechnet.",
      "Synergien zwischen mehreren Verbrauchern werden konservativ und ohne Scheingenauigkeit behandelt.",
    ],
  };
}
