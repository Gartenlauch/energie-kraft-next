import type { ConfiguratorSettings } from "./configurator-settings-model.js";
import {
  deriveBatteryStorageResult,
  deriveClimateResult,
  deriveHeatPumpResult,
  derivePhotovoltaicResult,
  deriveWallboxResult,
} from "./configurator-technical-model.js";
import type {
  ConfiguratorLeadPayload,
  ConfiguratorPayload,
} from "./configurator-lead-validation.js";

function round(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

type ScenarioId = "conservative" | "base" | "favorable";

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

function photovoltaicEffect(
  configurator: Extract<ConfiguratorPayload, { type: "photovoltaic" }>,
  settings: ConfiguratorSettings,
  yearIndex: number,
  scenario: ScenarioId,
): number {
  const result = configurator.result;
  const systemSizeKwp = scenario === "conservative"
    ? result.recommendedPowerKwpMin
    : scenario === "favorable"
      ? result.recommendedPowerKwpMax
      : (result.recommendedPowerKwpMin + result.recommendedPowerKwpMax) / 2;
  const specificYield = scenario === "conservative"
    ? result.specificYieldKwhPerKwpMin
    : scenario === "favorable"
      ? result.specificYieldKwhPerKwpMax
      : (result.specificYieldKwhPerKwpMin + result.specificYieldKwhPerKwpMax) / 2;
  const generation = systemSizeKwp * specificYield *
    (1 - settings.photovoltaic.annualDegradationPercent / 100) ** yearIndex;
  const selfConsumptionRate = Math.min(
    Math.max(settings.photovoltaic.defaultSelfConsumptionPercent +
      (scenario === "conservative" ? -5 : scenario === "favorable" ? 5 : 0), 0),
    100,
  ) / 100;
  const selfConsumed = Math.min(
    generation * selfConsumptionRate,
    result.projectedAnnualConsumptionKwh,
  );
  const exported = Math.max(generation - selfConsumed, 0);
  const gridPrice = settings.economics.gridElectricityPriceEuroPerKwh *
    (1 + settings.economics.electricityPriceDevelopmentPercent / 100) ** yearIndex;
  return round(
    selfConsumed * gridPrice +
      exported * settings.economics.feedInValueEuroPerKwh -
      settings.photovoltaic.annualOperatingCostEuro,
  );
}

function storageFirstYearEffect(
  storage: Extract<ConfiguratorPayload, { type: "battery_storage" }>,
  photovoltaic: Extract<ConfiguratorPayload, { type: "photovoltaic" }> | undefined,
  settings: ConfiguratorSettings,
): number {
  const result = storage.result;
  const generation = photovoltaic
    ? (photovoltaic.result.estimatedAnnualYieldKwhMin + photovoltaic.result.estimatedAnnualYieldKwhMax) / 2
    : ((result.pvPowerKwpMin + result.pvPowerKwpMax) / 2) *
      settings.photovoltaic.specificYieldKwhPerKwpFallback;
  const directUse = Math.min(
    generation * (settings.photovoltaic.defaultSelfConsumptionPercent / 100),
    result.annualConsumptionKwh,
  );
  const charged = Math.min(
    Math.max(generation - directUse, 0),
    ((result.recommendedUsableCapacityKwhMin + result.recommendedUsableCapacityKwhMax) / 2) *
      settings.batteryStorage.equivalentFullCyclesPerYear,
  );
  const delivered = charged * (settings.batteryStorage.roundTripEfficiencyPercent / 100);
  return round(
    delivered * settings.economics.gridElectricityPriceEuroPerKwh -
      charged * settings.economics.feedInValueEuroPerKwh,
  );
}

function repriceConfigurator(
  configurator: ConfiguratorPayload,
  settings: ConfiguratorSettings,
  photovoltaicResult: Extract<ConfiguratorPayload, { type: "photovoltaic" }>["result"] | undefined,
  modularExpansionRecommended: boolean,
): ConfiguratorPayload {
  if (configurator.type === "photovoltaic") {
    const result = photovoltaicResult ?? derivePhotovoltaicResult(configurator.answers, settings);
    return {
      ...configurator,
      answers: {
        ...configurator.answers,
        household: {
          ...configurator.answers.household,
          projectedConsumptionKwh: result.projectedAnnualConsumptionKwh,
        },
      },
      result,
    };
  }
  if (configurator.type === "battery_storage") {
    return {
      ...configurator,
      result: deriveBatteryStorageResult(
        configurator.answers,
        photovoltaicResult,
        modularExpansionRecommended,
        settings,
      ),
    };
  }
  if (configurator.type === "heat_pump") {
    return {
      ...configurator,
      result: deriveHeatPumpResult(configurator.answers, settings),
    };
  }
  if (configurator.type === "climate") {
    return {
      ...configurator,
      result: deriveClimateResult(configurator.answers, settings),
    };
  }
  return {
    ...configurator,
    result: deriveWallboxResult(configurator.answers, settings),
  };
}

export function applyAuthoritativeConfiguratorModel(
  lead: ConfiguratorLeadPayload,
  settings: ConfiguratorSettings,
): ConfiguratorLeadPayload {
  const photovoltaicInput = lead.configurators.find(
    (item): item is Extract<ConfiguratorPayload, { type: "photovoltaic" }> =>
      item.type === "photovoltaic",
  );
  const photovoltaicResult = photovoltaicInput
    ? derivePhotovoltaicResult(photovoltaicInput.answers, settings)
    : undefined;
  const modularExpansionRecommended = lead.journey.selectedProducts.some(
    (product) => product === "wallbox" || product === "heat_pump" || product === "climate",
  );
  const configurators = lead.configurators.map((item) =>
    repriceConfigurator(item, settings, photovoltaicResult, modularExpansionRecommended),
  );
  const photovoltaic = configurators.find(
    (item): item is Extract<ConfiguratorPayload, { type: "photovoltaic" }> => item.type === "photovoltaic",
  );
  const components = configurators.map((item) => {
    const result = item.result;
    const pricingMode = "pricingMode" in result ? result.pricingMode : "modeled";
    const firstYearEconomicEffectEuro = item.type === "photovoltaic"
      ? photovoltaicEffect(item, settings, 0, "base")
      : item.type === "battery_storage"
        ? storageFirstYearEffect(item, photovoltaic, settings)
        : item.type === "heat_pump"
          ? item.result.annualOperatingCostDifferenceEuro ?? -item.result.annualHeatPumpOperatingCostEuro
          : item.type === "climate"
            ? -item.result.annualOperatingCostEuro
            : 0;
    const analysisKind = item.type === "photovoltaic" || item.type === "battery_storage"
      ? "economic_effect" as const
      : item.type === "heat_pump"
        ? (item.result.annualOperatingCostDifferenceEuro === null ? "operating_cost" as const : "economic_effect" as const)
        : item.type === "climate"
          ? "operating_cost" as const
          : "investment_only" as const;
    return {
      component: item.type,
      pricingMode,
      analysisKind,
      investmentMinEuro: result.estimatedMinimumCostEuro,
      investmentBaseEuro: result.estimatedTotalCostEuro,
      investmentMaxEuro: result.estimatedMaximumCostEuro,
      firstYearEconomicEffectEuro,
      economicLifetimeYears:
        item.type === "battery_storage"
          ? settings.batteryStorage.economicLifetimeYears
          : settings.economics.projectHorizonYears,
      explanation: "Serverseitig aus Antworten und gespeicherter Modellversion berechnet.",
    };
  });
  const incomplete = components.some((component) => component.investmentBaseEuro === null);
  const sum = (key: "investmentMinEuro" | "investmentBaseEuro" | "investmentMaxEuro") =>
    round(components.reduce((total, component) => total + (component[key] ?? 0), 0));
  const buildAnnualEffects = (scenario: ScenarioId) => {
    const factor = scenario === "conservative" ? 0.9 : scenario === "favorable" ? 1.1 : 1;
    const growth = 1 + settings.economics.electricityPriceDevelopmentPercent / 100;
    return Array.from({ length: settings.economics.projectHorizonYears }, (_, yearIndex) => {
      let effect = photovoltaic ? photovoltaicEffect(photovoltaic, settings, yearIndex, scenario) : 0;
      for (const component of components) {
        if (component.component === "photovoltaic" || component.component === "wallbox") continue;
        if (yearIndex >= component.economicLifetimeYears) continue;
        const baseEffect = component.firstYearEconomicEffectEuro * growth ** yearIndex;
        effect += baseEffect > 0 ? baseEffect * factor : baseEffect;
      }
      return round(effect);
    });
  };
  const investmentFor = (scenario: ScenarioId) => incomplete
    ? null
    : scenario === "conservative"
      ? sum("investmentMaxEuro")
      : scenario === "favorable"
        ? sum("investmentMinEuro")
        : sum("investmentBaseEuro");
  const scenarioIds: ScenarioId[] = ["conservative", "base", "favorable"];
  const scenarios = scenarioIds.map((id) => {
    const investment = investmentFor(id);
    const effects = buildAnnualEffects(id);
    return {
      id,
      investmentMinEuro: incomplete ? null : sum("investmentMinEuro"),
      investmentBaseEuro: incomplete ? null : sum("investmentBaseEuro"),
      investmentMaxEuro: incomplete ? null : sum("investmentMaxEuro"),
      firstYearQuantifiedEffectEuro: effects[0] ?? 0,
      paybackYears: investment === null ? null : getPaybackYears(investment, effects),
      finalCumulativeCashFlowEuro: investment === null
        ? null
        : round(effects.reduce((total, effect) => total + effect, -investment)),
    };
  });
  const baseEffects = buildAnnualEffects("base");
  const baseInvestment = investmentFor("base");
  let cumulative = -(baseInvestment ?? 0);
  const projections = baseInvestment === null
    ? []
    : [
        { year: 0, quantifiedEconomicEffectEuro: 0, cumulativeCashFlowEuro: cumulative },
        ...baseEffects.map((effect, index) => {
          cumulative += effect;
          return {
            year: index + 1,
            quantifiedEconomicEffectEuro: effect,
            cumulativeCashFlowEuro: round(cumulative),
          };
        }),
      ];
  const economics = {
    horizonYears: settings.economics.projectHorizonYears,
    pricingMode: incomplete ? ("individual_quote_required" as const) : ("modeled" as const),
    investmentMinEuro: incomplete ? null : sum("investmentMinEuro"),
    investmentBaseEuro: incomplete ? null : sum("investmentBaseEuro"),
    investmentMaxEuro: incomplete ? null : sum("investmentMaxEuro"),
    modeledComponentsInvestmentMinEuro: sum("investmentMinEuro"),
    modeledComponentsInvestmentBaseEuro: sum("investmentBaseEuro"),
    modeledComponentsInvestmentMaxEuro: sum("investmentMaxEuro"),
    firstYearQuantifiedEffectEuro: baseEffects[0] ?? 0,
    paybackYears: baseInvestment === null ? null : getPaybackYears(baseInvestment, baseEffects),
    finalCumulativeCashFlowEuro: baseInvestment === null
      ? null
      : projections[projections.length - 1]?.cumulativeCashFlowEuro ?? -baseInvestment,
    projections,
    scenarios,
    components,
    assumptions: [
      { key: "electricity_price", label: "Netzstrompreis", value: `${settings.economics.gridElectricityPriceEuroPerKwh.toLocaleString("de-DE")} €/kWh`, source: "default_assumption" as const },
      { key: "feed_in", label: "Einspeisewert", value: `${settings.economics.feedInValueEuroPerKwh.toLocaleString("de-DE")} €/kWh`, source: "default_assumption" as const },
      { key: "price_growth", label: "Strompreisentwicklung", value: `${settings.economics.electricityPriceDevelopmentPercent.toLocaleString("de-DE")} %/Jahr`, source: "default_assumption" as const },
      { key: "pv_degradation", label: "PV-Degradation", value: `${settings.photovoltaic.annualDegradationPercent.toLocaleString("de-DE")} %/Jahr`, source: "default_assumption" as const },
      { key: "storage_efficiency", label: "Speicherwirkungsgrad", value: `${settings.batteryStorage.roundTripEfficiencyPercent.toLocaleString("de-DE")} %`, source: "default_assumption" as const },
      { key: "storage_lifetime", label: "Speicherhorizont", value: `${settings.batteryStorage.economicLifetimeYears} Jahre`, source: "default_assumption" as const },
      { key: "project_horizon", label: "Projektbetrachtung", value: `${settings.economics.projectHorizonYears} Jahre`, source: "modeled" as const },
    ],
    limitations: [
      "Jahresmodell ohne stündliche Lastgangsimulation.",
      "Finanzierung, Steuern und Förderung sind nicht eingerechnet.",
      "Synergien zwischen mehreren Verbrauchern werden konservativ und ohne Scheingenauigkeit behandelt.",
    ],
  };
  return { ...lead, configurators, economics };
}
