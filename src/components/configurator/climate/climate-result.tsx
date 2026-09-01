"use client";

import Link from "next/link";
import { ConfiguratorJourneyActions } from "@/components/configurator/configurator-journey-actions";
import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";
import type {
  ClimateConfiguratorResult,
  ConfiguratorType,
} from "@/types/configurator";
import type { ClimateSystemRecommendation } from "@/types/climate-calculator";

interface ClimateResultProps {
  result: ClimateConfiguratorResult;
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

const SYSTEM_LABELS: Record<
  ClimateSystemRecommendation,
  string
> = {
  singleSplit: "Single-Split-System",
  multiSplit: "Multi-Split-System",
  projectPlanning:
    "Individuelle Mehrzonenplanung",
};

export function ClimateResult({
  result,
  onBack,
  onContinue,
  nextConfigurator,
}: ClimateResultProps) {
  return (
    <section aria-labelledby="climate-result-heading">
      <ConfiguratorPhaseIndicator
        currentPhase="configuration"
      />

      <p className="text-sm font-semibold tracking-widest text-brand-secondary uppercase">
        Deine erste Orientierung
      </p>

      <h1
        id="climate-result-heading"
        className="mt-3 text-3xl font-semibold tracking-tight text-brand-primary sm:text-4xl"
      >
        Deine Klimaanlagen-Orientierung
      </h1>

      <div className="mt-8 rounded-2xl border border-brand-accent bg-surface p-6">
        <p className="text-sm font-medium text-brand-secondary">
          Empfohlene Kühlleistung
        </p>

        <p className="mt-2 text-4xl font-semibold text-brand-primary">
          {numberFormatter.format(
            result.recommendedCoolingCapacityKw,
          )}{" "}
          kW
        </p>

        <p className="mt-3 leading-7 text-foreground/70">
          Überschlägige Modellleistung einschließlich
          Reserve. Eine technische Kühllastberechnung
          und die raumweise Planung können davon
          abweichen.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-border-default p-6">
        <p className="text-sm text-brand-secondary">
          Systemorientierung
        </p>

        <p className="mt-2 text-2xl font-semibold text-brand-primary">
          {
            SYSTEM_LABELS[
            result.systemRecommendation
            ]
          }
        </p>

        <p className="mt-3 leading-7 text-foreground/70">
          Vorgesehen sind zunächst{" "}
          {result.recommendedIndoorUnitCount}{" "}
          separat regelbare
          {result.recommendedIndoorUnitCount === 1
            ? " Inneneinheit"
            : " Inneneinheiten"}.
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <article className="rounded-2xl border border-border-default p-6">
          <p className="text-sm text-brand-secondary">
            Berechnete Kühllast
          </p>

          <p className="mt-2 text-2xl font-semibold text-brand-primary">
            {numberFormatter.format(
              result.calculatedCoolingLoadKw,
            )}{" "}
            kW
          </p>
        </article>

        <article className="rounded-2xl border border-border-default p-6">
          <p className="text-sm text-brand-secondary">
            Leistung je Raum
          </p>

          <p className="mt-2 text-2xl font-semibold text-brand-primary">
            {numberFormatter.format(
              result.averageCapacityPerRoomKw,
            )}{" "}
            kW
          </p>

          <p className="mt-2 text-sm leading-6 text-foreground/60">
            Rechnerischer Durchschnitt. Die tatsächliche
            Leistung muss je Raum separat betrachtet
            werden.
          </p>
        </article>

        <article className="rounded-2xl border border-border-default p-6">
          <p className="text-sm text-brand-secondary">
            Jährlicher Stromverbrauch
          </p>

          <p className="mt-2 text-2xl font-semibold text-brand-primary">
            {numberFormatter.format(
              result.annualElectricityConsumptionKwh,
            )}{" "}
            kWh
          </p>
        </article>

        <article className="rounded-2xl border border-border-default p-6">
          <p className="text-sm text-brand-secondary">
            Modellierte Stromkosten
          </p>

          <p className="mt-2 text-2xl font-semibold text-brand-primary">
            {currencyFormatter.format(
              result.annualOperatingCostEuro,
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
            Der Korridor basiert auf den bestehenden
            Modellannahmen des detaillierten
            Klimaanlagen-Rechners und stellt kein
            verbindliches Angebot dar.
          </p>
        </article>
      </div>

      {result.individualPlanningRecommended ? (
        <div className="mt-6 rounded-2xl border border-border-default bg-surface p-6">
          <h2 className="font-semibold text-brand-primary">
            Individuelle Mehrzonenplanung empfohlen
          </h2>

          <p className="mt-2 leading-7 text-foreground/70">
            Bei mehr als fünf getrennten Räumen oder
            Zonen sollte die Anlage nicht mehr nur über
            eine einfache Standardkonfiguration
            dimensioniert werden. Raumlasten,
            Leitungswege, Außengeräte und
            Anlagenaufteilung müssen individuell
            betrachtet werden.
          </p>
        </div>
      ) : null}

      <ConfiguratorJourneyActions
        currentConfigurator="climate"
        nextConfigurator={
          nextConfigurator
        }
        onBack={onBack}
        onContinue={onContinue}
        secondaryActions={
          <Link
            href="/rechner/klimaanlage-kosten"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border-default px-6 py-3 text-center font-semibold text-brand-primary transition hover:bg-surface"
          >
            Detailliert berechnen
          </Link>
        }
      />

      <p className="mt-6 text-sm leading-6 text-foreground/60">
        Die Ergebnisse sind eine unverbindliche
        Modellorientierung und keine technische
        Kühllastberechnung. Für die endgültige Auslegung
        müssen unter anderem Raumaufteilung,
        Fensterflächen, Sonneneinstrahlung,
        Leitungswege und konkrete Geräte geprüft werden.
      </p>
    </section>
  );
}