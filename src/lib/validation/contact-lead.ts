import { z } from "zod";

import {
  BUILDING_TYPE_VALUES,
  CONTACT_INTEREST_VALUES,
  CONTACT_PREFERENCE_VALUES,
  OWNERSHIP_VALUES,
  type ContactLeadInput,
} from "@/types/contact-lead";

const optionalShortText = z.string().trim().max(120).optional();

export const contactLeadInputSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "Bitte geben Sie Ihren Vornamen ein.")
      .max(80, "Der Vorname ist zu lang."),

    lastName: z
      .string()
      .trim()
      .min(2, "Bitte geben Sie Ihren Nachnamen ein.")
      .max(80, "Der Nachname ist zu lang."),

    company: optionalShortText,

    email: z
      .string()
      .trim()
      .min(1, "Bitte geben Sie Ihre E-Mail-Adresse ein.")
      .max(254, "Die E-Mail-Adresse ist zu lang.")
      .email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),

    phone: z
      .string()
      .trim()
      .max(40, "Die Telefonnummer ist zu lang.")
      .optional(),

    postalCode: z
      .string()
      .trim()
      .min(3, "Bitte geben Sie eine gültige Postleitzahl ein.")
      .max(10, "Die Postleitzahl ist zu lang.")
      .regex(
        /^[0-9A-Za-z -]+$/,
        "Bitte geben Sie eine gültige Postleitzahl ein.",
      ),

    city: z
      .string()
      .trim()
      .min(2, "Bitte geben Sie einen Ort ein.")
      .max(100, "Der Ortsname ist zu lang."),

    interests: z
      .array(z.enum(CONTACT_INTEREST_VALUES))
      .min(1, "Bitte wählen Sie mindestens ein Anliegen aus.")
      .max(
        CONTACT_INTEREST_VALUES.length,
        "Es wurden zu viele Anliegen ausgewählt.",
      )
      .refine(
        (values) => new Set(values).size === values.length,
        "Ein Anliegen darf nur einmal ausgewählt werden.",
      ),

    buildingType: z.enum(BUILDING_TYPE_VALUES).optional(),

    ownership: z.enum(OWNERSHIP_VALUES).optional(),

    message: z
      .string()
      .trim()
      .min(
        10,
        "Bitte beschreiben Sie Ihr Anliegen mit mindestens 10 Zeichen.",
      )
      .max(5_000, "Die Nachricht darf maximal 5.000 Zeichen lang sein."),

    preferredContact: z.enum(CONTACT_PREFERENCE_VALUES),

    privacyAccepted: z
      .boolean()
      .refine(
        (accepted) => accepted,
        "Bitte bestätigen Sie die Datenschutzhinweise.",
      ),

    website: z.string().trim().max(200).optional(),

    formStartedAt: z.number().int().positive().optional(),
  })
  .strict()
  .superRefine((values, context) => {
    if (
      values.preferredContact === "telefon" &&
      !values.phone?.trim()
    ) {
      context.addIssue({
        code: "custom",
        path: ["phone"],
        message:
          "Bitte geben Sie eine Telefonnummer an, wenn Sie telefonisch kontaktiert werden möchten.",
      });
    }
  });

export function parseContactLeadInput(
  input: unknown,
): ContactLeadInput {
  return contactLeadInputSchema.parse(input);
}