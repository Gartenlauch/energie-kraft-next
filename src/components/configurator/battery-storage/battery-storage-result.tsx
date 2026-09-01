"use client";

import { ConfiguratorJourneyActions } from "@/components/configurator/configurator-journey-actions";
import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";
import type {
  BatteryStorageConfiguratorResult,
  ConfiguratorType,
} from "@/types/configurator";

interface BatteryStorageResultProps {
  result: BatteryStorageConfiguratorResult;
  nextConfigurator:
  ConfiguratorType | null;
  onBack: () => void;
  onContinue: () => void;
}

function formatNumber(
  value: number,
): string {
  return new Intl.NumberFormat(
    "de-DE",
    {
      maximumFractionDigits: 1,
    },
  ).format(value);
}

const GOAL_LABELS = {
  economic: "Wirtschaftlich",
  balanced: "Ausgewogen",
  high_autonomy: "Hohe Autarkie",
} as const;

const BACKUP_LABELS = {
  none: "Nicht gewählt",
  selected_loads:
    "Ausgewählte Verbraucher",
  whole_home:
    "Möglichst das ganze Haus",
} as const;

export function BatteryStorageResult({
  result,
  nextConfigurator,
  onBack,
  onContinue,
}: BatteryStorageResultProps) {
  return (
    <section aria-labelledby="battery-result-heading">
      <ConfiguratorPhaseIndicator
        currentPhase="configuration"
      />

      <p className="text-sm font-semibold tracking-widest text-brand-secondary uppercase">
        Deine erste Orientierung
      </p>

      <h1
        id="battery-result-heading"
        className="mt-3 text-3xl font-semibold tracking-tight text-brand-primary sm:text-4xl"
      >
        Deine Stromspeicher-Empfehlung
      </h1>

      <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/70 sm:text-lg">
        Auf Basis deiner Angaben ergibt sich eine
        sinnvolle Größenordnung für die nutzbare
        Speicherkapazität. Die konkrete Auswahl
        hängt zusätzlich vom Speichersystem,
        Wechselrichter und gewünschten
        Ersatzstromfunktionen ab.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <article className="rounded-2xl border border-border-default bg-surface p-6">
          <p className="text-sm font-medium text-brand-secondary">
            Empfohlene nutzbare Kapazität
          </p>

          <p className="mt-2 text-3xl font-semibold tracking-tight text-brand-primary">
            ca.{" "}
            {formatNumber(
              result.recommendedUsableCapacityKwhMin,
            )}
            –
            {formatNumber(
              result.recommendedUsableCapacityKwhMax,
            )}{" "}
            kWh
          </p>

          <p className="mt-3 text-sm leading-6 text-foreground/65">
            Bewusst als Korridor statt als
            scheinexakte Speichergröße.
          </p>
        </article>

        <article className="rounded-2xl border border-border-default p-6">
          <p className="text-sm font-medium text-brand-secondary">
            Berücksichtigter Verbrauch
          </p>

          <p className="mt-2 text-2xl font-semibold text-brand-primary">
            {new Intl.NumberFormat(
              "de-DE",
            ).format(
              result.annualConsumptionKwh,
            )}{" "}
            kWh/Jahr
          </p>
        </article>

        <article className="rounded-2xl border border-border-default p-6">
          <p className="text-sm font-medium text-brand-secondary">
            PV-Leistung
          </p>

          <p className="mt-2 text-xl font-semibold text-brand-primary">
            {result.pvPowerKwpMin ===
              result.pvPowerKwpMax
              ? `${formatNumber(
                result.pvPowerKwpMin,
              )} kWp`
              : `ca. ${formatNumber(
                result.pvPowerKwpMin,
              )}–${formatNumber(
                result.pvPowerKwpMax,
              )} kWp`}
          </p>

          <p className="mt-2 text-sm text-foreground/60">
            {result.source ===
              "photovoltaic"
              ? "Aus deiner PV-Konfiguration übernommen."
              : "Von dir angegeben."}
          </p>
        </article>

        <article className="rounded-2xl border border-border-default p-6">
          <p className="text-sm font-medium text-brand-secondary">
            Ziel der Speicherlösung
          </p>

          <p className="mt-2 text-xl font-semibold text-brand-primary">
            {GOAL_LABELS[result.goal]}
          </p>
        </article>

        <article className="rounded-2xl border border-border-default p-6 sm:col-span-2">
          <p className="text-sm font-medium text-brand-secondary">
            Ersatzstrom
          </p>

          <p className="mt-2 text-xl font-semibold text-brand-primary">
            {
              BACKUP_LABELS[
              result.backupPreference
              ]
            }
          </p>

          {result.backupPowerRequested ? (
            <p className="mt-3 text-sm leading-6 text-foreground/65">
              Die verfügbare Ersatzstromleistung
              hängt nicht nur von der
              Speicherkapazität ab. Wechselrichter,
              Umschaltung und gewünschte Verbraucher
              müssen technisch geprüft werden.
            </p>
          ) : null}
        </article>
      </div>

      {!result.pvSurplusLikely ? (
        <div className="mt-6 rounded-2xl border border-border-default bg-surface p-6">
          <h2 className="font-semibold text-brand-primary">
            PV-Überschuss prüfen
          </h2>

          <p className="mt-2 leading-7 text-foreground/70">
            Im Verhältnis zu deinem Stromverbrauch
            könnte die vorhandene PV-Leistung nur
            begrenzte Überschüsse für einen Speicher
            liefern. Eine technische und
            wirtschaftliche Prüfung ist deshalb
            besonders sinnvoll.
          </p>
        </div>
      ) : null}

      {result.modularExpansionRecommended ? (
        <div className="mt-6 rounded-2xl border border-border-default bg-surface p-6">
          <h2 className="font-semibold text-brand-primary">
            Erweiterbarkeit berücksichtigen
          </h2>

          <p className="mt-2 leading-7 text-foreground/70">
            Aufgrund deiner weiteren Interessen
            empfehlen wir ein modular erweiterbares
            Speichersystem. Zusätzliche Verbraucher
            wie Wärmepumpe, Klimaanlage oder Wallbox
            können den zukünftigen Strombedarf
            verändern.
          </p>
        </div>
      ) : null}

      {result.technicalReviewRecommended ? (
        <div className="mt-6 rounded-2xl border border-border-default bg-surface p-6">
          <h2 className="font-semibold text-brand-primary">
            Technische Prüfung besonders wichtig
          </h2>

          <p className="mt-2 leading-7 text-foreground/70">
            Bei deinen Angaben sollten
            Speicherleistung, Ersatzstromkonzept oder
            PV-Erzeugung vor der konkreten
            Produktauswahl genauer geprüft werden.
          </p>
        </div>
      ) : null}

      <ConfiguratorJourneyActions
        currentConfigurator="battery_storage"
        nextConfigurator={
          nextConfigurator
        }
        onBack={onBack}
        onContinue={onContinue}
      />

      <p className="mt-6 text-sm leading-6 text-foreground/60">
        Die Empfehlung ist eine unverbindliche
        Orientierung und ersetzt keine technische
        Auslegung, Wirtschaftlichkeitsberechnung oder
        Prüfung der Ersatzstromfähigkeit.
      </p>
    </section>
  );
}