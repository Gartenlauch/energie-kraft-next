import { describe, expect, it } from "vitest";

import {
  batteryStorageConfiguratorLeadInputSchema,
  climateConfiguratorLeadInputSchema,
  configuratorLeadInputSchema,
  heatPumpConfiguratorLeadInputSchema,
  wallboxConfiguratorLeadInputSchema,
} from "@/lib/validation/configurator/lead";
import type { ConfiguratorLeadPayload } from "@/types/configurator";

const common = {
  type: "configurator" as const,

  contact: {
    firstName: "Max",
    lastName: "Mustermann",
    email: "max@example.de",
  },

  installation: {
    atResidence: true,
    street: "Musterstraße 1",
    postalCode: "83395",
    city: "Freilassing",
  },

  privacyAccepted: true as const,

  formStartedAt: Date.now() - 10_000,
};

function asProjectLead(configurator: ConfiguratorLeadPayload) {
  const component = {
    component: configurator.type,
    analysisKind: "investment_only" as const,
    pricingMode: "modeled" as const,
    investmentMinEuro: 1_000,
    investmentBaseEuro: 1_200,
    investmentMaxEuro: 1_400,
    firstYearEconomicEffectEuro: 0,
    economicLifetimeYears: 20,
    explanation: "Testmodell",
};

  return {
    ...common,
    settingsVersion: 0,

    products: [configurator.type],

    journey: {
      entryPoint: configurator.type,

      selectedProducts: [configurator.type],

      completedProducts: [configurator.type],
    },

    configurators: [configurator],

    economics: {
      horizonYears: 20,
      pricingMode: "modeled" as const,
      modeledComponentsInvestmentMinEuro: 1_000,
      modeledComponentsInvestmentBaseEuro: 1_200,
      modeledComponentsInvestmentMaxEuro: 1_400,
      investmentMinEuro: 1_000,
      investmentBaseEuro: 1_200,
      investmentMaxEuro: 1_400,
      firstYearQuantifiedEffectEuro: 0,
      paybackYears: null,
      finalCumulativeCashFlowEuro: -1_200,
      components: [component],
      projections: [
        { year: 0, quantifiedEconomicEffectEuro: 0, cumulativeCashFlowEuro: -1_200 },
        { year: 20, quantifiedEconomicEffectEuro: 0, cumulativeCashFlowEuro: -1_200 },
    ],
      scenarios: (["conservative", "base", "favorable"] as const).map((id) => ({
        id,
        investmentMinEuro: 1_000,
        investmentBaseEuro: 1_200,
        investmentMaxEuro: 1_400,
        firstYearQuantifiedEffectEuro: 0,
        paybackYears: null,
        finalCumulativeCashFlowEuro: -1_200,
      })),
      assumptions: [],
      limitations: [],
    },
  };
}

