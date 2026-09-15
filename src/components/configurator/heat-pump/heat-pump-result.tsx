"use client";

import { ConfiguratorJourneyActions } from "@/components/configurator/configurator-journey-actions";
import { AdditionalEnergySolutions } from "@/components/configurator/additional-energy-solutions";
import { ComparisonBars } from "@/components/charts/energy-charts";
import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";
import { heatPumpCalculatorContent } from "@/content/pages/waermepumpen-rechner";
import type { ConfiguratorType, HeatPumpConfiguratorResult } from "@/types/configurator";

interface HeatPumpResultProps {
    result: HeatPumpConfiguratorResult;
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

export function HeatPumpResult({
    result,
    onBack,
    onContinue,
    nextConfigurator,
}: HeatPumpResultProps) {
  const assessment = heatPumpCalculatorContent.assessmentContent[result.flowTemperatureAssessment];

    return (
        <section aria-labelledby="heat-pump-result-heading">
      <ConfiguratorPhaseIndicator currentPhase="configuration" />

      <p className="text-brand-secondary text-sm font-semibold tracking-widest uppercase">
                Deine erste Orientierung
            </p>

            <h1
                id="heat-pump-result-heading"
        className="text-brand-primary mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
                Deine Wärmepumpen-Orientierung
            </h1>

      <div className="border-brand-accent-strong bg-surface mt-8 rounded-xl border p-6">
        <p className="text-brand-secondary text-sm font-medium">Empfohlene Wärmepumpenleistung</p>

        <p className="text-brand-primary mt-2 text-4xl font-semibold">
          {numberFormatter.format(result.recommendedHeatPumpCapacityKw)} kW
                </p>

        <p className="text-foreground/70 mt-3 leading-7">
          Überschlägige Modellleistung einschließlich der bestehenden Leistungsreserve. Eine
          belastbare Heizlastberechnung kann hiervon abweichen.
                </p>
            </div>

      <div className="border-border-default mt-6 rounded-2xl border p-6">
        <p className="text-brand-secondary text-sm font-semibold">Einschätzung Heizsystem</p>

        <p className="text-brand-primary mt-2 text-xl font-semibold">{assessment.label}</p>

        <p className="text-foreground/70 mt-2 leading-7">{assessment.description}</p>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <article className="border-border-default rounded-2xl border p-6">
          <p className="text-brand-secondary text-sm">Jährlicher Wärmebedarf</p>

          <p className="text-brand-primary mt-2 text-2xl font-semibold">
            {numberFormatter.format(result.totalAnnualHeatDemandKwh)} kWh
                    </p>
                </article>

        <article className="border-border-default rounded-2xl border p-6">
          <p className="text-brand-secondary text-sm">Davon Raumwärme</p>

          <p className="text-brand-primary mt-2 text-2xl font-semibold">
            {numberFormatter.format(result.spaceHeatingDemandKwh)} kWh
                    </p>
                </article>

        <article className="border-border-default rounded-2xl border p-6">
          <p className="text-brand-secondary text-sm">Warmwasser</p>

          <p className="text-brand-primary mt-2 text-2xl font-semibold">
            {numberFormatter.format(result.hotWaterDemandKwh)} kWh/Jahr
                    </p>
                </article>

        <article className="border-border-default rounded-2xl border p-6">
          <p className="text-brand-secondary text-sm">Wärmepumpen-Stromverbrauch</p>

          <p className="text-brand-primary mt-2 text-2xl font-semibold">
            {numberFormatter.format(result.annualHeatPumpElectricityConsumptionKwh)} kWh/Jahr
                    </p>
                </article>

        <article className="border-border-default rounded-2xl border p-6 sm:col-span-2">
          <p className="text-brand-secondary text-sm">Modellierte Stromkosten</p>

          <p className="text-brand-primary mt-2 text-2xl font-semibold">
            {currencyFormatter.format(result.annualHeatPumpOperatingCostEuro)}
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
            Der Korridor basiert auf den bisherigen Kostenannahmen des detaillierten
            Wärmepumpen-Rechners und stellt kein verbindliches Angebot dar.
                    </p>
                </article>
            </div>

      <div className="border-border-default bg-surface mt-6 rounded-2xl border p-6">
        <p className="text-brand-primary text-sm font-semibold">Betriebskostenvergleich</p>
        <ComparisonBars
          items={[
            {
              label: "Bisheriges Heizsystem",
              value: result.currentHeatingOperatingCostEuro,
              color: "#91A4C4",
            },
            {
              label: "Wärmepumpenmodell",
              value: result.annualHeatPumpOperatingCostEuro,
              color: "#0DA1D1",
            },
          ]}
          unit="€/Jahr"
        />
        <p className="text-foreground/65 mt-4 text-sm">
          Förderung nicht eingerechnet. Das bisherige Heizsystem basiert auf den ausgewiesenen
          Modellannahmen.
        </p>
      </div>

            {result.technicalReviewRecommended ? (
        <div className="border-border-default bg-surface mt-6 rounded-2xl border p-6">
          <h2 className="text-brand-primary font-semibold">Technische Prüfung besonders wichtig</h2>

          <p className="text-foreground/70 mt-2 leading-7">
            Die gewählte Vorlauftemperatur liegt außerhalb unseres Niedertemperatur- Modellbereichs.
            Heizflächen, hydraulische Bedingungen und mögliche Maßnahmen am Gebäude sollten vor
            einer Entscheidung genauer geprüft werden.
                    </p>
                </div>
            ) : null}

      <AdditionalEnergySolutions currentProduct="heat_pump" />

            <ConfiguratorJourneyActions
                currentConfigurator="heat_pump"
        nextConfigurator={nextConfigurator}
                onBack={onBack}
                onContinue={onContinue}
            />

      <p className="text-foreground/60 mt-6 text-sm leading-6">
        Diese Berechnung ist eine unverbindliche Modellorientierung. Sie ersetzt keine
        Heizlastberechnung, technische Vor-Ort-Prüfung oder verbindliche Planung.
            </p>
        </section>
    );
}
