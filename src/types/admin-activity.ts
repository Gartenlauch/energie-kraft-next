import type { FirestoreTimestamp } from "@/types/firestore";

export const ADMIN_ACTIVITY_TYPES = [
  "status_changed",
  "report_generated",
  "lead_forwarded",
  "report_forwarded",
] as const;

export type AdminActivityType = (typeof ADMIN_ACTIVITY_TYPES)[number];

export interface AdminActivity {
  id: string;
  type: AdminActivityType;
  createdAt: FirestoreTimestamp;
  actorUid: string;
  actorEmail: string | null;
  message: string;
  metadata?: Record<string, string | null>;
}
