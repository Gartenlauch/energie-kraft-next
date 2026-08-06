import { parseHeatPumpCalculatorInput } from "@/lib/validation/heat-pump-calculator";
import type {
  HeatPumpCalculatorInput,
  HeatPumpCalculatorResult,
  HeatPumpFlowTemperatureAssessment,
} from "@/types/heat-pump-calculator";

const NT_READY_MAX_FLOW_TEMPERATURE_C = 55;

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

function roundUpToStep(
  value: number,
  step: number,
): number {
  return Math.ceil(value / step) * step;
}

function getFlowTemperatureAssessment(
  requiredFlowTemperatureC: number,
): HeatPumpFlowTemperatureAssessment {
  return requiredFlowTemperatureC <=
    NT_READY_MAX_FLOW_TEMPERATURE_C
    ? "ntReady"
    : "individualReview";
}

/**
 * Erstellt eine unverbindliche Leistungs-, Verbrauchs-
 * und Kostenorientierung für eine Wärmepumpe.
 *
 * Modellannahmen:
 *
 * - Der jährliche Raumwärmebedarf wird aus beheizter
 *   Fläche und spezifischem Wärmebedarf berechnet.
 * - Warmwasser wird über einen jährlichen Wärmebedarf
 *   je Person ergänzt.
 * - Die überschlägige Leistung ergibt sich aus dem
 *   gesamten Wärmebedarf und äquivalenten
 *   Volllaststunden.
 * - Die Leistung enthält eine frei veränderbare Reserve
 *   und wird auf 0,5 kW aufgerundet.
 * - Der Stromverbrauch wird über die eingegebene
 *   Jahresarbeitszahl berechnet.
 * - Der Vergleich mit dem bestehenden Heizsystem
 *   berücksichtigt nur Energieverbrauch und Energiepreis.
 * - Wartung, Grundgebühren, Finanzierung, Förderung,
 *   Steuern und Preisänderungen werden nicht berücksichtigt.
 * - Eine Vorlauftemperatur bis einschließlich 55 °C wird
 *   im Modell als NT-ready eingeordnet.
 */
export function calculateHeatPumpCost(
  input: HeatPumpCalculatorInput,
): HeatPumpCalculatorResult {
  const values = parseHeatPumpCalculatorInput(input);

  const spaceHeatingDemandKwh =
    values.heatedAreaM2 *
    values.specificSpaceHeatingDemandKwhPerM2Year;

  const hotWaterDemandKwh =
    values.occupancyPersons *
    values.hotWaterDemandKwhPerPersonYear;

  const totalAnnualHeatDemandKwh =
    spaceHeatingDemandKwh + hotWaterDemandKwh;

  const requiredCapacityBeforeReserveKw =
    totalAnnualHeatDemandKwh /
    values.equivalentFullLoadHours;

  const requiredCapacityWithReserveKw =
    requiredCapacityBeforeReserveKw *
    (1 + values.capacityReservePercent / 100);

  const recommendedHeatPumpCapacityKw =
    roundUpToStep(
      requiredCapacityWithReserveKw,
      0.5,
    );

  const flowTemperatureAssessment =
    getFlowTemperatureAssessment(
      values.requiredFlowTemperatureC,
    );

  const ntReady =
    flowTemperatureAssessment === "ntReady";

  const annualHeatPumpElectricityConsumptionKwh =
    totalAnnualHeatDemandKwh /
    values.annualPerformanceFactor;

  const annualHeatPumpOperatingCostEuro =
    annualHeatPumpElectricityConsumptionKwh *
    values.electricityPriceEuroPerKwh;

  const currentHeatingEfficiency =
    values.currentHeatingEfficiencyPercent / 100;

  const currentHeatingEnergyConsumptionKwh =
    totalAnnualHeatDemandKwh /
    currentHeatingEfficiency;

  const currentHeatingOperatingCostEuro =
    currentHeatingEnergyConsumptionKwh *
    values.currentHeatingEnergyPriceEuroPerKwh;

  const annualOperatingCostDifferenceEuro =
    currentHeatingOperatingCostEuro -
    annualHeatPumpOperatingCostEuro;

  const heatPumpEquipmentCostEuro =
    recommendedHeatPumpCapacityKw *
    values.heatPumpCostEuroPerKw;

  const estimatedTotalCostEuro =
    heatPumpEquipmentCostEuro +
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

    spaceHeatingDemandKwh: round(
      spaceHeatingDemandKwh,
    ),

    hotWaterDemandKwh: round(
      hotWaterDemandKwh,
    ),

    totalAnnualHeatDemandKwh: round(
      totalAnnualHeatDemandKwh,
    ),

    requiredCapacityBeforeReserveKw: round(
      requiredCapacityBeforeReserveKw,
    ),

    requiredCapacityWithReserveKw: round(
      requiredCapacityWithReserveKw,
    ),

    recommendedHeatPumpCapacityKw: round(
      recommendedHeatPumpCapacityKw,
    ),

    flowTemperatureAssessment,
    ntReady,

    annualHeatPumpElectricityConsumptionKwh: round(
      annualHeatPumpElectricityConsumptionKwh,
    ),

    annualHeatPumpOperatingCostEuro: round(
      annualHeatPumpOperatingCostEuro,
    ),

    currentHeatingEnergyConsumptionKwh: round(
      currentHeatingEnergyConsumptionKwh,
    ),

    currentHeatingOperatingCostEuro: round(
      currentHeatingOperatingCostEuro,
    ),

    annualOperatingCostDifferenceEuro: round(
      annualOperatingCostDifferenceEuro,
    ),

    heatPumpEquipmentCostEuro: round(
      heatPumpEquipmentCostEuro,
    ),

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