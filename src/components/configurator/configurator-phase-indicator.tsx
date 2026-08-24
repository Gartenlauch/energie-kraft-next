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
    label: "Angaben machen",
  },
  {
    id: "contact",
    number: 2,
    label: "Kontaktdaten",
  },
  {
    id: "submit",
    number: 3,
    label: "Anfrage absenden",
  },
] as const;

export function ConfiguratorPhaseIndicator({
  currentPhase,
}: ConfiguratorPhaseIndicatorProps) {
  const currentIndex = phases.findIndex(
    (phase) => phase.id === currentPhase,
  );

  return (
    <nav
      aria-label="Fortschritt der Anfrage"
      className="mb-8"
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
                "rounded-xl border px-4 py-3",
                active
                  ? "border-brand-accent bg-surface"
                  : completed
                    ? "border-border-default bg-surface"
                    : "border-border-default bg-background",
              ].join(" ")}
            >
              <span className="block text-xs font-semibold text-brand-secondary">
                {phase.number.toString().padStart(2, "0")}
              </span>

              <span className="mt-1 block font-semibold text-brand-primary">
                {phase.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}