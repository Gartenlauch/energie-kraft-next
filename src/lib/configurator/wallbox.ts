import {
    calculateWallboxCost,
  } from "@/lib/calculators/wallbox-cost";
  import {
    DEFAULT_WALLBOX_CALCULATOR_INPUT,
  } from "@/lib/calculators/wallbox-model";
  import type {
    ConfiguratorState,
    WallboxConfiguratorResult,
  } from "@/types/configurator";
  
  export function buildWallboxConfiguratorResult(
    state: ConfiguratorState,
  ): WallboxConfiguratorResult | null {
    const {
      annualDrivingKm,
      vehicleConsumptionKwhPer100Km,
      batteryCapacityKwh,
      homeChargingSharePercent,
      chargingPowerKw,
      pvChargingSharePercent,
    } = state.wallbox;
  
    if (
      annualDrivingKm === undefined ||
      vehicleConsumptionKwhPer100Km ===
        undefined ||
      batteryCapacityKwh === undefined ||
      homeChargingSharePercent ===
        undefined ||
      chargingPowerKw === undefined ||
      pvChargingSharePercent === undefined
    ) {
      return null;
    }
  
    const calculationInput = {
      ...DEFAULT_WALLBOX_CALCULATOR_INPUT,
  
      annualDrivingKm,
  
      vehicleConsumptionKwhPer100Km,
  
      batteryCapacityKwh,
  
      homeChargingSharePercent,
  
      chargingPowerKw,
  
      pvChargingSharePercent,
    };
  
    const calculatorResult =
      calculateWallboxCost(
        calculationInput,
      );
  
    return {
      systemRecommendation:
        calculatorResult.systemRecommendation,
  
      calculationInput,
  
      annualVehicleEnergyDemandKwh:
        calculatorResult
          .annualVehicleEnergyDemandKwh,
  
      annualHomeChargingInputEnergyKwh:
        calculatorResult
          .annualHomeChargingInputEnergyKwh,
  
      annualPvChargingEnergyKwh:
        calculatorResult
          .annualPvChargingEnergyKwh,
  
      annualGridChargingEnergyKwh:
        calculatorResult
          .annualGridChargingEnergyKwh,
  
      typicalChargingTimeHours:
        calculatorResult
          .typicalChargingTimeHours,
  
      annualHomeChargingCostEuro:
        calculatorResult
          .annualHomeChargingCostEuro,
  
      monthlyHomeChargingCostEuro:
        calculatorResult
          .monthlyHomeChargingCostEuro,
  
      estimatedTotalCostEuro:
        calculatorResult
          .estimatedTotalCostEuro,
  
      estimatedMinimumCostEuro:
        calculatorResult
          .estimatedMinimumCostEuro,
  
      estimatedMaximumCostEuro:
        calculatorResult
          .estimatedMaximumCostEuro,
  
      usesPhotovoltaicCharging:
        pvChargingSharePercent > 0,
  
      technicalReviewRecommended:
        calculatorResult.systemRecommendation ===
        "highPowerReview",
    };
  }