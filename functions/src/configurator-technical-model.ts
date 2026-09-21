import type {
  ConfiguratorSettings,
  PriceTier,
  PricingMode,
} from "./configurator-settings-model.js";
import type { ConfiguratorPayload } from "./configurator-lead-validation.js";

export interface TierPriceResolution {
  pricingMode: PricingMode;
  unitPriceEuro: number | null;
}

export function normalizeModeledSizeCorridor(
  rawMin: number,
  rawMax: number,
  minimumModeledSize: number,
) {
  return {
    min: Math.max(rawMin, minimumModeledSize),
    max: Math.max(rawMax, minimumModeledSize),
  };
}

export function resolveTierPrice(
  size: number,
  table: { tiers: readonly PriceTier[]; maxModeledSize: number },
): TierPriceResolution {
  if (!Number.isFinite(size) || size > table.maxModeledSize) {
    return { pricingMode: "individual_quote_required", unitPriceEuro: null };
  }

  const tier = [...table.tiers].reverse().find((candidate) => size >= candidate.from);
  return tier
    ? { pricingMode: "modeled", unitPriceEuro: tier.unitPriceEuro }
    : { pricingMode: "individual_quote_required", unitPriceEuro: null };
}

export interface TieredCostCorridor {
  pricingMode: PricingMode;
  estimatedTotalCostEuro: number | null;
  estimatedMinimumCostEuro: number | null;
  estimatedMaximumCostEuro: number | null;
}

export function calculateTieredCostCorridor(input: {
  sizeMin: number;
  sizeMax: number;
  pricing: { tiers: readonly PriceTier[]; maxModeledSize: number };
  fixedAdditionalCostEuro?: number;
  costUncertaintyPercent: number;
}): TieredCostCorridor {
  const baseSize = (input.sizeMin + input.sizeMax) / 2;
  const minimum = resolveTierPrice(input.sizeMin, input.pricing);
  const base = resolveTierPrice(baseSize, input.pricing);
  const maximum = resolveTierPrice(input.sizeMax, input.pricing);
  if (!minimum.unitPriceEuro || !base.unitPriceEuro || !maximum.unitPriceEuro) {
    return {
      pricingMode: "individual_quote_required",
      estimatedTotalCostEuro: null,
      estimatedMinimumCostEuro: null,
      estimatedMaximumCostEuro: null,
    };
  }

  const fixed = input.fixedAdditionalCostEuro ?? 0;
  const uncertainty = input.costUncertaintyPercent / 100;
  return {
    pricingMode: "modeled",
    estimatedTotalCostEuro: Math.round(baseSize * base.unitPriceEuro + fixed),
    estimatedMinimumCostEuro: Math.round(
      (input.sizeMin * minimum.unitPriceEuro + fixed) * (1 - uncertainty),
    ),
    estimatedMaximumCostEuro: Math.round(
      (input.sizeMax * maximum.unitPriceEuro + fixed) * (1 + uncertainty),
    ),
  };
}

type Photovoltaic = Extract<ConfiguratorPayload, { type: "photovoltaic" }>;
type BatteryStorage = Extract<ConfiguratorPayload, { type: "battery_storage" }>;
type HeatPump = Extract<ConfiguratorPayload, { type: "heat_pump" }>;
type Climate = Extract<ConfiguratorPayload, { type: "climate" }>;
type Wallbox = Extract<ConfiguratorPayload, { type: "wallbox" }>;
type PhotovoltaicSizingAnswers = {
  household: Pick<Photovoltaic["answers"]["household"], "annualConsumptionKwh" | "futureIncreasePercent">;
  roof: Pick<Photovoltaic["answers"]["roof"], "orientation" | "renovationPeriod">;
  interests: Pick<Photovoltaic["answers"]["interests"], "batteryStorage">;
};

const ORIENTATION_FACTORS = {
  south: 1,
  south_east_south_west: 0.95,
  east_west: 0.85,
  north: 0.65,
} as const;

