import { z } from "zod";

import {
  annualConsumptionKwhSchema,
  buildingOwnershipSchema,
  buildingTypeSchema,
  futureIncreasePercentSchema,
  householdPersonsSchema,
  photovoltaicResultSchema,
  roofMaterialSchema,
  roofOrientationSchema,
  roofPitchSchema,
  roofRenovationPeriodSchema,
} from "@/lib/validation/configurator/state";
import type {
  ConfiguratorContactFormValues,
  SubmitBatteryStorageConfiguratorLeadInput,
  SubmitClimateConfiguratorLeadInput,
  SubmitConfiguratorLeadInput,
  SubmitHeatPumpConfiguratorLeadInput,
  SubmitPhotovoltaicConfiguratorLeadInput,
  SubmitWallboxConfiguratorLeadInput,
} from "@/types/configurator";

const optionalPhoneSchema = z
  .string()
  .trim()
  .max(40, "Die Telefonnummer ist zu lang.");

export const configuratorContactFormSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "Bitte gib deinen Vornamen ein.")
      .max(80, "Der Vorname ist zu lang."),

    lastName: z
      .string()
      .trim()
      .min(2, "Bitte gib deinen Nachnamen ein.")
      .max(80, "Der Nachname ist zu lang."),

    email: z
      .string()
      .trim()
      .min(1, "Bitte gib deine E-Mail-Adresse ein.")
      .max(254, "Die E-Mail-Adresse ist zu lang.")
      .email("Bitte gib eine gültige E-Mail-Adresse ein."),

    phone: optionalPhoneSchema,

    installationAtResidence: z.boolean().nullable(),

    street: z
      .string()
      .trim()
      .min(3, "Bitte gib Straße und Hausnummer ein.")
      .max(150, "Die Adresse ist zu lang."),

    postalCode: z
      .string()
      .trim()
      .min(3, "Bitte gib eine gültige Postleitzahl ein.")
      .max(10, "Die Postleitzahl ist zu lang.")
      .regex(
        /^[0-9A-Za-z -]+$/,
        "Bitte gib eine gültige Postleitzahl ein.",
      ),

    city: z
      .string()
      .trim()
      .min(2, "Bitte gib einen Ort ein.")
      .max(100, "Der Ortsname ist zu lang."),

    privacyAccepted: z.boolean(),

    website: z.string().trim().max(200),
  })
  .strict()
  .superRefine((values, context) => {
    if (values.installationAtResidence === null) {
      context.addIssue({
        code: "custom",
        path: ["installationAtResidence"],
        message:
          "Bitte wähle aus, ob die Anlage an deinem Wohnort installiert werden soll.",
      });
    }

    if (!values.privacyAccepted) {
      context.addIssue({
        code: "custom",
        path: ["privacyAccepted"],
        message:
          "Bitte bestätige die Datenschutzhinweise.",
      });
    }
  });

const photovoltaicAnswersSchema = z
  .object({
    household: z.object({
      persons: householdPersonsSchema,
      annualConsumptionKwh: annualConsumptionKwhSchema,
      futureIncreasePercent:
        futureIncreasePercentSchema,
      projectedConsumptionKwh: z
        .number()
        .int()
        .positive(),
    }),

    building: z.object({
      ownership: buildingOwnershipSchema.refine(
        (value) => value === "owner",
        "Eine Photovoltaik-Anfrage kann nur für Eigentümer übermittelt werden.",
      ),
      type: buildingTypeSchema,
    }),

    roof: z.object({
      pitch: roofPitchSchema,
      material: roofMaterialSchema,
      orientation: roofOrientationSchema,
      renovationPeriod:
        roofRenovationPeriodSchema,
    }),

    interests: z.object({
      batteryStorage: z.boolean(),
      climate: z.boolean(),
      heatPump: z.boolean(),
      wallbox: z.boolean(),
    }),

    notes: z
      .object({
        hasNotes: z.boolean(),
        text: z.string().trim().max(2_000).optional(),
      })
      .superRefine((values, context) => {
        if (
          values.hasNotes &&
          !values.text?.trim()
        ) {
          context.addIssue({
            code: "custom",
            path: ["text"],
            message:
              "Bei ausgewählten Anmerkungen muss ein Text vorhanden sein.",
          });
        }
      }),
  })
  .strict();

