import { describe, expect, it } from "vitest";

import { selectPublicFaqEntriesForRoute } from "@/lib/faq/public-selection";
import { buildFaqPageJsonLd, serializeJsonLd } from "@/lib/seo/faq-json-ld";

const categories = [
  {
    id: "photovoltaik",
    name: "Photovoltaik",
    sortOrder: 10,
    isActive: true,
  },
  {
    id: "stromspeicher",
    name: "Stromspeicher",
    sortOrder: 20,
    isActive: true,
  },
  {
    id: "inaktiv",
    name: "Inaktiv",
    sortOrder: 30,
    isActive: false,
  },
];

const entries = [
  {
    id: "faq-1",
    question: "Was kostet eine PV-Anlage?",
    answer: "Die Kosten hängen von Größe und Ausstattung ab.",
    categoryId: "photovoltaik",
    isPublished: true,
    placements: [
      {
        routeKey: "home" as const,
        sortOrder: 20,
        showInSchema: true,
      },
    ],
  },
  {
    id: "faq-2",
    question: "Lohnt sich ein Stromspeicher?",
    answer: "Das hängt vom Verbrauchsprofil und der Anlage ab.",
    categoryId: "stromspeicher",
    isPublished: true,
    placements: [
      {
        routeKey: "home" as const,
        sortOrder: 10,
        showInSchema: false,
      },
    ],
  },
  {
    id: "faq-draft",
    question: "Entwurf?",
    answer: "Dieser Eintrag darf öffentlich nicht erscheinen.",
    categoryId: "photovoltaik",
    isPublished: false,
    placements: [
      {
        routeKey: "home" as const,
        sortOrder: 1,
        showInSchema: true,
      },
    ],
  },
  {
    id: "faq-other-route",
    question: "Nur Photovoltaik-Seite?",
    answer: "Dieser Eintrag gehört nicht auf die Startseite.",
    categoryId: "photovoltaik",
    isPublished: true,
    placements: [
      {
        routeKey: "photovoltaik" as const,
        sortOrder: 1,
        showInSchema: true,
      },
    ],
  },
  {
    id: "faq-inactive-category",
    question: "Inaktive Kategorie?",
    answer: "Dieser Eintrag darf nicht öffentlich erscheinen.",
    categoryId: "inaktiv",
    isPublished: true,
    placements: [
      {
        routeKey: "home" as const,
        sortOrder: 1,
        showInSchema: true,
      },
    ],
  },
];

describe("Öffentliche FAQ-Auswahl", () => {
  it("liefert nur veröffentlichte FAQs der gewünschten Route", () => {
    const result = selectPublicFaqEntriesForRoute(entries, categories, "home");

    expect(result.map((faq) => faq.id)).toEqual(["faq-2", "faq-1"]);
  });

  it("schließt FAQs in inaktiven Kategorien aus", () => {
    const result = selectPublicFaqEntriesForRoute(entries, categories, "home");

    expect(result.some((faq) => faq.id === "faq-inactive-category")).toBe(false);
  });

  it("sortiert nach Route-Sortierung", () => {
    const result = selectPublicFaqEntriesForRoute(entries, categories, "home");

    expect(result[0]?.sortOrder).toBe(10);

    expect(result[1]?.sortOrder).toBe(20);
  });

  it("übernimmt den Schema-Status der Route", () => {
    const result = selectPublicFaqEntriesForRoute(entries, categories, "home");

    expect(result.find((faq) => faq.id === "faq-1")?.showInSchema).toBe(true);

    expect(result.find((faq) => faq.id === "faq-2")?.showInSchema).toBe(false);
  });
});

describe("FAQ JSON-LD", () => {
  it("enthält nur für Schema freigegebene FAQs", () => {
    const faqs = selectPublicFaqEntriesForRoute(entries, categories, "home");

    const jsonLd = buildFaqPageJsonLd(faqs);

    expect(jsonLd).not.toBeNull();

    expect(jsonLd?.mainEntity).toHaveLength(1);

    expect(jsonLd?.mainEntity[0]?.name).toBe("Was kostet eine PV-Anlage?");
  });

  it("liefert null ohne Schema-FAQs", () => {
    const faqs = selectPublicFaqEntriesForRoute(entries, categories, "home").map((faq) => ({
      ...faq,
      showInSchema: false,
    }));

    expect(buildFaqPageJsonLd(faqs)).toBeNull();
  });

  it("escaped potenziell gefährliche Script-Inhalte", () => {
    const serialized = serializeJsonLd({
      text: "</script><script>alert(1)</script>",
    });

    expect(serialized).not.toContain("</script>");

    expect(serialized).toContain("\\u003c/script>");
  });
});
