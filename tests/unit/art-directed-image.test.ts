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

  it.each([undefined, "high"] as const)(
    "adds mobile-only AVIF while preserving desktop, fallback and priority %s",
    (fetchPriority) => {
      const props = {
        desktopSrc: "/images/example-desktop.webp",
        mobileSrc: "/images/example-mobile.webp",
        desktopWidth: 1600,
        desktopHeight: 900,
        mobileWidth: 1200,
        mobileHeight: 1600,
        alt: "Beispielmotiv",
        sizes: "100vw",
        fetchPriority,
      };
      const original = renderToStaticMarkup(createElement(ArtDirectedImage, props));
      const optimized = renderToStaticMarkup(
        createElement(ArtDirectedImage, {
          ...props,
          mobileAvifSrcSet: "/images/mobile-840.avif 840w, /images/mobile-1200.avif 1200w",
          mobileSizes: "840px",
        }),
      );
      const sources = (html: string) => [...html.matchAll(/<source\b[^>]*>/gi)].map(([s]) => s);
      const before = sources(original);
      const after = sources(optimized);
      expect(after).toHaveLength(3);
      expect(after[0]).toBe(before[0]);
      expect(after[1]).toContain('media="(max-width: 767px)"');
      expect(after[1]).toContain('type="image/avif"');
      expect(after[1]).toContain('sizes="840px"');
      expect(after[2]).toBe(before[1]);
      expect(optimized.match(/<img\b[^>]*>/)?.[0]).toBe(original.match(/<img\b[^>]*>/)?.[0]);
      expect(optimized.match(/<link\b[^>]*>/g)).toEqual(original.match(/<link\b[^>]*>/g));
    },
  );
});
