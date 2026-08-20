import type { FirestoreTimestamp } from "@/types/firestore";

export const CONTACT_INTEREST_VALUES = [
    "photovoltaik",
    "stromspeicher",
    "wallbox",
    "klimaanlage",
    "waermepumpe",
    "sonstiges",
  ] as const;
  
  export type ContactInterest = (typeof CONTACT_INTEREST_VALUES)[number];
  
  export const CONTACT_PREFERENCE_VALUES = [
    "telefon",
    "email",
    "egal",
  ] as const;
  
  export type ContactPreference =
    (typeof CONTACT_PREFERENCE_VALUES)[number];
  
  export const BUILDING_TYPE_VALUES = [
    "einfamilienhaus",
    "mehrfamilienhaus",
    "gewerbe",
    "sonstiges",
  ] as const;
  
  export type BuildingType = (typeof BUILDING_TYPE_VALUES)[number];
  
  export const OWNERSHIP_VALUES = [
    "eigentuemer",
    "mieter",
    "sonstiges",
  ] as const;
  
  export type Ownership = (typeof OWNERSHIP_VALUES)[number];
  
  export const CONTACT_LEAD_STATUS_VALUES = [
    "new",
    "in_progress",
    "completed",
    "rejected",
  ] as const;
  
  export type ContactLeadStatus = (typeof CONTACT_LEAD_STATUS_VALUES)[number];
  
  export interface ContactLeadInput {
    firstName: string;
    lastName: string;
    company?: string;
    email: string;
    phone?: string;
  
    postalCode: string;
    city: string;
  
    interests: ContactInterest[];
    buildingType?: BuildingType;
    ownership?: Ownership;
  
    message: string;
    preferredContact: ContactPreference;
  
    privacyAccepted: boolean;
  
    /**
     * Honeypot-Feld.
     * Muss für echte Benutzer leer bleiben.
     */
    website?: string;
  
    /**
     * Zeitpunkt, zu dem das Formular geöffnet wurde.
     * Wird später für einfache Spam-Plausibilitätsprüfungen verwendet.
     */
    formStartedAt?: number;
  }
  
  export interface SubmitContactLeadResult {
    ok: true;
    leadId: string;
  }

  export interface ContactLeadDocument {
    type: "contact";
    status: ContactLeadStatus;
  
    contact: {
      firstName: string;
      lastName: string;
      company: string | null;
      email: string;
      phone: string | null;
    };
  
    location: {
      postalCode: string;
      city: string;
    };
  
    project: {
      interests: ContactInterest[];
      buildingType: BuildingType | null;
      ownership: Ownership | null;
    };
  
    message: string;
  
    preferredContact: ContactPreference;
  
    consent: {
      privacyAccepted: true;
      acceptedAt: FirestoreTimestamp;
    };
  
    meta: {
      source: "kontakt";
      schemaVersion: 1;
    };
  
    createdAt: FirestoreTimestamp;
    updatedAt: FirestoreTimestamp;
  
    updatedBy?: string;
  }
  
  export interface ContactLead extends ContactLeadDocument {
    id: string;
  }