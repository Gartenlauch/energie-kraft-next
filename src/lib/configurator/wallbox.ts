import { DEFAULT_WALLBOX_CALCULATOR_INPUT } from "@/lib/calculators/wallbox-model";
import {
  deriveWallboxResult,
  getWallboxSystemRecommendation,
} from "../../../functions/src/configurator-technical-model";
import type { ConfiguratorState, WallboxConfiguratorResult } from "@/types/configurator";

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
    vehicleConsumptionKwhPer100Km === undefined ||
    batteryCapacityKwh === undefined ||
    homeChargingSharePercent === undefined ||
    chargingPowerKw === undefined ||
    pvChargingSharePercent === undefined
  ) return null;

  const calculationInput = {
    ...DEFAULT_WALLBOX_CALCULATOR_INPUT,
    chargingEfficiencyPercent: state.settings.wallbox.defaultChargingEfficiencyPercent,
    electricityPriceEuroPerKwh: state.settings.wallbox.electricityPriceEuroPerKwh,
    publicChargingPriceEuroPerKwh: state.settings.wallbox.publicChargingPriceEuroPerKwh,
    pvElectricityValueEuroPerKwh: state.settings.wallbox.pvElectricityValueEuroPerKwh,
    wallboxCostEuro: state.settings.wallbox.wallboxCostEuro,
    installationBaseCostEuro: state.settings.wallbox.installationBaseCostEuro,
    fixedAdditionalCostEuro: state.settings.wallbox.fixedAdditionalCostEuro,
    costUncertaintyPercent: state.settings.general.costUncertaintyPercent,
    annualDrivingKm,
    vehicleConsumptionKwhPer100Km,
    batteryCapacityKwh,
    homeChargingSharePercent,
    chargingPowerKw,
    pvChargingSharePercent,
  };
  return {
    systemRecommendation: getWallboxSystemRecommendation(chargingPowerKw),
    calculationInput,
    ...deriveWallboxResult(
      {
        annualDrivingKm,
        vehicleConsumptionKwhPer100Km,
        batteryCapacityKwh,
        homeChargingSharePercent,
        chargingPowerKw,
        pvChargingSharePercent,
      },
      state.settings,
    ),
  };
}
