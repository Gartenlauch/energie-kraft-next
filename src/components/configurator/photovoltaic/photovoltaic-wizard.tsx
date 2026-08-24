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
import { AdditionalInterestsStep } from "@/components/configurator/photovoltaic/additional-interests-step";
import { BatteryStorageStep } from "@/components/configurator/photovoltaic/battery-storage-step";
import { FutureConsumptionStep } from "@/components/configurator/photovoltaic/future-consumption-step";
import { NotesStep } from "@/components/configurator/photovoltaic/notes-step";
import { PhotovoltaicResult } from "@/components/configurator/photovoltaic/photovoltaic-result";

import type {
  BuildingOwnership,
  BuildingType,
  HouseholdPersons,
  PhotovoltaicStepId,
  RoofMaterial,
  RoofOrientation,
  RoofPitch,
  RoofRenovationPeriod,
  ConfiguratorInterests,
  PhotovoltaicAdditionalInterest,
} from "@/types/configurator";

export function PhotovoltaicWizard() {
  const {
    state,
    dispatch,
    isHydrated,
  } = useConfigurator();

  const {
    currentStepId,
    isFirstStep,
    isLastStep,
    goNext,
    goBack,
  } = useConfiguratorWizard<PhotovoltaicStepId>(
    photovoltaicWizardSteps,
    "household_persons",
  );

  const [showTenantStop, setShowTenantStop] = useState(false);
  const [showResult, setShowResult] = useState(false);

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

  function handleBatteryStorageChange(
    batteryStorage: boolean,
  ) {
    activatePhotovoltaic();

    dispatch({
      type: "UPDATE_INTERESTS",
      payload: {
        batteryStorage,
      },
    });
  }

  function handleAdditionalInterestToggle(
    interest: PhotovoltaicAdditionalInterest,
  ) {
    activatePhotovoltaic();

    let payload: Partial<ConfiguratorInterests>;

    switch (interest) {
      case "climate":
        payload = {
          climate: !state.interests.climate,
        };
        break;

      case "heatPump":
        payload = {
          heatPump: !state.interests.heatPump,
        };
        break;

      case "wallbox":
        payload = {
          wallbox: !state.interests.wallbox,
        };
        break;
    }

    dispatch({
      type: "UPDATE_INTERESTS",
      payload,
    });
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

      setShowResult(true);
      return;
    }

    goNext();
  }

  if (showTenantStop) {
    return (
      <TenantStop
        onBack={() => setShowTenantStop(false)}
      />
    );
  }
  if (showResult && state.results.photovoltaic) {
  return (
    <PhotovoltaicResult
      result={state.results.photovoltaic}
      onBack={() => setShowResult(false)}
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

      {currentStepId === "battery_storage" ? (
        <BatteryStorageStep
          selected={state.interests.batteryStorage}
          onChange={handleBatteryStorageChange}
        />
      ) : null}

      {currentStepId === "additional_interests" ? (
        <AdditionalInterestsStep
          interests={state.interests}
          onToggle={handleAdditionalInterestToggle}
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