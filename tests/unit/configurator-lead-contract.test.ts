import {
  describe,
  expect,
  it,
} from "vitest";

import {
  batteryStorageConfiguratorLeadInputSchema,
  climateConfiguratorLeadInputSchema,
  configuratorLeadInputSchema,
  heatPumpConfiguratorLeadInputSchema,
  wallboxConfiguratorLeadInputSchema,
} from "@/lib/validation/configurator/lead";
import type {
  ConfiguratorLeadPayload,
} from "@/types/configurator";

const common = {
  type: "configurator" as const,

  contact: {
    firstName: "Max",
    lastName: "Mustermann",
    email: "max@example.de",
  },

  installation: {
    atResidence: true,
    street: "Musterstraße 1",
    postalCode: "83395",
    city: "Freilassing",
  },

  privacyAccepted: true as const,

  formStartedAt:
    Date.now() - 10_000,
};

function asProjectLead(
  configurator: ConfiguratorLeadPayload,
) {
  return {
    ...common,

    products: [
      configurator.type,
    ],

    journey: {
      entryPoint:
        configurator.type,

      selectedProducts: [
        configurator.type,
      ],

      completedProducts: [
        configurator.type,
      ],
    },

    configurators: [
      configurator,
    ],
  };
}

describe(
  "configurator lead contract",
  () => {
    it(
      "accepts a battery-storage lead",
      () => {
        const input = {
          ...common,

          configurator: {
            type:
              "battery_storage" as const,

            answers: {
              annualConsumptionKwh:
                4_500,

              pvPowerKwp: 10,

              consumptionPattern:
                "mixed" as const,

              backupPreference:
                "selected_loads" as const,

              goal:
                "balanced" as const,
            },

            result: {
              source:
                "standalone" as const,

              annualConsumptionKwh:
                4_500,

              pvPowerKwpMin: 10,
              pvPowerKwpMax: 10,

              recommendedUsableCapacityKwhMin:
                7,

              recommendedUsableCapacityKwhMax:
                10,

              technicalUpperBoundUsableCapacityKwh:
                12,

              consumptionPattern:
                "mixed" as const,

              backupPreference:
                "selected_loads" as const,

              goal:
                "balanced" as const,

              pvSurplusLikely:
                true,

              backupPowerRequested:
                true,

              wholeHomeBackupRequested:
                false,

              modularExpansionRecommended:
                false,

              technicalReviewRecommended:
                false,
            },
          },
        };

        expect(
          batteryStorageConfiguratorLeadInputSchema.safeParse(
            input,
          ).success,
        ).toBe(true);

        expect(
          configuratorLeadInputSchema.safeParse(
            asProjectLead(
              input.configurator,
            ),
          ).success,
        ).toBe(true);
      },
    );

    it(
      "accepts a wallbox lead",
      () => {
        const input = {
          ...common,

          configurator: {
            type:
              "wallbox" as const,

            answers: {
              annualDrivingKm:
                15_000,

              vehicleConsumptionKwhPer100Km:
                18,

              batteryCapacityKwh:
                60,

              homeChargingSharePercent:
                80,

              chargingPowerKw:
                11 as const,

              pvChargingSharePercent:
                30,
            },

            result: {
              annualVehicleEnergyDemandKwh:
                2_700,

              annualHomeChargingInputEnergyKwh:
                2_400,

              annualPvChargingEnergyKwh:
                720,

              annualGridChargingEnergyKwh:
                1_680,

              typicalChargingTimeHours:
                3.64,

              annualHomeChargingCostEuro:
                600,

              monthlyHomeChargingCostEuro:
                50,

              estimatedTotalCostEuro:
                3_000,

              estimatedMinimumCostEuro:
                2_550,

              estimatedMaximumCostEuro:
                3_450,

              usesPhotovoltaicCharging:
                true,

              technicalReviewRecommended:
                false,
            },
          },
        };

        expect(
          wallboxConfiguratorLeadInputSchema.safeParse(
            input,
          ).success,
        ).toBe(true);

        expect(
          configuratorLeadInputSchema.safeParse(
            asProjectLead(
              input.configurator,
            ),
          ).success,
        ).toBe(true);
      },
    );

    it(
      "accepts a heat-pump lead",
      () => {
        const input = {
          ...common,

          configurator: {
            type:
              "heat_pump" as const,

            answers: {
              heatedAreaM2:
                160,

              specificSpaceHeatingDemandKwhPerM2Year:
                90,

              occupancyPersons:
                4,

              requiredFlowTemperatureC:
                50,

              annualPerformanceFactor:
                3.5,
            },

            result: {
              recommendedHeatPumpCapacityKw:
                10.5,

              totalAnnualHeatDemandKwh:
                17_600,

              spaceHeatingDemandKwh:
                14_400,

              hotWaterDemandKwh:
                3_200,

              annualHeatPumpElectricityConsumptionKwh:
                5_028.57,

              annualHeatPumpOperatingCostEuro:
                1_508.57,

              estimatedTotalCostEuro:
                27_600,

              estimatedMinimumCostEuro:
                23_460,

              estimatedMaximumCostEuro:
                31_740,

              flowTemperatureAssessment:
                "ntReady" as const,

              ntReady:
                true,

              technicalReviewRecommended:
                false,
            },
          },
        };

        expect(
          heatPumpConfiguratorLeadInputSchema.safeParse(
            input,
          ).success,
        ).toBe(true);

        expect(
          configuratorLeadInputSchema.safeParse(
            asProjectLead(
              input.configurator,
            ),
          ).success,
        ).toBe(true);
      },
    );

    it(
      "accepts a climate lead",
      () => {
        const input = {
          ...common,

          configurator: {
            type:
              "climate" as const,

            answers: {
              conditionedAreaM2:
                80,

              roomCount:
                4,

              insulationLevel:
                "average" as const,

              solarLoad:
                "medium" as const,

              occupancyPersons:
                4,
            },

            result: {
              calculatedCoolingLoadKw:
                8.03,

              recommendedCoolingCapacityKw:
                8.5,

              recommendedIndoorUnitCount:
                4,

              averageCapacityPerRoomKw:
                2.13,

              systemRecommendation:
                "multiSplit" as const,

              annualElectricityConsumptionKwh:
                653.85,

              annualOperatingCostEuro:
                209.23,

              estimatedTotalCostEuro:
                15_800,

              estimatedMinimumCostEuro:
                13_430,

              estimatedMaximumCostEuro:
                18_170,

              individualPlanningRecommended:
                false,
            },
          },
        };

        expect(
          climateConfiguratorLeadInputSchema.safeParse(
            input,
          ).success,
        ).toBe(true);

        expect(
          configuratorLeadInputSchema.safeParse(
            asProjectLead(
              input.configurator,
            ),
          ).success,
        ).toBe(true);
      },
    );

    it(
      "rejects an unknown configurator type",
      () => {
        const input = {
          ...common,

          products: [
            "unknown",
          ],

          journey: {
            entryPoint:
              "unknown",

            selectedProducts: [
              "unknown",
            ],

            completedProducts: [
              "unknown",
            ],
          },

          configurators: [
            {
              type:
                "unknown",

              answers: {},

              result: {},
            },
          ],
        };

        expect(
          configuratorLeadInputSchema.safeParse(
            input,
          ).success,
        ).toBe(false);
      },
    );
  },
);