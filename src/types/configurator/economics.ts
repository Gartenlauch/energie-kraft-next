import type { ConfiguratorType } from "./state";

export type EconomicScenarioId = "conservative" | "base" | "favorable";
export type EconomicValueSource = "user_input" | "modeled" | "default_assumption";

export interface ProjectCostSummary {
  investmentMinEuro: number;
  investmentBaseEuro: number;
  investmentMaxEuro: number;
}

export interface ComponentEconomics extends ProjectCostSummary {
  component: ConfiguratorType;
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
  finalCumulativeCashFlowEuro: number;
}

export interface EconomicAssumption {
  key: string;
  label: string;
  value: string;
  source: EconomicValueSource;
}

export interface ProjectEconomicsResult extends ProjectCostSummary {
  horizonYears: number;
  firstYearQuantifiedEffectEuro: number;
  paybackYears: number | null;
  finalCumulativeCashFlowEuro: number;
  components: ComponentEconomics[];
  projections: ProjectYearProjection[];
  scenarios: ProjectEconomicScenario[];
  assumptions: EconomicAssumption[];
  limitations: string[];
}
