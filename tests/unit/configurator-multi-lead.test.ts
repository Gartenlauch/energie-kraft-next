import {
    describe,
    expect,
    it,
} from "vitest";

import {
    buildBatteryStorageConfiguratorResult,
} from "@/lib/configurator/battery-storage";
import {
    buildClimateConfiguratorResult,
} from "@/lib/configurator/climate";
import {
    buildHeatPumpConfiguratorResult,
} from "@/lib/configurator/heat-pump";
import {
    buildConfiguratorLeadInput,
} from "@/lib/configurator/lead";
import {
    buildPhotovoltaicConfiguratorResult,
} from "@/lib/configurator/photovoltaic";
import {
    configuratorReducer,
    createInitialConfiguratorState,
} from "@/lib/configurator/state";
import {
    buildWallboxConfiguratorResult,
} from "@/lib/configurator/wallbox";
import {
    configuratorLeadInputSchema,
} from "@/lib/validation/configurator/lead";

function createMultiConfiguratorState() {
    let state =
        createInitialConfiguratorState();

    state = configuratorReducer(
        state,
        {
            type: "SET_ACTIVE_CONFIGURATOR",
            payload: "photovoltaic",
        },
    );

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
                renovationPeriod: "after_1990",
            },
        },
    );

    state = configuratorReducer(
        state,
        {
            type: "UPDATE_INTERESTS",
            payload: {
                batteryStorage: true,
                wallbox: true,
                heatPump: true,
                climate: true,
            },
        },
    );

    state = configuratorReducer(
        state,
        {
            type: "UPDATE_NOTES",
            payload: {
                hasNotes: false,
                text: "",
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

    state = configuratorReducer(
        state,
        {
            type:
                "SET_PHOTOVOLTAIC_RESULT",
            payload:
                photovoltaicResult,
        },
    );

    state = configuratorReducer(
        state,
        {
            type:
                "UPDATE_BATTERY_STORAGE",

            payload: {
                consumptionPattern:
                    "mixed",

                backupPreference:
                    "selected_loads",

                goal:
                    "balanced",
            },
        },
    );

    const batteryStorageResult =
        buildBatteryStorageConfiguratorResult(
            state,
        );

    if (!batteryStorageResult) {
        throw new Error(
            "Expected battery-storage result.",
        );
    }

    state = configuratorReducer(
        state,
        {
            type:
                "SET_BATTERY_STORAGE_RESULT",

            payload:
                batteryStorageResult,
        },
    );

    state = configuratorReducer(
        state,
        {
            type: "UPDATE_WALLBOX",

            payload: {
                annualDrivingKm:
                    15_000,

                vehicleConsumptionKwhPer100Km:
                    18,

                batteryCapacityKwh:
                    60,

                homeChargingSharePercent:
                    80,

                chargingPowerKw:
                    11,

                pvChargingSharePercent:
                    30,
            },
        },
    );

    const wallboxResult =
        buildWallboxConfiguratorResult(
            state,
        );

    if (!wallboxResult) {
        throw new Error(
            "Expected wallbox result.",
        );
    }

    state = configuratorReducer(
        state,
        {
            type:
                "SET_WALLBOX_RESULT",

            payload:
                wallboxResult,
        },
    );

    state = configuratorReducer(
        state,
        {
            type:
                "UPDATE_HEAT_PUMP",

            payload: {
                heatedAreaM2:
                    160,

                specificSpaceHeatingDemandKwhPerM2Year:
                    90,

                occupancyPersons:
                    4,

                requiredFlowTemperatureC:
                    50,

                annualPerformanceFactor:
                    3.5,
            },
        },
    );

    const heatPumpResult =
        buildHeatPumpConfiguratorResult(
            state,
        );

    if (!heatPumpResult) {
        throw new Error(
            "Expected heat-pump result.",
        );
    }

    state = configuratorReducer(
        state,
        {
            type:
                "SET_HEAT_PUMP_RESULT",

            payload:
                heatPumpResult,
        },
    );

    state = configuratorReducer(
        state,
        {
            type:
                "UPDATE_CLIMATE",

            payload: {
                conditionedAreaM2:
                    80,

                roomCount:
                    4,

                insulationLevel:
                    "average",

                solarLoad:
                    "medium",

                occupancyPersons:
                    4,
            },
        },
    );

    const climateResult =
        buildClimateConfiguratorResult(
            state,
        );

    if (!climateResult) {
        throw new Error(
            "Expected climate result.",
        );
    }

    return configuratorReducer(
        state,
        {
            type:
                "SET_CLIMATE_RESULT",

            payload:
                climateResult,
        },
    );
}

describe(
    "multi configurator lead",
    () => {
        it(
            "builds one lead containing all completed configurators",
            () => {
                const state =
                    createMultiConfiguratorState();

                expect(
                    state.journey
                        .selectedProducts,
                ).toEqual([
                    "photovoltaic",
                    "battery_storage",
                    "wallbox",
                    "heat_pump",
                    "climate",
                ]);

                expect(
                    state.journey
                        .completedProducts,
                ).toEqual([
                    "photovoltaic",
                    "battery_storage",
                    "wallbox",
                    "heat_pump",
                    "climate",
                ]);

                const input =
                    buildConfiguratorLeadInput(
                        state,
                        {
                            firstName:
                                "Max",

                            lastName:
                                "Mustermann",

                            email:
                                "max@example.com",

                            phone:
                                "01234 56789",

                            installationAtResidence:
                                true,

                            street:
                                "Musterstraße 1",

                            postalCode:
                                "83395",

                            city:
                                "Freilassing",

                            privacyAccepted:
                                true,

                            website:
                                "",
                        },
                        Date.now(),
                    );

                expect(
                    input,
                ).not.toBeNull();

                if (!input) {
                    throw new Error(
                        "Expected multi-configurator lead input.",
                    );
                }

                expect(
                    input.products,
                ).toEqual([
                    "photovoltaic",
                    "battery_storage",
                    "wallbox",
                    "heat_pump",
                    "climate",
                ]);

                expect(
                    input.configurators.map(
                        (configurator) =>
                            configurator.type,
                    ),
                ).toEqual([
                    "photovoltaic",
                    "battery_storage",
                    "wallbox",
                    "heat_pump",
                    "climate",
                ]);

                expect(
                    input.configurators,
                ).toHaveLength(5);

                expect(
                    configuratorLeadInputSchema.safeParse(
                        input,
                    ).success,
                ).toBe(true);
            },
        );

        it(
            "removes an old result when an optional product is deselected",
            () => {
                let state =
                    createInitialConfiguratorState();

                state =
                    configuratorReducer(
                        state,
                        {
                            type:
                                "SET_ACTIVE_CONFIGURATOR",

                            payload:
                                "photovoltaic",
                        },
                    );

                state =
                    configuratorReducer(
                        state,
                        {
                            type:
                                "UPDATE_INTERESTS",

                            payload: {
                                wallbox:
                                    true,
                            },
                        },
                    );

                state =
                    configuratorReducer(
                        state,
                        {
                            type:
                                "UPDATE_WALLBOX",

                            payload: {
                                annualDrivingKm:
                                    15_000,

                                vehicleConsumptionKwhPer100Km:
                                    18,

                                batteryCapacityKwh:
                                    60,

                                homeChargingSharePercent:
                                    80,

                                chargingPowerKw:
                                    11,

                                pvChargingSharePercent:
                                    30,
                            },
                        },
                    );

                const wallboxResult =
                    buildWallboxConfiguratorResult(
                        state,
                    );

                if (!wallboxResult) {
                    throw new Error(
                        "Expected wallbox result.",
                    );
                }

                state =
                    configuratorReducer(
                        state,
                        {
                            type:
                                "SET_WALLBOX_RESULT",

                            payload:
                                wallboxResult,
                        },
                    );

                expect(
                    state.results.wallbox,
                ).toBeDefined();

                state =
                    configuratorReducer(
                        state,
                        {
                            type:
                                "UPDATE_INTERESTS",

                            payload: {
                                wallbox:
                                    false,
                            },
                        },
                    );

                expect(
                    state.results.wallbox,
                ).toBeUndefined();

                state =
                    configuratorReducer(
                        state,
                        {
                            type:
                                "UPDATE_INTERESTS",

                            payload: {
                                wallbox:
                                    true,
                            },
                        },
                    );

                expect(
                    state.journey
                        .selectedProducts,
                ).toEqual([
                    "photovoltaic",
                    "wallbox",
                ]);

                expect(
                    state.journey
                        .completedProducts,
                ).not.toContain(
                    "wallbox",
                );
            },
        );
    },
);