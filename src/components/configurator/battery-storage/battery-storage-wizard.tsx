"use client";

import { useState } from "react";
import { ConfiguratorLeadFlow } from "@/components/configurator/configurator-lead-flow";
import { BatteryStorageBackupStep } from "./battery-storage-backup-step";
import { BatteryStorageConsumptionPatternStep } from "./battery-storage-consumption-pattern-step";
import { BatteryStorageGoalStep } from "./battery-storage-goal-step";
import { BatteryStorageResult } from "./battery-storage-result";
import { BatteryStorageSystemDataStep } from "./battery-storage-system-data-step";

import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";
import { batteryStorageWizardSteps } from "@/content/configurators";
import { buildBatteryStorageConfiguratorResult } from "@/lib/configurator/battery-storage";
import { useConfigurator } from "@/lib/configurator/configurator-context";
import { isBatteryStorageStepComplete } from "@/lib/validation/configurator/battery-storage";
import type {
  BatteryStoragePhotovoltaicHandoff,
  BatteryStorageStepDefinition,
  BatteryStorageStepId,
} from "@/types/configurator";
import { getNextConfiguratorProduct } from "@/lib/configurator/journey";
import { ProjectAnalysisPromise } from "@/components/configurator/project-analysis-promise";

interface BatteryStorageWizardProps {
  photovoltaicHandoff: BatteryStoragePhotovoltaicHandoff | null;
}

