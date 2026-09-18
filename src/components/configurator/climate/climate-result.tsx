"use client";

import { AdditionalEnergySolutions } from "@/components/configurator/additional-energy-solutions";
import { ConfiguratorJourneyActions } from "@/components/configurator/configurator-journey-actions";
import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";
import {
  ResultIntro,
  ResultMetric,
  euro,
  investment,
  number,
} from "@/components/configurator/result-presentation";
import { useConfigurator } from "@/lib/configurator/configurator-context";
import { calculateProjectEconomics } from "@/lib/configurator/project-economics";
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
  const { state } = useConfigurator();
  const cost = investment(calculateProjectEconomics(state), "climate");

  return (
    <section aria-labelledby="climate-result-heading">
      <ConfiguratorPhaseIndicator currentPhase="configuration" compact />
      <ResultIntro
        id="climate-result-heading"
        eyebrow="Deine erste Orientierung"
        title="Deine Klimaanlagen-Orientierung"
        description="Angenehme Temperaturen dort, wo du sie brauchst. Die empfohlene Lösung kühlt gezielt und wird passend zu deinen Räumen und deinem Energiesystem geplant."
      />

      <div className="bg-brand-navy mt-8 overflow-hidden rounded-[1.5rem] px-6 py-7 text-white sm:px-9 sm:py-9">
        <p className="text-sm font-semibold tracking-[0.14em] text-cyan-200 uppercase">
          Empfohlene Kühlleistung
        </p>
        <p className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          {number(result.recommendedCoolingCapacityKw)} kW
        </p>
        <p className="mt-3 text-sm leading-6 text-white/70">
          Überschlägige Leistung einschließlich Reserve; die raumweise Kühllast kann abweichen.
        </p>
      </div>

      <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        <ResultMetric
          label="Passende Systemart"
          value={SYSTEM_LABELS[result.systemRecommendation]}
        />
        <ResultMetric
          label="Separat regelbare Inneneinheiten"
          value={number(result.recommendedIndoorUnitCount, 0)}
          note="Für gezielte Kühlung in den vorgesehenen Räumen."
        />
        <ResultMetric
          label="Modellierte Investition"
          value={cost === null ? "Nach technischer Prüfung" : euro(cost)}
          className="sm:col-span-2 lg:col-span-1"
        />
      </dl>

      <p className="bg-surface text-foreground/70 mt-8 border-l-4 border-cyan-500 px-5 py-5 leading-7 sm:px-7">
        Die genaue Platzierung der Innen- und Außengeräte, Leitungswege und Raumlasten klären wir in
        der persönlichen Planung.
      </p>

      {result.individualPlanningRecommended ? (
        <p className="border-brand-secondary text-foreground/70 mt-6 border-l-4 pl-5 leading-7">
          Für deine Raumaufteilung empfehlen wir eine individuelle Mehrzonenplanung.
        </p>
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
        Unverbindliche Modellorientierung; die endgültige Auslegung erfordert eine technische
        Prüfung der Räume und Installation.
      </p>
    </section>
  );
}
