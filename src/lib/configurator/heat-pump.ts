import {
    calculateHeatPumpCost,
} from "@/lib/calculators/heat-pump-cost";
import {
    DEFAULT_HEAT_PUMP_CALCULATOR_INPUT,
} from "@/lib/calculators/heat-pump-model";
import type {
    ConfiguratorState,
    HeatPumpConfiguratorResult,
} from "@/types/configurator";

export function buildHeatPumpConfiguratorResult(
    state: ConfiguratorState,
): HeatPumpConfiguratorResult | null {
    const {
        heatedAreaM2,
        specificSpaceHeatingDemandKwhPerM2Year,
        occupancyPersons,
        requiredFlowTemperatureC,
        annualPerformanceFactor,
    } = state.heatPump;

    if (
        heatedAreaM2 === undefined ||
        specificSpaceHeatingDemandKwhPerM2Year ===
        undefined ||
        occupancyPersons === undefined ||
        requiredFlowTemperatureC === undefined ||
        annualPerformanceFactor === undefined
    ) {
        return null;
    }

    const calculationInput = {
        ...DEFAULT_HEAT_PUMP_CALCULATOR_INPUT,

        heatedAreaM2,

        specificSpaceHeatingDemandKwhPerM2Year,

        occupancyPersons,

        requiredFlowTemperatureC,

        annualPerformanceFactor,
    };

    const calculatorResult =
        calculateHeatPumpCost(
            calculationInput,
        );

    return {
        calculationInput,

        recommendedHeatPumpCapacityKw:
            calculatorResult
                .recommendedHeatPumpCapacityKw,

        totalAnnualHeatDemandKwh:
            calculatorResult
                .totalAnnualHeatDemandKwh,

        spaceHeatingDemandKwh:
            calculatorResult.spaceHeatingDemandKwh,

        hotWaterDemandKwh:
            calculatorResult.hotWaterDemandKwh,

        annualHeatPumpElectricityConsumptionKwh:
            calculatorResult
                .annualHeatPumpElectricityConsumptionKwh,

        annualHeatPumpOperatingCostEuro:
            calculatorResult
                .annualHeatPumpOperatingCostEuro,

        estimatedTotalCostEuro:
            calculatorResult
                .estimatedTotalCostEuro,

        estimatedMinimumCostEuro:
            calculatorResult
                .estimatedMinimumCostEuro,

        estimatedMaximumCostEuro:
            calculatorResult
                .estimatedMaximumCostEuro,

        flowTemperatureAssessment:
            calculatorResult
                .flowTemperatureAssessment,

        ntReady:
            calculatorResult.ntReady,

        technicalReviewRecommended:
            !calculatorResult.ntReady,
    };
}