export function derivePhotovoltaicResult(
  answers: PhotovoltaicSizingAnswers,
  settings: ConfiguratorSettings,
): Photovoltaic["result"] {
  const projectedAnnualConsumptionKwh = Math.round(
    answers.household.annualConsumptionKwh *
      (1 + answers.household.futureIncreasePercent / 100),
  );
  const orientationFactor = ORIENTATION_FACTORS[answers.roof.orientation];
  const specificYield = settings.photovoltaic.baseSpecificYieldKwhPerKwp * orientationFactor;
  const yieldUncertainty = settings.photovoltaic.yieldUncertaintyPercent / 100;
  const specificYieldMin = specificYield * (1 - yieldUncertainty);
  const specificYieldMax = specificYield * (1 + yieldUncertainty);
  const targetAnnualGenerationKwh = Math.round(
    projectedAnnualConsumptionKwh *
      (settings.photovoltaic.targetGenerationCoveragePercent / 100),
  );
  const rawPowerKwpMin = Math.max(
    1,
    Math.ceil(targetAnnualGenerationKwh / specificYieldMax),
  );
  const rawPowerKwpMax = Math.max(
    rawPowerKwpMin + 1,
    Math.ceil(targetAnnualGenerationKwh / specificYieldMin),
  );
  const normalizedPower = normalizeModeledSizeCorridor(
    rawPowerKwpMin, rawPowerKwpMax, settings.photovoltaic.pricing.tiers[0]!.from,
  );
  const recommendedPowerKwpMin = normalizedPower.min;
  const recommendedPowerKwpMax = normalizedPower.max;
  return {
    recommendedPowerKwpMin,
    recommendedPowerKwpMax,
    estimatedAnnualYieldKwhMin:
      Math.round((recommendedPowerKwpMin * specificYieldMin) / 100) * 100,
    estimatedAnnualYieldKwhMax:
      Math.round((recommendedPowerKwpMax * specificYieldMax) / 100) * 100,
    projectedAnnualConsumptionKwh,
    targetAnnualGenerationKwh,
    orientationFactor,
    specificYieldKwhPerKwpMin: Math.round(specificYieldMin),
    specificYieldKwhPerKwpMax: Math.round(specificYieldMax),
    ...calculateTieredCostCorridor({
      sizeMin: recommendedPowerKwpMin,
      sizeMax: recommendedPowerKwpMax,
      pricing: settings.photovoltaic.pricing,
      fixedAdditionalCostEuro: settings.photovoltaic.fixedAdditionalCostEuro,
      costUncertaintyPercent: settings.general.costUncertaintyPercent,
    }),
    batteryStorageRequested: answers.interests.batteryStorage,
    technicalReviewRecommended:
      answers.roof.orientation === "north" ||
      answers.roof.renovationPeriod === "before_1960",
  };
}

export const BATTERY_STORAGE_MAX_KWH_PER_KWP = 1.5;
export const BATTERY_STORAGE_MAX_KWH_PER_1000_KWH_CONSUMPTION = 1.5;
export const BATTERY_STORAGE_MIN_PV_KW_PER_1000_KWH_CONSUMPTION = 0.5;

const GOAL_FACTORS = {
  economic: 0.7,
  balanced: 0.9,
  high_autonomy: 1,
} as const;
const CONSUMPTION_PATTERN_FACTORS = {
  mostly_daytime: 0.85,
  mixed: 1,
  mostly_evening: 1.05,
} as const;

