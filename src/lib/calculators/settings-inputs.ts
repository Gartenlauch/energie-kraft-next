import { defaultClimateCalculatorInput } from "@/content/pages/klima-kostenrechner";
import { defaultPvSizingCalculatorInput } from "@/content/pages/pv-kostenrechner";
import { defaultPvCalculatorInput } from "@/content/pages/pv-rechner";
import { defaultHeatPumpCalculatorInput } from "@/content/pages/waermepumpen-rechner";
import { defaultWallboxCalculatorInput } from "@/content/pages/wallbox-rechner";
import { resolveTierPrice, type ConfiguratorSettings } from "@/lib/configurator/settings-model";

export function buildCurrentCalculatorInputs(settings: ConfiguratorSettings) {
  const pvUnitPrice =
    resolveTierPrice(defaultPvCalculatorInput.systemSizeKwp, settings.photovoltaic.pricing)
      .unitPriceEuro ?? 0;
  return {
    pvRoi: {
      ...defaultPvCalculatorInput,
      specificYieldKwhPerKwp: settings.photovoltaic.specificYieldKwhPerKwpFallback,
      selfConsumptionRatePercent: settings.photovoltaic.defaultSelfConsumptionPercent,
      electricityPriceEuroPerKwh: settings.economics.gridElectricityPriceEuroPerKwh,
      feedInTariffEuroPerKwh: settings.economics.feedInValueEuroPerKwh,
      netInvestmentCostEuro:
        defaultPvCalculatorInput.systemSizeKwp * pvUnitPrice +
        settings.photovoltaic.fixedAdditionalCostEuro,
      annualOperatingCostEuro: settings.photovoltaic.annualOperatingCostEuro,
      annualDegradationPercent: settings.photovoltaic.annualDegradationPercent,
      electricityPriceIncreasePercent: settings.economics.electricityPriceDevelopmentPercent,
      calculationYears: settings.economics.projectHorizonYears,
    },
    pvSizing: {
      ...defaultPvSizingCalculatorInput,
      targetGenerationCoveragePercent: settings.photovoltaic.targetGenerationCoveragePercent,
      baseSpecificYieldKwhPerKwp: settings.photovoltaic.baseSpecificYieldKwhPerKwp,
      pvCostEuroPerKwp: settings.photovoltaic.pricing.tiers[0]?.unitPriceEuro ?? 1,
      batteryCostEuroPerKwh: settings.batteryStorage.pricing.tiers[0]?.unitPriceEuro ?? 1,
      fixedAdditionalCostEuro: settings.photovoltaic.fixedAdditionalCostEuro,
      costUncertaintyPercent: settings.general.costUncertaintyPercent,
    },
    heatPump: {
      ...defaultHeatPumpCalculatorInput,
      hotWaterDemandKwhPerPersonYear: settings.heatPump.hotWaterDemandKwhPerPersonYear,
      equivalentFullLoadHours: settings.heatPump.equivalentFullLoadHours,
      capacityReservePercent: settings.heatPump.capacityReservePercent,
      annualPerformanceFactor: settings.heatPump.defaultAnnualPerformanceFactor,
      electricityPriceEuroPerKwh: settings.heatPump.electricityPriceEuroPerKwh,
      currentHeatingEnergyPriceEuroPerKwh: settings.heatPump.gasPriceEuroPerKwh,
      currentHeatingEfficiencyPercent: settings.heatPump.gasHeatingEfficiencyPercent,
      heatPumpCostEuroPerKw: settings.heatPump.heatPumpCostEuroPerKw,
      installationBaseCostEuro: settings.heatPump.installationBaseCostEuro,
      fixedAdditionalCostEuro: settings.heatPump.fixedAdditionalCostEuro,
      costUncertaintyPercent: settings.general.costUncertaintyPercent,
    },
    climate: {
      ...defaultClimateCalculatorInput,
      annualEquivalentFullLoadHours: settings.climate.annualEquivalentFullLoadHours,
      seasonalEfficiencySeer: settings.climate.seasonalEfficiencySeer,
      electricityPriceEuroPerKwh: settings.climate.electricityPriceEuroPerKwh,
      equipmentCostEuroPerKw: settings.climate.equipmentCostEuroPerKw,
      indoorUnitCostEuro: settings.climate.indoorUnitCostEuro,
      installationBaseCostEuro: settings.climate.installationBaseCostEuro,
      installationCostPerIndoorUnitEuro: settings.climate.installationCostPerIndoorUnitEuro,
      fixedAdditionalCostEuro: settings.climate.fixedAdditionalCostEuro,
      costUncertaintyPercent: settings.general.costUncertaintyPercent,
    },
    wallbox: {
      ...defaultWallboxCalculatorInput,
      chargingEfficiencyPercent: settings.wallbox.defaultChargingEfficiencyPercent,
      electricityPriceEuroPerKwh: settings.wallbox.electricityPriceEuroPerKwh,
      publicChargingPriceEuroPerKwh: settings.wallbox.publicChargingPriceEuroPerKwh,
      pvElectricityValueEuroPerKwh: settings.wallbox.pvElectricityValueEuroPerKwh,
      wallboxCostEuro: settings.wallbox.wallboxCostEuro,
      installationBaseCostEuro: settings.wallbox.installationBaseCostEuro,
      fixedAdditionalCostEuro: settings.wallbox.fixedAdditionalCostEuro,
      costUncertaintyPercent: settings.general.costUncertaintyPercent,
    },
  };
}
