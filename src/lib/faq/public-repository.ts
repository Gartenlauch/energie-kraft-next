import "server-only";
import { cache } from "react";
import { selectFaqCatalog } from "@/lib/faq/catalog";

import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

import { PublicDataError } from "@/lib/errors/public-data-error";
import { logServerError } from "@/lib/errors/log-server-error";
import { selectPublicFaqEntriesForRoute } from "@/lib/faq/public-selection";
import { adminFirestore } from "@/lib/firebase/admin";
import { FIRESTORE_COLLECTIONS } from "@/lib/firebase/collections";
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
  try {
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

    const catalog = selectFaqCatalog(entries, categories);
    return selectPublicFaqEntriesForRoute(entries, categories, routeKey)
      .slice(0, 6)
      .map((faq) => ({
        ...faq,
        href: catalog.find((entry) => entry.id === faq.id)?.href,
      }));
  } catch (error) {
    logServerError(error, {
      scope: "public-faq-repository",
      operation: "getPublicFaqEntriesByRoute",
      context: {
        routeKey,
      },
    });

    throw new PublicDataError({
      resource: "faq",
      operation: "getPublicFaqEntriesByRoute",
      context: {
        routeKey,
      },
      cause: error,
    });
  }
}

export const getPublicFaqCatalog = cache(async () => {
  try {
    const [entries, categorySnapshot] = await Promise.all([
      faqsCollection.where("isPublished", "==", true).get(),
      faqCategoriesCollection.where("isActive", "==", true).get(),
    ]);
    const categories = categorySnapshot.docs
      .map((doc) => ({ ...(doc.data() as FaqCategoryDocument), id: doc.id }))
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "de"));
    return {
      categories: categories.map(({ id, name, slug }) => ({ id, name, slug })),
      entries: selectFaqCatalog(entries.docs.map(mapFaqEntry), categories),
    };
  } catch (error) {
    logServerError(error, { scope: "public-faq-repository", operation: "getPublicFaqCatalog" });
    throw new PublicDataError({ resource: "faq", operation: "getPublicFaqCatalog", cause: error });
  }
});
