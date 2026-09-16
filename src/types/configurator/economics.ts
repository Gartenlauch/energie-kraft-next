import type { ConfiguratorType } from "./state";

export type EconomicScenarioId = "conservative" | "base" | "favorable";
export type EconomicValueSource = "user_input" | "modeled" | "default_assumption";

export interface ProjectCostSummary {
  investmentMinEuro: number | null;
  investmentBaseEuro: number | null;
  investmentMaxEuro: number | null;
}

export interface ComponentEconomics extends ProjectCostSummary {
  component: ConfiguratorType;
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
  horizonYears: number;
  firstYearQuantifiedEffectEuro: number;
  paybackYears: number | null;
  finalCumulativeCashFlowEuro: number | null;
  components: ComponentEconomics[];
  projections: ProjectYearProjection[];
  scenarios: ProjectEconomicScenario[];
  assumptions: EconomicAssumption[];
  limitations: string[];
}
