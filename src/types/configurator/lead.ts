import type {
  BuildingConfiguratorState,
  BuildingType,
  ConfiguratorInterests,
  ConfiguratorNotes,
  ConfiguratorState,
  HouseholdConfiguratorState,
  HouseholdPersons,
  PhotovoltaicConfiguratorResult,
  RoofConfiguratorState,
  RoofMaterial,
  RoofOrientation,
  RoofPitch,
  RoofRenovationPeriod,
} from "./state";

import type { FirestoreTimestamp } from "@/types/firestore";
import type {
  LeadMailInfo,
  LeadStatus,
} from "@/types/lead";

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

export interface StoredPhotovoltaicConfiguratorAnswers {
  household: {
    persons: HouseholdPersons;
    annualConsumptionKwh: number;
    futureIncreasePercent: number;
    projectedConsumptionKwh: number;
  };

  building: {
    ownership: "owner";
    type: BuildingType;
  };

  roof: {
    pitch: RoofPitch;
    material: RoofMaterial;
    orientation: RoofOrientation;
    renovationPeriod: RoofRenovationPeriod;
  };

  interests: ConfiguratorInterests;

  notes: {
    hasNotes: boolean;
    text: string | null;
  };
}

export interface PhotovoltaicConfiguratorLeadDocument {
  type: "configurator";
  status: LeadStatus;

  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };

  installation: {
    atResidence: boolean;
    street: string;
    postalCode: string;
    city: string;
  };

  configurator: {
    type: "photovoltaic";
    answers: StoredPhotovoltaicConfiguratorAnswers;
    result: PhotovoltaicConfiguratorResult;
  };

  consent: {
    privacyAccepted: true;
    acceptedAt: FirestoreTimestamp;
  };

  meta: {
    source: "konfigurator/photovoltaik";
    schemaVersion: 1;
  };

  mail?: LeadMailInfo;

  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;

  updatedBy?: string;
}

export interface PhotovoltaicConfiguratorLead
  extends PhotovoltaicConfiguratorLeadDocument {
  id: string;
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