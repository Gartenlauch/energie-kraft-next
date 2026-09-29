import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const location = vi.hoisted(() => ({ pathname: "/stromspeicher" }));
vi.mock("next/navigation", () => ({ usePathname: () => location.pathname }));
vi.mock("@/config/env/public", () => ({
  publicEnv: { NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de" },
}));

import { SiteFooter } from "@/components/layout/site-footer";

describe("Global footer navigation", () => {
  it("preserves the Stromtarife link on storage and other pages", () => {
    for (const pathname of [
      "/stromspeicher",
      "/photovoltaik",
      "/wallbox",
      "/waermepumpen",
      "/klimaanlagen",
      "/",
    ]) {
      location.pathname = pathname;
      const html = renderToStaticMarkup(createElement(SiteFooter));
      expect(html).toContain('href="/energieloesungen/stromtarife-pv"');
      expect(html).toContain("Stromtarife");
    }
  });
});
