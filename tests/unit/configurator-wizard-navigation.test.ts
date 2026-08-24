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
        "notes",
      ),
    ).toBeNull();
  });

  it("continues from roof data into consumption and interests", () => {
    expect(
      getNextConfiguratorStepId(
        photovoltaicWizardSteps,
        "roof_renovation",
      ),
    ).toBe("future_consumption");

    expect(
      getNextConfiguratorStepId(
        photovoltaicWizardSteps,
        "future_consumption",
      ),
    ).toBe("battery_storage");

    expect(
      getNextConfiguratorStepId(
        photovoltaicWizardSteps,
        "battery_storage",
      ),
    ).toBe("additional_interests");

    expect(
      getNextConfiguratorStepId(
        photovoltaicWizardSteps,
        "additional_interests",
      ),
    ).toBe("notes");
  });

  it("continues from consumption into the roof questions", () => {
    expect(
      getNextConfiguratorStepId(
        photovoltaicWizardSteps,
        "annual_consumption",
      ),
    ).toBe("roof_pitch");

    expect(
      getNextConfiguratorStepId(
        photovoltaicWizardSteps,
        "roof_pitch",
      ),
    ).toBe("roof_material");

    expect(
      getNextConfiguratorStepId(
        photovoltaicWizardSteps,
        "roof_material",
      ),
    ).toBe("roof_orientation");

    expect(
      getNextConfiguratorStepId(
        photovoltaicWizardSteps,
        "roof_orientation",
      ),
    ).toBe("roof_renovation");
  });
});