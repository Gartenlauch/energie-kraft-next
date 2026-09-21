import { describe, expect, it } from "vitest";
import { configuratorLeadPayloadSchema } from "../../functions/src/configurator-lead-validation";
import { buildBatteryStorageConfiguratorResult } from "@/lib/configurator/battery-storage";
import { buildClimateConfiguratorResult } from "@/lib/configurator/climate";
import { buildHeatPumpConfiguratorResult } from "@/lib/configurator/heat-pump";
import { buildConfiguratorLeadInput } from "@/lib/configurator/lead";
import { buildPhotovoltaicConfiguratorResult } from "@/lib/configurator/photovoltaic";
import { configuratorReducer, createInitialConfiguratorState } from "@/lib/configurator/state";
import { buildWallboxConfiguratorResult } from "@/lib/configurator/wallbox";
import { configuratorLeadInputSchema } from "@/lib/validation/configurator/lead";
import type { ConfiguratorContactFormValues, ConfiguratorState, ConfiguratorType } from "@/types/configurator";

const contact: ConfiguratorContactFormValues = {
  firstName: "Max", lastName: "Mustermann", email: "max@example.de", phone: "",
  installationAtResidence: true, street: "Musterstraße 1", postalCode: "83395",
  city: "Freilassing", privacyAccepted: true, website: "",
};

function completeProduct(
  product: ConfiguratorType,
  startingState: ConfiguratorState = createInitialConfiguratorState(),
): ConfiguratorState {
  let state = startingState.journey.entryPoint ? startingState : configuratorReducer(startingState, {
    type: "SET_ACTIVE_CONFIGURATOR", payload: product,
  });
  switch (product) {
    case "photovoltaic": {
      state = configuratorReducer(state, { type: "UPDATE_HOUSEHOLD", payload: {
        persons: 3, annualConsumptionKwh: 4_500, futureIncreasePercent: 10,
      } });
      state = configuratorReducer(state, { type: "UPDATE_BUILDING", payload: {
        ownership: "owner", type: "detached_house",
      } });
      state = configuratorReducer(state, { type: "UPDATE_ROOF", payload: {
        pitch: 30, material: "roof_tile", orientation: "south", renovationPeriod: "after_1990",
      } });
      state = configuratorReducer(state, { type: "UPDATE_NOTES", payload: { hasNotes: false, text: "" } });
      const result = buildPhotovoltaicConfiguratorResult(state);
      if (!result) throw new Error("PV fixture incomplete");
      return configuratorReducer(state, { type: "SET_PHOTOVOLTAIC_RESULT", payload: result });
    }
    case "heat_pump": {
      state = configuratorReducer(state, { type: "UPDATE_HEAT_PUMP", payload: {
        existingHeatingSystem: "gas", heatedAreaM2: 160,
        specificSpaceHeatingDemandKwhPerM2Year: 90, occupancyPersons: 4,
        requiredFlowTemperatureC: 50, annualPerformanceFactor: 3.5,
      } });
      const result = buildHeatPumpConfiguratorResult(state);
      if (!result) throw new Error("Heat pump fixture incomplete");
      return configuratorReducer(state, { type: "SET_HEAT_PUMP_RESULT", payload: result });
    }
    case "climate": {
      state = configuratorReducer(state, { type: "UPDATE_CLIMATE", payload: {
        conditionedAreaM2: 80, roomCount: 4, insulationLevel: "average",
        solarLoad: "medium", occupancyPersons: 4,
      } });
      const result = buildClimateConfiguratorResult(state);
      if (!result) throw new Error("Climate fixture incomplete");
      return configuratorReducer(state, { type: "SET_CLIMATE_RESULT", payload: result });
    }
    case "wallbox": {
      state = configuratorReducer(state, { type: "UPDATE_WALLBOX", payload: {
        annualDrivingKm: 15_000, vehicleConsumptionKwhPer100Km: 18,
        batteryCapacityKwh: 60, homeChargingSharePercent: 80,
        chargingPowerKw: 11, pvChargingSharePercent: 30,
      } });
      const result = buildWallboxConfiguratorResult(state);
      if (!result) throw new Error("Wallbox fixture incomplete");
      return configuratorReducer(state, { type: "SET_WALLBOX_RESULT", payload: result });
    }
    case "battery_storage": {
      state = configuratorReducer(state, { type: "UPDATE_BATTERY_STORAGE", payload: {
        consumptionPattern: "mixed", backupPreference: "none", goal: "balanced",
      } });
      const result = buildBatteryStorageConfiguratorResult(state);
      if (!result) throw new Error("Storage fixture incomplete");
      return configuratorReducer(state, { type: "SET_BATTERY_STORAGE_RESULT", payload: result });
    }
  }
}

