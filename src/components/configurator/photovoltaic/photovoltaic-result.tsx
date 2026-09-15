"use client";

import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";

import type { ConfiguratorType, PhotovoltaicConfiguratorResult } from "@/types/configurator";

import { ConfiguratorJourneyActions } from "@/components/configurator/configurator-journey-actions";
import { ComparisonBars } from "@/components/charts/energy-charts";
import { useConfigurator } from "@/lib/configurator/configurator-context";

interface PhotovoltaicResultProps {
  result: PhotovoltaicConfiguratorResult;
  nextConfigurator: ConfiguratorType | null;
  onBack: () => void;
  onContinue: () => void;
}

function formatKwh(value: number): string {
  return new Intl.NumberFormat("de-DE").format(value);
}

export function PhotovoltaicResult({
  result,
  nextConfigurator,
  onBack,
  onContinue,
}: PhotovoltaicResultProps) {
  const { dispatch } = useConfigurator();
  const currency = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  return (
    <section aria-labelledby="photovoltaic-result-heading">
      <ConfiguratorPhaseIndicator currentPhase="configuration" />
      <p className="text-brand-secondary text-sm font-semibold tracking-widest uppercase">
        Deine erste Orientierung
      </p>

      <h1
        id="photovoltaic-result-heading"
        className="text-brand-primary mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        Deine Photovoltaik-Empfehlung
      </h1>

      <p className="text-foreground/70 mt-4 max-w-3xl text-base leading-7 sm:text-lg">
        Auf Basis deiner Angaben ergibt sich eine erste Größenordnung für deine Photovoltaikanlage.
        Die tatsächliche Auslegung wird anschließend anhand der konkreten Gegebenheiten vor Ort
        geprüft.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <article className="border-border-default bg-surface rounded-2xl border p-6">
          <p className="text-brand-secondary text-sm font-medium">Empfohlene Anlagenklasse</p>

          <p className="text-brand-primary mt-2 text-3xl font-semibold tracking-tight">
            ca. {result.recommendedPowerKwpMin}–{result.recommendedPowerKwpMax} kWp
          </p>

          <p className="text-foreground/65 mt-3 text-sm leading-6">
            Die tatsächlich mögliche Anlagenleistung hängt unter anderem von Dachfläche,
            Verschattung und den örtlichen Gegebenheiten ab.
          </p>
        </article>

        <article className="bg-brand-navy rounded-2xl p-6 text-white sm:col-span-2">
          <p className="text-sm font-medium text-cyan-200">
            Modellierter Projektkosten-Korridor · nur Photovoltaik
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {currency.format(result.estimatedMinimumCostEuro)} –{" "}
            {currency.format(result.estimatedMaximumCostEuro)}
          </p>
          <p className="mt-3 text-sm leading-6 text-white/65">
            Ein separat ausgewählter Stromspeicher ist in diesem PV-Korridor nicht enthalten.
          </p>
        </article>

        <article className="border-border-default rounded-2xl border p-6">
          <p className="text-brand-secondary text-sm font-medium">Möglicher Jahresertrag</p>

          <p className="text-brand-primary mt-2 text-2xl font-semibold tracking-tight">
            ca. {formatKwh(result.estimatedAnnualYieldKwhMin)}–
            {formatKwh(result.estimatedAnnualYieldKwhMax)} kWh
          </p>

          <p className="text-foreground/65 mt-3 text-sm leading-6">
            Der Wert ist ein Orientierungskorridor und keine Ertragsgarantie.
          </p>
        </article>

        <article className="border-border-default rounded-2xl border p-6">
          <p className="text-brand-secondary text-sm font-medium">
            Künftig berücksichtigter Stromverbrauch
          </p>

          <p className="text-brand-primary mt-2 text-2xl font-semibold tracking-tight">
            {formatKwh(result.projectedAnnualConsumptionKwh)} kWh/Jahr
          </p>
        </article>

        <article className="border-border-default rounded-2xl border p-6">
          <p className="text-brand-secondary text-sm font-medium">Stromspeicher</p>

          <p className="text-brand-primary mt-2 text-xl font-semibold">
            {result.batteryStorageRequested
              ? "Soll berücksichtigt werden"
              : "Aktuell nicht ausgewählt"}
          </p>

          {result.batteryStorageRequested ? (
            <p className="text-foreground/65 mt-3 text-sm leading-6">
              Der Stromspeicher ist Teil deines Energieprojekts und wird im weiteren
              Konfigurator-Ablauf berücksichtigt.
            </p>
          ) : null}
        </article>
      </div>

      <div className="border-border-default mt-6 rounded-2xl border p-6">
        <h2 className="text-brand-primary text-lg font-semibold">
          Erzeugung und Verbrauch im Jahresmodell
          </h2>
        <ComparisonBars
          items={[
            { label: "Modellierter Verbrauch", value: result.projectedAnnualConsumptionKwh },
            {
              label: "PV-Ertrag (Basisszenario)",
              value: (result.estimatedAnnualYieldKwhMin + result.estimatedAnnualYieldKwhMax) / 2,
              color: "#0DA1D1",
            },
          ]}
          unit="kWh/Jahr"
        />
      </div>

      {!result.batteryStorageRequested ? (
        <section
          className="bg-surface mt-6 overflow-hidden rounded-2xl p-6"
          aria-labelledby="pv-storage-nudge-heading"
        >
          <p className="eyebrow">Optionale Ergänzung</p>
          <h2 id="pv-storage-nudge-heading" className="text-brand-navy mt-2 text-xl font-semibold">
            Solarstrom auch später am Tag nutzen
          </h2>
          <p className="text-foreground/70 mt-3 max-w-3xl leading-7">
            Ein Stromspeicher kann den Eigenverbrauch erhöhen, Solarenergie vom Tag in Abend und
            Nacht verschieben und die Energieunabhängigkeit steigern. Die passende Größe wird
            separat modelliert.
          </p>
          <button
            type="button"
            onClick={() =>
              dispatch({ type: "UPDATE_INTERESTS", payload: { batteryStorage: true } })
            }
            className="bg-brand-primary mt-5 min-h-12 rounded-xl px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Stromspeicher mit berücksichtigen
          </button>
        </section>
      ) : null}

      {result.technicalReviewRecommended ? (
        <div className="border-border-default bg-surface mt-6 rounded-2xl border p-6">
          <h2 className="text-brand-primary font-semibold">Technische Prüfung besonders wichtig</h2>

          <p className="text-foreground/70 mt-2 leading-7">
            Aufgrund deiner Dachangaben empfehlen wir, die technischen Voraussetzungen vor einer
            konkreten Anlagenplanung besonders sorgfältig zu prüfen. Daraus folgt nicht automatisch,
            dass dein Dach ungeeignet ist.
          </p>
        </div>
      ) : null}

      <ConfiguratorJourneyActions
        currentConfigurator="photovoltaic"
        nextConfigurator={nextConfigurator}
        onBack={onBack}
        onContinue={onContinue}
      />

      <p className="text-foreground/60 mt-6 text-sm leading-6">
        Diese Berechnung ist eine unverbindliche Orientierung und ersetzt keine technische Planung,
        Dachprüfung oder Wirtschaftlichkeitsberechnung.
      </p>
    </section>
  );
}