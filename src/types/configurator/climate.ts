import type {
    ClimateCalculatorInput,
    ClimateInsulationLevel,
    ClimateSolarLoad,
    ClimateSystemRecommendation,
} from "@/types/climate-calculator";

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