import type { ConfiguratorStepDefinition } from "@/types/configurator";

export function getConfiguratorStepIndex(
  steps: readonly ConfiguratorStepDefinition[],
  currentStepId: string,
): number {
  return steps.findIndex((step) => step.id === currentStepId);
}

export function getNextConfiguratorStepId(
  steps: readonly ConfiguratorStepDefinition[],
  currentStepId: string,
): string | null {
  const currentIndex = getConfiguratorStepIndex(
    steps,
    currentStepId,
  );

  if (currentIndex < 0) {
    return null;
  }

  return steps[currentIndex + 1]?.id ?? null;
}

export function getPreviousConfiguratorStepId(
  steps: readonly ConfiguratorStepDefinition[],
  currentStepId: string,
): string | null {
  const currentIndex = getConfiguratorStepIndex(
    steps,
    currentStepId,
  );

  if (currentIndex <= 0) {
    return null;
  }

  return steps[currentIndex - 1]?.id ?? null;
}