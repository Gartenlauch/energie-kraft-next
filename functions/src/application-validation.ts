import { z } from "zod";

const SALUTATION_VALUES = ["frau", "herr", "divers"] as const;

// Server-side integrity allowlist mirroring the public catalog in src/content/jobs.ts.
// Job titles are never trusted from the browser.
export const APPLICATION_JOB_TITLES = {
  elektriker: "Elektriker (w/m/d)",
  dachmonteur: "Dachmonteur:in (w/m/d)",
  "ausbildung-elektroniker-gebaeudetechnik":
    "Ausbildung Elektroniker:in Gebäudetechnik (w/m/d)",
} as const;

export const applicationPayloadSchema = z
  .object({
    submissionId: z.string().uuid(),
    jobId: z.string().trim().max(100).refine((value) => value in APPLICATION_JOB_TITLES),
    salutation: z.enum(SALUTATION_VALUES).optional(),
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    street: z.string().trim().min(3).max(160),
    postalCode: z.string().trim().regex(/^[0-9A-Za-z -]{3,10}$/),
    city: z.string().trim().min(2).max(100),
    email: z.string().trim().max(254).email(),
    phone: z.string().trim().min(5).max(40),
    qualificationExperience: z.string().trim().min(10).max(5_000),
    privacyAccepted: z.boolean().refine((value) => value),
    website: z.string().trim().max(200).optional(),
    formStartedAt: z.number().int().positive().optional(),
  })
  .strict();

export type ApplicationPayload = z.infer<typeof applicationPayloadSchema>;

export function getApplicationJobTitle(jobId: string): string | null {
  return jobId in APPLICATION_JOB_TITLES
    ? APPLICATION_JOB_TITLES[jobId as keyof typeof APPLICATION_JOB_TITLES]
    : null;
}
