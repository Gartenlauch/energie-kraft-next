import "server-only";

import { FieldValue, type QueryDocumentSnapshot } from "firebase-admin/firestore";

import { adminFirestore } from "@/lib/firebase/admin";
import { FIRESTORE_COLLECTIONS } from "@/lib/firebase/collections";
import type { Application, ApplicationDocument } from "@/types/application";
import type { LeadStatus } from "@/types/lead";

export class ApplicationNotFoundError extends Error {
  constructor(id: string) {
    super(`Die Bewerbung "${id}" wurde nicht gefunden.`);
    this.name = "ApplicationNotFoundError";
  }
}

const collection = adminFirestore.collection(FIRESTORE_COLLECTIONS.applications);
const realtime = adminFirestore.collection(FIRESTORE_COLLECTIONS.adminRealtime).doc("applications");

function mapApplication(snapshot: QueryDocumentSnapshot): Application | null {
  const data = snapshot.data();
  if (data.meta?.source !== "bewerbung" || data.meta?.schemaVersion !== 1) return null;
  return { id: snapshot.id, ...(data as ApplicationDocument) };
}

function millis(application: Application) {
  try { return application.createdAt.toMillis(); } catch { return 0; }
}

export async function listApplications() {
  const snapshot = await collection.get();
  return snapshot.docs
    .map(mapApplication)
    .filter((entry): entry is Application => entry !== null)
    .sort((first, second) => millis(second) - millis(first));
}

export async function updateApplicationStatus(id: string, status: LeadStatus, actorUid: string) {
  const reference = collection.doc(id);
  await adminFirestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists || snapshot.data()?.meta?.source !== "bewerbung") {
      throw new ApplicationNotFoundError(id);
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

export async function deleteApplication(id: string) {
  const reference = collection.doc(id);
  await adminFirestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists || snapshot.data()?.meta?.source !== "bewerbung") {
      throw new ApplicationNotFoundError(id);
    }
    transaction.delete(reference);
    transaction.set(
      realtime,
      { revision: FieldValue.increment(1), updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
  });
}
