import {
    describe,
    expect,
    it,
} from "vitest";

import { climateWizardSteps } from "@/content/configurators";
import {
    configuratorReducer,
    createInitialConfiguratorState,
} from "@/lib/configurator/state";
import { isClimateStepComplete } from "@/lib/validation/configurator/climate";

describe("climate configurator", () => {
    it("defines the expected four wizard steps", () => {
        expect(
            climateWizardSteps.map(
                (step) => step.id,
            ),
        ).toEqual([
            "rooms",
            "insulation",
            "solar_load",
            "occupancy",
        ]);
    });

    it("requires valid area and room count", () => {
        let state =
            createInitialConfiguratorState();

        expect(
            isClimateStepComplete(
                "rooms",
                state,
            ),
        ).toBe(false);

        state = configuratorReducer(
            state,
            {
                type: "UPDATE_CLIMATE",
                payload: {
                    conditionedAreaM2: 80,
                    roomCount: 4,
                },
            },
        );

        expect(
            isClimateStepComplete(
                "rooms",
                state,
            ),
        ).toBe(true);
    });

    it("requires an insulation level", () => {
        let state =
            createInitialConfiguratorState();

        state = configuratorReducer(
            state,
            {
                type: "UPDATE_CLIMATE",
                payload: {
                    insulationLevel: "average",
                },
            },
        );

        expect(
            isClimateStepComplete(
                "insulation",
                state,
            ),
        ).toBe(true);
    });

    it("requires a solar load", () => {
        let state =
            createInitialConfiguratorState();

        state = configuratorReducer(
            state,
            {
                type: "UPDATE_CLIMATE",
                payload: {
                    solarLoad: "medium",
                },
            },
        );

        expect(
            isClimateStepComplete(
                "solar_load",
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
                type: "UPDATE_CLIMATE",
                payload: {
                    occupancyPersons: 4,
                },
            },
        );

        expect(
            isClimateStepComplete(
                "occupancy",
                state,
            ),
        ).toBe(true);
    });

    it("rejects fractional room and occupancy counts", () => {
        let state =
            createInitialConfiguratorState();

        state = configuratorReducer(
            state,
            {
                type: "UPDATE_CLIMATE",
                payload: {
                    conditionedAreaM2: 80,
                    roomCount: 2.5,
                    occupancyPersons: 3.5,
                },
            },
        );

        expect(
            isClimateStepComplete(
                "rooms",
                state,
            ),
        ).toBe(false);

        expect(
            isClimateStepComplete(
                "occupancy",
                state,
            ),
        ).toBe(false);
    });
});