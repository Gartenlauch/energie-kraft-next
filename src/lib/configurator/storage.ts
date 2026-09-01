import { parseConfiguratorState } from "@/lib/validation/configurator/state";
import type { ConfiguratorState } from "@/types/configurator";

export const CONFIGURATOR_STORAGE_KEY = "energie-kraft:configurator:state:v7";
const LEGACY_CONFIGURATOR_STORAGE_KEYS = [
  "energie-kraft:configurator:state:v1",
  "energie-kraft:configurator:state:v2",
  "energie-kraft:configurator:state:v3",
  "energie-kraft:configurator:state:v4",
  "energie-kraft:configurator:state:v5",
  "energie-kraft:configurator:state:v6",
] as const;


export function readConfiguratorState(
  storage: Storage,
): ConfiguratorState | null {
  try {
    const serialized = storage.getItem(CONFIGURATOR_STORAGE_KEY);

    if (!serialized) {
      return null;
    }

    return parseConfiguratorState(JSON.parse(serialized));
  } catch {
    return null;
  }
}

export function writeConfiguratorState(
  storage: Storage,
  state: ConfiguratorState,
): boolean {
  const validatedState = parseConfiguratorState(state);

  if (!validatedState) {
    return false;
  }

  storage.setItem(
    CONFIGURATOR_STORAGE_KEY,
    JSON.stringify(validatedState),
  );

  return true;
}

export function clearConfiguratorState(
  storage: Storage,
): void {
  storage.removeItem(
    CONFIGURATOR_STORAGE_KEY,
  );

  for (
    const legacyKey of
    LEGACY_CONFIGURATOR_STORAGE_KEYS
  ) {
    storage.removeItem(legacyKey);
  }
}