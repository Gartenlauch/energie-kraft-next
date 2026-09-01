import type { FirestoreTimestamp } from "@/types/firestore";

export const LEAD_STATUS_VALUES = [
  "new",
  "in_progress",
  "completed",
  "rejected",
] as const;

export type LeadStatus =
  (typeof LEAD_STATUS_VALUES)[number];

export interface LeadMailDeliveryInfo {
  status:
    | "accepted"
    | "failed";

  provider:
    "mailgun";

  messageId:
    string | null;

  updatedAt:
    FirestoreTimestamp;
}

export interface LeadMailInfo {
  internal?:
    LeadMailDeliveryInfo;

  customer?:
    LeadMailDeliveryInfo;
}