import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/config/env/public", () => ({
  publicEnv: { NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de" },
}));
vi.mock("@/lib/faq/public-repository", () => ({
  getPublicFaqEntriesByRoute: vi.fn().mockResolvedValue([]),
}));

import PhotovoltaikPage, { metadata } from "@/app/(site)/photovoltaik/page";
import { PublicContentPage } from "@/app/(site)/_components/public-content-page";
import { photovoltaikContent } from "@/content/pages/photovoltaik";
import { stromspeicherContent } from "@/content/pages/stromspeicher";
import { CONTACT_FORM_HREF } from "@/config/routes";
import { getPublicFaqEntriesByRoute } from "@/lib/faq/public-repository";
import nextConfig from "../../next.config";

describe("Residential photovoltaic migration", () => {
  let html: string;
  beforeAll(async () => {
    const page = PhotovoltaikPage();
    html = renderToStaticMarkup(await PublicContentPage(page.props));
  });

  it("preserves metadata, the H1, regional positioning and all anchors", () => {
    expect(metadata.title).toEqual({
      absolute: "Photovoltaik kaufen: Planung & Montage | Energie-Kraft Süd",
    });
    expect(metadata.description).toBe(
      "Photovoltaik kaufen in Bayern: PV-Anlagen mit Speicher, Beratung, Planung und Montage aus einer Hand. Energie-Kraft Süd aus Ainring.",
    );
    expect(metadata.alternates?.canonical).toBe("https://www.energie-kraft.de/photovoltaik");
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain("Photovoltaik kaufen und eigenen Solarstrom erzeugen");
    for (const term of [
      "PV-Anbieter aus Bayern",
      "Ainring bei Freilassing",
      "Berchtesgadener Land",
      "Landkreis Traunstein",
      "über 20 Jahre",
      "alles aus einer Hand",
    ])
      expect(html).toContain(term);
    for (const id of [
      "pv-komplettloesung",
      "eigenverbrauch",
      "pv-rechner",
      "komponenten",
      "montagesysteme",
      "monitoring",
      "finanzierung-und-foerderung",
      "regionale-referenzen",
      "planung-und-montage",
    ])
      expect(html).toContain(`id="${id}"`);
    expect(getPublicFaqEntriesByRoute).toHaveBeenCalledWith("photovoltaik");
  });

  it("renders two hero actions, both calculators, contact and one decorative signet", () => {
    const hero = html.split('class="premium-hero ')[1].split("</section>")[0];
    expect(hero.match(/<a\b/g)).toHaveLength(2);
    expect(hero).toContain('href="/konfigurator/photovoltaik"');
    expect(hero).toContain(`href="${CONTACT_FORM_HREF}"`);
    expect(hero).toContain("Projekt konfigurieren");
    expect(hero).toContain("PV-Beratung anfragen");
    for (const href of ["/rechner/photovoltaik", "/rechner/photovoltaik-kosten", CONTACT_FORM_HREF])
      expect(html).toContain(`href="${href}"`);
    expect(html.match(/class="brand-intro brand-intro--brand"/g)).toHaveLength(1);
    expect(html).toContain('class="brand-intro brand-intro--brand" aria-hidden="true"');
    expect(
      photovoltaikContent.sections.find((s) => s.id === "planung-und-montage")?.cta?.href,
    ).toBe(CONTACT_FORM_HREF);
  });

  it("uses visually approved Sigenergy and a byte-identical full SIKO illustration", () => {
    const storage = html.split('id="eigenverbrauch"')[1].split("</section>")[0];
    expect(storage).toContain("/images/battery-storage/residential-storage-feature-desktop.webp");
    expect(storage).toContain("/images/battery-storage/residential-storage-feature-mobile.webp");
    expect(storage).toContain("Sigenergy-Batteriespeicher an einem Wohnhaus");
    expect(storage).not.toMatch(/(?:src|srcSet)="[^"]*sonnen/i);
    const mounting = html.split('id="montagesysteme"')[1].split("</section>")[0];
    expect(mounting).toContain("editorial-section--technical");
    expect(mounting).toContain('width="1679" height="1256"');
    expect(mounting).toContain("SIKO-Montagesystem mit Schneefang.");
    expect(mounting).toContain("object-contain");
    expect(
      createHash("sha256")
        .update(readFileSync("public/images/photovoltaic/siko-montagesystem-schneefang.webp"))
        .digest("hex"),
    ).toBe("589dfc1adb9c84311306208ecf06287ff24f1ca0fc9287d6c768fd6667169d13");
    for (const src of [
      "/images/photovoltaic/siko-montagesystem-schneefang.webp",
      "/images/photovoltaic/ainring-pv-region.webp",
      "/images/battery-storage/residential-storage-feature-desktop.webp",
      "/images/battery-storage/residential-storage-feature-mobile.webp",
    ])
      expect(existsSync(`public${src}`)).toBe(true);
  });

  it("retains the storage page hero and cover defaults", async () => {
    const storage = renderToStaticMarkup(
      await PublicContentPage({ content: stromspeicherContent }),
    );
    const hero = storage.split('class="premium-hero ')[1].split("</section>")[0];
    expect(hero).toContain("/images/battery-storage/residential-storage-hero-desktop.webp");
    expect(hero).toContain("/images/battery-storage/residential-storage-hero-mobile.webp");
    expect(hero).toContain("Sigenergy-Stromspeicher an der Terrasse eines Wohnhauses");
    expect(storage).not.toContain("editorial-section--technical");
  });

  it("adds only exact permanent legacy PV rules alongside the existing main redirect", async () => {
    const redirects = await nextConfig.redirects!();
    const expected = [
      ["/energieloesungen/photovoltaik-kaufen", "/photovoltaik"],
      ["/photovoltaik/strom-speichern", "/stromspeicher"],
      ["/photovoltaik/foerderungen", "/service-und-wartung/finanzierung-und-foerderung"],
      ["/photovoltaik/preistabelle-photovoltaik", "/rechner/photovoltaik-kosten"],
      ["/photovoltaik/service-und-reparatur", "/service-und-wartung"],
      ["/photovoltaik/strom-produzieren", "/photovoltaik"],
      ["/photovoltaik/strom-tanken", "/wallbox"],
    ];
    for (const [source, destination] of expected)
      expect(redirects.filter((r) => r.source === source)).toEqual([
        { source, destination, permanent: true },
      ]);
    expect(redirects.filter((r) => r.source.startsWith("/photovoltaik/"))).toHaveLength(6);
    expect(
      redirects.some((r) => r.source.startsWith("/photovoltaik") && r.source.includes(":")),
    ).toBe(false);
    expect(nextConfig.trailingSlash).toBe(false);
  });
});
