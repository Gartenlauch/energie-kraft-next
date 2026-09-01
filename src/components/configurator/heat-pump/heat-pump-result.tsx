"use client";

import Link from "next/link";
import { ConfiguratorJourneyActions } from "@/components/configurator/configurator-journey-actions";
import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";
import { heatPumpCalculatorContent } from "@/content/pages/waermepumpen-rechner";
import type {
    ConfiguratorType,
    HeatPumpConfiguratorResult,
} from "@/types/configurator";

interface HeatPumpResultProps {
    result: HeatPumpConfiguratorResult;
    nextConfigurator:
    ConfiguratorType | null;
    onBack: () => void;
    onContinue: () => void;
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

export function HeatPumpResult({
    result,
    onBack,
    onContinue,
    nextConfigurator,
}: HeatPumpResultProps) {
    const assessment =
        heatPumpCalculatorContent
            .assessmentContent[
        result.flowTemperatureAssessment
        ];

    return (
        <section aria-labelledby="heat-pump-result-heading">
            <ConfiguratorPhaseIndicator
                currentPhase="configuration"
            />

            <p className="text-sm font-semibold tracking-widest text-brand-secondary uppercase">
                Deine erste Orientierung
            </p>

            <h1
                id="heat-pump-result-heading"
                className="mt-3 text-3xl font-semibold tracking-tight text-brand-primary sm:text-4xl"
            >
                Deine Wärmepumpen-Orientierung
            </h1>

            <div className="mt-8 rounded-2xl border border-brand-accent bg-surface p-6">
                <p className="text-sm font-medium text-brand-secondary">
                    Empfohlene Wärmepumpenleistung
                </p>

                <p className="mt-2 text-4xl font-semibold text-brand-primary">
                    {numberFormatter.format(
                        result.recommendedHeatPumpCapacityKw,
                    )}{" "}
                    kW
                </p>

                <p className="mt-3 leading-7 text-foreground/70">
                    Überschlägige Modellleistung einschließlich
                    der bestehenden Leistungsreserve. Eine
                    belastbare Heizlastberechnung kann hiervon
                    abweichen.
                </p>
            </div>

            <div className="mt-6 rounded-2xl border border-border-default p-6">
                <p className="text-sm font-semibold text-brand-secondary">
                    Einschätzung Heizsystem
                </p>

                <p className="mt-2 text-xl font-semibold text-brand-primary">
                    {assessment.label}
                </p>

                <p className="mt-2 leading-7 text-foreground/70">
                    {assessment.description}
                </p>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <article className="rounded-2xl border border-border-default p-6">
                    <p className="text-sm text-brand-secondary">
                        Jährlicher Wärmebedarf
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-brand-primary">
                        {numberFormatter.format(
                            result.totalAnnualHeatDemandKwh,
                        )}{" "}
                        kWh
                    </p>
                </article>

                <article className="rounded-2xl border border-border-default p-6">
                    <p className="text-sm text-brand-secondary">
                        Davon Raumwärme
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-brand-primary">
                        {numberFormatter.format(
                            result.spaceHeatingDemandKwh,
                        )}{" "}
                        kWh
                    </p>
                </article>

                <article className="rounded-2xl border border-border-default p-6">
                    <p className="text-sm text-brand-secondary">
                        Warmwasser
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-brand-primary">
                        {numberFormatter.format(
                            result.hotWaterDemandKwh,
                        )}{" "}
                        kWh/Jahr
                    </p>
                </article>

                <article className="rounded-2xl border border-border-default p-6">
                    <p className="text-sm text-brand-secondary">
                        Wärmepumpen-Stromverbrauch
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-brand-primary">
                        {numberFormatter.format(
                            result.annualHeatPumpElectricityConsumptionKwh,
                        )}{" "}
                        kWh/Jahr
                    </p>
                </article>

                <article className="rounded-2xl border border-border-default p-6 sm:col-span-2">
                    <p className="text-sm text-brand-secondary">
                        Modellierte Stromkosten
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-brand-primary">
                        {currencyFormatter.format(
                            result.annualHeatPumpOperatingCostEuro,
                        )}
                        /Jahr
                    </p>
                </article>

                <article className="rounded-2xl border border-border-default bg-surface p-6 sm:col-span-2">
                    <p className="text-sm text-brand-secondary">
                        Modellierter Projektkosten-Korridor
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-brand-primary">
                        {currencyFormatter.format(
                            result.estimatedMinimumCostEuro,
                        )}
                        {" – "}
                        {currencyFormatter.format(
                            result.estimatedMaximumCostEuro,
                        )}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-foreground/65">
                        Der Korridor basiert auf den bisherigen
                        Kostenannahmen des detaillierten
                        Wärmepumpen-Rechners und stellt kein
                        verbindliches Angebot dar.
                    </p>
                </article>
            </div>

            {result.technicalReviewRecommended ? (
                <div className="mt-6 rounded-2xl border border-border-default bg-surface p-6">
                    <h2 className="font-semibold text-brand-primary">
                        Technische Prüfung besonders wichtig
                    </h2>

                    <p className="mt-2 leading-7 text-foreground/70">
                        Die gewählte Vorlauftemperatur liegt
                        außerhalb unseres Niedertemperatur-
                        Modellbereichs. Heizflächen, hydraulische
                        Bedingungen und mögliche Maßnahmen am
                        Gebäude sollten vor einer Entscheidung
                        genauer geprüft werden.
                    </p>
                </div>
            ) : null}

            <ConfiguratorJourneyActions
                currentConfigurator="heat_pump"
                nextConfigurator={
                    nextConfigurator
                }
                onBack={onBack}
                onContinue={onContinue}
                secondaryActions={
                    <Link
                        href="/rechner/waermepumpe-kosten"
                        className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border-default px-6 py-3 text-center font-semibold text-brand-primary transition hover:bg-surface"
                    >
                        Detailliert berechnen
                    </Link>
                }
            />

            <p className="mt-6 text-sm leading-6 text-foreground/60">
                Diese Berechnung ist eine unverbindliche
                Modellorientierung. Sie ersetzt keine
                Heizlastberechnung, technische Vor-Ort-Prüfung
                oder verbindliche Planung.
            </p>
        </section>
    );
}