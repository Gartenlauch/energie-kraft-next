import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FaqCatalogEntry } from "@/types/faq";

const navigation = vi.hoisted(() => ({ query: "", push: vi.fn() }));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(navigation.query),
  usePathname: () => "/faq",
  useRouter: () => ({ push: navigation.push }),
}));
vi.mock("@/config/env/public", () => ({
  publicEnv: { isProduction: true, NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de" },
}));
vi.mock("@/lib/faq/public-repository", () => ({ getPublicFaqCatalog: vi.fn() }));

import { FaqExplorer } from "@/components/faq/faq-explorer";
import { PublicFaqSection } from "@/components/faq/public-faq-section";
import { EnergyFlow } from "@/components/marketing/energy-flow";
import FaqPage, { metadata } from "@/app/(site)/faq/page";
import FaqDetailPage, { generateMetadata } from "@/app/(site)/faq/[category]/[slug]/page";
import { getPublicFaqCatalog } from "@/lib/faq/public-repository";
import sitemap from "@/app/sitemap";
import config from "../../next.config";

const categories = [
  { id: "internal-pv", name: "Photovoltaik", slug: "photovoltaik" },
  { id: "internal-storage", name: "Stromspeicher", slug: "stromspeicher" },
];
const entries: FaqCatalogEntry[] = categories.map((category, i) => ({
  id: `entry-${i}`,
  slug: `frage-${i}`,
  question: `${category.name} planen?`,
  answer: "Ausführliche Antwort",
  shortAnswer: "Kurz erklärt",
  categoryId: category.id,
  categorySlug: category.slug,
  categoryName: category.name,
  relatedFaqIds: [],
  featured: false,
  sortOrder: i,
  href: `/faq/${category.slug}/frage-${i}`,
}));

beforeEach(() => {
  navigation.query = "";
  vi.mocked(getPublicFaqCatalog).mockResolvedValue({ entries, categories });
});

describe("FAQ URL filters", () => {
  it.each(["", "category=invalid", "category=", "category=internal-pv"])(
    "falls back to all topics for %s",
    (query) => {
      navigation.query = query;
      const html = renderToStaticMarkup(createElement(FaqExplorer, { entries, categories }));
      expect(html).toContain('<option value="" selected="">Alle Themen</option>');
      expect(html).toContain("2 Fragen gefunden");
      for (const entry of entries) expect(html).toContain(entry.question);
    },
  );
  it.each(categories)("selects $slug using the public slug, never the document ID", (category) => {
    navigation.query = `category=${category.slug}`;
    const html = renderToStaticMarkup(createElement(FaqExplorer, { entries, categories }));
    expect(html).toContain(`<option value="${category.slug}" selected="">`);
    expect(html).toContain("1 Fragen gefunden");
    expect(html).toContain(`${category.name} planen?`);
    expect(html).not.toContain(
      entries.find((entry) => entry.categorySlug !== category.slug)!.question,
    );
  });
  it("limits initial results to 12 and offers pagination", () => {
    const many = Array.from({ length: 15 }, (_, i) => ({ ...entries[0]!, id: `q${i}` }));
    const html = renderToStaticMarkup(createElement(FaqExplorer, { entries: many, categories }));
    expect(html.match(/class="faq-result /g)).toHaveLength(12);
    expect(html).toContain("15 Fragen gefunden · 12 angezeigt");
    expect(html).toContain("Weitere Fragen anzeigen");
  });
  it("uses query category links on the hub, homepage and product sections", async () => {
    for (const html of [
      renderToStaticMarkup(await FaqPage()),
      renderToStaticMarkup(createElement(EnergyFlow)),
      renderToStaticMarkup(
        createElement(PublicFaqSection, {
          faqs: [{ id: "q", question: "Frage?", answer: "Antwort", showInSchema: false }],
          categorySlug: "photovoltaik",
          categoryLabel: "Photovoltaik",
        }),
      ),
    ]) {
      expect(html).toContain('href="/faq?category=photovoltaik"');
      expect(html).not.toContain('href="/faq/photovoltaik"');
    }
    const html = renderToStaticMarkup(
      createElement(PublicFaqSection, {
        faqs: [{ id: "q", question: "Frage?", answer: "Antwort", showInSchema: false }],
      }),
    );
    expect(html).toContain('href="/faq"');
  });
  it("preserves detail canonicals and changes category breadcrumbs/backlinks", async () => {
    const props = { params: Promise.resolve({ category: "photovoltaik", slug: "frage-0" }) };
    expect((await generateMetadata(props)).alternates?.canonical).toBe(
      "https://www.energie-kraft.de/faq/photovoltaik/frage-0",
    );
    const html = renderToStaticMarkup(await FaqDetailPage(props));
    expect(html).toContain('href="/faq?category=photovoltaik"');
    expect(metadata.alternates?.canonical).toBe("https://www.energie-kraft.de/faq");
  });
  it("redirects one category segment only and keeps redirects/filters out of the sitemap", async () => {
    const redirects = (await config.redirects!()).filter((item) => item.source.startsWith("/faq"));
    expect(redirects).toEqual([
      { source: "/faq/:category", destination: "/faq?category=:category", permanent: true },
    ]);
    const urls = (await sitemap()).map(({ url }) => url);
    expect(urls).toContain("https://www.energie-kraft.de/faq");
    for (const entry of entries)
      expect(urls).toContain(`https://www.energie-kraft.de${entry.href}`);
    expect(urls.some((url) => url.includes("?category="))).toBe(false);
    for (const category of categories)
      expect(urls).not.toContain(`https://www.energie-kraft.de/faq/${category.slug}`);
  });
});
