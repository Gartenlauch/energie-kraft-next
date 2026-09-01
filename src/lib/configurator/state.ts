import type {
  ConfiguratorAction,
  ConfiguratorInterests,
  ConfiguratorResults,
  ConfiguratorState,
  HouseholdConfiguratorState,
} from "@/types/configurator";
import { CONFIGURATOR_STATE_VERSION } from "@/types/configurator";
import { buildConfiguratorJourney, } from "@/lib/configurator/journey";

export function calculateProjectedConsumptionKwh(
  annualConsumptionKwh: number | undefined,
  futureIncreasePercent: number,
): number | undefined {
  if (annualConsumptionKwh === undefined) {
    return undefined;
  }

  return Math.round(
    annualConsumptionKwh * (1 + futureIncreasePercent / 100),
  );
}

export function createInitialConfiguratorState(): ConfiguratorState {
  return {
    version: CONFIGURATOR_STATE_VERSION,
    activeConfigurator: null,
    journey: {
      entryPoint: null,
      selectedProducts: [],
      completedProducts: [],
    },

    household: {
      futureIncreasePercent: 10,
    },

    building: {},

    roof: {},

    batteryStorage: {},
    wallbox: {},
    heatPump: {},
    climate: {},

    interests: {
      batteryStorage: false,
      climate: false,
      heatPump: false,
      wallbox: false,
    },

    notes: {},
    results: {},
  };
}

function normalizeHouseholdState(
  household: HouseholdConfiguratorState,
): HouseholdConfiguratorState {
  return {
    ...household,
    projectedConsumptionKwh: calculateProjectedConsumptionKwh(
      household.annualConsumptionKwh,
      household.futureIncreasePercent,
    ),
  };
}

export function normalizeConfiguratorState(
  state: ConfiguratorState,
): ConfiguratorState {
  const household =
    normalizeHouseholdState(
      state.household,
    );

  return {
    ...state,

    household,

    journey:
      buildConfiguratorJourney(
        state.journey.entryPoint,
        state.interests,
        state.results,
      ),
  };
}

function withoutPhotovoltaicAndBatteryStorageResults(
  results: ConfiguratorResults,
): ConfiguratorResults {
  const nextResults = {
    ...results,
  };

  delete nextResults.photovoltaic;
  delete nextResults.batteryStorage;

  return nextResults;
}

function withoutBatteryStorageResult(
  results: ConfiguratorResults,
): ConfiguratorResults {
  const nextResults = {
    ...results,
  };

  delete nextResults.batteryStorage;

  return nextResults;
}
function withoutWallboxResult(
  results: ConfiguratorResults,
): ConfiguratorResults {
  const nextResults = {
    ...results,
  };

  delete nextResults.wallbox;

  return nextResults;
}

function withoutHeatPumpResult(
  results: ConfiguratorResults,
): ConfiguratorResults {
  const nextResults = {
    ...results,
  };

  delete nextResults.heatPump;

  return nextResults;
}

function withoutClimateResult(
  results: ConfiguratorResults,
): ConfiguratorResults {
  const nextResults = {
    ...results,
  };

  delete nextResults.climate;

  return nextResults;
}

function withoutChangedInterestResults(
  results: ConfiguratorResults,
  currentInterests: ConfiguratorInterests,
  nextInterests: ConfiguratorInterests,
): ConfiguratorResults {
  const nextResults =
    withoutPhotovoltaicAndBatteryStorageResults(
      results,
    );

  if (
    currentInterests.wallbox !==
    nextInterests.wallbox
  ) {
    delete nextResults.wallbox;
  }

  if (
    currentInterests.heatPump !==
    nextInterests.heatPump
  ) {
    delete nextResults.heatPump;
  }

  if (
    currentInterests.climate !==
    nextInterests.climate
  ) {
    delete nextResults.climate;
  }

  return nextResults;
}

function reduceConfiguratorState(
  state: ConfiguratorState,
  action: ConfiguratorAction,
): ConfiguratorState {
  switch (action.type) {
    case "SET_ACTIVE_CONFIGURATOR":
      return {
        ...state,

        activeConfigurator:
          action.payload,

        journey: {
          ...state.journey,

          entryPoint:
            state.journey.entryPoint ??
            action.payload,
        },
      };

    case "UPDATE_HOUSEHOLD": {
      const household =
        normalizeHouseholdState({
          ...state.household,
          ...action.payload,
        });

      return {
        ...state,
        household,

        results:
          withoutPhotovoltaicAndBatteryStorageResults(
            state.results,
          ),
      };
    }

    case "UPDATE_BUILDING":
      return {
        ...state,

        building: {
          ...state.building,
          ...action.payload,
        },

        results:
          withoutPhotovoltaicAndBatteryStorageResults(
            state.results,
          ),
      };

    case "UPDATE_ROOF":
      return {
        ...state,

        roof: {
          ...state.roof,
          ...action.payload,
        },

        results:
          withoutPhotovoltaicAndBatteryStorageResults(
            state.results,
          ),
      };

    case "UPDATE_BATTERY_STORAGE":
      return {
        ...state,

        batteryStorage: {
          ...state.batteryStorage,
          ...action.payload,
        },

        results:
          withoutBatteryStorageResult(
            state.results,
          ),
      };
    case "UPDATE_WALLBOX":
      return {
        ...state,

        wallbox: {
          ...state.wallbox,
          ...action.payload,
        },

        results:
          withoutWallboxResult(
            state.results,
          ),
      };

    case "UPDATE_INTERESTS": {
      const interests = {
        ...state.interests,
        ...action.payload,
      };

      return {
        ...state,

        interests,

        results:
          withoutChangedInterestResults(
            state.results,
            state.interests,
            interests,
          ),
      };
    }

    case "UPDATE_NOTES":
      return {
        ...state,

        notes: {
          ...state.notes,
          ...action.payload,
        },
      };

    case "SET_PHOTOVOLTAIC_RESULT": {
      const results =
        withoutBatteryStorageResult(
          state.results,
        );

      return {
        ...state,

        results: {
          ...results,
          photovoltaic: action.payload,
        },
      };
    }

    case "SET_BATTERY_STORAGE_RESULT":
      return {
        ...state,

        results: {
          ...state.results,
          batteryStorage: action.payload,
        },
      };

    case "SET_WALLBOX_RESULT":
      return {
        ...state,

        results: {
          ...state.results,
          wallbox: action.payload,
        },
      };

    case "REPLACE_STATE":
      return normalizeConfiguratorState(
        action.payload,
      );
    case "UPDATE_HEAT_PUMP":
      return {
        ...state,

        heatPump: {
          ...state.heatPump,
          ...action.payload,
        },

        results:
          withoutHeatPumpResult(
            state.results,
          ),
      };
    case "SET_HEAT_PUMP_RESULT":
      return {
        ...state,

        results: {
          ...state.results,
          heatPump: action.payload,
        },
      };
    case "UPDATE_CLIMATE":
      return {
        ...state,

        climate: {
          ...state.climate,
          ...action.payload,
        },

        results:
          withoutClimateResult(
            state.results,
          ),
      };
    case "SET_CLIMATE_RESULT":
      return {
        ...state,

        results: {
          ...state.results,
          climate: action.payload,
        },
      };

    case "RESET":
      return createInitialConfiguratorState();

    default: {
      const exhaustiveCheck: never = action;

      return exhaustiveCheck;
    }
  }
}

export function configuratorReducer(
  state: ConfiguratorState,
  action: ConfiguratorAction,
): ConfiguratorState {
  return normalizeConfiguratorState(
    reduceConfiguratorState(
      state,
      action,
    ),
  );
}