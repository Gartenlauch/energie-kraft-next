"use client";

import Link from "next/link";
import { useEffect } from "react";

import { useConfigurator } from "@/lib/configurator/configurator-context";
import { buildBatteryStoragePhotovoltaicHandoff } from "@/lib/configurator/battery-storage";

function formatKwh(value: number): string {
  return new Intl.NumberFormat("de-DE").format(value);
}

export function BatteryStorageEntry() {
  const {
    state,
    dispatch,
    isHydrated,
  } = useConfigurator();

  useEffect(() => {
    dispatch({
      type: "SET_ACTIVE_CONFIGURATOR",
      payload: "battery_storage",
    });
  }, [dispatch]);

  if (!isHydrated) {
    return (
      <div
        className="min-h-40"
        aria-live="polite"
      >
        <p className="text-sm text-foreground/60">
          Konfiguration wird geladen …
        </p>
      </div>
    );
  }

  const photovoltaicHandoff =
    buildBatteryStoragePhotovoltaicHandoff(
      state,
    );

  if (!photovoltaicHandoff) {
    return (
      <section aria-labelledby="battery-storage-heading">
        <p className="text-sm font-semibold tracking-widest text-brand-secondary uppercase">
          Stromspeicher
        </p>

        <h1
          id="battery-storage-heading"
          className="mt-3 text-3xl font-semibold tracking-tight text-brand-primary sm:text-4xl"
        >
          Stromspeicher konfigurieren
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/70 sm:text-lg">
          Du kannst einen Stromspeicher unabhängig von einer
          vorherigen Photovoltaik-Konfiguration planen.
          Wenn du bereits eine Photovoltaikanlage konfiguriert hast,
          können wir Verbrauch und Anlagengröße automatisch
          übernehmen.
        </p>

        <div className="mt-8 rounded-2xl border border-border-default bg-surface p-6">
          <h2 className="text-lg font-semibold text-brand-primary">
            Noch keine PV-Daten vorhanden
          </h2>

          <p className="mt-2 max-w-2xl leading-7 text-foreground/70">
            Für eine besonders passende Speicherempfehlung kannst du
            zuerst den Photovoltaik-Konfigurator durchlaufen.
            Alternativ wird der Speicher-Konfigurator auch ohne
            vorhandene PV-Daten nutzbar sein.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/konfigurator/photovoltaik"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-primary px-6 py-3 text-center font-semibold text-white transition hover:opacity-90"
            >
              Photovoltaik konfigurieren
            </Link>

            <Link
              href="/kontakt"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border-default px-6 py-3 text-center font-semibold text-brand-primary transition hover:bg-background"
            >
              Beratung anfragen
            </Link>
          </div>
        </div>

        <p className="mt-6 text-sm leading-6 text-foreground/60">
          Die eigentliche Speichergröße wird nicht pauschal aus der
          PV-Leistung abgeleitet. Verbrauch, Erzeugung und
          Nutzungsverhalten werden gemeinsam berücksichtigt.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="battery-storage-heading">
      <p className="text-sm font-semibold tracking-widest text-brand-secondary uppercase">
        Stromspeicher
      </p>

      <h1
        id="battery-storage-heading"
        className="mt-3 text-3xl font-semibold tracking-tight text-brand-primary sm:text-4xl"
      >
        Weiter mit deinem Stromspeicher
      </h1>

      <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/70 sm:text-lg">
        Deine Photovoltaik-Daten wurden übernommen. Du musst
        Verbrauch und Anlagenklasse deshalb nicht noch einmal
        eingeben.
      </p>

      <div className="mt-8 rounded-2xl border border-border-default bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-brand-secondary">
              Übernommen aus deiner PV-Konfiguration
            </p>

            <h2 className="mt-1 text-xl font-semibold text-brand-primary">
              Deine Ausgangsdaten
            </h2>
          </div>

          <span className="rounded-full border border-border-default bg-background px-3 py-1.5 text-xs font-semibold text-brand-primary">
            Automatisch übernommen
          </span>
        </div>

        <dl className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-border-default bg-background p-5">
            <dt className="text-sm text-foreground/60">
              Prognostizierter Stromverbrauch
            </dt>

            <dd className="mt-2 text-xl font-semibold text-brand-primary">
              {formatKwh(
                photovoltaicHandoff.projectedAnnualConsumptionKwh,
              )}{" "}
              kWh/Jahr
            </dd>
          </div>

          <div className="rounded-xl border border-border-default bg-background p-5">
            <dt className="text-sm text-foreground/60">
              Empfohlene PV-Anlagenklasse
            </dt>

            <dd className="mt-2 text-xl font-semibold text-brand-primary">
              ca.{" "}
              {photovoltaicHandoff.recommendedPvPowerKwpMin}–
              {photovoltaicHandoff.recommendedPvPowerKwpMax} kWp
            </dd>
          </div>

          <div className="rounded-xl border border-border-default bg-background p-5 sm:col-span-2">
            <dt className="text-sm text-foreground/60">
              Geschätzter PV-Jahresertrag
            </dt>

            <dd className="mt-2 text-xl font-semibold text-brand-primary">
              ca.{" "}
              {formatKwh(
                photovoltaicHandoff.estimatedAnnualPvYieldKwhMin,
              )}
              –
              {formatKwh(
                photovoltaicHandoff.estimatedAnnualPvYieldKwhMax,
              )}{" "}
              kWh/Jahr
            </dd>
          </div>
        </dl>

        {photovoltaicHandoff.batteryStorageRequested ? (
          <div className="mt-5 rounded-xl border border-border-default bg-background p-4">
            <p className="font-medium text-brand-primary">
              Stromspeicher wurde in deiner PV-Konfiguration bereits
              berücksichtigt.
            </p>
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-border-default bg-background p-4">
            <p className="font-medium text-brand-primary">
              Du hast den Speicher ursprünglich nicht ausgewählt.
              Deine PV-Daten können trotzdem für die Speicherplanung
              verwendet werden.
            </p>
          </div>
        )}

        {photovoltaicHandoff.technicalReviewRecommended ? (
          <div className="mt-5 rounded-xl border border-border-default bg-background p-4">
            <p className="font-medium text-brand-primary">
              Bei der PV-Konfiguration wurde eine zusätzliche
              technische Prüfung empfohlen. Dieser Hinweis bleibt
              auch bei der Speicherplanung erhalten.
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-8 rounded-2xl border border-border-default p-6">
        <h2 className="text-lg font-semibold text-brand-primary">
          Nächster Schritt
        </h2>

        <p className="mt-2 max-w-2xl leading-7 text-foreground/70">
          Auf dieser Grundlage bestimmen wir als Nächstes die
          passende Speicherklasse. Dabei berücksichtigen wir nicht
          nur die PV-Leistung, sondern insbesondere deinen
          prognostizierten Stromverbrauch.
        </p>

        <p className="mt-4 text-sm text-foreground/60">
          Die konkrete Speicherabfrage wird im nächsten
          Umsetzungsschritt ergänzt.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/konfigurator/photovoltaik"
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border-default px-6 py-3 text-center font-semibold text-brand-primary transition hover:bg-surface"
        >
          PV-Angaben ändern
        </Link>

        <Link
          href="/kontakt"
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-primary px-6 py-3 text-center font-semibold text-white transition hover:opacity-90"
        >
          Beratung anfragen
        </Link>
      </div>
    </section>
  );
}