import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";
import type {
    ConfiguratorLeadPayload,
    SubmitConfiguratorLeadInput,
} from "@/types/configurator";

interface ConfiguratorSubmitReviewProps {
    input: SubmitConfiguratorLeadInput;

    isSubmitting: boolean;
    error: string | null;

    onBack: () => void;
    onSubmit: () => void;
}

interface SummaryRow {
    label: string;
    value: string;
}

interface Summary {
    type: ConfiguratorLeadPayload["type"];
    title: string;
    rows: SummaryRow[];
}

const numberFormatter =
    new Intl.NumberFormat("de-DE", {
        maximumFractionDigits: 1,
    });

const currencyFormatter =
    new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
    });

function buildSummary(
    configurator: ConfiguratorLeadPayload,
): Summary {
    switch (configurator.type) {
        case "photovoltaic":
            return {
                type: configurator.type,
                title: "Photovoltaik-Empfehlung",

                rows: [
                    {
                        label: "Anlagenklasse",
                        value:
                            `ca. ${configurator.result.recommendedPowerKwpMin}–` +
                            `${configurator.result.recommendedPowerKwpMax} kWp`,
                    },
                    {
                        label: "Jahresertrag",
                        value:
                            `ca. ${numberFormatter.format(
                                configurator.result
                                    .estimatedAnnualYieldKwhMin,
                            )}–${numberFormatter.format(
                                configurator.result
                                    .estimatedAnnualYieldKwhMax,
                            )} kWh`,
                    },
                    {
                        label: "Verbrauch",
                        value:
                            `${numberFormatter.format(
                                configurator.result
                                    .projectedAnnualConsumptionKwh,
                            )} kWh/Jahr`,
                    },
                ],
            };

        case "battery_storage":
            return {
                type: configurator.type,
                title: "Stromspeicher-Empfehlung",

                rows: [
                    {
                        label:
                            "Empfohlene Kapazität",

                        value:
                            `ca. ${numberFormatter.format(
                                configurator.result
                                    .recommendedUsableCapacityKwhMin,
                            )}–${numberFormatter.format(
                                configurator.result
                                    .recommendedUsableCapacityKwhMax,
                            )} kWh`,
                    },
                    {
                        label:
                            "Jahresverbrauch",

                        value:
                            `${numberFormatter.format(
                                configurator.result
                                    .annualConsumptionKwh,
                            )} kWh/Jahr`,
                    },
                    {
                        label:
                            "Ausgangsbasis",

                        value:
                            configurator.result.source ===
                                "photovoltaic"
                                ? "Photovoltaik-Konfiguration"
                                : "Eigenständige Konfiguration",
                    },
                ],
            };

        case "wallbox":
            return {
                type: configurator.type,
                title: "Wallbox-Empfehlung",

                rows: [
                    {
                        label: "Ladeleistung",

                        value:
                            `${numberFormatter.format(
                                configurator.answers
                                    .chargingPowerKw,
                            )} kW`,
                    },
                    {
                        label: "Fahrleistung",

                        value:
                            `${numberFormatter.format(
                                configurator.answers
                                    .annualDrivingKm,
                            )} km/Jahr`,
                    },
                    {
                        label: "Projektkosten",

                        value:
                            `${currencyFormatter.format(
                                configurator.result
                                    .estimatedMinimumCostEuro,
                            )} – ${currencyFormatter.format(
                                configurator.result
                                    .estimatedMaximumCostEuro,
                            )}`,
                    },
                ],
            };

        case "heat_pump":
            return {
                type: configurator.type,
                title: "Wärmepumpen-Empfehlung",

                rows: [
                    {
                        label:
                            "Empfohlene Leistung",

                        value:
                            `${numberFormatter.format(
                                configurator.result
                                    .recommendedHeatPumpCapacityKw,
                            )} kW`,
                    },
                    {
                        label:
                            "Wärmebedarf",

                        value:
                            `${numberFormatter.format(
                                configurator.result
                                    .totalAnnualHeatDemandKwh,
                            )} kWh/Jahr`,
                    },
                    {
                        label: "Projektkosten",

                        value:
                            `${currencyFormatter.format(
                                configurator.result
                                    .estimatedMinimumCostEuro,
                            )} – ${currencyFormatter.format(
                                configurator.result
                                    .estimatedMaximumCostEuro,
                            )}`,
                    },
                ],
            };

        case "climate":
            return {
                type: configurator.type,
                title: "Klimaanlagen-Empfehlung",

                rows: [
                    {
                        label:
                            "Empfohlene Kühlleistung",

                        value:
                            `${numberFormatter.format(
                                configurator.result
                                    .recommendedCoolingCapacityKw,
                            )} kW`,
                    },
                    {
                        label: "Innengeräte",

                        value:
                            String(
                                configurator.result
                                    .recommendedIndoorUnitCount,
                            ),
                    },
                    {
                        label: "Projektkosten",

                        value:
                            `${currencyFormatter.format(
                                configurator.result
                                    .estimatedMinimumCostEuro,
                            )} – ${currencyFormatter.format(
                                configurator.result
                                    .estimatedMaximumCostEuro,
                            )}`,
                    },
                ],
            };
    }
}

