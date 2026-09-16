import { z } from "zod";

export const CONFIGURATOR_SETTINGS_SCHEMA_VERSION = 1 as const;

const finitePositive = z.number().finite().positive();
const percentage = z.number().finite().min(0).max(100);

export const priceTierSchema = z
  .object({
    from: finitePositive,
    unitPriceEuro: finitePositive.max(20_000),
  })
  .strict();

const priceTableSchema = z
  .object({
    tiers: z.array(priceTierSchema).min(1).max(20),
    maxModeledSize: finitePositive.max(10_000),
  })
  .strict()
  .superRefine((value, context) => {
    for (let index = 1; index < value.tiers.length; index += 1) {
      const previous = value.tiers[index - 1];
      const current = value.tiers[index];
      if (previous && current && current.from <= previous.from) {
        context.addIssue({
          code: "custom",
          path: ["tiers", index, "from"],
          message: "Die Preisgrenzen müssen streng aufsteigend und eindeutig sein.",
        });
      }
    }

    const highestThreshold = value.tiers[value.tiers.length - 1]?.from ?? 0;
    if (value.maxModeledSize < highestThreshold) {
      context.addIssue({
        code: "custom",
        path: ["maxModeledSize"],
        message: "Die maximale Modellgröße muss mindestens der höchsten Preisgrenze entsprechen.",
      });
    }
  });

export const configuratorSettingsSchema = z
  .object({
    schemaVersion: z.literal(CONFIGURATOR_SETTINGS_SCHEMA_VERSION),
    version: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
    general: z.object({ costUncertaintyPercent: percentage.max(50) }).strict(),
    economics: z
      .object({
        gridElectricityPriceEuroPerKwh: finitePositive.max(5),
        feedInValueEuroPerKwh: z.number().finite().min(0).max(5),
        electricityPriceDevelopmentPercent: z.number().finite().min(-10).max(20),
        projectHorizonYears: z.number().int().min(1).max(40),
      })
      .strict(),
    photovoltaic: z
      .object({
        pricing: priceTableSchema,
        fixedAdditionalCostEuro: z.number().finite().min(0).max(100_000),
        annualDegradationPercent: percentage.max(5),
        defaultSelfConsumptionPercent: percentage,
        annualOperatingCostEuro: z.number().finite().min(0).max(10_000),
        specificYieldKwhPerKwpFallback: finitePositive.max(3_000),
        baseSpecificYieldKwhPerKwp: finitePositive.max(3_000),
        targetGenerationCoveragePercent: finitePositive.max(300),
        yieldUncertaintyPercent: percentage.max(50),
      })
      .strict(),
    batteryStorage: z
      .object({
        pricing: priceTableSchema,
        roundTripEfficiencyPercent: percentage.min(1),
        equivalentFullCyclesPerYear: finitePositive.max(1_000),
        economicLifetimeYears: z.number().int().min(1).max(40),
      })
      .strict(),
    heatPump: z
      .object({
        electricityPriceEuroPerKwh: finitePositive.max(5),
        hotWaterDemandKwhPerPersonYear: finitePositive.max(5_000),
        equivalentFullLoadHours: finitePositive.max(6_000),
        capacityReservePercent: percentage.max(50),
        defaultAnnualPerformanceFactor: finitePositive.min(1).max(10),
        heatPumpCostEuroPerKw: finitePositive.max(20_000),
        installationBaseCostEuro: z.number().finite().min(0).max(200_000),
        fixedAdditionalCostEuro: z.number().finite().min(0).max(100_000),
        gasPriceEuroPerKwh: finitePositive.max(5),
        gasHeatingEfficiencyPercent: percentage.min(1),
        oilPriceEuroPerLitre: finitePositive.max(20),
        oilEnergyContentKwhPerLitre: finitePositive.max(30),
        oilHeatingEfficiencyPercent: percentage.min(1),
      })
      .strict(),
    climate: z
      .object({
        electricityPriceEuroPerKwh: finitePositive.max(5),
        annualEquivalentFullLoadHours: finitePositive.max(5_000),
        seasonalEfficiencySeer: finitePositive.max(20),
        equipmentCostEuroPerKw: finitePositive.max(20_000),
        indoorUnitCostEuro: finitePositive.max(20_000),
        installationBaseCostEuro: z.number().finite().min(0).max(100_000),
        installationCostPerIndoorUnitEuro: z.number().finite().min(0).max(20_000),
        fixedAdditionalCostEuro: z.number().finite().min(0).max(100_000),
      })
      .strict(),
    wallbox: z
      .object({
        electricityPriceEuroPerKwh: finitePositive.max(5),
        publicChargingPriceEuroPerKwh: finitePositive.max(5),
        pvElectricityValueEuroPerKwh: z.number().finite().min(0).max(5),
        defaultChargingEfficiencyPercent: percentage.min(1),
        wallboxCostEuro: z.number().finite().min(0).max(50_000),
        installationBaseCostEuro: z.number().finite().min(0).max(100_000),
        fixedAdditionalCostEuro: z.number().finite().min(0).max(100_000),
      })
      .strict(),
  })
  .strict();

export type ConfiguratorSettings = z.infer<typeof configuratorSettingsSchema>;
export type PriceTier = z.infer<typeof priceTierSchema>;

