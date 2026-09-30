import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/config/env/public", () => ({
  publicEnv: { NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de" },
}));

import ServicePage, { metadata } from "@/app/(site)/service-und-wartung/page";
import { CONTACT_FORM_HREF } from "@/config/routes";

describe("Service and maintenance hub", () => {
  let html: string;
  beforeAll(() => {
    html = renderToStaticMarkup(ServicePage());
  });

  it("keeps the required SEO, H1 and brand signet", () => {
    expect(metadata.title).toEqual({
      absolute: "Service & Wartung für Energieanlagen | Energie-Kraft Süd",
    });
    expect(metadata.description).toBe(
      "Service und Wartung für Photovoltaik, Speicher, Wärmepumpen und Klimaanlagen: Anlagencheck, Monitoring und technische Betreuung durch Energie-Kraft Süd.",
    );
    expect(metadata.alternates?.canonical).toBe("https://www.energie-kraft.de/service-und-wartung");
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain("Damit Ihre Energietechnik zuverlässig weiterarbeitet");
    expect(html).toContain("brand-intro--brand");
  });

  it("covers every system and links to its product page", () => {
    for (const [heading, href] of [
      ["Photovoltaik-Service", "/photovoltaik"],
      ["Service für Batteriespeicher", "/stromspeicher"],
      ["Service rund um die Wärmepumpe", "/waermepumpen"],
      ["Service &amp; Wartung für Klimaanlagen", "/klimaanlagen"],
    ]) {
      expect(html).toContain(heading);
      expect(html).toContain(`href="${href}"`);
    }
    expect(html).toContain("Filter und luftführende Komponenten");
    expect(html).toContain("Kondensatablauf");
    expect(html).toContain("Nachlassende Kühl- oder Heizleistung");
    expect(html).toContain("Sichtprüfung und Anlagenzustand");
    expect(html).toContain("Ertragsauffälligkeiten einordnen");
    expect(html).toContain("Bedarfsgerechte Reinigung");
    expect(html).toContain("keine pauschale regelmäßige Reinigung");
    expect(html).toContain("technisch und wirtschaftlich sinnvoll");
    expect(html).toContain("qualifizierten Fach- und Montagepartnern");
    expect(html).toContain("Ladeinfrastruktur");
    expect(html).toContain('href="/wallbox"');
  });

  it("limits monitoring claims and offers the established service routes", () => {
    expect(html).toContain("Monitoring unterstützt die frühzeitige Einordnung");
    expect(html).toContain("abhängig vom vereinbarten Serviceumfang");
    expect(html).toContain("über unsere Leitstelle");
    expect(html).toContain('id="anlagencheck-monitoring"');
    expect(html).toContain('href="/service-und-wartung/service-und-team"');
    expect(html).not.toContain('href="/service-und-wartung/wartung-und-reinigung"');
    expect(
      html.match(new RegExp(`href="${CONTACT_FORM_HREF}"`, "g"))?.length,
    ).toBeGreaterThanOrEqual(2);
    expect(html).toContain("Ainring");
    expect(html).toContain("Berchtesgadener Land");
    expect(html).toContain("Landkreis Traunstein");
    expect(html).not.toMatch(/Österreich|24\/7|garantierte Reaktionszeit/i);
  });
});
