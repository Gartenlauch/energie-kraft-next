import "server-only";

import {
  FieldValue,
  type QueryDocumentSnapshot,
} from "firebase-admin/firestore";

import { FIRESTORE_COLLECTIONS } from "@/lib/firebase/collections";
import { adminFirestore } from "@/lib/firebase/admin";
import type {
  FaqCategory,
  FaqCategoryAdminUpdateInput,
  FaqCategoryCreateInput,
  FaqCategoryDocument,
} from "@/types/faq";

export class FaqCategoryAlreadyExistsError extends Error {
  constructor(categoryId: string) {
    super(
      `Eine FAQ-Kategorie mit dem Slug "${categoryId}" existiert bereits.`,
    );

    this.name = "FaqCategoryAlreadyExistsError";
  }
}

export class FaqCategoryNotFoundError extends Error {
  constructor(categoryId: string) {
    super(
      `Die FAQ-Kategorie "${categoryId}" wurde nicht gefunden.`,
    );

    this.name = "FaqCategoryNotFoundError";
  }
}

export class FaqCategoryInUseError extends Error {
  constructor(categoryId: string) {
    super(
      `Die FAQ-Kategorie "${categoryId}" wird noch von mindestens einer FAQ verwendet und kann nicht gelöscht werden.`,
    );

    this.name = "FaqCategoryInUseError";
  }
}

const faqCategoriesCollection =
  adminFirestore.collection(
    FIRESTORE_COLLECTIONS.faqCategories,
  );

const faqsCollection = adminFirestore.collection(
  FIRESTORE_COLLECTIONS.faqs,
);

function mapFaqCategory(
  document: QueryDocumentSnapshot,
): FaqCategory {
  const data =
    document.data() as FaqCategoryDocument;

  return {
    id: document.id,
    ...data,
  };
}

function getFirestoreErrorCode(
  error: unknown,
): string | number | undefined {
  if (
    typeof error !== "object" ||
    error === null ||
    !("code" in error)
  ) {
    return undefined;
  }

  const code = error.code;

  if (
    typeof code === "string" ||
    typeof code === "number"
  ) {
    return code;
  }

  return undefined;
}

function isAlreadyExistsError(
  error: unknown,
): boolean {
  const code = getFirestoreErrorCode(error);

  return (
    code === 6 ||
    code === "6" ||
    code === "already-exists"
  );
}

export async function listFaqCategories(): Promise<
  FaqCategory[]
> {
  const snapshot =
    await faqCategoriesCollection.get();

  return snapshot.docs
    .map(mapFaqCategory)
    .sort(
      (first, second) =>
        first.sortOrder - second.sortOrder ||
        first.name.localeCompare(
          second.name,
          "de",
        ),
    );
}

export async function createFaqCategory(
  input: FaqCategoryCreateInput,
  actorUid: string,
): Promise<string> {
  const categoryId = input.slug;

  const categoryReference =
    faqCategoriesCollection.doc(categoryId);

  try {
    await categoryReference.create({
      ...input,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdBy: actorUid,
      updatedBy: actorUid,
    });
  } catch (error) {
    if (isAlreadyExistsError(error)) {
      throw new FaqCategoryAlreadyExistsError(
        categoryId,
      );
    }

    throw error;
  }

  return categoryId;
}

export async function updateFaqCategory(
  categoryId: string,
  input: FaqCategoryAdminUpdateInput,
  actorUid: string,
): Promise<void> {
  const categoryReference =
    faqCategoriesCollection.doc(categoryId);

  const categorySnapshot =
    await categoryReference.get();

  if (!categorySnapshot.exists) {
    throw new FaqCategoryNotFoundError(
      categoryId,
    );
  }

  await categoryReference.update({
    ...input,
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: actorUid,
  });
}

export async function deleteFaqCategory(
  categoryId: string,
): Promise<void> {
  const categoryReference =
    faqCategoriesCollection.doc(categoryId);

  const [categorySnapshot, referencedFaqs] =
    await Promise.all([
      categoryReference.get(),
      faqsCollection
        .where("categoryId", "==", categoryId)
        .limit(1)
        .get(),
    ]);

  if (!categorySnapshot.exists) {
    throw new FaqCategoryNotFoundError(
      categoryId,
    );
  }

  if (!referencedFaqs.empty) {
    throw new FaqCategoryInUseError(
      categoryId,
    );
  }

  await categoryReference.delete();
}