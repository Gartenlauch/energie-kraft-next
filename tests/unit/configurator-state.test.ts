import { describe, expect, it } from "vitest";

import {
  calculateProjectedConsumptionKwh,
  configuratorReducer,
  createInitialConfiguratorState,
} from "@/lib/configurator/state";

describe("configurator state", () => {
  it("creates the expected initial state", () => {
    const state = createInitialConfiguratorState();

    expect(state.version).toBe(1);
    expect(state.activeConfigurator).toBeNull();

    expect(state.household).toEqual({
      futureIncreasePercent: 10,
    });

    expect(state.interests).toEqual({
      batteryStorage: false,
      climate: false,
      heatPump: false,
      wallbox: false,
    });
  });

  it("calculates projected consumption", () => {
    expect(calculateProjectedConsumptionKwh(3000, 10)).toBe(3300);
    expect(calculateProjectedConsumptionKwh(3000, 25)).toBe(3750);
    expect(calculateProjectedConsumptionKwh(undefined, 10)).toBeUndefined();
  });

  it("recalculates projected consumption when annual consumption changes", () => {
    const initialState = createInitialConfiguratorState();

    const state = configuratorReducer(initialState, {
      type: "UPDATE_HOUSEHOLD",
      payload: {
        annualConsumptionKwh: 3000,
      },
    });

    expect(state.household.annualConsumptionKwh).toBe(3000);
    expect(state.household.futureIncreasePercent).toBe(10);
    expect(state.household.projectedConsumptionKwh).toBe(3300);
  });

  it("recalculates projected consumption when future increase changes", () => {
    const initialState = configuratorReducer(
      createInitialConfiguratorState(),
      {
        type: "UPDATE_HOUSEHOLD",
        payload: {
          annualConsumptionKwh: 3000,
        },
      },
    );

    const state = configuratorReducer(initialState, {
      type: "UPDATE_HOUSEHOLD",
      payload: {
        futureIncreasePercent: 50,
      },
    });

    expect(state.household.projectedConsumptionKwh).toBe(4500);
  });

  it("keeps household data when another configurator becomes active", () => {
    let state = configuratorReducer(
      createInitialConfiguratorState(),
      {
        type: "UPDATE_HOUSEHOLD",
        payload: {
          persons: 3,
          annualConsumptionKwh: 3000,
        },
      },
    );

    state = configuratorReducer(state, {
      type: "SET_ACTIVE_CONFIGURATOR",
      payload: "battery_storage",
    });

    expect(state.activeConfigurator).toBe("battery_storage");
    expect(state.household.persons).toBe(3);
    expect(state.household.annualConsumptionKwh).toBe(3000);
    expect(state.household.projectedConsumptionKwh).toBe(3300);
  });

  it("resets the complete configurator state", () => {
    let state = configuratorReducer(
      createInitialConfiguratorState(),
      {
        type: "UPDATE_INTERESTS",
        payload: {
          batteryStorage: true,
          wallbox: true,
        },
      },
    );

    state = configuratorReducer(state, {
      type: "RESET",
    });

    expect(state).toEqual(createInitialConfiguratorState());
  });
});