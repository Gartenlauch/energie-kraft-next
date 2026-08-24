import {
  describe,
  expect,
  it,
} from "vitest";

import {
  buildBatteryStoragePhotovoltaicHandoff,
} from "@/lib/configurator/battery-storage";
import {
  buildPhotovoltaicConfiguratorResult,
} from "@/lib/configurator/photovoltaic";
import {
  configuratorReducer,
  createInitialConfiguratorState,
} from "@/lib/configurator/state";

function createPhotovoltaicState(
  batteryStorage: boolean,
) {
  let state =
    createInitialConfiguratorState();

  state = configuratorReducer(
    state,
    {
      type: "UPDATE_HOUSEHOLD",
      payload: {
        persons: 3,
        annualConsumptionKwh: 3000,
        futureIncreasePercent: 10,
      },
    },
  );

  state = configuratorReducer(
    state,
    {
      type: "UPDATE_BUILDING",
      payload: {
        ownership: "owner",
        type: "detached_house",
      },
    },
  );

  state = configuratorReducer(
    state,
    {
      type: "UPDATE_ROOF",
      payload: {
        pitch: 30,
        material: "roof_tile",
        orientation: "south",
        renovationPeriod:
          "after_1990",
      },
    },
  );

  state = configuratorReducer(
    state,
    {
      type: "UPDATE_INTERESTS",
      payload: {
        batteryStorage,
      },
    },
  );

  const result =
    buildPhotovoltaicConfiguratorResult(
      state,
    );

  if (!result) {
    throw new Error(
      "Expected photovoltaic result.",
    );
  }

  return configuratorReducer(
    state,
    {
      type: "SET_PHOTOVOLTAIC_RESULT",
      payload: result,
    },
  );
}

describe("battery storage photovoltaic handoff", () => {
  it("returns null without a photovoltaic result", () => {
    const state =
      createInitialConfiguratorState();

    expect(
      buildBatteryStoragePhotovoltaicHandoff(
        state,
      ),
    ).toBeNull();
  });

  it("reuses the photovoltaic result without copying it into a second state", () => {
    const state =
      createPhotovoltaicState(true);

    const handoff =
      buildBatteryStoragePhotovoltaicHandoff(
        state,
      );

    expect(handoff).toEqual({
      source: "photovoltaic",

      projectedAnnualConsumptionKwh:
        3300,

      recommendedPvPowerKwpMin: 4,
      recommendedPvPowerKwpMax: 5,

      estimatedAnnualPvYieldKwhMin:
        3600,
      estimatedAnnualPvYieldKwhMax:
        5500,

      batteryStorageRequested: true,

      technicalReviewRecommended:
        false,
    });
  });

  it("can reuse existing photovoltaic data even when storage was not originally selected", () => {
    const state =
      createPhotovoltaicState(false);

    const handoff =
      buildBatteryStoragePhotovoltaicHandoff(
        state,
      );

    expect(
      handoff?.batteryStorageRequested,
    ).toBe(false);

    expect(
      handoff?.projectedAnnualConsumptionKwh,
    ).toBe(3300);

    expect(
      handoff?.recommendedPvPowerKwpMin,
    ).toBe(4);
  });

  it("keeps the photovoltaic technical review flag", () => {
    let state =
      createPhotovoltaicState(true);

    state = configuratorReducer(
      state,
      {
        type: "UPDATE_ROOF",
        payload: {
          orientation: "north",
        },
      },
    );

    const result =
      buildPhotovoltaicConfiguratorResult(
        state,
      );

    if (!result) {
      throw new Error(
        "Expected photovoltaic result.",
      );
    }

    state = configuratorReducer(
      state,
      {
        type: "SET_PHOTOVOLTAIC_RESULT",
        payload: result,
      },
    );

    expect(
      buildBatteryStoragePhotovoltaicHandoff(
        state,
      )?.technicalReviewRecommended,
    ).toBe(true);
  });
});