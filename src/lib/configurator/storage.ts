import { parseConfiguratorState } from "@/lib/validation/configurator/state";
import { createInitialConfiguratorState } from "@/lib/configurator/state";
import type { ConfiguratorState } from "@/types/configurator";

export const CONFIGURATOR_STORAGE_KEY = "energie-kraft:configurator:state:v10";
const LEGACY_CONFIGURATOR_STORAGE_KEYS = [
  "energie-kraft:configurator:state:v1",
  "energie-kraft:configurator:state:v2",
  "energie-kraft:configurator:state:v3",
  "energie-kraft:configurator:state:v4",
  "energie-kraft:configurator:state:v5",
  "energie-kraft:configurator:state:v6",
  "energie-kraft:configurator:state:v7",
  "energie-kraft:configurator:state:v8",
  "energie-kraft:configurator:state:v9",
] as const;

export function readConfiguratorState(storage: Storage): ConfiguratorState | null {
  try {
    const keys = [CONFIGURATOR_STORAGE_KEY, ...[...LEGACY_CONFIGURATOR_STORAGE_KEYS].reverse()];

    for (const key of keys) {
      const serialized = storage.getItem(key);

      if (!serialized) continue;

      const state = parseConfiguratorState(JSON.parse(serialized));

      if (state) return state.submission.status === "submitting"
        ? { ...state, submission: { ...state.submission, status: "failed" } }
        : state;
    }

    return null;
  } catch {
    return null;
  }
}

export function writeConfiguratorState(storage: Storage, state: ConfiguratorState): boolean {
  const validatedState = parseConfiguratorState(state);

  if (!validatedState) {
    return false;
  }

  if (validatedState.activeConfigurator === null && validatedState.journey.entryPoint === null) {
    const initialState = parseConfiguratorState(createInitialConfiguratorState(validatedState.settings));
    if (initialState && JSON.stringify(validatedState) === JSON.stringify(initialState)) {
      clearConfiguratorState(storage);
      return true;
    }
  }

  storage.setItem(CONFIGURATOR_STORAGE_KEY, JSON.stringify(validatedState));

  return true;
}

export function clearConfiguratorState(storage: Storage): void {
  storage.removeItem(CONFIGURATOR_STORAGE_KEY);

  for (const legacyKey of LEGACY_CONFIGURATOR_STORAGE_KEYS) {
    storage.removeItem(legacyKey);
  }
}
