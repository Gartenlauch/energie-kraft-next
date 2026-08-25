import type {
  ClimateConfiguratorResult,
  ConfiguratorContactFormValues,
  ConfiguratorLeadType,
  ConfiguratorState,
  HeatPumpConfiguratorResult,
  SubmitBatteryStorageConfiguratorLeadInput,
  SubmitClimateConfiguratorLeadInput,
  SubmitConfiguratorLeadCommonInput,
  SubmitConfiguratorLeadInput,
  SubmitHeatPumpConfiguratorLeadInput,
  SubmitPhotovoltaicConfiguratorLeadInput,
  SubmitWallboxConfiguratorLeadInput,
  WallboxConfiguratorResult,
} from "@/types/configurator";
import {
  hasPhotovoltaicConfiguratorResult,
} from "@/types/configurator";

function buildCommonLeadInput(
  contactValues: ConfiguratorContactFormValues,
  formStartedAt: number,
): SubmitConfiguratorLeadCommonInput | null {
  if (
    contactValues.installationAtResidence ===
    null
  ) {
    return null;
  }

  const phone = contactValues.phone.trim();
  const website =
    contactValues.website.trim();

  return {
    type: "configurator",

    contact: {
      firstName:
        contactValues.firstName.trim(),
      lastName:
        contactValues.lastName.trim(),
      email: contactValues.email.trim(),

      ...(phone
        ? {
          phone,
        }
        : {}),
    },

    installation: {
      atResidence:
        contactValues.installationAtResidence,

      street: contactValues.street.trim(),
      postalCode:
        contactValues.postalCode.trim(),
      city: contactValues.city.trim(),
    },

    privacyAccepted:
      contactValues.privacyAccepted,

    ...(website
      ? {
        website,
      }
      : {}),

    formStartedAt,
  };
}

export function buildPhotovoltaicConfiguratorLeadInput(
  state: ConfiguratorState,
  contactValues: ConfiguratorContactFormValues,
  formStartedAt: number,
): SubmitPhotovoltaicConfiguratorLeadInput | null {
  const common = buildCommonLeadInput(
    contactValues,
    formStartedAt,
  );

  if (
    !common ||
    !hasPhotovoltaicConfiguratorResult(
      state,
    )
  ) {
    return null;
  }

  return {
    ...common,

    configurator: {
      type: "photovoltaic",

      answers: {
        household: {
          ...state.household,
        },

        building: {
          ...state.building,
        },

        roof: {
          ...state.roof,
        },

        interests: {
          ...state.interests,
        },

        notes: {
          ...state.notes,
        },
      },

      result:
        state.results.photovoltaic,
    },
  };
}

export function buildBatteryStorageConfiguratorLeadInput(
  state: ConfiguratorState,
  contactValues: ConfiguratorContactFormValues,
  formStartedAt: number,
): SubmitBatteryStorageConfiguratorLeadInput | null {
  const common = buildCommonLeadInput(
    contactValues,
    formStartedAt,
  );

  const result =
    state.results.batteryStorage;

  const {
    annualConsumptionKwh,
    pvPowerKwp,
    consumptionPattern,
    backupPreference,
    goal,
  } = state.batteryStorage;

  if (
    !common ||
    !result ||
    consumptionPattern === undefined ||
    backupPreference === undefined ||
    goal === undefined
  ) {
    return null;
  }

  return {
    ...common,

    configurator: {
      type: "battery_storage",

      answers: {
        ...(annualConsumptionKwh !== undefined
          ? {
            annualConsumptionKwh,
          }
          : {}),

        ...(pvPowerKwp !== undefined
          ? {
            pvPowerKwp,
          }
          : {}),

        consumptionPattern,
        backupPreference,
        goal,
      },

      result,
    },
  };
}

