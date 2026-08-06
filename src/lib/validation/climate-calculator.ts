import { z } from "zod";

import {
  CLIMATE_INSULATION_LEVELS,
  CLIMATE_SOLAR_LOADS,
  type ClimateCalculatorInput,
} from "@/types/climate-calculator";

export const climateCalculatorInputSchema: z.ZodType<ClimateCalculatorInput> = z.object({
  conditionedAreaM2: z.number().finite().min(10).max(2_000),

  roomCount: z.number().int().min(1).max(30),

  ceilingHeightM: z.number().finite().min(2).max(5),

  insulationLevel: z.enum(CLIMATE_INSULATION_LEVELS),

  solarLoad: z.enum(CLIMATE_SOLAR_LOADS),

  occupancyPersons: z.number().int().min(1).max(200),

  internalHeatLoadWatt: z.number().finite().min(0).max(50_000),

  annualEquivalentFullLoadHours: z.number().finite().min(100).max(3_000),

  seasonalEfficiencySeer: z.number().finite().min(3).max(12),

  electricityPriceEuroPerKwh: z.number().finite().min(0.05).max(2),

  equipmentCostEuroPerKw: z.number().finite().min(200).max(5_000),

  indoorUnitCostEuro: z.number().finite().min(0).max(5_000),

  installationBaseCostEuro: z.number().finite().min(0).max(100_000),

  installationCostPerIndoorUnitEuro: z.number().finite().min(0).max(10_000),

  fixedAdditionalCostEuro: z.number().finite().min(0).max(1_000_000),

  costUncertaintyPercent: z.number().finite().min(0).max(50),
});

export function parseClimateCalculatorInput(input: unknown): ClimateCalculatorInput {
  return climateCalculatorInputSchema.parse(input);
}
