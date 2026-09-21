import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { siteConfig } from "@/config/site";
import { CONTACT_FORM_HREF } from "@/config/routes";
import { ConfiguratorProvider } from "@/lib/configurator/configurator-context";
import { PhotovoltaicResult } from "@/components/configurator/photovoltaic/photovoltaic-result";

vi.mock("@/config/env/public", () => ({
  publicEnv: { NEXT_PUBLIC_CANONICAL_BASE_URL: "http://localhost:3000" },
}));

import {
  buildPhotovoltaicConfiguratorResult,
  PV_CONFIGURATOR_YIELD_UNCERTAINTY_PERCENT,
} from "@/lib/configurator/photovoltaic";
import { configuratorReducer, createInitialConfiguratorState } from "@/lib/configurator/state";
import type { ConfiguratorState, RoofOrientation } from "@/types/configurator";

function createCompleteResultState(orientation: RoofOrientation = "south"): ConfiguratorState {
  let state = createInitialConfiguratorState();

  state = configuratorReducer(state, {
    type: "UPDATE_HOUSEHOLD",
    payload: {
      persons: 3,
      annualConsumptionKwh: 3000,
      futureIncreasePercent: 10,
    },
  });

  state = configuratorReducer(state, {
    type: "UPDATE_BUILDING",
    payload: {
      ownership: "owner",
      type: "detached_house",
    },
  });

  state = configuratorReducer(state, {
    type: "UPDATE_ROOF",
    payload: {
      pitch: 30,
      material: "roof_tile",
      orientation,
      renovationPeriod: "after_1990",
    },
  });

  return state;
}

describe("photovoltaic configurator result", () => {
  it("shows the authoritative contact details and CTA for an oversized PV result", () => {
    const state = createCompleteResultState();
    state.household.annualConsumptionKwh = 60_000;
    const result = buildPhotovoltaicConfiguratorResult(state);
    if (!result) throw new Error("PV fixture missing");
    expect(result.pricingMode).toBe("individual_quote_required");
    const html = renderToStaticMarkup(createElement(ConfiguratorProvider,
      { settings: state.settings } as Parameters<typeof ConfiguratorProvider>[0],
      createElement(PhotovoltaicResult, {
        result, nextConfigurator: null, onBack: () => {}, onContinue: () => {},
      }),
    ));
    expect(html).toContain("Individuelles Angebot erforderlich");
    expect(html).toContain(siteConfig.contact.phoneDisplay);
    expect(html).toContain(siteConfig.contact.email);
    expect(html).toContain(CONTACT_FORM_HREF);
    expect(html).not.toContain("Amortisation");
    expect(html).not.toContain("Modellierte Rendite");
  });
  it("uses a documented yield uncertainty corridor", () => {
    expect(PV_CONFIGURATOR_YIELD_UNCERTAINTY_PERCENT).toBe(10);
  });

  it("builds an orientation-aware result corridor", () => {
    const state = createCompleteResultState("south");

    const result = buildPhotovoltaicConfiguratorResult(state);

    expect(result).not.toBeNull();

    expect(result).toMatchObject({
      recommendedPowerKwpMin: 4,
      recommendedPowerKwpMax: 5,

      estimatedAnnualYieldKwhMin: 3600,
      estimatedAnnualYieldKwhMax: 5500,

      projectedAnnualConsumptionKwh: 3300,
      targetAnnualGenerationKwh: 3630,

      orientationFactor: 1,

      specificYieldKwhPerKwpMin: 900,
      specificYieldKwhPerKwpMax: 1100,

      estimatedTotalCostEuro: 7_400,
      estimatedMinimumCostEuro: 5_780,
      estimatedMaximumCostEuro: 9_200,

      batteryStorageRequested: false,
      technicalReviewRecommended: false,
    });
  });

  it("uses the existing east-west orientation factor", () => {
    const state = createCompleteResultState("east_west");

    const result = buildPhotovoltaicConfiguratorResult(state);

    expect(result?.orientationFactor).toBe(0.85);

    expect(result?.recommendedPowerKwpMin).toBeGreaterThanOrEqual(4);

    expect(result?.recommendedPowerKwpMax).toBeGreaterThan(result?.recommendedPowerKwpMin ?? 0);
  });

  it("flags north orientation for technical review", () => {
    const state = createCompleteResultState("north");

    const result = buildPhotovoltaicConfiguratorResult(state);

    expect(result?.technicalReviewRecommended).toBe(true);

    expect(result?.orientationFactor).toBe(0.65);
  });

  it("flags very old roofs for technical review", () => {
    let state = createCompleteResultState("south");

    state = configuratorReducer(state, {
      type: "UPDATE_ROOF",
      payload: {
        renovationPeriod: "before_1960",
      },
    });

    const result = buildPhotovoltaicConfiguratorResult(state);

    expect(result?.technicalReviewRecommended).toBe(true);
  });

  it("returns null when required result data is missing", () => {
    const state = createInitialConfiguratorState();

    expect(buildPhotovoltaicConfiguratorResult(state)).toBeNull();
  });

  it("keeps the battery request in the result", () => {
    let state = createCompleteResultState();

    state = configuratorReducer(state, {
      type: "UPDATE_INTERESTS",
      payload: {
        batteryStorage: true,
      },
    });

    const result = buildPhotovoltaicConfiguratorResult(state);

    expect(result?.batteryStorageRequested).toBe(true);
  });

  it("invalidates an existing PV result when technical answers change", () => {
    let state = createCompleteResultState();

    const result = buildPhotovoltaicConfiguratorResult(state);

    if (!result) {
      throw new Error("Expected photovoltaic configurator result.");
    }

    state = configuratorReducer(state, {
      type: "SET_PHOTOVOLTAIC_RESULT",
      payload: result,
    });

    expect(state.results.photovoltaic).toBeDefined();

    state = configuratorReducer(state, {
      type: "UPDATE_HOUSEHOLD",
      payload: {
        futureIncreasePercent: 25,
      },
    });

    expect(state.results.photovoltaic).toBeUndefined();
  });
  it("does not invalidate the result when notes change", () => {
    let state = createCompleteResultState();

    const result = buildPhotovoltaicConfiguratorResult(state);

    if (!result) {
      throw new Error("Expected photovoltaic configurator result.");
    }

    state = configuratorReducer(state, {
      type: "SET_PHOTOVOLTAIC_RESULT",
      payload: result,
    });

    state = configuratorReducer(state, {
      type: "UPDATE_NOTES",
      payload: {
        hasNotes: true,
        text: "Carport später berücksichtigen.",
      },
    });

    expect(state.results.photovoltaic).toEqual(result);
  });

  it("invalidates the result when the roof changes", () => {
    let state = createCompleteResultState();

    const result = buildPhotovoltaicConfiguratorResult(state);

    if (!result) {
      throw new Error("Expected photovoltaic configurator result.");
    }

    state = configuratorReducer(state, {
      type: "SET_PHOTOVOLTAIC_RESULT",
      payload: result,
    });

    state = configuratorReducer(state, {
      type: "UPDATE_ROOF",
      payload: {
        orientation: "east_west",
      },
    });

    expect(state.results.photovoltaic).toBeUndefined();
  });
});
