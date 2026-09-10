import type { FaqCategory, FaqEntry, FaqCatalogEntry } from "@/types/faq";

export const FAQ_PRODUCT_LINKS: Record<string, { label: string; href: string }> = {
  photovoltaik: { label: "Photovoltaik planen", href: "/photovoltaik" },
  stromspeicher: { label: "Stromspeicher planen", href: "/stromspeicher" },
  waermepumpe: { label: "Wärmepumpen kennenlernen", href: "/waermepumpen" },
  klimaanlage: { label: "Klimaanlagen kennenlernen", href: "/klimaanlagen" },
  wallbox: { label: "Wallbox planen", href: "/wallbox" },
};

export function createFaqSlug(question: string, id: string) {
  // Hex preserves the case-sensitive document ID while keeping URLs lowercase.
  const suffix = Array.from(id, (character) =>
    character.charCodeAt(0).toString(16).padStart(2, "0"),
  ).join("");
  const stem = question
    .toLowerCase()
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 55)
    .replace(/-$/, "");
  return `${stem || "frage"}-${suffix}`;
}

export function selectFaqCatalog(
  entries: readonly FaqEntry[],
  categories: readonly FaqCategory[],
): FaqCatalogEntry[] {
  const categoryOrder = new Map(categories.map((category) => [category.id, category.sortOrder]));
  return entries
    .flatMap((entry) => {
      const category = categories.find((item) => item.id === entry.categoryId && item.isActive);
      if (!entry.isPublished || !category) return [];
      // Existing documents keep their stable document ID as URL until explicitly migrated.
      const slug = entry.slug || entry.id;
      return [
        {
          id: entry.id,
          slug,
          question: entry.question,
          answer: entry.answer,
          shortAnswer: entry.shortAnswer || "",
          categoryId: category.id,
          categorySlug: category.slug,
          categoryName: category.name,
          relatedFaqIds: entry.relatedFaqIds ?? [],
          featured: entry.featured ?? false,
          sortOrder: entry.sortOrder ?? 100,
          href: `/faq/${encodeURIComponent(category.slug)}/${encodeURIComponent(slug)}`,
        },
      ];
    })
    .sort(
      (a, b) =>
        (categoryOrder.get(a.categoryId) ?? 0) - (categoryOrder.get(b.categoryId) ?? 0) ||
        a.sortOrder - b.sortOrder ||
        a.question.localeCompare(b.question, "de"),
    );
}

export function selectRelatedFaqs(entry: FaqCatalogEntry, catalog: readonly FaqCatalogEntry[]) {
  const candidates = [
    ...entry.relatedFaqIds.flatMap((id) => catalog.filter((faq) => faq.id === id)),
    ...catalog.filter((faq) => faq.categoryId === entry.categoryId),
  ];
  return [
    ...new Map(
      candidates.filter((faq) => faq.id !== entry.id).map((faq) => [faq.id, faq]),
    ).values(),
  ].slice(0, 5);
}
