"use client";

import { useState } from "react";
import { ConfiguratorLeadFlow } from "@/components/configurator/configurator-lead-flow";
import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";
import { HeatPumpEfficiencyStep } from "@/components/configurator/heat-pump/heat-pump-efficiency-step";
import { HeatPumpFlowTemperatureStep } from "@/components/configurator/heat-pump/heat-pump-flow-temperature-step";
import { HeatPumpHeatedAreaStep } from "@/components/configurator/heat-pump/heat-pump-heated-area-step";
import { HeatPumpHeatingDemandStep } from "@/components/configurator/heat-pump/heat-pump-heating-demand-step";
import { HeatPumpOccupancyStep } from "@/components/configurator/heat-pump/heat-pump-occupancy-step";
import { HeatPumpResult } from "@/components/configurator/heat-pump/heat-pump-result";
import { heatPumpWizardSteps } from "@/content/configurators";
import { buildHeatPumpConfiguratorResult } from "@/lib/configurator/heat-pump";
import { useConfigurator } from "@/lib/configurator/configurator-context";
import { isHeatPumpStepComplete } from "@/lib/validation/configurator/heat-pump";
import { getNextConfiguratorProduct } from "@/lib/configurator/journey";
import type {
  HeatPumpStepId,
} from "@/types/configurator";

export function HeatPumpWizard() {
  const {
    state,
    dispatch,
  } = useConfigurator();

  const [currentStepId, setCurrentStepId] =
    useState<HeatPumpStepId>(
      "heated_area",
    );

  const [showResult, setShowResult] =
    useState(
      () =>
        state.results.heatPump !==
        undefined,
    );

  const currentStepIndex =
    heatPumpWizardSteps.findIndex(
      (step) =>
        step.id === currentStepId,
    );

  const currentStep =
    currentStepIndex >= 0
      ? heatPumpWizardSteps[
      currentStepIndex
      ]
      : undefined;

  if (!currentStep) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-border-default bg-surface p-6"
      >
        <h1 className="text-xl font-semibold text-brand-primary">
          Konfiguration konnte nicht geladen werden
        </h1>

        <p className="mt-2 text-foreground/70">
          Der aktuelle Wärmepumpen-Schritt ist nicht
          verfügbar.
        </p>
      </div>
    );
  }

  const isFirstStep =
    currentStepIndex === 0;

  const isLastStep =
    currentStepIndex ===
    heatPumpWizardSteps.length - 1;

  const currentStepComplete =
    isHeatPumpStepComplete(
      currentStep.id,
      state,
    );

  function goBack() {
    if (isFirstStep) {
      return;
    }

    const previousStep =
      heatPumpWizardSteps[
      currentStepIndex - 1
      ];

    if (!previousStep) {
      return;
    }

    setCurrentStepId(
      previousStep.id,
    );
  }

  function handleNext() {
    if (!currentStepComplete) {
      return;
    }

    if (isLastStep) {
      const result =
        buildHeatPumpConfiguratorResult(
          state,
        );

      if (!result) {
        return;
      }

      dispatch({
        type: "SET_HEAT_PUMP_RESULT",
        payload: result,
      });

      setShowResult(true);

      return;
    }

    const nextStep =
      heatPumpWizardSteps[
      currentStepIndex + 1
      ];

    if (!nextStep) {
      return;
    }

    setCurrentStepId(
      nextStep.id,
    );
  }

  if (showResult) {
    return (
      <ConfiguratorLeadFlow
        configuratorType="heat_pump"
        renderResult={(onContinue) => {
          const result =
            state.results.heatPump;

          if (!result) {
            return (
              <div
                role="alert"
                className="rounded-2xl border border-border-default bg-surface p-6"
              >
                Das Wärmepumpen-Ergebnis ist nicht
                mehr verfügbar.
              </div>
            );
          }
          const nextConfigurator =
            getNextConfiguratorProduct(
              state.journey,
              "heat_pump",
            );

          return (
            <HeatPumpResult
              result={result}
              nextConfigurator={
                nextConfigurator
              }
              onBack={() =>
                setShowResult(false)
              }
              onContinue={onContinue}
            />
          );
        }}
        onRestart={() => {
          setShowResult(false);

          setCurrentStepId(
            "heated_area",
          );
        }}
      />
    );
  }

  return (
    <>
      <ConfiguratorPhaseIndicator
        currentPhase="configuration"
      />

      <section aria-labelledby="heat-pump-step-heading">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold tracking-widest text-brand-secondary uppercase">
            Wärmepumpe
          </p>

          <p className="text-sm text-foreground/60">
            Schritt {currentStepIndex + 1} von{" "}
            {heatPumpWizardSteps.length}
          </p>
        </div>

        <h1
          id="heat-pump-step-heading"
          className="text-3xl font-semibold tracking-tight text-brand-primary sm:text-4xl"
        >
          {currentStep.title}
        </h1>

        {currentStep.description ? (
          <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/70 sm:text-lg">
            {currentStep.description}
          </p>
        ) : null}

        <div className="mt-8">
          {currentStep.id ===
            "heated_area" ? (
            <HeatPumpHeatedAreaStep
              value={
                state.heatPump
                  .heatedAreaM2
              }
              onChange={(value) =>
                dispatch({
                  type: "UPDATE_HEAT_PUMP",
                  payload: {
                    heatedAreaM2:
                      value,
                  },
                })
              }
            />
          ) : null}

          {currentStep.id ===
            "heating_demand" ? (
            <HeatPumpHeatingDemandStep
              value={
                state.heatPump
                  .specificSpaceHeatingDemandKwhPerM2Year
              }
              onChange={(value) =>
                dispatch({
                  type: "UPDATE_HEAT_PUMP",
                  payload: {
                    specificSpaceHeatingDemandKwhPerM2Year:
                      value,
                  },
                })
              }
            />
          ) : null}

          {currentStep.id ===
            "occupancy" ? (
            <HeatPumpOccupancyStep
              value={
                state.heatPump
                  .occupancyPersons
              }
              onChange={(value) =>
                dispatch({
                  type: "UPDATE_HEAT_PUMP",
                  payload: {
                    occupancyPersons:
                      value,
                  },
                })
              }
            />
          ) : null}

          {currentStep.id ===
            "flow_temperature" ? (
            <HeatPumpFlowTemperatureStep
              value={
                state.heatPump
                  .requiredFlowTemperatureC
              }
              onChange={(value) =>
                dispatch({
                  type: "UPDATE_HEAT_PUMP",
                  payload: {
                    requiredFlowTemperatureC:
                      value,
                  },
                })
              }
            />
          ) : null}

          {currentStep.id ===
            "efficiency" ? (
            <HeatPumpEfficiencyStep
              value={
                state.heatPump
                  .annualPerformanceFactor
              }
              onChange={(value) =>
                dispatch({
                  type: "UPDATE_HEAT_PUMP",
                  payload: {
                    annualPerformanceFactor:
                      value,
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
            className="min-h-12 rounded-xl border border-border-default px-6 py-3 font-medium text-brand-primary transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
          >
            Zurück
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!currentStepComplete}
            className="min-h-12 rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLastStep
              ? "Ergebnis anzeigen"
              : "Weiter"}
          </button>
        </div>
      </section>
    </>
  );
}