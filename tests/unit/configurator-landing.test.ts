import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ConfiguratorHouseNavigation } from "@/components/configurator/configurator-house-navigation";

import { PUBLIC_ROUTES } from "@/config/routes";
import {
  configuratorProductList,
  configuratorProducts,
} from "@/content/configurators";

describe("configurator landing page", () => {
  it("retains all five numbered, accessible hotspot links with separate mobile positions", () => {
    const html = renderToStaticMarkup(createElement(ConfiguratorHouseNavigation, { products: configuratorProductList }));
    const hotspots = html.split('aria-label="Energiekomponenten am Haus"')[1].split("</nav>")[0];
    expect(hotspots.match(/<a /g)).toHaveLength(5);
    configuratorProductList.forEach((product, index) => {
      expect(hotspots).toContain(`href="${product.href}"`);
      expect(hotspots).toContain(`aria-label="${product.title}:`);
      expect(hotspots).toContain(`aria-hidden="true">${index + 1}</span>`);
    });
    expect(hotspots.match(/--hotspot-mobile-x:/g)).toHaveLength(5);
    const positions = Array.from(hotspots.matchAll(/style="([^"]+)"/g), (match) => match[1]);
    expect(positions).toEqual([
      "--hotspot-x:78%;--hotspot-y:44%;--hotspot-mobile-x:65%;--hotspot-mobile-y:44%",
      "--hotspot-x:61%;--hotspot-y:75%;--hotspot-mobile-x:44%;--hotspot-mobile-y:69%",
      "--hotspot-x:71%;--hotspot-y:57%;--hotspot-mobile-x:86%;--hotspot-mobile-y:60%",
      "--hotspot-x:40%;--hotspot-y:79%;--hotspot-mobile-x:30%;--hotspot-mobile-y:85%",
      "--hotspot-x:82%;--hotspot-y:67%;--hotspot-mobile-x:60%;--hotspot-mobile-y:70%",
    ]);
    expect(html).toContain("configurator-energy-home-desktop.webp");
    expect(html).toContain("configurator-energy-home-mobile.webp");
  });

  it("defines all five configurator products", () => {
    expect(configuratorProductList).toHaveLength(5);
  });

  it("uses unique configurator URLs", () => {
    const urls = configuratorProductList.map(
      (product) => product.href,
    );

    expect(new Set(urls).size).toBe(urls.length);
  });

  it("keeps every configurator below /konfigurator", () => {
    for (const product of configuratorProductList) {
      expect(product.href.startsWith("/konfigurator/")).toBe(true);
    }
  });

  it("defines photovoltaic as the reference implementation", () => {
    expect(
      configuratorProducts.photovoltaic.availability,
    ).toBe("next");

    expect(
      configuratorProducts.photovoltaic.href,
    ).toBe("/konfigurator/photovoltaik");
  });

  it("registers the landing page as a public route", () => {
    expect(PUBLIC_ROUTES.konfigurator.href).toBe(
      "/konfigurator",
    );

    expect(
      PUBLIC_ROUTES.konfigurator.navigation.header,
    ).toBe(false);

    expect(
      PUBLIC_ROUTES.konfigurator.navigation.footer,
    ).toBe(false);
  });
});
