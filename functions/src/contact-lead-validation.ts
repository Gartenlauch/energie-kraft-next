import { z } from "zod";

const CONTACT_INTEREST_VALUES = [
  "photovoltaik",
  "stromspeicher",
  "wallbox",
  "klimaanlage",
  "waermepumpe",
  "sonstiges",
] as const;

const CONTACT_PREFERENCE_VALUES = [
  "telefon",
  "email",
  "egal",
] as const;

const BUILDING_TYPE_VALUES = [
  "einfamilienhaus",
  "mehrfamilienhaus",
  "gewerbe",
  "sonstiges",
] as const;

const OWNERSHIP_VALUES = [
  "eigentuemer",
  "mieter",
  "sonstiges",
] as const;

export const contactLeadPayloadSchema = z
  .object({
    firstName: z.string().trim().min(2).max(80),

    lastName: z.string().trim().min(2).max(80),

    company: z.string().trim().max(120).optional(),

    email: z.string().trim().max(254).email(),

    phone: z.string().trim().max(40).optional(),

    postalCode: z
      .string()
      .trim()
      .min(3)
      .max(10)
      .regex(/^[0-9A-Za-z -]+$/),

    city: z.string().trim().min(2).max(100),

    interests: z
      .array(z.enum(CONTACT_INTEREST_VALUES))
      .min(1)
      .max(CONTACT_INTEREST_VALUES.length)
      .refine(
        (values) => new Set(values).size === values.length,
      ),

    buildingType: z.enum(BUILDING_TYPE_VALUES).optional(),

    ownership: z.enum(OWNERSHIP_VALUES).optional(),

    message: z.string().trim().min(10).max(5_000),

    preferredContact: z.enum(CONTACT_PREFERENCE_VALUES),

    privacyAccepted: z
      .boolean()
      .refine((accepted) => accepted),

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
        message: "Telefonnummer erforderlich.",
      });
    }
  });

export type ContactLeadPayload = z.infer<
  typeof contactLeadPayloadSchema
>;