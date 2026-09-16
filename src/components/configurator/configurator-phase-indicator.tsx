"use client";

import { useConfigurator } from "@/lib/configurator/configurator-context";

export type ConfiguratorProcessPhase =
  | "configuration"
  | "contact"
  | "submit";

interface ConfiguratorPhaseIndicatorProps {
  currentPhase: ConfiguratorProcessPhase;
}

const phases = [
  {
    id: "configuration",
    number: 1,
    label: "Energiesystem konfigurieren",
  },
  {
    id: "contact",
    number: 2,
    label: "Kontaktdaten",
  },
  {
    id: "submit",
    number: 3,
    label: "Projektanalyse erhalten",
  },
] as const;

export function ConfiguratorPhaseIndicator({
  currentPhase,
}: ConfiguratorPhaseIndicatorProps) {
  const currentIndex = phases.findIndex(
    (phase) => phase.id === currentPhase,
  );
  const { state } = useConfigurator();
  const showRoadmap =
    state.journey.additionalSolutionsReviewed && state.journey.selectedProducts.length > 1;
  const productLabels = {
    photovoltaic: "Photovoltaik",
    battery_storage: "Stromspeicher",
    heat_pump: "Wärmepumpe",
    climate: "Klimaanlage",
    wallbox: "Wallbox",
  } as const;

  return (
    <nav
      aria-label="Fortschritt der Anfrage"
      className="mb-9"
    >
      <ol className="grid gap-3 sm:grid-cols-3">
        {phases.map((phase, index) => {
          const active =
            phase.id === currentPhase;

          const completed =
            index < currentIndex;

          return (
            <li
              key={phase.id}
              aria-current={
                active ? "step" : undefined
              }
              className={[
                "rounded-xl border px-4 py-3 transition",
                active
                  ? "border-brand-accent-strong bg-cyan-50/60 shadow-[var(--shadow-sm)]"
                  : completed
                    ? "border-brand-primary/25 bg-surface"
                    : "border-border-default bg-background",
              ].join(" ")}
            >
              <span className="block text-xs font-semibold text-brand-primary">
                {phase.number.toString().padStart(2, "0")}
              </span>

              <span className="mt-1 block font-semibold text-brand-primary">
                {phase.label}
              </span>
            </li>
          );
        })}
      </ol>
      {showRoadmap ? (
        <div className="mt-4 overflow-x-auto pb-1">
          <ol className="flex min-w-max items-center gap-2 text-sm" aria-label="Produktfortschritt">
            {state.journey.selectedProducts.map((product, index) => {
              const completed = state.journey.completedProducts.includes(product);
              const active = currentPhase === "configuration" && state.activeConfigurator === product;
              return (
                <li key={product} className="flex items-center gap-2">
                  {index > 0 ? <span aria-hidden="true" className="text-foreground/35">→</span> : null}
                  <span
                    aria-current={active ? "step" : undefined}
                    className={active ? "font-semibold text-brand-primary" : completed ? "text-emerald-700" : "text-foreground/60"}
                  >
                    {productLabels[product]} {completed ? <span aria-label="abgeschlossen">✓</span> : null}
                  </span>
                </li>
              );
            })}
            <li className="flex items-center gap-2"><span aria-hidden="true" className="text-foreground/35">→</span><span className={currentPhase === "contact" ? "font-semibold text-brand-primary" : "text-foreground/60"}>Kontaktdaten</span></li>
          </ol>
        </div>
      ) : null}
    </nav>
  );
}
