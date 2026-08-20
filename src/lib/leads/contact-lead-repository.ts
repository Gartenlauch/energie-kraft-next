import "server-only";

import {
  FieldValue,
  type QueryDocumentSnapshot,
} from "firebase-admin/firestore";

import { adminFirestore } from "@/lib/firebase/admin";
import { FIRESTORE_COLLECTIONS } from "@/lib/firebase/collections";
import type {
  ContactLead,
  ContactLeadDocument,
  ContactLeadStatus,
} from "@/types/contact-lead";

export class ContactLeadNotFoundError extends Error {
  constructor(leadId: string) {
    super(`Die Anfrage "${leadId}" wurde nicht gefunden.`);

    this.name = "ContactLeadNotFoundError";
  }
}

const leadsCollection = adminFirestore.collection(
  FIRESTORE_COLLECTIONS.leads,
);

const leadsRealtimeReference = adminFirestore
  .collection(FIRESTORE_COLLECTIONS.adminRealtime)
  .doc("leads");

function mapContactLead(
  document: QueryDocumentSnapshot,
): ContactLead | null {
  const data = document.data() as Partial<ContactLeadDocument>;

  if (data.type !== "contact") {
    return null;
  }

  return {
    id: document.id,
    ...(data as ContactLeadDocument),
  };
}

function getCreatedAtMillis(lead: ContactLead): number {
  try {
    return lead.createdAt.toMillis();
  } catch {
    return 0;
  }
}

export async function listContactLeads(): Promise<ContactLead[]> {
  const snapshot = await leadsCollection
    .where("type", "==", "contact")
    .get();

  return snapshot.docs
    .map(mapContactLead)
    .filter(
      (lead): lead is ContactLead => lead !== null,
    )
    .sort(
      (first, second) =>
        getCreatedAtMillis(second) -
        getCreatedAtMillis(first),
    );
}

export async function updateContactLeadStatus(
  leadId: string,
  status: ContactLeadStatus,
  actorUid: string,
): Promise<void> {
  const leadReference = leadsCollection.doc(leadId);

  await adminFirestore.runTransaction(
    async (transaction) => {
      const snapshot =
        await transaction.get(leadReference);

      if (!snapshot.exists) {
        throw new ContactLeadNotFoundError(leadId);
      }

      const data =
        snapshot.data() as Partial<ContactLeadDocument>;

      if (data.type !== "contact") {
        throw new ContactLeadNotFoundError(leadId);
      }

      transaction.update(leadReference, {
        status,
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: actorUid,
      });
      transaction.set(
        leadsRealtimeReference,
        {
          revision: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp(),
        },
        {
          merge: true,
        },
      );
    },
  );
}

export async function deleteContactLead(
  leadId: string,
): Promise<void> {
  const leadReference = leadsCollection.doc(leadId);

  await adminFirestore.runTransaction(
    async (transaction) => {
      const snapshot =
        await transaction.get(leadReference);

      if (!snapshot.exists) {
        throw new ContactLeadNotFoundError(leadId);
      }

      const data =
        snapshot.data() as Partial<ContactLeadDocument>;

      if (data.type !== "contact") {
        throw new ContactLeadNotFoundError(leadId);
      }

      transaction.delete(leadReference);
      transaction.set(
        leadsRealtimeReference,
        {
          revision: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp(),
        },
        {
          merge: true,
        },
      );
    },
  );
}