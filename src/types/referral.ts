import type { Salutation } from "@/types/application";
import type { FirestoreTimestamp } from "@/types/firestore";
import type { LeadMailDeliveryInfo, LeadStatus } from "@/types/lead";

export interface ReferralInput {
  submissionId: string;
  referrer: {
    salutation: Salutation;
    firstName: string;
    lastName: string;
    email: string;
  };
  referredCustomer: {
    salutation: Salutation;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    street: string;
    postalCode: string;
    city: string;
  };
  privacyAccepted: boolean;
  referredPersonPermissionConfirmed: boolean;
  website?: string;
  formStartedAt?: number;
}

export interface SubmitReferralResult {
  ok: true;
  referralId: string;
  mailStatus: "accepted" | "partial" | "failed";
}

export interface ReferralDocument {
  status: LeadStatus;
  referrer: {
    salutation: Salutation;
    firstName: string;
    lastName: string;
    email: string;
  };
  referredCustomer: {
    salutation: Salutation;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    street: string;
    postalCode: string;
    city: string;
  };
  consent: {
    privacy: true;
    referredPersonPermissionConfirmed: true;
    submittedAt: FirestoreTimestamp;
  };
  campaign: {
    rewardEuro: 250;
    termsVersion: "2025-03-01";
    verificationStatus: "business-reconfirm-before-go-live";
  };
  mail?: {
    internal?: LeadMailDeliveryInfo;
    referrer?: LeadMailDeliveryInfo;
    referredCustomer?: LeadMailDeliveryInfo;
  };
  meta: {
    source: "kunden-werben-kunden";
    schemaVersion: 1;
  };
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
  updatedBy?: string;
}

export interface Referral extends ReferralDocument {
  id: string;
}
