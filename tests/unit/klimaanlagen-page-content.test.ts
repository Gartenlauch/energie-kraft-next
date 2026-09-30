import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/config/env/public", () => ({
  publicEnv: { NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de" },
}));
vi.mock("@/lib/faq/public-repository", () => ({
  getPublicFaqEntriesByRoute: vi.fn().mockResolvedValue([]),
}));

import KlimaanlagenPage, { metadata } from "@/app/(site)/klimaanlagen/page";
import { PublicContentPage } from "@/app/(site)/_components/public-content-page";
import { CONTACT_FORM_HREF } from "@/config/routes";
import { klimaanlagenContent, klimaanlagenProducts } from "@/content/pages/klimaanlagen";
import { getPublicFaqEntriesByRoute } from "@/lib/faq/public-repository";

describe("Klimaanlagen advisory and Bosch offering", () => {
  let html: string;
  beforeAll(async () => {
    html = renderToStaticMarkup(await PublicContentPage(KlimaanlagenPage().props));
  });

  it("preserves SEO, FAQ routing, H1 and brand signet", () => {
    expect(metadata.title).toEqual({
      absolute: "Klimaanlage kaufen & installieren | Energie-Kraft Süd",
    });
    expect(metadata.description).toBe(
      "Bosch Klimaanlage kaufen: Single- und Multisplit-Lösungen für Haus, Wohnung und Gewerbe. Beratung und Planung durch Energie-Kraft Süd aus Ainring.",
    );
    expect(metadata.alternates?.canonical).toBe("https://www.energie-kraft.de/klimaanlagen");
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain("Angenehme Raumtemperaturen – individuell und effizient geplant");
    expect(html.match(/class="brand-intro /g)).toHaveLength(1);
    expect(html).toContain("brand-intro--brand");
    expect(getPublicFaqEntriesByRoute).toHaveBeenCalledWith("klimaanlagen");
  });

  it("renders the requested section order and exactly three verified product portraits", () => {
    const expected = [
      "klimaanlagen-planung",
      "single-split",
      "bosch-klimaanlagen",
      "multi-split",
      "kuehlen-und-heizen",
      "photovoltaik",
      "komfort-und-betrieb",
      "installation",
      "beratung",
    ];
    const ids = [...html.matchAll(/<section[^>]*id="([^"]+)"/g)].map((match) => match[1]);
    expect(ids.filter((id) => expected.includes(id))).toEqual(expected);
    expect(ids).not.toContain("wartung");
    expect(html.match(/<article\b/g)).toHaveLength(3);
    expect(klimaanlagenProducts.map((product) => product.name)).toEqual([
      "Bosch Climate 3200i",
      "Bosch Climate 6000iP",
      "Bosch Climate 5000 M",
    ]);
    for (const product of klimaanlagenProducts) {
      expect(html).toContain(product.name);
      expect(html).toContain(product.source);
      expect(product.source).toMatch(
        /^https:\/\/www\.bosch-homecomfort\.com\/de\/de\/ocs\/wohngebaeude\//,
      );
      expect(existsSync(`public${product.image}`)).toBe(true);
    }
  });

  it("shows the actual conversion links and accurate installation cooperation", () => {
    const hero = html.split('class="premium-hero ')[1].split("</section>")[0];
    expect(hero).toContain('href="/konfigurator/klimaanlage"');
    expect(hero).toContain(`href="${CONTACT_FORM_HREF}"`);
    expect(html).toContain('href="/photovoltaik"');
    expect(html).toContain("gemeinsam mit qualifizierten Montagepartnern");
    expect(html).toContain("Auch nach der Inbetriebnahme unterstützen wir bei Fragen zu Betrieb, Pflege und Service.");
    expect(html).toContain("Regelmäßige Filterpflege und eine bedarfsgerechte Wartung unterstützen einen zuverlässigen Anlagenbetrieb.");
    expect(html).toContain('href="/service-und-wartung"');
    expect(html).toContain("Service &amp; Wartung kennenlernen");
    expect(html).not.toContain('id="wartung"');
    expect(html).toContain("Kältemittel R290");
    expect(html).not.toMatch(
      /unsere Monteure|eigenes Montageteam|Installation durch unser eigenes Team|Bosch-zertifiziert/i,
    );
    expect(JSON.stringify(klimaanlagenContent)).not.toMatch(
      /unsere Monteure|eigenes Montageteam|Installation durch unser eigenes Team|Bosch-zertifiziert/i,
    );
  });
});
