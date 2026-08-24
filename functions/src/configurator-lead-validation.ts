import { z } from "zod";

const householdPersonsSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal("4_5"),
]);

const buildingTypeSchema = z.enum([
  "detached_house",
  "semi_detached_house",
  "mid_terrace_house",
  "end_terrace_house",
  "multi_family_house",
]);

const roofPitchSchema = z.union([
  z.literal(0),
  z.literal(15),
  z.literal(30),
  z.literal(45),
]);

const roofMaterialSchema = z.enum([
  "roof_tile",
  "beaver_tail",
  "slate",
  "metal",
  "roofing_felt",
  "gravel",
  "plastic",
  "other",
  "unknown",
]);

const roofOrientationSchema = z.enum([
  "south",
  "south_east_south_west",
  "east_west",
  "north",
]);

const roofRenovationPeriodSchema = z.enum([
  "new_build",
  "after_1990",
  "before_1990",
  "before_1960",
  "unknown",
]);

const photovoltaicResultSchema = z
  .object({
    recommendedPowerKwpMin: z.number().int().positive(),
    recommendedPowerKwpMax: z.number().int().positive(),

    estimatedAnnualYieldKwhMin: z.number().int().positive(),
    estimatedAnnualYieldKwhMax: z.number().int().positive(),

    projectedAnnualConsumptionKwh: z.number().int().positive(),
    targetAnnualGenerationKwh: z.number().int().positive(),

    orientationFactor: z.number().positive().max(1),

    specificYieldKwhPerKwpMin: z.number().int().positive(),
    specificYieldKwhPerKwpMax: z.number().int().positive(),

    batteryStorageRequested: z.boolean(),
    technicalReviewRecommended: z.boolean(),
  })
  .strict();

const photovoltaicAnswersSchema = z
  .object({
    household: z
      .object({
        persons: householdPersonsSchema,
        annualConsumptionKwh: z
          .number()
          .int()
          .min(500)
          .max(100_000),
        futureIncreasePercent: z
          .number()
          .min(0)
          .max(200),
        projectedConsumptionKwh: z
          .number()
          .int()
          .positive(),
      })
      .strict(),

    building: z
      .object({
        ownership: z.literal("owner"),
        type: buildingTypeSchema,
      })
      .strict(),

    roof: z
      .object({
        pitch: roofPitchSchema,
        material: roofMaterialSchema,
        orientation: roofOrientationSchema,
        renovationPeriod: roofRenovationPeriodSchema,
      })
      .strict(),

    interests: z
      .object({
        batteryStorage: z.boolean(),
        climate: z.boolean(),
        heatPump: z.boolean(),
        wallbox: z.boolean(),
      })
      .strict(),

    notes: z
      .object({
        hasNotes: z.boolean(),
        text: z.string().trim().max(2_000).optional(),
      })
      .strict()
      .superRefine((values, context) => {
        if (values.hasNotes && !values.text?.trim()) {
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

export const configuratorLeadPayloadSchema = z
  .object({
    type: z.literal("configurator"),

    configurator: z
      .object({
        type: z.literal("photovoltaic"),
        answers: photovoltaicAnswersSchema,
        result: photovoltaicResultSchema,
      })
      .strict(),

    contact: z
      .object({
        firstName: z.string().trim().min(2).max(80),
        lastName: z.string().trim().min(2).max(80),
        email: z.string().trim().max(254).email(),
        phone: z.string().trim().max(40).optional(),
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
  })
  .strict();

export type ConfiguratorLeadPayload = z.infer<
  typeof configuratorLeadPayloadSchema
>;