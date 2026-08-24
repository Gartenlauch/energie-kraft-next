"use client";

import { useState } from "react";

import {
  getConfiguratorStepIndex,
  getNextConfiguratorStepId,
  getPreviousConfiguratorStepId,
} from "@/lib/configurator/wizard-navigation";
import type { ConfiguratorStepDefinition } from "@/types/configurator";

export function useConfiguratorWizard<TStepId extends string>(
  steps: readonly ConfiguratorStepDefinition[],
  initialStepId: TStepId,
) {
  const [currentStepId, setCurrentStepId] =
    useState<TStepId>(initialStepId);

  const currentIndex = Math.max(
    getConfiguratorStepIndex(steps, currentStepId),
    0,
  );

  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === steps.length - 1;

  function goNext() {
    const nextStepId = getNextConfiguratorStepId(
      steps,
      currentStepId,
    ) as TStepId | null;

    if (nextStepId) {
      setCurrentStepId(nextStepId);
    }
  }

  function goBack() {
    const previousStepId = getPreviousConfiguratorStepId(
      steps,
      currentStepId,
    ) as TStepId | null;

    if (previousStepId) {
      setCurrentStepId(previousStepId);
    }
  }

  function goTo(stepId: TStepId) {
    setCurrentStepId(stepId);
  }

  return {
    currentStepId,
    currentIndex,
    isFirstStep,
    isLastStep,
    goNext,
    goBack,
    goTo,
  };
}