export const photovoltaicConfiguratorLeadInputSchema:
  z.ZodType<SubmitPhotovoltaicConfiguratorLeadInput> =
  z
    .object({
      type: z.literal("configurator"),

      configurator: z.object({
        type: z.literal("photovoltaic"),
        answers: photovoltaicAnswersSchema,
        result: photovoltaicResultSchema,
      }),

      contact: z.object({
        firstName: z
          .string()
          .trim()
          .min(2)
          .max(80),

        lastName: z
          .string()
          .trim()
          .min(2)
          .max(80),

        email: z
          .string()
          .trim()
          .email()
          .max(254),

        phone: optionalPhoneSchema
          .transform((value) => value || undefined)
          .optional(),
      }),

      installation: z.object({
        atResidence: z.boolean(),

        street: z
          .string()
          .trim()
          .min(3)
          .max(150),

        postalCode: z
          .string()
          .trim()
          .min(3)
          .max(10),

        city: z
          .string()
          .trim()
          .min(2)
          .max(100),
      }),

      privacyAccepted: z.literal(true),

      website: z
        .string()
        .trim()
        .max(200)
        .optional(),

      formStartedAt: z
        .number()
        .int()
        .positive(),
    })
    .strict();

const commonConfiguratorLeadShape = {
  type: z.literal("configurator"),

  contact: z
    .object({
      firstName: z.string().trim().min(2).max(80),
      lastName: z.string().trim().min(2).max(80),
      email: z.string().trim().email().max(254),

      phone: optionalPhoneSchema
        .transform((value) => value || undefined)
        .optional(),
    })
    .strict(),

  installation: z
    .object({
      atResidence: z.boolean(),

      street: z.string().trim().min(3).max(150),

      postalCode: z
        .string()
        .trim()
        .min(3)
        .max(10)
        .regex(/^[0-9A-Za-z -]+$/),

      city: z.string().trim().min(2).max(100),
    })
    .strict(),

  privacyAccepted: z.literal(true),

  website: z.string().trim().max(200).optional(),

  formStartedAt: z.number().int().positive(),
};

const batteryStorageLeadResultSchema = z
  .object({
    source: z.enum([
      "photovoltaic",
      "standalone",
    ]),

    annualConsumptionKwh:
      z.number().positive(),

    pvPowerKwpMin:
      z.number().nonnegative(),

    pvPowerKwpMax:
      z.number().nonnegative(),

    recommendedUsableCapacityKwhMin:
      z.number().nonnegative(),

    recommendedUsableCapacityKwhMax:
      z.number().nonnegative(),

    technicalUpperBoundUsableCapacityKwh:
      z.number().nonnegative(),

    consumptionPattern: z.enum([
      "mostly_daytime",
      "mixed",
      "mostly_evening",
    ]),

    backupPreference: z.enum([
      "none",
      "selected_loads",
      "whole_home",
    ]),

    goal: z.enum([
      "economic",
      "balanced",
      "high_autonomy",
    ]),

    pvSurplusLikely: z.boolean(),

    backupPowerRequested: z.boolean(),

    wholeHomeBackupRequested:
      z.boolean(),

    modularExpansionRecommended:
      z.boolean(),

    technicalReviewRecommended:
      z.boolean(),
  })
  .strict();

export const batteryStorageConfiguratorLeadInputSchema:
  z.ZodType<SubmitBatteryStorageConfiguratorLeadInput> =
  z
    .object({
      ...commonConfiguratorLeadShape,

      configurator: z
        .object({
          type: z.literal(
            "battery_storage",
          ),

          answers: z
            .object({
              annualConsumptionKwh:
                z.number()
                  .positive()
                  .max(1_000_000)
                  .optional(),

              pvPowerKwp:
                z.number()
                  .positive()
                  .max(10_000)
                  .optional(),

              consumptionPattern:
                z.enum([
                  "mostly_daytime",
                  "mixed",
                  "mostly_evening",
                ]),

              backupPreference:
                z.enum([
                  "none",
                  "selected_loads",
                  "whole_home",
                ]),

              goal: z.enum([
                "economic",
                "balanced",
                "high_autonomy",
              ]),
            })
            .strict(),

          result:
            batteryStorageLeadResultSchema,
        })
        .strict(),
    })
    .strict();

const wallboxLeadResultSchema = z
  .object({
    annualVehicleEnergyDemandKwh:
      z.number().nonnegative(),

    annualHomeChargingInputEnergyKwh:
      z.number().nonnegative(),

    annualPvChargingEnergyKwh:
      z.number().nonnegative(),

    annualGridChargingEnergyKwh:
      z.number().nonnegative(),

    typicalChargingTimeHours:
      z.number().nonnegative(),

    annualHomeChargingCostEuro:
      z.number().nonnegative(),

    monthlyHomeChargingCostEuro:
      z.number().nonnegative(),

    estimatedTotalCostEuro:
      z.number().nonnegative(),

    estimatedMinimumCostEuro:
      z.number().nonnegative(),

    estimatedMaximumCostEuro:
      z.number().nonnegative(),

    usesPhotovoltaicCharging:
      z.boolean(),

    technicalReviewRecommended:
      z.boolean(),
  })
  .strict();

