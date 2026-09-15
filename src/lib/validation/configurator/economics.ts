import { z } from "zod";

const moneySchema = z.number().finite();
const costShape = {
  investmentMinEuro: moneySchema.nonnegative(),
  investmentBaseEuro: moneySchema.nonnegative(),
  investmentMaxEuro: moneySchema.nonnegative(),
};

export const projectEconomicsSchema = z
  .object({
    horizonYears: z.number().int().min(1).max(50),
    ...costShape,
    firstYearQuantifiedEffectEuro: moneySchema,
    paybackYears: z.number().nonnegative().max(50).nullable(),
    finalCumulativeCashFlowEuro: moneySchema,
    components: z
      .array(
        z
          .object({
            component: z.enum([
              "photovoltaic",
              "battery_storage",
              "wallbox",
              "heat_pump",
              "climate",
            ]),
            analysisKind: z.enum(["economic_effect", "operating_cost", "investment_only"]),
            ...costShape,
            firstYearEconomicEffectEuro: moneySchema,
            economicLifetimeYears: z.number().int().min(1).max(50),
            explanation: z.string().min(1).max(500),
          })
          .strict(),
      )
      .min(1)
      .max(5),
    projections: z
      .array(
        z
          .object({
            year: z.number().int().min(0).max(50),
            quantifiedEconomicEffectEuro: moneySchema,
            cumulativeCashFlowEuro: moneySchema,
          })
          .strict(),
      )
      .min(2)
      .max(51),
    scenarios: z
      .array(
        z
          .object({
            id: z.enum(["conservative", "base", "favorable"]),
            ...costShape,
            firstYearQuantifiedEffectEuro: moneySchema,
            paybackYears: z.number().nonnegative().max(50).nullable(),
            finalCumulativeCashFlowEuro: moneySchema,
          })
          .strict(),
      )
      .length(3),
    assumptions: z
      .array(
        z
          .object({
            key: z.string().min(1).max(80),
            label: z.string().min(1).max(120),
            value: z.string().min(1).max(120),
            source: z.enum(["user_input", "modeled", "default_assumption"]),
          })
          .strict(),
      )
      .max(30),
    limitations: z.array(z.string().min(1).max(500)).max(20),
  })
  .strict()
  .superRefine((value, context) => {
    if (
      value.investmentMinEuro > value.investmentBaseEuro ||
      value.investmentBaseEuro > value.investmentMaxEuro
    ) {
      context.addIssue({
        code: "custom",
        path: ["investmentBaseEuro"],
        message: "Ungültiger Investitionskorridor.",
      });
    }
    if (value.projections[0]?.year !== 0 || value.projections.at(-1)?.year !== value.horizonYears) {
      context.addIssue({
        code: "custom",
        path: ["projections"],
        message: "Die Projektion muss Jahr 0 und den Modellhorizont enthalten.",
      });
    }
  });
