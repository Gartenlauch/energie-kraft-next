"use client";

import { useConfigurator } from "@/lib/configurator/configurator-context";

export type ConfiguratorProcessPhase = "configuration" | "contact" | "submit";

interface ConfiguratorPhaseIndicatorProps {
  currentPhase: ConfiguratorProcessPhase;
  compact?: boolean;
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
  compact = false,
}: ConfiguratorPhaseIndicatorProps) {
  const currentIndex = phases.findIndex((phase) => phase.id === currentPhase);
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
    <nav aria-label="Fortschritt der Anfrage" className={compact ? "mb-6 sm:mb-9" : "mb-9"}>
      <ol className="grid gap-3 sm:grid-cols-3">
        {phases.map((phase, index) => {
          const active = phase.id === currentPhase;

          const completed = index < currentIndex;

          return (
            <li
              key={phase.id}
              aria-current={active ? "step" : undefined}
              className={[
                "rounded-xl border px-4 py-3 transition",
                active
                  ? "border-brand-accent-strong bg-cyan-50/60 shadow-[var(--shadow-sm)]"
                  : completed
                    ? "border-brand-primary/25 bg-surface"
                    : "border-border-default bg-background",
                compact && !active ? "hidden sm:block" : "",
              ].join(" ")}
            >
              <span className="text-brand-primary block text-xs font-semibold">
                {compact && active ? (
                  <>
                    <span className="sm:hidden">
                      Schritt {phase.number} von {phases.length}
                    </span>
                    <span className="hidden sm:inline">
                      {phase.number.toString().padStart(2, "0")}
                    </span>
                  </>
                ) : (
                  phase.number.toString().padStart(2, "0")
                )}
              </span>

              <span className="text-brand-primary mt-1 block font-semibold">{phase.label}</span>
            </li>
          );
        })}
      </ol>
      {showRoadmap ? (
        <div className="mt-4 hidden overflow-x-auto pb-1 sm:block">
          <ol className="flex min-w-max items-center gap-2 text-sm" aria-label="Produktfortschritt">
            {state.journey.selectedProducts.map((product, index) => {
              const completed = state.journey.completedProducts.includes(product);
              const active =
                currentPhase === "configuration" && state.activeConfigurator === product;
              return (
                <li key={product} className="flex items-center gap-2">
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-foreground/35">
                      →
                    </span>
                  ) : null}
                  <span
                    aria-current={active ? "step" : undefined}
                    className={
                      active
                        ? "text-brand-primary font-semibold"
                        : completed
                          ? "text-emerald-700"
                          : "text-foreground/60"
                    }
                  >
                    {productLabels[product]}{" "}
                    {completed ? <span aria-label="abgeschlossen">✓</span> : null}
                  </span>
                </li>
              );
            })}
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="text-foreground/35">
                →
              </span>
              <span
                className={
                  currentPhase === "contact"
                    ? "text-brand-primary font-semibold"
                    : "text-foreground/60"
                }
              >
                Kontaktdaten
              </span>
            </li>
          </ol>
        </div>
      ) : null}
    </nav>
  );
}
