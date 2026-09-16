"use client";

import { useState } from "react";
import { ConfiguratorLeadFlow } from "@/components/configurator/configurator-lead-flow";
import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";
import { HeatPumpEfficiencyStep } from "@/components/configurator/heat-pump/heat-pump-efficiency-step";
import { HeatPumpExistingHeatingStep } from "@/components/configurator/heat-pump/heat-pump-existing-heating-step";
import { HeatPumpFlowTemperatureStep } from "@/components/configurator/heat-pump/heat-pump-flow-temperature-step";
import { HeatPumpHeatedAreaStep } from "@/components/configurator/heat-pump/heat-pump-heated-area-step";
import { HeatPumpHeatingDemandStep } from "@/components/configurator/heat-pump/heat-pump-heating-demand-step";
import { HeatPumpOccupancyStep } from "@/components/configurator/heat-pump/heat-pump-occupancy-step";
import { HeatPumpResult } from "@/components/configurator/heat-pump/heat-pump-result";
import { heatPumpWizardSteps } from "@/content/configurators";
import { buildHeatPumpConfiguratorResult } from "@/lib/configurator/heat-pump";
import { useConfigurator } from "@/lib/configurator/configurator-context";
import { isHeatPumpStepComplete } from "@/lib/validation/configurator/heat-pump";
import {
  getNextConfiguratorProduct,
  shouldReviewAdditionalEnergySolutions,
} from "@/lib/configurator/journey";
import type { HeatPumpStepId } from "@/types/configurator";
import { ProjectAnalysisPromise } from "@/components/configurator/project-analysis-promise";

export function HeatPumpWizard() {
  const { state, dispatch } = useConfigurator();

  const [currentStepId, setCurrentStepId] = useState<HeatPumpStepId>("existing_heating");

  const [showResult, setShowResult] = useState(() => state.results.heatPump !== undefined);

  const currentStepIndex = heatPumpWizardSteps.findIndex((step) => step.id === currentStepId);

  const currentStep = currentStepIndex >= 0 ? heatPumpWizardSteps[currentStepIndex] : undefined;

  if (!currentStep) {
    return (
      <div role="alert" className="border-border-default bg-surface rounded-2xl border p-6">
        <h1 className="text-brand-primary text-xl font-semibold">
          Konfiguration konnte nicht geladen werden
        </h1>

        <p className="text-foreground/70 mt-2">
          Der aktuelle Wärmepumpen-Schritt ist nicht verfügbar.
        </p>
      </div>
    );
  }

  const isFirstStep = currentStepIndex === 0;

  const isLastStep = currentStepIndex === heatPumpWizardSteps.length - 1;

  const currentStepComplete = isHeatPumpStepComplete(currentStep.id, state);

  function goBack() {
    if (isFirstStep) {
      return;
    }

    const previousStep = heatPumpWizardSteps[currentStepIndex - 1];

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
      const result = buildHeatPumpConfiguratorResult(state);

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

    const nextStep = heatPumpWizardSteps[currentStepIndex + 1];

    if (!nextStep) {
      return;
    }

    setCurrentStepId(nextStep.id);
  }

  if (showResult) {
    return (
      <ConfiguratorLeadFlow
        renderResult={(onContinue) => {
          const result = state.results.heatPump;

          if (!result) {
            return (
              <div role="alert" className="border-border-default bg-surface rounded-2xl border p-6">
                Das Wärmepumpen-Ergebnis ist nicht mehr verfügbar.
              </div>
            );
          }
          const nextConfigurator = getNextConfiguratorProduct(state.journey, "heat_pump");
          const reviewAdditionalSolutions = shouldReviewAdditionalEnergySolutions(
            state.journey,
            "heat_pump",
          );

          return (
            <HeatPumpResult
              result={result}
              nextConfigurator={nextConfigurator}
              onBack={() => setShowResult(false)}
              onContinue={onContinue}
              reviewAdditionalSolutions={reviewAdditionalSolutions}
              onAdditionalSolutionsReviewed={() =>
                dispatch({ type: "MARK_ADDITIONAL_SOLUTIONS_REVIEWED" })
              }
            />
          );
        }}
      />
    );
  }

  return (
    <>
      <ConfiguratorPhaseIndicator currentPhase="configuration" />

      {isFirstStep ? <ProjectAnalysisPromise compact /> : null}

      <section aria-labelledby="heat-pump-step-heading">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-brand-secondary text-sm font-semibold tracking-widest uppercase">
            Wärmepumpe
          </p>

          <p className="text-foreground/60 text-sm">
            Schritt {currentStepIndex + 1} von {heatPumpWizardSteps.length}
          </p>
        </div>

        <h1
          id="heat-pump-step-heading"
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
          {currentStep.id === "existing_heating" ? (
            <HeatPumpExistingHeatingStep
              selected={state.heatPump.existingHeatingSystem}
              annualGasConsumptionKwh={state.heatPump.annualGasConsumptionKwh}
              annualOilConsumptionLitres={state.heatPump.annualOilConsumptionLitres}
              onSelect={(value) =>
                dispatch({
                  type: "UPDATE_HEAT_PUMP",
                  payload: {
                    existingHeatingSystem: value,
                    ...(value === "gas" ? { annualOilConsumptionLitres: undefined } : {}),
                    ...(value === "oil" ? { annualGasConsumptionKwh: undefined } : {}),
                  },
                })
              }
              onGasConsumptionChange={(value) =>
                dispatch({ type: "UPDATE_HEAT_PUMP", payload: { annualGasConsumptionKwh: value } })
              }
              onOilConsumptionChange={(value) =>
                dispatch({ type: "UPDATE_HEAT_PUMP", payload: { annualOilConsumptionLitres: value } })
              }
            />
          ) : null}

          {currentStep.id === "heated_area" ? (
            <HeatPumpHeatedAreaStep
              value={state.heatPump.heatedAreaM2}
              onChange={(value) =>
                dispatch({
                  type: "UPDATE_HEAT_PUMP",
                  payload: {
                    heatedAreaM2: value,
                  },
                })
              }
            />
          ) : null}

          {currentStep.id === "heating_demand" ? (
            <HeatPumpHeatingDemandStep
              value={state.heatPump.specificSpaceHeatingDemandKwhPerM2Year}
              onChange={(value) =>
                dispatch({
                  type: "UPDATE_HEAT_PUMP",
                  payload: {
                    specificSpaceHeatingDemandKwhPerM2Year: value,
                  },
                })
              }
            />
          ) : null}

          {currentStep.id === "occupancy" ? (
            <HeatPumpOccupancyStep
              value={state.heatPump.occupancyPersons}
              onChange={(value) =>
                dispatch({
                  type: "UPDATE_HEAT_PUMP",
                  payload: {
                    occupancyPersons: value,
                  },
                })
              }
            />
          ) : null}

          {currentStep.id === "flow_temperature" ? (
            <HeatPumpFlowTemperatureStep
              value={state.heatPump.requiredFlowTemperatureC}
              onChange={(value) =>
                dispatch({
                  type: "UPDATE_HEAT_PUMP",
                  payload: {
                    requiredFlowTemperatureC: value,
                  },
                })
              }
            />
          ) : null}

          {currentStep.id === "efficiency" ? (
            <HeatPumpEfficiencyStep
              value={state.heatPump.annualPerformanceFactor}
              onChange={(value) =>
                dispatch({
                  type: "UPDATE_HEAT_PUMP",
                  payload: {
                    annualPerformanceFactor: value,
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
