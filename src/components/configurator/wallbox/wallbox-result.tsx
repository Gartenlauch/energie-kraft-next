"use client";

import Link from "next/link";

import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";
import { wallboxCalculatorContent } from "@/content/pages/wallbox-rechner";
import type {
  WallboxConfiguratorResult,
} from "@/types/configurator";

interface WallboxResultProps {
  result: WallboxConfiguratorResult;
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

function formatChargingDuration(
  hours: number,
): string {
  const totalMinutes = Math.round(
    hours * 60,
  );

  const fullHours = Math.floor(
    totalMinutes / 60,
  );

  const minutes = totalMinutes % 60;

  if (fullHours === 0) {
    return `${minutes} Min.`;
  }

  if (minutes === 0) {
    return `${fullHours} Std.`;
  }

  return `${fullHours} Std. ${minutes} Min.`;
}

export function WallboxResult({
  result,
  onBack,
  onContinue,
}: WallboxResultProps) {
  const recommendation =
    wallboxCalculatorContent
      .recommendationContent[
    result.systemRecommendation
    ];

  return (
    <section aria-labelledby="wallbox-result-heading">
      <ConfiguratorPhaseIndicator
        currentPhase="configuration"
      />

      <p className="text-sm font-semibold tracking-widest text-brand-secondary uppercase">
        Deine erste Orientierung
      </p>

      <h1
        id="wallbox-result-heading"
        className="mt-3 text-3xl font-semibold tracking-tight text-brand-primary sm:text-4xl"
      >
        Deine Wallbox-Empfehlung
      </h1>

      <div className="mt-8 rounded-2xl border border-brand-accent bg-surface p-6">
        <p className="text-sm font-medium text-brand-secondary">
          Empfohlene Einordnung
        </p>

        <p className="mt-2 text-2xl font-semibold text-brand-primary">
          {recommendation.label}
        </p>

        <p className="mt-3 leading-7 text-foreground/70">
          {recommendation.description}
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <article className="rounded-2xl border border-border-default p-6">
          <p className="text-sm text-brand-secondary">
            Typische Ladedauer
          </p>

          <p className="mt-2 text-2xl font-semibold text-brand-primary">
            {formatChargingDuration(
              result.typicalChargingTimeHours,
            )}
          </p>
        </article>

        <article className="rounded-2xl border border-border-default p-6">
          <p className="text-sm text-brand-secondary">
            Jährlicher Fahrstrombedarf
          </p>

          <p className="mt-2 text-2xl font-semibold text-brand-primary">
            {numberFormatter.format(
              result.annualVehicleEnergyDemandKwh,
            )}{" "}
            kWh
          </p>
        </article>

        <article className="rounded-2xl border border-border-default p-6">
          <p className="text-sm text-brand-secondary">
            Heimladeenergie
          </p>

          <p className="mt-2 text-2xl font-semibold text-brand-primary">
            {numberFormatter.format(
              result.annualHomeChargingInputEnergyKwh,
            )}{" "}
            kWh/Jahr
          </p>
        </article>

        <article className="rounded-2xl border border-border-default p-6">
          <p className="text-sm text-brand-secondary">
            Modellierte Heimladekosten
          </p>

          <p className="mt-2 text-2xl font-semibold text-brand-primary">
            {currencyFormatter.format(
              result.monthlyHomeChargingCostEuro,
            )}
            /Monat
          </p>
        </article>

        <article className="rounded-2xl border border-border-default p-6">
          <p className="text-sm text-brand-secondary">
            Laden mit PV-Strom
          </p>

          <p className="mt-2 text-xl font-semibold text-brand-primary">
            {numberFormatter.format(
              result.annualPvChargingEnergyKwh,
            )}{" "}
            kWh/Jahr
          </p>
        </article>

        <article className="rounded-2xl border border-border-default p-6">
          <p className="text-sm text-brand-secondary">
            Laden mit Netzstrom
          </p>

          <p className="mt-2 text-xl font-semibold text-brand-primary">
            {numberFormatter.format(
              result.annualGridChargingEnergyKwh,
            )}{" "}
            kWh/Jahr
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
            Dieser Wert basiert auf den
            Standardannahmen des bestehenden
            Wallbox-Rechners für Wallbox,
            Installation und weitere Projektkosten.
          </p>
        </article>
      </div>

      {result.technicalReviewRecommended ? (
        <div className="mt-6 rounded-2xl border border-border-default bg-surface p-6">
          <h2 className="font-semibold text-brand-primary">
            Technische Prüfung besonders wichtig
          </h2>

          <p className="mt-2 leading-7 text-foreground/70">
            Bei 22 kW müssen unter anderem
            Fahrzeug, Hausanschluss,
            Elektroinstallation und die lokalen
            technischen Voraussetzungen genauer
            geprüft werden.
          </p>
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={onBack}
          className="min-h-12 rounded-xl border border-border-default px-6 py-3 font-medium text-brand-primary transition hover:bg-surface"
        >
          Angaben ändern
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-primary px-6 py-3 text-center font-semibold text-white transition hover:opacity-90"
        >
          Beratung anfragen
        </button>

        <Link
          href="/konfigurator"
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border-default px-6 py-3 text-center font-semibold text-brand-primary transition hover:bg-surface"
        >
          Zur Übersicht
        </Link>
      </div>

      <p className="mt-6 text-sm leading-6 text-foreground/60">
        Die Ergebnisse sind eine unverbindliche
        Modellorientierung. Tatsächliche
        Ladeleistung, Kosten und PV-Nutzung hängen
        insbesondere von Fahrzeug,
        Elektroinstallation, Hausanschluss,
        Leitungsweg, Stromtarif und Ladeverhalten ab.
      </p>
    </section>
  );
}