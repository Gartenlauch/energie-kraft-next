import "server-only";

import { FieldValue, type QueryDocumentSnapshot } from "firebase-admin/firestore";
import { adminFirestore } from "@/lib/firebase/admin";
import { FIRESTORE_COLLECTIONS } from "@/lib/firebase/collections";
import type { AdminLead } from "@/types/admin-lead";
import type { LeadStatus } from "@/types/lead";
import { normalizeAdminLeadDocument } from "@/lib/leads/normalize-admin-lead";

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
  actorUid: string,
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

      transaction.update(
        leadReference,
        {
          status,
          updatedAt:
            FieldValue.serverTimestamp(),
          updatedBy: actorUid,
        },
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