export function ConfiguratorSubmitReview({
    input,
    isSubmitting,
    error,
    onBack,
    onSubmit,
}: ConfiguratorSubmitReviewProps) {
    const summaries =
        input.configurators.map(
            buildSummary,
        );

    return (
        <>
            <ConfiguratorPhaseIndicator
                currentPhase="submit"
            />

            <section aria-labelledby="configurator-submit-heading">
                <p className="text-sm font-semibold tracking-widest text-brand-secondary uppercase">
                    Anfrage prüfen
                </p>

                <h1
                    id="configurator-submit-heading"
                    className="mt-3 text-3xl font-semibold tracking-tight text-brand-primary sm:text-4xl"
                >
                    Möchtest du dein Energieprojekt absenden?
                </h1>

                <p className="mt-4 max-w-2xl text-lg leading-8 text-foreground/70">
                    Prüfe die wichtigsten Angaben noch einmal.
                    Alle ausgewählten Konfigurationen werden
                    gemeinsam als eine Anfrage übermittelt.
                </p>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                    <article className="rounded-2xl border border-border-default p-6">
                        <h2 className="font-semibold text-brand-primary">
                            Kontaktdaten
                        </h2>

                        <dl className="mt-4 space-y-3 text-sm">
                            <div>
                                <dt className="text-foreground/60">
                                    Name
                                </dt>

                                <dd className="font-medium">
                                    {input.contact.firstName}{" "}
                                    {input.contact.lastName}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-foreground/60">
                                    E-Mail
                                </dt>

                                <dd className="font-medium">
                                    {input.contact.email}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-foreground/60">
                                    Telefon
                                </dt>

                                <dd className="font-medium">
                                    {input.contact.phone ??
                                        "Keine Angabe"}
                                </dd>
                            </div>
                        </dl>
                    </article>

                    <article className="rounded-2xl border border-border-default p-6">
                        <h2 className="font-semibold text-brand-primary">
                            Installationsort
                        </h2>

                        <p className="mt-4 leading-7 text-foreground/70">
                            {input.installation.street}
                            <br />

                            {input.installation.postalCode}{" "}
                            {input.installation.city}
                        </p>
                    </article>

                    <article className="rounded-2xl border border-brand-accent bg-surface p-6 md:col-span-2">
                        <h2 className="font-semibold text-brand-primary">
                            Dein Energieprojekt
                        </h2>

                        <p className="mt-2 leading-7 text-foreground/70">
                            {summaries
                                .map(
                                    (summary) =>
                                        summary.title.replace(
                                            "-Empfehlung",
                                            "",
                                        ),
                                )
                                .join(" · ")}
                        </p>
                    </article>

                    {summaries.map(
                        (summary) => (
                            <article
                                key={summary.type}
                                className="rounded-2xl border border-border-default bg-surface p-6 md:col-span-2"
                            >
                                <h2 className="font-semibold text-brand-primary">
                                    {summary.title}
                                </h2>

                                <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                                    {summary.rows.map(
                                        (row) => (
                                            <div
                                                key={row.label}
                                            >
                                                <dt className="text-sm text-foreground/60">
                                                    {row.label}
                                                </dt>

                                                <dd className="mt-1 font-semibold text-brand-primary">
                                                    {row.value}
                                                </dd>
                                            </div>
                                        ),
                                    )}
                                </dl>
                            </article>
                        ),
                    )}
                </div>

                {error ? (
                    <div
                        role="alert"
                        className="mt-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800"
                    >
                        {error}
                    </div>
                ) : null}

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={onBack}
                        className="min-h-12 rounded-xl border border-border-default px-6 py-3 font-medium text-brand-primary disabled:opacity-50"
                    >
                        Kontaktdaten ändern
                    </button>

                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={onSubmit}
                        className="min-h-12 rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting
                            ? "Anfrage wird gesendet …"
                            : "Energieprojekt absenden"}
                    </button>
                </div>
            </section>
        </>
    );
}