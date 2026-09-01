"use client";

import { useState } from "react";
import { ConfiguratorLeadFlow } from "@/components/configurator/configurator-lead-flow";
import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";
import { WallboxChargingPowerStep } from "@/components/configurator/wallbox/wallbox-charging-power-step";
import { WallboxHomeChargingStep } from "@/components/configurator/wallbox/wallbox-home-charging-step";
import { WallboxPhotovoltaicStep } from "@/components/configurator/wallbox/wallbox-photovoltaic-step";
import { WallboxResult } from "@/components/configurator/wallbox/wallbox-result";
import { WallboxVehicleDataStep } from "@/components/configurator/wallbox/wallbox-vehicle-data-step";
import { wallboxWizardSteps } from "@/content/configurators";
import { buildWallboxConfiguratorResult } from "@/lib/configurator/wallbox";
import { useConfigurator } from "@/lib/configurator/configurator-context";
import { isWallboxStepComplete } from "@/lib/validation/configurator/wallbox";
import { getNextConfiguratorProduct } from "@/lib/configurator/journey";
import type { WallboxStepId } from "@/types/configurator";

interface WallboxWizardProps {
  hasPhotovoltaicContext: boolean;
}

export function WallboxWizard({
  hasPhotovoltaicContext,
}: WallboxWizardProps) {
  const {
    state,
    dispatch,
  } = useConfigurator();

  const [currentStepId, setCurrentStepId] =
    useState<WallboxStepId>(
      "vehicle_data",
    );

  const [showResult, setShowResult] =
    useState(
      () =>
        state.results.wallbox !==
        undefined,
    );

  const currentStepIndex =
    wallboxWizardSteps.findIndex(
      (step) =>
        step.id === currentStepId,
    );

  const currentStep =
    currentStepIndex >= 0
      ? wallboxWizardSteps[
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
          Der aktuelle Wallbox-Schritt ist nicht
          verfügbar.
        </p>
      </div>
    );
  }

  const isFirstStep =
    currentStepIndex === 0;

  const isLastStep =
    currentStepIndex ===
    wallboxWizardSteps.length - 1;

  const currentStepComplete =
    isWallboxStepComplete(
      currentStep.id,
      state,
    );

  function goBack() {
    if (isFirstStep) {
      return;
    }

    const previousStep =
      wallboxWizardSteps[
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
        buildWallboxConfiguratorResult(
          state,
        );

      if (!result) {
        return;
      }

      dispatch({
        type: "SET_WALLBOX_RESULT",
        payload: result,
      });

      setShowResult(true);

      return;
    }

    const nextStep =
      wallboxWizardSteps[
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
        renderResult={(onContinue) => {
          const result =
            state.results.wallbox;

          if (!result) {
            return (
              <div
                role="alert"
                className="rounded-2xl border border-border-default bg-surface p-6"
              >
                Das Wallbox-Ergebnis ist nicht mehr
                verfügbar.
              </div>
            );
          }
          const nextConfigurator =
            getNextConfiguratorProduct(
              state.journey,
              "wallbox",
            );

          return (
            <WallboxResult
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
            "vehicle_data",
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

      <section aria-labelledby="wallbox-step-heading">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold tracking-widest text-brand-secondary uppercase">
            Wallbox
          </p>

          <p className="text-sm text-foreground/60">
            Schritt {currentStepIndex + 1} von{" "}
            {wallboxWizardSteps.length}
          </p>
        </div>

        <h1
          id="wallbox-step-heading"
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
            "vehicle_data" ? (
            <WallboxVehicleDataStep
              annualDrivingKm={
                state.wallbox
                  .annualDrivingKm
              }
              vehicleConsumptionKwhPer100Km={
                state.wallbox
                  .vehicleConsumptionKwhPer100Km
              }
              batteryCapacityKwh={
                state.wallbox
                  .batteryCapacityKwh
              }
              onAnnualDrivingKmChange={(
                value,
              ) =>
                dispatch({
                  type: "UPDATE_WALLBOX",
                  payload: {
                    annualDrivingKm:
                      value,
                  },
                })
              }
              onVehicleConsumptionChange={(
                value,
              ) =>
                dispatch({
                  type: "UPDATE_WALLBOX",
                  payload: {
                    vehicleConsumptionKwhPer100Km:
                      value,
                  },
                })
              }
              onBatteryCapacityChange={(
                value,
              ) =>
                dispatch({
                  type: "UPDATE_WALLBOX",
                  payload: {
                    batteryCapacityKwh:
                      value,
                  },
                })
              }
            />
          ) : null}

          {currentStep.id ===
            "home_charging" ? (
            <WallboxHomeChargingStep
              value={
                state.wallbox
                  .homeChargingSharePercent
              }
              onChange={(value) =>
                dispatch({
                  type: "UPDATE_WALLBOX",
                  payload: {
                    homeChargingSharePercent:
                      value,
                  },
                })
              }
            />
          ) : null}

          {currentStep.id ===
            "charging_power" ? (
            <WallboxChargingPowerStep
              value={
                state.wallbox
                  .chargingPowerKw
              }
              onChange={(value) =>
                dispatch({
                  type: "UPDATE_WALLBOX",
                  payload: {
                    chargingPowerKw:
                      value,
                  },
                })
              }
            />
          ) : null}

          {currentStep.id ===
            "photovoltaics" ? (
            <WallboxPhotovoltaicStep
              value={
                state.wallbox
                  .pvChargingSharePercent
              }
              hasPhotovoltaicContext={
                hasPhotovoltaicContext
              }
              onChange={(value) =>
                dispatch({
                  type: "UPDATE_WALLBOX",
                  payload: {
                    pvChargingSharePercent:
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
            disabled={
              !currentStepComplete
            }
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