export const DEFAULT_CONFIGURATOR_SETTINGS: ConfiguratorSettings = {
  schemaVersion: CONFIGURATOR_SETTINGS_SCHEMA_VERSION,
  version: 0,
  general: { costUncertaintyPercent: 15 },
  economics: {
    gridElectricityPriceEuroPerKwh: 0.32,
    feedInValueEuroPerKwh: 0.08,
    electricityPriceDevelopmentPercent: 2,
    projectHorizonYears: 20,
  },
  photovoltaic: {
    pricing: {
      tiers: [
        { from: 4, unitPriceEuro: 1_200 },
        { from: 7, unitPriceEuro: 1_100 },
        { from: 10, unitPriceEuro: 1_000 },
        { from: 15, unitPriceEuro: 900 },
        { from: 20, unitPriceEuro: 800 },
        { from: 30, unitPriceEuro: 750 },
      ],
      maxModeledSize: 50,
    },
    fixedAdditionalCostEuro: 2_000,
    annualDegradationPercent: 0.5,
    defaultSelfConsumptionPercent: 35,
    annualOperatingCostEuro: 200,
    specificYieldKwhPerKwpFallback: 1_000,
    baseSpecificYieldKwhPerKwp: 1_000,
    targetGenerationCoveragePercent: 110,
    yieldUncertaintyPercent: 10,
  },
  batteryStorage: {
    pricing: {
      tiers: [
        { from: 4, unitPriceEuro: 1_000 },
        { from: 7, unitPriceEuro: 800 },
        { from: 16, unitPriceEuro: 700 },
        { from: 22, unitPriceEuro: 600 },
        { from: 33, unitPriceEuro: 500 },
      ],
      maxModeledSize: 54,
    },
    roundTripEfficiencyPercent: 90,
    equivalentFullCyclesPerYear: 220,
    economicLifetimeYears: 15,
  },
  heatPump: {
    electricityPriceEuroPerKwh: 0.3,
    hotWaterDemandKwhPerPersonYear: 800,
    equivalentFullLoadHours: 2_000,
    capacityReservePercent: 15,
    defaultAnnualPerformanceFactor: 3.5,
    heatPumpCostEuroPerKw: 1_200,
    installationBaseCostEuro: 12_000,
    fixedAdditionalCostEuro: 3_000,
    gasPriceEuroPerKwh: 0.12,
    gasHeatingEfficiencyPercent: 85,
    oilPriceEuroPerLitre: 1.1,
    oilEnergyContentKwhPerLitre: 10,
    oilHeatingEfficiencyPercent: 80,
  },
  climate: {
    electricityPriceEuroPerKwh: 0.32,
    annualEquivalentFullLoadHours: 500,
    seasonalEfficiencySeer: 6.5,
    equipmentCostEuroPerKw: 800,
    indoorUnitCostEuro: 800,
    installationBaseCostEuro: 2_500,
    installationCostPerIndoorUnitEuro: 700,
    fixedAdditionalCostEuro: 500,
  },
  wallbox: {
    electricityPriceEuroPerKwh: 0.32,
    publicChargingPriceEuroPerKwh: 0.59,
    pvElectricityValueEuroPerKwh: 0.08,
    defaultChargingEfficiencyPercent: 90,
    wallboxCostEuro: 1_000,
    installationBaseCostEuro: 1_500,
    fixedAdditionalCostEuro: 500,
  },
};

export function createNextConfiguratorSettingsVersion(
  input: ConfiguratorSettings,
  currentVersion: number,
): ConfiguratorSettings {
  return configuratorSettingsSchema.parse({
    ...input,
    schemaVersion: CONFIGURATOR_SETTINGS_SCHEMA_VERSION,
    version: currentVersion + 1,
  });
}

export function resolveConfiguratorSettingsOrDefaults(value: unknown): ConfiguratorSettings {
  const parsed = configuratorSettingsSchema.safeParse(value);
  return parsed.success ? parsed.data : structuredClone(DEFAULT_CONFIGURATOR_SETTINGS);
}

export type PricingMode = "modeled" | "individual_quote_required";

export function parseConfiguratorSettings(value: unknown): ConfiguratorSettings {
  return configuratorSettingsSchema.parse(value);
}

const PUBLIC_REFERENCE_CODES = {
  photovoltaic: "PV",
  battery_storage: "BS",
  heat_pump: "WP",
  climate: "KA",
  wallbox: "WB",
} as const;

const PUBLIC_REFERENCE_ORDER = [
  "photovoltaic",
  "battery_storage",
  "heat_pump",
  "climate",
  "wallbox",
] as const;

export function buildConfiguratorPublicReference(
  products: readonly (keyof typeof PUBLIC_REFERENCE_CODES)[],
  sequence: number,
): string {
  if (!Number.isSafeInteger(sequence) || sequence < 1) {
    throw new Error("Die Projektnummer muss eine positive Ganzzahl sein.");
  }
  const selected = new Set(products);
  const prefix = PUBLIC_REFERENCE_ORDER.filter((product) => selected.has(product))
    .map((product) => PUBLIC_REFERENCE_CODES[product])
    .join("-");
  if (!prefix) throw new Error("Mindestens ein Produkt ist für die Projektreferenz erforderlich.");
  return `${prefix}-${String(sequence).padStart(5, "0")}`;
}

export function nextConfiguratorReferenceSequence(previousValue: unknown): number {
  if (previousValue === Number.MAX_SAFE_INTEGER) {
    throw new Error("Der Projektreferenz-Zähler hat die sichere Ganzzahlgrenze erreicht.");
  }
  if (
    typeof previousValue === "number" &&
    Number.isSafeInteger(previousValue) &&
    previousValue >= 0 &&
    previousValue < Number.MAX_SAFE_INTEGER
  ) {
    return previousValue + 1;
  }
  return 1;
}
