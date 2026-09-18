"use client";

import { SegmentedEnergyBar } from "@/components/charts/energy-charts";
import { ConfiguratorJourneyActions } from "@/components/configurator/configurator-journey-actions";
import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";
import {
  ResultIntro,
  ResultMetric,
  euro,
  investment,
  number,
} from "@/components/configurator/result-presentation";
import { wallboxCalculatorContent } from "@/content/pages/wallbox-rechner";
import { useConfigurator } from "@/lib/configurator/configurator-context";
import { calculateProjectEconomics } from "@/lib/configurator/project-economics";
import type { ConfiguratorType, WallboxConfiguratorResult } from "@/types/configurator";

interface WallboxResultProps {
  result: WallboxConfiguratorResult;
  nextConfigurator: ConfiguratorType | null;
  onBack: () => void;
  onContinue: () => void;
}

export function WallboxResult({
  result,
  nextConfigurator,
  onBack,
  onContinue,
}: WallboxResultProps) {
  const { state } = useConfigurator();
  const cost = investment(calculateProjectEconomics(state), "wallbox");
  const recommendation =
    wallboxCalculatorContent.recommendationContent[result.systemRecommendation];
  const showEnergySplit =
    result.annualPvChargingEnergyKwh > 0 && result.annualGridChargingEnergyKwh > 0;

  return (
    <section aria-labelledby="wallbox-result-heading">
      <ConfiguratorPhaseIndicator currentPhase="configuration" compact />
      <ResultIntro
        id="wallbox-result-heading"
        eyebrow="Deine erste Orientierung"
        title="Deine Wallbox-Empfehlung"
        description="Bequem zu Hause laden und dein Fahrzeug für den nächsten Weg bereithalten. Die Wallbox wird passend zu Auto, Elektroinstallation und deinem Energiesystem eingeordnet."
      />

      <div className="bg-brand-navy mt-8 overflow-hidden rounded-[1.5rem] px-6 py-7 text-white sm:px-9 sm:py-9">
        <p className="text-sm font-semibold tracking-[0.14em] text-cyan-200 uppercase">
          Gewählte Ladeleistung
        </p>
        <p className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          {number(result.calculationInput.chargingPowerKw)} kW
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70">
          {recommendation.label}: {recommendation.description}
        </p>
      </div>

      <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
        <ResultMetric
          label="Modellierte Investition"
          value={cost === null ? "Nach technischer Prüfung" : euro(cost)}
        />
        <ResultMetric
          label="Heimladebedarf im Jahr"
          value={`${number(result.annualHomeChargingInputEnergyKwh, 0)} kWh`}
          note="Auf Basis deines angegebenen Fahr- und Ladeverhaltens."
        />
      </dl>

      {showEnergySplit ? (
        <div className="border-brand-primary/15 mt-9 border-t pt-7">
          <h2 className="text-brand-navy text-xl font-semibold">Woher kommt die Ladeenergie?</h2>
          <SegmentedEnergyBar
            segments={[
              { label: "PV-Strom", value: result.annualPvChargingEnergyKwh, color: "#0DA1D1" },
              { label: "Netzstrom", value: result.annualGridChargingEnergyKwh, color: "#91A4C4" },
            ]}
            unit="kWh/Jahr"
          />
          <p className="text-foreground/65 mt-3 text-sm leading-6">
            Die Anteile sind eine Modellorientierung. Tatsächliche PV-Nutzung hängt auch vom
            Ladezeitpunkt ab.
          </p>
        </div>
      ) : null}

      {result.technicalReviewRecommended ? (
        <p className="border-brand-secondary text-foreground/70 mt-8 border-l-4 pl-5 leading-7">
          Bei 22 kW prüfen wir Fahrzeug, Hausanschluss, Elektroinstallation und örtliche
          Voraussetzungen besonders sorgfältig.
        </p>
      ) : null}
      <ConfiguratorJourneyActions
        currentConfigurator="wallbox"
        nextConfigurator={nextConfigurator}
        onBack={onBack}
        onContinue={onContinue}
      />
      <p className="text-foreground/60 mt-6 text-sm leading-6">
        Unverbindliche Modellorientierung; tatsächliche Ladeleistung und Installation hängen von
        Fahrzeug und örtlichen Voraussetzungen ab.
      </p>
    </section>
  );
}
