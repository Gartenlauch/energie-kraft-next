import type { ConfiguratorSettings } from "./configurator-settings-model.js";
import { calculateCanonicalProjectEconomics } from "./configurator-project-economics.js";
import {
  deriveBatteryStorageResult,
  deriveClimateResult,
  deriveHeatPumpResult,
  derivePhotovoltaicResult,
  deriveWallboxResult,
} from "./configurator-technical-model.js";
import type {
  ConfiguratorLeadPayload,
  ConfiguratorPayload,
} from "./configurator-lead-validation.js";

function repriceConfigurator(
  configurator: ConfiguratorPayload,
  settings: ConfiguratorSettings,
  photovoltaicResult: Extract<ConfiguratorPayload, { type: "photovoltaic" }>["result"] | undefined,
  modularExpansionRecommended: boolean,
): ConfiguratorPayload {
  if (configurator.type === "photovoltaic") {
    const result = photovoltaicResult ?? derivePhotovoltaicResult(configurator.answers, settings);
    return {
      ...configurator,
      answers: {
        ...configurator.answers,
        household: {
          ...configurator.answers.household,
          projectedConsumptionKwh: result.projectedAnnualConsumptionKwh,
        },
      },
      result,
    };
  }
  if (configurator.type === "battery_storage") {
    return {
      ...configurator,
      result: deriveBatteryStorageResult(
        configurator.answers,
        photovoltaicResult,
        modularExpansionRecommended,
        settings,
      ),
    };
  }
  if (configurator.type === "heat_pump") {
    return {
      ...configurator,
      result: deriveHeatPumpResult(configurator.answers, settings),
    };
  }
  if (configurator.type === "climate") {
    return {
      ...configurator,
      result: deriveClimateResult(configurator.answers, settings),
    };
  }
  return {
    ...configurator,
    result: deriveWallboxResult(configurator.answers, settings),
  };
}

export function applyAuthoritativeConfiguratorModel(
  lead: ConfiguratorLeadPayload,
  settings: ConfiguratorSettings,
): ConfiguratorLeadPayload {
  const photovoltaicInput = lead.configurators.find(
    (item): item is Extract<ConfiguratorPayload, { type: "photovoltaic" }> =>
      item.type === "photovoltaic",
  );
  const photovoltaicResult = photovoltaicInput
    ? derivePhotovoltaicResult(photovoltaicInput.answers, settings)
    : undefined;
  const modularExpansionRecommended = lead.journey.selectedProducts.some(
    (product) => product === "wallbox" || product === "heat_pump" || product === "climate",
  );
  const configurators = lead.configurators.map((item) =>
    repriceConfigurator(item, settings, photovoltaicResult, modularExpansionRecommended),
  );
  const resultFor = <T extends ConfiguratorPayload["type"]>(type: T) =>
    configurators.find((item) => item.type === type)?.result;
  const economics = calculateCanonicalProjectEconomics({
    photovoltaic: resultFor("photovoltaic") as Extract<ConfiguratorPayload, { type: "photovoltaic" }>["result"] | undefined,
    batteryStorage: resultFor("battery_storage") as Extract<ConfiguratorPayload, { type: "battery_storage" }>["result"] | undefined,
    heatPump: resultFor("heat_pump") as Extract<ConfiguratorPayload, { type: "heat_pump" }>["result"] | undefined,
    climate: resultFor("climate") as Extract<ConfiguratorPayload, { type: "climate" }>["result"] | undefined,
    wallbox: resultFor("wallbox") as Extract<ConfiguratorPayload, { type: "wallbox" }>["result"] | undefined,
  }, settings);
  return { ...lead, configurators, economics };
}
