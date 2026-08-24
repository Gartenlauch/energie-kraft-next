import { describe, expect, it } from "vitest";

import {
  clearConfiguratorState,
  CONFIGURATOR_STORAGE_KEY,
  readConfiguratorState,
  writeConfiguratorState,
} from "@/lib/configurator/storage";
import {
  configuratorReducer,
  createInitialConfiguratorState,
} from "@/lib/configurator/state";

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe("configurator storage", () => {
  it("does not overwrite persisted state with an invalid transient state", () => {
    const storage = new MemoryStorage();

    const validState = configuratorReducer(
      createInitialConfiguratorState(),
      {
        type: "UPDATE_HOUSEHOLD",
        payload: {
          annualConsumptionKwh: 3000,
        },
      },
    );

    expect(
      writeConfiguratorState(storage, validState),
    ).toBe(true);

    const invalidState = configuratorReducer(
      validState,
      {
        type: "UPDATE_HOUSEHOLD",
        payload: {
          annualConsumptionKwh: 200,
        },
      },
    );

    expect(
      writeConfiguratorState(storage, invalidState),
    ).toBe(false);

    const restored =
      readConfiguratorState(storage);

    expect(
      restored?.household.annualConsumptionKwh,
    ).toBe(3000);
  });

  it("persists and restores configurator state", () => {
    const storage = new MemoryStorage();

    const state = configuratorReducer(
      createInitialConfiguratorState(),
      {
        type: "UPDATE_HOUSEHOLD",
        payload: {
          persons: 3,
          annualConsumptionKwh: 3000,
        },
      },
    );

    writeConfiguratorState(storage, state);

    const restored = readConfiguratorState(storage);

    expect(restored?.household.persons).toBe(3);
    expect(restored?.household.annualConsumptionKwh).toBe(3000);
    expect(restored?.household.projectedConsumptionKwh).toBe(3300);
  });

  it("returns null for corrupted JSON", () => {
    const storage = new MemoryStorage();

    storage.setItem(
      CONFIGURATOR_STORAGE_KEY,
      "{invalid-json",
    );

    expect(readConfiguratorState(storage)).toBeNull();
  });

  it("removes persisted configurator state", () => {
    const storage = new MemoryStorage();

    writeConfiguratorState(
      storage,
      createInitialConfiguratorState(),
    );

    clearConfiguratorState(storage);

    expect(readConfiguratorState(storage)).toBeNull();
  });
});