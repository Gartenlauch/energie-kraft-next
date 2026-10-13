import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { WallboxProductShowcase } from "@/app/(site)/wallbox/_components/wallbox-product-showcase";

vi.mock("@/config/env/public", () => ({
  publicEnv: { NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de" },
}));
import { wallboxContent } from "../../src/content/pages/wallbox";
import { wallboxProducts } from "../../src/content/wallbox-products";
import { analyzeFaqJsonImport } from "../../src/lib/faq/json-transfer";
import { selectPublicFaqEntriesForRoute } from "../../src/lib/faq/public-selection";
import { buildFaqPageJsonLd } from "../../src/lib/seo/faq-json-ld";

const importDocument = JSON.parse(readFileSync(resolve("docs/wallbox-faq-import.json"), "utf8"));

describe("Wallbox relaunch content contracts", () => {
  it("preserves metadata, calculator and historical entities without offers", () => {
    expect(wallboxContent.seo).toEqual({
      title: "Wallbox kaufen & PV-Strom laden | Energie-Kraft Süd",
      description:
        "Wallbox kaufen und Elektroauto sicher zu Hause laden. Mit Photovoltaik, Überschussladen und intelligentem Lastmanagement.",
      canonicalPath: "/wallbox",
    });
    expect(
      wallboxContent.sections.find((section) => section.id === "wallbox-rechner")?.cta?.href,
    ).toBe("/rechner/wallbox-kosten");
    expect(wallboxProducts.map((product) => product.id)).toEqual([
      "alfen-eve-single-plus-de",
      "sigen-ev-dc",
      "sigen-ev-ac",
      "fronius-wattpilot-home-22-j",
      "abl-pulsar",
    ]);
    const copy = JSON.stringify({ wallboxContent, wallboxProducts });
    for (const phrase of [
      "sonnenHome Charger 2",
      "sonnen Charger 2",
      "sonnen Wallbox",
      "nicht mehr erhältlich",
      "PV-Überschussladen",
      "11 kW",
      "22 kW",
      "App-Steuerung",
      "Lastmanagement",
      "Eichrechtskonformität",
      "Fahrzeugfreigabe",
    ])
      expect(copy).toContain(phrase);
    for (const product of wallboxProducts)
      if (product.image) {
        expect(product.image.src).toMatch(/^\/images\/wallbox\/products\//);
        expect(existsSync(resolve("public", product.image.src.slice(1)))).toBe(true);
        expect(product.image.width).toBeGreaterThan(0);
        expect(product.image.height).toBeGreaterThan(0);
      }
  });

  it("renders the AC charger after DC with the verified specifications, supplied image and official sources", () => {
    const section = wallboxContent.sections.find((section) => section.id === "wallbox-produkte")!;
    const html = renderToStaticMarkup(createElement(WallboxProductShowcase, { section }));
    const order = [...html.matchAll(/<article[^>]*id="([^"]+)"/g)].map((match) => match[1]);
    expect(order).toEqual(wallboxProducts.map((product) => product.id));
    const ac = wallboxProducts.find((product) => product.id === "sigen-ev-ac")!;
    const block = html.split('id="sigen-ev-ac"')[1].split("</article>")[0];
    expect(ac.specifications).toHaveLength(9);
    for (const spec of ac.specifications!) {
      expect(block).toContain(spec.label);
      expect(block).toContain(spec.value);
    }
    expect(block).toContain("Sigen EV AC Charger");
    expect(block).toContain("Sigen Power Sensor");
    expect(block).toContain("SigenStor-Konfiguration");
    expect(block).toContain("object-contain");
    expect(block).not.toMatch(/V2H|V2G/);
    expect(html).toContain("Sigenergy AC");
    expect(html).toContain("Sigenergy DC");
    for (const source of ac.sources!) {
      const link = [...block.matchAll(/<a\b[^>]*>/g)]
        .map((match) => match[0])
        .find((anchor) => anchor.includes(source.href));
      expect(link).toContain('target="_blank"');
      expect(link).toContain('rel="noopener"');
    }
  });

  it("keeps the requested section order and existing anchor targets", () => {
    expect(wallboxContent.sections.map((section) => section.id)).toEqual([
      "wallbox-planung",
      "wallbox-produkte",
      "pv-ueberschussladen",
      "bidirektionales-laden",
      "lastmanagement",
      "wallbox-rechner",
      "komfort",
      "unternehmen",
      "installation",
    ]);
  });

  it("accepts the admin import and exposes exactly the six curated questions with valid FAQ data", () => {
    const analysis = analyzeFaqJsonImport(importDocument, [], []);
    expect(analysis.preview.errors).toEqual([]);
    expect(analysis.preview.valid).toBe(true);
    expect(analysis.document?.faqs).toHaveLength(9);
    if (!analysis.document) throw Error("Invalid FAQ import");
    const { faqs, categories } = analysis.document;
    const selected = selectPublicFaqEntriesForRoute(faqs, categories, "wallbox").slice(0, 6);
    expect(selected.map((faq) => faq.question)).toEqual([
      "Welche Wallbox passt zu meiner Photovoltaikanlage?",
      "Kann ich mein Elektroauto nur mit PV-Überschuss laden?",
      "Brauche ich für eine 22-kW-Wallbox einen stärkeren Hausanschluss?",
      "Was ist der Unterschied zwischen 11 kW und 22 kW Ladeleistung?",
      "Was bedeutet bidirektionales Laden und welche Fahrzeuge unterstützen es?",
      "Ist der sonnenHome Charger 2 noch erhältlich?",
    ]);
    expect(faqs.find((faq) => faq.slug === "pv-ueberschussladen")?.id).toBe(
      "s83a-wallbox-pv-ueberschussladen",
    );
    expect(faqs.find((faq) => faq.slug === "wallbox-ladeleistung")?.id).toBe(
      "s83a-wallbox-wallbox-ladeleistung",
    );
    const schema = buildFaqPageJsonLd(selected);
    expect(schema?.mainEntity).toHaveLength(6);
    expect(JSON.parse(JSON.stringify(schema))).toEqual(schema);
  });
});
