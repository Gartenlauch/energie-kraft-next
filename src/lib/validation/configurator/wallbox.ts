import {
    wallboxAnnualDrivingKmSchema,
    wallboxBatteryCapacitySchema,
    wallboxChargingPowerSchema,
    wallboxHomeChargingShareSchema,
    wallboxPvChargingShareSchema,
    wallboxVehicleConsumptionSchema,
  } from "@/lib/validation/configurator/state";
  import type {
    ConfiguratorState,
    WallboxStepId,
  } from "@/types/configurator";
  
  export function isWallboxStepComplete(
    stepId: WallboxStepId,
    state: ConfiguratorState,
  ): boolean {
    const wallbox = state.wallbox;
  
    switch (stepId) {
      case "vehicle_data":
        return (
          wallboxAnnualDrivingKmSchema.safeParse(
            wallbox.annualDrivingKm,
          ).success &&
          wallboxVehicleConsumptionSchema.safeParse(
            wallbox.vehicleConsumptionKwhPer100Km,
          ).success &&
          wallboxBatteryCapacitySchema.safeParse(
            wallbox.batteryCapacityKwh,
          ).success
        );
  
      case "home_charging":
        return wallboxHomeChargingShareSchema.safeParse(
          wallbox.homeChargingSharePercent,
        ).success;
  
      case "charging_power":
        return wallboxChargingPowerSchema.safeParse(
          wallbox.chargingPowerKw,
        ).success;
  
      case "photovoltaics":
        return wallboxPvChargingShareSchema.safeParse(
          wallbox.pvChargingSharePercent,
        ).success;
    }
  }