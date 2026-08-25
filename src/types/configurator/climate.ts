import type {
    ClimateCalculatorInput,
    ClimateInsulationLevel,
    ClimateSolarLoad,
    ClimateSystemRecommendation,
} from "@/types/climate-calculator";
import type { ConfiguratorStepDefinition } from "./wizard";

export type ClimateStepId =
    | "rooms"
    | "insulation"
    | "solar_load"
    | "occupancy";

export type ClimateStepDefinition = Omit<
    ConfiguratorStepDefinition,
    "id"
> & {
    id: ClimateStepId;
};

export interface ClimateConfiguratorState {
    conditionedAreaM2?: number;

    roomCount?: number;

    insulationLevel?: ClimateInsulationLevel;

    solarLoad?: ClimateSolarLoad;

    occupancyPersons?: number;
}

export interface ClimateConfiguratorResult {
    calculationInput: ClimateCalculatorInput;

    calculatedCoolingLoadKw: number;

    recommendedCoolingCapacityKw: number;

    recommendedIndoorUnitCount: number;

    averageCapacityPerRoomKw: number;

    systemRecommendation:
    ClimateSystemRecommendation;

    annualElectricityConsumptionKwh: number;

    annualOperatingCostEuro: number;

    estimatedTotalCostEuro: number;

    estimatedMinimumCostEuro: number;

    estimatedMaximumCostEuro: number;

    individualPlanningRecommended: boolean;
}