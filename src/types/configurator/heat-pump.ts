import type {
    HeatPumpCalculatorInput,
    HeatPumpFlowTemperatureAssessment,
  } from "@/types/heat-pump-calculator";
  
  export interface HeatPumpConfiguratorState {
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
  
    estimatedTotalCostEuro: number;
  
    estimatedMinimumCostEuro: number;
  
    estimatedMaximumCostEuro: number;
  
    flowTemperatureAssessment:
      HeatPumpFlowTemperatureAssessment;
  
    ntReady: boolean;
  
    technicalReviewRecommended: boolean;
  }