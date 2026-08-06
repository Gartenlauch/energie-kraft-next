import { parseWallboxCalculatorInput } from "@/lib/validation/wallbox-calculator";
import type {
  WallboxCalculatorInput,
  WallboxCalculatorResult,
  WallboxSystemRecommendation,
} from "@/types/wallbox-calculator";

function round(
  value: number,
  fractionDigits = 2,
): number {
  const factor = 10 ** fractionDigits;

  return (
    Math.round((value + Number.EPSILON) * factor) /
    factor
  );
}

function getSystemRecommendation(
  chargingPowerKw: number,
): WallboxSystemRecommendation {
  if (chargingPowerKw <= 3.7) {
    return "basicCharging";
  }

  if (chargingPowerKw <= 11) {
    return "standard11Kw";
  }

  return "highPowerReview";
}

/**
 * Erstellt eine reduzierte Ladezeit-, Energie- und
 * Kostenorientierung für eine Wallbox.
 *
 * Modellannahmen:
 *
 * - Der jährliche Fahrzeugenergiebedarf ergibt sich aus
 *   Fahrleistung und Durchschnittsverbrauch.
 * - Der Heimladeanteil wird als Prozentsatz des gesamten
 *   Fahrstrombedarfs angesetzt.
 * - Ladeverluste werden über einen veränderbaren
 *   Wirkungsgrad berücksichtigt.
 * - PV- und Netzstrom werden anhand eines frei wählbaren
 *   PV-Anteils aufgeteilt.
 * - Die typische Ladedauer wird aus Batteriekapazität,
 *   Ladefenster, Ladeleistung und Wirkungsgrad berechnet.
 * - Fahrzeugseitige Leistungsbegrenzungen und eine
 *   Leistungsreduzierung gegen Ladeende werden nicht
 *   separat modelliert.
 * - Die Kostenwerte sind unverbindliche Modellwerte.
 */
export function calculateWallboxCost(
  input: WallboxCalculatorInput,
): WallboxCalculatorResult {
  const values = parseWallboxCalculatorInput(input);

  const homeChargingShare =
    values.homeChargingSharePercent / 100;

  const chargingEfficiency =
    values.chargingEfficiencyPercent / 100;

  const pvChargingShare =
    values.pvChargingSharePercent / 100;

  const annualVehicleEnergyDemandKwh =
    values.annualDrivingKm *
    (values.vehicleConsumptionKwhPer100Km / 100);

  const annualHomeChargingBatteryEnergyKwh =
    annualVehicleEnergyDemandKwh *
    homeChargingShare;

  const annualHomeChargingInputEnergyKwh =
    annualHomeChargingBatteryEnergyKwh /
    chargingEfficiency;

  const annualPvChargingEnergyKwh =
    annualHomeChargingInputEnergyKwh *
    pvChargingShare;

  const annualGridChargingEnergyKwh =
    annualHomeChargingInputEnergyKwh -
    annualPvChargingEnergyKwh;

  const stateOfChargeDifference =
    (values.targetStateOfChargePercent -
      values.startStateOfChargePercent) /
    100;

  const typicalBatteryEnergyAddedKwh =
    values.batteryCapacityKwh *
    stateOfChargeDifference;

  const typicalChargingInputEnergyKwh =
    typicalBatteryEnergyAddedKwh /
    chargingEfficiency;

  const typicalChargingTimeHours =
    typicalChargingInputEnergyKwh /
    values.chargingPowerKw;

  const annualHomeChargingCostEuro =
    annualGridChargingEnergyKwh *
      values.electricityPriceEuroPerKwh +
    annualPvChargingEnergyKwh *
      values.pvElectricityValueEuroPerKwh;

  const monthlyHomeChargingCostEuro =
    annualHomeChargingCostEuro / 12;

  const comparablePublicChargingCostEuro =
    annualHomeChargingInputEnergyKwh *
    values.publicChargingPriceEuroPerKwh;

  const annualChargingCostDifferenceEuro =
    comparablePublicChargingCostEuro -
    annualHomeChargingCostEuro;

  const estimatedTotalCostEuro =
    values.wallboxCostEuro +
    values.installationBaseCostEuro +
    values.fixedAdditionalCostEuro;

  const uncertaintyFactor =
    values.costUncertaintyPercent / 100;

  const estimatedMinimumCostEuro =
    estimatedTotalCostEuro *
    (1 - uncertaintyFactor);

  const estimatedMaximumCostEuro =
    estimatedTotalCostEuro *
    (1 + uncertaintyFactor);

  return {
    input: values,

    systemRecommendation: getSystemRecommendation(
      values.chargingPowerKw,
    ),

    annualVehicleEnergyDemandKwh: round(
      annualVehicleEnergyDemandKwh,
    ),

    annualHomeChargingBatteryEnergyKwh: round(
      annualHomeChargingBatteryEnergyKwh,
    ),

    annualHomeChargingInputEnergyKwh: round(
      annualHomeChargingInputEnergyKwh,
    ),

    annualPvChargingEnergyKwh: round(
      annualPvChargingEnergyKwh,
    ),

    annualGridChargingEnergyKwh: round(
      annualGridChargingEnergyKwh,
    ),

    typicalBatteryEnergyAddedKwh: round(
      typicalBatteryEnergyAddedKwh,
    ),

    typicalChargingInputEnergyKwh: round(
      typicalChargingInputEnergyKwh,
    ),

    typicalChargingTimeHours: round(
      typicalChargingTimeHours,
    ),

    annualHomeChargingCostEuro: round(
      annualHomeChargingCostEuro,
    ),

    monthlyHomeChargingCostEuro: round(
      monthlyHomeChargingCostEuro,
    ),

    comparablePublicChargingCostEuro: round(
      comparablePublicChargingCostEuro,
    ),

    annualChargingCostDifferenceEuro: round(
      annualChargingCostDifferenceEuro,
    ),

    wallboxCostEuro: round(values.wallboxCostEuro),

    installationBaseCostEuro: round(
      values.installationBaseCostEuro,
    ),

    fixedAdditionalCostEuro: round(
      values.fixedAdditionalCostEuro,
    ),

    estimatedTotalCostEuro: round(
      estimatedTotalCostEuro,
    ),

    estimatedMinimumCostEuro: round(
      estimatedMinimumCostEuro,
    ),

    estimatedMaximumCostEuro: round(
      estimatedMaximumCostEuro,
    ),
  };
}