function buildWallboxLeadResult(
  result: WallboxConfiguratorResult,
) {
  return {
    annualVehicleEnergyDemandKwh:
      result.annualVehicleEnergyDemandKwh,

    annualHomeChargingInputEnergyKwh:
      result.annualHomeChargingInputEnergyKwh,

    annualPvChargingEnergyKwh:
      result.annualPvChargingEnergyKwh,

    annualGridChargingEnergyKwh:
      result.annualGridChargingEnergyKwh,

    typicalChargingTimeHours:
      result.typicalChargingTimeHours,

    annualHomeChargingCostEuro:
      result.annualHomeChargingCostEuro,

    monthlyHomeChargingCostEuro:
      result.monthlyHomeChargingCostEuro,

    estimatedTotalCostEuro:
      result.estimatedTotalCostEuro,

    estimatedMinimumCostEuro:
      result.estimatedMinimumCostEuro,

    estimatedMaximumCostEuro:
      result.estimatedMaximumCostEuro,

    usesPhotovoltaicCharging:
      result.usesPhotovoltaicCharging,

    technicalReviewRecommended:
      result.technicalReviewRecommended,
  };
}

export function buildWallboxConfiguratorLeadInput(
  state: ConfiguratorState,
  contactValues: ConfiguratorContactFormValues,
  formStartedAt: number,
): SubmitWallboxConfiguratorLeadInput | null {
  const common = buildCommonLeadInput(
    contactValues,
    formStartedAt,
  );

  const result = state.results.wallbox;

  const {
    annualDrivingKm,
    vehicleConsumptionKwhPer100Km,
    batteryCapacityKwh,
    homeChargingSharePercent,
    chargingPowerKw,
    pvChargingSharePercent,
  } = state.wallbox;

  if (
    !common ||
    !result ||
    annualDrivingKm === undefined ||
    vehicleConsumptionKwhPer100Km ===
    undefined ||
    batteryCapacityKwh === undefined ||
    homeChargingSharePercent === undefined ||
    chargingPowerKw === undefined ||
    pvChargingSharePercent === undefined
  ) {
    return null;
  }

  return {
    ...common,

    configurator: {
      type: "wallbox",

      answers: {
        annualDrivingKm,
        vehicleConsumptionKwhPer100Km,
        batteryCapacityKwh,
        homeChargingSharePercent,
        chargingPowerKw,
        pvChargingSharePercent,
      },

      result:
        buildWallboxLeadResult(result),
    },
  };
}

function buildHeatPumpLeadResult(
  result: HeatPumpConfiguratorResult,
) {
  return {
    recommendedHeatPumpCapacityKw:
      result.recommendedHeatPumpCapacityKw,

    totalAnnualHeatDemandKwh:
      result.totalAnnualHeatDemandKwh,

    spaceHeatingDemandKwh:
      result.spaceHeatingDemandKwh,

    hotWaterDemandKwh:
      result.hotWaterDemandKwh,

    annualHeatPumpElectricityConsumptionKwh:
      result
        .annualHeatPumpElectricityConsumptionKwh,

    annualHeatPumpOperatingCostEuro:
      result.annualHeatPumpOperatingCostEuro,

    estimatedTotalCostEuro:
      result.estimatedTotalCostEuro,

    estimatedMinimumCostEuro:
      result.estimatedMinimumCostEuro,

    estimatedMaximumCostEuro:
      result.estimatedMaximumCostEuro,

    flowTemperatureAssessment:
      result.flowTemperatureAssessment,

    ntReady: result.ntReady,

    technicalReviewRecommended:
      result.technicalReviewRecommended,
  };
}

