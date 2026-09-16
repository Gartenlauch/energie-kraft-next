import type {
  ExistingHeatingSystem,
  HeatingComparisonBasis,
  HeatingComparisonKind,
} from "@/types/configurator";
import {
  DEFAULT_CONFIGURATOR_SETTINGS,
  type ConfiguratorSettings,
} from "@/lib/configurator/settings-model";

export const HEAT_PUMP_EXISTING_SYSTEM_ASSUMPTIONS = {
  gas: {
    label: "Gasheizung",
    fuelPriceEuroPerUnit: 0.12,
    fuelUnit: "kWh",
    efficiencyPercent: 85,
    energyPriceEuroPerKwh: 0.12,
    oilEnergyContentKwhPerLitre: null,
  },
  oil: {
    label: "Ölheizung",
    fuelPriceEuroPerUnit: 1.1,
    fuelUnit: "litre",
    efficiencyPercent: 80,
    energyPriceEuroPerKwh: 0.11,
    oilEnergyContentKwhPerLitre: 10,
  },
} as const;

export interface HeatPumpHeatingComparisonModel {
  kind: HeatingComparisonKind;
  basis: HeatingComparisonBasis;
  label: string;
  energyPriceEuroPerKwh: number;
  fuelPriceEuroPerUnit: number | null;
  fuelUnit: "kWh" | "litre" | null;
  efficiencyPercent: number | null;
  oilEnergyContentKwhPerLitre: number | null;
}

export function getHeatPumpHeatingComparisonModel(
  system: ExistingHeatingSystem,
  hasUserConsumption: boolean,
  settings: ConfiguratorSettings = DEFAULT_CONFIGURATOR_SETTINGS,
): HeatPumpHeatingComparisonModel {
  const assumptions = {
    gas: {
      label: "Gasheizung",
      fuelPriceEuroPerUnit: settings.heatPump.gasPriceEuroPerKwh,
      fuelUnit: "kWh" as const,
      efficiencyPercent: settings.heatPump.gasHeatingEfficiencyPercent,
      energyPriceEuroPerKwh: settings.heatPump.gasPriceEuroPerKwh,
      oilEnergyContentKwhPerLitre: null,
    },
    oil: {
      label: "Ölheizung",
      fuelPriceEuroPerUnit: settings.heatPump.oilPriceEuroPerLitre,
      fuelUnit: "litre" as const,
      efficiencyPercent: settings.heatPump.oilHeatingEfficiencyPercent,
      energyPriceEuroPerKwh:
        settings.heatPump.oilPriceEuroPerLitre /
        settings.heatPump.oilEnergyContentKwhPerLitre,
      oilEnergyContentKwhPerLitre: settings.heatPump.oilEnergyContentKwhPerLitre,
    },
  };
  if (system === "other_unknown") {
    return {
      kind: "unavailable",
      basis: "unavailable",
      label: "Vergleich nicht verfügbar",
      energyPriceEuroPerKwh: assumptions.gas.energyPriceEuroPerKwh,
      fuelPriceEuroPerUnit: null,
      fuelUnit: null,
      efficiencyPercent: null,
      oilEnergyContentKwhPerLitre: null,
    };
  }

  const modeledSystem = system === "new_build" ? "oil" : system;
  const assumption = assumptions[modeledSystem];

  return {
    kind: system === "new_build" ? "reference_scenario" : "existing_system",
    basis: hasUserConsumption ? "user_consumption" : "modeled_heat_demand",
    label:
      system === "new_build"
        ? "Modelliertes Referenzszenario: Öl-Zentralheizung"
        : assumption.label,
    energyPriceEuroPerKwh: assumption.energyPriceEuroPerKwh,
    fuelPriceEuroPerUnit: assumption.fuelPriceEuroPerUnit,
    fuelUnit: assumption.fuelUnit,
    efficiencyPercent: assumption.efficiencyPercent,
    oilEnergyContentKwhPerLitre: assumption.oilEnergyContentKwhPerLitre,
  };
}
