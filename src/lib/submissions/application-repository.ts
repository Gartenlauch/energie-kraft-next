import "server-only";

import { FieldValue, type QueryDocumentSnapshot } from "firebase-admin/firestore";

import { adminFirestore, adminStorage } from "@/lib/firebase/admin";
import {
  isApplicationStoragePath,
  type ApplicationFileMetadata,
} from "../../../functions/src/shared/application-file-policy";
import { FIRESTORE_COLLECTIONS } from "@/lib/firebase/collections";
import type { Application, ApplicationDocument } from "@/types/application";
import type { LeadStatus } from "@/types/lead";

export class ApplicationNotFoundError extends Error {
  constructor(id: string) {
    super(`Die Bewerbung "${id}" wurde nicht gefunden.`);
    this.name = "ApplicationNotFoundError";
  }
}

export class ApplicationDocumentCleanupError extends Error {}

const collection = adminFirestore.collection(FIRESTORE_COLLECTIONS.applications);
const realtime = adminFirestore.collection(FIRESTORE_COLLECTIONS.adminRealtime).doc("applications");

function mapApplication(snapshot: QueryDocumentSnapshot): Application | null {
  const data = snapshot.data();
  if (data.meta?.source !== "bewerbung" || data.meta?.schemaVersion !== 1) return null;
  return { id: snapshot.id, ...(data as ApplicationDocument) };
}

function millis(application: Application) {
  try {
    return application.createdAt.toMillis();
  } catch {
    return 0;
  }
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
  const documents = await adminFirestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists || snapshot.data()?.meta?.source !== "bewerbung") {
      throw new ApplicationNotFoundError(id);
    }
    const data = snapshot.data()!;
    if (data.uploadLeaseUntil > Date.now())
      throw new ApplicationDocumentCleanupError(
        "Die Unterlagen werden noch übertragen. Bitte in wenigen Minuten erneut löschen.",
      );
    const documents = (data.documents ?? []) as ApplicationFileMetadata[];
    if (!documents.every((document) => isApplicationStoragePath(id, document)))
      throw new ApplicationDocumentCleanupError(
        "Ungültige Dokumentzuordnung. Bewerbung wurde nicht gelöscht.",
      );
    transaction.update(reference, {
      uploadState: "deleting",
      updatedAt: FieldValue.serverTimestamp(),
    });
    return documents;
  });
  const removed = await Promise.allSettled(
    documents.map((document) =>
      adminStorage.bucket().file(document.storagePath).delete({ ignoreNotFound: true }),
    ),
  );
  if (removed.some((result) => result.status === "rejected")) {
    throw new ApplicationDocumentCleanupError(
      "Nicht alle Unterlagen konnten gelöscht werden. Die Bewerbung bleibt zur erneuten Bereinigung erhalten.",
    );
  }
  const batch = adminFirestore.batch();
  batch.delete(reference);
  batch.set(
    realtime,
    { revision: FieldValue.increment(1), updatedAt: FieldValue.serverTimestamp() },
    { merge: true },
  );
  await batch.commit();
}
