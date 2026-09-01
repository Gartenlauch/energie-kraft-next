"use client";

import { useState } from "react";

import { ConfiguratorProgress } from "@/components/configurator/configurator-progress";
import { AnnualConsumptionStep } from "@/components/configurator/photovoltaic/annual-consumption-step";
import { BuildingTypeStep } from "@/components/configurator/photovoltaic/building-type-step";
import { HouseholdPersonsStep } from "@/components/configurator/photovoltaic/household-persons-step";
import { OwnershipStep } from "@/components/configurator/photovoltaic/ownership-step";
import { RoofMaterialStep } from "@/components/configurator/photovoltaic/roof-material-step";
import { RoofOrientationStep } from "@/components/configurator/photovoltaic/roof-orientation-step";
import { RoofPitchStep } from "@/components/configurator/photovoltaic/roof-pitch-step";
import { RoofRenovationStep } from "@/components/configurator/photovoltaic/roof-renovation-step";
import { TenantStop } from "@/components/configurator/photovoltaic/tenant-stop";
import { WizardActions } from "@/components/configurator/wizard-actions";
import { photovoltaicWizardSteps } from "@/content/configurators";
import { useConfigurator } from "@/lib/configurator/configurator-context";
import { buildPhotovoltaicConfiguratorResult, getPhotovoltaicHouseholdConsumptionDefault } from "@/lib/configurator/photovoltaic";
import { useConfiguratorWizard } from "@/lib/configurator/use-configurator-wizard";
import { isPhotovoltaicStepComplete } from "@/lib/validation/configurator/photovoltaic";
import { EnergySolutionsStep } from "@/components/configurator/photovoltaic/energy-solutions-step";
import { FutureConsumptionStep } from "@/components/configurator/photovoltaic/future-consumption-step";
import { NotesStep } from "@/components/configurator/photovoltaic/notes-step";
import { PhotovoltaicResult } from "@/components/configurator/photovoltaic/photovoltaic-result";
import { ConfiguratorContactForm } from "@/components/configurator/configurator-contact-form";
import { ConfiguratorSubmitSuccess } from "@/components/configurator/configurator-submit-success";
import { ConfiguratorSubmitReview } from "@/components/configurator/configurator-submit-review";
import { buildConfiguratorLeadInput } from "@/lib/configurator/lead";
import { submitConfiguratorLead } from "@/lib/leads/submit-configurator-lead";
import { configuratorLeadInputSchema } from "@/lib/validation/configurator/lead";
import { getNextConfiguratorProduct } from "@/lib/configurator/journey";

import type {
  BuildingOwnership,
  BuildingType,
  HouseholdPersons,
  PhotovoltaicStepId,
  RoofMaterial,
  RoofOrientation,
  RoofPitch,
  RoofRenovationPeriod,
  PhotovoltaicEnergySolution,
  ConfiguratorContactFormValues,
  SubmitConfiguratorLeadInput,
} from "@/types/configurator";

