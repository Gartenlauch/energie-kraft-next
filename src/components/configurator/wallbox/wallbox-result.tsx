"use client";

import { ConfiguratorJourneyActions } from "@/components/configurator/configurator-journey-actions";
import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";
import { wallboxCalculatorContent } from "@/content/pages/wallbox-rechner";
import { SegmentedEnergyBar } from "@/components/charts/energy-charts";
import type { ConfiguratorType, WallboxConfiguratorResult } from "@/types/configurator";

interface WallboxResultProps {
  result: WallboxConfiguratorResult;
  nextConfigurator: ConfiguratorType | null;
  onBack: () => void;
  onContinue: () => void;
}

const numberFormatter = new Intl.NumberFormat("de-DE", {
    maximumFractionDigits: 1,
  });

const currencyFormatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

function formatChargingDuration(hours: number): string {
  const totalMinutes = Math.round(hours * 60);

  const fullHours = Math.floor(totalMinutes / 60);

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
  nextConfigurator,
  onBack,
  onContinue,
}: WallboxResultProps) {
  const recommendation =
    wallboxCalculatorContent.recommendationContent[result.systemRecommendation];

  return (
    <section aria-labelledby="wallbox-result-heading">
      <ConfiguratorPhaseIndicator currentPhase="configuration" />

      <p className="text-brand-secondary text-sm font-semibold tracking-widest uppercase">
        Deine erste Orientierung
      </p>

      <h1
        id="wallbox-result-heading"
        className="text-brand-primary mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        Deine Wallbox-Empfehlung
      </h1>

      <div className="border-brand-accent-strong bg-surface mt-8 rounded-xl border p-6">
        <p className="text-brand-secondary text-sm font-medium">Empfohlene Einordnung</p>

        <p className="text-brand-primary mt-2 text-2xl font-semibold">{recommendation.label}</p>

        <p className="text-foreground/70 mt-3 leading-7">{recommendation.description}</p>
      </div>

      <div className="border-border-default bg-surface mt-6 rounded-2xl border p-6">
        <p className="text-brand-primary text-sm font-semibold">Ladeenergie nach Herkunft</p>
        <SegmentedEnergyBar
          segments={[
            { label: "PV-Strom", value: result.annualPvChargingEnergyKwh, color: "#0DA1D1" },
            { label: "Netzstrom", value: result.annualGridChargingEnergyKwh, color: "#91A4C4" },
          ]}
          unit="kWh/Jahr"
        />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <article className="border-border-default rounded-2xl border p-6">
          <p className="text-brand-secondary text-sm">Typische Ladedauer</p>

          <p className="text-brand-primary mt-2 text-2xl font-semibold">
            {formatChargingDuration(result.typicalChargingTimeHours)}
          </p>
        </article>

        <article className="border-border-default rounded-2xl border p-6">
          <p className="text-brand-secondary text-sm">Jährlicher Fahrstrombedarf</p>

          <p className="text-brand-primary mt-2 text-2xl font-semibold">
            {numberFormatter.format(result.annualVehicleEnergyDemandKwh)} kWh
          </p>
        </article>

        <article className="border-border-default rounded-2xl border p-6">
          <p className="text-brand-secondary text-sm">Heimladeenergie</p>

          <p className="text-brand-primary mt-2 text-2xl font-semibold">
            {numberFormatter.format(result.annualHomeChargingInputEnergyKwh)} kWh/Jahr
          </p>
        </article>

        <article className="border-border-default rounded-2xl border p-6">
          <p className="text-brand-secondary text-sm">Modellierte Heimladekosten</p>

          <p className="text-brand-primary mt-2 text-2xl font-semibold">
            {currencyFormatter.format(result.monthlyHomeChargingCostEuro)}
            /Monat
          </p>
        </article>

        <article className="border-border-default rounded-2xl border p-6">
          <p className="text-brand-secondary text-sm">Laden mit PV-Strom</p>

          <p className="text-brand-primary mt-2 text-xl font-semibold">
            {numberFormatter.format(result.annualPvChargingEnergyKwh)} kWh/Jahr
          </p>
        </article>

        <article className="border-border-default rounded-2xl border p-6">
          <p className="text-brand-secondary text-sm">Laden mit Netzstrom</p>

          <p className="text-brand-primary mt-2 text-xl font-semibold">
            {numberFormatter.format(result.annualGridChargingEnergyKwh)} kWh/Jahr
          </p>
        </article>

        <article className="border-border-default bg-surface rounded-2xl border p-6 sm:col-span-2">
          <p className="text-brand-secondary text-sm">Modellierter Projektkosten-Korridor</p>

          <p className="text-brand-primary mt-2 text-2xl font-semibold">
            {currencyFormatter.format(result.estimatedMinimumCostEuro)}
            {" – "}
            {currencyFormatter.format(result.estimatedMaximumCostEuro)}
          </p>

          <p className="text-foreground/65 mt-3 text-sm leading-6">
            Dieser Wert basiert auf den Standardannahmen des bestehenden Wallbox-Rechners für
            Wallbox, Installation und weitere Projektkosten.
          </p>
        </article>
      </div>

      {result.technicalReviewRecommended ? (
        <div className="border-border-default bg-surface mt-6 rounded-2xl border p-6">
          <h2 className="text-brand-primary font-semibold">Technische Prüfung besonders wichtig</h2>

          <p className="text-foreground/70 mt-2 leading-7">
            Bei 22 kW müssen unter anderem Fahrzeug, Hausanschluss, Elektroinstallation und die
            lokalen technischen Voraussetzungen genauer geprüft werden.
          </p>
        </div>
      ) : null}

      <ConfiguratorJourneyActions
        currentConfigurator="wallbox"
        nextConfigurator={nextConfigurator}
        onBack={onBack}
        onContinue={onContinue}
      />

      <p className="text-foreground/60 mt-6 text-sm leading-6">
        Die Ergebnisse sind eine unverbindliche Modellorientierung. Tatsächliche Ladeleistung,
        Kosten und PV-Nutzung hängen insbesondere von Fahrzeug, Elektroinstallation, Hausanschluss,
        Leitungsweg, Stromtarif und Ladeverhalten ab.
      </p>
    </section>
  );
}
