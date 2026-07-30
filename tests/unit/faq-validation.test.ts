import { describe, expect, it } from "vitest";

import {
  faqCategoryCreateSchema,
  faqCategoryUpdateSchema,
  faqEntryCreateSchema,
  faqEntryUpdateSchema,
  faqRouteKeySchema,
  parseFaqCategoryCreateInput,
  parseFaqEntryCreateInput,
} from "@/lib/validation/faq";

describe("FAQ-Routen", () => {
  it("akzeptiert einen unterstützten Route-Key", () => {
    const result = faqRouteKeySchema.safeParse(
      "photovoltaik",
    );

    expect(result.success).toBe(true);
  });

  it("lehnt einen unbekannten Route-Key ab", () => {
    const result = faqRouteKeySchema.safeParse(
      "unbekannte-route",
    );

    expect(result.success).toBe(false);
  });
});

describe("FAQ-Kategorien", () => {
  it("validiert und normalisiert gültige Create-Daten", () => {
    const result = faqCategoryCreateSchema.safeParse({
      name: "  Photovoltaik  ",
      slug: "photovoltaik",
      sortOrder: 10,
      isActive: true,
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.name).toBe("Photovoltaik");
      expect(result.data.slug).toBe("photovoltaik");
    }
  });

  it("lehnt einen ungültigen Slug ab", () => {
    const result = faqCategoryCreateSchema.safeParse({
      name: "Photovoltaik",
      slug: "Photovoltaik Anlagen",
      sortOrder: 10,
      isActive: true,
    });

    expect(result.success).toBe(false);
  });

  it("lehnt eine negative Sortierung ab", () => {
    const result = faqCategoryCreateSchema.safeParse({
      name: "Photovoltaik",
      slug: "photovoltaik",
      sortOrder: -1,
      isActive: true,
    });

    expect(result.success).toBe(false);
  });

  it("lehnt ein leeres Kategorie-Update ab", () => {
    const result =
      faqCategoryUpdateSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it("akzeptiert ein teilweises Kategorie-Update", () => {
    const result =
      faqCategoryUpdateSchema.safeParse({
        isActive: false,
      });

    expect(result.success).toBe(true);
  });
});

describe("FAQ-Einträge", () => {
  const validEntry = {
    question:
      "Wie lange dauert die Installation einer Photovoltaikanlage?",
    answer:
      "Die konkrete Installationsdauer hängt vom Umfang und den örtlichen Voraussetzungen ab.",
    categoryId: "photovoltaik",
    placements: [
      {
        routeKey: "home" as const,
        sortOrder: 10,
        showInSchema: true,
      },
      {
        routeKey: "photovoltaik" as const,
        sortOrder: 20,
        showInSchema: true,
      },
    ],
    isPublished: true,
  };

  it("akzeptiert einen gültigen FAQ-Eintrag", () => {
    const result =
      faqEntryCreateSchema.safeParse(validEntry);

    expect(result.success).toBe(true);
  });

  it("lehnt doppelte Route-Zuordnungen ab", () => {
    const result = faqEntryCreateSchema.safeParse({
      ...validEntry,
      placements: [
        {
          routeKey: "home",
          sortOrder: 10,
          showInSchema: true,
        },
        {
          routeKey: "home",
          sortOrder: 20,
          showInSchema: false,
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("lehnt einen Eintrag ohne Route-Zuordnung ab", () => {
    const result = faqEntryCreateSchema.safeParse({
      ...validEntry,
      placements: [],
    });

    expect(result.success).toBe(false);
  });

  it("lehnt eine reservierte Kategorie-ID ab", () => {
    const result = faqEntryCreateSchema.safeParse({
      ...validEntry,
      categoryId: "__reserved__",
    });

    expect(result.success).toBe(false);
  });

  it("lehnt eine Kategorie-ID mit Schrägstrich ab", () => {
    const result = faqEntryCreateSchema.safeParse({
      ...validEntry,
      categoryId: "kategorien/photovoltaik",
    });

    expect(result.success).toBe(false);
  });

  it("lehnt ein leeres FAQ-Update ab", () => {
    const result =
      faqEntryUpdateSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it("akzeptiert ein teilweises FAQ-Update", () => {
    const result =
      faqEntryUpdateSchema.safeParse({
        isPublished: false,
      });

    expect(result.success).toBe(true);
  });

  it("normalisiert Eingaben über den Parse-Helfer", () => {
    const result = parseFaqEntryCreateInput({
      ...validEntry,
      question: `  ${validEntry.question}  `,
      answer: `  ${validEntry.answer}  `,
    });

    expect(result.question).toBe(validEntry.question);
    expect(result.answer).toBe(validEntry.answer);
  });
});

describe("FAQ-Parse-Helfer", () => {
  it("liefert typisierte Kategorie-Daten", () => {
    const result = parseFaqCategoryCreateInput({
      name: "  Stromspeicher  ",
      slug: "stromspeicher",
      sortOrder: 30,
      isActive: true,
    });

    expect(result).toEqual({
      name: "Stromspeicher",
      slug: "stromspeicher",
      sortOrder: 30,
      isActive: true,
    });
  });

  it("wirft bei ungültigen Daten einen Fehler", () => {
    expect(() =>
      parseFaqCategoryCreateInput({
        name: "",
        slug: "Ungültiger Slug",
        sortOrder: -1,
        isActive: true,
      }),
    ).toThrow();
  });
});