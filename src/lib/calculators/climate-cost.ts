import { parseClimateCalculatorInput } from "@/lib/validation/climate-calculator";
import type {
  ClimateCalculatorInput,
  ClimateCalculatorResult,
  ClimateInsulationLevel,
  ClimateSolarLoad,
  ClimateSystemRecommendation,
} from "@/types/climate-calculator";

const INSULATION_BASE_LOAD_WATT_PER_M2: Record<ClimateInsulationLevel, number> = {
  good: 60,
  average: 80,
  weak: 100,
};

const SOLAR_LOAD_FACTORS: Record<ClimateSolarLoad, number> = {
  low: 0.9,
  medium: 1,
  high: 1.15,
};

function round(value: number, fractionDigits = 2): number {
  const factor = 10 ** fractionDigits;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function roundUpToStep(value: number, step: number): number {
  return Math.ceil(value / step) * step;
}

function getSystemRecommendation(roomCount: number): ClimateSystemRecommendation {
  if (roomCount === 1) {
    return "singleSplit";
  }

  if (roomCount <= 5) {
    return "multiSplit";
  }

  return "projectPlanning";
}

/**
 * Erstellt eine unverbindliche Leistungs- und
 * Kostenorientierung für eine Klimaanlage.
 *
 * Modellannahmen:
 *
 * - Die Grundlast je Quadratmeter wird anhand eines
 *   vereinfachten Dämmstandards gewählt.
 * - Raumhöhe und solarer Wärmeeintrag verändern die
 *   flächenbezogene Last.
 * - Je anwesender Person werden 100 Watt angesetzt.
 * - Geräte und sonstige interne Wärmelasten werden über
 *   einen separaten Eingabewert berücksichtigt.
 * - Auf die errechnete Last wird eine Modellreserve
 *   von zehn Prozent aufgeschlagen.
 * - Die empfohlene Leistung wird auf 0,5 kW aufgerundet.
 * - Stromverbrauch und Kosten sind Modellwerte und keine
 *   technische Kühllastberechnung oder ein Angebot.
 */
export function calculateClimateCost(input: ClimateCalculatorInput): ClimateCalculatorResult {
  const values = parseClimateCalculatorInput(input);

  const insulationBaseLoadWattPerM2 = INSULATION_BASE_LOAD_WATT_PER_M2[values.insulationLevel];

  const solarFactor = SOLAR_LOAD_FACTORS[values.solarLoad];

  const ceilingHeightFactor = values.ceilingHeightM / 2.5;

  const areaCoolingLoadKw =
    (values.conditionedAreaM2 * insulationBaseLoadWattPerM2 * solarFactor * ceilingHeightFactor) /
    1_000;

  const occupancyHeatLoadKw = (values.occupancyPersons * 100) / 1_000;

  const internalHeatLoadKw = values.internalHeatLoadWatt / 1_000;

  const calculatedCoolingLoadKw =
    (areaCoolingLoadKw + occupancyHeatLoadKw + internalHeatLoadKw) * 1.1;

  const recommendedCoolingCapacityKw = roundUpToStep(calculatedCoolingLoadKw, 0.5);

  const recommendedIndoorUnitCount = values.roomCount;

  const averageCapacityPerRoomKw = recommendedCoolingCapacityKw / recommendedIndoorUnitCount;

  const systemRecommendation = getSystemRecommendation(values.roomCount);

  const annualCoolingEnergyKwh =
    recommendedCoolingCapacityKw * values.annualEquivalentFullLoadHours;

  const annualElectricityConsumptionKwh = annualCoolingEnergyKwh / values.seasonalEfficiencySeer;

  const annualOperatingCostEuro =
    annualElectricityConsumptionKwh * values.electricityPriceEuroPerKwh;

  const equipmentCostEuro =
    recommendedCoolingCapacityKw * values.equipmentCostEuroPerKw +
    recommendedIndoorUnitCount * values.indoorUnitCostEuro;

  const installationCostEuro =
    values.installationBaseCostEuro +
    recommendedIndoorUnitCount * values.installationCostPerIndoorUnitEuro;

  const estimatedTotalCostEuro =
    equipmentCostEuro + installationCostEuro + values.fixedAdditionalCostEuro;

  const uncertaintyFactor = values.costUncertaintyPercent / 100;

  const estimatedMinimumCostEuro = estimatedTotalCostEuro * (1 - uncertaintyFactor);

  const estimatedMaximumCostEuro = estimatedTotalCostEuro * (1 + uncertaintyFactor);

  return {
    input: values,

    insulationBaseLoadWattPerM2: round(insulationBaseLoadWattPerM2),

    solarFactor: round(solarFactor, 4),

    ceilingHeightFactor: round(ceilingHeightFactor, 4),

    areaCoolingLoadKw: round(areaCoolingLoadKw),

    occupancyHeatLoadKw: round(occupancyHeatLoadKw),

    internalHeatLoadKw: round(internalHeatLoadKw),

    calculatedCoolingLoadKw: round(calculatedCoolingLoadKw),

    recommendedCoolingCapacityKw: round(recommendedCoolingCapacityKw),

    recommendedIndoorUnitCount,

    averageCapacityPerRoomKw: round(averageCapacityPerRoomKw),

    systemRecommendation,

    annualCoolingEnergyKwh: round(annualCoolingEnergyKwh),

    annualElectricityConsumptionKwh: round(annualElectricityConsumptionKwh),

    annualOperatingCostEuro: round(annualOperatingCostEuro),

    equipmentCostEuro: round(equipmentCostEuro),

    installationCostEuro: round(installationCostEuro),

    fixedAdditionalCostEuro: round(values.fixedAdditionalCostEuro),

    estimatedTotalCostEuro: round(estimatedTotalCostEuro),

    estimatedMinimumCostEuro: round(estimatedMinimumCostEuro),

    estimatedMaximumCostEuro: round(estimatedMaximumCostEuro),
  };
}
