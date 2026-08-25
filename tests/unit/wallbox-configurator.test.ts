import {
    describe,
    expect,
    it,
  } from "vitest";
  
  import { wallboxWizardSteps } from "@/content/configurators";
  import {
    configuratorReducer,
    createInitialConfiguratorState,
  } from "@/lib/configurator/state";
  import { isWallboxStepComplete } from "@/lib/validation/configurator/wallbox";
  
  describe("wallbox configurator", () => {
    it("defines the expected four wizard steps", () => {
      expect(
        wallboxWizardSteps.map(
          (step) => step.id,
        ),
      ).toEqual([
        "vehicle_data",
        "home_charging",
        "charging_power",
        "photovoltaics",
      ]);
    });
  
    it("requires complete vehicle data", () => {
      let state =
        createInitialConfiguratorState();
  
      expect(
        isWallboxStepComplete(
          "vehicle_data",
          state,
        ),
      ).toBe(false);
  
      state = configuratorReducer(
        state,
        {
          type: "UPDATE_WALLBOX",
          payload: {
            annualDrivingKm: 15_000,
            vehicleConsumptionKwhPer100Km:
              18,
            batteryCapacityKwh: 60,
          },
        },
      );
  
      expect(
        isWallboxStepComplete(
          "vehicle_data",
          state,
        ),
      ).toBe(true);
    });
  
    it("requires a valid home charging share", () => {
      let state =
        createInitialConfiguratorState();
  
      state = configuratorReducer(
        state,
        {
          type: "UPDATE_WALLBOX",
          payload: {
            homeChargingSharePercent: 80,
          },
        },
      );
  
      expect(
        isWallboxStepComplete(
          "home_charging",
          state,
        ),
      ).toBe(true);
    });
  
    it("requires a supported charging power", () => {
      let state =
        createInitialConfiguratorState();
  
      state = configuratorReducer(
        state,
        {
          type: "UPDATE_WALLBOX",
          payload: {
            chargingPowerKw: 11,
          },
        },
      );
  
      expect(
        isWallboxStepComplete(
          "charging_power",
          state,
        ),
      ).toBe(true);
    });
  
    it("accepts zero percent photovoltaic charging", () => {
      let state =
        createInitialConfiguratorState();
  
      state = configuratorReducer(
        state,
        {
          type: "UPDATE_WALLBOX",
          payload: {
            pvChargingSharePercent: 0,
          },
        },
      );
  
      expect(
        isWallboxStepComplete(
          "photovoltaics",
          state,
        ),
      ).toBe(true);
    });
  });