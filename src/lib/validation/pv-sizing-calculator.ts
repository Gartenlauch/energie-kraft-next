import { z } from "zod";

import {
  PV_ROOF_ORIENTATIONS,
  PV_SHADING_LEVELS,
  type PvSizingCalculatorInput,
} from "@/types/pv-sizing-calculator";

export const pvSizingCalculatorInputSchema = z
  .object({
    annualConsumptionKwh: z.number().finite().positive().max(100_000),

    availableRoofAreaM2: z.number().finite().min(5).max(10_000),

    roofOrientation: z.enum(PV_ROOF_ORIENTATIONS),

    shadingLevel: z.enum(PV_SHADING_LEVELS),

    targetGenerationCoveragePercent: z.number().finite().min(50).max(200),

    modulePowerWattPeak: z.number().finite().min(250).max(700),

    moduleAreaM2: z.number().finite().min(1).max(4),

    usableRoofAreaPercent: z.number().finite().min(20).max(100),

    baseSpecificYieldKwhPerKwp: z.number().finite().min(500).max(2_000),

    pvCostEuroPerKwp: z.number().finite().min(500).max(5_000),

    includeBattery: z.boolean(),

    batteryCostEuroPerKwh: z.number().finite().min(100).max(3_000),

    batteryCapacityPerKwp: z.number().finite().min(0.25).max(2.5),

    fixedAdditionalCostEuro: z.number().finite().min(0).max(1_000_000),

    costUncertaintyPercent: z.number().finite().min(0).max(50),
  })
  .superRefine((values, context) => {
    const usableRoofAreaM2 = values.availableRoofAreaM2 * (values.usableRoofAreaPercent / 100);

    if (usableRoofAreaM2 < values.moduleAreaM2) {
      context.addIssue({
        code: "custom",
        path: ["availableRoofAreaM2"],
        message: "Auf der nutzbaren Dachfläche muss mindestens ein PV-Modul Platz finden.",
      });
    }
  });

export function parsePvSizingCalculatorInput(input: unknown): PvSizingCalculatorInput {
  return pvSizingCalculatorInputSchema.parse(input);
}
