import { describe, expect, it } from "vitest";
import {
  applyCalculatorHandoff,
  CALCULATOR_HANDOFF_STORAGE_KEY,
  clearCalculatorHandoff,
  readCalculatorHandoff,
  writeCalculatorHandoff,
} from "@/lib/configurator/calculator-handoff";
import { createInitialConfiguratorState } from "@/lib/configurator/state";

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

describe("calculator to configurator handoff", () => {
  it("writes, validates and clears a versioned handoff explicitly", () => {
    const storage = new MemoryStorage();
    writeCalculatorHandoff(storage, {
      version: 1,
      source: "pv_roi",
      createdAt: Date.now(),
      values: { annualConsumptionKwh: 5_200 },
    });
    expect(readCalculatorHandoff(storage)?.source).toBe("pv_roi");
    expect(storage.getItem(CALCULATOR_HANDOFF_STORAGE_KEY)).not.toBeNull();
    clearCalculatorHandoff(storage);
    expect(storage.getItem(CALCULATOR_HANDOFF_STORAGE_KEY)).toBeNull();
  });

  it("prefills compatible values without overwriting existing configurator input", () => {
    const state = { ...createInitialConfiguratorState(), heatPump: { heatedAreaM2: 175 } };
    const next = applyCalculatorHandoff(state, {
      version: 1,
      source: "heat_pump",
      createdAt: Date.now(),
      values: {
        heatedAreaM2: 120,
        specificSpaceHeatingDemandKwhPerM2Year: 75,
        occupancyPersons: 3,
        requiredFlowTemperatureC: 45,
        annualPerformanceFactor: 3.8,
      },
    });
    expect(next.heatPump.heatedAreaM2).toBe(175);
    expect(next.heatPump.occupancyPersons).toBe(3);
    expect(next.journey.entryPoint).toBe("heat_pump");
  });

  it("maps only semantically equivalent PV sizing values", () => {
    const next = applyCalculatorHandoff(createInitialConfiguratorState(), {
      version: 1,
      source: "pv_sizing",
      createdAt: Date.now(),
      values: { annualConsumptionKwh: 4_800, roofOrientation: "eastWest" },
    });
    expect(next.household.annualConsumptionKwh).toBe(4_800);
    expect(next.roof.orientation).toBe("east_west");
    expect(next.batteryStorage).toEqual({});
  });
});
