import type {
  ConfiguratorAction,
  ConfiguratorResults,
  ConfiguratorState,
  HouseholdConfiguratorState,
} from "@/types/configurator";
import { CONFIGURATOR_STATE_VERSION } from "@/types/configurator";

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

    household: {
      futureIncreasePercent: 10,
    },

    building: {},

    roof: {},

    batteryStorage: {},
    wallbox: {},
    heatPump: {},

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
  return {
    ...state,

    household: normalizeHouseholdState(
      state.household,
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

export function configuratorReducer(
  state: ConfiguratorState,
  action: ConfiguratorAction,
): ConfiguratorState {
  switch (action.type) {
    case "SET_ACTIVE_CONFIGURATOR":
      return {
        ...state,
        activeConfigurator: action.payload,
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

    case "UPDATE_INTERESTS":
      return {
        ...state,

        interests: {
          ...state.interests,
          ...action.payload,
        },

        results:
          withoutPhotovoltaicAndBatteryStorageResults(
            state.results,
          ),
      };

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

    case "RESET":
      return createInitialConfiguratorState();

    default: {
      const exhaustiveCheck: never = action;

      return exhaustiveCheck;
    }
  }
}