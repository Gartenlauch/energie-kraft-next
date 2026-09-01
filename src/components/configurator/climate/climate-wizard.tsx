"use client";

import { useState } from "react";
import { ConfiguratorLeadFlow } from "@/components/configurator/configurator-lead-flow";
import { ClimateInsulationStep } from "@/components/configurator/climate/climate-insulation-step";
import { ClimateOccupancyStep } from "@/components/configurator/climate/climate-occupancy-step";
import { ClimateResult } from "@/components/configurator/climate/climate-result";
import { ClimateRoomsStep } from "@/components/configurator/climate/climate-rooms-step";
import { ClimateSolarLoadStep } from "@/components/configurator/climate/climate-solar-load-step";
import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";
import { climateWizardSteps } from "@/content/configurators";
import { buildClimateConfiguratorResult } from "@/lib/configurator/climate";
import { useConfigurator } from "@/lib/configurator/configurator-context";
import { isClimateStepComplete } from "@/lib/validation/configurator/climate";
import { getNextConfiguratorProduct } from "@/lib/configurator/journey";
import type { ClimateStepId } from "@/types/configurator";

export function ClimateWizard() {
    const {
        state,
        dispatch,
    } = useConfigurator();

    const [currentStepId, setCurrentStepId] =
        useState<ClimateStepId>("rooms");

    const [showResult, setShowResult] =
        useState(
            () =>
                state.results.climate !==
                undefined,
        );

    const currentStepIndex =
        climateWizardSteps.findIndex(
            (step) =>
                step.id === currentStepId,
        );

    const currentStep =
        currentStepIndex >= 0
            ? climateWizardSteps[
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
                    Der aktuelle Klimaanlagen-Schritt ist nicht
                    verfügbar.
                </p>
            </div>
        );
    }

    const isFirstStep =
        currentStepIndex === 0;

    const isLastStep =
        currentStepIndex ===
        climateWizardSteps.length - 1;

    const currentStepComplete =
        isClimateStepComplete(
            currentStep.id,
            state,
        );

    function goBack() {
        if (isFirstStep) {
            return;
        }

        const previousStep =
            climateWizardSteps[
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
                buildClimateConfiguratorResult(
                    state,
                );

            if (!result) {
                return;
            }

            dispatch({
                type: "SET_CLIMATE_RESULT",
                payload: result,
            });

            setShowResult(true);

            return;
        }

        const nextStep =
            climateWizardSteps[
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
                configuratorType="climate"
                renderResult={(onContinue) => {
                    const result =
                        state.results.climate;

                    if (!result) {
                        return (
                            <div
                                role="alert"
                                className="rounded-2xl border border-border-default bg-surface p-6"
                            >
                                Das Klimaanlagen-Ergebnis ist nicht
                                mehr verfügbar.
                            </div>
                        );
                    }
                    const nextConfigurator =
                        getNextConfiguratorProduct(
                            state.journey,
                            "climate",
                        );

                    return (
                        <ClimateResult
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
                        "rooms",
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

            <section aria-labelledby="climate-step-heading">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold tracking-widest text-brand-secondary uppercase">
                        Klimaanlage
                    </p>

                    <p className="text-sm text-foreground/60">
                        Schritt {currentStepIndex + 1} von{" "}
                        {climateWizardSteps.length}
                    </p>
                </div>

                <h1
                    id="climate-step-heading"
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
                    {currentStep.id === "rooms" ? (
                        <ClimateRoomsStep
                            conditionedAreaM2={
                                state.climate
                                    .conditionedAreaM2
                            }
                            roomCount={
                                state.climate.roomCount
                            }
                            onConditionedAreaChange={(
                                value,
                            ) =>
                                dispatch({
                                    type: "UPDATE_CLIMATE",
                                    payload: {
                                        conditionedAreaM2:
                                            value,
                                    },
                                })
                            }
                            onRoomCountChange={(value) =>
                                dispatch({
                                    type: "UPDATE_CLIMATE",
                                    payload: {
                                        roomCount: value,
                                    },
                                })
                            }
                        />
                    ) : null}

                    {currentStep.id ===
                        "insulation" ? (
                        <ClimateInsulationStep
                            value={
                                state.climate
                                    .insulationLevel
                            }
                            onChange={(value) =>
                                dispatch({
                                    type: "UPDATE_CLIMATE",
                                    payload: {
                                        insulationLevel:
                                            value,
                                    },
                                })
                            }
                        />
                    ) : null}

                    {currentStep.id ===
                        "solar_load" ? (
                        <ClimateSolarLoadStep
                            value={
                                state.climate.solarLoad
                            }
                            onChange={(value) =>
                                dispatch({
                                    type: "UPDATE_CLIMATE",
                                    payload: {
                                        solarLoad: value,
                                    },
                                })
                            }
                        />
                    ) : null}

                    {currentStep.id ===
                        "occupancy" ? (
                        <ClimateOccupancyStep
                            value={
                                state.climate
                                    .occupancyPersons
                            }
                            onChange={(value) =>
                                dispatch({
                                    type: "UPDATE_CLIMATE",
                                    payload: {
                                        occupancyPersons:
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