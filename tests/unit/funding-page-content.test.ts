import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/config/env/public", () => ({
  publicEnv: { NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de" },
}));

import FundingPage, {
  metadata,
} from "@/app/(site)/service-und-wartung/finanzierung-und-foerderung/page";
import { CONTACT_FORM_HREF, PUBLIC_ROUTE_LIST, PUBLIC_ROUTES } from "@/config/routes";
import { fundingPageContent, fundingTopics } from "@/content/pages/funding";

describe("Funding guide: verified October 2026 snapshot", () => {
  let html: string;
  beforeAll(() => {
    html = renderToStaticMarkup(FundingPage());
  });

  it("keeps one H1, canonical metadata, central sitemap registration and project CTAs", () => {
    const route = PUBLIC_ROUTES["finanzierung-und-foerderung"];
    expect(metadata.alternates?.canonical).toBe(`https://www.energie-kraft.de${route.href}`);
    expect(metadata.title).toEqual({ absolute: fundingPageContent.seo.title });
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain("Finanzierung &amp; Förderung für Ihr Energieprojekt");
    expect(PUBLIC_ROUTE_LIST).toContain(route);
    expect(route.navigation).toEqual({ header: false, footer: false });
    expect(html).toContain(`href="${CONTACT_FORM_HREF}"`);
    expect(html).toContain('href="/konfigurator"');
  });

  it("distinguishes a draft law, scheduled changes and absence of a new storage programme", () => {
    const [pv, storage, heating] = fundingTopics;
    expect(pv.outlook[0].status).toBe("planned");
    expect(pv.outlook[0].text).toContain("noch kein endgültig beschlossenes Gesetz");
    expect(storage.outlook[0].status).toBe("unconfirmed");
    expect(heating.outlook.map((item) => item.status)).toEqual(["scheduled", "planned"]);
    expect(heating.outlook[1].text).toContain("noch nicht beantragbar");
    expect(html).toContain("Bereits festgelegt · ab 2027");
    expect(html).toContain("Für 2027 geplant · noch nicht gültig");
    expect(html).toMatch(/dateTime="2026-10-05"/i);
  });

  it("protects new applications from stale heating bonus values and unconditional promises", () => {
    const heating = fundingTopics.find((topic) => topic.id === "waermepumpen")!;
    const text = heating.current.map((item) => `${item.title} ${item.text}`).join(" ");
    expect(text).toContain("16 % Klimageschwindigkeitsbonus");
    expect(text).toContain("28.000 €");
    expect(text).toContain("höchstens 70 %, in der niedrigsten Einkommensstufe bis zu 80 %");
    expect(text).toContain("Effizienzbonus ist für neue Anträge entfallen");
    expect(text).not.toMatch(
      /20 % Klimageschwindigkeitsbonus|5 % Effizienzbonus|30\.000 € förderfähige Kosten/,
    );
    expect(heating.attention).toContain("Vertragsbedingung darf nicht nachträglich ergänzt werden");
    expect(heating.attention).toContain("ein Rechtsanspruch besteht nicht");
  });

  it("links every product journey, cites each claim and labels generated imagery", () => {
    for (const topic of fundingTopics) {
      for (const link of topic.links) expect(html).toContain(`href="${link.href}"`);
      for (const item of [...topic.current, ...topic.outlook]) expect(item.source).toBeTruthy();
    }
    expect(html).toContain("KfW 570 setzt voraus, dass keine EEG-Förderung");
    expect(html).toContain("10.000-Häuser-Programm ist beendet");
    expect(html).toContain("KI-generiertes, illustratives Motiv · kein Referenzprojekt");
    expect(html).toContain("Ainring");
    expect(html).toContain("Berchtesgadener Land");
    expect(html).toContain("Landkreis Traunstein");
    expect(html).not.toContain('"@type":"FAQPage"');
  });

  it("adds project financing without publishing unconfirmed partners or a credit promise", () => {
    const block = html.match(
      /<aside[^>]*aria-labelledby="projektfinanzierung-heading"[\s\S]*?<\/aside>/,
    )?.[0];
    expect(block).toBeTruthy();
    expect(block).toContain("Finanzierung passend zu Ihrem Energieprojekt");
    expect(block).toContain("Eigenmitteln");
    expect(block).toContain("Hausbank");
    expect(block).toContain("Finanzierungspartnern");
    expect(block).toContain("Leasing");
    expect(block).toContain("keine individuelle Finanzberatung");
    expect(block).not.toMatch(/Sparkasse|Raiffeisen|IBC|garantierte|Zinssatz/i);
  });
});
