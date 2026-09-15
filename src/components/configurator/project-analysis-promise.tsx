export function ProjectAnalysisPromise({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      className={
        compact
          ? "border-brand-accent-strong bg-surface mb-7 border-l-4 px-5 py-4"
          : "bg-brand-navy mb-8 overflow-hidden rounded-2xl px-6 py-6 text-white sm:px-8"
      }
    >
      <p
        className={
          compact
            ? "text-brand-primary text-sm font-semibold"
            : "text-sm font-semibold tracking-[0.14em] text-cyan-200 uppercase"
        }
      >
        Kostenlose persönliche Projektanalyse
      </p>
      <p
        className={
          compact
            ? "text-foreground/70 mt-2 text-sm leading-6"
            : "mt-3 max-w-3xl text-base leading-7 text-white/80"
        }
      >
        Nach deiner Konfiguration erhältst du eine personalisierte PDF mit ausgewählten Systemen,
        modellierten Projektkosten und Wirtschaftlichkeit, verständlichen Diagrammen, Annahmen und
        nächsten Schritten.
      </p>
      {!compact ? (
        <p className="mt-3 text-sm text-white/60">
          Unverbindliche Orientierung – keine technische Planung und kein Angebot.
        </p>
      ) : null}
    </aside>
  );
}
