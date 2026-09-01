import {
  CONFIGURATOR_JOURNEY_ORDER,
} from "@/lib/configurator/journey";
import type {
  ClimateConfiguratorResult,
  ConfiguratorContactFormValues,
  ConfiguratorLeadPayload,
  ConfiguratorLeadType,
  ConfiguratorState,
  HeatPumpConfiguratorResult,
  SubmitConfiguratorLeadCommonInput,
  SubmitConfiguratorLeadInput,
  WallboxConfiguratorResult,
} from "@/types/configurator";

function buildCommonLeadInput(
  contactValues: ConfiguratorContactFormValues,
  formStartedAt: number,
): SubmitConfiguratorLeadCommonInput | null {
  if (
    contactValues.installationAtResidence === null
  ) {
    return null;
  }

  const phone =
    contactValues.phone.trim();

  const website =
    contactValues.website.trim();

  return {
    type: "configurator",

    contact: {
      firstName:
        contactValues.firstName.trim(),

      lastName:
        contactValues.lastName.trim(),

      email:
        contactValues.email.trim(),

      ...(phone
        ? {
          phone,
        }
        : {}),
    },

    installation: {
      atResidence:
        contactValues.installationAtResidence,

      street:
        contactValues.street.trim(),

      postalCode:
        contactValues.postalCode.trim(),

      city:
        contactValues.city.trim(),
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

function buildPhotovoltaicPayload(
  state: ConfiguratorState,
): ConfiguratorLeadPayload | null {
  const result =
    state.results.photovoltaic;

  if (!result) {
    return null;
  }

  return {
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

    result,
  };
}

function buildBatteryStoragePayload(
  state: ConfiguratorState,
): ConfiguratorLeadPayload | null {
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
    !result ||
    consumptionPattern === undefined ||
    backupPreference === undefined ||
    goal === undefined
  ) {
    return null;
  }

  return {
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

function buildWallboxPayload(
  state: ConfiguratorState,
): ConfiguratorLeadPayload | null {
  const result =
    state.results.wallbox;

  const {
    annualDrivingKm,
    vehicleConsumptionKwhPer100Km,
    batteryCapacityKwh,
    homeChargingSharePercent,
    chargingPowerKw,
    pvChargingSharePercent,
  } = state.wallbox;

  if (
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

    ntReady:
      result.ntReady,

    technicalReviewRecommended:
      result.technicalReviewRecommended,
  };
}

function buildHeatPumpPayload(
  state: ConfiguratorState,
): ConfiguratorLeadPayload | null {
  const result =
    state.results.heatPump;

  const {
    heatedAreaM2,
    specificSpaceHeatingDemandKwhPerM2Year,
    occupancyPersons,
    requiredFlowTemperatureC,
    annualPerformanceFactor,
  } = state.heatPump;

  if (
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

function buildClimatePayload(
  state: ConfiguratorState,
): ConfiguratorLeadPayload | null {
  const result =
    state.results.climate;

  const {
    conditionedAreaM2,
    roomCount,
    insulationLevel,
    solarLoad,
    occupancyPersons,
  } = state.climate;

  if (
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
  };
}

function buildConfiguratorPayload(
  configuratorType: ConfiguratorLeadType,
  state: ConfiguratorState,
): ConfiguratorLeadPayload | null {
  switch (configuratorType) {
    case "photovoltaic":
      return buildPhotovoltaicPayload(
        state,
      );

    case "battery_storage":
      return buildBatteryStoragePayload(
        state,
      );

    case "wallbox":
      return buildWallboxPayload(
        state,
      );

    case "heat_pump":
      return buildHeatPumpPayload(
        state,
      );

    case "climate":
      return buildClimatePayload(
        state,
      );
  }
}

export function buildConfiguratorLeadInput(
  state: ConfiguratorState,
  contactValues: ConfiguratorContactFormValues,
  formStartedAt: number,
): SubmitConfiguratorLeadInput | null {
  const common =
    buildCommonLeadInput(
      contactValues,
      formStartedAt,
    );

  const entryPoint =
    state.journey.entryPoint;

  const selectedProducts = [
    ...state.journey.selectedProducts,
  ];

  const completedProducts = [
    ...state.journey.completedProducts,
  ];

  if (
    !common ||
    !entryPoint ||
    selectedProducts.length === 0
  ) {
    return null;
  }

  /*
   * Zur Kontaktphase darf erst gewechselt
   * werden, wenn alle ausgewählten Produkte
   * abgeschlossen sind.
   */
  if (
    selectedProducts.some(
      (product) =>
        !completedProducts.includes(
          product,
        ),
    )
  ) {
    return null;
  }

  const configurators:
    ConfiguratorLeadPayload[] = [];

  for (
    const product of
    CONFIGURATOR_JOURNEY_ORDER
  ) {
    if (
      !selectedProducts.includes(
        product,
      )
    ) {
      continue;
    }

    const payload =
      buildConfiguratorPayload(
        product,
        state,
      );

    if (!payload) {
      return null;
    }

    configurators.push(payload);
  }

  return {
    ...common,

    products:
      selectedProducts,

    journey: {
      entryPoint,

      selectedProducts,

      completedProducts,
    },

    configurators,
  };
}