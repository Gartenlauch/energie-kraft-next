import { z } from "zod";

import { SALUTATION_VALUES } from "@/types/application";
import type { ReferralInput } from "@/types/referral";

const nameSchema = z.string().trim().min(1, "Bitte füllen Sie dieses Feld aus.").max(80);
const emailSchema = z.string().trim().max(254).email("Bitte geben Sie eine gültige E-Mail-Adresse ein.");

export const referralStepOneSchema = z
  .object({
    salutation: z.enum(SALUTATION_VALUES, "Bitte wählen Sie eine Anrede aus."),
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
  })
  .strict();

export const referralStepTwoSchema = z
  .object({
    salutation: z.enum(SALUTATION_VALUES, "Bitte wählen Sie eine Anrede aus."),
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phone: z.string().trim().max(40, "Die Telefonnummer ist zu lang.").optional(),
    street: z
      .string()
      .trim()
      .min(3, "Bitte geben Sie Straße und Hausnummer ein.")
      .max(160),
    postalCode: z
      .string()
      .trim()
      .regex(/^[0-9A-Za-z -]{3,10}$/, "Bitte geben Sie eine gültige Postleitzahl ein."),
    city: z.string().trim().min(2, "Bitte geben Sie den Ort ein.").max(100),
  })
  .strict();

export const referralInputSchema = z
  .object({
    submissionId: z.string().uuid("Die Übermittlungs-ID ist ungültig."),
    referrer: referralStepOneSchema,
    referredCustomer: referralStepTwoSchema,
    privacyAccepted: z.boolean().refine((value) => value, "Bitte stimmen Sie der Datenverarbeitung zu."),
    referredPersonPermissionConfirmed: z
      .boolean()
      .refine((value) => value, "Bitte bestätigen Sie das Einverständnis der empfohlenen Person."),
    website: z.string().trim().max(200).optional(),
    formStartedAt: z.number().int().positive().optional(),
  })
  .strict();

export function parseReferralInput(input: unknown): ReferralInput {
  return referralInputSchema.parse(input);
}
