import { calculatePvRoi } from "@/lib/calculators/pv-roi";
import { PV_ECONOMIC_ASSUMPTIONS } from "@/lib/calculators/pv-model";
import type {
  ComponentEconomics,
  ConfiguratorState,
  EconomicScenarioId,
  ProjectEconomicScenario,
  ProjectEconomicsResult,
} from "@/types/configurator";

const PROJECT_HORIZON_YEARS = 20;
const STORAGE_ROUND_TRIP_EFFICIENCY = 0.9;
const STORAGE_EQUIVALENT_FULL_CYCLES_PER_YEAR = 220;
const STORAGE_ECONOMIC_LIFETIME_YEARS = 15;

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
  const result = state.results.photovoltaic;
  if (!result) return Array(PROJECT_HORIZON_YEARS).fill(0) as number[];

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
  const selfConsumptionRatePercent =
    PV_ECONOMIC_ASSUMPTIONS.selfConsumptionRatePercent +
    (isConservative ? -5 : isFavorable ? 5 : 0);

  return calculatePvRoi({
    annualConsumptionKwh: result.projectedAnnualConsumptionKwh,
    systemSizeKwp,
    specificYieldKwhPerKwp,
    selfConsumptionRatePercent,
    electricityPriceEuroPerKwh: PV_ECONOMIC_ASSUMPTIONS.electricityPriceEuroPerKwh,
    feedInTariffEuroPerKwh: PV_ECONOMIC_ASSUMPTIONS.feedInTariffEuroPerKwh,
    netInvestmentCostEuro: investment,
    annualOperatingCostEuro: PV_ECONOMIC_ASSUMPTIONS.annualOperatingCostEuro,
    annualDegradationPercent: PV_ECONOMIC_ASSUMPTIONS.annualDegradationPercent,
    electricityPriceIncreasePercent: PV_ECONOMIC_ASSUMPTIONS.electricityPriceIncreasePercent,
    calculationYears: PROJECT_HORIZON_YEARS,
  }).projections.map((projection) => projection.netCashFlowEuro);
}

function getStorageFirstYearEffect(state: ConfiguratorState): number {
  const storage = state.results.batteryStorage;
  if (!storage) return 0;

  const pv = state.results.photovoltaic;
  const generationKwh = pv
    ? (pv.estimatedAnnualYieldKwhMin + pv.estimatedAnnualYieldKwhMax) / 2
    : ((storage.pvPowerKwpMin + storage.pvPowerKwpMax) / 2) *
      PV_ECONOMIC_ASSUMPTIONS.specificYieldKwhPerKwpFallback;
  const directUseKwh = Math.min(
    generationKwh * (PV_ECONOMIC_ASSUMPTIONS.selfConsumptionRatePercent / 100),
    storage.annualConsumptionKwh,
  );
  const availableSurplusKwh = Math.max(generationKwh - directUseKwh, 0);
  const usableCapacityKwh =
    (storage.recommendedUsableCapacityKwhMin + storage.recommendedUsableCapacityKwhMax) / 2;
  const chargedEnergyKwh = Math.min(
    availableSurplusKwh,
    usableCapacityKwh * STORAGE_EQUIVALENT_FULL_CYCLES_PER_YEAR,
  );
  const deliveredEnergyKwh = chargedEnergyKwh * STORAGE_ROUND_TRIP_EFFICIENCY;

  return round(
    deliveredEnergyKwh * PV_ECONOMIC_ASSUMPTIONS.electricityPriceEuroPerKwh -
      chargedEnergyKwh * PV_ECONOMIC_ASSUMPTIONS.feedInTariffEuroPerKwh,
  );
}

