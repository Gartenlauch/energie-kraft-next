import "server-only";

import { FieldValue, type WriteBatch } from "firebase-admin/firestore";

import { adminFirestore } from "@/lib/firebase/admin";
import { FIRESTORE_COLLECTIONS } from "@/lib/firebase/collections";
import { listFaqCategories } from "@/lib/faq/category-repository";
import { listFaqEntries } from "@/lib/faq/entry-repository";
import {
  analyzeFaqJsonImport,
  createFaqJsonDocument,
  type FaqImportResult,
  type FaqImportPreview,
  type FaqJsonDocument,
} from "@/lib/faq/json-transfer";

export class InvalidFaqImportError extends Error {
  readonly preview: FaqImportPreview;

  constructor(preview: FaqImportPreview) {
    super("Die FAQ-Importdatei ist nicht gültig.");
    this.name = "InvalidFaqImportError";
    this.preview = preview;
  }
}

const categoriesCollection = adminFirestore.collection(FIRESTORE_COLLECTIONS.faqCategories);
const faqsCollection = adminFirestore.collection(FIRESTORE_COLLECTIONS.faqs);
const MAX_BATCH_WRITES = 500;

export async function exportFaqJson(): Promise<FaqJsonDocument> {
  const [categories, faqs] = await Promise.all([listFaqCategories(), listFaqEntries()]);
  return createFaqJsonDocument(categories, faqs);
}

export async function previewFaqJsonImport(value: unknown): Promise<FaqImportPreview> {
  const [categories, faqs] = await Promise.all([listFaqCategories(), listFaqEntries()]);
  return analyzeFaqJsonImport(value, categories, faqs).preview;
}

interface PendingWrite {
  action: "new" | "update";
  addToBatch(batch: WriteBatch): void;
}

async function commitWrites(writes: readonly PendingWrite[], result: FaqImportResult): Promise<void> {
  for (let offset = 0; offset < writes.length; offset += MAX_BATCH_WRITES) {
    const chunk = writes.slice(offset, offset + MAX_BATCH_WRITES);
    const batch = adminFirestore.batch();
    chunk.forEach((write) => write.addToBatch(batch));

    try {
      await batch.commit();
      for (const write of chunk) result[write.action === "new" ? "created" : "updated"] += 1;
    } catch {
      result.failed += writes.length - offset;
      break;
    }
  }
}

export async function importFaqJson(value: unknown, actorUid: string): Promise<FaqImportResult> {
  const [categories, faqs] = await Promise.all([listFaqCategories(), listFaqEntries()]);
  const analysis = analyzeFaqJsonImport(value, categories, faqs);

  if (!analysis.preview.valid || !analysis.document) {
    throw new InvalidFaqImportError(analysis.preview);
  }

  const result: FaqImportResult = {
    created: 0,
    updated: 0,
    skipped: analysis.preview.categories.skipped + analysis.preview.faqs.skipped,
    failed: 0,
  };
  const categoryWrites: PendingWrite[] = [];
  const faqWrites: PendingWrite[] = [];

  for (const category of analysis.document.categories) {
    const action = analysis.categoryActions.get(category.id);
    if (action === "skipped" || !action) continue;

    categoryWrites.push({
      action,
      addToBatch(batch) {
        const auditFields =
          action === "new"
            ? {
                createdAt: FieldValue.serverTimestamp(),
                createdBy: actorUid,
              }
            : {};
        const { id: _id, ...fields } = category;
        batch.set(
          categoriesCollection.doc(category.id),
          {
            ...fields,
            ...auditFields,
            updatedAt: FieldValue.serverTimestamp(),
            updatedBy: actorUid,
          },
          { merge: action === "update" },
        );
      },
    });
  }

  for (const faq of analysis.document.faqs) {
    const action = analysis.faqActions.get(faq.id);
    if (action === "skipped" || !action) continue;

    faqWrites.push({
      action,
      addToBatch(batch) {
        const auditFields =
          action === "new"
            ? {
                createdAt: FieldValue.serverTimestamp(),
                createdBy: actorUid,
              }
            : {};
        const { id: _id, ...fields } = faq;
        batch.set(
          faqsCollection.doc(faq.id),
          {
            ...fields,
            ...auditFields,
            updatedAt: FieldValue.serverTimestamp(),
            updatedBy: actorUid,
          },
          { merge: action === "update" },
        );
      },
    });
  }

  await commitWrites([...categoryWrites, ...faqWrites], result);
  return result;
}
