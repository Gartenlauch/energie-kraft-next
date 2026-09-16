import { DEFAULT_CLIMATE_CALCULATOR_INPUT } from "@/lib/calculators/climate-model";
import { deriveClimateResult } from "../../../functions/src/configurator-technical-model";
import type { ClimateConfiguratorResult, ConfiguratorState } from "@/types/configurator";

export function buildClimateConfiguratorResult(
  state: ConfiguratorState,
): ClimateConfiguratorResult | null {
  const {
    conditionedAreaM2,
    roomCount,
    insulationLevel,
    solarLoad,
    occupancyPersons,
  } = state.climate;
  if (
    conditionedAreaM2 === undefined ||
    roomCount === undefined ||
    insulationLevel === undefined ||
    solarLoad === undefined ||
    occupancyPersons === undefined
  ) return null;

  const calculationInput = {
    ...DEFAULT_CLIMATE_CALCULATOR_INPUT,
    annualEquivalentFullLoadHours: state.settings.climate.annualEquivalentFullLoadHours,
    seasonalEfficiencySeer: state.settings.climate.seasonalEfficiencySeer,
    electricityPriceEuroPerKwh: state.settings.climate.electricityPriceEuroPerKwh,
    equipmentCostEuroPerKw: state.settings.climate.equipmentCostEuroPerKw,
    indoorUnitCostEuro: state.settings.climate.indoorUnitCostEuro,
    installationBaseCostEuro: state.settings.climate.installationBaseCostEuro,
    installationCostPerIndoorUnitEuro: state.settings.climate.installationCostPerIndoorUnitEuro,
    fixedAdditionalCostEuro: state.settings.climate.fixedAdditionalCostEuro,
    costUncertaintyPercent: state.settings.general.costUncertaintyPercent,
    conditionedAreaM2,
    roomCount,
    insulationLevel,
    solarLoad,
    occupancyPersons,
  };
  return {
    calculationInput,
    ...deriveClimateResult(
      { conditionedAreaM2, roomCount, insulationLevel, solarLoad, occupancyPersons },
      state.settings,
    ),
  };
}
