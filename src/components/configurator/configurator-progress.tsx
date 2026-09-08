import type { ConfiguratorStepDefinition } from "@/types/configurator";

interface ConfiguratorProgressProps {
  steps: readonly ConfiguratorStepDefinition[];
  currentStepId: string;
}

export function ConfiguratorProgress({
  steps,
  currentStepId,
}: ConfiguratorProgressProps) {
  if (steps.length === 0) {
    return null;
  }

  const foundIndex = steps.findIndex((step) => step.id === currentStepId);
  const currentIndex = foundIndex >= 0 ? foundIndex : 0;

  const currentStep = currentIndex + 1;
  const progress = Math.round((currentStep / steps.length) * 100);

  return (
    <div className="mb-9 rounded-xl border border-border-default bg-surface p-4 sm:p-5">
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <span className="font-semibold text-brand-navy">
          Schritt {currentStep} von {steps.length}
        </span>

        <span className="font-semibold text-brand-primary">{progress} %</span>
      </div>

      <div
        className="h-1.5 overflow-hidden rounded-full bg-surface-strong"
        role="progressbar"
        aria-label="Fortschritt im Konfigurator"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className="h-full rounded-full bg-brand-accent-strong transition-[width] duration-300"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}
