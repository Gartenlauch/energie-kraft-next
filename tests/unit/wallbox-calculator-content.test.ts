import { describe, expect, it } from "vitest";

import {
  defaultWallboxCalculatorInput,
  wallboxCalculatorContent,
} from "@/content/pages/wallbox-rechner";
import {
  PUBLIC_ROUTE_LIST,
  PUBLIC_ROUTES,
} from "@/config/routes";
import { wallboxCalculatorInputSchema } from "@/lib/validation/wallbox-calculator";
import { WALLBOX_SYSTEM_RECOMMENDATIONS } from "@/types/wallbox-calculator";

describe("wallbox calculator page configuration", () => {
  it("provides valid default calculator values", () => {
    const result =
      wallboxCalculatorInputSchema.safeParse(
        defaultWallboxCalculatorInput,
      );

    expect(result.success).toBe(true);
  });

  it("defines every numeric input field exactly once", () => {
    const configuredFieldNames = [
      ...wallboxCalculatorContent.primaryFields,
      ...wallboxCalculatorContent.advancedFields,
    ].map((field) => field.name);

    const expectedFieldNames = Object.keys(
      defaultWallboxCalculatorInput,
    ).sort();

    expect(
      [...new Set(configuredFieldNames)].sort(),
    ).toEqual(expectedFieldNames);

    expect(new Set(configuredFieldNames).size).toBe(
      configuredFieldNames.length,
    );
  });

  it("provides content for every system recommendation", () => {
    expect(
      Object.keys(
        wallboxCalculatorContent.recommendationContent,
      ).sort(),
    ).toEqual(
      [...WALLBOX_SYSTEM_RECOMMENDATIONS].sort(),
    );
  });

  it("registers the route without adding it to navigation", () => {
    const route = PUBLIC_ROUTES["wallbox-rechner"];

    expect(route.href).toBe(
      "/rechner/wallbox-kosten",
    );

    expect(route.faqRouteKey).toBe("wallbox");

    expect(route.navigation).toEqual({
      header: false,
      footer: false,
    });

    expect(PUBLIC_ROUTE_LIST).toContain(route);
  });
});