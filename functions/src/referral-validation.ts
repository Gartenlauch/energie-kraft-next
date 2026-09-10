import { z } from "zod";

const SALUTATION_VALUES = ["frau", "herr", "divers"] as const;
const nameSchema = z.string().trim().min(1).max(80);
const emailSchema = z.string().trim().max(254).email();

const referrerSchema = z
  .object({
    salutation: z.enum(SALUTATION_VALUES),
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
  })
  .strict();

const referredCustomerSchema = z
  .object({
    salutation: z.enum(SALUTATION_VALUES),
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phone: z.string().trim().max(40).optional(),
    street: z.string().trim().min(3).max(160),
    postalCode: z.string().trim().regex(/^[0-9A-Za-z -]{3,10}$/),
    city: z.string().trim().min(2).max(100),
  })
  .strict();

export const referralPayloadSchema = z
  .object({
    submissionId: z.string().uuid(),
    referrer: referrerSchema,
    referredCustomer: referredCustomerSchema,
    privacyAccepted: z.boolean().refine((value) => value),
    referredPersonPermissionConfirmed: z.boolean().refine((value) => value),
    website: z.string().trim().max(200).optional(),
    formStartedAt: z.number().int().positive().optional(),
  })
  .strict();

export type ReferralPayload = z.infer<typeof referralPayloadSchema>;
