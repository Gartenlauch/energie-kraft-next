import type {
    HeatPumpCalculatorInput,
  } from "@/types/heat-pump-calculator";
  
  export const DEFAULT_HEAT_PUMP_CALCULATOR_INPUT = {
    heatedAreaM2: 160,
    specificSpaceHeatingDemandKwhPerM2Year: 90,
    occupancyPersons: 4,
    hotWaterDemandKwhPerPersonYear: 800,
  
    annualPerformanceFactor: 3.5,
    equivalentFullLoadHours: 2_000,
    capacityReservePercent: 15,
  
    requiredFlowTemperatureC: 50,
  
    electricityPriceEuroPerKwh: 0.3,
  
    currentHeatingEnergyPriceEuroPerKwh: 0.12,
    currentHeatingEfficiencyPercent: 85,
  
    heatPumpCostEuroPerKw: 1_200,
    installationBaseCostEuro: 12_000,
    fixedAdditionalCostEuro: 3_000,
    costUncertaintyPercent: 15,
  } satisfies HeatPumpCalculatorInput;