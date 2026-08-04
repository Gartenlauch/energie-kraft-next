import { describe, expect, it } from "vitest";

import { defaultPvCalculatorInput, pvCalculatorContent } from "@/content/pages/pv-rechner";
import { PUBLIC_ROUTE_LIST, PUBLIC_ROUTES } from "@/config/routes";
import { pvCalculatorInputSchema } from "@/lib/validation/pv-calculator";

describe("PV calculator page configuration", () => {
  it("provides valid default calculator values", () => {
    const result = pvCalculatorInputSchema.safeParse(defaultPvCalculatorInput);

    expect(result.success).toBe(true);
  });

  it("defines every calculator input field exactly once", () => {
    const fieldNames = [
      ...pvCalculatorContent.primaryFields,
      ...pvCalculatorContent.advancedFields,
    ].map((field) => field.name);

    const uniqueFieldNames = [...new Set(fieldNames)];

    expect(uniqueFieldNames).toHaveLength(fieldNames.length);

    expect([...uniqueFieldNames].sort()).toEqual(Object.keys(defaultPvCalculatorInput).sort());
  });

  it("registers the calculator route without adding it to navigation", () => {
    const calculatorRoute = PUBLIC_ROUTES["pv-rechner"];

    expect(calculatorRoute.href).toBe("/rechner/photovoltaik");

    expect(calculatorRoute.faqRouteKey).toBe("photovoltaik");

    expect(calculatorRoute.navigation).toEqual({
      header: false,
      footer: false,
    });

    expect(PUBLIC_ROUTE_LIST).toContain(calculatorRoute);
  });
});