export function PhotovoltaicWizard() {
  const {
    state,
    dispatch,
    reset,
    isHydrated,
  } = useConfigurator();

  const {
    currentStepId,
    isFirstStep,
    isLastStep,
    goNext,
    goBack,
    goTo,
  } = useConfiguratorWizard<PhotovoltaicStepId>(
    photovoltaicWizardSteps,
    "household_persons",
  );

  const [showTenantStop, setShowTenantStop] = useState(false);
  type PostWizardStage =
    | "result"
    | "contact"
    | "submit"
    | "success";

  const [postWizardStage, setPostWizardStage] =
    useState<PostWizardStage | null>(null);

  const [contactDraft, setContactDraft] =
    useState<ConfiguratorContactFormValues | null>(
      null,
    );

  const [
    contactFormStartedAt,
    setContactFormStartedAt,
  ] = useState<number | null>(null);

  const [submittedLeadId, setSubmittedLeadId] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submissionError, setSubmissionError] =
    useState<string | null>(null);

  if (!isHydrated) {
    return (
      <div
        className="rounded-2xl border border-border-default bg-surface p-8"
        aria-busy="true"
      >
        <p className="font-medium text-brand-primary">
          Konfigurator wird vorbereitet …
        </p>
      </div>
    );
  }

  const currentStepComplete =
    isPhotovoltaicStepComplete(
      currentStepId,
      state,
    );

  function activatePhotovoltaic() {
    if (state.activeConfigurator === "photovoltaic") {
      return;
    }

    dispatch({
      type: "SET_ACTIVE_CONFIGURATOR",
      payload: "photovoltaic",
    });
  }

  function handlePersonsSelect(
    persons: HouseholdPersons,
  ) {
    activatePhotovoltaic();

    dispatch({
      type: "UPDATE_HOUSEHOLD",
      payload: {
        persons,
        annualConsumptionKwh:
          getPhotovoltaicHouseholdConsumptionDefault(
            persons,
          ),
      },
    });
  }

  function handleOwnershipSelect(
    ownership: BuildingOwnership,
  ) {
    activatePhotovoltaic();

    dispatch({
      type: "UPDATE_BUILDING",
      payload: {
        ownership,
      },
    });
  }

  function handleBuildingTypeSelect(
    buildingType: BuildingType,
  ) {
    activatePhotovoltaic();

    dispatch({
      type: "UPDATE_BUILDING",
      payload: {
        type: buildingType,
      },
    });
  }

  function handleConsumptionChange(
    annualConsumptionKwh: number | undefined,
  ) {
    activatePhotovoltaic();

    dispatch({
      type: "UPDATE_HOUSEHOLD",
      payload: {
        annualConsumptionKwh,
      },
    });
  }

  function handleRoofPitchSelect(
    pitch: RoofPitch,
  ) {
    activatePhotovoltaic();

    dispatch({
      type: "UPDATE_ROOF",
      payload: {
        pitch,
      },
    });
  }

  function handleRoofMaterialSelect(
    material: RoofMaterial,
  ) {
    activatePhotovoltaic();

    dispatch({
      type: "UPDATE_ROOF",
      payload: {
        material,
      },
    });
  }

  function handleRoofOrientationSelect(
    orientation: RoofOrientation,
  ) {
    activatePhotovoltaic();

    dispatch({
      type: "UPDATE_ROOF",
      payload: {
        orientation,
      },
    });
  }

  function handleRoofRenovationSelect(
    renovationPeriod: RoofRenovationPeriod,
  ) {
    activatePhotovoltaic();

    dispatch({
      type: "UPDATE_ROOF",
      payload: {
        renovationPeriod,
      },
    });
  }

  function handleFutureIncreaseChange(
    futureIncreasePercent: number,
  ) {
    activatePhotovoltaic();

    dispatch({
      type: "UPDATE_HOUSEHOLD",
      payload: {
        futureIncreasePercent,
      },
    });
  }

  function handleEnergySolutionToggle(
    solution: PhotovoltaicEnergySolution,
  ) {
    activatePhotovoltaic();

    switch (solution) {
      case "batteryStorage":
        dispatch({
          type: "UPDATE_INTERESTS",
          payload: {
            batteryStorage:
              !state.interests.batteryStorage,
          },
        });
        break;

      case "wallbox":
        dispatch({
          type: "UPDATE_INTERESTS",
          payload: {
            wallbox:
              !state.interests.wallbox,
          },
        });
        break;

      case "heatPump":
        dispatch({
          type: "UPDATE_INTERESTS",
          payload: {
            heatPump:
              !state.interests.heatPump,
          },
        });
        break;

      case "climate":
        dispatch({
          type: "UPDATE_INTERESTS",
          payload: {
            climate:
              !state.interests.climate,
          },
        });
        break;
    }
  }

  function handleHasNotesChange(
    hasNotes: boolean,
  ) {
    activatePhotovoltaic();

    dispatch({
      type: "UPDATE_NOTES",
      payload: {
        hasNotes,
        ...(hasNotes
          ? {}
          : {
            text: "",
          }),
      },
    });
  }

  function handleNotesTextChange(text: string) {
    activatePhotovoltaic();

    dispatch({
      type: "UPDATE_NOTES",
      payload: {
        text,
      },
    });
  }

  function handleNext() {
    if (!currentStepComplete) {
      return;
    }

    if (
      currentStepId === "ownership" &&
      state.building.ownership === "tenant"
    ) {
      setShowTenantStop(true);
      return;
    }


    if (isLastStep) {
      const result =
        buildPhotovoltaicConfiguratorResult(state);

      if (!result) {
        return;
      }

      dispatch({
        type: "SET_PHOTOVOLTAIC_RESULT",
        payload: result,
      });

      setPostWizardStage("result");
      return;
    }

    goNext();
  }

  async function handleSubmitConfiguratorLead(
    input: SubmitConfiguratorLeadInput,
  ) {
    if (isSubmitting) {
      return;
    }

    const parsed = configuratorLeadInputSchema.safeParse(input)

    if (!parsed.success) {
      setSubmissionError(
        "Die Anfrage ist noch nicht vollständig. Bitte prüfe deine Angaben.",
      );
      return;
    }

    setSubmissionError(null);
    setIsSubmitting(true);

    try {
      const result =
        await submitConfiguratorLead(
          input,
        );

      setSubmittedLeadId(
        result.leadId,
      );

      /*
       * Technische Wizard-Daten erst nach
       * erfolgreicher Speicherung löschen.
       */
      reset();

      setPostWizardStage(
        "success",
      );
    } catch {
      setSubmissionError(
        "Deine Anfrage konnte momentan nicht übermittelt werden. Bitte versuche es erneut.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (showTenantStop) {
    return (
      <TenantStop
        onBack={() => setShowTenantStop(false)}
      />
    );
  }
  if (
    postWizardStage === "success" &&
    submittedLeadId
  ) {
    return (
      <ConfiguratorSubmitSuccess
        leadId={submittedLeadId}
        onRestart={() => {
          setSubmittedLeadId(null);
          setContactDraft(null);
          setContactFormStartedAt(null);
          setSubmissionError(null);
          setPostWizardStage(null);
          goTo("household_persons");
        }}
      />
    );
  }

  if (postWizardStage === "contact") {
    return (
      <ConfiguratorContactForm
        initialValues={
          contactDraft ?? undefined
        }
        initialFormStartedAt={
          contactFormStartedAt ??
          undefined
        }
        onBack={() =>
          setPostWizardStage("result")
        }
        onContinue={(
          values,
          formStartedAt,
        ) => {
          setContactDraft(values);
          setContactFormStartedAt(
            formStartedAt,
          );
          setSubmissionError(null);
          setPostWizardStage("submit");
        }}
      />
    );
  }

  if (
    postWizardStage === "submit" &&
    contactDraft &&
    contactFormStartedAt
  ) {
    const input =
      buildConfiguratorLeadInput(
        state,
        contactDraft,
        contactFormStartedAt,
      )

    if (!input) {
      return (
        <div
          role="alert"
          className="rounded-2xl border border-red-300 bg-red-50 p-6 text-red-800"
        >
          Die Anfrage konnte nicht vorbereitet werden.
          Bitte gehe zurück und prüfe deine Angaben.
        </div>
      );
    }

    return (
      <ConfiguratorSubmitReview
        input={input}
        isSubmitting={isSubmitting}
        error={submissionError}
        onBack={() =>
          setPostWizardStage("contact")
        }
        onSubmit={() => {
          void handleSubmitConfiguratorLead(
            input,
          );
        }}
      />
    );
  }

  if (
    postWizardStage === "result" &&
    state.results.photovoltaic
  ) {
    const nextConfigurator =
      getNextConfiguratorProduct(
        state.journey,
        "photovoltaic",
      );

    return (
      <PhotovoltaicResult
        result={
          state.results.photovoltaic
        }
        nextConfigurator={
          nextConfigurator
        }
        onBack={() =>
          setPostWizardStage(null)
        }
        onContinue={() =>
          setPostWizardStage("contact")
        }
      />
    );
  }


  return (
    <>
      <ConfiguratorProgress
        steps={photovoltaicWizardSteps}
        currentStepId={currentStepId}
      />

      {currentStepId === "household_persons" ? (
        <HouseholdPersonsStep
          selected={state.household.persons}
          onSelect={handlePersonsSelect}
        />
      ) : null}

      {currentStepId === "ownership" ? (
        <OwnershipStep
          selected={state.building.ownership}
          onSelect={handleOwnershipSelect}
        />
      ) : null}

      {currentStepId === "building_type" ? (
        <BuildingTypeStep
          selected={state.building.type}
          onSelect={handleBuildingTypeSelect}
        />
      ) : null}

      {currentStepId === "annual_consumption" ? (
        <AnnualConsumptionStep
          value={state.household.annualConsumptionKwh}
          onChange={handleConsumptionChange}
        />
      ) : null}

      {currentStepId === "roof_pitch" ? (
        <RoofPitchStep
          selected={state.roof.pitch}
          onSelect={handleRoofPitchSelect}
        />
      ) : null}

      {currentStepId === "roof_material" ? (
        <RoofMaterialStep
          selected={state.roof.material}
          onSelect={handleRoofMaterialSelect}
        />
      ) : null}

      {currentStepId === "roof_orientation" ? (
        <RoofOrientationStep
          selected={state.roof.orientation}
          onSelect={handleRoofOrientationSelect}
        />
      ) : null}

      {currentStepId === "roof_renovation" ? (
        <RoofRenovationStep
          selected={state.roof.renovationPeriod}
          onSelect={handleRoofRenovationSelect}
        />
      ) : null}

      {currentStepId === "future_consumption" ? (
        <FutureConsumptionStep
          annualConsumptionKwh={
            state.household.annualConsumptionKwh
          }
          futureIncreasePercent={
            state.household.futureIncreasePercent
          }
          projectedConsumptionKwh={
            state.household.projectedConsumptionKwh
          }
          onChange={handleFutureIncreaseChange}
        />
      ) : null}

      {currentStepId === "energy_solutions" ? (
        <EnergySolutionsStep
          interests={state.interests}
          onToggle={handleEnergySolutionToggle}
        />
      ) : null}

      {currentStepId === "notes" ? (
        <NotesStep
          hasNotes={state.notes.hasNotes}
          text={state.notes.text ?? ""}
          onHasNotesChange={handleHasNotesChange}
          onTextChange={handleNotesTextChange}
        />
      ) : null}

      <WizardActions
        onBack={isFirstStep ? undefined : goBack}
        onNext={handleNext}
        nextDisabled={!currentStepComplete}
        nextLabel={
          isLastStep
            ? "Weiter zum Ergebnis"
            : "Weiter"
        }
      />
    </>
  );
}