export function BatteryStorageWizard({ photovoltaicHandoff }: BatteryStorageWizardProps) {
  const { state, dispatch } = useConfigurator();

  const steps: readonly BatteryStorageStepDefinition[] = photovoltaicHandoff
    ? batteryStorageWizardSteps.filter((step) => step.id !== "system_data")
      : batteryStorageWizardSteps;

  const initialStepId: BatteryStorageStepId = photovoltaicHandoff
      ? "consumption_pattern"
      : "system_data";

  const [currentStepId, setCurrentStepId] = useState<BatteryStorageStepId>(initialStepId);

  const [showResult, setShowResult] = useState(() => state.results.batteryStorage !== undefined);

  const currentStepIndex = steps.findIndex((step) => step.id === currentStepId);

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : undefined;

  if (!currentStep) {
    return (
      <div role="alert" className="border-border-default bg-surface rounded-2xl border p-6">
        <h1 className="text-brand-primary text-xl font-semibold">
          Konfiguration konnte nicht geladen werden
        </h1>

        <p className="text-foreground/70 mt-2 leading-7">
          Der aktuelle Schritt ist nicht verfügbar. Bitte starte den Stromspeicher-Konfigurator
          erneut.
        </p>
      </div>
    );
  }

  const isFirstStep = currentStepIndex === 0;

  const isLastStep = currentStepIndex === steps.length - 1;

  const currentStepComplete = isBatteryStorageStepComplete(currentStep.id, state);

  function goBack() {
    if (isFirstStep) {
      return;
    }

    const previousStep = steps[currentStepIndex - 1];

    if (!previousStep) {
      return;
    }

    setCurrentStepId(previousStep.id);
  }

  function handleNext() {
    if (!currentStepComplete) {
      return;
    }

    if (isLastStep) {
      const result = buildBatteryStorageConfiguratorResult(state);

      if (!result) {
        return;
      }

      dispatch({
        type: "SET_BATTERY_STORAGE_RESULT",
        payload: result,
      });

      setShowResult(true);

      return;
    }

    const nextStep = steps[currentStepIndex + 1];

    if (!nextStep) {
      return;
    }

    setCurrentStepId(nextStep.id);
  }

  if (showResult) {
    return (
      <ConfiguratorLeadFlow
        renderResult={(onContinue) => {
          const result = state.results.batteryStorage;

          if (!result) {
            return (
              <div role="alert" className="border-border-default bg-surface rounded-2xl border p-6">
                Das Stromspeicher-Ergebnis ist nicht mehr verfügbar.
              </div>
            );
          }
          const nextConfigurator = getNextConfiguratorProduct(state.journey, "battery_storage");

          return (
            <BatteryStorageResult
              result={result}
              nextConfigurator={nextConfigurator}
              onBack={() => setShowResult(false)}
              onContinue={onContinue}
            />
          );
        }}
        onRestart={() => {
          setShowResult(false);

          setCurrentStepId(initialStepId);
        }}
      />
    );
  }

  return (
    <>
      <ConfiguratorPhaseIndicator currentPhase="configuration" />

      {isFirstStep ? <ProjectAnalysisPromise compact /> : null}

      {photovoltaicHandoff ? (
        <div className="border-border-default bg-surface mb-8 rounded-2xl border p-5">
          <p className="text-brand-secondary text-sm font-semibold">PV-Daten übernommen</p>

          <p className="text-foreground/70 mt-2 text-sm leading-6">
            Verbrauch und empfohlene PV-Anlagenklasse stammen aus deiner vorherigen
            Photovoltaik-Konfiguration.
          </p>
        </div>
      ) : null}

      <section aria-labelledby="battery-storage-step-heading">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-brand-secondary text-sm font-semibold tracking-widest uppercase">
            Stromspeicher
          </p>

          <p className="text-foreground/60 text-sm">
            Schritt {currentStepIndex + 1} von {steps.length}
          </p>
        </div>

        <h1
          id="battery-storage-step-heading"
          className="text-brand-primary text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          {currentStep.title}
        </h1>

        {currentStep.description ? (
          <p className="text-foreground/70 mt-4 max-w-3xl text-base leading-7 sm:text-lg">
            {currentStep.description}
          </p>
        ) : null}

        <div className="mt-8">
          {currentStep.id === "system_data" ? (
            <BatteryStorageSystemDataStep
              annualConsumptionKwh={state.batteryStorage.annualConsumptionKwh}
              pvPowerKwp={state.batteryStorage.pvPowerKwp}
              onAnnualConsumptionChange={(value) =>
                dispatch({
                  type: "UPDATE_BATTERY_STORAGE",
                  payload: {
                    annualConsumptionKwh: value,
                  },
                })
              }
              onPvPowerChange={(value) =>
                dispatch({
                  type: "UPDATE_BATTERY_STORAGE",
                  payload: {
                    pvPowerKwp: value,
                  },
                })
              }
            />
          ) : null}

          {currentStep.id === "consumption_pattern" ? (
            <BatteryStorageConsumptionPatternStep
              value={state.batteryStorage.consumptionPattern}
              onChange={(value) =>
                dispatch({
                  type: "UPDATE_BATTERY_STORAGE",
                  payload: {
                    consumptionPattern: value,
                  },
                })
              }
            />
          ) : null}

          {currentStep.id === "backup_preference" ? (
            <BatteryStorageBackupStep
              value={state.batteryStorage.backupPreference}
              onChange={(value) =>
                dispatch({
                  type: "UPDATE_BATTERY_STORAGE",
                  payload: {
                    backupPreference: value,
                  },
                })
              }
            />
          ) : null}

          {currentStep.id === "goal" ? (
            <BatteryStorageGoalStep
              value={state.batteryStorage.goal}
              onChange={(value) =>
                dispatch({
                  type: "UPDATE_BATTERY_STORAGE",
                  payload: {
                    goal: value,
                  },
                })
              }
            />
          ) : null}
        </div>

        <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={isFirstStep}
            className="border-border-default text-brand-primary hover:bg-surface min-h-12 rounded-xl border px-6 py-3 font-medium transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            Zurück
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!currentStepComplete}
            className="bg-brand-primary min-h-12 rounded-xl px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLastStep ? "Ergebnis anzeigen" : "Weiter"}
          </button>
        </div>
      </section>
    </>
  );
}