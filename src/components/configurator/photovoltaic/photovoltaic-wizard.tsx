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
import { getPhotovoltaicHouseholdConsumptionDefault } from "@/lib/configurator/photovoltaic";
import { useConfiguratorWizard } from "@/lib/configurator/use-configurator-wizard";
import { isPhotovoltaicStepComplete } from "@/lib/validation/configurator/photovoltaic";
import type {
  BuildingOwnership,
  BuildingType,
  HouseholdPersons,
  PhotovoltaicStepId,
  RoofMaterial,
  RoofOrientation,
  RoofPitch,
  RoofRenovationPeriod,
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

  const [showTenantStop, setShowTenantStop] =
    useState(false);

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

    if (!isLastStep) {
      goNext();
    }
  }

  if (showTenantStop) {
    return (
      <TenantStop
        onBack={() => setShowTenantStop(false)}
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

      <WizardActions
        onBack={isFirstStep ? undefined : goBack}
        onNext={handleNext}
        nextDisabled={
          !currentStepComplete || isLastStep
        }
        nextLabel={
          isLastStep
            ? "Weiter zu Verbrauch & Speicher"
            : "Weiter"
        }
      />
    </>
  );
}