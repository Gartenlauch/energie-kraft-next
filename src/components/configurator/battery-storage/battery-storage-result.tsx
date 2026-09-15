"use client";

import { ConfiguratorJourneyActions } from "@/components/configurator/configurator-journey-actions";
import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";
import type { BatteryStorageConfiguratorResult, ConfiguratorType } from "@/types/configurator";

interface BatteryStorageResultProps {
  result: BatteryStorageConfiguratorResult;
  nextConfigurator: ConfiguratorType | null;
  onBack: () => void;
  onContinue: () => void;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("de-DE", {
      maximumFractionDigits: 1,
  }).format(value);
}

const GOAL_LABELS = {
  economic: "Wirtschaftlich",
  balanced: "Ausgewogen",
  high_autonomy: "Hohe Autarkie",
} as const;

const BACKUP_LABELS = {
  none: "Nicht gewählt",
  selected_loads: "Ausgewählte Verbraucher",
  whole_home: "Möglichst das ganze Haus",
} as const;

export function BatteryStorageResult({
  result,
  nextConfigurator,
  onBack,
  onContinue,
}: BatteryStorageResultProps) {
  const currency = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
  return (
    <section aria-labelledby="battery-result-heading">
      <ConfiguratorPhaseIndicator currentPhase="configuration" />

      <p className="text-brand-secondary text-sm font-semibold tracking-widest uppercase">
        Deine erste Orientierung
      </p>

      <h1
        id="battery-result-heading"
        className="text-brand-primary mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        Deine Stromspeicher-Empfehlung
      </h1>

      <p className="text-foreground/70 mt-4 max-w-3xl text-base leading-7 sm:text-lg">
        Auf Basis deiner Angaben ergibt sich eine sinnvolle Größenordnung für die nutzbare
        Speicherkapazität. Die konkrete Auswahl hängt zusätzlich vom Speichersystem, Wechselrichter
        und gewünschten Ersatzstromfunktionen ab.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <article className="border-border-default bg-surface rounded-2xl border p-6">
          <p className="text-brand-secondary text-sm font-medium">Empfohlene nutzbare Kapazität</p>

          <p className="text-brand-primary mt-2 text-3xl font-semibold tracking-tight">
            ca. {formatNumber(result.recommendedUsableCapacityKwhMin)}–
            {formatNumber(result.recommendedUsableCapacityKwhMax)} kWh
          </p>

          <p className="text-foreground/65 mt-3 text-sm leading-6">
            Bewusst als Korridor statt als scheinexakte Speichergröße.
          </p>
        </article>

        <article className="bg-brand-navy rounded-2xl p-6 text-white sm:col-span-2">
          <p className="text-sm font-medium text-cyan-200">Modellierter Projektkosten-Korridor</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {currency.format(result.estimatedMinimumCostEuro)} –{" "}
            {currency.format(result.estimatedMaximumCostEuro)}
          </p>
          <p className="mt-3 text-sm leading-6 text-white/65">
            Separater Speicherbaustein auf Basis der empfohlenen nutzbaren Kapazität und der
            zentralen €/kWh-Annahme.
          </p>
        </article>

        <article className="border-border-default rounded-2xl border p-6">
          <p className="text-brand-secondary text-sm font-medium">Berücksichtigter Verbrauch</p>

          <p className="text-brand-primary mt-2 text-2xl font-semibold">
            {new Intl.NumberFormat("de-DE").format(result.annualConsumptionKwh)} kWh/Jahr
          </p>
        </article>

        <article className="border-border-default rounded-2xl border p-6">
          <p className="text-brand-secondary text-sm font-medium">PV-Leistung</p>

          <p className="text-brand-primary mt-2 text-xl font-semibold">
            {result.pvPowerKwpMin === result.pvPowerKwpMax
              ? `${formatNumber(result.pvPowerKwpMin)} kWp`
              : `ca. ${formatNumber(result.pvPowerKwpMin)}–${formatNumber(
                result.pvPowerKwpMax,
              )} kWp`}
          </p>

          <p className="text-foreground/60 mt-2 text-sm">
            {result.source === "photovoltaic"
              ? "Aus deiner PV-Konfiguration übernommen."
              : "Von dir angegeben."}
          </p>
        </article>

        <article className="border-border-default rounded-2xl border p-6">
          <p className="text-brand-secondary text-sm font-medium">Ziel der Speicherlösung</p>

          <p className="text-brand-primary mt-2 text-xl font-semibold">
            {GOAL_LABELS[result.goal]}
          </p>
        </article>

        <article className="border-border-default rounded-2xl border p-6 sm:col-span-2">
          <p className="text-brand-secondary text-sm font-medium">Ersatzstrom</p>

          <p className="text-brand-primary mt-2 text-xl font-semibold">
            {BACKUP_LABELS[result.backupPreference]}
          </p>

          {result.backupPowerRequested ? (
            <p className="text-foreground/65 mt-3 text-sm leading-6">
              Die verfügbare Ersatzstromleistung hängt nicht nur von der Speicherkapazität ab.
              Wechselrichter, Umschaltung und gewünschte Verbraucher müssen technisch geprüft
              werden.
            </p>
          ) : null}
        </article>
      </div>

      {!result.pvSurplusLikely ? (
        <div className="border-border-default bg-surface mt-6 rounded-2xl border p-6">
          <h2 className="text-brand-primary font-semibold">PV-Überschuss prüfen</h2>

          <p className="text-foreground/70 mt-2 leading-7">
            Im Verhältnis zu deinem Stromverbrauch könnte die vorhandene PV-Leistung nur begrenzte
            Überschüsse für einen Speicher liefern. Eine technische und wirtschaftliche Prüfung ist
            deshalb besonders sinnvoll.
          </p>
        </div>
      ) : null}

      {result.modularExpansionRecommended ? (
        <div className="border-border-default bg-surface mt-6 rounded-2xl border p-6">
          <h2 className="text-brand-primary font-semibold">Erweiterbarkeit berücksichtigen</h2>

          <p className="text-foreground/70 mt-2 leading-7">
            Aufgrund deiner weiteren Interessen empfehlen wir ein modular erweiterbares
            Speichersystem. Zusätzliche Verbraucher wie Wärmepumpe, Klimaanlage oder Wallbox können
            den zukünftigen Strombedarf verändern.
          </p>
        </div>
      ) : null}

      {result.technicalReviewRecommended ? (
        <div className="border-border-default bg-surface mt-6 rounded-2xl border p-6">
          <h2 className="text-brand-primary font-semibold">Technische Prüfung besonders wichtig</h2>

          <p className="text-foreground/70 mt-2 leading-7">
            Bei deinen Angaben sollten Speicherleistung, Ersatzstromkonzept oder PV-Erzeugung vor
            der konkreten Produktauswahl genauer geprüft werden.
          </p>
        </div>
      ) : null}

      <ConfiguratorJourneyActions
        currentConfigurator="battery_storage"
        nextConfigurator={nextConfigurator}
        onBack={onBack}
        onContinue={onContinue}
      />

      <p className="text-foreground/60 mt-6 text-sm leading-6">
        Die Empfehlung ist eine unverbindliche Orientierung und ersetzt keine technische Auslegung,
        Wirtschaftlichkeitsberechnung oder Prüfung der Ersatzstromfähigkeit.
      </p>
    </section>
  );
}