import { describe, expect, it } from "vitest";
import { buildWallboxConfiguratorResult } from "@/lib/configurator/wallbox";

import {
  buildConfiguratorJourney,
  getNextConfiguratorProduct,
  shouldReviewAdditionalEnergySolutions,
} from "@/lib/configurator/journey";
import { configuratorReducer, createInitialConfiguratorState } from "@/lib/configurator/state";
import {
  buildBatteryStorageConfiguratorResult,
  buildBatteryStoragePhotovoltaicHandoff,
} from "@/lib/configurator/battery-storage";
import { buildPhotovoltaicConfiguratorResult } from "@/lib/configurator/photovoltaic";
import { parseConfiguratorState } from "@/lib/validation/configurator/state";

describe("configurator journey", () => {
  it("builds the selected products in the canonical order", () => {
    const state = createInitialConfiguratorState();

    const journey = buildConfiguratorJourney(
      "photovoltaic",
      {
        photovoltaic: false,
        batteryStorage: true,
        climate: true,
        heatPump: true,
        wallbox: false,
      },
      state.results,
    );

    expect(journey.selectedProducts).toEqual([
      "photovoltaic",
      "battery_storage",
      "heat_pump",
      "climate",
    ]);

    expect(journey.completedProducts).toEqual([]);
  });

  it("detects completed configurators from their results", () => {
    const state = createInitialConfiguratorState();

    const wallboxResult = buildWallboxConfiguratorResult({
      ...state,

      wallbox: {
        annualDrivingKm: 15_000,
        vehicleConsumptionKwhPer100Km: 18,
        batteryCapacityKwh: 60,
        homeChargingSharePercent: 80,
        chargingPowerKw: 11,
        pvChargingSharePercent: 30,
      },
    });

    expect(wallboxResult).not.toBeNull();

    if (!wallboxResult) {
      throw new Error("Expected a valid wallbox configurator result.");
    }

    const journey = buildConfiguratorJourney("wallbox", state.interests, {
      ...state.results,
      wallbox: wallboxResult,
    });

    expect(journey.completedProducts).toEqual(["wallbox"]);
  });

  it("returns the next selected incomplete configurator", () => {
    const journey = buildConfiguratorJourney(
      "photovoltaic",
      {
        photovoltaic: false,
        batteryStorage: true,
        wallbox: false,
        heatPump: true,
        climate: true,
      },
      {},
    );

    expect(getNextConfiguratorProduct(journey, "photovoltaic")).toBe("battery_storage");
  });
  it("adds photovoltaic energy-solution selections to the journey", () => {
    const state = createInitialConfiguratorState();

    const journey = buildConfiguratorJourney(
      "photovoltaic",
      {
        photovoltaic: false,
        batteryStorage: true,
        wallbox: true,
        heatPump: true,
        climate: true,
      },
      state.results,
    );

    expect(journey.selectedProducts).toEqual([
      "photovoltaic",
      "battery_storage",
      "heat_pump",
      "climate",
      "wallbox",
    ]);
  });
  it("moves through a complete multi-configurator journey in order", () => {
    const selectedProducts = [
      "photovoltaic",
      "battery_storage",
      "heat_pump",
      "climate",
      "wallbox",
    ] as const;

    expect(
      getNextConfiguratorProduct(
        {
          entryPoint: "photovoltaic",
          selectedProducts: [...selectedProducts],
          completedProducts: ["photovoltaic"],
          additionalSolutionsReviewed: true,
        },
        "photovoltaic",
      ),
    ).toBe("battery_storage");

    expect(
      getNextConfiguratorProduct(
        {
          entryPoint: "photovoltaic",
          selectedProducts: [...selectedProducts],
          completedProducts: ["photovoltaic", "battery_storage"],
          additionalSolutionsReviewed: true,
        },
        "battery_storage",
      ),
    ).toBe("heat_pump");

    expect(
      getNextConfiguratorProduct(
        {
          entryPoint: "photovoltaic",
          selectedProducts: [...selectedProducts],
          completedProducts: ["photovoltaic", "battery_storage", "heat_pump"],
          additionalSolutionsReviewed: true,
        },
        "heat_pump",
      ),
    ).toBe("climate");

    expect(
      getNextConfiguratorProduct(
        {
          entryPoint: "photovoltaic",
          selectedProducts: [...selectedProducts],
          completedProducts: ["photovoltaic", "battery_storage", "heat_pump", "climate"],
          additionalSolutionsReviewed: true,
        },
        "climate",
      ),
    ).toBe("wallbox");

    expect(
      getNextConfiguratorProduct(
        {
          entryPoint: "photovoltaic",
          selectedProducts: [...selectedProducts],
          completedProducts: [...selectedProducts],
          additionalSolutionsReviewed: true,
        },
        "wallbox",
      ),
    ).toBeNull();
  });

  it("skips the completed entry product after a climate-first scope decision", () => {
    const journey = buildConfiguratorJourney(
      "climate",
      { photovoltaic: true, batteryStorage: true, wallbox: false, heatPump: true, climate: false },
      {},
      true,
    );

    journey.completedProducts = ["climate"];
    expect(journey.selectedProducts).toEqual(["photovoltaic", "battery_storage", "heat_pump", "climate"]);
    expect(getNextConfiguratorProduct(journey, "climate")).toBe("photovoltaic");
    journey.completedProducts.push("photovoltaic");
    expect(getNextConfiguratorProduct(journey, "photovoltaic")).toBe("battery_storage");
    journey.completedProducts.push("battery_storage");
    expect(getNextConfiguratorProduct(journey, "battery_storage")).toBe("heat_pump");
    journey.completedProducts.push("heat_pump");
    expect(getNextConfiguratorProduct(journey, "heat_pump")).toBeNull();
    expect(shouldReviewAdditionalEnergySolutions(journey, "climate")).toBe(false);
  });

  it("preserves PV context and submission after entering Storage", () => {
    let state = createInitialConfiguratorState();
    state = configuratorReducer(state, { type: "SET_ACTIVE_CONFIGURATOR", payload: "photovoltaic" });
    state = configuratorReducer(state, { type: "UPDATE_INTERESTS", payload: { batteryStorage: true } });
    state = configuratorReducer(state, { type: "MARK_ADDITIONAL_SOLUTIONS_REVIEWED" });
    state = configuratorReducer(state, { type: "UPDATE_HOUSEHOLD", payload: { persons: 3, annualConsumptionKwh: 4_500 } });
    state = configuratorReducer(state, { type: "UPDATE_BUILDING", payload: { ownership: "owner", type: "detached_house" } });
    state = configuratorReducer(state, { type: "UPDATE_ROOF", payload: {
      pitch: 30, material: "roof_tile", orientation: "south", renovationPeriod: "after_1990",
    } });
    const pv = buildPhotovoltaicConfiguratorResult(state);
    expect(pv).not.toBeNull();
    state = configuratorReducer(state, { type: "SET_PHOTOVOLTAIC_RESULT", payload: pv! });
    state = configuratorReducer(state, { type: "SET_ACTIVE_CONFIGURATOR", payload: "battery_storage" });
    expect(buildBatteryStoragePhotovoltaicHandoff(state)?.recommendedPvPowerKwpMin)
      .toBe(pv?.recommendedPowerKwpMin);
    expect(getNextConfiguratorProduct(state.journey, "photovoltaic")).toBe("battery_storage");
    state = configuratorReducer(state, { type: "UPDATE_BATTERY_STORAGE", payload: {
      consumptionPattern: "mixed", backupPreference: "none", goal: "balanced",
    } });
    const storage = buildBatteryStorageConfiguratorResult(state);
    expect(storage).not.toBeNull();
    state = configuratorReducer(state, { type: "SET_BATTERY_STORAGE_RESULT", payload: storage! });
    expect(state.journey.completedProducts).toEqual(["photovoltaic", "battery_storage"]);
    expect(getNextConfiguratorProduct(state.journey, "battery_storage")).toBeNull();
    state = configuratorReducer(state, { type: "SET_SUBMISSION", payload: {
      status: "submitted", publicReference: "PV-BS-00001",
    } });
    state = configuratorReducer(state, { type: "SET_ACTIVE_CONFIGURATOR", payload: "battery_storage" });
    expect(state.results.photovoltaic).toEqual(pv);
    expect(state.submission).toEqual({ status: "submitted", publicReference: "PV-BS-00001" });
    expect(parseConfiguratorState(state)?.submission.status).toBe("submitted");
  });

  it("asks standalone heat-pump and climate journeys only while the decision is open", () => {
    const heatPump = buildConfiguratorJourney(
      "heat_pump",
      createInitialConfiguratorState().interests,
      {},
    );
    const climate = buildConfiguratorJourney(
      "climate",
      createInitialConfiguratorState().interests,
      {},
    );

    expect(shouldReviewAdditionalEnergySolutions(heatPump, "heat_pump")).toBe(true);
    expect(shouldReviewAdditionalEnergySolutions(climate, "climate")).toBe(true);
    expect(shouldReviewAdditionalEnergySolutions(heatPump, "battery_storage")).toBe(false);
    expect(shouldReviewAdditionalEnergySolutions(heatPump, "wallbox")).toBe(false);
  });

  it("does not ask again after the photovoltaic decision, including an empty selection", () => {
    let state = configuratorReducer(createInitialConfiguratorState(), {
      type: "SET_ACTIVE_CONFIGURATOR",
      payload: "photovoltaic",
    });
    state = configuratorReducer(state, { type: "MARK_ADDITIONAL_SOLUTIONS_REVIEWED" });

    expect(state.journey.additionalSolutionsReviewed).toBe(true);
    expect(shouldReviewAdditionalEnergySolutions(state.journey, "heat_pump")).toBe(false);
    expect(shouldReviewAdditionalEnergySolutions(state.journey, "climate")).toBe(false);
  });
});
