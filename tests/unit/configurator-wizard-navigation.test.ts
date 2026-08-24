import { describe, expect, it } from "vitest";

import { photovoltaicWizardSteps } from "@/content/configurators";
import {
  getConfiguratorStepIndex,
  getNextConfiguratorStepId,
  getPreviousConfiguratorStepId,
} from "@/lib/configurator/wizard-navigation";

describe("configurator wizard navigation", () => {
  it("finds the current step index", () => {
    expect(
      getConfiguratorStepIndex(
        photovoltaicWizardSteps,
        "building_type",
      ),
    ).toBe(2);
  });

  it("returns the next step", () => {
    expect(
      getNextConfiguratorStepId(
        photovoltaicWizardSteps,
        "ownership",
      ),
    ).toBe("building_type");
  });

  it("returns the previous step", () => {
    expect(
      getPreviousConfiguratorStepId(
        photovoltaicWizardSteps,
        "building_type",
      ),
    ).toBe("ownership");
  });

  it("returns null at the wizard boundaries", () => {
    expect(
      getPreviousConfiguratorStepId(
        photovoltaicWizardSteps,
        "household_persons",
      ),
    ).toBeNull();

    expect(
      getNextConfiguratorStepId(
        photovoltaicWizardSteps,
        "annual_consumption",
      ),
    ).toBeNull();
  });
});