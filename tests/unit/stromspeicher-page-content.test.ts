import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/config/env/public", () => ({
  publicEnv: { NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de" },
}));
vi.mock("@/lib/faq/public-repository", () => ({
  getPublicFaqEntriesByRoute: vi.fn().mockResolvedValue([]),
}));

import StromspeicherPage, { metadata } from "@/app/(site)/stromspeicher/page";
import { PublicContentPage } from "@/app/(site)/_components/public-content-page";
import { CONTACT_FORM_HREF } from "@/config/routes";
import { storageFunctionVideo, stromspeicherContent, stromspeicherProducts } from "@/content/pages/stromspeicher";
import { getPublicFaqEntriesByRoute } from "@/lib/faq/public-repository";
import nextConfig from "../../next.config";

describe("Residential storage migration", () => {
  let html: string;
  beforeAll(async () => {
    html = renderToStaticMarkup(await PublicContentPage(StromspeicherPage().props));
  });

  it("links the unchanged solar-planning CTA to the configurator landing page", () => {
    const section = html.split('id="eigenverbrauch"')[1].split("</section>")[0];
    expect(section).toContain('href="/konfigurator"');
    expect(section).toContain("Photovoltaikanlage planen");
    expect(section).not.toContain('href="/"');
    expect(section).not.toContain('href="/photovoltaik"');
  });

  it("allows the headline to split only at Batterie-speicher without changing its wording", () => {
    const section = html.split('id="eigenverbrauch"')[1].split("</section>")[0];
    const heading = section.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/)!;
    expect(heading[1]).toContain("Batterie\u00adspeicher");
    expect(heading[1].replaceAll("\u00ad", "")).toBe("Eigenverbrauch mit Batteriespeicher gezielt erhöhen");
    expect(heading[0]).toContain("hyphens:manual;overflow-wrap:normal");
  });

  it("preserves metadata, H1, signet and the existing permanent redirect", async () => {
    expect(metadata.title).toEqual({
      absolute: "Stromspeicher für Photovoltaik | Energie-Kraft Süd",
    });
    expect(metadata.description).toBe(
      "Stromspeicher für Photovoltaik: SigenStor Neo und SigenStor passend zu PV-Anlage und Verbrauch planen. Beratung, Installation und Energiemanagement aus einer Hand.",
    );
    expect(metadata.alternates?.canonical).toBe("https://www.energie-kraft.de/stromspeicher");
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain(stromspeicherContent.hero.title);
    expect(html.match(/class="brand-intro /g)).toHaveLength(1);
    expect(html).toContain("brand-intro--brand");
    expect(getPublicFaqEntriesByRoute).toHaveBeenCalledWith("stromspeicher");
    expect(await nextConfig.redirects!()).toContainEqual({
      source: "/energieloesungen/batteriespeicher-photovoltaik",
      destination: "/stromspeicher",
      permanent: true,
    });
  });

  it("renders the complete editorial journey, two product portraits and mySigen", () => {
    const ids = [...html.matchAll(/<(?:section|article)[^>]*id="([^"]+)"/g)].map((m) => m[1]);
    const expected = [
      "speicherloesung",
      "funktionsweise",
      "speicherprodukte",
      "sigenstor-neo",
      "sigenstor",
      "eigenverbrauch",
      "ersatzstrom",
      "energiemanagement",
      "energiesystem",
      "region",
    ];
    expect(ids.filter((id) => expected.includes(id))).toEqual(expected);
    for (const product of stromspeicherProducts) {
      expect(html).toContain(`<h3 id="${product.id}-heading"`);
      expect(html).toContain(product.name);
      expect(html).toContain(product.source);
      expect(existsSync(`public${product.image}`)).toBe(true);
    }
    expect(html).toContain("mySigen");
    expect(html).toContain("Backup-Modul ist integriert");
    expect(html).toContain("es gehört nicht zu jeder Installation");
    expect(html).toContain("illustrativen Energiedaten");
    expect(html).toContain("Kilowattstunden (kWh)");
    expect(html).toContain("Kilowatt (kW)");
    for (const term of ["Ainring bei Freilassing", "Berchtesgadener Land", "Landkreis Traunstein"])
      expect(html).toContain(term);
  });

  it("renders the actual hero and final CTA destinations and energy system links", () => {
    const hero = html.split('class="premium-hero ')[1].split("</section>")[0];
    expect(hero.match(/<a\b/g)).toHaveLength(2);
    expect(hero).toContain('href="/konfigurator/stromspeicher"');
    expect(hero).toContain("Projekt konfigurieren");
    expect(hero).toContain(`href="${CONTACT_FORM_HREF}"`);
    expect(hero).toContain("Speicherberatung anfragen");
    const final = html.slice(html.indexOf("Welcher Stromspeicher passt zu Ihrem Zuhause?"));
    expect(final).toContain('href="/konfigurator/stromspeicher"');
    expect(final).toContain("Speicherprojekt konfigurieren");
    expect(final).toContain(`href="${CONTACT_FORM_HREF}"`);
    for (const href of ["/photovoltaik", "/wallbox", "/waermepumpen"])
      expect(html).toContain(`href="${href}"`);
    expect(html).not.toContain("/stromtarife-pv");
  });

  it("uses local imagery and excludes obsolete products and fabricated product schemas", () => {
    for (const src of [
      "residential-storage-hero-desktop.webp",
      "residential-storage-hero-mobile.webp",
      "residential-storage-function-desktop.webp",
      "residential-storage-function-mobile.webp",
      "residential-storage-backup-desktop.webp",
      "residential-storage-backup-mobile.webp",
      "products/mysigen-energy-management.webp",
    ])
      expect(existsSync(`public/images/battery-storage/${src}`)).toBe(true);
    const htmlWithoutServiceNotice = html.replace(
      /<aside\b[^>]*aria-label="sonnen: Information und Service"[^>]*>[\s\S]*?<\/aside>/g,
      "",
    );
    expect(htmlWithoutServiceNotice).not.toMatch(/sonnenBatterie|sonnenProtect|sonnenFlat|SigenStack|FlexStack/i);
    expect(html).not.toMatch(/100\s*%\s*autark|garantierte.*Autarkie/i);
    expect(html).not.toMatch(/"@type":"(?:Product|Offer|AggregateRating|QAPage)"/);
    expect(html).toContain('"@type":"WebPage"');
    expect(html).not.toMatch(/(?:src|srcSet)="https:\/\/wwwstatic/);
  });

  it("keeps the video section filled before hydration and retains the moved backup image", () => {
    const first = html.split('id="funktionsweise"')[1].split("</section>")[0];
    const backup = html.split('id="ersatzstrom"')[1].split("</section>")[0];
    for (const section of [first, backup]) {
      expect(section).toContain("residential-storage-function-desktop.webp");
      expect(section).toContain("residential-storage-function-mobile.webp");
    }
    expect(html).not.toContain("residential-storage-backup-");
    expect(existsSync(`public${storageFunctionVideo.src}`)).toBe(true);
    expect(first).toContain("data-loop-video");
    expect(first).not.toContain("<video"); // SSR renders the still until the motion preference is known.
  });
});
