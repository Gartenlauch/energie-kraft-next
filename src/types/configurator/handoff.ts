import type { ClimateInsulationLevel, ClimateSolarLoad } from "@/types/climate-calculator";
import type { PvRoofOrientation } from "@/types/pv-sizing-calculator";
import type { WallboxChargingPowerKw } from "./wallbox";

export type CalculatorHandoff =
  | {
      version: 1;
      source: "pv_sizing";
      createdAt: number;
      values: { annualConsumptionKwh: number; roofOrientation: PvRoofOrientation };
    }
  | { version: 1; source: "pv_roi"; createdAt: number; values: { annualConsumptionKwh: number } }
  | {
      version: 1;
      source: "heat_pump";
      createdAt: number;
      values: {
        heatedAreaM2: number;
        specificSpaceHeatingDemandKwhPerM2Year: number;
        occupancyPersons: number;
        requiredFlowTemperatureC: number;
        annualPerformanceFactor: number;
      };
    }
  | {
      version: 1;
      source: "climate";
      createdAt: number;
      values: {
        conditionedAreaM2: number;
        roomCount: number;
        insulationLevel: ClimateInsulationLevel;
        solarLoad: ClimateSolarLoad;
        occupancyPersons: number;
      };
    }
  | {
      version: 1;
      source: "wallbox";
      createdAt: number;
      values: {
        annualDrivingKm: number;
        vehicleConsumptionKwhPer100Km: number;
        batteryCapacityKwh: number;
        homeChargingSharePercent: number;
        chargingPowerKw: WallboxChargingPowerKw;
        pvChargingSharePercent: number;
      };
    };
