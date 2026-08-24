import type {
  BuildingConfiguratorState,
  ConfiguratorInterests,
  ConfiguratorNotes,
  ConfiguratorState,
  HouseholdConfiguratorState,
  PhotovoltaicConfiguratorResult,
  RoofConfiguratorState,
} from "./state";

export interface ConfiguratorContactFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  installationAtResidence: boolean | null;

  street: string;
  postalCode: string;
  city: string;

  privacyAccepted: boolean;

  /**
   * Honeypot. Muss für echte Benutzer leer bleiben.
   */
  website: string;
}

export interface ConfiguratorLeadContact {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface ConfiguratorInstallationLocation {
  atResidence: boolean;
  street: string;
  postalCode: string;
  city: string;
}

export interface PhotovoltaicConfiguratorLeadAnswers {
  household: HouseholdConfiguratorState;
  building: BuildingConfiguratorState;
  roof: RoofConfiguratorState;
  interests: ConfiguratorInterests;
  notes: ConfiguratorNotes;
}

export interface SubmitPhotovoltaicConfiguratorLeadInput {
  type: "configurator";

  configurator: {
    type: "photovoltaic";
    answers: PhotovoltaicConfiguratorLeadAnswers;
    result: PhotovoltaicConfiguratorResult;
  };

  contact: ConfiguratorLeadContact;

  installation: ConfiguratorInstallationLocation;

  privacyAccepted: boolean;

  website?: string;
  formStartedAt: number;
}

export interface SubmitConfiguratorLeadResult {
  ok: true;
  leadId: string;
  mailStatus?: "accepted" | "failed";
}

export function hasPhotovoltaicConfiguratorResult(
  state: ConfiguratorState,
): state is ConfiguratorState & {
  results: {
    photovoltaic: PhotovoltaicConfiguratorResult;
  };
} {
  return state.results.photovoltaic !== undefined;
}