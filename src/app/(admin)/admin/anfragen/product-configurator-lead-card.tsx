import {
    ConfiguratorLeadCardShell,
} from "./configurator-lead-card-shell";

import type {
    BatteryStorageConfiguratorLead,
    ClimateConfiguratorLead,
    HeatPumpConfiguratorLead,
    WallboxConfiguratorLead,
} from "@/types/configurator";

const numberFormatter =
    new Intl.NumberFormat("de-DE", {
        maximumFractionDigits: 2,
    });

const currencyFormatter =
    new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
    });

function formatNumber(
    value: number,
): string {
    return numberFormatter.format(
        value,
    );
}

function formatCurrency(
    value: number,
): string {
    return currencyFormatter.format(
        value,
    );
}

const BATTERY_PATTERN_LABELS = {
    mostly_daytime:
        "Überwiegend tagsüber",
    mixed:
        "Gemischt",
    mostly_evening:
        "Überwiegend abends",
} as const;

const BATTERY_BACKUP_LABELS = {
    none:
        "Keine Ersatzstromfunktion",
    selected_loads:
        "Ausgewählte Verbraucher",
    whole_home:
        "Gesamtes Gebäude",
} as const;

const BATTERY_GOAL_LABELS = {
    economic:
        "Wirtschaftlichkeit",
    balanced:
        "Ausgewogen",
    high_autonomy:
        "Hohe Autarkie",
} as const;

const CLIMATE_INSULATION_LABELS = {
    good: "Gut",
    average: "Durchschnittlich",
    weak: "Eher schwach",
} as const;

const CLIMATE_SOLAR_LABELS = {
    low: "Gering",
    medium: "Mittel",
    high: "Hoch",
} as const;

const CLIMATE_SYSTEM_LABELS = {
    singleSplit:
        "Single-Split-System",
    multiSplit:
        "Multi-Split-System",
    projectPlanning:
        "Individuelle Mehrzonenplanung",
} as const;

const HEAT_PUMP_ASSESSMENT_LABELS = {
    ntReady:
        "Niedertemperatur-ready",
    individualReview:
        "Individuelle Prüfung erforderlich",
} as const;

interface DetailRowProps {
    label: string;
    value: string;
}

function DetailRow({
    label,
    value,
}: DetailRowProps) {
    return (
        <div>
            <dt className="text-slate-500">
                {label}
            </dt>

            <dd className="font-medium text-slate-900">
                {value}
            </dd>
        </div>
    );
}

export function BatteryStorageConfiguratorLeadCard({
    lead,
}: {
    lead: BatteryStorageConfiguratorLead;
}) {
    const answers =
        lead.configurator.answers;

    const result =
        lead.configurator.result;

    return (
        <ConfiguratorLeadCardShell
            lead={lead}
            badge="Stromspeicher-Konfigurator"
        >
            <section>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Stromspeicher-Konfiguration
                </h3>

                <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                    <DetailRow
                        label="Jahresverbrauch"
                        value={`${formatNumber(
                            result.annualConsumptionKwh,
                        )} kWh/Jahr`}
                    />

                    <DetailRow
                        label="PV-Leistung"
                        value={
                            result.pvPowerKwpMin ===
                                result.pvPowerKwpMax
                                ? `${formatNumber(
                                    result.pvPowerKwpMin,
                                )} kWp`
                                : `${formatNumber(
                                    result.pvPowerKwpMin,
                                )}–${formatNumber(
                                    result.pvPowerKwpMax,
                                )} kWp`
                        }
                    />

                    <DetailRow
                        label="Verbrauchsprofil"
                        value={
                            BATTERY_PATTERN_LABELS[
                            answers.consumptionPattern
                            ]
                        }
                    />

                    <DetailRow
                        label="Ersatzstrom"
                        value={
                            BATTERY_BACKUP_LABELS[
                            answers.backupPreference
                            ]
                        }
                    />

                    <DetailRow
                        label="Ziel"
                        value={
                            BATTERY_GOAL_LABELS[
                            answers.goal
                            ]
                        }
                    />

                    <DetailRow
                        label="Empfohlene Kapazität"
                        value={`${formatNumber(
                            result.recommendedUsableCapacityKwhMin,
                        )}–${formatNumber(
                            result.recommendedUsableCapacityKwhMax,
                        )} kWh`}
                    />

                    <DetailRow
                        label="Technische Prüfung"
                        value={
                            result.technicalReviewRecommended
                                ? "Empfohlen"
                                : "Standardprüfung"
                        }
                    />
                </dl>
            </section>
        </ConfiguratorLeadCardShell>
    );
}

