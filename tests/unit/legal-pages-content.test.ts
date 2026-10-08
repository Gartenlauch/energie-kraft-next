import { createHash } from "node:crypto";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/config/env/public", () => ({
  publicEnv: { NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de" },
}));

import ImpressumPage, { metadata as imprintMetadata } from "@/app/(site)/impressum/page";
import AgbPage, { metadata as agbMetadata } from "@/app/(site)/agb/page";

function articleText(html: string) {
  const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1];
  expect(article).toBeDefined();
  return article!
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

describe("Verbatim legal migration, source snapshot 2026-10-08", () => {
  const imprintHtml = renderToStaticMarkup(ImpressumPage());
  const agbHtml = renderToStaticMarkup(AgbPage());

  // Independently calculated from the original public HTML rich-text blocks.
  // Whitespace is normalized; no legal correctness is evaluated here.
  it.each([
    [imprintHtml, "b4d864497325c0a06165ee2c93371880f6b697f084079d5000df02be3ce12b2b"],
    [agbHtml, "b4a7c9d77604365ee0454217983571becca6efd267a4af4615bd7aa8955024ec"],
  ])("renders the complete original legal text (case %#)", (html, digest) => {
    expect(createHash("sha256").update(articleText(html)).digest("hex")).toBe(digest);
  });

  it("retains company details and disclaimer, omitting only the agency credit", () => {
    const text = articleText(imprintHtml);
    for (const value of [
      "Energie-Kraft Süd GmbH & Co. KG",
      "Energie-Kraft Süd Verwaltungs GmbH",
      "HRA9372",
      "HRB17443",
      "DE814795925",
      "Amtsgericht Traunstein",
      "Markus Österlein",
      "Kai Stengle",
      "Gewerbestraße 12",
      "83404 Ainring",
      "Unternehmensgegenstand:",
      "haftungsausschluss",
      "Hinweis auf EU-Streitschlichtung",
    ]) {
      expect(text).toContain(value);
    }
    expect(text).not.toMatch(/Konzeption und Realisation|psbrands|Dr\.-Mack-Straße|90762 Fürth/i);
    expect(imprintHtml).toContain('href="mailto:office@energie-kraft.de"');
    expect(imprintHtml).toContain('href="https://ec.europa.eu/consumers/odr/"');
    expect(imprintHtml).toContain('href="tel:+498654771610"');
  });

  it("retains the AGB date, ten main sections and all 70 numbered clauses", () => {
    expect(articleText(agbHtml)).toContain(
      "Allgemeine Geschäftsbedingungen Energiekraft Süd GmbH & Co. KG, Stand 01.02.2025",
    );
    const headings = [...agbHtml.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)].map((match) =>
      Number(match[1].replace(/<[^>]+>/g, "").match(/^\d+/)?.[0]),
    );
    expect(headings).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const clauses = [...agbHtml.matchAll(/<(?:p|li)\b[^>]*>(\d+\.\d+(?:\.\d+)?) /g)].map(
      (match) => match[1],
    );
    expect(clauses).toHaveLength(70);
    for (const number of ["3.1.5", "3.2.3", "5.4.2", "8.2.5", "10.2.4"])
      expect(clauses).toContain(number);
    expect(clauses.at(-1)).toBe("10.5");
    expect(agbHtml).not.toMatch(
      /Rechtliche Freigabe erforderlich|Für die finale Migration erforderlich/,
    );
  });

  it.each([
    [imprintHtml, imprintMetadata, "/impressum", "Impressum | Energie-Kraft Süd"],
    [agbHtml, agbMetadata, "/agb", "Allgemeine Geschäftsbedingungen | Energie-Kraft Süd"],
  ])("keeps a single H1, breadcrumb and canonical (case %#)", (html, metadata, path, title) => {
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain('aria-label="Breadcrumb"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('href="/"');
    expect(metadata.alternates?.canonical).toBe(`https://www.energie-kraft.de${path}`);
    expect(metadata.title).toEqual({ absolute: title });
  });
});
