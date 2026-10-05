import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/config/env/public", () => ({
  publicEnv: { NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de" },
}));

import ElectricityTariffsPage, { metadata } from "@/app/(site)/stromtarife-pv/page";
import { CONTACT_FORM_HREF, PUBLIC_ROUTES } from "@/config/routes";
import { electricityTariffsContent, gridFeeModules } from "@/content/pages/stromtarife";
import { sprint8Pages } from "@/content/sprint8-pages";

describe("Electricity tariffs: system advice and regulatory boundaries", () => {
  let html: string;
  let text: string;
  beforeAll(() => {
    html = renderToStaticMarkup(ElectricityTariffsPage());
    text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  });

  it("preserves the canonical and central content contract with one H1 and working journeys", () => {
    expect(metadata.alternates?.canonical).toBe("https://www.energie-kraft.de/stromtarife-pv");
    expect(sprint8Pages.electricityTariffs).toBe(electricityTariffsContent);
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    for (const key of [
      "photovoltaik",
      "stromspeicher",
      "waermepumpen",
      "wallbox",
      "konfigurator",
      "finanzierung-und-foerderung",
    ] as const) {
      expect(html).toContain(`href="${PUBLIC_ROUTES[key].href}"`);
    }
    expect(html).toContain(`href="${CONTACT_FORM_HREF}"`);
    expect(html).not.toContain('"@type":"FAQPage"');
  });

  it("keeps tariff risk and measurement requirements visible instead of promising savings", () => {
    expect(text).toContain("nicht automatisch günstiger");
    expect(text).toContain("kann dagegen höhere Kosten haben");
    expect(text).toContain("digitaler Zähler allein ist noch kein intelligentes Messsystem");
    expect(text).toContain("Seit 1. Januar 2025 müssen alle Stromlieferanten");
    expect(text).not.toMatch(/immer günstiger|garantierte Ersparnis|garantierte Finanzierung/i);
  });

  it("distinguishes grid fees, module eligibility and the supplier's pass-through", () => {
    expect(text).toContain("§ 14a ist kein Stromtarif");
    expect(text).toContain("mehr als 4,2 kW Netzanschlussleistung");
    expect(gridFeeModules[1].text).toContain("auf 40 %");
    expect(gridFeeModules[1].text).toContain("nicht den gesamten Strompreis");
    expect(gridFeeModules[2].condition).toContain("Nur zusammen mit Modul 1");
    expect(gridFeeModules[1].condition).toContain("nicht mit Modul 3");
    expect(text).toContain("Weitergabe ist nicht allein durch die Modulauswahl garantiert");
  });

  it("separates sharing over the grid from supply within a building and preserves rest supply", () => {
    expect(text).toContain("Seit 1. Juni 2026");
    expect(text).toContain("Ab 1. Juni 2028");
    expect(text).toContain("angrenzende Bilanzierungsgebiete in derselben Regelzone");
    expect(text).toContain("Viertelstündliche Messwerte");
    expect(text).toContain("ergänzender Stromliefervertrag");
    expect(text).toContain("ohne Durchleitung durch das öffentliche Netz");
    expect(text).not.toContain("bietet bereits Energiegemeinschaften an");
  });

  it("ships correctly sized local WebP crops and labels explanatory visuals", () => {
    for (const [src, width, height] of [
      [
        electricityTariffsContent.desktopSrc,
        electricityTariffsContent.desktopWidth,
        electricityTariffsContent.desktopHeight,
      ],
      [
        electricityTariffsContent.mobileSrc,
        electricityTariffsContent.mobileWidth,
        electricityTariffsContent.mobileHeight,
      ],
    ] as const) {
      const data = readFileSync(`public${src}`);
      expect(data.toString("ascii", 8, 12)).toBe("WEBP");
      expect(width / height).toBeCloseTo(src.includes("mobile") ? 0.8 : 1.6);
    }
    expect(text).toContain("kein Referenzprojekt");
    expect(text).toContain("Schematische Erklärung ohne Marktdaten oder Preisangaben");
    expect(text).toContain("es ist keine Energiequelle");
  });
});
