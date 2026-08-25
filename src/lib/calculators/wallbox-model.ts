import type {
    WallboxCalculatorInput,
  } from "@/types/wallbox-calculator";
  
  export const DEFAULT_WALLBOX_CALCULATOR_INPUT = {
    annualDrivingKm: 15_000,
    vehicleConsumptionKwhPer100Km: 18,
    homeChargingSharePercent: 80,
  
    batteryCapacityKwh: 60,
    startStateOfChargePercent: 20,
    targetStateOfChargePercent: 80,
  
    chargingPowerKw: 11,
    chargingEfficiencyPercent: 90,
  
    electricityPriceEuroPerKwh: 0.32,
    publicChargingPriceEuroPerKwh: 0.59,
  
    pvChargingSharePercent: 30,
    pvElectricityValueEuroPerKwh: 0.08,
  
    wallboxCostEuro: 1_000,
    installationBaseCostEuro: 1_500,
    fixedAdditionalCostEuro: 500,
    costUncertaintyPercent: 15,
  } satisfies WallboxCalculatorInput;