import {
    describe,
    expect,
    it,
  } from "vitest";
  
  import {
    buildWallboxConfiguratorResult,
  } from "@/lib/configurator/wallbox";
  import {
    configuratorReducer,
    createInitialConfiguratorState,
  } from "@/lib/configurator/state";
  
  function createCompleteWallboxState() {
    let state =
      createInitialConfiguratorState();
  
    state = configuratorReducer(
      state,
      {
        type: "UPDATE_WALLBOX",
        payload: {
          annualDrivingKm: 15_000,
  
          vehicleConsumptionKwhPer100Km:
            18,
  
          batteryCapacityKwh: 60,
  
          homeChargingSharePercent: 80,
  
          chargingPowerKw: 11,
  
          pvChargingSharePercent: 30,
        },
      },
    );
  
    return state;
  }
  
  describe("wallbox configurator result", () => {
    it("returns null while the wallbox data is incomplete", () => {
      const state =
        createInitialConfiguratorState();
  
      expect(
        buildWallboxConfiguratorResult(
          state,
        ),
      ).toBeNull();
    });
  
    it("reuses the existing wallbox calculator", () => {
      const result =
        buildWallboxConfiguratorResult(
          createCompleteWallboxState(),
        );
  
      expect(result).toMatchObject({
        systemRecommendation:
          "standard11Kw",
  
        annualVehicleEnergyDemandKwh:
          2700,
  
        annualHomeChargingInputEnergyKwh:
          2400,
  
        annualPvChargingEnergyKwh:
          720,
  
        annualGridChargingEnergyKwh:
          1680,
  
        typicalChargingTimeHours:
          3.64,
  
        annualHomeChargingCostEuro:
          595.2,
  
        monthlyHomeChargingCostEuro:
          49.6,
  
        estimatedTotalCostEuro:
          3000,
  
        estimatedMinimumCostEuro:
          2550,
  
        estimatedMaximumCostEuro:
          3450,
  
        usesPhotovoltaicCharging: true,
  
        technicalReviewRecommended:
          false,
      });
    });
  
    it("flags 22 kW for technical review", () => {
      let state =
        createCompleteWallboxState();
  
      state = configuratorReducer(
        state,
        {
          type: "UPDATE_WALLBOX",
          payload: {
            chargingPowerKw: 22,
          },
        },
      );
  
      const result =
        buildWallboxConfiguratorResult(
          state,
        );
  
      expect(
        result?.systemRecommendation,
      ).toBe("highPowerReview");
  
      expect(
        result?.technicalReviewRecommended,
      ).toBe(true);
    });
  
    it("supports charging without photovoltaics", () => {
      let state =
        createCompleteWallboxState();
  
      state = configuratorReducer(
        state,
        {
          type: "UPDATE_WALLBOX",
          payload: {
            pvChargingSharePercent: 0,
          },
        },
      );
  
      const result =
        buildWallboxConfiguratorResult(
          state,
        );
  
      expect(
        result?.usesPhotovoltaicCharging,
      ).toBe(false);
  
      expect(
        result?.annualPvChargingEnergyKwh,
      ).toBe(0);
  
      expect(
        result?.annualGridChargingEnergyKwh,
      ).toBeGreaterThan(0);
    });
  
    it("invalidates an existing wallbox result when wallbox data changes", () => {
      let state =
        createCompleteWallboxState();
  
      const result =
        buildWallboxConfiguratorResult(
          state,
        );
  
      if (!result) {
        throw new Error(
          "Expected wallbox result.",
        );
      }
  
      state = configuratorReducer(
        state,
        {
          type: "SET_WALLBOX_RESULT",
          payload: result,
        },
      );
  
      expect(
        state.results.wallbox,
      ).toBeDefined();
  
      state = configuratorReducer(
        state,
        {
          type: "UPDATE_WALLBOX",
          payload: {
            annualDrivingKm: 20_000,
          },
        },
      );
  
      expect(
        state.results.wallbox,
      ).toBeUndefined();
    });
  });