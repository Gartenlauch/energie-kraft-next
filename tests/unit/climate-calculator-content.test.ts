import { describe, expect, it } from "vitest";

import {
  climateCalculatorContent,
  defaultClimateCalculatorInput,
} from "@/content/pages/klima-kostenrechner";
import { PUBLIC_ROUTE_LIST, PUBLIC_ROUTES } from "@/config/routes";
import { climateCalculatorInputSchema } from "@/lib/validation/climate-calculator";
import { CLIMATE_INSULATION_LEVELS, CLIMATE_SOLAR_LOADS } from "@/types/climate-calculator";

describe("climate calculator page configuration", () => {
  it("provides valid default values", () => {
    const result = climateCalculatorInputSchema.safeParse(defaultClimateCalculatorInput);

    expect(result.success).toBe(true);
  });

  it("defines every numeric input field exactly once", () => {
    const configuredFieldNames = [
      ...climateCalculatorContent.primaryFields,
      ...climateCalculatorContent.advancedFields,
    ].map((field) => field.name);

    const expectedNumericFieldNames = Object.entries(defaultClimateCalculatorInput)
      .filter(([, value]) => typeof value === "number")
      .map(([key]) => key)
      .sort();

    expect([...new Set(configuredFieldNames)].sort()).toEqual(expectedNumericFieldNames);

    expect(new Set(configuredFieldNames).size).toBe(configuredFieldNames.length);
  });

  it("provides labels for every selection value", () => {
    expect(climateCalculatorContent.insulationOptions.map((option) => option.value).sort()).toEqual(
      [...CLIMATE_INSULATION_LEVELS].sort(),
    );

    expect(climateCalculatorContent.solarLoadOptions.map((option) => option.value).sort()).toEqual(
      [...CLIMATE_SOLAR_LOADS].sort(),
    );
  });

  it("registers the route without adding it to navigation", () => {
    const route = PUBLIC_ROUTES["klima-kostenrechner"];

    expect(route.href).toBe("/rechner/klimaanlage-kosten");

    expect(route.faqRouteKey).toBe("klimaanlagen");

    expect(route.navigation).toEqual({
      header: false,
      footer: false,
    });

    expect(PUBLIC_ROUTE_LIST).toContain(route);
  });
});
