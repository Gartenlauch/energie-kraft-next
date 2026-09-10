import { describe, expect, it } from "vitest";
import { createFaqSlug, selectFaqCatalog, selectRelatedFaqs } from "@/lib/faq/catalog";
import { parseFaqEntryCreateFormData } from "@/lib/validation/faq-entry-admin";
import type { FaqCategory, FaqEntry } from "@/types/faq";

const category = {
  id: "pv",
  slug: "photovoltaik",
  name: "Photovoltaik",
  sortOrder: 0,
  isActive: true,
} as FaqCategory;
const entry = {
  id: "old-id",
  question: "Wie geht Solarstrom?",
  answer: "Eine ausführliche Antwort.",
  categoryId: "pv",
  isPublished: true,
  placements: [],
} as unknown as FaqEntry;

describe("FAQ catalog publication and detail URLs", () => {
  it("keeps category priority ahead of alphabetical question order", () => {
    const catalog = selectFaqCatalog(
      [entry, { ...entry, id: "wallbox", question: "Anschluss?", categoryId: "wallbox" }],
      [category, { ...category, id: "wallbox", slug: "wallbox", sortOrder: 40 }],
    );
    expect(catalog.map((faq) => faq.id)).toEqual(["old-id", "wallbox"]);
  });
  it("excludes drafts, inactive and missing categories, including related links", () => {
    const catalog = selectFaqCatalog(
      [
        entry,
        { ...entry, id: "draft", isPublished: false },
        { ...entry, id: "missing", categoryId: "missing" },
      ],
      [category],
    );
    expect(catalog.map((faq) => faq.id)).toEqual(["old-id"]);
    expect(selectFaqCatalog([entry], [{ ...category, isActive: false }])).toEqual([]);
    expect(
      selectRelatedFaqs({ ...catalog[0]!, relatedFaqIds: ["draft", "old-id"] }, catalog),
    ).toEqual([]);
  });
  it("keeps legacy URLs stable when the question changes and omits audit fields", () => {
    const [faq] = selectFaqCatalog(
      [{ ...entry, question: "Eine neue Frage?", createdBy: "private-admin" }],
      [category],
    );
    expect(faq?.href).toBe("/faq/photovoltaik/old-id");
    expect(faq).not.toHaveProperty("createdBy");
    expect(faq).not.toHaveProperty("placements");
    expect(createFaqSlug("Wärmepumpe & PV?", "abc123")).toBe("waermepumpe-pv-616263313233");
    expect(createFaqSlug("Frage", "AbC")).not.toBe(createFaqSlug("Frage", "abc"));
  });
  it("shows all category entries regardless of product placements and deduplicates related questions", () => {
    const catalog = selectFaqCatalog(
      Array.from({ length: 7 }, (_, i) => ({
        ...entry,
        id: `q${i}`,
        slug: `frage-${i}`,
        sortOrder: i,
      })),
      [category],
    );
    expect(catalog).toHaveLength(7);
    expect(
      selectRelatedFaqs({ ...catalog[0]!, relatedFaqIds: ["q3", "q3", "hidden"] }, catalog).map(
        (faq) => faq.id,
      ),
    ).toEqual(["q3", "q1", "q2", "q4", "q5"]);
  });
  it("parses optional editorial fields and rejects invalid related IDs", () => {
    const form = new FormData();
    Object.entries({
      question: entry.question,
      answer: entry.answer,
      categoryId: "pv",
      shortAnswer: "Kurz erklärt.",
      relatedFaqIds: "faq-a, faq-b",
      sortOrder: "12",
      featured: "on",
      "placement.home.enabled": "on",
      "placement.home.sortOrder": "10",
    }).forEach(([key, value]) => form.set(key, value));
    expect(parseFaqEntryCreateFormData(form)).toMatchObject({
      shortAnswer: "Kurz erklärt.",
      relatedFaqIds: ["faq-a", "faq-b"],
      sortOrder: 12,
      featured: true,
    });
    form.set("relatedFaqIds", "faqs/private");
    expect(() => parseFaqEntryCreateFormData(form)).toThrow();
  });
});
