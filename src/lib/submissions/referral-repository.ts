import "server-only";

import { FieldValue, type QueryDocumentSnapshot } from "firebase-admin/firestore";

import { adminFirestore } from "@/lib/firebase/admin";
import { FIRESTORE_COLLECTIONS } from "@/lib/firebase/collections";
import type { LeadStatus } from "@/types/lead";
import type { Referral, ReferralDocument } from "@/types/referral";

export class ReferralNotFoundError extends Error {
  constructor(id: string) {
    super(`Die Empfehlung "${id}" wurde nicht gefunden.`);
    this.name = "ReferralNotFoundError";
  }
}

const collection = adminFirestore.collection(FIRESTORE_COLLECTIONS.referrals);
const realtime = adminFirestore.collection(FIRESTORE_COLLECTIONS.adminRealtime).doc("referrals");

function mapReferral(snapshot: QueryDocumentSnapshot): Referral | null {
  const data = snapshot.data();
  if (data.meta?.source !== "kunden-werben-kunden" || data.meta?.schemaVersion !== 1) return null;
  return { id: snapshot.id, ...(data as ReferralDocument) };
}

function millis(referral: Referral) {
  try { return referral.createdAt.toMillis(); } catch { return 0; }
}

export async function listReferrals() {
  const snapshot = await collection.get();
  return snapshot.docs
    .map(mapReferral)
    .filter((entry): entry is Referral => entry !== null)
    .sort((first, second) => millis(second) - millis(first));
}

export async function updateReferralStatus(id: string, status: LeadStatus, actorUid: string) {
  const reference = collection.doc(id);
  await adminFirestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists || snapshot.data()?.meta?.source !== "kunden-werben-kunden") {
      throw new ReferralNotFoundError(id);
    }
    transaction.update(reference, {
      status,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: actorUid,
    });
    transaction.set(
      realtime,
      { revision: FieldValue.increment(1), updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
  });
}

export async function deleteReferral(id: string) {
  const reference = collection.doc(id);
  await adminFirestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists || snapshot.data()?.meta?.source !== "kunden-werben-kunden") {
      throw new ReferralNotFoundError(id);
    }
    transaction.delete(reference);
    transaction.set(
      realtime,
      { revision: FieldValue.increment(1), updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
  });
}
