import {
    describe,
    expect,
    it,
} from "vitest";

import { heatPumpWizardSteps } from "@/content/configurators";
import {
    configuratorReducer,
    createInitialConfiguratorState,
} from "@/lib/configurator/state";
import { isHeatPumpStepComplete } from "@/lib/validation/configurator/heat-pump";

describe("heat pump configurator", () => {
    it("defines the expected five wizard steps", () => {
        expect(
            heatPumpWizardSteps.map(
                (step) => step.id,
            ),
        ).toEqual([
            "heated_area",
            "heating_demand",
            "occupancy",
            "flow_temperature",
            "efficiency",
        ]);
    });

    it("requires a valid heated area", () => {
        let state =
            createInitialConfiguratorState();

        expect(
            isHeatPumpStepComplete(
                "heated_area",
                state,
            ),
        ).toBe(false);

        state = configuratorReducer(
            state,
            {
                type: "UPDATE_HEAT_PUMP",
                payload: {
                    heatedAreaM2: 160,
                },
            },
        );

        expect(
            isHeatPumpStepComplete(
                "heated_area",
                state,
            ),
        ).toBe(true);
    });

    it("requires a valid heating demand", () => {
        let state =
            createInitialConfiguratorState();

        state = configuratorReducer(
            state,
            {
                type: "UPDATE_HEAT_PUMP",
                payload: {
                    specificSpaceHeatingDemandKwhPerM2Year:
                        90,
                },
            },
        );

        expect(
            isHeatPumpStepComplete(
                "heating_demand",
                state,
            ),
        ).toBe(true);
    });

    it("requires a valid occupancy", () => {
        let state =
            createInitialConfiguratorState();

        state = configuratorReducer(
            state,
            {
                type: "UPDATE_HEAT_PUMP",
                payload: {
                    occupancyPersons: 4,
                },
            },
        );

        expect(
            isHeatPumpStepComplete(
                "occupancy",
                state,
            ),
        ).toBe(true);
    });

    it("accepts the 55 degree nt-ready boundary", () => {
        let state =
            createInitialConfiguratorState();

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

        expect(
            isHeatPumpStepComplete(
                "flow_temperature",
                state,
            ),
        ).toBe(true);
    });

    it("requires a valid annual performance factor", () => {
        let state =
            createInitialConfiguratorState();

        state = configuratorReducer(
            state,
            {
                type: "UPDATE_HEAT_PUMP",
                payload: {
                    annualPerformanceFactor:
                        3.5,
                },
            },
        );

        expect(
            isHeatPumpStepComplete(
                "efficiency",
                state,
            ),
        ).toBe(true);
    });
});