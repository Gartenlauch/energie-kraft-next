import {
    heatPumpAnnualPerformanceFactorSchema,
    heatPumpFlowTemperatureSchema,
    heatPumpHeatedAreaSchema,
    heatPumpOccupancyPersonsSchema,
    heatPumpSpecificHeatingDemandSchema,
  } from "@/lib/validation/configurator/state";
  import type {
    ConfiguratorState,
    HeatPumpStepId,
  } from "@/types/configurator";
  
  export function isHeatPumpStepComplete(
    stepId: HeatPumpStepId,
    state: ConfiguratorState,
  ): boolean {
    const heatPump = state.heatPump;
  
    switch (stepId) {
      case "heated_area":
        return heatPumpHeatedAreaSchema.safeParse(
          heatPump.heatedAreaM2,
        ).success;
  
      case "heating_demand":
        return heatPumpSpecificHeatingDemandSchema.safeParse(
          heatPump.specificSpaceHeatingDemandKwhPerM2Year,
        ).success;
  
      case "occupancy":
        return heatPumpOccupancyPersonsSchema.safeParse(
          heatPump.occupancyPersons,
        ).success;
  
      case "flow_temperature":
        return heatPumpFlowTemperatureSchema.safeParse(
          heatPump.requiredFlowTemperatureC,
        ).success;
  
      case "efficiency":
        return heatPumpAnnualPerformanceFactorSchema.safeParse(
          heatPump.annualPerformanceFactor,
        ).success;
    }
  }