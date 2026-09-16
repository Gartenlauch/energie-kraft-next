"use client";

import { ConfiguratorJourneyActions } from "@/components/configurator/configurator-journey-actions";
import { AdditionalEnergySolutions } from "@/components/configurator/additional-energy-solutions";
import { ComparisonBars } from "@/components/charts/energy-charts";
import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";
import type { ClimateConfiguratorResult, ConfiguratorType } from "@/types/configurator";
import type { ClimateSystemRecommendation } from "@/types/climate-calculator";

interface ClimateResultProps {
  result: ClimateConfiguratorResult;
  nextConfigurator: ConfiguratorType | null;
  onBack: () => void;
  onContinue: () => void;
  reviewAdditionalSolutions: boolean;
  onAdditionalSolutionsReviewed: () => void;
}
const numberFormatter = new Intl.NumberFormat("de-DE", {
    maximumFractionDigits: 1,
  });

const currencyFormatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

const SYSTEM_LABELS: Record<ClimateSystemRecommendation, string> = {
  singleSplit: "Single-Split-System",
  multiSplit: "Multi-Split-System",
  projectPlanning: "Individuelle Mehrzonenplanung",
};

export function ClimateResult({
  result,
  onBack,
  onContinue,
  nextConfigurator,
  reviewAdditionalSolutions,
  onAdditionalSolutionsReviewed,
}: ClimateResultProps) {
  return (
    <section aria-labelledby="climate-result-heading">
      <ConfiguratorPhaseIndicator currentPhase="configuration" />

      <p className="text-brand-secondary text-sm font-semibold tracking-widest uppercase">
        Deine erste Orientierung
      </p>

      <h1
        id="climate-result-heading"
        className="text-brand-primary mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        Deine Klimaanlagen-Orientierung
      </h1>

      <div className="border-brand-accent-strong bg-surface mt-8 rounded-xl border p-6">
        <p className="text-brand-secondary text-sm font-medium">Empfohlene Kühlleistung</p>

        <p className="text-brand-primary mt-2 text-4xl font-semibold">
          {numberFormatter.format(result.recommendedCoolingCapacityKw)} kW
        </p>

        <p className="text-foreground/70 mt-3 leading-7">
          Überschlägige Modellleistung einschließlich Reserve. Eine technische Kühllastberechnung
          und die raumweise Planung können davon abweichen.
        </p>
      </div>

      <div className="border-border-default bg-surface mt-6 rounded-2xl border p-6">
        <p className="text-brand-primary text-sm font-semibold">Betriebskostenanalyse</p>
        <ComparisonBars
          items={[
            {
              label: "Modellierter Stromverbrauch",
              value: result.annualElectricityConsumptionKwh,
              color: "#0DA1D1",
            },
          ]}
          unit="kWh/Jahr"
        />
        <p className="text-foreground/65 mt-4 text-sm">
          Für reine Komfortkühlung wird bewusst keine Amortisation oder Einsparung behauptet.
        </p>
      </div>

      <div className="border-border-default mt-6 rounded-2xl border p-6">
        <p className="text-brand-secondary text-sm">Systemorientierung</p>

        <p className="text-brand-primary mt-2 text-2xl font-semibold">
          {SYSTEM_LABELS[result.systemRecommendation]}
        </p>

        <p className="text-foreground/70 mt-3 leading-7">
          Vorgesehen sind zunächst {result.recommendedIndoorUnitCount} separat regelbare
          {result.recommendedIndoorUnitCount === 1 ? " Inneneinheit" : " Inneneinheiten"}.
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <article className="border-border-default rounded-2xl border p-6">
          <p className="text-brand-secondary text-sm">Berechnete Kühllast</p>

          <p className="text-brand-primary mt-2 text-2xl font-semibold">
            {numberFormatter.format(result.calculatedCoolingLoadKw)} kW
          </p>
        </article>

        <article className="border-border-default rounded-2xl border p-6">
          <p className="text-brand-secondary text-sm">Leistung je Raum</p>

          <p className="text-brand-primary mt-2 text-2xl font-semibold">
            {numberFormatter.format(result.averageCapacityPerRoomKw)} kW
          </p>

          <p className="text-foreground/60 mt-2 text-sm leading-6">
            Rechnerischer Durchschnitt. Die tatsächliche Leistung muss je Raum separat betrachtet
            werden.
          </p>
        </article>

        <article className="border-border-default rounded-2xl border p-6">
          <p className="text-brand-secondary text-sm">Jährlicher Stromverbrauch</p>

          <p className="text-brand-primary mt-2 text-2xl font-semibold">
            {numberFormatter.format(result.annualElectricityConsumptionKwh)} kWh
          </p>
        </article>

        <article className="border-border-default rounded-2xl border p-6">
          <p className="text-brand-secondary text-sm">Modellierte Stromkosten</p>

          <p className="text-brand-primary mt-2 text-2xl font-semibold">
            {currencyFormatter.format(result.annualOperatingCostEuro)}
            /Jahr
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
            Der Korridor basiert auf den bestehenden Modellannahmen des detaillierten
            Klimaanlagen-Rechners und stellt kein verbindliches Angebot dar.
          </p>
        </article>
      </div>

      {result.individualPlanningRecommended ? (
        <div className="border-border-default bg-surface mt-6 rounded-2xl border p-6">
          <h2 className="text-brand-primary font-semibold">
            Individuelle Mehrzonenplanung empfohlen
          </h2>

          <p className="text-foreground/70 mt-2 leading-7">
            Bei mehr als fünf getrennten Räumen oder Zonen sollte die Anlage nicht mehr nur über
            eine einfache Standardkonfiguration dimensioniert werden. Raumlasten, Leitungswege,
            Außengeräte und Anlagenaufteilung müssen individuell betrachtet werden.
          </p>
        </div>
      ) : null}

      {reviewAdditionalSolutions ? <AdditionalEnergySolutions currentProduct="climate" /> : null}

      <ConfiguratorJourneyActions
        currentConfigurator="climate"
        nextConfigurator={nextConfigurator}
        onBack={onBack}
        onContinue={onContinue}
        onAdvance={reviewAdditionalSolutions ? onAdditionalSolutionsReviewed : undefined}
      />

      <p className="text-foreground/60 mt-6 text-sm leading-6">
        Die Ergebnisse sind eine unverbindliche Modellorientierung und keine technische
        Kühllastberechnung. Für die endgültige Auslegung müssen unter anderem Raumaufteilung,
        Fensterflächen, Sonneneinstrahlung, Leitungswege und konkrete Geräte geprüft werden.
      </p>
    </section>
  );
}
