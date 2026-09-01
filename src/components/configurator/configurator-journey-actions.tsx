"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import {
    configuratorProducts,
} from "@/content/configurators";
import type {
    ConfiguratorType,
} from "@/types/configurator";

interface ConfiguratorJourneyActionsProps {
    currentConfigurator: ConfiguratorType;
    nextConfigurator: ConfiguratorType | null;

    onBack: () => void;
    onContinue: () => void;

    secondaryActions?: ReactNode;
}

const NEXT_BUTTON_LABELS: Record<
    ConfiguratorType,
    string
> = {
    photovoltaic:
        "Weiter zur Photovoltaik",
    battery_storage:
        "Weiter zum Stromspeicher",
    wallbox:
        "Weiter zur Wallbox",
    heat_pump:
        "Weiter zur Wärmepumpe",
    climate:
        "Weiter zur Klimaanlage",
};

const NEXT_CONFIGURATOR_LABELS: Record<
    ConfiguratorType,
    string
> = {
    photovoltaic:
        "Photovoltaik-Konfigurator",
    battery_storage:
        "Stromspeicher-Konfigurator",
    wallbox:
        "Wallbox-Konfigurator",
    heat_pump:
        "Wärmepumpen-Konfigurator",
    climate:
        "Klimaanlagen-Konfigurator",
};

export function ConfiguratorJourneyActions({
    currentConfigurator,
    nextConfigurator,
    onBack,
    onContinue,
    secondaryActions,
}: ConfiguratorJourneyActionsProps) {
    const currentProduct =
        configuratorProducts[
        currentConfigurator
        ];

    return (
        <div className="mt-8 rounded-2xl border border-border-default bg-background p-6">
            <h2 className="text-lg font-semibold text-brand-primary">
                Wie geht es weiter?
            </h2>

            {nextConfigurator ? (
                <p className="mt-2 leading-7 text-foreground/70">
                    Deine{" "}
                    {currentProduct.title}
                    -Konfiguration ist abgeschlossen.
                    Als Nächstes geht es mit dem{" "}
                    {
                        NEXT_CONFIGURATOR_LABELS[
                        nextConfigurator
                        ]
                    }{" "}
                    weiter. Deine bisherigen Angaben
                    bleiben erhalten.
                </p>
            ) : (
                <p className="mt-2 leading-7 text-foreground/70">
                    Alle ausgewählten Konfigurationen
                    sind abgeschlossen. Im nächsten
                    Schritt ergänzt du einmal deine
                    Kontaktdaten.
                </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                    type="button"
                    onClick={onBack}
                    className="min-h-12 rounded-xl border border-border-default px-6 py-3 font-medium text-brand-primary transition hover:bg-surface"
                >
                    Angaben ändern
                </button>

                {nextConfigurator ? (
                    <Link
                        href={
                            configuratorProducts[
                                nextConfigurator
                            ].href
                        }
                        className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-primary px-6 py-3 text-center font-semibold text-white transition hover:opacity-90"
                    >
                        {
                            NEXT_BUTTON_LABELS[
                            nextConfigurator
                            ]
                        }
                    </Link>
                ) : (
                    <button
                        type="button"
                        onClick={onContinue}
                        className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-primary px-6 py-3 text-center font-semibold text-white transition hover:opacity-90"
                    >
                        Weiter zu den Kontaktdaten
                    </button>
                )}

                {secondaryActions}

                <Link
                    href="/konfigurator"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border-default px-6 py-3 text-center font-semibold text-brand-primary transition hover:bg-surface"
                >
                    Zur Übersicht
                </Link>
            </div>
        </div>
    );
}