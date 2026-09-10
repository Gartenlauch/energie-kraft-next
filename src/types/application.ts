import type { FirestoreTimestamp } from "@/types/firestore";
import type { LeadMailDeliveryInfo, LeadStatus } from "@/types/lead";
import type { ApplicationFileMetadata } from "../../functions/src/shared/application-file-policy";

export const SALUTATION_VALUES = ["frau", "herr", "divers"] as const;
export type Salutation = (typeof SALUTATION_VALUES)[number];

export interface ApplicationInput {
  submissionId: string;
  jobId: string;
  salutation?: Salutation;
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  email: string;
  phone: string;
  qualificationExperience: string;
  privacyAccepted: boolean;
  website?: string;
  formStartedAt?: number;
}

export interface SubmitApplicationResult {
  ok: true;
  applicationId: string;
  mailStatus: "accepted" | "failed";
}

export interface ApplicationDocument {
  documents?: ApplicationFileMetadata[];
  uploadState?: "uploading" | "ready" | "upload_failed" | "deleting";
  uploadLeaseUntil?: number;
  cleanupPending?: boolean;
  status: LeadStatus;
  jobId: string;
  jobTitle: string;
  salutation: Salutation | null;
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  email: string;
  phone: string;
  qualificationExperience: string;
  consent: {
    privacy: true;
    submittedAt: FirestoreTimestamp;
  };
  mail?: {
    internal?: LeadMailDeliveryInfo;
    applicant?: LeadMailDeliveryInfo;
  };
  meta: {
    source: "bewerbung";
    schemaVersion: 1;
  };
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
  updatedBy?: string;
}

export interface Application extends ApplicationDocument {
  id: string;
}
