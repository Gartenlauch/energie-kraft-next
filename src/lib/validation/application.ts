import { z } from "zod";

import { activeJobOpenings } from "@/content/jobs";
import { SALUTATION_VALUES, type ApplicationInput } from "@/types/application";

const activeJobIds = new Set(activeJobOpenings.map((job) => job.id));

export const applicationInputSchema = z
  .object({
    submissionId: z.string().uuid("Die Übermittlungs-ID ist ungültig."),
    jobId: z
      .string()
      .trim()
      .min(1, "Bitte wähle eine Stelle aus.")
      .max(100, "Die ausgewählte Stelle ist ungültig.")
      .refine((jobId) => activeJobIds.has(jobId), "Bitte wähle eine aktuelle Stelle aus."),
    salutation: z.enum(SALUTATION_VALUES).optional(),
    firstName: z.string().trim().min(1, "Bitte gib deinen Vornamen ein.").max(80),
    lastName: z.string().trim().min(1, "Bitte gib deinen Nachnamen ein.").max(80),
    street: z
      .string()
      .trim()
      .min(3, "Bitte gib Straße und Hausnummer ein.")
      .max(160),
    postalCode: z
      .string()
      .trim()
      .regex(/^[0-9A-Za-z -]{3,10}$/, "Bitte gib eine gültige Postleitzahl ein."),
    city: z.string().trim().min(2, "Bitte gib deinen Ort ein.").max(100),
    email: z.string().trim().max(254).email("Bitte gib eine gültige E-Mail-Adresse ein."),
    phone: z.string().trim().min(5, "Bitte gib deine Telefonnummer ein.").max(40),
    qualificationExperience: z
      .string()
      .trim()
      .min(10, "Bitte beschreibe deine Qualifikation oder Erfahrung mit mindestens 10 Zeichen.")
      .max(5_000, "Der Text darf maximal 5.000 Zeichen lang sein."),
    privacyAccepted: z.boolean().refine((value) => value, "Bitte stimme der Datenverarbeitung zu."),
    website: z.string().trim().max(200).optional(),
    formStartedAt: z.number().int().positive().optional(),
  })
  .strict();

export function parseApplicationInput(input: unknown): ApplicationInput {
  return applicationInputSchema.parse(input);
}
