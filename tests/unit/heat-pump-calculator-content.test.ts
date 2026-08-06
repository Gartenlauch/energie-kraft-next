import { describe, expect, it } from "vitest";

import {
  defaultHeatPumpCalculatorInput,
  heatPumpCalculatorContent,
} from "@/content/pages/waermepumpen-rechner";
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
});