export function buildHeatPumpConfiguratorLeadInput(
  state: ConfiguratorState,
  contactValues: ConfiguratorContactFormValues,
  formStartedAt: number,
): SubmitHeatPumpConfiguratorLeadInput | null {
  const common = buildCommonLeadInput(
    contactValues,
    formStartedAt,
  );

  const result = state.results.heatPump;

  const {
    heatedAreaM2,
    specificSpaceHeatingDemandKwhPerM2Year,
    occupancyPersons,
    requiredFlowTemperatureC,
    annualPerformanceFactor,
  } = state.heatPump;

  if (
    !common ||
    !result ||
    heatedAreaM2 === undefined ||
    specificSpaceHeatingDemandKwhPerM2Year ===
    undefined ||
    occupancyPersons === undefined ||
    requiredFlowTemperatureC === undefined ||
    annualPerformanceFactor === undefined
  ) {
    return null;
  }

  return {
    ...common,

    configurator: {
      type: "heat_pump",

      answers: {
        heatedAreaM2,
        specificSpaceHeatingDemandKwhPerM2Year,
        occupancyPersons,
        requiredFlowTemperatureC,
        annualPerformanceFactor,
      },

      result:
        buildHeatPumpLeadResult(result),
    },
  };
}

function buildClimateLeadResult(
  result: ClimateConfiguratorResult,
) {
  return {
    calculatedCoolingLoadKw:
      result.calculatedCoolingLoadKw,

    recommendedCoolingCapacityKw:
      result.recommendedCoolingCapacityKw,

    recommendedIndoorUnitCount:
      result.recommendedIndoorUnitCount,

    averageCapacityPerRoomKw:
      result.averageCapacityPerRoomKw,

    systemRecommendation:
      result.systemRecommendation,

    annualElectricityConsumptionKwh:
      result.annualElectricityConsumptionKwh,

    annualOperatingCostEuro:
      result.annualOperatingCostEuro,

    estimatedTotalCostEuro:
      result.estimatedTotalCostEuro,

    estimatedMinimumCostEuro:
      result.estimatedMinimumCostEuro,

    estimatedMaximumCostEuro:
      result.estimatedMaximumCostEuro,

    individualPlanningRecommended:
      result.individualPlanningRecommended,
  };
}

export function buildClimateConfiguratorLeadInput(
  state: ConfiguratorState,
  contactValues: ConfiguratorContactFormValues,
  formStartedAt: number,
): SubmitClimateConfiguratorLeadInput | null {
  const common = buildCommonLeadInput(
    contactValues,
    formStartedAt,
  );

  const result = state.results.climate;

  const {
    conditionedAreaM2,
    roomCount,
    insulationLevel,
    solarLoad,
    occupancyPersons,
  } = state.climate;

  if (
    !common ||
    !result ||
    conditionedAreaM2 === undefined ||
    roomCount === undefined ||
    insulationLevel === undefined ||
    solarLoad === undefined ||
    occupancyPersons === undefined
  ) {
    return null;
  }

  return {
    ...common,

    configurator: {
      type: "climate",

      answers: {
        conditionedAreaM2,
        roomCount,
        insulationLevel,
        solarLoad,
        occupancyPersons,
      },

      result:
        buildClimateLeadResult(result),
    },
  };
}

export function buildConfiguratorLeadInput(
  configuratorType: ConfiguratorLeadType,
  state: ConfiguratorState,
  contactValues: ConfiguratorContactFormValues,
  formStartedAt: number,
): SubmitConfiguratorLeadInput | null {
  switch (configuratorType) {
    case "photovoltaic":
      return buildPhotovoltaicConfiguratorLeadInput(
        state,
        contactValues,
        formStartedAt,
      );

    case "battery_storage":
      return buildBatteryStorageConfiguratorLeadInput(
        state,
        contactValues,
        formStartedAt,
      );

    case "wallbox":
      return buildWallboxConfiguratorLeadInput(
        state,
        contactValues,
        formStartedAt,
      );

    case "heat_pump":
      return buildHeatPumpConfiguratorLeadInput(
        state,
        contactValues,
        formStartedAt,
      );

    case "climate":
      return buildClimateConfiguratorLeadInput(
        state,
        contactValues,
        formStartedAt,
      );
  }
}