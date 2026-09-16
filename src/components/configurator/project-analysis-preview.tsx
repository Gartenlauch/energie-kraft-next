"use client";

import { calculateProjectEconomics } from "@/lib/configurator/project-economics";
import { useConfigurator } from "@/lib/configurator/configurator-context";

const currency = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function getSystemRecommendation(state: ReturnType<typeof useConfigurator>["state"]) {
  const pv = state.results.photovoltaic;
  if (pv) {
    return {
      value: `${pv.recommendedPowerKwpMin.toLocaleString("de-DE")}–${pv.recommendedPowerKwpMax.toLocaleString("de-DE")} kWp`,
      label: "Empfohlene PV-Anlagenklasse",
    };
  }
  const heatPump = state.results.heatPump;
  if (heatPump) {
    return {
      value: `${heatPump.recommendedHeatPumpCapacityKw.toLocaleString("de-DE")} kW`,
      label: "Empfohlene Wärmepumpenleistung",
    };
  }
  const climate = state.results.climate;
  if (climate) {
    return {
      value: `${climate.recommendedCoolingCapacityKw.toLocaleString("de-DE")} kW`,
      label: "Empfohlene Kühlleistung",
    };
  }
  const storage = state.results.batteryStorage;
  if (storage) {
    return {
      value: `${storage.recommendedUsableCapacityKwhMin.toLocaleString("de-DE")}–${storage.recommendedUsableCapacityKwhMax.toLocaleString("de-DE")} kWh`,
      label: "Empfohlene Speicherkapazität",
    };
  }
  const wallbox = state.results.wallbox;
  return wallbox
    ? {
        value: `${wallbox.calculationInput.chargingPowerKw.toLocaleString("de-DE")} kW`,
        label: "Gewählte Ladeleistung",
      }
    : null;
}

const MODULES = [
  "Investitionsübersicht",
  "Wirtschaftlichkeitsanalyse",
  "Energiefluss",
  "Betriebskostenvergleich",
  "Technische nächste Schritte",
] as const;

export function ProjectAnalysisPreview() {
  const { state } = useConfigurator();
  const economics = calculateProjectEconomics(state);
  const recommendation = getSystemRecommendation(state);
  const modules = [
    MODULES[0],
    `${state.settings.economics.projectHorizonYears}-Jahres-Projektion`,
    ...MODULES.slice(1),
  ];

  return (
    <section
      aria-labelledby="project-analysis-preview-heading"
      className="bg-brand-navy relative mt-2 overflow-hidden rounded-[1.75rem] px-6 py-7 text-white sm:px-8 sm:py-9"
    >
      <div aria-hidden="true" className="absolute -top-20 -right-16 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="relative">
        <p className="text-sm font-semibold tracking-[0.16em] text-cyan-200 uppercase">
          Deine Analyse ist vorbereitet
        </p>
        <h2 id="project-analysis-preview-heading" className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
          Dein Energieprojekt – verständlich ausgewertet und als persönliche PDF aufbereitet.
        </h2>

        <div className="mt-7 grid gap-px overflow-hidden rounded-2xl bg-white/15 sm:grid-cols-2">
          {recommendation ? (
            <div className="bg-white/[0.07] p-5 sm:p-6">
              <p className="text-2xl font-semibold text-white sm:text-3xl">{recommendation.value}</p>
              <p className="mt-2 text-sm leading-6 text-white/65">{recommendation.label}</p>
            </div>
          ) : null}
          <div className="bg-white/[0.07] p-5 sm:p-6">
            <p className="text-2xl font-semibold text-white sm:text-3xl">
              {economics.investmentMinEuro === null || economics.investmentMaxEuro === null
                ? "Individuelle Kalkulation"
                : `${currency.format(economics.investmentMinEuro)}–${currency.format(economics.investmentMaxEuro)}`}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/65">Modellierter Projektkosten-Korridor</p>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {modules.map((module) => (
            <div key={module} className="flex min-h-11 items-center gap-3 border-b border-white/10 py-2 text-sm text-white/80">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 3.75h9l3 3V20.25H6z" />
                <path d="M15 3.75v3h3M9 11h6M9 15h6" />
              </svg>
              <span>{module}</span>
              <span className="ml-auto text-xs text-cyan-200">In deiner PDF</span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm leading-6 text-white/60">
          Auf Basis deiner Angaben. Unverbindliche Modellorientierung, keine technische Planung und kein Angebot.
        </p>
      </div>
    </section>
  );
}
