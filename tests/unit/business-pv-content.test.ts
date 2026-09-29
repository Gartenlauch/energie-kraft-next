import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/config/env/public", () => ({
  publicEnv: { NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de" },
}));
import { CONTACT_FORM_HREF } from "@/config/routes";
import { sprint8Pages } from "@/content/sprint8-pages";
import { buildMetadata } from "@/lib/seo/metadata";

const content = sprint8Pages.businessPv;
const visibleCopy = [
  content.eyebrow,
  content.title,
  content.description,
  content.ctaTitle,
  content.ctaLabel,
  ...content.sections.flatMap((section) => [
    section.eyebrow,
    section.title,
    ...section.paragraphs,
    ...("items" in section ? section.items : []),
    ...("links" in section ? section.links.map((link) => link.label) : []),
  ]),
].join(" ");

describe("Business photovoltaic migration contracts", () => {
  it("preserves the existing canonical and exact requested metadata and H1", () => {
    expect(content.seo).toEqual({
      title: "Photovoltaik für Unternehmen & Gewerbe | Energie-Kraft Süd",
      description:
        "Photovoltaik für Unternehmen und Gewerbe in Bayern: Lastprofil analysieren, Eigenstrom nutzen und PV mit Speicher kombinieren. Planung, Installation und Service aus einer Hand.",
      canonicalPath: "/energieloesungen/photovoltaik-fuer-unternehmen",
    });
    const metadata = buildMetadata(content.seo);
    expect(metadata.title).toEqual({ absolute: content.seo.title });
    expect(metadata.alternates?.canonical).toBe(
      "https://www.energie-kraft.de/energieloesungen/photovoltaik-fuer-unternehmen",
    );
    expect(content.title).toBe(
      "Photovoltaik für Unternehmen: eigenen Solarstrom wirtschaftlich nutzen",
    );
  });

  it("covers the approved region, experience, applications and service scope", () => {
    for (const term of [
      "Ainring",
      "Berchtesgadener Land",
      "Landkreis Traunstein",
      "Bayern",
      "über 20 Jahre",
      "Industrie",
      "Landwirtschaft",
      "kommunalen Projekten",
      "Wartung",
      "Instandhaltung",
      "Reparatur",
      "Störungsbeseitigung",
      "Wartungsverträge",
      "Leitstelle",
      "Anlagenüberwachung",
    ])
      expect(visibleCopy).toContain(term);
    expect(visibleCopy).not.toMatch(/Österreich|Salzburg|deutschlandweit/i);
    expect(visibleCopy).not.toMatch(
      /garant\w*|störungsfrei\w*|nahezu keine Stromkosten|100\s*%|24\s*\/\s*7|\b\d+\s*(?:%|Sekunden|€)|Amortisation in|Rendite von/i,
    );
  });

  it("links to existing destinations and uses the shared contact CTA", () => {
    const hrefs = content.sections.flatMap((section) =>
      "links" in section ? section.links.map((link) => link.href) : [],
    );
    for (const href of [
      "/referenzen",
      "/energieloesungen/gewerbespeicher",
      "/service-und-wartung",
      "/service-und-wartung/service-und-team",
      "/wallbox",
    ])
      expect(hrefs).toContain(href);
    expect(content.ctaHref).toBe(CONTACT_FORM_HREF);
    expect(content.ctaLabel).toBe("Gewerbeprojekt besprechen");
  });

  it("keeps the eight requested topics and existing responsive assets", () => {
    expect(content.sections.map((section) => section.id)).toEqual([
      "eigenstrom",
      "planung",
      "wirtschaftlichkeit",
      "gewerbespeicher",
      "anwendungen",
      "erfahrung",
      "service",
      "referenzen",
    ]);
    const system = content.sections.find((section) => section.id === "gewerbespeicher");
    if (!system || !("image" in system)) throw new Error("Missing system image");
    for (const src of [
      content.desktopSrc,
      content.mobileSrc,
      system.image.desktopSrc,
      system.image.mobileSrc,
    ])
      expect(existsSync(resolve("public", src.slice(1)))).toBe(true);
  });
});
