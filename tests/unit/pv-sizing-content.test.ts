import { describe, expect, it } from "vitest";

import {
  defaultPvSizingCalculatorInput,
  pvSizingCalculatorContent,
} from "@/content/pages/pv-kostenrechner";
import {
  PUBLIC_ROUTE_LIST,
  PUBLIC_ROUTES,
} from "@/config/routes";
import { pvSizingCalculatorInputSchema } from "@/lib/validation/pv-sizing-calculator";
import {
  PV_ROOF_ORIENTATIONS,
  PV_SHADING_LEVELS,
} from "@/types/pv-sizing-calculator";

describe("PV sizing calculator page configuration", () => {
  it("provides valid default values", () => {
    const result =
      pvSizingCalculatorInputSchema.safeParse(
        defaultPvSizingCalculatorInput,
      );

    expect(result.success).toBe(true);
  });

  it("defines every numeric input field exactly once", () => {
    const configuredFieldNames = [
      ...pvSizingCalculatorContent.primaryFields,
      ...pvSizingCalculatorContent.advancedFields,
    ].map((field) => field.name);

    const expectedNumericFieldNames = Object.entries(
      defaultPvSizingCalculatorInput,
    )
      .filter(([, value]) => typeof value === "number")
      .map(([key]) => key)
      .sort();

    expect(
      [...new Set(configuredFieldNames)].sort(),
    ).toEqual(expectedNumericFieldNames);

    expect(new Set(configuredFieldNames).size).toBe(
      configuredFieldNames.length,
    );
  });

  it("provides labels for all orientation and shading values", () => {
    expect(
      pvSizingCalculatorContent.orientationOptions
        .map((option) => option.value)
        .sort(),
    ).toEqual([...PV_ROOF_ORIENTATIONS].sort());

    expect(
      pvSizingCalculatorContent.shadingOptions
        .map((option) => option.value)
        .sort(),
    ).toEqual([...PV_SHADING_LEVELS].sort());
  });

  it("registers the route without adding it to navigation", () => {
    const route = PUBLIC_ROUTES["pv-kostenrechner"];

    expect(route.href).toBe(
      "/rechner/photovoltaik-kosten",
    );

    expect(route.faqRouteKey).toBe("photovoltaik");

    expect(route.navigation).toEqual({
      header: false,
      footer: false,
    });

    expect(PUBLIC_ROUTE_LIST).toContain(route);
  });
});