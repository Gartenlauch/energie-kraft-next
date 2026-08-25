import {
    describe,
    expect,
    it,
  } from "vitest";
  
  import {
    buildBatteryStorageConfiguratorResult,
  } from "@/lib/configurator/battery-storage";
  import {
    buildPhotovoltaicConfiguratorResult,
  } from "@/lib/configurator/photovoltaic";
  import {
    configuratorReducer,
    createInitialConfiguratorState,
  } from "@/lib/configurator/state";
  
  function createPvHandoffState() {
    let state =
      createInitialConfiguratorState();
  
    state = configuratorReducer(
      state,
      {
        type: "UPDATE_HOUSEHOLD",
        payload: {
          persons: 3,
          annualConsumptionKwh: 3000,
          futureIncreasePercent: 10,
        },
      },
    );
  
    state = configuratorReducer(
      state,
      {
        type: "UPDATE_BUILDING",
        payload: {
          ownership: "owner",
          type: "detached_house",
        },
      },
    );
  
    state = configuratorReducer(
      state,
      {
        type: "UPDATE_ROOF",
        payload: {
          pitch: 30,
          material: "roof_tile",
          orientation: "south",
          renovationPeriod:
            "after_1990",
        },
      },
    );
  
    state = configuratorReducer(
      state,
      {
        type: "UPDATE_INTERESTS",
        payload: {
          batteryStorage: true,
        },
      },
    );
  
    const photovoltaicResult =
      buildPhotovoltaicConfiguratorResult(
        state,
      );
  
    if (!photovoltaicResult) {
      throw new Error(
        "Expected photovoltaic result.",
      );
    }
  
    return configuratorReducer(
      state,
      {
        type: "SET_PHOTOVOLTAIC_RESULT",
        payload: photovoltaicResult,
      },
    );
  }
  
  function addBatteryAnswers(
    state: ReturnType<
      typeof createInitialConfiguratorState
    >,
  ) {
    return configuratorReducer(
      state,
      {
        type: "UPDATE_BATTERY_STORAGE",
        payload: {
          consumptionPattern: "mixed",
          backupPreference: "none",
          goal: "balanced",
        },
      },
    );
  }
  
  describe("battery storage configurator result", () => {
    it("returns null while storage answers are incomplete", () => {
      const state =
        createPvHandoffState();
  
      expect(
        buildBatteryStorageConfiguratorResult(
          state,
        ),
      ).toBeNull();
    });
  
    it("builds a balanced result from the photovoltaic handoff", () => {
      const state =
        addBatteryAnswers(
          createPvHandoffState(),
        );
  
      const result =
        buildBatteryStorageConfiguratorResult(
          state,
        );
  
      expect(result).toMatchObject({
        source: "photovoltaic",
  
        annualConsumptionKwh: 3300,
  
        pvPowerKwpMin: 4,
        pvPowerKwpMax: 5,
  
        recommendedUsableCapacityKwhMin:
          4,
  
        recommendedUsableCapacityKwhMax:
          5,
  
        technicalUpperBoundUsableCapacityKwh:
          4.95,
  
        consumptionPattern: "mixed",
        backupPreference: "none",
        goal: "balanced",
  
        pvSurplusLikely: true,
  
        backupPowerRequested: false,
        wholeHomeBackupRequested: false,
  
        technicalReviewRecommended: false,
      });
    });
  
    it("recommends a smaller corridor for an economic daytime profile", () => {
      let state =
        createPvHandoffState();
  
      state = configuratorReducer(
        state,
        {
          type: "UPDATE_BATTERY_STORAGE",
          payload: {
            consumptionPattern:
              "mostly_daytime",
            backupPreference: "none",
            goal: "economic",
          },
        },
      );
  
      const result =
        buildBatteryStorageConfiguratorResult(
          state,
        );
  
      expect(
        result?.recommendedUsableCapacityKwhMin,
      ).toBe(2.5);
  
      expect(
        result?.recommendedUsableCapacityKwhMax,
      ).toBe(3.5);
    });
  
    it("supports a standalone storage calculation", () => {
      let state =
        createInitialConfiguratorState();
  
      state = configuratorReducer(
        state,
        {
          type: "UPDATE_BATTERY_STORAGE",
          payload: {
            annualConsumptionKwh: 5000,
            pvPowerKwp: 6,
            consumptionPattern: "mixed",
            backupPreference: "none",
            goal: "balanced",
          },
        },
      );
  
      const result =
        buildBatteryStorageConfiguratorResult(
          state,
        );
  
      expect(result).toMatchObject({
        source: "standalone",
  
        annualConsumptionKwh: 5000,
  
        pvPowerKwpMin: 6,
        pvPowerKwpMax: 6,
  
        technicalUpperBoundUsableCapacityKwh:
          7.5,
      });
  
      expect(
        result?.recommendedUsableCapacityKwhMin,
      ).toBe(5.5);
  
      expect(
        result?.recommendedUsableCapacityKwhMax,
      ).toBe(7.5);
    });
  
    it("flags whole-home backup for technical review without silently oversizing the battery", () => {
      let state =
        createPvHandoffState();
  
      state = configuratorReducer(
        state,
        {
          type: "UPDATE_BATTERY_STORAGE",
          payload: {
            consumptionPattern: "mixed",
            backupPreference: "whole_home",
            goal: "balanced",
          },
        },
      );
  
      const result =
        buildBatteryStorageConfiguratorResult(
          state,
        );
  
      expect(
        result?.wholeHomeBackupRequested,
      ).toBe(true);
  
      expect(
        result?.technicalReviewRecommended,
      ).toBe(true);
  
      expect(
        result?.technicalUpperBoundUsableCapacityKwh,
      ).toBe(4.95);
    });
  
    it("flags insufficient PV surplus potential", () => {
      let state =
        createInitialConfiguratorState();
  
      state = configuratorReducer(
        state,
        {
          type: "UPDATE_BATTERY_STORAGE",
          payload: {
            annualConsumptionKwh: 8000,
            pvPowerKwp: 2,
            consumptionPattern:
              "mostly_evening",
            backupPreference: "none",
            goal: "balanced",
          },
        },
      );
  
      const result =
        buildBatteryStorageConfiguratorResult(
          state,
        );
  
      expect(
        result?.pvSurplusLikely,
      ).toBe(false);
  
      expect(
        result?.technicalReviewRecommended,
      ).toBe(true);
    });
  
    it("invalidates the storage result when storage answers change", () => {
      let state =
        addBatteryAnswers(
          createPvHandoffState(),
        );
  
      const result =
        buildBatteryStorageConfiguratorResult(
          state,
        );
  
      if (!result) {
        throw new Error(
          "Expected battery storage result.",
        );
      }
  
      state = configuratorReducer(
        state,
        {
          type: "SET_BATTERY_STORAGE_RESULT",
          payload: result,
        },
      );
  
      expect(
        state.results.batteryStorage,
      ).toBeDefined();
  
      state = configuratorReducer(
        state,
        {
          type: "UPDATE_BATTERY_STORAGE",
          payload: {
            goal: "high_autonomy",
          },
        },
      );
  
      expect(
        state.results.batteryStorage,
      ).toBeUndefined();
    });
  
    it("invalidates PV and storage results when PV inputs change", () => {
      let state =
        addBatteryAnswers(
          createPvHandoffState(),
        );
  
      const batteryResult =
        buildBatteryStorageConfiguratorResult(
          state,
        );
  
      if (!batteryResult) {
        throw new Error(
          "Expected battery storage result.",
        );
      }
  
      state = configuratorReducer(
        state,
        {
          type: "SET_BATTERY_STORAGE_RESULT",
          payload: batteryResult,
        },
      );
  
      expect(
        state.results.photovoltaic,
      ).toBeDefined();
  
      expect(
        state.results.batteryStorage,
      ).toBeDefined();
  
      state = configuratorReducer(
        state,
        {
          type: "UPDATE_HOUSEHOLD",
          payload: {
            futureIncreasePercent: 25,
          },
        },
      );
  
      expect(
        state.results.photovoltaic,
      ).toBeUndefined();
  
      expect(
        state.results.batteryStorage,
      ).toBeUndefined();
    });
  });