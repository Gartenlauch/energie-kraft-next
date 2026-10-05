import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/config/env/public", () => ({
  publicEnv: { NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de" },
}));

import CommercialStoragePage from "@/app/(site)/gewerbespeicher/page";
import { CONTACT_FORM_HREF, PUBLIC_ROUTE_LIST } from "@/config/routes";
import { SEARCH_NO_INDEX_DIRECTIVE } from "@/config/search-indexing";
import { sprint8Pages } from "@/content/sprint8-pages";
import { commercialStorageProducts } from "@/content/pages/gewerbespeicher";
import { buildMetadata } from "@/lib/seo/metadata";

afterEach(() => vi.unstubAllEnvs());

describe("Commercial storage page", () => {
  const content = sprint8Pages.commercialStorage;
  let html: string;
  beforeAll(() => {
    html = renderToStaticMarkup(CommercialStoragePage());
  });

  it("preserves exact SEO data and makes only the page ready for indexing", () => {
    const metadata = buildMetadata(content.seo);
    expect(metadata.title).toEqual({
      absolute: "Gewerbespeicher für Unternehmen | Energie-Kraft Süd",
    });
    expect(metadata.description).toBe(
      "Gewerbespeicher für Unternehmen in Bayern: SigenStack, sonnenPro FlexStack und Sungrow PowerStack passend zu Photovoltaik und Lastprofil planen.",
    );
    expect(metadata.alternates?.canonical).toBe(
      "https://www.energie-kraft.de/gewerbespeicher",
    );
    expect(content.seo).not.toHaveProperty("noIndex");
    expect(SEARCH_NO_INDEX_DIRECTIVE).toBe("noindex, nofollow, noarchive, nosnippet");
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "false");
    expect(buildMetadata(content.seo).robots).toEqual({
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
    });
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "true");
    expect(buildMetadata(content.seo).robots).toBeUndefined();
    expect(PUBLIC_ROUTE_LIST.some((route) => route.href === content.seo.canonicalPath)).toBe(true);
  });

  it("renders one H1, the signet and the full section order with all three product portraits", () => {
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain("Energie speichern, Lastspitzen steuern und Eigenstrom besser nutzen");
    expect(html.match(/class="brand-intro /g)).toHaveLength(1);
    expect(html).toContain("brand-intro--brand");
    const ids = [...html.matchAll(/<(?:section|article)[^>]*id="([^"]+)"/g)].map((m) => m[1]);
    expect(ids).toEqual([
      "einsatz",
      "anwendungen",
      "produkte",
      "sigenstack",
      "sonnenpro-flexstack",
      "sungrow-powerstack",
      "entscheidung",
      "energiemanagement",
      "standort",
      "wirtschaftlichkeit",
      "photovoltaik",
      "region",
      "service",
    ]);
    for (const product of commercialStorageProducts) {
      expect(html).toContain(`<h3 id="${product.id}-heading"`);
      expect(html).toContain(product.name);
      expect(html).toContain(`href="${product.source}" target="_blank" rel="noreferrer"`);
      expect(html).toContain(product.alt);
      expect(html).toContain(
        "imageCaption" in product
          ? product.imageCaption
          : `Produktdarstellung von ${product.manufacturer}`,
      );
      expect(existsSync(`public${product.image}`)).toBe(true);
    }
  });

  it("presents Sungrow with verified manufacturer data and identifies its own visualization", () => {
    expect(commercialStorageProducts).toHaveLength(3);
    const sungrow = commercialStorageProducts.find((product) => product.id === "sungrow-powerstack")!;
    expect(sungrow.source).toBe(
      "https://www.sungrowpower.com/de/de/products/c-i-energy-storage-system/st255cs-2h",
    );
    expect(sungrow.details).toEqual([
      { label: "Leistung", text: "125 kW AC-Nennleistung" },
      { label: "Kapazität", text: "257 kWh Batteriekapazität" },
      { label: "Kühlung", text: "Flüssigkeitsgekühlt" },
      { label: "Monitoring", text: "Überwachung und Verwaltung über iSolarCloud" },
      { label: "Einbindung", text: "Parallele Einbindung mehrerer Einheiten laut Hersteller" },
    ]);
    expect(html).toContain("Eigene Visualisierung nach der Produktform des Sungrow PowerStack ST255CS-2H");
    expect(html).toContain("PowerStack · iSolarCloud");
    expect(html).toContain("Drei Systemkonzepte");
    expect(html).not.toMatch(/Zwei modulare Systemkonzepte|für beide Systeme/);
  });

  it("renders the actual contact and B2B destinations in the hero and final CTA", () => {
    const hero = html.split('class="premium-hero ')[1].split("</section>")[0];
    expect(hero.match(/<a\b/g)).toHaveLength(2);
    expect(hero).toContain(`href="${CONTACT_FORM_HREF}"`);
    expect(hero).toContain("Gewerbespeicher besprechen");
    expect(hero).toContain('href="/photovoltaik-fuer-unternehmen"');
    const final = html.slice(html.indexOf("Welcher Gewerbespeicher passt zu Ihrem Betrieb?"));
    expect(final).toContain(`href="${CONTACT_FORM_HREF}"`);
    for (const href of [
      "/referenzen",
      "/service-und-wartung",
      "/service-und-wartung/service-und-team",
    ])
      expect(html).toContain(`href="${href}"`);
  });

  it("explains dimensions, applications, management and regional service without sales promises", () => {
    for (const term of [
      "Kilowatt (kW)",
      "Kilowattstunden (kWh)",
      "Peak Shaving",
      "12 kWh",
      "55-kWh",
      "368 kW",
      "495 kWh",
      "IP66",
      "IP65",
      "Sigen Cloud",
      "sonnenPro EMS",
      "Ainring",
      "Berchtesgadener Land",
      "Landkreis Traunstein",
      "Bayern",
      "Je nach vereinbartem Serviceumfang",
    ])
      expect(html).toContain(term);
    // Scope applies to visible main content; global business schemas may include other regions.
    const visible = html.slice(html.indexOf("<main")).replace(/<[^>]+>/g, " ");
    expect(visible).not.toMatch(/Österreich|deutschlandweit|sonnenBatterie|SigenStor|€|EUR|24\/7/i);
    expect(visible).not.toMatch(
      /garantierte (?:Rendite|Amortisation|Kostenersparnis)|Netzausbau wird überflüssig/i,
    );
    expect(html).toContain('"@type":"WebPage"');
    expect(html).toContain('"@type":"BreadcrumbList"');
    expect(html).not.toMatch(/"@type":"(?:Product|Offer|AggregateRating|QAPage|FAQPage)"/);
    for (const src of [
      content.desktopSrc,
      content.mobileSrc,
      ...content.sections.flatMap((s) => (s.image ? [s.image.desktopSrc, s.image.mobileSrc] : [])),
    ])
      expect(existsSync(`public${src}`)).toBe(true);
  });
});
