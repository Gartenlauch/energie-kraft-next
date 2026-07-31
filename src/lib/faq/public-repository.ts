import "server-only";

import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

import { adminFirestore } from "@/lib/firebase/admin";
import { FIRESTORE_COLLECTIONS } from "@/lib/firebase/collections";
import { selectPublicFaqEntriesForRoute } from "@/lib/faq/public-selection";
import type {
  FaqCategory,
  FaqCategoryDocument,
  FaqEntry,
  FaqEntryDocument,
  FaqRouteKey,
  PublicFaqEntry,
} from "@/types/faq";

const faqsCollection = adminFirestore.collection(FIRESTORE_COLLECTIONS.faqs);

const faqCategoriesCollection = adminFirestore.collection(FIRESTORE_COLLECTIONS.faqCategories);

function mapFaqEntry(document: QueryDocumentSnapshot): FaqEntry {
  return {
    id: document.id,
    ...(document.data() as FaqEntryDocument),
  };
}

export async function getPublicFaqEntriesByRoute(routeKey: FaqRouteKey): Promise<PublicFaqEntry[]> {
  const faqSnapshot = await faqsCollection.where("isPublished", "==", true).get();

  const entries = faqSnapshot.docs
    .map(mapFaqEntry)
    .filter((entry) => entry.placements.some((placement) => placement.routeKey === routeKey));

  if (entries.length === 0) {
    return [];
  }

  const categoryIds = [...new Set(entries.map((entry) => entry.categoryId))];

  const categoryReferences = categoryIds.map((categoryId) =>
    faqCategoriesCollection.doc(categoryId),
  );

  const categorySnapshots = await adminFirestore.getAll(...categoryReferences);

  const categories: FaqCategory[] = categorySnapshots.flatMap((document) => {
    if (!document.exists) {
      return [];
    }

    return [
      {
        id: document.id,
        ...(document.data() as FaqCategoryDocument),
      },
    ];
  });

  return selectPublicFaqEntriesForRoute(entries, categories, routeKey);
}
