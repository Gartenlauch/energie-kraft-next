import {
    formatLeadDate,
    getStatusClassName,
    LeadWorkflowPanel,
    STATUS_LABELS,
} from "./lead-admin-shared";

import type {
    ConfiguratorLead,
    ConfiguratorLeadType,
    StoredConfiguratorLeadPayload,
} from "@/types/configurator";

interface ConfiguratorLeadCardProps {
    lead: ConfiguratorLead;
}

const PRODUCT_LABELS: Record<
    ConfiguratorLeadType,
    string
> = {
    photovoltaic:
        "Photovoltaik",

    battery_storage:
        "Stromspeicher",

    wallbox:
        "Wallbox",

    heat_pump:
        "Wärmepumpe",

    climate:
        "Klimaanlage",
};

const PERSON_LABELS:
    Record<string, string> = {
    "1": "1 Person",
    "2": "2 Personen",
    "3": "3 Personen",
    "4_5": "4–5 Personen",
};

const BUILDING_LABELS:
    Record<string, string> = {
    detached_house:
        "Freistehendes Einfamilienhaus",

    semi_detached_house:
        "Doppelhaushälfte",

    mid_terrace_house:
        "Reihenmittelhaus",

    end_terrace_house:
        "Reihenendhaus",

    multi_family_house:
        "Mehrfamilienhaus",
};

const MATERIAL_LABELS:
    Record<string, string> = {
    roof_tile:
        "Dachziegel",

    beaver_tail:
        "Biberschwanz",

    slate:
        "Schiefer",

    metal:
        "Blech",

    roofing_felt:
        "Dachpappe",

    gravel:
        "Kiesdach",

    plastic:
        "Kunststoff",

    other:
        "Sonstiges",

    unknown:
        "Weiß ich nicht",
};

const ORIENTATION_LABELS:
    Record<string, string> = {
    south:
        "Süd",

    south_east_south_west:
        "Südost / Südwest",

    east_west:
        "Ost-West",

    north:
        "Nordorientiert",
};

const RENOVATION_LABELS:
    Record<string, string> = {
    new_build:
        "Neubau",

    after_1990:
        "Nach 1990",

    before_1990:
        "Vor 1990",

    before_1960:
        "Vor 1960",

    unknown:
        "Weiß ich nicht",
};

const BATTERY_PATTERN_LABELS:
    Record<string, string> = {
    mostly_daytime:
        "Überwiegend tagsüber",

    mixed:
        "Gemischt",

    mostly_evening:
        "Überwiegend abends",
};

const BATTERY_BACKUP_LABELS:
    Record<string, string> = {
    none:
        "Keine Ersatzstromfunktion",

    selected_loads:
        "Ausgewählte Verbraucher",

    whole_home:
        "Gesamtes Gebäude",
};

const BATTERY_GOAL_LABELS:
    Record<string, string> = {
    economic:
        "Wirtschaftlichkeit",

    balanced:
        "Ausgewogen",

    high_autonomy:
        "Hohe Autarkie",
};

const CLIMATE_INSULATION_LABELS:
    Record<string, string> = {
    good:
        "Gut",

    average:
        "Durchschnittlich",

    weak:
        "Eher schwach",
};

const CLIMATE_SOLAR_LABELS:
    Record<string, string> = {
    low:
        "Gering",

    medium:
        "Mittel",

    high:
        "Hoch",
};

const CLIMATE_SYSTEM_LABELS:
    Record<string, string> = {
    singleSplit:
        "Single-Split-System",

    multiSplit:
        "Multi-Split-System",

    projectPlanning:
        "Individuelle Mehrzonenplanung",
};

const HEAT_PUMP_ASSESSMENT_LABELS:
    Record<string, string> = {
    ntReady:
        "Niedertemperatur-ready",

    individualReview:
        "Individuelle Prüfung erforderlich",
};

const numberFormatter =
    new Intl.NumberFormat(
        "de-DE",
        {
            maximumFractionDigits: 2,
        },
    );

