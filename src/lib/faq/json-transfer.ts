import { z } from "zod";

import { FAQ_ROUTE_KEYS } from "@/config/routes";
import { createFaqSlug } from "@/lib/faq/catalog";
import type { FaqCategory, FaqEntry } from "@/types/faq";

export const FAQ_JSON_SCHEMA_VERSION = 1 as const;

const documentIdSchema = z
  .string()
  .trim()
  .min(1, "Die ID ist erforderlich.")
  .max(128, "Die ID darf höchstens 128 Zeichen enthalten.")
  .refine((value) => !value.includes("/"), "Die ID darf keinen Schrägstrich enthalten.")
  .refine((value) => !/^__.*__$/.test(value), "IDs im Format __name__ sind reserviert.");

const slugSchema = z
  .string()
  .trim()
  .min(2, "Der Slug muss mindestens 2 Zeichen enthalten.")
  .max(100, "Der Slug darf höchstens 100 Zeichen enthalten.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Der Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten.",
  );

const sortOrderSchema = z.number().int().min(0).max(100_000);

const placementSchema = z.strictObject({
  routeKey: z.enum(FAQ_ROUTE_KEYS),
  sortOrder: sortOrderSchema,
  showInSchema: z.boolean(),
});

const categorySchema = z.strictObject({
  id: documentIdSchema,
  name: z.string().trim().min(2).max(100),
  slug: slugSchema,
  sortOrder: sortOrderSchema,
  isActive: z.boolean(),
});

const faqSchema = z.strictObject({
  id: documentIdSchema,
  categoryId: documentIdSchema,
  slug: slugSchema,
  question: z.string().trim().min(5).max(250),
  shortAnswer: z.string().trim().max(600),
  answer: z.string().trim().min(10).max(20_000),
  relatedFaqIds: z.array(documentIdSchema).max(5),
  placements: z
    .array(placementSchema)
    .min(1)
    .max(FAQ_ROUTE_KEYS.length)
    .superRefine((placements, context) => {
      const routeKeys = new Set<string>();

      placements.forEach((placement, index) => {
        if (routeKeys.has(placement.routeKey)) {
          context.addIssue({
            code: "custom",
            path: [index, "routeKey"],
            message: "Jede Route darf nur einmal vorkommen.",
          });
        }

        routeKeys.add(placement.routeKey);
      });
    }),
  featured: z.boolean(),
  sortOrder: sortOrderSchema,
  isPublished: z.boolean(),
});

export const faqJsonDocumentSchema = z.strictObject({
  schemaVersion: z.literal(FAQ_JSON_SCHEMA_VERSION),
  categories: z.array(categorySchema),
  faqs: z.array(faqSchema),
});

export type FaqJsonDocument = z.infer<typeof faqJsonDocumentSchema>;
export type FaqJsonCategory = FaqJsonDocument["categories"][number];
export type FaqJsonEntry = FaqJsonDocument["faqs"][number];

export interface FaqImportCounts {
  new: number;
  update: number;
  skipped: number;
}

export interface FaqImportPreview {
  valid: boolean;
  categories: FaqImportCounts;
  faqs: FaqImportCounts;
  errors: string[];
  warnings: string[];
}

export interface FaqImportResult {
  created: number;
  updated: number;
  skipped: number;
  failed: number;
}

export interface FaqImportAnalysis {
  document: FaqJsonDocument | null;
  preview: FaqImportPreview;
  categoryActions: Map<string, "new" | "update" | "skipped">;
  faqActions: Map<string, "new" | "update" | "skipped">;
}

function formatZodPath(path: PropertyKey[]): string {
  return path.reduce<string>((result, segment) => {
    if (typeof segment === "number") return `${result}[${segment}]`;
    return result ? `${result}.${String(segment)}` : String(segment);
  }, "");
}

function findDuplicates(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }

  return [...duplicates].sort((first, second) => first.localeCompare(second, "de"));
}

function categoryFields(category: FaqCategory | FaqJsonCategory): FaqJsonCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    sortOrder: category.sortOrder,
    isActive: category.isActive,
  };
}

function faqFields(faq: FaqEntry | FaqJsonEntry): FaqJsonEntry {
  return {
    id: faq.id,
    categoryId: faq.categoryId,
    slug: faq.slug ?? createFaqSlug(faq.question, faq.id),
    question: faq.question,
    shortAnswer: faq.shortAnswer ?? "",
    answer: faq.answer,
    relatedFaqIds: faq.relatedFaqIds ?? [],
    placements: faq.placements.map((placement) => ({ ...placement })),
    featured: faq.featured ?? false,
    sortOrder: faq.sortOrder ?? 0,
    isPublished: faq.isPublished,
  };
}

function fieldsEqual(first: unknown, second: unknown): boolean {
  return JSON.stringify(first) === JSON.stringify(second);
}

function emptyCounts(): FaqImportCounts {
  return { new: 0, update: 0, skipped: 0 };
}

