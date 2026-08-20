import { parseConfiguratorState } from "@/lib/validation/configurator/state";
import type { ConfiguratorState } from "@/types/configurator";

export const CONFIGURATOR_STORAGE_KEY =
  "energie-kraft:configurator:state:v1";

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
): void {
  const validatedState = parseConfiguratorState(state);

  if (!validatedState) {
    throw new Error("Configurator state is invalid and cannot be persisted.");
  }

  storage.setItem(
    CONFIGURATOR_STORAGE_KEY,
    JSON.stringify(validatedState),
  );
}

export function clearConfiguratorState(storage: Storage): void {
  storage.removeItem(CONFIGURATOR_STORAGE_KEY);
}