describe("configurator lead contract", () => {
  it("accepts a battery-storage lead", () => {
        const input = {
          ...common,

          configurator: {
        type: "battery_storage" as const,

            answers: {
          annualConsumptionKwh: 4_500,

              pvPowerKwp: 10,

          consumptionPattern: "mixed" as const,

          backupPreference: "selected_loads" as const,

          goal: "balanced" as const,
            },

            result: {
          source: "standalone" as const,

          annualConsumptionKwh: 4_500,

              pvPowerKwpMin: 10,
              pvPowerKwpMax: 10,

          recommendedUsableCapacityKwhMin: 7,

          recommendedUsableCapacityKwhMax: 10,

          estimatedTotalCostEuro: 5_950,
          pricingMode: "modeled" as const,
          estimatedMinimumCostEuro: 4_165,
          estimatedMaximumCostEuro: 8_050,

          technicalUpperBoundUsableCapacityKwh: 12,

          consumptionPattern: "mixed" as const,

          backupPreference: "selected_loads" as const,

          goal: "balanced" as const,

          pvSurplusLikely: true,

          backupPowerRequested: true,

          wholeHomeBackupRequested: false,

          modularExpansionRecommended: false,

          technicalReviewRecommended: false,
            },
          },
        };

    expect(batteryStorageConfiguratorLeadInputSchema.safeParse(input).success).toBe(true);

    expect(configuratorLeadInputSchema.safeParse(asProjectLead(input.configurator)).success).toBe(
      true,
    );
  });

  it("accepts a wallbox lead", () => {
        const input = {
          ...common,

          configurator: {
        type: "wallbox" as const,

            answers: {
          annualDrivingKm: 15_000,

          vehicleConsumptionKwhPer100Km: 18,

          batteryCapacityKwh: 60,

          homeChargingSharePercent: 80,

          chargingPowerKw: 11 as const,

          pvChargingSharePercent: 30,
            },

            result: {
          annualVehicleEnergyDemandKwh: 2_700,

          annualHomeChargingInputEnergyKwh: 2_400,

          annualPvChargingEnergyKwh: 720,

          annualGridChargingEnergyKwh: 1_680,

          typicalChargingTimeHours: 3.64,

          annualHomeChargingCostEuro: 600,

          monthlyHomeChargingCostEuro: 50,

          estimatedTotalCostEuro: 3_000,

          estimatedMinimumCostEuro: 2_550,

          estimatedMaximumCostEuro: 3_450,

          usesPhotovoltaicCharging: true,

          technicalReviewRecommended: false,
            },
          },
        };

    expect(wallboxConfiguratorLeadInputSchema.safeParse(input).success).toBe(true);

    expect(configuratorLeadInputSchema.safeParse(asProjectLead(input.configurator)).success).toBe(
      true,
    );
  });

  it("accepts a heat-pump lead", () => {
        const input = {
          ...common,

          configurator: {
        type: "heat_pump" as const,

            answers: {
          existingHeatingSystem: "gas" as const,

          heatedAreaM2: 160,

          specificSpaceHeatingDemandKwhPerM2Year: 90,

          occupancyPersons: 4,

          requiredFlowTemperatureC: 50,

          annualPerformanceFactor: 3.5,
            },

            result: {
          recommendedHeatPumpCapacityKw: 10.5,

          totalAnnualHeatDemandKwh: 17_600,

          spaceHeatingDemandKwh: 14_400,

          hotWaterDemandKwh: 3_200,

          annualHeatPumpElectricityConsumptionKwh: 5_028.57,

          annualHeatPumpOperatingCostEuro: 1_508.57,

          currentHeatingOperatingCostEuro: 2_485,

          annualOperatingCostDifferenceEuro: 976.43,

          heatingComparisonKind: "existing_system" as const,

          heatingComparisonBasis: "modeled_heat_demand" as const,

          heatingComparisonLabel: "Gasheizung",

          comparisonFuelPriceEuroPerUnit: 0.12,

          comparisonFuelUnit: "kWh" as const,

          comparisonEfficiencyPercent: 85,

          oilEnergyContentKwhPerLitre: null,

          estimatedTotalCostEuro: 27_600,

          estimatedMinimumCostEuro: 23_460,

          estimatedMaximumCostEuro: 31_740,

          flowTemperatureAssessment: "ntReady" as const,

          ntReady: true,

          technicalReviewRecommended: false,
            },
          },
        };

    expect(heatPumpConfiguratorLeadInputSchema.safeParse(input).success).toBe(true);

    expect(configuratorLeadInputSchema.safeParse(asProjectLead(input.configurator)).success).toBe(
      true,
    );
  });

  it("accepts a climate lead", () => {
        const input = {
          ...common,

          configurator: {
        type: "climate" as const,

            answers: {
          conditionedAreaM2: 80,

          roomCount: 4,

          insulationLevel: "average" as const,

          solarLoad: "medium" as const,

          occupancyPersons: 4,
            },

            result: {
          calculatedCoolingLoadKw: 8.03,

          recommendedCoolingCapacityKw: 8.5,

          recommendedIndoorUnitCount: 4,

          averageCapacityPerRoomKw: 2.13,

          systemRecommendation: "multiSplit" as const,

          annualElectricityConsumptionKwh: 653.85,

          annualOperatingCostEuro: 209.23,

          estimatedTotalCostEuro: 15_800,

          estimatedMinimumCostEuro: 13_430,

          estimatedMaximumCostEuro: 18_170,

          individualPlanningRecommended: false,
            },
          },
        };

    expect(climateConfiguratorLeadInputSchema.safeParse(input).success).toBe(true);

    expect(configuratorLeadInputSchema.safeParse(asProjectLead(input.configurator)).success).toBe(
      true,
    );
  });

  it("rejects an unknown configurator type", () => {
        const input = {
          ...common,

      products: ["unknown"],

          journey: {
        entryPoint: "unknown",

        selectedProducts: ["unknown"],

        completedProducts: ["unknown"],
          },

          configurators: [
            {
          type: "unknown",

              answers: {},

              result: {},
            },
          ],
        };

    expect(configuratorLeadInputSchema.safeParse(input).success).toBe(false);
  });
});
