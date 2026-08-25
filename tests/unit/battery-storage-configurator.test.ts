import {
    describe,
    expect,
    it,
  } from "vitest";
  
  import {
    batteryStorageWizardSteps,
  } from "@/content/configurators";
  import {
    configuratorReducer,
    createInitialConfiguratorState,
  } from "@/lib/configurator/state";
  import {
    isBatteryStorageStepComplete,
  } from "@/lib/validation/configurator/battery-storage";
  
  describe("battery storage configurator", () => {
    it("defines the four standalone steps in order", () => {
      expect(
        batteryStorageWizardSteps.map(
          (step) => step.id,
        ),
      ).toEqual([
        "system_data",
        "consumption_pattern",
        "backup_preference",
        "goal",
      ]);
    });
  
    it("requires standalone system data", () => {
      let state =
        createInitialConfiguratorState();
  
      expect(
        isBatteryStorageStepComplete(
          "system_data",
          state,
        ),
      ).toBe(false);
  
      state = configuratorReducer(
        state,
        {
          type: "UPDATE_BATTERY_STORAGE",
          payload: {
            annualConsumptionKwh: 5000,
            pvPowerKwp: 6,
          },
        },
      );
  
      expect(
        isBatteryStorageStepComplete(
          "system_data",
          state,
        ),
      ).toBe(true);
    });
  
    it("requires a consumption pattern", () => {
      let state =
        createInitialConfiguratorState();
  
      expect(
        isBatteryStorageStepComplete(
          "consumption_pattern",
          state,
        ),
      ).toBe(false);
  
      state = configuratorReducer(
        state,
        {
          type: "UPDATE_BATTERY_STORAGE",
          payload: {
            consumptionPattern: "mixed",
          },
        },
      );
  
      expect(
        isBatteryStorageStepComplete(
          "consumption_pattern",
          state,
        ),
      ).toBe(true);
    });
  
    it("requires a backup preference", () => {
      let state =
        createInitialConfiguratorState();
  
      expect(
        isBatteryStorageStepComplete(
          "backup_preference",
          state,
        ),
      ).toBe(false);
  
      state = configuratorReducer(
        state,
        {
          type: "UPDATE_BATTERY_STORAGE",
          payload: {
            backupPreference: "none",
          },
        },
      );
  
      expect(
        isBatteryStorageStepComplete(
          "backup_preference",
          state,
        ),
      ).toBe(true);
    });
  
    it("requires a storage goal", () => {
      let state =
        createInitialConfiguratorState();
  
      expect(
        isBatteryStorageStepComplete(
          "goal",
          state,
        ),
      ).toBe(false);
  
      state = configuratorReducer(
        state,
        {
          type: "UPDATE_BATTERY_STORAGE",
          payload: {
            goal: "balanced",
          },
        },
      );
  
      expect(
        isBatteryStorageStepComplete(
          "goal",
          state,
        ),
      ).toBe(true);
    });
  
    it("rejects implausible standalone values", () => {
      let state =
        createInitialConfiguratorState();
  
      state = configuratorReducer(
        state,
        {
          type: "UPDATE_BATTERY_STORAGE",
          payload: {
            annualConsumptionKwh: 200,
            pvPowerKwp: 0.5,
          },
        },
      );
  
      expect(
        isBatteryStorageStepComplete(
          "system_data",
          state,
        ),
      ).toBe(false);
    });
  });