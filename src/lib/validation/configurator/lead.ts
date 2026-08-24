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
  SubmitPhotovoltaicConfiguratorLeadInput,
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

export function validateConfiguratorContactForm(
  values: ConfiguratorContactFormValues,
) {
  return configuratorContactFormSchema.safeParse(
    values,
  );
}