export const wallboxConfiguratorLeadInputSchema:
  z.ZodType<SubmitWallboxConfiguratorLeadInput> =
  z
    .object({
      ...commonConfiguratorLeadShape,

      configurator: z
        .object({
          type: z.literal("wallbox"),

          answers: z
            .object({
              annualDrivingKm:
                z.number()
                  .positive()
                  .max(1_000_000),

              vehicleConsumptionKwhPer100Km:
                z.number()
                  .positive()
                  .max(200),

              batteryCapacityKwh:
                z.number()
                  .positive()
                  .max(500),

              homeChargingSharePercent:
                z.number()
                  .min(0)
                  .max(100),

              chargingPowerKw:
                z.union([
                  z.literal(3.7),
                  z.literal(11),
                  z.literal(22),
                ]),

              pvChargingSharePercent:
                z.number()
                  .min(0)
                  .max(100),
            })
            .strict(),

          result:
            wallboxLeadResultSchema,
        })
        .strict(),
    })
    .strict();

const heatPumpLeadResultSchema = z
  .object({
    recommendedHeatPumpCapacityKw:
      z.number().positive(),

    totalAnnualHeatDemandKwh:
      z.number().nonnegative(),

    spaceHeatingDemandKwh:
      z.number().nonnegative(),

    hotWaterDemandKwh:
      z.number().nonnegative(),

    annualHeatPumpElectricityConsumptionKwh:
      z.number().nonnegative(),

    annualHeatPumpOperatingCostEuro:
      z.number().nonnegative(),

    estimatedTotalCostEuro:
      z.number().nonnegative(),

    estimatedMinimumCostEuro:
      z.number().nonnegative(),

    estimatedMaximumCostEuro:
      z.number().nonnegative(),

    flowTemperatureAssessment:
      z.enum([
        "ntReady",
        "individualReview",
      ]),

    ntReady: z.boolean(),

    technicalReviewRecommended:
      z.boolean(),
  })
  .strict();

export const heatPumpConfiguratorLeadInputSchema:
  z.ZodType<SubmitHeatPumpConfiguratorLeadInput> =
  z
    .object({
      ...commonConfiguratorLeadShape,

      configurator: z
        .object({
          type: z.literal("heat_pump"),

          answers: z
            .object({
              heatedAreaM2:
                z.number()
                  .min(20)
                  .max(5_000),

              specificSpaceHeatingDemandKwhPerM2Year:
                z.number()
                  .min(10)
                  .max(400),

              occupancyPersons:
                z.number()
                  .int()
                  .min(1)
                  .max(100),

              requiredFlowTemperatureC:
                z.number()
                  .min(25)
                  .max(80),

              annualPerformanceFactor:
                z.number()
                  .min(2)
                  .max(7),
            })
            .strict(),

          result:
            heatPumpLeadResultSchema,
        })
        .strict(),
    })
    .strict();

const climateLeadResultSchema = z
  .object({
    calculatedCoolingLoadKw:
      z.number().positive(),

    recommendedCoolingCapacityKw:
      z.number().positive(),

    recommendedIndoorUnitCount:
      z.number().int().positive(),

    averageCapacityPerRoomKw:
      z.number().positive(),

    systemRecommendation:
      z.enum([
        "singleSplit",
        "multiSplit",
        "projectPlanning",
      ]),

    annualElectricityConsumptionKwh:
      z.number().nonnegative(),

    annualOperatingCostEuro:
      z.number().nonnegative(),

    estimatedTotalCostEuro:
      z.number().nonnegative(),

    estimatedMinimumCostEuro:
      z.number().nonnegative(),

    estimatedMaximumCostEuro:
      z.number().nonnegative(),

    individualPlanningRecommended:
      z.boolean(),
  })
  .strict();

export const climateConfiguratorLeadInputSchema:
  z.ZodType<SubmitClimateConfiguratorLeadInput> =
  z
    .object({
      ...commonConfiguratorLeadShape,

      configurator: z
        .object({
          type: z.literal("climate"),

          answers: z
            .object({
              conditionedAreaM2:
                z.number()
                  .min(10)
                  .max(2_000),

              roomCount:
                z.number()
                  .int()
                  .min(1)
                  .max(30),

              insulationLevel:
                z.enum([
                  "good",
                  "average",
                  "weak",
                ]),

              solarLoad:
                z.enum([
                  "low",
                  "medium",
                  "high",
                ]),

              occupancyPersons:
                z.number()
                  .int()
                  .min(1)
                  .max(200),
            })
            .strict(),

          result:
            climateLeadResultSchema,
        })
        .strict(),
    })
    .strict();

export const configuratorLeadInputSchema:
  z.ZodType<SubmitConfiguratorLeadInput> =
  z.union([
    photovoltaicConfiguratorLeadInputSchema,
    batteryStorageConfiguratorLeadInputSchema,
    wallboxConfiguratorLeadInputSchema,
    heatPumpConfiguratorLeadInputSchema,
    climateConfiguratorLeadInputSchema,
  ]);

export function validateConfiguratorContactForm(
  values: ConfiguratorContactFormValues,
) {
  return configuratorContactFormSchema.safeParse(
    values,
  );
}