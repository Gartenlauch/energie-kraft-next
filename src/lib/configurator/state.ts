import type {
  ConfiguratorAction,
  ConfiguratorState,
  HouseholdConfiguratorState,
  ConfiguratorResults,
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
    household: normalizeHouseholdState(state.household),
  };
}

function withoutPhotovoltaicResult(
  results: ConfiguratorResults,
): ConfiguratorResults {
  const nextResults = {
    ...results,
  };

  delete nextResults.photovoltaic;

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
      const household = normalizeHouseholdState({
        ...state.household,
        ...action.payload,
      });

      return {
        ...state,
        household,
        results: withoutPhotovoltaicResult(state.results),
      };
    }

    case "UPDATE_BUILDING":
      return {
        ...state,
        building: {
          ...state.building,
          ...action.payload,
        },
        results: withoutPhotovoltaicResult(state.results),
      };

    case "UPDATE_ROOF":
      return {
        ...state,
        roof: {
          ...state.roof,
          ...action.payload,
        },
        results: withoutPhotovoltaicResult(state.results),
      };

    case "UPDATE_INTERESTS":
      return {
        ...state,
        interests: {
          ...state.interests,
          ...action.payload,
        },
        results: withoutPhotovoltaicResult(state.results),
      };

    case "UPDATE_NOTES":
      return {
        ...state,
        notes: {
          ...state.notes,
          ...action.payload,
        },
      };

    case "SET_PHOTOVOLTAIC_RESULT":
      return {
        ...state,
        results: {
          ...state.results,
          photovoltaic: action.payload,
        },
      };

    case "REPLACE_STATE":
      return normalizeConfiguratorState(action.payload);

    case "RESET":
      return createInitialConfiguratorState();

    default: {
      const exhaustiveCheck: never = action;
      return exhaustiveCheck;
    }
  }
}