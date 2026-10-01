import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/config/env/public", () => ({
  publicEnv: { NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de" },
}));
vi.mock("@/lib/faq/public-repository", () => ({
  getPublicFaqEntriesByRoute: vi.fn().mockResolvedValue([]),
}));

import WaermepumpenPage, { metadata } from "@/app/(site)/waermepumpen/page";
import { PublicContentPage } from "@/app/(site)/_components/public-content-page";
import { CONTACT_FORM_HREF } from "@/config/routes";
import {
  waermepumpenContent,
  waermepumpenProducts,
  waermepumpenSystemNote,
} from "@/content/pages/waermepumpen";
import { getPublicFaqEntriesByRoute } from "@/lib/faq/public-repository";
import nextConfig from "../../next.config";

describe("Wärmepumpen advisory and Bosch offering", () => {
  let html: string;
  beforeAll(async () => {
    html = renderToStaticMarkup(await PublicContentPage(WaermepumpenPage().props));
  });

  it("preserves SEO, one H1, one brand signet, FAQ integration and redirect", async () => {
    expect(metadata.title).toEqual({ absolute: "Wärmepumpe mit Photovoltaik | Energie-Kraft Süd" });
    expect(metadata.description).toBe(
      "Bosch Luft-Wasser-Wärmepumpen: Beratung, Verkauf und Installation. Mit Photovoltaik und Speicher als abgestimmtes Energiesystem aus Ainring planen.",
    );
    expect(metadata.alternates?.canonical).toBe("https://www.energie-kraft.de/waermepumpen");
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain("Effizient heizen und eigenen Solarstrom intelligent nutzen");
    expect(html.match(/class="brand-intro /g)).toHaveLength(1);
    expect(html).toContain("brand-intro--brand");
    expect(getPublicFaqEntriesByRoute).toHaveBeenCalledWith("waermepumpen");
    expect(html).toContain('"@type":"WebPage"');
    expect(html).not.toMatch(/"@type":"(?:Product|Offer|AggregateRating|QAPage)"/);
    expect(await nextConfig.redirects!()).toContainEqual({
      source: "/energieloesungen/waermepumpe-mit-pv",
      destination: "/waermepumpen",
      permanent: true,
    });
  });

  it("renders each section once in the requested order and exactly two product portraits", () => {
    const expected = [
      "waermepumpen-planung",
      "bosch-waermepumpen",
      "photovoltaik-kombination",
      "energiemanagement",
      "effizienz",
      "waermepumpen-rechner",
      "umsetzung",
    ];
    const ids = [...html.matchAll(/<section[^>]*id="([^"]+)"/g)].map((match) => match[1]);
    expect(ids.filter((id) => expected.includes(id))).toEqual(expected);
    expect(html.match(/<article\b/g)).toHaveLength(2);
    expect(waermepumpenProducts.map((product) => product.name)).toEqual([
      "Bosch Compress 6800i AW",
      "Bosch Compress 5800i AW",
    ]);
    for (const product of waermepumpenProducts) {
      expect(html).toContain(`<h3 id="${product.id}-heading"`);
      expect(html).toContain(product.name);
      expect(html).toContain(product.source);
      expect(existsSync(`public${product.image}`)).toBe(true);
    }
    for (const name of [
      "bosch-compress-application.webp",
      "bosch-compress-application-mobile.webp",
    ])
      expect(existsSync(`public/images/heat-pump/products/${name}`)).toBe(true);
  });

  it("renders the exact single system note and its actual destinations", () => {
    expect(html.match(/>übrigens</g)).toHaveLength(1);
    const note = html
      .split('<aside aria-labelledby="waermepumpen-system-note-heading"')[1]
      .split("</aside>")[0];
    expect(note).toContain(waermepumpenSystemNote.title);
    expect(note).toContain(waermepumpenSystemNote.text);
    expect(note.match(/<a\b/g)).toHaveLength(2);
    expect(note).toContain('href="/konfigurator"');
    expect(note).toContain("Energieprojekt konfigurieren");
    expect(note).toContain('href="/stromspeicher"');
    expect(note).toContain("Zu den Stromspeichern");
    expect(note).not.toContain("/konfigurator/waermepumpe");
  });

  it("renders hero and final contact targets and retains the calculator", () => {
    const hero = html.split('class="premium-hero ')[1].split("</section>")[0];
    expect(hero.match(/<a\b/g)).toHaveLength(2);
    expect(hero).toContain('href="/konfigurator/waermepumpe"');
    expect(hero).toContain("Projekt konfigurieren");
    expect(hero).toContain(`href="${CONTACT_FORM_HREF}"`);
    expect(hero).toContain("Wärmepumpen-Beratung anfragen");
    expect(html).toContain('href="/rechner/waermepumpe-kosten"');
    expect(html).toContain("Wärmepumpen-Rechner öffnen");
    const final = html.slice(html.indexOf("Welche Wärmepumpe passt zu Ihrem Zuhause?"));
    expect(final).toContain(`href="${CONTACT_FORM_HREF}"`);
    expect(final).toContain("Wärmepumpenprojekt besprechen");
    const contactLinks = [...html.matchAll(/<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gs)].filter(
      (match) => /(?:anfragen|besprechen)/.test(match[2]),
    );
    expect(contactLinks).toHaveLength(4);
    for (const link of contactLinks) expect(link[1]).toBe(CONTACT_FORM_HREF);
  });

  it("describes installation cooperation, company experience and integration limits accurately", () => {
    expect(html).toContain("gemeinsam mit qualifizierten Montagepartnern");
    expect(html).toContain("Energie-Kraft Süd besteht seit über 20 Jahren.");
    expect(html).toContain("Ainring bei Freilassing");
    expect(html).toContain("Berchtesgadener Land");
    expect(html).toContain("Landkreis Traunstein");
    expect(html).toContain("HomeCom Easy");
    expect(html).toContain("Bosch Energiemanager");
    expect(html).toContain("mySigen");
    expect(html).toContain(
      "SG-Ready-Ansteuerung ist keine vollständige stufenlose Leistungsregelung",
    );
    expect(html).toContain("Auch ein Batteriespeicher ersetzt keine saisonale Energieversorgung.");
    expect(JSON.stringify(waermepumpenContent)).not.toMatch(
      /verkaufen keine Wärmepumpen|installieren keine Wärmepumpen|Bestseller|meistverkauft|Bosch-zertifiziert|20 Jahren.*Wärmepumpeninstallateur/i,
    );
    expect(html).not.toContain("/stromtarife-pv");
  });
});
