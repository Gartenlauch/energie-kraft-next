import { z } from "zod";

import { calculateProjectedConsumptionKwh } from "@/lib/configurator/state";
import type { ConfiguratorState } from "@/types/configurator";
import { CONFIGURATOR_STATE_VERSION } from "@/types/configurator";

const householdPersonsSchema = z.union([
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

const buildingOwnershipSchema = z.enum(["owner", "tenant"]);

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

const photovoltaicResultSchema = z.object({
  recommendedPowerKwpMin: z.number().positive(),
  recommendedPowerKwpMax: z.number().positive(),
  estimatedAnnualYieldKwhMin: z.number().positive().optional(),
  estimatedAnnualYieldKwhMax: z.number().positive().optional(),
});

export const configuratorStateSchema: z.ZodType<ConfiguratorState> = z.object({
  version: z.literal(CONFIGURATOR_STATE_VERSION),

  activeConfigurator: configuratorTypeSchema.nullable(),

  household: z.object({
    persons: householdPersonsSchema.optional(),
    annualConsumptionKwh: z.number().int().min(500).max(100_000).optional(),
    futureIncreasePercent: z.number().min(0).max(200),
    projectedConsumptionKwh: z
      .number()
      .int()
      .min(500)
      .max(300_000)
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