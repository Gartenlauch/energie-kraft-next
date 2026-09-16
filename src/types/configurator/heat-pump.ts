import type {
  HeatPumpCalculatorInput,
  HeatPumpFlowTemperatureAssessment,
} from "@/types/heat-pump-calculator";
import type { ConfiguratorStepDefinition } from "./wizard";

export type HeatPumpStepId =
  | "existing_heating"
  | "heated_area"
  | "heating_demand"
  | "occupancy"
  | "flow_temperature"
  | "efficiency";

export type ExistingHeatingSystem = "gas" | "oil" | "new_build" | "other_unknown";

export type HeatingComparisonKind = "existing_system" | "reference_scenario" | "unavailable";

export type HeatingComparisonBasis = "user_consumption" | "modeled_heat_demand" | "unavailable";

export type HeatPumpStepDefinition = Omit<ConfiguratorStepDefinition, "id"> & {
  id: HeatPumpStepId;
};

export interface HeatPumpConfiguratorState {
  existingHeatingSystem?: ExistingHeatingSystem;

  annualGasConsumptionKwh?: number;

  annualOilConsumptionLitres?: number;

  heatedAreaM2?: number;

  specificSpaceHeatingDemandKwhPerM2Year?: number;

  occupancyPersons?: number;

  requiredFlowTemperatureC?: number;

  annualPerformanceFactor?: number;
}

export interface HeatPumpConfiguratorResult {
  calculationInput: HeatPumpCalculatorInput;

  recommendedHeatPumpCapacityKw: number;

  totalAnnualHeatDemandKwh: number;

  spaceHeatingDemandKwh: number;

  hotWaterDemandKwh: number;

  annualHeatPumpElectricityConsumptionKwh: number;

  annualHeatPumpOperatingCostEuro: number;

  currentHeatingOperatingCostEuro: number | null;

  annualOperatingCostDifferenceEuro: number | null;

  heatingComparisonKind: HeatingComparisonKind;

  heatingComparisonBasis: HeatingComparisonBasis;

  heatingComparisonLabel: string;

  comparisonFuelPriceEuroPerUnit: number | null;

  comparisonFuelUnit: "kWh" | "litre" | null;

  comparisonEfficiencyPercent: number | null;

  oilEnergyContentKwhPerLitre: number | null;

  estimatedTotalCostEuro: number;

  estimatedMinimumCostEuro: number;

  estimatedMaximumCostEuro: number;

  flowTemperatureAssessment: HeatPumpFlowTemperatureAssessment;

  ntReady: boolean;

  technicalReviewRecommended: boolean;
}