function completePvProject(additional: readonly ConfiguratorType[]): ConfiguratorState {
  let state = configuratorReducer(createInitialConfiguratorState(), {
    type: "SET_ACTIVE_CONFIGURATOR", payload: "photovoltaic",
  });
  state = configuratorReducer(state, { type: "UPDATE_INTERESTS", payload: {
    batteryStorage: additional.includes("battery_storage"),
    heatPump: additional.includes("heat_pump"),
    climate: additional.includes("climate"),
    wallbox: additional.includes("wallbox"),
  } });
  for (const product of ["photovoltaic", ...additional] as ConfiguratorType[]) {
    state = completeProduct(product, state);
  }
  return state;
}

describe("single-product submit completeness", () => {
  it.each(["photovoltaic", "heat_pump", "climate", "wallbox"] as const)(
    "%s alone is submit-ready with completed result and valid contact", (product) => {
      const state = completeProduct(product);
      expect(state.journey.selectedProducts).toEqual([product]);
      expect(state.journey.completedProducts).toEqual([product]);
      expect(state.journey.additionalSolutionsReviewed).toBe(false);
      const input = buildConfiguratorLeadInput(state, contact, Date.now() - 10_000);
      expect(input).not.toBeNull();
      const parsed = configuratorLeadInputSchema.safeParse(input);
      expect(parsed.success ? [] : parsed.error.issues).toEqual([]);
      expect(configuratorLeadPayloadSchema.safeParse(input).success).toBe(true);
    },
  );

  it("blocks an unfinished selected product", () => {
    const state = configuratorReducer(completeProduct("photovoltaic"), {
      type: "UPDATE_INTERESTS", payload: { batteryStorage: true },
    });
    expect(state.journey.selectedProducts).toEqual(["photovoltaic", "battery_storage"]);
    expect(state.journey.completedProducts).toEqual(["photovoltaic"]);
    expect(buildConfiguratorLeadInput(state, contact, Date.now() - 10_000)).toBeNull();
  });

  it("blocks missing contact data", () => {
    const input = buildConfiguratorLeadInput(completeProduct("climate"), {
      ...contact, firstName: "",
    }, Date.now() - 10_000);
    expect(input).not.toBeNull();
    expect(configuratorLeadInputSchema.safeParse(input).success).toBe(false);
  });

  it("blocks missing installation location", () => {
    const state = completeProduct("wallbox");
    expect(buildConfiguratorLeadInput(state, {
      ...contact, installationAtResidence: null,
    }, Date.now() - 10_000)).toBeNull();
    const input = buildConfiguratorLeadInput(state, { ...contact, street: "" }, Date.now() - 10_000);
    expect(configuratorLeadInputSchema.safeParse(input).success).toBe(false);
  });

  it.each([
    ["PV + Storage", ["battery_storage"]],
    ["all five", ["battery_storage", "heat_pump", "climate", "wallbox"]],
  ] as const)("keeps %s submit-ready", (_label, additional) => {
    const state = completePvProject(additional);
    expect(state.journey.selectedProducts).toEqual(state.journey.completedProducts);
    const input = buildConfiguratorLeadInput(state, contact, Date.now() - 10_000);
    expect(input).not.toBeNull();
    expect(configuratorLeadInputSchema.safeParse(input).success).toBe(true);
    expect(configuratorLeadPayloadSchema.safeParse(input).success).toBe(true);
  });
});
