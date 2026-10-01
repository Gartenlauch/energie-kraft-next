import { createElement } from "react";
import type * as ReactModule from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";

const navigation = vi.hoisted(() => ({ open: false }));
vi.mock("@/config/env/public", () => ({
  publicEnv: { NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de" },
}));
vi.mock("react", async (importOriginal) => {
  const original = await importOriginal<typeof ReactModule>();
  return {
    ...original,
    useState: (initial: unknown) =>
      original.useState(
        navigation.open && initial === null
          ? "energy"
          : navigation.open && initial === false
            ? true
            : initial,
      ),
  };
});
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("@/lib/faq/public-repository", () => ({
  getPublicFaqEntriesByRoute: vi.fn().mockResolvedValue([]),
}));
vi.mock("@/lib/reviews", () => ({
  getCustomerReviews: vi
    .fn()
    .mockResolvedValue({ status: "not-configured", reviews: [], summaries: [] }),
}));

import HomePage, { metadata } from "@/app/(site)/page";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { homeContent } from "@/content/pages/home";
import { CONTACT_FORM_HREF } from "@/config/routes";
import { sprint8Pages } from "@/content/sprint8-pages";

describe("Sprint 10 rendered homepage", () => {
  let html: string;
  beforeAll(async () => {
    html = renderToStaticMarkup(await HomePage());
  });

  it("preserves the exact title, canonical, hero H1 and actual PV anchor", () => {
    expect(metadata.title).toEqual({ absolute: "Ihr PV Anbieter aus Bayern | Energie-Kraft Süd" });
    expect(metadata.openGraph?.title).toBe(homeContent.seo.title);
    expect(metadata.alternates?.canonical).toMatch(/\/$/);
    expect([...html.matchAll(/<h1\b[^>]*>(.*?)<\/h1>/g)].map((match) => match[1])).toEqual([
      "Energie intelligent planen und nachhaltig nutzen",
    ]);
    expect(html).toMatch(/href="#photovoltaik"[^>]*>Photovoltaik entdecken/);
    expect(html).toContain('id="photovoltaik"');
    expect(html).not.toContain('href="#leistungen"');
    expect(html).toMatch(/href="\/konfigurator"[^>]*>Energieprojekt konfigurieren/);
  });

  it("places PV and storage together before energy flow, commerce and supplementary services", () => {
    const markers = [
      'id="photovoltaik"',
      'id="stromspeicher"',
      'id="energy-flow-title"',
      'id="gewerbe"',
      'id="supplementary-heading"',
      'id="waermepumpe"',
      'id="klimaanlage"',
      'id="wallbox"',
      'id="service"',
    ];
    const positions = markers.map((marker) => html.indexOf(marker));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(html.slice(positions[0], positions[1]).match(/<section\b/g)).toHaveLength(1);
    expect(html.match(/id="energy-flow-title"/g)).toHaveLength(1);
    expect(html.match(/Stromtarife für Photovoltaik kennenlernen/g)).toHaveLength(1);
  });

  it("uses a contact-first commerce section, a subordinate existing-page link and responsive assets", () => {
    const commercial = html.match(/<section id="gewerbe"[\s\S]*?<\/section>/)?.[0];
    expect(commercial).toBeDefined();
    expect(commercial).toContain("Solarenergie für Gewerbe &amp; Unternehmen");
    expect(commercial).toContain("mehr energiekraft");
    expect(commercial).toMatch(
      new RegExp(`href="${CONTACT_FORM_HREF}"[^>]*>Nehmen Sie jetzt mit uns Kontakt auf`),
    );
    expect(commercial).toMatch(
      /href="\/photovoltaik-fuer-unternehmen"[^>]*>Photovoltaik für Unternehmen kennenlernen/,
    );
    expect(commercial).not.toContain("/konfigurator");
    expect(commercial).toContain("commercial-photovoltaic-hero-desktop.webp");
    expect(commercial).toContain('width="1600" height="1000"');
    expect(commercial).toContain('width="812" height="1015"');
  });

  it("retains regional positioning, the confirmed company age and existing downstream components", () => {
    for (const phrase of [
      "Seit über 20 Jahren ist Energie-Kraft Süd",
      "Über 20 Jahre Energie-Kraft Süd",
      "Ainring bei Freilassing",
      "Berchtesgadener Land",
      "Landkreis Traunstein",
      "private Haushalte und Unternehmen",
      "Alles aus einer Hand",
      "Ausgangslage verstehen",
      "System sauber planen",
      "Verlässlich umsetzen",
      "Bringen Sie Ihr Energieprojekt ins Rollen",
    ])
      expect(html).toContain(phrase);
    expect(html).not.toMatch(/foundingDate|AggregateRating/);
    // Empty data deliberately suppresses FAQ/reviews in this isolated render;
    // their existing server loading and components remain part of the page.
    const source = readFileSync("src/app/(site)/page.tsx", "utf8");
    for (const component of [
      "ReferenceProjectsSection",
      "CustomerReviewsSection",
      "PartnerLogoCarousel",
      "PublicFaqSection",
      "HomePageJsonLd",
      "FaqJsonLd",
    ])
      expect(source.match(new RegExp(`<${component}\\b`, "g"))).toHaveLength(1);
  });

  it("renders the same eight unique energy destinations in desktop and mobile menus", () => {
    navigation.open = true;
    let header: string;
    try {
      header = renderToStaticMarkup(createElement(SiteHeader));
    } finally {
      navigation.open = false;
    }
    const expected = [
      "/photovoltaik",
      "/stromspeicher",
      "/photovoltaik-fuer-unternehmen",
      "/gewerbespeicher",
      "/waermepumpen",
      "/klimaanlagen",
      "/wallbox",
      "/stromtarife-pv",
    ];
    const desktop = [...header.matchAll(/<a\b[^>]*class="mega-menu-link[^"]*"[^>]*>[\s\S]*?<\/a>/g)]
      .map((match) => match[0]).join("");
    const mobile = header.match(/id="mobile-energy-links"[\s\S]*?<\/ul>/)?.[0] ?? "";
    for (const menu of [desktop, mobile]) {
      const hrefs = [...menu.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
      expect(hrefs).toEqual(expected);
      expect(new Set(hrefs).size).toBe(8);
    }
    expect(header).toMatch(/href="\/ueber-uns"/);
    expect(renderToStaticMarkup(createElement(SiteFooter))).toMatch(
      /href="\/photovoltaik-fuer-unternehmen"[^>]*>Für Unternehmen/,
    );
    expect(sprint8Pages.businessPv.seo.canonicalPath).toBe(expected[2]);
    expect(sprint8Pages.businessPv.ctaHref).toBe(CONTACT_FORM_HREF);
  });
});
