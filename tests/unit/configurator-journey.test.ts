import {
    describe,
    expect,
    it,
} from "vitest";
import {
    buildWallboxConfiguratorResult,
} from "@/lib/configurator/wallbox";

import {
    buildConfiguratorJourney,
    getNextConfiguratorProduct,
} from "@/lib/configurator/journey";
import {
    createInitialConfiguratorState,
} from "@/lib/configurator/state";

describe(
    "configurator journey",
    () => {
        it(
            "builds the selected products in the canonical order",
            () => {
                const state =
                    createInitialConfiguratorState();

                const journey =
                    buildConfiguratorJourney(
                        "photovoltaic",
                        {
                            batteryStorage: true,
                            climate: true,
                            heatPump: true,
                            wallbox: false,
                        },
                        state.results,
                    );

                expect(
                    journey.selectedProducts,
                ).toEqual([
                    "photovoltaic",
                    "battery_storage",
                    "heat_pump",
                    "climate",
                ]);

                expect(
                    journey.completedProducts,
                ).toEqual([]);
            },
        );

        it(
            "detects completed configurators from their results",
            () => {
                const state =
                    createInitialConfiguratorState();

                const wallboxResult =
                    buildWallboxConfiguratorResult({
                        ...state,

                        wallbox: {
                            annualDrivingKm: 15_000,
                            vehicleConsumptionKwhPer100Km: 18,
                            batteryCapacityKwh: 60,
                            homeChargingSharePercent: 80,
                            chargingPowerKw: 11,
                            pvChargingSharePercent: 30,
                        },
                    });

                expect(wallboxResult).not.toBeNull();

                if (!wallboxResult) {
                    throw new Error(
                        "Expected a valid wallbox configurator result.",
                    );
                }

                const journey =
                    buildConfiguratorJourney(
                        "wallbox",
                        state.interests,
                        {
                            ...state.results,
                            wallbox: wallboxResult,
                        },
                    );

                expect(
                    journey.completedProducts,
                ).toEqual([
                    "wallbox",
                ]);
            },
        );

        it(
            "returns the next selected incomplete configurator",
            () => {
                const journey =
                    buildConfiguratorJourney(
                        "photovoltaic",
                        {
                            batteryStorage: true,
                            wallbox: false,
                            heatPump: true,
                            climate: true,
                        },
                        {},
                    );

                expect(
                    getNextConfiguratorProduct(
                        journey,
                        "photovoltaic",
                    ),
                ).toBe(
                    "battery_storage",
                );
            },
        );
        it(
            "adds photovoltaic energy-solution selections to the journey",
            () => {
                const state =
                    createInitialConfiguratorState();

                const journey =
                    buildConfiguratorJourney(
                        "photovoltaic",
                        {
                            batteryStorage: true,
                            wallbox: true,
                            heatPump: true,
                            climate: true,
                        },
                        state.results,
                    );

                expect(
                    journey.selectedProducts,
                ).toEqual([
                    "photovoltaic",
                    "battery_storage",
                    "wallbox",
                    "heat_pump",
                    "climate",
                ]);
            },
        );
        it(
            "moves through a complete multi-configurator journey in order",
            () => {
                const selectedProducts = [
                    "photovoltaic",
                    "battery_storage",
                    "wallbox",
                    "heat_pump",
                    "climate",
                ] as const;

                expect(
                    getNextConfiguratorProduct(
                        {
                            entryPoint:
                                "photovoltaic",
                            selectedProducts: [
                                ...selectedProducts,
                            ],
                            completedProducts: [
                                "photovoltaic",
                            ],
                        },
                        "photovoltaic",
                    ),
                ).toBe(
                    "battery_storage",
                );

                expect(
                    getNextConfiguratorProduct(
                        {
                            entryPoint:
                                "photovoltaic",
                            selectedProducts: [
                                ...selectedProducts,
                            ],
                            completedProducts: [
                                "photovoltaic",
                                "battery_storage",
                            ],
                        },
                        "battery_storage",
                    ),
                ).toBe("wallbox");

                expect(
                    getNextConfiguratorProduct(
                        {
                            entryPoint:
                                "photovoltaic",
                            selectedProducts: [
                                ...selectedProducts,
                            ],
                            completedProducts: [
                                "photovoltaic",
                                "battery_storage",
                                "wallbox",
                            ],
                        },
                        "wallbox",
                    ),
                ).toBe("heat_pump");

                expect(
                    getNextConfiguratorProduct(
                        {
                            entryPoint:
                                "photovoltaic",
                            selectedProducts: [
                                ...selectedProducts,
                            ],
                            completedProducts: [
                                "photovoltaic",
                                "battery_storage",
                                "wallbox",
                                "heat_pump",
                            ],
                        },
                        "heat_pump",
                    ),
                ).toBe("climate");

                expect(
                    getNextConfiguratorProduct(
                        {
                            entryPoint:
                                "photovoltaic",
                            selectedProducts: [
                                ...selectedProducts,
                            ],
                            completedProducts: [
                                ...selectedProducts,
                            ],
                        },
                        "climate",
                    ),
                ).toBeNull();
            },
        );
    },
);