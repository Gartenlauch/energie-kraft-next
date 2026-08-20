"use client";

interface WizardActionsProps {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  backLabel?: string;
}

export function WizardActions({
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = "Weiter",
  backLabel = "Zurück",
}: WizardActionsProps) {
  return (
    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="min-h-12 rounded-xl border border-border-default px-6 py-3 font-medium text-brand-primary hover:bg-surface"
        >
          {backLabel}
        </button>
      ) : (
        <span aria-hidden="true" />
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="min-h-12 rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {nextLabel}
      </button>
    </div>
  );
}