export function createFaqJsonDocument(
  categories: readonly FaqCategory[],
  faqs: readonly FaqEntry[],
): FaqJsonDocument {
  return {
    schemaVersion: FAQ_JSON_SCHEMA_VERSION,
    categories: [...categories]
      .sort(
        (first, second) =>
          first.sortOrder - second.sortOrder ||
          first.slug.localeCompare(second.slug, "de") ||
          first.id.localeCompare(second.id, "de"),
      )
      .map(categoryFields),
    faqs: [...faqs]
      .sort(
        (first, second) =>
          first.categoryId.localeCompare(second.categoryId, "de") ||
          (first.sortOrder ?? 0) - (second.sortOrder ?? 0) ||
          (first.slug ?? "").localeCompare(second.slug ?? "", "de") ||
          first.id.localeCompare(second.id, "de"),
      )
      .map(faqFields),
  };
}

export function analyzeFaqJsonImport(
  value: unknown,
  existingCategories: readonly FaqCategory[],
  existingFaqs: readonly FaqEntry[],
): FaqImportAnalysis {
  const parsed = faqJsonDocumentSchema.safeParse(value);
  const categoryActions = new Map<string, "new" | "update" | "skipped">();
  const faqActions = new Map<string, "new" | "update" | "skipped">();
  const preview: FaqImportPreview = {
    valid: false,
    categories: emptyCounts(),
    faqs: emptyCounts(),
    errors: [],
    warnings: [],
  };

  if (!parsed.success) {
    preview.errors = parsed.error.issues.map((issue) => {
      const path = formatZodPath(issue.path);
      return `${path || "JSON"}: ${issue.message}`;
    });
    return { document: null, preview, categoryActions, faqActions };
  }

  const document = parsed.data;
  const duplicateCategoryIds = findDuplicates(document.categories.map((category) => category.id));
  const duplicateCategorySlugs = findDuplicates(
    document.categories.map((category) => category.slug),
  );
  const duplicateFaqIds = findDuplicates(document.faqs.map((faq) => faq.id));
  const duplicateFaqSlugs = findDuplicates(document.faqs.map((faq) => faq.slug));

  for (const id of duplicateCategoryIds) preview.errors.push(`Doppelte Kategorie-ID: ${id}`);
  for (const slug of duplicateCategorySlugs)
    preview.errors.push(`Doppelter Kategorie-Slug: ${slug}`);
  for (const id of duplicateFaqIds) preview.errors.push(`Doppelte FAQ-ID: ${id}`);
  for (const slug of duplicateFaqSlugs) preview.errors.push(`Doppelter FAQ-Slug: ${slug}`);

  const existingCategoriesById = new Map(existingCategories.map((category) => [category.id, category]));
  const existingFaqsById = new Map(existingFaqs.map((faq) => [faq.id, faq]));
  const availableCategoryIds = new Set([
    ...existingCategoriesById.keys(),
    ...document.categories.map((category) => category.id),
  ]);
  const availableFaqIds = new Set([
    ...existingFaqsById.keys(),
    ...document.faqs.map((faq) => faq.id),
  ]);

  for (const category of document.categories) {
    const slugConflict = existingCategories.find(
      (existing) => existing.slug === category.slug && existing.id !== category.id,
    );
    if (slugConflict) {
      preview.errors.push(
        `Kategorie ${category.id}: Slug "${category.slug}" wird bereits von ${slugConflict.id} verwendet.`,
      );
    }

    const existing = existingCategoriesById.get(category.id);
    const action = existing
      ? fieldsEqual(categoryFields(existing), categoryFields(category))
        ? "skipped"
        : "update"
      : "new";
    categoryActions.set(category.id, action);
    preview.categories[action] += 1;
  }

  for (const faq of document.faqs) {
    if (!availableCategoryIds.has(faq.categoryId)) {
      preview.errors.push(`FAQ ${faq.id}: Kategorie ${faq.categoryId} fehlt.`);
    }

    const invalidRelatedIds = faq.relatedFaqIds.filter((id) => !availableFaqIds.has(id));
    for (const relatedId of invalidRelatedIds) {
      preview.errors.push(`FAQ ${faq.id}: Verwandte FAQ ${relatedId} fehlt.`);
    }

    if (new Set(faq.relatedFaqIds).size !== faq.relatedFaqIds.length) {
      preview.errors.push(`FAQ ${faq.id}: relatedFaqIds enthält doppelte IDs.`);
    }

    const slugConflict = existingFaqs.find(
      (existing) => existing.slug === faq.slug && existing.id !== faq.id,
    );
    if (slugConflict) {
      preview.errors.push(
        `FAQ ${faq.id}: Slug "${faq.slug}" wird bereits von ${slugConflict.id} verwendet.`,
      );
    }

    const existing = existingFaqsById.get(faq.id);
    const action = existing
      ? fieldsEqual(faqFields(existing), faqFields(faq))
        ? "skipped"
        : "update"
      : "new";
    faqActions.set(faq.id, action);
    preview.faqs[action] += 1;
  }

  if (document.categories.length === 0) preview.warnings.push("Die Datei enthält keine Kategorien.");
  if (document.faqs.length === 0) preview.warnings.push("Die Datei enthält keine FAQs.");
  if (existingCategories.length > document.categories.length || existingFaqs.length > document.faqs.length) {
    preview.warnings.push("Bestehende Datensätze, die in der Datei fehlen, bleiben unverändert erhalten.");
  }

  preview.errors = [...new Set(preview.errors)];
  preview.valid = preview.errors.length === 0;
  return { document, preview, categoryActions, faqActions };
}
