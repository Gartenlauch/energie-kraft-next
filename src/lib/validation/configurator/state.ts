import { z } from "zod";

import {
  PHOTOVOLTAIC_ANNUAL_CONSUMPTION_MAX_KWH,
  PHOTOVOLTAIC_ANNUAL_CONSUMPTION_MIN_KWH,
  PHOTOVOLTAIC_FUTURE_INCREASE_MAX_PERCENT,
  PHOTOVOLTAIC_FUTURE_INCREASE_MIN_PERCENT,
} from "@/lib/configurator/photovoltaic";
import { calculateProjectedConsumptionKwh } from "@/lib/configurator/state";
import type { ConfiguratorState } from "@/types/configurator";
import { CONFIGURATOR_STATE_VERSION } from "@/types/configurator";

export const householdPersonsSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal("4_5"),
]);

const configuratorTypeSchema = z.enum([
  "photovoltaic",
  "battery_storage",
  "climate",
  "heat_pump",
  "wallbox",
]);

export const buildingOwnershipSchema = z.enum([
  "owner",
  "tenant",
]);

export const buildingTypeSchema = z.enum([
  "detached_house",
  "semi_detached_house",
  "mid_terrace_house",
  "end_terrace_house",
  "multi_family_house",
]);

export const annualConsumptionKwhSchema = z
  .number()
  .int()
  .min(PHOTOVOLTAIC_ANNUAL_CONSUMPTION_MIN_KWH)
  .max(PHOTOVOLTAIC_ANNUAL_CONSUMPTION_MAX_KWH);

export const futureIncreasePercentSchema = z
  .number()
  .min(PHOTOVOLTAIC_FUTURE_INCREASE_MIN_PERCENT)
  .max(PHOTOVOLTAIC_FUTURE_INCREASE_MAX_PERCENT);

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

const photovoltaicResultSchema = z.object({
  recommendedPowerKwpMin: z.number().positive(),
  recommendedPowerKwpMax: z.number().positive(),
  estimatedAnnualYieldKwhMin: z.number().positive().optional(),
  estimatedAnnualYieldKwhMax: z.number().positive().optional(),
});

const projectedConsumptionMaxKwh =
  PHOTOVOLTAIC_ANNUAL_CONSUMPTION_MAX_KWH *
  (1 + PHOTOVOLTAIC_FUTURE_INCREASE_MAX_PERCENT / 100);

export const configuratorStateSchema: z.ZodType<ConfiguratorState> =
  z.object({
    version: z.literal(CONFIGURATOR_STATE_VERSION),

    activeConfigurator: configuratorTypeSchema.nullable(),

    household: z.object({
      persons: householdPersonsSchema.optional(),
      annualConsumptionKwh: annualConsumptionKwhSchema.optional(),
      futureIncreasePercent: futureIncreasePercentSchema,
      projectedConsumptionKwh: z
        .number()
        .int()
        .min(PHOTOVOLTAIC_ANNUAL_CONSUMPTION_MIN_KWH)
        .max(projectedConsumptionMaxKwh)
        .optional(),
    }),

    building: z.object({
      ownership: buildingOwnershipSchema.optional(),
      type: buildingTypeSchema.optional(),
    }),

    roof: z.object({
      pitch: roofPitchSchema.optional(),
      material: roofMaterialSchema.optional(),
      orientation: roofOrientationSchema.optional(),
      renovationPeriod: roofRenovationPeriodSchema.optional(),
    }),

    interests: z.object({
      batteryStorage: z.boolean(),
      climate: z.boolean(),
      heatPump: z.boolean(),
      wallbox: z.boolean(),
    }),

    notes: z.object({
      hasNotes: z.boolean().optional(),
      text: z.string().max(2_000).optional(),
    }),

    results: z.object({
      photovoltaic: photovoltaicResultSchema.optional(),
    }),
  });

export function parseConfiguratorState(
  input: unknown,
): ConfiguratorState | null {
  const result = configuratorStateSchema.safeParse(input);

  if (!result.success) {
    return null;
  }

  return {
    ...result.data,
    household: {
      ...result.data.household,
      projectedConsumptionKwh: calculateProjectedConsumptionKwh(
        result.data.household.annualConsumptionKwh,
        result.data.household.futureIncreasePercent,
      ),
    },
  };
}