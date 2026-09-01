"use client";

import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";

import type {
  ConfiguratorType,
  PhotovoltaicConfiguratorResult,
} from "@/types/configurator";

import { ConfiguratorJourneyActions } from "@/components/configurator/configurator-journey-actions";


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
  return (
    <section aria-labelledby="photovoltaic-result-heading">
      <ConfiguratorPhaseIndicator
        currentPhase="configuration"
      />
      <p className="text-sm font-semibold tracking-widest text-brand-secondary uppercase">
        Deine erste Orientierung
      </p>

      <h1
        id="photovoltaic-result-heading"
        className="mt-3 text-3xl font-semibold tracking-tight text-brand-primary sm:text-4xl"
      >
        Deine Photovoltaik-Empfehlung
      </h1>

      <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/70 sm:text-lg">
        Auf Basis deiner Angaben ergibt sich eine erste
        Größenordnung für deine Photovoltaikanlage. Die tatsächliche
        Auslegung wird anschließend anhand der konkreten
        Gegebenheiten vor Ort geprüft.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <article className="rounded-2xl border border-border-default bg-surface p-6">
          <p className="text-sm font-medium text-brand-secondary">
            Empfohlene Anlagenklasse
          </p>

          <p className="mt-2 text-3xl font-semibold tracking-tight text-brand-primary">
            ca. {result.recommendedPowerKwpMin}–
            {result.recommendedPowerKwpMax} kWp
          </p>

          <p className="mt-3 text-sm leading-6 text-foreground/65">
            Die tatsächlich mögliche Anlagenleistung hängt unter
            anderem von Dachfläche, Verschattung und den örtlichen
            Gegebenheiten ab.
          </p>
        </article>

        <article className="rounded-2xl border border-border-default p-6">
          <p className="text-sm font-medium text-brand-secondary">
            Möglicher Jahresertrag
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-brand-primary">
            ca.{" "}
            {formatKwh(
              result.estimatedAnnualYieldKwhMin,
            )}
            –
            {formatKwh(
              result.estimatedAnnualYieldKwhMax,
            )}{" "}
            kWh
          </p>

          <p className="mt-3 text-sm leading-6 text-foreground/65">
            Der Wert ist ein Orientierungskorridor und keine
            Ertragsgarantie.
          </p>
        </article>

        <article className="rounded-2xl border border-border-default p-6">
          <p className="text-sm font-medium text-brand-secondary">
            Künftig berücksichtigter Stromverbrauch
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-brand-primary">
            {formatKwh(
              result.projectedAnnualConsumptionKwh,
            )}{" "}
            kWh/Jahr
          </p>
        </article>

        <article className="rounded-2xl border border-border-default p-6">
          <p className="text-sm font-medium text-brand-secondary">
            Stromspeicher
          </p>

          <p className="mt-2 text-xl font-semibold text-brand-primary">
            {result.batteryStorageRequested
              ? "Soll berücksichtigt werden"
              : "Aktuell nicht ausgewählt"}
          </p>

          {result.batteryStorageRequested ? (
            <p className="mt-3 text-sm leading-6 text-foreground/65">
              Der Stromspeicher ist Teil deines Energieprojekts und wird
              im weiteren Konfigurator-Ablauf berücksichtigt.
            </p>
          ) : null}
        </article>
      </div>

      {result.technicalReviewRecommended ? (
        <div className="mt-6 rounded-2xl border border-border-default bg-surface p-6">
          <h2 className="font-semibold text-brand-primary">
            Technische Prüfung besonders wichtig
          </h2>

          <p className="mt-2 leading-7 text-foreground/70">
            Aufgrund deiner Dachangaben empfehlen wir, die
            technischen Voraussetzungen vor einer konkreten
            Anlagenplanung besonders sorgfältig zu prüfen. Daraus
            folgt nicht automatisch, dass dein Dach ungeeignet ist.
          </p>
        </div>
      ) : null}

      <ConfiguratorJourneyActions
        currentConfigurator="photovoltaic"
        nextConfigurator={
          nextConfigurator
        }
        onBack={onBack}
        onContinue={onContinue}
      />

      <p className="mt-6 text-sm leading-6 text-foreground/60">
        Diese Berechnung ist eine unverbindliche Orientierung und
        ersetzt keine technische Planung, Dachprüfung oder
        Wirtschaftlichkeitsberechnung.
      </p>
    </section>
  );
}