export function WallboxConfiguratorLeadCard({
    lead,
}: {
    lead: WallboxConfiguratorLead;
}) {
    const answers =
        lead.configurator.answers;

    const result =
        lead.configurator.result;

    return (
        <ConfiguratorLeadCardShell
            lead={lead}
            badge="Wallbox-Konfigurator"
        >
            <section>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Wallbox-Konfiguration
                </h3>

                <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                    <DetailRow
                        label="Fahrleistung"
                        value={`${formatNumber(
                            answers.annualDrivingKm,
                        )} km/Jahr`}
                    />

                    <DetailRow
                        label="Fahrzeugverbrauch"
                        value={`${formatNumber(
                            answers.vehicleConsumptionKwhPer100Km,
                        )} kWh/100 km`}
                    />

                    <DetailRow
                        label="Batteriekapazität"
                        value={`${formatNumber(
                            answers.batteryCapacityKwh,
                        )} kWh`}
                    />

                    <DetailRow
                        label="Laden zu Hause"
                        value={`${formatNumber(
                            answers.homeChargingSharePercent,
                        )} %`}
                    />

                    <DetailRow
                        label="Ladeleistung"
                        value={`${formatNumber(
                            answers.chargingPowerKw,
                        )} kW`}
                    />

                    <DetailRow
                        label="PV-Ladeanteil"
                        value={`${formatNumber(
                            answers.pvChargingSharePercent,
                        )} %`}
                    />

                    <DetailRow
                        label="Typische Ladedauer"
                        value={`${formatNumber(
                            result.typicalChargingTimeHours,
                        )} Stunden`}
                    />

                    <DetailRow
                        label="Projektkosten"
                        value={`${formatCurrency(
                            result.estimatedMinimumCostEuro,
                        )} – ${formatCurrency(
                            result.estimatedMaximumCostEuro,
                        )}`}
                    />

                    <DetailRow
                        label="Technische Prüfung"
                        value={
                            result.technicalReviewRecommended
                                ? "Besonders empfohlen"
                                : "Standardprüfung"
                        }
                    />
                </dl>
            </section>
        </ConfiguratorLeadCardShell>
    );
}

export function HeatPumpConfiguratorLeadCard({
    lead,
}: {
    lead: HeatPumpConfiguratorLead;
}) {
    const answers =
        lead.configurator.answers;

    const result =
        lead.configurator.result;

    return (
        <ConfiguratorLeadCardShell
            lead={lead}
            badge="Wärmepumpen-Konfigurator"
        >
            <section>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Wärmepumpen-Konfiguration
                </h3>

                <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                    <DetailRow
                        label="Beheizte Fläche"
                        value={`${formatNumber(
                            answers.heatedAreaM2,
                        )} m²`}
                    />

                    <DetailRow
                        label="Spezifischer Wärmebedarf"
                        value={`${formatNumber(
                            answers.specificSpaceHeatingDemandKwhPerM2Year,
                        )} kWh/m²/Jahr`}
                    />

                    <DetailRow
                        label="Personen"
                        value={String(
                            answers.occupancyPersons,
                        )}
                    />

                    <DetailRow
                        label="Vorlauftemperatur"
                        value={`${formatNumber(
                            answers.requiredFlowTemperatureC,
                        )} °C`}
                    />

                    <DetailRow
                        label="Jahresarbeitszahl"
                        value={formatNumber(
                            answers.annualPerformanceFactor,
                        )}
                    />

                    <DetailRow
                        label="Empfohlene Leistung"
                        value={`${formatNumber(
                            result.recommendedHeatPumpCapacityKw,
                        )} kW`}
                    />

                    <DetailRow
                        label="Jährlicher Wärmebedarf"
                        value={`${formatNumber(
                            result.totalAnnualHeatDemandKwh,
                        )} kWh`}
                    />

                    <DetailRow
                        label="Heizsystem"
                        value={
                            HEAT_PUMP_ASSESSMENT_LABELS[
                            result.flowTemperatureAssessment
                            ]
                        }
                    />

                    <DetailRow
                        label="Projektkosten"
                        value={`${formatCurrency(
                            result.estimatedMinimumCostEuro,
                        )} – ${formatCurrency(
                            result.estimatedMaximumCostEuro,
                        )}`}
                    />
                </dl>
            </section>
        </ConfiguratorLeadCardShell>
    );
}

export function ClimateConfiguratorLeadCard({
    lead,
}: {
    lead: ClimateConfiguratorLead;
}) {
    const answers =
        lead.configurator.answers;

    const result =
        lead.configurator.result;

    return (
        <ConfiguratorLeadCardShell
            lead={lead}
            badge="Klimaanlagen-Konfigurator"
        >
            <section>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Klimaanlagen-Konfiguration
                </h3>

                <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                    <DetailRow
                        label="Zu klimatisierende Fläche"
                        value={`${formatNumber(
                            answers.conditionedAreaM2,
                        )} m²`}
                    />

                    <DetailRow
                        label="Räume / Zonen"
                        value={String(
                            answers.roomCount,
                        )}
                    />

                    <DetailRow
                        label="Gebäudezustand"
                        value={
                            CLIMATE_INSULATION_LABELS[
                            answers.insulationLevel
                            ]
                        }
                    />

                    <DetailRow
                        label="Sonneneinstrahlung"
                        value={
                            CLIMATE_SOLAR_LABELS[
                            answers.solarLoad
                            ]
                        }
                    />

                    <DetailRow
                        label="Personen"
                        value={String(
                            answers.occupancyPersons,
                        )}
                    />

                    <DetailRow
                        label="Empfohlene Kühlleistung"
                        value={`${formatNumber(
                            result.recommendedCoolingCapacityKw,
                        )} kW`}
                    />

                    <DetailRow
                        label="Innengeräte"
                        value={String(
                            result.recommendedIndoorUnitCount,
                        )}
                    />

                    <DetailRow
                        label="System"
                        value={
                            CLIMATE_SYSTEM_LABELS[
                            result.systemRecommendation
                            ]
                        }
                    />

                    <DetailRow
                        label="Projektkosten"
                        value={`${formatCurrency(
                            result.estimatedMinimumCostEuro,
                        )} – ${formatCurrency(
                            result.estimatedMaximumCostEuro,
                        )}`}
                    />
                </dl>
            </section>
        </ConfiguratorLeadCardShell>
    );
}