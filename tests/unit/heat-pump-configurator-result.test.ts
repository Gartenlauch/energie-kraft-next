import {
    describe,
    expect,
    it,
  } from "vitest";
  
  import {
    buildHeatPumpConfiguratorResult,
  } from "@/lib/configurator/heat-pump";
  import {
    configuratorReducer,
    createInitialConfiguratorState,
  } from "@/lib/configurator/state";
  
  function createCompleteHeatPumpState() {
    let state =
      createInitialConfiguratorState();
  
    state = configuratorReducer(
      state,
      {
        type: "UPDATE_HEAT_PUMP",
        payload: {
          heatedAreaM2: 160,
  
          specificSpaceHeatingDemandKwhPerM2Year:
            90,
  
          occupancyPersons: 4,
  
          requiredFlowTemperatureC: 50,
  
          annualPerformanceFactor: 3.5,
        },
      },
    );
  
    return state;
  }
  
  describe("heat pump configurator result", () => {
    it("returns null while required data is incomplete", () => {
      const state =
        createInitialConfiguratorState();
  
      expect(
        buildHeatPumpConfiguratorResult(
          state,
        ),
      ).toBeNull();
    });
  
    it("reuses the existing heat pump calculator", () => {
      const result =
        buildHeatPumpConfiguratorResult(
          createCompleteHeatPumpState(),
        );
  
      expect(result).toMatchObject({
        recommendedHeatPumpCapacityKw:
          10.5,
  
        totalAnnualHeatDemandKwh:
          17_600,
  
        spaceHeatingDemandKwh:
          14_400,
  
        hotWaterDemandKwh:
          3_200,
  
        annualHeatPumpElectricityConsumptionKwh:
          5_028.57,
  
        annualHeatPumpOperatingCostEuro:
          1_508.57,
  
        estimatedTotalCostEuro:
          27_600,
  
        estimatedMinimumCostEuro:
          23_460,
  
        estimatedMaximumCostEuro:
          31_740,
  
        flowTemperatureAssessment:
          "ntReady",
  
        ntReady: true,
  
        technicalReviewRecommended:
          false,
      });
    });
  
    it("flags a high flow temperature for technical review", () => {
      let state =
        createCompleteHeatPumpState();
  
      state = configuratorReducer(
        state,
        {
          type: "UPDATE_HEAT_PUMP",
          payload: {
            requiredFlowTemperatureC:
              60,
          },
        },
      );
  
      const result =
        buildHeatPumpConfiguratorResult(
          state,
        );
  
      expect(
        result?.flowTemperatureAssessment,
      ).toBe("individualReview");
  
      expect(result?.ntReady).toBe(false);
  
      expect(
        result?.technicalReviewRecommended,
      ).toBe(true);
    });
  
    it("keeps 55 degrees inside the nt-ready model", () => {
      let state =
        createCompleteHeatPumpState();
  
      state = configuratorReducer(
        state,
        {
          type: "UPDATE_HEAT_PUMP",
          payload: {
            requiredFlowTemperatureC:
              55,
          },
        },
      );
  
      const result =
        buildHeatPumpConfiguratorResult(
          state,
        );
  
      expect(result?.ntReady).toBe(true);
  
      expect(
        result?.technicalReviewRecommended,
      ).toBe(false);
    });
  
    it("invalidates an existing result after changing input data", () => {
      let state =
        createCompleteHeatPumpState();
  
      const result =
        buildHeatPumpConfiguratorResult(
          state,
        );
  
      if (!result) {
        throw new Error(
          "Expected heat pump result.",
        );
      }
  
      state = configuratorReducer(
        state,
        {
          type: "SET_HEAT_PUMP_RESULT",
          payload: result,
        },
      );
  
      expect(
        state.results.heatPump,
      ).toBeDefined();
  
      state = configuratorReducer(
        state,
        {
          type: "UPDATE_HEAT_PUMP",
          payload: {
            heatedAreaM2: 180,
          },
        },
      );
  
      expect(
        state.results.heatPump,
      ).toBeUndefined();
    });
  });