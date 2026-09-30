import { createElement } from "react";
import type * as ReactModule from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/config/env/public", () => ({
  publicEnv: { NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de" },
}));
vi.mock("react", async (importOriginal) => {
  const original = await importOriginal<typeof ReactModule>();
  return {
    ...original,
    useState: (initial: unknown) =>
      original.useState(
        initial === null
          ? "service"
          : initial === "energy"
            ? "service"
            : initial === false
              ? true
              : initial,
      ),
  };
});
vi.mock("next/navigation", () => ({ usePathname: () => "/service-und-wartung" }));

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PUBLIC_ROUTE_LIST, PUBLIC_ROUTES } from "@/config/routes";
import nextConfig from "../../next.config";

const expectedServiceLinks = [
  "/service-und-wartung",
  "/service-und-wartung#anlagencheck-monitoring",
  "/service-und-wartung/finanzierung-und-foerderung",
  "/kunden-werben-kunden",
];

describe("Service navigation and routes", () => {
  it("shows the four service links in the desktop and mobile menus", () => {
    const html = renderToStaticMarkup(createElement(SiteHeader));
    const desktopLinks = [...html.matchAll(/data-preview-key="([^"]+)"/g)].map((match) => match[1]);
    const mobileServiceLinks = html
      .split('id="mobile-service-links"')[1]
      ?.split("</ul>")[0]
      .match(/href="([^"]+)"/g)
      ?.map((href) => href.slice(6, -1));

    expect(desktopLinks).toEqual(expectedServiceLinks);
    expect(mobileServiceLinks).toEqual(expectedServiceLinks);
    expect(html).toContain("Anlagencheck &amp; Monitoring");
    expect(html).toContain("Finanzierung &amp; Förderung");
    expect(html).toContain("Kunden werben Kunden");
    expect(html).not.toContain("Wartung &amp; Reinigung");
    expect(html).not.toContain("Service &amp; Team");
    expect(html).toContain('aria-controls="energy-mega-menu"');
    expect(html).toContain('href="/referenzen"');
  });

  it("keeps Service & Team as a sitemap route without a prominent footer link", () => {
    const footer = renderToStaticMarkup(createElement(SiteFooter));
    expect(footer).not.toContain('href="/service-und-wartung/service-und-team"');
    expect(PUBLIC_ROUTE_LIST).toContain(PUBLIC_ROUTES["service-und-team"]);
    expect(
      PUBLIC_ROUTE_LIST.some(
        (route) => route.href === "/service-und-wartung/wartung-und-reinigung",
      ),
    ).toBe(false);
  });

  it("redirects the old maintenance URL directly and permanently to the service hub", async () => {
    const redirects = await nextConfig.redirects?.();
    expect(redirects).toContainEqual({
      source: "/service-und-wartung/wartung-und-reinigung",
      destination: "/service-und-wartung",
      permanent: true,
    });
  });
});