export function deriveBatteryStorageResult(
  answers: BatteryStorage["answers"],
  photovoltaic: Photovoltaic["result"] | undefined,
  modularExpansionRecommended: boolean,
  settings: ConfiguratorSettings,
): BatteryStorage["result"] {
  const source = photovoltaic ? "photovoltaic" : "standalone";
  const annualConsumptionKwh =
    photovoltaic?.projectedAnnualConsumptionKwh ?? answers.annualConsumptionKwh;
  const pvPowerKwpMin = photovoltaic?.recommendedPowerKwpMin ?? answers.pvPowerKwp;
  const pvPowerKwpMax = photovoltaic?.recommendedPowerKwpMax ?? answers.pvPowerKwp;
  if (
    annualConsumptionKwh === undefined ||
    pvPowerKwpMin === undefined ||
    pvPowerKwpMax === undefined
  ) {
    throw new Error("Stromspeicher-Dimensionierung ohne Verbrauch oder PV-Leistung");
  }
  const annualConsumptionInThousands = annualConsumptionKwh / 1_000;
  const technicalUpperBoundUsableCapacityKwh = Math.min(
    annualConsumptionInThousands * BATTERY_STORAGE_MAX_KWH_PER_1000_KWH_CONSUMPTION,
    pvPowerKwpMax * BATTERY_STORAGE_MAX_KWH_PER_KWP,
  );
  const targetCapacityKwh = Math.min(
    technicalUpperBoundUsableCapacityKwh,
    technicalUpperBoundUsableCapacityKwh *
      GOAL_FACTORS[answers.goal] *
      CONSUMPTION_PATTERN_FACTORS[answers.consumptionPattern],
  );
  const rawCapacityKwhMin = Math.max(
    0.5,
    Math.round(targetCapacityKwh * 0.85 * 2) / 2,
  );
  const rawCapacityKwhMax = Math.max(
    rawCapacityKwhMin,
    Math.round(Math.min(technicalUpperBoundUsableCapacityKwh, targetCapacityKwh * 1.15) * 2) / 2,
  );
  const normalizedCapacity = normalizeModeledSizeCorridor(
    rawCapacityKwhMin, rawCapacityKwhMax, settings.batteryStorage.pricing.tiers[0]!.from,
  );
  const recommendedUsableCapacityKwhMin = normalizedCapacity.min;
  const recommendedUsableCapacityKwhMax = normalizedCapacity.max;
  const pvSurplusLikely = pvPowerKwpMin >
    annualConsumptionInThousands * BATTERY_STORAGE_MIN_PV_KW_PER_1000_KWH_CONSUMPTION;
  const wholeHomeBackupRequested = answers.backupPreference === "whole_home";
  return {
    source,
    annualConsumptionKwh,
    pvPowerKwpMin,
    pvPowerKwpMax,
    recommendedUsableCapacityKwhMin,
    recommendedUsableCapacityKwhMax,
    ...calculateTieredCostCorridor({
      sizeMin: recommendedUsableCapacityKwhMin,
      sizeMax: recommendedUsableCapacityKwhMax,
      pricing: settings.batteryStorage.pricing,
      costUncertaintyPercent: settings.general.costUncertaintyPercent,
    }),
    technicalUpperBoundUsableCapacityKwh:
      Math.round((technicalUpperBoundUsableCapacityKwh + Number.EPSILON) * 100) / 100,
    consumptionPattern: answers.consumptionPattern,
    backupPreference: answers.backupPreference,
    goal: answers.goal,
    pvSurplusLikely,
    backupPowerRequested: answers.backupPreference !== "none",
    wholeHomeBackupRequested,
    modularExpansionRecommended,
    technicalReviewRecommended:
      Boolean(photovoltaic?.technicalReviewRecommended) ||
      !pvSurplusLikely ||
      wholeHomeBackupRequested,
  };
}