function buildComponentEconomics(state: ConfiguratorState): ComponentEconomics[] {
  const components: ComponentEconomics[] = [];
  const pv = state.results.photovoltaic;
  if (pv) {
    const firstYear = buildPvEffects(state, "base")[0] ?? 0;
    components.push({
      component: "photovoltaic",
      analysisKind: "economic_effect",
      investmentMinEuro: pv.estimatedMinimumCostEuro,
      investmentBaseEuro: pv.estimatedTotalCostEuro,
      investmentMaxEuro: pv.estimatedMaximumCostEuro,
      firstYearEconomicEffectEuro: firstYear,
      economicLifetimeYears: PROJECT_HORIZON_YEARS,
      explanation:
        "Direkt genutzter Solarstrom plus Einspeisung, abzüglich modellierter Betriebskosten.",
    });
  }

  const storage = state.results.batteryStorage;
  if (storage) {
    components.push({
      component: "battery_storage",
      analysisKind: "economic_effect",
      investmentMinEuro: storage.estimatedMinimumCostEuro,
      investmentBaseEuro: storage.estimatedTotalCostEuro,
      investmentMaxEuro: storage.estimatedMaximumCostEuro,
      firstYearEconomicEffectEuro: getStorageFirstYearEffect(state),
      economicLifetimeYears: STORAGE_ECONOMIC_LIFETIME_YEARS,
      explanation:
        "Nur der zusätzliche Wert verschobener PV-Überschüsse nach Speicherverlusten und entgangener Einspeisung.",
    });
  }

  const heatPump = state.results.heatPump;
  if (heatPump) {
    components.push({
      component: "heat_pump",
      analysisKind: "economic_effect",
      investmentMinEuro: heatPump.estimatedMinimumCostEuro,
      investmentBaseEuro: heatPump.estimatedTotalCostEuro,
      investmentMaxEuro: heatPump.estimatedMaximumCostEuro,
      firstYearEconomicEffectEuro: heatPump.annualOperatingCostDifferenceEuro,
      economicLifetimeYears: PROJECT_HORIZON_YEARS,
      explanation:
        "Differenz aus modellierten Energiekosten des bisherigen Heizsystems und der Wärmepumpe; Förderung nicht eingerechnet.",
    });
  }

  const climate = state.results.climate;
  if (climate) {
    components.push({
      component: "climate",
      analysisKind: "operating_cost",
      investmentMinEuro: climate.estimatedMinimumCostEuro,
      investmentBaseEuro: climate.estimatedTotalCostEuro,
      investmentMaxEuro: climate.estimatedMaximumCostEuro,
      firstYearEconomicEffectEuro: -climate.annualOperatingCostEuro,
      economicLifetimeYears: PROJECT_HORIZON_YEARS,
      explanation: "Betriebskostenanalyse ohne erfundene Einsparung oder Amortisation.",
    });
  }

  const wallbox = state.results.wallbox;
  if (wallbox) {
    components.push({
      component: "wallbox",
      analysisKind: "investment_only",
      investmentMinEuro: wallbox.estimatedMinimumCostEuro,
      investmentBaseEuro: wallbox.estimatedTotalCostEuro,
      investmentMaxEuro: wallbox.estimatedMaximumCostEuro,
      firstYearEconomicEffectEuro: 0,
      economicLifetimeYears: PROJECT_HORIZON_YEARS,
      explanation:
        "Investition und Ladebetrieb werden gezeigt; ein Wallbox-ROI wird nicht unterstellt.",
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
  const growth = 1 + PV_ECONOMIC_ASSUMPTIONS.electricityPriceIncreasePercent / 100;

  return Array.from({ length: PROJECT_HORIZON_YEARS }, (_, index) => {
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

function sumInvestment(
  components: readonly ComponentEconomics[],
  key: "investmentMinEuro" | "investmentBaseEuro" | "investmentMaxEuro",
): number {
  return round(components.reduce((sum, component) => sum + component[key], 0));
}

function buildScenario(
  id: EconomicScenarioId,
  state: ConfiguratorState,
  components: readonly ComponentEconomics[],
): ProjectEconomicScenario {
  const investmentMinEuro = sumInvestment(components, "investmentMinEuro");
  const investmentBaseEuro = sumInvestment(components, "investmentBaseEuro");
  const investmentMaxEuro = sumInvestment(components, "investmentMaxEuro");
  const investment =
    id === "conservative"
      ? investmentMaxEuro
      : id === "favorable"
        ? investmentMinEuro
        : investmentBaseEuro;
  const effects = buildAnnualEffects(state, components, id);

  return {
    id,
    investmentMinEuro,
    investmentBaseEuro,
    investmentMaxEuro,
    firstYearQuantifiedEffectEuro: effects[0] ?? 0,
    paybackYears: getPaybackYears(investment, effects),
    finalCumulativeCashFlowEuro: round(effects.reduce((sum, effect) => sum + effect, -investment)),
  };
}

export function calculateProjectEconomics(state: ConfiguratorState): ProjectEconomicsResult {
  const components = buildComponentEconomics(state);
  const investmentMinEuro = sumInvestment(components, "investmentMinEuro");
  const investmentBaseEuro = sumInvestment(components, "investmentBaseEuro");
  const investmentMaxEuro = sumInvestment(components, "investmentMaxEuro");
  const annualEffects = buildAnnualEffects(state, components, "base");
  let cumulative = -investmentBaseEuro;
  const projections = [
    { year: 0, quantifiedEconomicEffectEuro: 0, cumulativeCashFlowEuro: cumulative },
    ...annualEffects.map((effect, index) => {
      cumulative += effect;
      return {
        year: index + 1,
        quantifiedEconomicEffectEuro: effect,
        cumulativeCashFlowEuro: round(cumulative),
      };
    }),
  ];

  return {
    horizonYears: PROJECT_HORIZON_YEARS,
    investmentMinEuro,
    investmentBaseEuro,
    investmentMaxEuro,
    firstYearQuantifiedEffectEuro: annualEffects[0] ?? 0,
    paybackYears: getPaybackYears(investmentBaseEuro, annualEffects),
    finalCumulativeCashFlowEuro: projections.at(-1)?.cumulativeCashFlowEuro ?? -investmentBaseEuro,
    components,
    projections,
    scenarios: (["conservative", "base", "favorable"] as const).map((id) =>
      buildScenario(id, state, components),
    ),
    assumptions: [
      {
        key: "electricity_price",
        label: "Netzstrompreis",
        value: "0,32 €/kWh",
        source: "default_assumption",
      },
      { key: "feed_in", label: "Einspeisewert", value: "0,08 €/kWh", source: "default_assumption" },
      {
        key: "price_growth",
        label: "Strompreisentwicklung",
        value: "2 %/Jahr",
        source: "default_assumption",
      },
      {
        key: "pv_degradation",
        label: "PV-Degradation",
        value: "0,5 %/Jahr",
        source: "default_assumption",
      },
      {
        key: "storage_efficiency",
        label: "Speicherwirkungsgrad",
        value: "90 %",
        source: "default_assumption",
      },
      {
        key: "storage_lifetime",
        label: "Speicherhorizont",
        value: "15 Jahre",
        source: "default_assumption",
      },
      { key: "project_horizon", label: "Projektbetrachtung", value: "20 Jahre", source: "modeled" },
    ],
    limitations: [
      "Jahresmodell ohne stündliche Lastgangsimulation.",
      "Finanzierung, Steuern und Förderung sind nicht eingerechnet.",
      "Synergien zwischen mehreren Verbrauchern werden konservativ und ohne Scheingenauigkeit behandelt.",
    ],
  };
}
