import {
    describe,
    expect,
    it,
} from "vitest";
import { configuratorLeadPayloadSchema } from "../../functions/src/configurator-lead-validation";
import { buildConfiguratorLeadMail } from "../../functions/src/configurator-lead-mail";

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
    state = configuratorReducer(state, {
        type: "SET_SUBMISSION",
        payload: { status: "idle", id: "ec36c0e2-166f-4ea0-8738-cbe44e695bc5" },
    });

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
                existingHeatingSystem: "gas",
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

describe("KPLUS configurator attachments", () => {
    it.each(["photovoltaic", "battery_storage", "heat_pump", "climate", "wallbox", "combined"] as const)(
        "includes the complete mail content for %s without recalculating results",
        (variant) => {
            const state = createMultiConfiguratorState();
            state.notes = { hasNotes: true, text: "Bitte prüfen.\n\nDachzugang über die Südseite." };
            if (variant !== "combined") {
                state.activeConfigurator = variant;
                state.journey = { ...state.journey, entryPoint: variant, selectedProducts: [variant], completedProducts: [variant] };
                state.results = {};
                state.interests = {
                    photovoltaic: variant === "photovoltaic", batteryStorage: variant === "battery_storage",
                    heatPump: variant === "heat_pump", climate: variant === "climate", wallbox: variant === "wallbox",
                };
                switch (variant) {
                    case "photovoltaic":
                        state.results.photovoltaic = buildPhotovoltaicConfiguratorResult(state)!;
                        break;
                    case "battery_storage":
                        state.batteryStorage = { ...state.batteryStorage, annualConsumptionKwh: 4000, pvPowerKwp: 8 };
                        state.results.batteryStorage = buildBatteryStorageConfiguratorResult(state)!;
                        break;
                    case "heat_pump":
                        state.results.heatPump = buildHeatPumpConfiguratorResult(state)!;
                        break;
                    case "climate":
                        state.results.climate = buildClimateConfiguratorResult(state)!;
                        break;
                    case "wallbox":
                        state.results.wallbox = buildWallboxConfiguratorResult(state)!;
                        break;
                }
            }
            const lead = configuratorLeadPayloadSchema.parse(buildConfiguratorLeadInput(state, {
                firstName: "Erika", lastName: "Müller", email: "erika@example.test", phone: "",
                installationAtResidence: false, street: "Musterstraße 12", postalCode: "83404", city: "Ainring",
                privacyAccepted: true, website: "",
            }, Date.now()));
            // Deliberately use a saved value unlike the calculation fixture.
            lead.economics.investmentBaseEuro = 123456;
            const before = JSON.stringify(lead);
            const mail = buildConfiguratorLeadMail({ leadId: "PRIVATE-TECHNICAL-ID", lead });
            const [attachment] = mail.attachments;
            const text = attachment.data.toString("utf8");
            expect(attachment).toMatchObject({ filename: "Konfiguratoranfrage.txt", contentType: "text/plain; charset=utf-8" });
            expect(text).toContain("Müller");
            expect(text).toContain("Musterstraße 12");
            expect(text).toContain("Am Wohnort: Nein");
            expect(text).toContain("Telefon: Keine Angabe");
            expect(text).toContain("Gesamtinvestition: 123.456");
            expect(text).not.toMatch(/PRIVATE-TECHNICAL-ID|Modellversion:|<[^>]+>|\t|(?<!\r)\n|\r(?!\n)/);
            const decode = (value: string) => value.replace(/&(amp|lt|gt|quot|#039);/g, (entity) => ({ "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#039;": "'" })[entity]!);
            for (const row of mail.html.matchAll(/<tr>\s*<td><strong>(.*?)<\/strong><\/td>\s*<td>(.*?)<\/td>\s*<\/tr>/gs)) {
                if (row[1] !== "Modellversion") {
                    expect(text).toContain(`${decode(row[1])}: ${decode(row[2])}`);
                }
            }
            if (variant === "photovoltaic" || variant === "combined") {
                expect(text).toContain("Bitte prüfen.\r\n\r\nDachzugang über die Südseite.");
            }
            expect(JSON.stringify(lead)).toBe(before);
        },
    );
});

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
                    "heat_pump",
                    "climate",
                    "wallbox",
                ]);

                expect(
                    state.journey
                        .completedProducts,
                ).toEqual([
                    "photovoltaic",
                    "battery_storage",
                    "heat_pump",
                    "climate",
                    "wallbox",
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
                    "heat_pump",
                    "climate",
                    "wallbox",
                ]);

                expect(
                    input.configurators.map(
                        (configurator) =>
                            configurator.type,
                    ),
                ).toEqual([
                    "photovoltaic",
                    "battery_storage",
                    "heat_pump",
                    "climate",
                    "wallbox",
                ]);

                expect(
                    input.configurators,
                ).toHaveLength(5);

                expect(
                    configuratorLeadInputSchema.safeParse(
                        input,
                    ).success,
                ).toBe(true);
                expect(configuratorLeadInputSchema.safeParse({
                    ...input,
                    journey: { ...input.journey, entryPoint: "climate" },
                }).success).toBe(true);
                expect(configuratorLeadPayloadSchema.safeParse({
                    ...input,
                    journey: { ...input.journey, entryPoint: "climate" },
                }).success).toBe(true);
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