function round(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function costCorridor(base: number, uncertaintyPercent: number) {
  const factor = uncertaintyPercent / 100;
  return {
    estimatedTotalCostEuro: round(base),
    estimatedMinimumCostEuro: round(base * (1 - factor)),
    estimatedMaximumCostEuro: round(base * (1 + factor)),
  };
}

export function deriveHeatPumpResult(
  answers: HeatPump["answers"],
  settings: ConfiguratorSettings,
): HeatPump["result"] {
  const model = settings.heatPump;
  const spaceHeatingDemandKwh =
    answers.heatedAreaM2 * answers.specificSpaceHeatingDemandKwhPerM2Year;
  const hotWaterDemandKwh = answers.occupancyPersons * model.hotWaterDemandKwhPerPersonYear;
  const totalAnnualHeatDemandKwh = spaceHeatingDemandKwh + hotWaterDemandKwh;
  const recommendedHeatPumpCapacityKw =
    Math.ceil((totalAnnualHeatDemandKwh / model.equivalentFullLoadHours) *
      (1 + model.capacityReservePercent / 100) * 2) / 2;
  const annualHeatPumpElectricityConsumptionKwh =
    totalAnnualHeatDemandKwh / answers.annualPerformanceFactor;
  const annualHeatPumpOperatingCostEuro =
    annualHeatPumpElectricityConsumptionKwh * model.electricityPriceEuroPerKwh;
  const system = answers.existingHeatingSystem;
  const isOil = system === "oil" || system === "new_build";
  const hasUserConsumption =
    (system === "gas" && answers.annualGasConsumptionKwh !== undefined) ||
    (system === "oil" && answers.annualOilConsumptionLitres !== undefined);
  const comparisonFuelPriceEuroPerUnit = system === "other_unknown"
    ? null
    : isOil ? model.oilPriceEuroPerLitre : model.gasPriceEuroPerKwh;
  const comparisonEfficiencyPercent = system === "other_unknown"
    ? null
    : isOil ? model.oilHeatingEfficiencyPercent : model.gasHeatingEfficiencyPercent;
  const comparisonEnergyPriceEuroPerKwh = isOil
    ? model.oilPriceEuroPerLitre / model.oilEnergyContentKwhPerLitre
    : model.gasPriceEuroPerKwh;
  const currentHeatingOperatingCostEuro = system === "other_unknown"
    ? null
    : system === "gas" && answers.annualGasConsumptionKwh !== undefined
      ? answers.annualGasConsumptionKwh * model.gasPriceEuroPerKwh
      : system === "oil" && answers.annualOilConsumptionLitres !== undefined
        ? answers.annualOilConsumptionLitres * model.oilPriceEuroPerLitre
        : (totalAnnualHeatDemandKwh / (comparisonEfficiencyPercent! / 100)) *
          comparisonEnergyPriceEuroPerKwh;
  const ntReady = answers.requiredFlowTemperatureC <= 55;
  const projectCost = recommendedHeatPumpCapacityKw * model.heatPumpCostEuroPerKw +
    model.installationBaseCostEuro + model.fixedAdditionalCostEuro;
  return {
    recommendedHeatPumpCapacityKw: round(recommendedHeatPumpCapacityKw),
    totalAnnualHeatDemandKwh: round(totalAnnualHeatDemandKwh),
    spaceHeatingDemandKwh: round(spaceHeatingDemandKwh),
    hotWaterDemandKwh: round(hotWaterDemandKwh),
    annualHeatPumpElectricityConsumptionKwh: round(annualHeatPumpElectricityConsumptionKwh),
    annualHeatPumpOperatingCostEuro: round(annualHeatPumpOperatingCostEuro),
    currentHeatingOperatingCostEuro:
      currentHeatingOperatingCostEuro === null ? null : round(currentHeatingOperatingCostEuro),
    annualOperatingCostDifferenceEuro: currentHeatingOperatingCostEuro === null
      ? null
      : round(currentHeatingOperatingCostEuro - annualHeatPumpOperatingCostEuro),
    heatingComparisonKind: system === "other_unknown"
      ? "unavailable"
      : system === "new_build" ? "reference_scenario" : "existing_system",
    heatingComparisonBasis: system === "other_unknown"
      ? "unavailable"
      : hasUserConsumption ? "user_consumption" : "modeled_heat_demand",
    heatingComparisonLabel: system === "other_unknown"
      ? "Vergleich nicht verfügbar"
      : system === "new_build"
        ? "Modelliertes Referenzszenario: Öl-Zentralheizung"
        : isOil ? "Ölheizung" : "Gasheizung",
    comparisonFuelPriceEuroPerUnit,
    comparisonFuelUnit: system === "other_unknown" ? null : isOil ? "litre" : "kWh",
    comparisonEfficiencyPercent,
    oilEnergyContentKwhPerLitre:
      system === "other_unknown" || !isOil ? null : model.oilEnergyContentKwhPerLitre,
    ...costCorridor(projectCost, settings.general.costUncertaintyPercent),
    flowTemperatureAssessment: ntReady ? "ntReady" : "individualReview",
    ntReady,
    technicalReviewRecommended: !ntReady,
  };
}

const CLIMATE_INSULATION_LOAD = { good: 60, average: 80, weak: 100 } as const;
const CLIMATE_SOLAR_FACTOR = { low: 0.9, medium: 1, high: 1.15 } as const;

export function deriveClimateResult(
  answers: Climate["answers"],
  settings: ConfiguratorSettings,
): Climate["result"] {
  const model = settings.climate;
  const calculatedCoolingLoadKw =
    ((answers.conditionedAreaM2 * CLIMATE_INSULATION_LOAD[answers.insulationLevel] *
      CLIMATE_SOLAR_FACTOR[answers.solarLoad]) / 1_000 +
      answers.occupancyPersons * 0.1 + 0.5) * 1.1;
  const recommendedCoolingCapacityKw = Math.ceil(calculatedCoolingLoadKw * 2) / 2;
  const recommendedIndoorUnitCount = answers.roomCount;
  const systemRecommendation = answers.roomCount === 1
    ? "singleSplit"
    : answers.roomCount <= 5 ? "multiSplit" : "projectPlanning";
  const annualElectricityConsumptionKwh =
    recommendedCoolingCapacityKw * model.annualEquivalentFullLoadHours /
    model.seasonalEfficiencySeer;
  const projectCost =
    recommendedCoolingCapacityKw * model.equipmentCostEuroPerKw +
    recommendedIndoorUnitCount * model.indoorUnitCostEuro +
    model.installationBaseCostEuro +
    recommendedIndoorUnitCount * model.installationCostPerIndoorUnitEuro +
    model.fixedAdditionalCostEuro;
  return {
    calculatedCoolingLoadKw: round(calculatedCoolingLoadKw),
    recommendedCoolingCapacityKw: round(recommendedCoolingCapacityKw),
    recommendedIndoorUnitCount,
    averageCapacityPerRoomKw: round(recommendedCoolingCapacityKw / recommendedIndoorUnitCount),
    systemRecommendation,
    annualElectricityConsumptionKwh: round(annualElectricityConsumptionKwh),
    annualOperatingCostEuro: round(
      annualElectricityConsumptionKwh * model.electricityPriceEuroPerKwh,
    ),
    ...costCorridor(projectCost, settings.general.costUncertaintyPercent),
    individualPlanningRecommended: systemRecommendation === "projectPlanning",
  };
}

export function deriveWallboxResult(
  answers: Wallbox["answers"],
  settings: ConfiguratorSettings,
): Wallbox["result"] {
  const model = settings.wallbox;
  const annualVehicleEnergyDemandKwh =
    answers.annualDrivingKm * answers.vehicleConsumptionKwhPer100Km / 100;
  const annualHomeChargingInputEnergyKwh =
    annualVehicleEnergyDemandKwh * answers.homeChargingSharePercent / 100 /
    (model.defaultChargingEfficiencyPercent / 100);
  const annualPvChargingEnergyKwh =
    annualHomeChargingInputEnergyKwh * answers.pvChargingSharePercent / 100;
  const annualGridChargingEnergyKwh =
    annualHomeChargingInputEnergyKwh - annualPvChargingEnergyKwh;
  const typicalChargingTimeHours =
    answers.batteryCapacityKwh * 0.6 /
    (model.defaultChargingEfficiencyPercent / 100) / answers.chargingPowerKw;
  const annualHomeChargingCostEuro =
    annualGridChargingEnergyKwh * model.electricityPriceEuroPerKwh +
    annualPvChargingEnergyKwh * model.pvElectricityValueEuroPerKwh;
  const projectCost = model.wallboxCostEuro + model.installationBaseCostEuro +
    model.fixedAdditionalCostEuro;
  return {
    annualVehicleEnergyDemandKwh: round(annualVehicleEnergyDemandKwh),
    annualHomeChargingInputEnergyKwh: round(annualHomeChargingInputEnergyKwh),
    annualPvChargingEnergyKwh: round(annualPvChargingEnergyKwh),
    annualGridChargingEnergyKwh: round(annualGridChargingEnergyKwh),
    typicalChargingTimeHours: round(typicalChargingTimeHours),
    annualHomeChargingCostEuro: round(annualHomeChargingCostEuro),
    monthlyHomeChargingCostEuro: round(annualHomeChargingCostEuro / 12),
    ...costCorridor(projectCost, settings.general.costUncertaintyPercent),
    usesPhotovoltaicCharging: answers.pvChargingSharePercent > 0,
    technicalReviewRecommended: getWallboxSystemRecommendation(answers.chargingPowerKw) === "highPowerReview",
  };
}

export function getWallboxSystemRecommendation(chargingPowerKw: number) {
  if (chargingPowerKw <= 3.7) return "basicCharging" as const;
  if (chargingPowerKw <= 11) return "standard11Kw" as const;
  return "highPowerReview" as const;
}
