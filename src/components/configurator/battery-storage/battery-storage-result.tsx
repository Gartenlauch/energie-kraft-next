"use client";

import { ConfiguratorJourneyActions } from "@/components/configurator/configurator-journey-actions";
import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";
import {
  ResultIntro,
  euro,
  investment,
  number,
  percent,
} from "@/components/configurator/result-presentation";
import { useConfigurator } from "@/lib/configurator/configurator-context";
import { calculateProjectEconomics } from "@/lib/configurator/project-economics";
import type { BatteryStorageConfiguratorResult, ConfiguratorType } from "@/types/configurator";

interface BatteryStorageResultProps {
  result: BatteryStorageConfiguratorResult;
  nextConfigurator: ConfiguratorType | null;
  onBack: () => void;
  onContinue: () => void;
}

function ComparisonRow({
  label,
  before,
  after,
  format,
  lowerIsBetter = false,
}: {
  label: string;
  before: number;
  after: number;
  format: (value: number) => string;
  lowerIsBetter?: boolean;
}) {
  const scale = Math.max(before, after, 1);

  return (
    <div className="border-brand-primary/15 grid gap-4 border-t py-5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-7">
      <h3 className="text-brand-navy text-base font-semibold">{label}</h3>
      <div className="grid gap-3">
        <div>
          <div className="flex items-baseline justify-between gap-4 text-sm">
            <span className="text-foreground/65">Ohne Speicher</span>
            <strong className="text-brand-navy font-semibold">{format(before)}</strong>
          </div>
          <div className="bg-surface mt-1.5 h-3.5 overflow-hidden rounded-full" aria-hidden="true">
            <div
              className="h-full rounded-full bg-slate-400"
              style={{ width: `${(before / scale) * 100}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-baseline justify-between gap-4 text-sm">
            <span className="text-brand-primary font-medium">Mit Speicher</span>
            <strong className="text-brand-navy font-semibold">{format(after)}</strong>
          </div>
          <div className="bg-surface mt-1.5 h-3.5 overflow-hidden rounded-full" aria-hidden="true">
            <div
              className={`h-full rounded-full ${lowerIsBetter ? "bg-emerald-600" : "bg-brand-secondary"}`}
              style={{ width: `${(after / scale) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BatteryStorageResult({
  result,
  nextConfigurator,
  onBack,
  onContinue,
}: BatteryStorageResultProps) {
  const { state } = useConfigurator();
  const economics = calculateProjectEconomics(state);
  const solar = economics.solar;
  const storageInvestment = investment(economics, "battery_storage");
  const individualQuoteRequired = result.pricingMode === "individual_quote_required";

  return (
    <section aria-labelledby="battery-result-heading">
      <ConfiguratorPhaseIndicator currentPhase="configuration" compact />
      <ResultIntro
        id="battery-result-heading"
        eyebrow="Deine erste Orientierung"
        title="Deine Stromspeicher-Empfehlung"
        description="Mehr eigenen Solarstrom später am Tag nutzen: Die Speichergröße und ihre Wirkung hängen von PV-Anlage, Verbrauch und technischer Einbindung ab."
      />

      <div className="bg-brand-navy mt-8 overflow-hidden rounded-[1.5rem] px-6 py-7 text-white sm:px-9 sm:py-9">
        <p className="text-sm font-semibold tracking-[0.14em] text-cyan-200 uppercase">
          Empfohlene nutzbare Kapazität
        </p>
        <p className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          {individualQuoteRequired
            ? `Größer als ${number(state.settings.batteryStorage.pricing.maxModeledSize)} kWh`
            : `${number(result.recommendedUsableCapacityKwhMin)}${result.recommendedUsableCapacityKwhMin === result.recommendedUsableCapacityKwhMax ? "" : `–${number(result.recommendedUsableCapacityKwhMax)}`} kWh`}
        </p>
        <div className="mt-7 border-t border-white/20 pt-5">
          <p className="text-sm text-white/70">Modellierte Speicherinvestition</p>
          <p className="mt-1 text-2xl font-semibold break-words sm:text-3xl">
            {storageInvestment === null
              ? individualQuoteRequired ? "Individuelles Angebot erforderlich" : "Nach technischer Prüfung"
              : euro(storageInvestment)}
          </p>
        </div>
      </div>

      {individualQuoteRequired ? (
        <p className="border-brand-secondary text-foreground/70 mt-8 border-l-4 pl-5 leading-7">
          Für diese Speichergröße ist eine individuelle technische Planung und Preisermittlung erforderlich.
        </p>
      ) : null}

      {solar ? (
        <section className="mt-9" aria-labelledby="storage-comparison-heading">
          <h2
            id="storage-comparison-heading"
            className="text-brand-navy text-xl font-semibold sm:text-2xl"
          >
            Was verändert sich mit Speicher?
          </h2>
          <p className="text-foreground/70 mt-2 max-w-3xl leading-7">
            Die gleiche PV-Anlage im Jahresmodell – einmal ohne und einmal mit dem empfohlenen
            Speicher.
          </p>
          <div className="border-brand-primary/15 mt-6 border-b">
            <ComparisonRow
              label="Eigenverbrauch"
              before={solar.withoutStorage.selfConsumptionPercent}
              after={solar.withStorage.selfConsumptionPercent}
              format={percent}
            />
            <ComparisonRow
              label="Autarkie"
              before={solar.withoutStorage.autarkyPercent}
              after={solar.withStorage.autarkyPercent}
              format={percent}
            />
            <ComparisonRow
              label="Netzbezug"
              before={solar.withoutStorage.gridPurchaseKwh}
              after={solar.withStorage.gridPurchaseKwh}
              format={(value) => `${number(value, 0)} kWh`}
              lowerIsBetter
            />
          </div>
          <p className="text-brand-primary mt-5 text-sm font-semibold">
            {number(solar.storageAvoidedGridPurchaseKwh, 0)} kWh weniger Netzbezug im Modelljahr.
          </p>
          <p className="text-foreground/70 mt-3 text-sm leading-6">
            Einspeisung: {number(solar.withoutStorage.feedInKwh, 0)} kWh ohne Speicher →{" "}
            {number(solar.withStorage.feedInKwh, 0)} kWh mit Speicher. Das sind{" "}
            {number(solar.storageReducedFeedInKwh, 0)} kWh weniger Einspeisung; die finanzielle
            Wirkung ist separat modelliert.
          </p>
          <div className="bg-surface mt-6 border-l-4 border-cyan-500 px-5 py-4">
            <p className="text-foreground/70 text-sm">Zusätzlicher finanzieller Speichervorteil</p>
            <p className="text-brand-navy mt-1 text-lg font-semibold">
              {euro(solar.storageAdditionalAnnualBenefitEuro)} pro Jahr
            </p>
          </div>
        </section>
      ) : (
        <p className="border-brand-secondary text-foreground/70 mt-8 border-l-4 pl-5 leading-7">
          Der Vergleich „PV ohne Speicher / PV + Speicher“ wird sichtbar, sobald auch die
          Photovoltaikanlage konfiguriert ist. Eine isolierte Speicherwirkung wäre ohne diese
          Angaben nicht belastbar.
        </p>
      )}

      {result.backupPowerRequested ||
      !result.pvSurplusLikely ||
      result.modularExpansionRecommended ||
      result.technicalReviewRecommended ? (
        <div className="border-brand-primary/15 text-foreground/70 mt-8 border-t pt-6 text-sm leading-6">
          <h2 className="text-brand-navy font-semibold">Für die Planung wichtig</h2>
          {result.backupPowerRequested ? (
            <p className="mt-2">
              Ersatzstromleistung und Umschaltung müssen passend zu den gewünschten Verbrauchern
              technisch geprüft werden.
            </p>
          ) : null}
          {!result.pvSurplusLikely ? (
            <p className="mt-2">
              Die vorhandene PV-Leistung könnte nur begrenzte Überschüsse für den Speicher liefern.
            </p>
          ) : null}
          {result.modularExpansionRecommended ? (
            <p className="mt-2">
              Ein erweiterbares System kann sinnvoll sein, wenn künftig weitere Verbraucher
              hinzukommen.
            </p>
          ) : null}
          {result.technicalReviewRecommended ? (
            <p className="mt-2">
              Speicherleistung, PV-Erzeugung und Einbindung sollten vor der Produktauswahl genauer
              geprüft werden.
            </p>
          ) : null}
        </div>
      ) : null}

      <ConfiguratorJourneyActions
        currentConfigurator="battery_storage"
        nextConfigurator={nextConfigurator}
        onBack={onBack}
        onContinue={onContinue}
      />
      <p className="text-foreground/60 mt-6 text-sm leading-6">
        Unverbindliche Modellorientierung; keine technische Auslegung oder verbindliches Angebot.
      </p>
    </section>
  );
}
