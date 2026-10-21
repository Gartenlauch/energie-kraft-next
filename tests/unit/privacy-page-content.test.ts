import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/config/env/public", () => ({
  publicEnv: { NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de" },
}));
// Privacy indexing awaits go-live approval even when the rest of the site is indexable.
vi.mock("@/config/search-indexing", () => ({ isSearchIndexingEnabled: () => true }));

import DatenschutzPage, { metadata } from "@/app/(site)/datenschutz/page";

describe("Privacy publication copy", () => {
  const html = renderToStaticMarkup(DatenschutzPage());

  it("retains its own noindex, canonical and twelve sections", () => {
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
    expect(metadata.alternates?.canonical).toBe("https://www.energie-kraft.de/datenschutz");
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    const numbers = [...html.matchAll(/<section\b[\s\S]*?<h2\b[^>]*><span>(\d+)\./g)]
      .map((match) => Number(match[1]));
    expect(numbers).toEqual(Array.from({ length: 12 }, (_, index) => index + 1));
  });

  it("renders visitor copy without editorial release notes", () => {
    const text = html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ");
    const editorialNotes = /Freigabeentwurf|Entwurf\s*[–-]|nicht zur Produktionsveröffentlichung freigegeben|Vor Veröffentlichung bestätigen|Vor der Veröffentlichung|Noch offen|Zur Freigabe|Interne Prüf- und Arbeitshinweise|Verbleibender Freigabepunkt|noch zu bestätigen|hier ergänzt|gesondert zu bewerten|Vorgesehene Rechtsgrundlage/i;
    expect(text).not.toMatch(editorialNotes);
    expect(JSON.stringify(metadata)).not.toMatch(editorialNotes);
    expect(text).toContain("Stand: 21. Oktober 2026");
    expect(text).toContain("10. Google Analytics 4 und deaktiviertes Google-Ads-Webtracking");
    expect(text).toContain(
      "nach Ihrer ausdrücklichen Einwilligung in „Statistik – Google Analytics 4“ den Statistikdienst Google Analytics 4",
    );
    expect(text).toContain(
      "Vor Ihrer Zustimmung werden keine Analytics-Skripte geladen und auch keine cookielosen Analytics-Pings versendet",
    );
    expect(text).toContain(
      "Google-Ads-Webtracking, Conversion-Tracking, Remarketing und personalisierte Werbung bleiben technisch deaktiviert, auch bei Auswahl der entsprechenden Kategorien.",
    );
  });

  it("publishes the confirmed privacy contacts and secure authority link", () => {
    for (const value of [
      "Energie-Kraft Süd GmbH &amp; Co. KG", "Gewerbestraße 12", "83404", "Ainring",
      "Kai Stengle", 'href="mailto:office@energie-kraft.de"',
      'href="mailto:datenschutz@energie-kraft.de"', 'href="tel:+498654771610"',
      "Bayerisches Landesamt für Datenschutzaufsicht", "Promenade 18", "91522 Ansbach",
    ]) expect(html).toContain(value);
    const authority = html.match(/<a\b[^>]*href="https:\/\/www\.lda\.bayern\.de\/"[^>]*>/)?.[0];
    expect(authority).toContain('target="_blank"');
    expect(authority).toContain('rel="noopener noreferrer"');
  });
});
