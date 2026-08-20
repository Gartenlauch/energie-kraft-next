import { describe, expect, it } from "vitest";

import { PUBLIC_ROUTES } from "@/config/routes";
import {
  configuratorProductList,
  configuratorProducts,
} from "@/content/configurators";

describe("configurator landing page", () => {
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