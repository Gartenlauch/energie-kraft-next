import type {
  WallboxCalculatorInput,
  WallboxSystemRecommendation,
} from "@/types/wallbox-calculator";
import type { ConfiguratorStepDefinition } from "./wizard";

export const WALLBOX_CHARGING_POWER_OPTIONS = [
  3.7,
  11,
  22,
] as const;

export type WallboxChargingPowerKw =
  (typeof WALLBOX_CHARGING_POWER_OPTIONS)[number];

export interface WallboxConfiguratorState {
  annualDrivingKm?: number;

  vehicleConsumptionKwhPer100Km?: number;

  batteryCapacityKwh?: number;

  homeChargingSharePercent?: number;

  chargingPowerKw?: WallboxChargingPowerKw;

  pvChargingSharePercent?: number;
}

export type WallboxStepId =
  | "vehicle_data"
  | "home_charging"
  | "charging_power"
  | "photovoltaics";

export type WallboxStepDefinition = Omit<
  ConfiguratorStepDefinition,
  "id"
> & {
  id: WallboxStepId;
};

export interface WallboxConfiguratorResult {
  systemRecommendation:
  WallboxSystemRecommendation;

  calculationInput:
  WallboxCalculatorInput;

  annualVehicleEnergyDemandKwh: number;

  annualHomeChargingInputEnergyKwh: number;

  annualPvChargingEnergyKwh: number;

  annualGridChargingEnergyKwh: number;

  typicalChargingTimeHours: number;

  annualHomeChargingCostEuro: number;

  monthlyHomeChargingCostEuro: number;

  estimatedTotalCostEuro: number;

  estimatedMinimumCostEuro: number;

  estimatedMaximumCostEuro: number;

  usesPhotovoltaicCharging: boolean;

  technicalReviewRecommended: boolean;
}