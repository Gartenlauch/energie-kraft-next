import { z } from "zod";

/*
 * Photovoltaik
 */

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

    estimatedAnnualYieldKwhMin:
      z.number().int().positive(),

    estimatedAnnualYieldKwhMax:
      z.number().int().positive(),

    projectedAnnualConsumptionKwh:
      z.number().int().positive(),

    targetAnnualGenerationKwh:
      z.number().int().positive(),

    orientationFactor:
      z.number().positive().max(1),

    specificYieldKwhPerKwpMin:
      z.number().int().positive(),

    specificYieldKwhPerKwpMax:
      z.number().int().positive(),

    batteryStorageRequested:
      z.boolean(),

    technicalReviewRecommended:
      z.boolean(),
  })
  .strict();

const photovoltaicAnswersSchema = z
  .object({
    household: z
      .object({
        persons: householdPersonsSchema,

        annualConsumptionKwh:
          z.number()
            .int()
            .min(500)
            .max(100_000),

        futureIncreasePercent:
          z.number()
            .min(0)
            .max(200),

        projectedConsumptionKwh:
          z.number()
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
        renovationPeriod:
          roofRenovationPeriodSchema,
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

        text: z
          .string()
          .trim()
          .max(2_000)
          .optional(),
      })
      .strict()
      .superRefine(
        (values, context) => {
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
        },
      ),
  })
  .strict();

/*
 * Stromspeicher
 */

const batteryStorageAnswersSchema = z
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
  })
  .strict();

const batteryStorageResultSchema = z
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

    pvSurplusLikely:
      z.boolean(),

    backupPowerRequested:
      z.boolean(),

    wholeHomeBackupRequested:
      z.boolean(),

    modularExpansionRecommended:
      z.boolean(),

    technicalReviewRecommended:
      z.boolean(),
  })
  .strict();

/*
 * Wallbox
 */

const wallboxAnswersSchema = z
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

    chargingPowerKw: z.union([
      z.literal(3.7),
      z.literal(11),
      z.literal(22),
    ]),

    pvChargingSharePercent:
      z.number()
        .min(0)
        .max(100),
  })
  .strict();

const wallboxResultSchema = z
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

/*
 * Wärmepumpe
 */

const heatPumpAnswersSchema = z
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
  .strict();

const heatPumpResultSchema = z
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

/*
 * Klimaanlage
 */

const climateAnswersSchema = z
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
  .strict();

const climateResultSchema = z
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

/*
 * Der verschachtelte configurator.type-Wert ist
 * der gemeinsame Discriminator.
 */

const configuratorSchema =
  z.discriminatedUnion("type", [
    z
      .object({
        type: z.literal(
          "photovoltaic",
        ),
        answers:
          photovoltaicAnswersSchema,
        result:
          photovoltaicResultSchema,
      })
      .strict(),

    z
      .object({
        type: z.literal(
          "battery_storage",
        ),
        answers:
          batteryStorageAnswersSchema,
        result:
          batteryStorageResultSchema,
      })
      .strict(),

    z
      .object({
        type: z.literal("wallbox"),
        answers:
          wallboxAnswersSchema,
        result:
          wallboxResultSchema,
      })
      .strict(),

    z
      .object({
        type: z.literal("heat_pump"),
        answers:
          heatPumpAnswersSchema,
        result:
          heatPumpResultSchema,
      })
      .strict(),

    z
      .object({
        type: z.literal("climate"),
        answers:
          climateAnswersSchema,
        result:
          climateResultSchema,
      })
      .strict(),
  ]);

export const configuratorLeadPayloadSchema =
  z
    .object({
      type: z.literal("configurator"),

      configurator:
        configuratorSchema,

      contact: z
        .object({
          firstName:
            z.string()
              .trim()
              .min(2)
              .max(80),

          lastName:
            z.string()
              .trim()
              .min(2)
              .max(80),

          email:
            z.string()
              .trim()
              .max(254)
              .email(),

          phone:
            z.string()
              .trim()
              .max(40)
              .optional(),
        })
        .strict(),

      installation: z
        .object({
          atResidence:
            z.boolean(),

          street:
            z.string()
              .trim()
              .min(3)
              .max(150),

          postalCode:
            z.string()
              .trim()
              .min(3)
              .max(10)
              .regex(
                /^[0-9A-Za-z -]+$/,
              ),

          city:
            z.string()
              .trim()
              .min(2)
              .max(100),
        })
        .strict(),

      privacyAccepted:
        z.literal(true),

      website:
        z.string()
          .trim()
          .max(200)
          .optional(),

      formStartedAt:
        z.number()
          .int()
          .positive(),
    })
    .strict();

export type ConfiguratorPayload =
  z.infer<typeof configuratorSchema>;

export type ConfiguratorLeadPayload =
  z.infer<
    typeof configuratorLeadPayloadSchema
  >;