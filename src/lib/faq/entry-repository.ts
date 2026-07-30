import "server-only";

import { FieldValue, type QueryDocumentSnapshot } from "firebase-admin/firestore";

import { adminFirestore } from "@/lib/firebase/admin";
import { FIRESTORE_COLLECTIONS } from "@/lib/firebase/collections";
import { FaqCategoryNotFoundError } from "@/lib/faq/category-repository";
import type {
  FaqEntry,
  FaqEntryAdminUpdateInput,
  FaqEntryCreateInput,
  FaqEntryDocument,
} from "@/types/faq";

export class FaqEntryNotFoundError extends Error {
  constructor(entryId: string) {
    super(`Der FAQ-Eintrag "${entryId}" wurde nicht gefunden.`);

    this.name = "FaqEntryNotFoundError";
  }
}

const faqsCollection = adminFirestore.collection(FIRESTORE_COLLECTIONS.faqs);

const faqCategoriesCollection = adminFirestore.collection(FIRESTORE_COLLECTIONS.faqCategories);

function mapFaqEntry(document: QueryDocumentSnapshot): FaqEntry {
  const data = document.data() as FaqEntryDocument;

  return {
    id: document.id,
    ...data,
  };
}

function getTimestampMillis(entry: FaqEntry): number {
  try {
    return entry.updatedAt.toMillis();
  } catch {
    return 0;
  }
}

export async function listFaqEntries(): Promise<FaqEntry[]> {
  const snapshot = await faqsCollection.get();

  return snapshot.docs
    .map(mapFaqEntry)
    .sort(
      (first, second) =>
        getTimestampMillis(second) - getTimestampMillis(first) ||
        first.question.localeCompare(second.question, "de"),
    );
}

export async function createFaqEntry(
  input: FaqEntryCreateInput,
  actorUid: string,
): Promise<string> {
  const entryReference = faqsCollection.doc();

  const categoryReference = faqCategoriesCollection.doc(input.categoryId);

  await adminFirestore.runTransaction(async (transaction) => {
    const categorySnapshot = await transaction.get(categoryReference);

    if (!categorySnapshot.exists) {
      throw new FaqCategoryNotFoundError(input.categoryId);
    }

    transaction.set(entryReference, {
      ...input,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdBy: actorUid,
      updatedBy: actorUid,
    });
  });

  return entryReference.id;
}

export async function updateFaqEntry(
  entryId: string,
  input: FaqEntryAdminUpdateInput,
  actorUid: string,
): Promise<void> {
  const entryReference = faqsCollection.doc(entryId);

  const categoryReference = faqCategoriesCollection.doc(input.categoryId);

  await adminFirestore.runTransaction(async (transaction) => {
    const entrySnapshot = await transaction.get(entryReference);

    const categorySnapshot = await transaction.get(categoryReference);

    if (!entrySnapshot.exists) {
      throw new FaqEntryNotFoundError(entryId);
    }

    if (!categorySnapshot.exists) {
      throw new FaqCategoryNotFoundError(input.categoryId);
    }

    transaction.update(entryReference, {
      ...input,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: actorUid,
    });
  });
}

export async function deleteFaqEntry(entryId: string): Promise<void> {
  const entryReference = faqsCollection.doc(entryId);

  await adminFirestore.runTransaction(async (transaction) => {
    const entrySnapshot = await transaction.get(entryReference);

    if (!entrySnapshot.exists) {
      throw new FaqEntryNotFoundError(entryId);
    }

    transaction.delete(entryReference);
  });
}
