import "server-only";

import { FieldValue, type QueryDocumentSnapshot } from "firebase-admin/firestore";
import { adminFirestore } from "@/lib/firebase/admin";
import { FIRESTORE_COLLECTIONS } from "@/lib/firebase/collections";
import type { AdminLead } from "@/types/admin-lead";
import type { LeadStatus } from "@/types/lead";
import type { AdminActivity } from "@/types/admin-activity";
import { normalizeAdminLeadDocument } from "@/lib/leads/normalize-admin-lead";
import { buildStatusActivityData } from "@/lib/admin/activity";

export { normalizeAdminLeadDocument } from "@/lib/leads/normalize-admin-lead";

export class LeadNotFoundError extends Error {
  constructor(leadId: string) {
    super(
      `Die Anfrage "${leadId}" wurde nicht gefunden.`,
    );

    this.name = "LeadNotFoundError";
  }
}

const leadsCollection =
  adminFirestore.collection(
    FIRESTORE_COLLECTIONS.leads,
  );

const leadsRealtimeReference =
  adminFirestore
    .collection(
      FIRESTORE_COLLECTIONS.adminRealtime,
    )
    .doc("leads");

function getCreatedAtMillis(
  lead: AdminLead,
): number {
  try {
    return lead.createdAt.toMillis();
  } catch {
    return 0;
  }
}

function isSupportedLeadType(
  value: unknown,
): value is AdminLead["type"] {
  return (
    value === "contact" ||
    value === "configurator"
  );
}

export async function listLeads(): Promise<
  AdminLead[]
> {
  const snapshot =
    await leadsCollection.get();

  return snapshot.docs
    .map(mapLead)
    .filter(
      (lead): lead is AdminLead =>
        lead !== null,
    )
    .sort(
      (first, second) =>
        getCreatedAtMillis(second) -
        getCreatedAtMillis(first),
    );
}

export async function updateLeadStatus(
  leadId: string,
  status: LeadStatus,
  actor: { uid: string; email: string | null },
): Promise<void> {
  const leadReference =
    leadsCollection.doc(leadId);

  await adminFirestore.runTransaction(
    async (transaction) => {
      const snapshot =
        await transaction.get(
          leadReference,
        );

      if (!snapshot.exists) {
        throw new LeadNotFoundError(
          leadId,
        );
      }

      const data = snapshot.data();

      if (
        !isSupportedLeadType(
          data?.type,
        )
      ) {
        throw new LeadNotFoundError(
          leadId,
        );
      }

      const previousStatus = data?.status as LeadStatus;
      if (previousStatus === status) return;

      transaction.update(
        leadReference,
        {
          status,
          updatedAt:
            FieldValue.serverTimestamp(),
          updatedBy: actor.uid,
        },
      );

      const activityReference = leadReference.collection("activities").doc();
      transaction.set(activityReference, buildStatusActivityData({ actor, fromStatus: previousStatus, toStatus: status, createdAt: FieldValue.serverTimestamp() }));

      transaction.set(
        leadsRealtimeReference,
        {
          revision:
            FieldValue.increment(1),
          updatedAt:
            FieldValue.serverTimestamp(),
        },
        {
          merge: true,
        },
      );
    },
  );
}

export async function deleteLead(
  leadId: string,
): Promise<void> {
  const leadReference =
    leadsCollection.doc(leadId);

  await adminFirestore.runTransaction(
    async (transaction) => {
      const snapshot =
        await transaction.get(
          leadReference,
        );

      if (!snapshot.exists) {
        throw new LeadNotFoundError(
          leadId,
        );
      }

      const data = snapshot.data();

      if (
        !isSupportedLeadType(
          data?.type,
        )
      ) {
        throw new LeadNotFoundError(
          leadId,
        );
      }

      transaction.delete(
        leadReference,
      );

      transaction.set(
        leadsRealtimeReference,
        {
          revision:
            FieldValue.increment(1),
          updatedAt:
            FieldValue.serverTimestamp(),
        },
        {
          merge: true,
        },
      );
    },
  );
}

export async function updateLeadStatuses(
  leadIds: readonly string[],
  status: LeadStatus,
  actor: { uid: string; email: string | null },
): Promise<number> {
  const uniqueIds = [...new Set(leadIds)].slice(0, 100);
  return adminFirestore.runTransaction(async (transaction) => {
    const references = uniqueIds.map((id) => leadsCollection.doc(id));
    const snapshots = await Promise.all(references.map((reference) => transaction.get(reference)));
    let changed = 0;
    snapshots.forEach((snapshot, index) => {
      const data = snapshot.data();
      if (!snapshot.exists || !isSupportedLeadType(data?.type)) throw new LeadNotFoundError(uniqueIds[index]!);
      const previousStatus = data?.status as LeadStatus;
      if (previousStatus === status) return;
      const reference = references[index]!;
      transaction.update(reference, { status, updatedAt: FieldValue.serverTimestamp(), updatedBy: actor.uid });
      transaction.set(reference.collection("activities").doc(), buildStatusActivityData({ actor, fromStatus: previousStatus, toStatus: status, createdAt: FieldValue.serverTimestamp() }));
      changed += 1;
    });
    if (changed > 0) transaction.set(leadsRealtimeReference, {
      revision: FieldValue.increment(1), updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    return changed;
  });
}

export async function listLeadActivities(leadIds: readonly string[]): Promise<Map<string, AdminActivity[]>> {
  const entries = await Promise.all(leadIds.map(async (leadId) => {
    const snapshot = await leadsCollection.doc(leadId).collection("activities").orderBy("createdAt", "desc").limit(50).get();
    return [leadId, snapshot.docs.map((document) => ({ id: document.id, ...document.data() }) as AdminActivity)] as const;
  }));
  return new Map(entries);
}

function mapLead(document: QueryDocumentSnapshot): AdminLead | null {
  const data = document.data();
  const normalized = normalizeAdminLeadDocument(document.id, data);
  if (!normalized && data.type === "configurator") {
    console.warn("Unsupported or malformed configurator lead skipped", {
      leadId: document.id,
      schemaVersion: data.meta?.schemaVersion,
    });
  }
  return normalized;
}
