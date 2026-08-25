import {
    calculateClimateCost,
  } from "@/lib/calculators/climate-cost";
  import {
    DEFAULT_CLIMATE_CALCULATOR_INPUT,
  } from "@/lib/calculators/climate-model";
  import type {
    ClimateConfiguratorResult,
    ConfiguratorState,
  } from "@/types/configurator";
  
  
  export function buildClimateConfiguratorResult(
    state: ConfiguratorState,
  ): ClimateConfiguratorResult | null {
    const {
      conditionedAreaM2,
      roomCount,
      insulationLevel,
      solarLoad,
      occupancyPersons,
    } = state.climate;
  
    if (
      conditionedAreaM2 === undefined ||
      roomCount === undefined ||
      insulationLevel === undefined ||
      solarLoad === undefined ||
      occupancyPersons === undefined
    ) {
      return null;
    }
  
    const calculationInput = {
      ...DEFAULT_CLIMATE_CALCULATOR_INPUT,
  
      conditionedAreaM2,
      roomCount,
      insulationLevel,
      solarLoad,
      occupancyPersons,
    };
  
    const calculatorResult =
      calculateClimateCost(
        calculationInput,
      );
  
    return {
      calculationInput,
  
      calculatedCoolingLoadKw:
        calculatorResult.calculatedCoolingLoadKw,
  
      recommendedCoolingCapacityKw:
        calculatorResult
          .recommendedCoolingCapacityKw,
  
      recommendedIndoorUnitCount:
        calculatorResult
          .recommendedIndoorUnitCount,
  
      averageCapacityPerRoomKw:
        calculatorResult
          .averageCapacityPerRoomKw,
  
      systemRecommendation:
        calculatorResult.systemRecommendation,
  
      annualElectricityConsumptionKwh:
        calculatorResult
          .annualElectricityConsumptionKwh,
  
      annualOperatingCostEuro:
        calculatorResult.annualOperatingCostEuro,
  
      estimatedTotalCostEuro:
        calculatorResult.estimatedTotalCostEuro,
  
      estimatedMinimumCostEuro:
        calculatorResult.estimatedMinimumCostEuro,
  
      estimatedMaximumCostEuro:
        calculatorResult.estimatedMaximumCostEuro,
  
      individualPlanningRecommended:
        calculatorResult.systemRecommendation ===
        "projectPlanning",
    };
  }