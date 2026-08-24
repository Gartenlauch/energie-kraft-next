import { describe, expect, it } from "vitest";

import { photovoltaicWizardSteps } from "@/content/configurators";
import {
  getPhotovoltaicHouseholdConsumptionDefault,
  PHOTOVOLTAIC_HOUSEHOLD_CONSUMPTION_DEFAULTS_KWH,
} from "@/lib/configurator/photovoltaic";
import {
  configuratorReducer,
  createInitialConfiguratorState,
} from "@/lib/configurator/state";
import { isPhotovoltaicStepComplete } from "@/lib/validation/configurator/photovoltaic";

describe("photovoltaic configurator", () => {
  it("uses the configured household consumption defaults", () => {
    expect(
      PHOTOVOLTAIC_HOUSEHOLD_CONSUMPTION_DEFAULTS_KWH,
    ).toEqual({
      1: 2000,
      2: 2500,
      3: 3000,
      "4_5": 4500,
    });
  });

  it("returns the household consumption default", () => {
    expect(
      getPhotovoltaicHouseholdConsumptionDefault(1),
    ).toBe(2000);

    expect(
      getPhotovoltaicHouseholdConsumptionDefault(3),
    ).toBe(3000);

    expect(
      getPhotovoltaicHouseholdConsumptionDefault("4_5"),
    ).toBe(4500);
  });

  it("defines the first eight wizard steps in the expected order", () => {
    expect(
      photovoltaicWizardSteps.map((step) => step.id),
    ).toEqual([
      "household_persons",
      "ownership",
      "building_type",
      "annual_consumption",
      "roof_pitch",
      "roof_material",
      "roof_orientation",
      "roof_renovation",
    ]);
  });

  it("validates the photovoltaic roof steps", () => {
    let state = createInitialConfiguratorState();

    expect(
      isPhotovoltaicStepComplete("roof_pitch", state),
    ).toBe(false);

    expect(
      isPhotovoltaicStepComplete("roof_material", state),
    ).toBe(false);

    expect(
      isPhotovoltaicStepComplete("roof_orientation", state),
    ).toBe(false);

    expect(
      isPhotovoltaicStepComplete("roof_renovation", state),
    ).toBe(false);

    state = configuratorReducer(state, {
      type: "UPDATE_ROOF",
      payload: {
        pitch: 30,
        material: "roof_tile",
        orientation: "south_east_south_west",
        renovationPeriod: "after_1990",
      },
    });

    expect(
      isPhotovoltaicStepComplete("roof_pitch", state),
    ).toBe(true);

    expect(
      isPhotovoltaicStepComplete("roof_material", state),
    ).toBe(true);

    expect(
      isPhotovoltaicStepComplete("roof_orientation", state),
    ).toBe(true);

    expect(
      isPhotovoltaicStepComplete("roof_renovation", state),
    ).toBe(true);
  });

  it("requires a household size for the first step", () => {
    let state = createInitialConfiguratorState();

    expect(
      isPhotovoltaicStepComplete(
        "household_persons",
        state,
      ),
    ).toBe(false);

    state = configuratorReducer(state, {
      type: "UPDATE_HOUSEHOLD",
      payload: {
        persons: 3,
        annualConsumptionKwh: 3000,
      },
    });

    expect(
      isPhotovoltaicStepComplete(
        "household_persons",
        state,
      ),
    ).toBe(true);
  });

  it("accepts tenant as a valid ownership answer", () => {
    const state = configuratorReducer(
      createInitialConfiguratorState(),
      {
        type: "UPDATE_BUILDING",
        payload: {
          ownership: "tenant",
        },
      },
    );

    expect(
      isPhotovoltaicStepComplete(
        "ownership",
        state,
      ),
    ).toBe(true);
  });

  it("requires a building type", () => {
    let state = createInitialConfiguratorState();

    expect(
      isPhotovoltaicStepComplete(
        "building_type",
        state,
      ),
    ).toBe(false);

    state = configuratorReducer(state, {
      type: "UPDATE_BUILDING",
      payload: {
        type: "detached_house",
      },
    });

    expect(
      isPhotovoltaicStepComplete(
        "building_type",
        state,
      ),
    ).toBe(true);
  });

  it("requires a plausible annual consumption", () => {
    let state = configuratorReducer(
      createInitialConfiguratorState(),
      {
        type: "UPDATE_HOUSEHOLD",
        payload: {
          annualConsumptionKwh: 3000,
        },
      },
    );

    expect(
      isPhotovoltaicStepComplete(
        "annual_consumption",
        state,
      ),
    ).toBe(true);

    state = configuratorReducer(state, {
      type: "UPDATE_HOUSEHOLD",
      payload: {
        annualConsumptionKwh: 200,
      },
    });

    expect(
      isPhotovoltaicStepComplete(
        "annual_consumption",
        state,
      ),
    ).toBe(false);
  });
});