const currencyFormatter =
    new Intl.NumberFormat(
        "de-DE",
        {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
        },
    );

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

function ProductSection({
    configurator,
}: {
    configurator:
    StoredConfiguratorLeadPayload;
}) {
    switch (configurator.type) {
        case "photovoltaic": {
            const answers =
                configurator.answers;

            const result =
                configurator.result;

            const interests = [
                answers.interests
                    .batteryStorage
                    ? "Stromspeicher"
                    : null,

                answers.interests
                    .wallbox
                    ? "Wallbox"
                    : null,

                answers.interests
                    .heatPump
                    ? "Wärmepumpe"
                    : null,

                answers.interests
                    .climate
                    ? "Klimaanlage"
                    : null,
            ]
                .filter(
                    (
                        value,
                    ): value is string =>
                        value !== null,
                )
                .join(", ");

            return (
                <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="font-semibold text-slate-950">
                        Photovoltaik
                    </h3>

                    <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                        <DetailRow
                            label="Haushalt"
                            value={
                                PERSON_LABELS[
                                String(
                                    answers
                                        .household
                                        .persons,
                                )
                                ] ??
                                String(
                                    answers
                                        .household
                                        .persons,
                                )
                            }
                        />

                        <DetailRow
                            label="Gebäude"
                            value={
                                BUILDING_LABELS[
                                answers
                                    .building
                                    .type
                                ] ??
                                answers
                                    .building
                                    .type
                            }
                        />

                        <DetailRow
                            label="Aktueller Verbrauch"
                            value={`${formatNumber(
                                answers
                                    .household
                                    .annualConsumptionKwh,
                            )} kWh/Jahr`}
                        />

                        <DetailRow
                            label="Prognostizierter Verbrauch"
                            value={`${formatNumber(
                                answers
                                    .household
                                    .projectedConsumptionKwh ??
                                result
                                    .projectedAnnualConsumptionKwh,
                            )} kWh/Jahr`}
                        />

                        <DetailRow
                            label="Dachneigung"
                            value={`${answers.roof.pitch}°`}
                        />

                        <DetailRow
                            label="Dachmaterial"
                            value={
                                MATERIAL_LABELS[
                                answers
                                    .roof
                                    .material
                                ] ??
                                answers
                                    .roof
                                    .material
                            }
                        />

                        <DetailRow
                            label="Dachausrichtung"
                            value={
                                ORIENTATION_LABELS[
                                answers
                                    .roof
                                    .orientation
                                ] ??
                                answers
                                    .roof
                                    .orientation
                            }
                        />

                        <DetailRow
                            label="Dachalter / Sanierung"
                            value={
                                RENOVATION_LABELS[
                                answers
                                    .roof
                                    .renovationPeriod
                                ] ??
                                answers
                                    .roof
                                    .renovationPeriod
                            }
                        />

                        <DetailRow
                            label="Weitere Energielösungen"
                            value={
                                interests ||
                                "Keine"
                            }
                        />

                        <DetailRow
                            label="Empfohlene Anlagenklasse"
                            value={`ca. ${result.recommendedPowerKwpMin}–${result.recommendedPowerKwpMax} kWp`}
                        />

                        <DetailRow
                            label="Geschätzter Jahresertrag"
                            value={`ca. ${formatNumber(
                                result
                                    .estimatedAnnualYieldKwhMin,
                            )}–${formatNumber(
                                result
                                    .estimatedAnnualYieldKwhMax,
                            )} kWh`}
                        />

                        <DetailRow
                            label="Technische Prüfung"
                            value={
                                result
                                    .technicalReviewRecommended
                                    ? "Besonders empfohlen"
                                    : "Standardprüfung"
                            }
                        />
                    </dl>

                    {answers.notes
                        .hasNotes ? (
                        <div className="mt-5 border-t border-slate-200 pt-4">
                            <p className="text-sm text-slate-500">
                                Anmerkungen
                            </p>

                            <p className="mt-1 whitespace-pre-wrap text-sm font-medium text-slate-900">
                                {answers.notes.text ??
                                    "Keine Angabe"}
                            </p>
                        </div>
                    ) : null}
                </section>
            );
        }

        case "battery_storage": {
            const answers =
                configurator.answers;

            const result =
                configurator.result;

            return (
                <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="font-semibold text-slate-950">
                        Stromspeicher
                    </h3>

                    <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                        <DetailRow
                            label="Jahresverbrauch"
                            value={`${formatNumber(
                                result
                                    .annualConsumptionKwh,
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
                                answers
                                    .consumptionPattern
                                ] ??
                                answers
                                    .consumptionPattern
                            }
                        />

                        <DetailRow
                            label="Ersatzstrom"
                            value={
                                BATTERY_BACKUP_LABELS[
                                answers
                                    .backupPreference
                                ] ??
                                answers
                                    .backupPreference
                            }
                        />

                        <DetailRow
                            label="Ziel"
                            value={
                                BATTERY_GOAL_LABELS[
                                answers.goal
                                ] ??
                                answers.goal
                            }
                        />

                        <DetailRow
                            label="Empfohlene Kapazität"
                            value={`${formatNumber(
                                result
                                    .recommendedUsableCapacityKwhMin,
                            )}–${formatNumber(
                                result
                                    .recommendedUsableCapacityKwhMax,
                            )} kWh`}
                        />

                        <DetailRow
                            label="Technische Prüfung"
                            value={
                                result
                                    .technicalReviewRecommended
                                    ? "Empfohlen"
                                    : "Standardprüfung"
                            }
                        />
                    </dl>
                </section>
            );
        }

        case "wallbox": {
            const answers =
                configurator.answers;

            const result =
                configurator.result;

            return (
                <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="font-semibold text-slate-950">
                        Wallbox
                    </h3>

                    <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                        <DetailRow
                            label="Fahrleistung"
                            value={`${formatNumber(
                                answers
                                    .annualDrivingKm,
                            )} km/Jahr`}
                        />

                        <DetailRow
                            label="Fahrzeugverbrauch"
                            value={`${formatNumber(
                                answers
                                    .vehicleConsumptionKwhPer100Km,
                            )} kWh/100 km`}
                        />

                        <DetailRow
                            label="Batteriekapazität"
                            value={`${formatNumber(
                                answers
                                    .batteryCapacityKwh,
                            )} kWh`}
                        />

                        <DetailRow
                            label="Laden zu Hause"
                            value={`${formatNumber(
                                answers
                                    .homeChargingSharePercent,
                            )} %`}
                        />

                        <DetailRow
                            label="Ladeleistung"
                            value={`${formatNumber(
                                answers
                                    .chargingPowerKw,
                            )} kW`}
                        />

                        <DetailRow
                            label="PV-Ladeanteil"
                            value={`${formatNumber(
                                answers
                                    .pvChargingSharePercent,
                            )} %`}
                        />

                        <DetailRow
                            label="Typische Ladedauer"
                            value={`${formatNumber(
                                result
                                    .typicalChargingTimeHours,
                            )} Stunden`}
                        />

                        <DetailRow
                            label="Projektkosten"
                            value={`${formatCurrency(
                                result
                                    .estimatedMinimumCostEuro,
                            )} – ${formatCurrency(
                                result
                                    .estimatedMaximumCostEuro,
                            )}`}
                        />

                        <DetailRow
                            label="Technische Prüfung"
                            value={
                                result
                                    .technicalReviewRecommended
                                    ? "Besonders empfohlen"
                                    : "Standardprüfung"
                            }
                        />
                    </dl>
                </section>
            );
        }

        case "heat_pump": {
            const answers =
                configurator.answers;

            const result =
                configurator.result;

            return (
                <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="font-semibold text-slate-950">
                        Wärmepumpe
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
                                answers
                                    .specificSpaceHeatingDemandKwhPerM2Year,
                            )} kWh/m²/Jahr`}
                        />

                        <DetailRow
                            label="Personen"
                            value={String(
                                answers
                                    .occupancyPersons,
                            )}
                        />

                        <DetailRow
                            label="Vorlauftemperatur"
                            value={`${formatNumber(
                                answers
                                    .requiredFlowTemperatureC,
                            )} °C`}
                        />

                        <DetailRow
                            label="Jahresarbeitszahl"
                            value={formatNumber(
                                answers
                                    .annualPerformanceFactor,
                            )}
                        />

                        <DetailRow
                            label="Empfohlene Leistung"
                            value={`${formatNumber(
                                result
                                    .recommendedHeatPumpCapacityKw,
                            )} kW`}
                        />

                        <DetailRow
                            label="Jährlicher Wärmebedarf"
                            value={`${formatNumber(
                                result
                                    .totalAnnualHeatDemandKwh,
                            )} kWh`}
                        />

                        <DetailRow
                            label="Heizsystem"
                            value={
                                HEAT_PUMP_ASSESSMENT_LABELS[
                                result
                                    .flowTemperatureAssessment
                                ] ??
                                result
                                    .flowTemperatureAssessment
                            }
                        />

                        <DetailRow
                            label="Projektkosten"
                            value={`${formatCurrency(
                                result
                                    .estimatedMinimumCostEuro,
                            )} – ${formatCurrency(
                                result
                                    .estimatedMaximumCostEuro,
                            )}`}
                        />
                    </dl>
                </section>
            );
        }

        case "climate": {
            const answers =
                configurator.answers;

            const result =
                configurator.result;

            return (
                <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="font-semibold text-slate-950">
                        Klimaanlage
                    </h3>

                    <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                        <DetailRow
                            label="Zu klimatisierende Fläche"
                            value={`${formatNumber(
                                answers
                                    .conditionedAreaM2,
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
                                answers
                                    .insulationLevel
                                ] ??
                                answers
                                    .insulationLevel
                            }
                        />

                        <DetailRow
                            label="Sonneneinstrahlung"
                            value={
                                CLIMATE_SOLAR_LABELS[
                                answers.solarLoad
                                ] ??
                                answers.solarLoad
                            }
                        />

                        <DetailRow
                            label="Personen"
                            value={String(
                                answers
                                    .occupancyPersons,
                            )}
                        />

                        <DetailRow
                            label="Empfohlene Kühlleistung"
                            value={`${formatNumber(
                                result
                                    .recommendedCoolingCapacityKw,
                            )} kW`}
                        />

                        <DetailRow
                            label="Innengeräte"
                            value={String(
                                result
                                    .recommendedIndoorUnitCount,
                            )}
                        />

                        <DetailRow
                            label="System"
                            value={
                                CLIMATE_SYSTEM_LABELS[
                                result
                                    .systemRecommendation
                                ] ??
                                result
                                    .systemRecommendation
                            }
                        />

                        <DetailRow
                            label="Projektkosten"
                            value={`${formatCurrency(
                                result
                                    .estimatedMinimumCostEuro,
                            )} – ${formatCurrency(
                                result
                                    .estimatedMaximumCostEuro,
                            )}`}
                        />
                    </dl>
                </section>
            );
        }
    }
}

export function ConfiguratorLeadCard({
    lead,
}: ConfiguratorLeadCardProps) {
    return (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-5">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-xl font-semibold text-slate-950">
                                {lead.contact.firstName}{" "}
                                {lead.contact.lastName}
                            </h2>

                            <span
                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClassName(
                                    lead.status,
                                )}`}
                            >
                                {
                                    STATUS_LABELS[
                                    lead.status
                                    ]
                                }
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                            Eingegangen:{" "}
                            {formatLeadDate(
                                lead,
                            )}
                        </p>

                        <p className="mt-1 font-mono text-xs text-slate-400">
                            {lead.id}
                        </p>
                    </div>

                    <div className="flex max-w-xl flex-wrap justify-end gap-2">
                        {lead.products.map(
                            (product) => (
                                <span
                                    key={product}
                                    className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800"
                                >
                                    {
                                        PRODUCT_LABELS[
                                        product
                                        ]
                                    }
                                </span>
                            ),
                        )}
                    </div>
                </div>
            </div>

            <div className="grid gap-8 p-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.75fr)]">
                <div className="space-y-7">
                    <section>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                            Kontaktdaten
                        </h3>

                        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                            <DetailRow
                                label="Name"
                                value={`${lead.contact.firstName} ${lead.contact.lastName}`}
                            />

                            <div>
                                <dt className="text-slate-500">
                                    E-Mail
                                </dt>

                                <dd>
                                    <a
                                        href={`mailto:${lead.contact.email}`}
                                        className="font-medium text-emerald-800 hover:underline"
                                    >
                                        {
                                            lead.contact
                                                .email
                                        }
                                    </a>
                                </dd>
                            </div>

                            <div>
                                <dt className="text-slate-500">
                                    Telefon
                                </dt>

                                <dd>
                                    {lead.contact.phone ? (
                                        <a
                                            href={`tel:${lead.contact.phone}`}
                                            className="font-medium text-emerald-800 hover:underline"
                                        >
                                            {
                                                lead.contact
                                                    .phone
                                            }
                                        </a>
                                    ) : (
                                        <span className="font-medium text-slate-500">
                                            Keine Angabe
                                        </span>
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                            Installationsort
                        </h3>

                        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                            <DetailRow
                                label="Am Wohnort"
                                value={
                                    lead.installation
                                        .atResidence
                                        ? "Ja"
                                        : "Nein"
                                }
                            />

                            <DetailRow
                                label="Adresse"
                                value={`${lead.installation.street}, ${lead.installation.postalCode} ${lead.installation.city}`}
                            />
                        </dl>
                    </section>

                    <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                        <h3 className="font-semibold text-emerald-950">
                            Energieprojekt
                        </h3>

                        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                            <DetailRow
                                label="Einstieg"
                                value={
                                    PRODUCT_LABELS[
                                    lead.journey
                                        .entryPoint
                                    ]
                                }
                            />

                            <DetailRow
                                label="Produkte"
                                value={lead.products
                                    .map(
                                        (product) =>
                                            PRODUCT_LABELS[
                                            product
                                            ],
                                    )
                                    .join(", ")}
                            />

                            <DetailRow
                                label="Konfiguratoren abgeschlossen"
                                value={`${lead.journey.completedProducts.length} von ${lead.journey.selectedProducts.length}`}
                            />

                            <DetailRow
                                label="Schema"
                                value={`Version ${lead.meta.schemaVersion}`}
                            />
                        </dl>
                    </section>

                    <div className="space-y-5">
                        {lead.configurators.map(
                            (configurator) => (
                                <ProductSection
                                    key={
                                        configurator.type
                                    }
                                    configurator={
                                        configurator
                                    }
                                />
                            ),
                        )}
                    </div>
                </div>

                <div className="space-y-7">
                    <LeadWorkflowPanel
                        lead={lead}
                    />

                    <section className="rounded-xl border border-slate-200 p-5">
                        <h3 className="font-semibold text-slate-950">
                            Technische Informationen
                        </h3>

                        <dl className="mt-4 space-y-3 text-sm">
                            <DetailRow
                                label="Quelle"
                                value={
                                    lead.meta.source
                                }
                            />

                            <DetailRow
                                label="Datenschutz"
                                value={
                                    lead.consent
                                        .privacyAccepted
                                        ? "Bestätigt"
                                        : "Nicht bestätigt"
                                }
                            />
                        </dl>
                    </section>
                </div>
            </div>
        </article>
    );
}