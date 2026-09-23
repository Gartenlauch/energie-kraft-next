import type { LeadStatus } from "@/types/lead";

export function buildStatusActivityData(input: {
  actor: { uid: string; email: string | null };
  fromStatus: LeadStatus;
  toStatus: LeadStatus;
  createdAt: unknown;
}) {
  return {
    type: "status_changed" as const,
    createdAt: input.createdAt,
    actorUid: input.actor.uid,
    actorEmail: input.actor.email,
    message: "Bearbeitungsstatus geändert",
    metadata: { fromStatus: input.fromStatus, toStatus: input.toStatus },
  };
}
