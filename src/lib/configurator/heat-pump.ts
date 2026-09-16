import { DEFAULT_HEAT_PUMP_CALCULATOR_INPUT } from "@/lib/calculators/heat-pump-model";
import { getHeatPumpHeatingComparisonModel } from "@/lib/configurator/heat-pump-existing-system";
import { deriveHeatPumpResult } from "../../../functions/src/configurator-technical-model";
import type { ConfiguratorState, HeatPumpConfiguratorResult } from "@/types/configurator";

export function buildHeatPumpConfiguratorResult(
  state: ConfiguratorState,
): HeatPumpConfiguratorResult | null {
  const {
    existingHeatingSystem,
    annualGasConsumptionKwh,
    annualOilConsumptionLitres,
    heatedAreaM2,
    specificSpaceHeatingDemandKwhPerM2Year,
    occupancyPersons,
    requiredFlowTemperatureC,
    annualPerformanceFactor,
  } = state.heatPump;
  if (
    existingHeatingSystem === undefined ||
    heatedAreaM2 === undefined ||
    specificSpaceHeatingDemandKwhPerM2Year === undefined ||
    occupancyPersons === undefined ||
    requiredFlowTemperatureC === undefined ||
    annualPerformanceFactor === undefined
  ) return null;

  const hasUserConsumption =
    (existingHeatingSystem === "gas" && annualGasConsumptionKwh !== undefined) ||
    (existingHeatingSystem === "oil" && annualOilConsumptionLitres !== undefined);
  const comparison = getHeatPumpHeatingComparisonModel(
    existingHeatingSystem,
    hasUserConsumption,
    state.settings,
  );
  const calculationInput = {
    ...DEFAULT_HEAT_PUMP_CALCULATOR_INPUT,
    hotWaterDemandKwhPerPersonYear: state.settings.heatPump.hotWaterDemandKwhPerPersonYear,
    equivalentFullLoadHours: state.settings.heatPump.equivalentFullLoadHours,
    capacityReservePercent: state.settings.heatPump.capacityReservePercent,
    electricityPriceEuroPerKwh: state.settings.heatPump.electricityPriceEuroPerKwh,
    heatPumpCostEuroPerKw: state.settings.heatPump.heatPumpCostEuroPerKw,
    installationBaseCostEuro: state.settings.heatPump.installationBaseCostEuro,
    fixedAdditionalCostEuro: state.settings.heatPump.fixedAdditionalCostEuro,
    costUncertaintyPercent: state.settings.general.costUncertaintyPercent,
    heatedAreaM2,
    specificSpaceHeatingDemandKwhPerM2Year,
    occupancyPersons,
    requiredFlowTemperatureC,
    annualPerformanceFactor,
    currentHeatingEnergyPriceEuroPerKwh: comparison.energyPriceEuroPerKwh,
    currentHeatingEfficiencyPercent:
      comparison.efficiencyPercent ?? DEFAULT_HEAT_PUMP_CALCULATOR_INPUT.currentHeatingEfficiencyPercent,
  };
  return {
    calculationInput,
    ...deriveHeatPumpResult(
      {
        existingHeatingSystem,
        annualGasConsumptionKwh,
        annualOilConsumptionLitres,
        heatedAreaM2,
        specificSpaceHeatingDemandKwhPerM2Year,
        occupancyPersons,
        requiredFlowTemperatureC,
        annualPerformanceFactor,
      },
      state.settings,
    ),
  };
}
