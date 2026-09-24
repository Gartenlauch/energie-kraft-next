import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ArtDirectedImage } from "@/components/media/art-directed-image";

describe("ArtDirectedImage", () => {
  it("renders explicit non-empty desktop and mobile source sets", () => {
    const html = renderToStaticMarkup(
      createElement(ArtDirectedImage, {
        desktopSrc: "/images/example-desktop.webp",
        mobileSrc: "/images/example-mobile.webp",
        desktopWidth: 1600,
        desktopHeight: 900,
        mobileWidth: 720,
        mobileHeight: 960,
        alt: "Beispielmotiv",
        sizes: "100vw",
      }),
    );
    const sources = [...html.matchAll(/<source\b[^>]*>/gi)].map(([source]) => source);

    expect(sources).toHaveLength(2);
    expect(sources[0]).toMatch(/media="\(min-width: 768px\)"/);
    expect(sources[0]).toMatch(/srcSet="\/images\/example-desktop\.webp"/i);
    expect(sources[1]).toMatch(/media="\(max-width: 767px\)"/);
    expect(sources[1]).toMatch(/srcSet="\/images\/example-mobile\.webp"/i);
    expect(sources.every((source) => !/srcSet=""/i.test(source))).toBe(true);
  });
});
