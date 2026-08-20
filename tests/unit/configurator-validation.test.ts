import { describe, expect, it } from "vitest";

import { createInitialConfiguratorState } from "@/lib/configurator/state";
import { parseConfiguratorState } from "@/lib/validation/configurator/state";

describe("configurator validation", () => {
  it("accepts a valid configurator state", () => {
    const input = {
      ...createInitialConfiguratorState(),

      activeConfigurator: "photovoltaic" as const,

      household: {
        persons: 3 as const,
        annualConsumptionKwh: 3000,
        futureIncreasePercent: 10,
        projectedConsumptionKwh: 3300,
      },
    };

    const parsed = parseConfiguratorState(input);

    expect(parsed).not.toBeNull();
    expect(parsed?.household.projectedConsumptionKwh).toBe(3300);
  });

  it("rejects unsupported state versions", () => {
    const input = {
      ...createInitialConfiguratorState(),
      version: 999,
    };

    expect(parseConfiguratorState(input)).toBeNull();
  });

  it("rejects invalid future consumption percentages", () => {
    const input = {
      ...createInitialConfiguratorState(),

      household: {
        futureIncreasePercent: -10,
      },
    };

    expect(parseConfiguratorState(input)).toBeNull();
  });

  it("recalculates a stale projected consumption value", () => {
    const input = {
      ...createInitialConfiguratorState(),

      household: {
        persons: 3 as const,
        annualConsumptionKwh: 3000,
        futureIncreasePercent: 10,
        projectedConsumptionKwh: 9999,
      },
    };

    const parsed = parseConfiguratorState(input);

    expect(parsed?.household.projectedConsumptionKwh).toBe(3300);
  });

  it("does not retain unknown personal-data fields", () => {
    const input = {
      ...createInitialConfiguratorState(),

      contact: {
        firstName: "Max",
        email: "max@example.com",
      },
    };

    const parsed = parseConfiguratorState(input);

    expect(parsed).not.toBeNull();

    if (!parsed) {
      throw new Error("Expected valid configurator state.");
    }

    expect("contact" in parsed).toBe(false);
  });
});