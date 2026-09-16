import type { ClimateInsulationLevel, ClimateSolarLoad } from "@/types/climate-calculator";
import type { PvRoofOrientation } from "@/types/pv-sizing-calculator";
import type { WallboxChargingPowerKw } from "./wallbox";
import type { ConfiguratorSettings } from "@/lib/configurator/settings-model";

type CalculatorHandoffBase = {
  version: 1;
  createdAt: number;
  settings: ConfiguratorSettings;
};

export type CalculatorHandoff =
  | (CalculatorHandoffBase & {
      source: "pv_sizing";
      values: { annualConsumptionKwh: number; roofOrientation: PvRoofOrientation };
    })
  | (CalculatorHandoffBase & { source: "pv_roi"; values: { annualConsumptionKwh: number } })
  | (CalculatorHandoffBase & {
      source: "heat_pump";
      values: {
        heatedAreaM2: number;
        specificSpaceHeatingDemandKwhPerM2Year: number;
        occupancyPersons: number;
        requiredFlowTemperatureC: number;
        annualPerformanceFactor: number;
      };
    })
  | (CalculatorHandoffBase & {
      source: "climate";
      values: {
        conditionedAreaM2: number;
        roomCount: number;
        insulationLevel: ClimateInsulationLevel;
        solarLoad: ClimateSolarLoad;
        occupancyPersons: number;
      };
    })
  | (CalculatorHandoffBase & {
      source: "wallbox";
      values: {
        annualDrivingKm: number;
        vehicleConsumptionKwhPer100Km: number;
        batteryCapacityKwh: number;
        homeChargingSharePercent: number;
        chargingPowerKw: WallboxChargingPowerKw;
        pvChargingSharePercent: number;
      };
    });
