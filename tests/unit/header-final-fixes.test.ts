import { createElement } from "react";
import { existsSync } from "node:fs";
import type * as ReactModule from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const harness = vi.hoisted(() => ({
  pathname: "/",
  menu: "service",
  mobile: false,
  stateIndex: 0,
  effects: [] as Array<() => (() => void) | undefined>,
  refs: [] as Array<{ current: unknown }>,
  setMobile: vi.fn(),
}));
vi.mock("@/config/env/public", () => ({
  publicEnv: { NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de" },
}));
vi.mock("next/navigation", () => ({ usePathname: () => harness.pathname }));
vi.mock("react", async (importOriginal) => ({
  ...(await importOriginal<typeof ReactModule>()),
  useState: (initial: unknown) => {
    const index = harness.stateIndex++;
    return [
      index === 0 ? harness.menu : index === 1 ? harness.mobile : initial,
      index === 1 ? harness.setMobile : vi.fn(),
    ];
  },
  useRef: () => {
    const ref = { current: null };
    harness.refs.push(ref);
    return ref;
  },
  useEffect: (effect: () => (() => void) | undefined) => {
    harness.effects.push(effect);
  },
}));

import { SiteHeader } from "@/components/layout/site-header";

beforeEach(() => {
  harness.stateIndex = 0;
  harness.effects = [];
  harness.refs = [];
  harness.mobile = false;
  harness.setMobile.mockClear();
});
afterEach(() => vi.unstubAllGlobals());

describe("Header route fallback", () => {
  it.each([
    [
      "/service-und-wartung/finanzierung-und-foerderung",
      "/images/finanzierung/photovoltaik-desktop.webp",
    ],
    ["/kunden-werben-kunden", "/images/home-premium/consultation-reference-desktop.webp"],
  ])("keeps the distinct existing preview image for %s", (pathname, image) => {
    harness.pathname = pathname;
    harness.menu = "service";
    const html = renderToStaticMarkup(createElement(SiteHeader));
    const activeImage = html.match(
      /class="mega-preview-scene" data-active="true">[\s\S]*?<img\b[^>]*>/,
    )?.[0];
    expect(activeImage).toBeDefined();
    const src = activeImage!.match(/\bsrc="([^"]+)"/)?.[1];
    expect(src).toBeDefined();
    expect(decodeURIComponent(src!)).toContain(image);
    expect(existsSync(`public${image}`)).toBe(true);
  });

  it.each([
    ["/service-und-wartung", "Service &amp; Wartung", "service"],
    ["/service-und-wartung/service-und-team", "Service &amp; Wartung", "service"],
    ["/service-und-wartung/finanzierung-und-foerderung", "Finanzierung &amp; Förderung", "service"],
    ["/kunden-werben-kunden", "Kunden werben Kunden", "service"],
    ["/photovoltaik", "Photovoltaik", "energy"],
    ["/stromspeicher", "Stromspeicher", "energy"],
    ["/photovoltaik-fuer-unternehmen", "Photovoltaik für Unternehmen", "energy"],
    ["/gewerbespeicher", "Gewerbespeicher", "energy"],
    ["/waermepumpen", "Wärmepumpe", "energy"],
    ["/klimaanlagen", "Klimaanlage", "energy"],
    ["/wallbox", "Wallbox", "energy"],
    ["/stromtarife-pv", "Stromtarife", "energy"],
    ["/unbekannt", "Verlässlich an Ihrer Seite", "service"],
  ])("selects the specific preview for %s", (pathname, title, menu) => {
    harness.pathname = pathname;
    harness.menu = menu;
    const html = renderToStaticMarkup(createElement(SiteHeader));
    const active = html.match(
      /class="mega-preview-scene" data-active="true">[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/,
    )?.[1];
    expect(active).toBe(title);
  });
});

describe("Mobile menu desktop transition (mocked DOM lifecycle)", () => {
  it("closes on xl, transfers focus and releases lock/listeners on cleanup", () => {
    harness.mobile = true;
    SiteHeader();
    const desktopFocus = vi.fn();
    const panelFocus = vi.fn();
    const activeElement = {};
    harness.refs[0].current = { focus: vi.fn() };
    harness.refs[1].current = {
      contains: (element: unknown) => element === activeElement,
      querySelector: () => ({ focus: panelFocus }),
    };
    harness.refs[2].current = { querySelector: () => ({ focus: desktopFocus }) };
    let onResize = () => {};
    const query = {
      matches: false,
      addEventListener: vi.fn((_type, listener) => {
        onResize = listener;
      }),
      removeEventListener: vi.fn(),
    };
    const body = { style: { overflow: "auto" } };
    const removeKey = vi.fn();
    let onFrame = () => {};
    vi.stubGlobal("document", {
      body,
      activeElement,
      addEventListener: vi.fn(),
      removeEventListener: removeKey,
    });
    const matchMedia = vi.fn(() => query);
    vi.stubGlobal("window", {
      matchMedia,
      requestAnimationFrame: (fn: () => void) => {
        onFrame = fn;
        return 1;
      },
      cancelAnimationFrame: vi.fn(),
    });
    const cleanup = harness.effects[0]();
    expect(matchMedia).toHaveBeenCalledWith("(min-width: 80rem)");
    expect(body.style.overflow).toBe("hidden");
    onFrame();
    expect(panelFocus).toHaveBeenCalledOnce();
    onResize();
    expect(harness.setMobile).not.toHaveBeenCalled();
    query.matches = true;
    onResize();
    expect(harness.setMobile).toHaveBeenCalledWith(false);
    expect(desktopFocus).toHaveBeenCalledOnce();
    cleanup?.();
    expect(body.style.overflow).toBe("auto");
    expect(removeKey).toHaveBeenCalledWith("keydown", expect.any(Function));
    expect(query.removeEventListener).toHaveBeenCalledWith("change", onResize);
    harness.mobile = false;
    harness.stateIndex = 0;
    harness.effects = [];
    SiteHeader();
    expect(harness.effects[0]()).toBeUndefined();
    expect(body.style.overflow).toBe("auto");
  });
});
