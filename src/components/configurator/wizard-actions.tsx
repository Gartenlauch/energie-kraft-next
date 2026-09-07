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
          className="button-secondary min-w-32"
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
        className="button-primary min-w-32"
      >
        {nextLabel}
      </button>
    </div>
  );
}
