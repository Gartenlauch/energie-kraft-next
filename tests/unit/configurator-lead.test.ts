import {
  describe,
  expect,
  it,
} from "vitest";

import {
  buildConfiguratorLeadInput,
} from "@/lib/configurator/lead";
import {
  buildPhotovoltaicConfiguratorResult,
} from "@/lib/configurator/photovoltaic";
import {
  configuratorReducer,
  createInitialConfiguratorState,
} from "@/lib/configurator/state";
import {
  configuratorContactFormSchema,
  configuratorLeadInputSchema,
} from "@/lib/validation/configurator/lead";

function createCompleteState() {
  let state =
    createInitialConfiguratorState();

  state = configuratorReducer(
    state,
    {
      type: "SET_ACTIVE_CONFIGURATOR",
      payload: "photovoltaic",
    },
  );

  state = configuratorReducer(
    state,
    {
      type: "UPDATE_HOUSEHOLD",
      payload: {
        persons: 3,
        annualConsumptionKwh: 3000,
        futureIncreasePercent: 10,
      },
    },
  );

  state = configuratorReducer(
    state,
    {
      type: "UPDATE_BUILDING",
      payload: {
        ownership: "owner",
        type: "detached_house",
      },
    },
  );

  state = configuratorReducer(
    state,
    {
      type: "UPDATE_ROOF",
      payload: {
        pitch: 30,
        material: "roof_tile",
        orientation: "south",
        renovationPeriod: "after_1990",
      },
    },
  );

  state = configuratorReducer(
    state,
    {
      type: "UPDATE_NOTES",
      payload: {
        hasNotes: false,
        text: "",
      },
    },
  );

  const result =
    buildPhotovoltaicConfiguratorResult(
      state,
    );

  if (!result) {
    throw new Error(
      "Expected photovoltaic result.",
    );
  }

  return configuratorReducer(
    state,
    {
      type:
        "SET_PHOTOVOLTAIC_RESULT",
      payload: result,
    },
  );
}

describe("configurator lead", () => {
  it(
    "validates complete contact data",
    () => {
      const result =
        configuratorContactFormSchema.safeParse(
          {
            firstName: "Max",
            lastName: "Mustermann",
            email: "max@example.com",
            phone: "",
            installationAtResidence:
              true,
            street: "Musterstraße 1",
            postalCode: "83395",
            city: "Freilassing",
            privacyAccepted: true,
            website: "",
          },
        );

      expect(
        result.success,
      ).toBe(true);
    },
  );

  it(
    "keeps the phone number optional",
    () => {
      const state =
        createCompleteState();

      const input =
        buildConfiguratorLeadInput(
          state,
          {
            firstName: "Max",
            lastName: "Mustermann",
            email: "max@example.com",
            phone: "",
            installationAtResidence:
              true,
            street: "Musterstraße 1",
            postalCode: "83395",
            city: "Freilassing",
            privacyAccepted: true,
            website: "",
          },
          Date.now(),
        );

      expect(input).not.toBeNull();

      expect(
        input?.contact.phone,
      ).toBeUndefined();
    },
  );

  it(
    "includes the complete photovoltaic configuration",
    () => {
      const state =
        createCompleteState();

      const input =
        buildConfiguratorLeadInput(
          state,
          {
            firstName: "Max",
            lastName: "Mustermann",
            email: "max@example.com",
            phone: "01234 56789",
            installationAtResidence:
              false,
            street: "Solarweg 2",
            postalCode: "83404",
            city: "Ainring",
            privacyAccepted: true,
            website: "",
          },
          Date.now(),
        );

      expect(input).not.toBeNull();

      if (!input) {
        throw new Error(
          "Expected configurator lead input.",
        );
      }

      expect(input.type).toBe(
        "configurator",
      );

      expect(
        input.products,
      ).toEqual([
        "photovoltaic",
      ]);

      expect(
        input.journey,
      ).toEqual({
        entryPoint:
          "photovoltaic",

        selectedProducts: [
          "photovoltaic",
        ],

        completedProducts: [
          "photovoltaic",
        ],
      });

      expect(
        input.configurators,
      ).toHaveLength(1);

      const configurator =
        input.configurators[0];

      expect(
        configurator,
      ).toBeDefined();

      if (
        !configurator ||
        configurator.type !==
        "photovoltaic"
      ) {
        throw new Error(
          "Expected photovoltaic configurator payload.",
        );
      }

      expect(
        configurator.answers
          .household
          .annualConsumptionKwh,
      ).toBe(3000);

      expect(
        configurator.answers
          .roof.orientation,
      ).toBe("south");

      expect(
        configurator.result
          .recommendedPowerKwpMin,
      ).toBeGreaterThan(0);

      expect(
        input.installation
          .atResidence,
      ).toBe(false);

      expect(
        configuratorLeadInputSchema.safeParse(
          input,
        ).success,
      ).toBe(true);
    },
  );

  it(
    "rejects a lead without privacy consent",
    () => {
      const state =
        createCompleteState();

      const input =
        buildConfiguratorLeadInput(
          state,
          {
            firstName: "Max",
            lastName: "Mustermann",
            email: "max@example.com",
            phone: "",
            installationAtResidence:
              true,
            street: "Musterstraße 1",
            postalCode: "83395",
            city: "Freilassing",
            privacyAccepted: false,
            website: "",
          },
          Date.now(),
        );

      expect(input).not.toBeNull();

      expect(
        configuratorLeadInputSchema.safeParse(
          input,
        ).success,
      ).toBe(false);
    },
  );

  it(
    "cannot build a lead before a PV result exists",
    () => {
      let state =
        createInitialConfiguratorState();

      state = configuratorReducer(
        state,
        {
          type:
            "SET_ACTIVE_CONFIGURATOR",
          payload:
            "photovoltaic",
        },
      );

      expect(
        state.journey
          .selectedProducts,
      ).toEqual([
        "photovoltaic",
      ]);

      expect(
        state.journey
          .completedProducts,
      ).toEqual([]);

      expect(
        buildConfiguratorLeadInput(
          state,
          {
            firstName: "Max",
            lastName: "Mustermann",
            email: "max@example.com",
            phone: "",
            installationAtResidence:
              true,
            street: "Musterstraße 1",
            postalCode: "83395",
            city: "Freilassing",
            privacyAccepted: true,
            website: "",
          },
          Date.now(),
        ),
      ).toBeNull();
    },
  );
});