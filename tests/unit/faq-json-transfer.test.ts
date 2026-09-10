import { describe, expect, it } from "vitest";

import {
  analyzeFaqJsonImport,
  createFaqJsonDocument,
  FAQ_JSON_SCHEMA_VERSION,
  type FaqJsonDocument,
} from "@/lib/faq/json-transfer";
import type { FaqCategory, FaqEntry } from "@/types/faq";

const category = {
  id: "photovoltaik",
  name: "Photovoltaik",
  slug: "photovoltaik",
  sortOrder: 10,
  isActive: true,
} as unknown as FaqCategory;

const faq = {
  id: "faq-pv-kosten",
  categoryId: category.id,
  slug: "was-kostet-eine-pv-anlage",
  question: "Was kostet eine PV-Anlage?",
  shortAnswer: "Die Kosten hängen von der Auslegung ab.",
  answer: "Die Kosten hängen von Größe, Komponenten und Montageaufwand ab.",
  relatedFaqIds: [],
  placements: [{ routeKey: "photovoltaik", sortOrder: 10, showInSchema: true }],
  featured: true,
  sortOrder: 10,
  isPublished: true,
} as unknown as FaqEntry;

function validDocument(): FaqJsonDocument {
  return createFaqJsonDocument([category], [faq]);
}

describe("FAQ JSON import/export", () => {
  it("validiert einen exportierten Datenstand für den Import", () => {
    const document = validDocument();
    const analysis = analyzeFaqJsonImport(document, [], []);

    expect(document.schemaVersion).toBe(FAQ_JSON_SCHEMA_VERSION);
    expect(analysis.preview).toMatchObject({
      valid: true,
      categories: { new: 1, update: 0, skipped: 0 },
      faqs: { new: 1, update: 0, skipped: 0 },
      errors: [],
    });
  });

  it("lehnt eine unbekannte Schema-Version ab", () => {
    const analysis = analyzeFaqJsonImport({ ...validDocument(), schemaVersion: 2 }, [], []);

    expect(analysis.preview.valid).toBe(false);
    expect(analysis.preview.errors[0]).toContain("schemaVersion");
  });

  it("meldet doppelte IDs und Slugs", () => {
    const document = validDocument();
    document.categories.push({ ...document.categories[0]! });
    document.faqs.push({ ...document.faqs[0]! });
    const analysis = analyzeFaqJsonImport(document, [], []);

    expect(analysis.preview.errors).toEqual(
      expect.arrayContaining([
        "Doppelte Kategorie-ID: photovoltaik",
        "Doppelter Kategorie-Slug: photovoltaik",
        "Doppelte FAQ-ID: faq-pv-kosten",
        "Doppelter FAQ-Slug: was-kostet-eine-pv-anlage",
      ]),
    );
  });

  it("lehnt FAQs mit fehlender Kategorie ab", () => {
    const document = validDocument();
    document.categories = [];
    const analysis = analyzeFaqJsonImport(document, [], []);

    expect(analysis.preview.valid).toBe(false);
    expect(analysis.preview.errors).toContain("FAQ faq-pv-kosten: Kategorie photovoltaik fehlt.");
  });

  it("plant UPSERTs nach ID und lässt nicht enthaltene Datensätze unangetastet", () => {
    const untouchedFaq = { ...faq, id: "faq-bleibt", slug: "bleibt-erhalten" } as FaqEntry;
    const document = validDocument();
    document.faqs[0] = { ...document.faqs[0]!, question: "Was kostet die PV-Anlage konkret?" };
    const analysis = analyzeFaqJsonImport(document, [category], [faq, untouchedFaq]);

    expect(analysis.preview.categories.skipped).toBe(1);
    expect(analysis.preview.faqs.update).toBe(1);
    expect(analysis.faqActions.get(faq.id)).toBe("update");
    expect(analysis.faqActions.has(untouchedFaq.id)).toBe(false);
    expect(analysis.preview.warnings).toContain(
      "Bestehende Datensätze, die in der Datei fehlen, bleiben unverändert erhalten.",
    );
  });
});
