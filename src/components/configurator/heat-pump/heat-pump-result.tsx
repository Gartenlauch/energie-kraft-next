"use client";

import { ComparisonBars } from "@/components/charts/energy-charts";
import { AdditionalEnergySolutions } from "@/components/configurator/additional-energy-solutions";
import { ConfiguratorJourneyActions } from "@/components/configurator/configurator-journey-actions";
import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";
import {
  ResultIntro,
  ResultMetric,
  euro,
  investment,
  number,
  percent,
} from "@/components/configurator/result-presentation";
import { heatPumpCalculatorContent } from "@/content/pages/waermepumpen-rechner";
import { useConfigurator } from "@/lib/configurator/configurator-context";
import { calculateProjectEconomics } from "@/lib/configurator/project-economics";
import type { ConfiguratorType, HeatPumpConfiguratorResult } from "@/types/configurator";

interface HeatPumpResultProps {
  result: HeatPumpConfiguratorResult;
  nextConfigurator: ConfiguratorType | null;
  onBack: () => void;
  onContinue: () => void;
  reviewAdditionalSolutions: boolean;
  onAdditionalSolutionsReviewed: () => void;
}

export function HeatPumpResult({
  result,
  onBack,
  onContinue,
  nextConfigurator,
  reviewAdditionalSolutions,
  onAdditionalSolutionsReviewed,
}: HeatPumpResultProps) {
  const { state } = useConfigurator();
  const economics = calculateProjectEconomics(state);
  const heating = economics.heating;
  const heatPumpInvestment = investment(economics, "heat_pump");
  const assessment = heatPumpCalculatorContent.assessmentContent[result.flowTemperatureAssessment];

  return (
    <section aria-labelledby="heat-pump-result-heading">
      <ConfiguratorPhaseIndicator currentPhase="configuration" compact />
      <ResultIntro
        id="heat-pump-result-heading"
        eyebrow="Deine erste Orientierung"
        title="Deine Wärmepumpen-Orientierung"
        description="Eine erste Einordnung von Leistung, Investition und laufenden Heizkosten. Die endgültige Auslegung erfordert eine Heizlastberechnung und Prüfung vor Ort."
      />

      <div className="bg-brand-navy mt-8 overflow-hidden rounded-[1.5rem] px-6 py-7 text-white sm:px-9 sm:py-9">
        <p className="text-sm font-semibold tracking-[0.14em] text-cyan-200 uppercase">
          Empfohlene Wärmepumpenleistung
        </p>
        <p className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          {number(result.recommendedHeatPumpCapacityKw)} kW
        </p>
        <div className="mt-7 border-t border-white/20 pt-5">
          <p className="text-sm text-white/70">Modellierte Investition</p>
          <p className="mt-1 text-2xl font-semibold break-words sm:text-3xl">
            {heatPumpInvestment === null ? "Nach technischer Prüfung" : euro(heatPumpInvestment)}
          </p>
        </div>
      </div>

      {heating ? (
        <section className="mt-9" aria-labelledby="heating-cost-heading">
          <h2
            id="heating-cost-heading"
            className="text-brand-navy text-xl font-semibold sm:text-2xl"
          >
            Was ändert sich bei den Heizkosten?
          </h2>
          {heating.currentAnnualEuro !== null ? (
            <>
              <dl className="mt-6 grid gap-6 sm:grid-cols-2">
                <ResultMetric
                  label="Bisherige / Referenz-Heizkosten"
                  value={`${euro(heating.currentAnnualEuro)} / Jahr`}
                  note={result.heatingComparisonLabel}
                />
                <ResultMetric
                  label="Mit Wärmepumpe"
                  value={`${euro(heating.heatPumpAnnualEuro)} / Jahr`}
                />
              </dl>
              <ComparisonBars
                prominent
                items={[
                  {
                    label: result.heatingComparisonLabel,
                    value: heating.currentAnnualEuro,
                    color: "#91A4C4",
                  },
                  { label: "Wärmepumpe", value: heating.heatPumpAnnualEuro, color: "#0DA1D1" },
                ]}
                unit="€/Jahr"
              />
              {heating.annualSavingEuro !== null ? (
                <div className="bg-surface mt-7 border-l-4 border-cyan-500 px-5 py-5 sm:px-7">
                  <p className="text-brand-secondary text-xs font-semibold tracking-[0.12em] uppercase">
                    {heating.annualSavingEuro > 0
                      ? "Modellierte Heizkostenersparnis"
                      : "Modellierte Heizkostendifferenz"}
                  </p>
                  <p className="text-brand-navy mt-2 text-3xl font-semibold tracking-tight break-words sm:text-4xl">
                    {euro(heating.annualSavingEuro)}{" "}
                    <span className="text-lg font-medium">pro Jahr</span>
                  </p>
                  {heating.savingPercent !== null ? (
                    <p className="text-brand-primary mt-1 font-semibold">
                      {percent(heating.savingPercent)} gegenüber der Referenz
                    </p>
                  ) : null}
                  {heating.annualSavingEuro < 0 ? (
                    <p className="text-foreground/70 mt-2 text-sm">
                      Die modellierten Wärmepumpen-Betriebskosten liegen über den
                      Referenz-Heizkosten.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </>
          ) : (
            <div className="border-brand-secondary mt-5 border-l-4 pl-5">
              <p className="text-brand-navy font-semibold">
                Vergleich nach Klärung des bisherigen Heizsystems
              </p>
              <p className="text-foreground/70 mt-2 leading-7">
                Modellierte Wärmepumpen-Betriebskosten: {euro(heating.heatPumpAnnualEuro)} pro Jahr.
                Ohne belastbare bisherige Heizkosten zeigen wir keine Ersparnis.
              </p>
            </div>
          )}
        </section>
      ) : null}

      <div className="border-brand-primary/15 text-foreground/70 mt-8 border-t pt-5 text-sm leading-6">
        <p className="text-brand-navy font-semibold">Förderung nicht berücksichtigt</p>
        <p className="mt-1">
          Mögliche Fördermittel können die tatsächliche Investition reduzieren. Die konkrete
          Förderfähigkeit prüfen wir im weiteren Beratungsprozess.
        </p>
        <p className="mt-3">
          {assessment.label}: {assessment.description}
        </p>
      </div>

      {result.technicalReviewRecommended ? (
        <p className="border-brand-secondary text-foreground/70 mt-6 border-l-4 pl-5 leading-7">
          Heizflächen, Vorlauftemperatur und hydraulische Bedingungen sollten vor der Entscheidung
          besonders sorgfältig geprüft werden.
        </p>
      ) : null}
      {reviewAdditionalSolutions ? <AdditionalEnergySolutions currentProduct="heat_pump" /> : null}
      <ConfiguratorJourneyActions
        currentConfigurator="heat_pump"
        nextConfigurator={nextConfigurator}
        onBack={onBack}
        onContinue={onContinue}
        onAdvance={reviewAdditionalSolutions ? onAdditionalSolutionsReviewed : undefined}
      />
      <p className="text-foreground/60 mt-6 text-sm leading-6">
        Unverbindliche Modellorientierung; keine Heizlastberechnung, technische Planung oder
        verbindliches Angebot.
      </p>
    </section>
  );
}
