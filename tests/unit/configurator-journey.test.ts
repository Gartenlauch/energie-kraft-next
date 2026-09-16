import { describe, expect, it } from "vitest";
import { buildWallboxConfiguratorResult } from "@/lib/configurator/wallbox";

import {
  buildConfiguratorJourney,
  getNextConfiguratorProduct,
  shouldReviewAdditionalEnergySolutions,
} from "@/lib/configurator/journey";
import { configuratorReducer, createInitialConfiguratorState } from "@/lib/configurator/state";

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
      "wallbox",
      "heat_pump",
      "climate",
    ]);
  });
  it("moves through a complete multi-configurator journey in order", () => {
    const selectedProducts = [
      "photovoltaic",
      "battery_storage",
      "wallbox",
      "heat_pump",
      "climate",
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
    ).toBe("wallbox");

    expect(
      getNextConfiguratorProduct(
        {
          entryPoint: "photovoltaic",
          selectedProducts: [...selectedProducts],
          completedProducts: ["photovoltaic", "battery_storage", "wallbox"],
          additionalSolutionsReviewed: true,
        },
        "wallbox",
      ),
    ).toBe("heat_pump");

    expect(
      getNextConfiguratorProduct(
        {
          entryPoint: "photovoltaic",
          selectedProducts: [...selectedProducts],
          completedProducts: ["photovoltaic", "battery_storage", "wallbox", "heat_pump"],
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
          completedProducts: [...selectedProducts],
          additionalSolutionsReviewed: true,
        },
        "climate",
      ),
    ).toBeNull();
  });

  it("keeps a standalone entry product first and never loops", () => {
    const journey = buildConfiguratorJourney(
      "heat_pump",
      { photovoltaic: true, batteryStorage: false, wallbox: false, heatPump: false, climate: true },
      {},
    );

    expect(journey.selectedProducts).toEqual(["heat_pump", "photovoltaic", "climate"]);
    expect(getNextConfiguratorProduct(journey, "heat_pump")).toBe("photovoltaic");
    expect(getNextConfiguratorProduct(journey, "photovoltaic")).toBe("climate");
    expect(getNextConfiguratorProduct(journey, "climate")).toBeNull();
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
