import { describe, expect, it } from "vitest";

import {
  clearConfiguratorState,
  CONFIGURATOR_STORAGE_KEY,
  readConfiguratorState,
  writeConfiguratorState,
} from "@/lib/configurator/storage";
import { writeCalculatorHandoff } from "@/lib/configurator/calculator-handoff";
import { clearSubmittedConfiguratorProject } from "@/lib/configurator/project-reset";
import { DEFAULT_CONFIGURATOR_SETTINGS } from "@/lib/configurator/settings-model";
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

  it("migrates a valid v8 state with the new decision left open", () => {
    const storage = new MemoryStorage();
    const current = createInitialConfiguratorState();
    const { additionalSolutionsReviewed: _reviewed, ...legacyJourney } = current.journey;
    storage.setItem(
      "energie-kraft:configurator:state:v8",
      JSON.stringify({
        ...current,
        version: 8,
        journey: legacyJourney,
      }),
    );

    const migrated = readConfiguratorState(storage);

    expect(migrated?.version).toBe(10);
    expect(migrated?.journey.additionalSolutionsReviewed).toBe(false);
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

  it("clears completed project state and calculator handoff together", () => {
    const storage = new MemoryStorage();
    writeConfiguratorState(storage, createInitialConfiguratorState());
    writeCalculatorHandoff(storage, {
      version: 1,
      source: "pv_roi",
      createdAt: Date.now(),
      settings: DEFAULT_CONFIGURATOR_SETTINGS,
      values: { annualConsumptionKwh: 4_500 },
    });

    clearSubmittedConfiguratorProject(storage);

    expect(storage.length).toBe(0);
  });

  it("does not recreate a submitted draft when the reset state reaches persistence", () => {
    const storage = new MemoryStorage();
    const active = configuratorReducer(createInitialConfiguratorState(), {
      type: "SET_ACTIVE_CONFIGURATOR",
      payload: "photovoltaic",
    });
    writeConfiguratorState(storage, active);
    expect(readConfiguratorState(storage)?.settingsVersion).toBe(0);

    clearSubmittedConfiguratorProject(storage);
    writeConfiguratorState(storage, configuratorReducer(active, { type: "RESET" }));
    expect(storage.length).toBe(0);

    const newerSettings = structuredClone(DEFAULT_CONFIGURATOR_SETTINGS);
    newerSettings.version = 1;
    expect(createInitialConfiguratorState(newerSettings).settingsVersion).toBe(1);
  });
});
