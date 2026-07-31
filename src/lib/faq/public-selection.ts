import type { FaqCategory, FaqEntry, FaqRouteKey, PublicFaqEntry } from "@/types/faq";

type PublicFaqSourceEntry = Pick<
  FaqEntry,
  "id" | "question" | "answer" | "categoryId" | "placements" | "isPublished"
>;

type PublicFaqSourceCategory = Pick<FaqCategory, "id" | "name" | "sortOrder" | "isActive">;

export function selectPublicFaqEntriesForRoute(
  entries: readonly PublicFaqSourceEntry[],
  categories: readonly PublicFaqSourceCategory[],
  routeKey: FaqRouteKey,
): PublicFaqEntry[] {
  const categoriesById = new Map(categories.map((category) => [category.id, category]));

  return entries
    .flatMap((entry) => {
      if (!entry.isPublished) {
        return [];
      }

      const placement = entry.placements.find((candidate) => candidate.routeKey === routeKey);

      if (!placement) {
        return [];
      }

      const category = categoriesById.get(entry.categoryId);

      if (!category?.isActive) {
        return [];
      }

      return [
        {
          id: entry.id,
          question: entry.question,
          answer: entry.answer,
          categoryId: entry.categoryId,
          categoryName: category.name,
          routeKey,
          sortOrder: placement.sortOrder,
          showInSchema: placement.showInSchema,
          categorySortOrder: category.sortOrder,
        },
      ];
    })
    .sort(
      (first, second) =>
        first.sortOrder - second.sortOrder ||
        first.categorySortOrder - second.categorySortOrder ||
        first.question.localeCompare(second.question, "de"),
    )
    .map(({ categorySortOrder: _categorySortOrder, ...faq }) => faq);
}
