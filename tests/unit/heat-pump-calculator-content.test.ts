import { describe, expect, it } from "vitest";

import {
  defaultHeatPumpCalculatorInput,
  heatPumpCalculatorContent,
} from "@/content/pages/waermepumpen-rechner";
import {
  PUBLIC_ROUTE_LIST,
  PUBLIC_ROUTES,
} from "@/config/routes";
import { heatPumpCalculatorInputSchema } from "@/lib/validation/heat-pump-calculator";
import { HEAT_PUMP_FLOW_TEMPERATURE_ASSESSMENTS } from "@/types/heat-pump-calculator";

describe("heat pump calculator page configuration", () => {
  it("provides valid default calculator values", () => {
    const result =
      heatPumpCalculatorInputSchema.safeParse(
        defaultHeatPumpCalculatorInput,
      );

    expect(result.success).toBe(true);
  });

  it("defines every numeric input field exactly once", () => {
    const configuredFieldNames = [
      ...heatPumpCalculatorContent.primaryFields,
      ...heatPumpCalculatorContent.advancedFields,
    ].map((field) => field.name);

    const expectedFieldNames = Object.keys(
      defaultHeatPumpCalculatorInput,
    ).sort();

    expect(
      [...new Set(configuredFieldNames)].sort(),
    ).toEqual(expectedFieldNames);

    expect(new Set(configuredFieldNames).size).toBe(
      configuredFieldNames.length,
    );
  });

  it("provides content for every flow temperature assessment", () => {
    expect(
      Object.keys(
        heatPumpCalculatorContent.assessmentContent,
      ).sort(),
    ).toEqual(
      [
        ...HEAT_PUMP_FLOW_TEMPERATURE_ASSESSMENTS,
      ].sort(),
    );
  });

  it("registers the route without adding it to navigation", () => {
    const route =
      PUBLIC_ROUTES["waermepumpen-rechner"];

    expect(route.href).toBe(
      "/rechner/waermepumpe-kosten",
    );

    expect(route.faqRouteKey).toBe("waermepumpen");

    expect(route.navigation).toEqual({
      header: false,
      footer: false,
    });

    expect(PUBLIC_ROUTE_LIST).toContain(route);
  });
});