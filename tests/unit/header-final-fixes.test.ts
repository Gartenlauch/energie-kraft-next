// @vitest-environment jsdom
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
afterEach(() => {
  document.body.innerHTML = "";
  document.body.style.overflow = "";
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Header route fallback", () => {
  it("preserves the public company name and phone without an environment mock", () => {
    const html = renderToStaticMarkup(createElement(SiteHeader));
    expect(html).toContain('aria-label="Energie-Kraft Süd – Startseite"');
    expect(html).toContain('href="tel:+498654771610"');
    expect(html).toContain("+49 (0) 8654 77161-0");
  });

  it.each([
    ["/", "/images/navigation/photovoltaic-mega-corrected.webp", "energy"],
    ["/photovoltaik", "/images/navigation/photovoltaic-mega-corrected.webp", "energy"],
    [
      "/service-und-wartung/finanzierung-und-foerderung",
      "/images/finanzierung/photovoltaik-desktop.webp",
      "service",
    ],
    ["/kunden-werben-kunden", "/images/home-premium/consultation-reference-desktop.webp", "service"],
    ["/gewerbespeicher", "/images/navigation/commercial-storage-mega.webp", "energy"],
  ])("uses the specific preview image for %s", (pathname, image, menu) => {
    harness.pathname = pathname;
    harness.menu = menu;
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
  it("includes the close toggle and the panel inside the same modal dialog", () => {
    harness.mobile = true;
    const html = renderToStaticMarkup(createElement(SiteHeader));
    const dialog = document.createElement("div");
    dialog.innerHTML = html;
    const modal = dialog.querySelector('[role="dialog"][aria-modal="true"]')!;
    expect(modal.tagName).toBe("DIV");
    expect(modal.parentElement!.tagName).toBe("HEADER");
    expect(modal.contains(dialog.querySelector('[aria-controls="mobile-navigation"]'))).toBe(true);
    expect(modal.contains(dialog.querySelector("#mobile-navigation"))).toBe(true);
  });

  it("closes on xl, transfers focus and releases lock/listeners on cleanup", () => {
    harness.mobile = true;
    SiteHeader();
    document.body.innerHTML = '<a id="skip" href="#main">Skip</a><header><div id="dialog"><nav><button id="desktop">Desktop</button></nav><a id="logo" href="/">Logo</a><button id="toggle">Close</button><div id="panel"><button id="first">Energy</button><a id="last" href="/kontakt">Contact</a></div></div></header><main id="main"><input /></main><aside></aside>';
    const dialog = document.querySelector<HTMLDivElement>("#dialog")!;
    const panel = document.querySelector<HTMLElement>("#panel")!;
    const first = document.querySelector<HTMLButtonElement>("#first")!;
    const last = document.querySelector<HTMLAnchorElement>("#last")!;
    const logo = document.querySelector<HTMLAnchorElement>("#logo")!;
    const toggle = document.querySelector<HTMLButtonElement>("#toggle")!;
    const main = document.querySelector("main")!;
    const aside = document.querySelector("aside")!;
    main.inert = false;
    aside.inert = true;
    for (const element of [logo, toggle, first, last]) {
      vi.spyOn(element, "getClientRects").mockReturnValue([{}] as unknown as DOMRectList);
    }
    const desktopFocus = vi.spyOn(document.querySelector<HTMLButtonElement>("#desktop")!, "focus");
    const panelFocus = vi.spyOn(first, "focus");
    harness.refs[0].current = toggle;
    harness.refs[1].current = panel;
    harness.refs[2].current = document.querySelector("nav");
    harness.refs[3].current = dialog;
    let onResize = () => {};
    const query = {
      matches: false,
      addEventListener: vi.fn((_type, listener) => {
        onResize = listener;
      }),
      removeEventListener: vi.fn(),
    };
    document.body.style.overflow = "auto";
    const removeKey = vi.spyOn(document, "removeEventListener");
    let onFrame = () => {};
    const matchMedia = vi.fn(() => query);
    vi.stubGlobal("matchMedia", matchMedia);
    vi.stubGlobal("requestAnimationFrame", (fn: () => void) => {
      onFrame = fn;
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    const cleanup = harness.effects[0]();
    expect(matchMedia).toHaveBeenCalledWith("(min-width: 80rem)");
    expect(document.body.style.overflow).toBe("hidden");
    expect(main.inert).toBe(true);
    onFrame();
    expect(panelFocus).toHaveBeenCalledOnce();
    logo.focus();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, cancelable: true }));
    expect(document.activeElement).toBe(last);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", cancelable: true }));
    expect(document.activeElement).toBe(logo);
    first.focus();
    onResize();
    expect(harness.setMobile).not.toHaveBeenCalled();
    query.matches = true;
    onResize();
    expect(harness.setMobile).toHaveBeenCalledWith(false);
    expect(desktopFocus).toHaveBeenCalledOnce();
    cleanup?.();
    expect(document.body.style.overflow).toBe("auto");
    expect(main.inert).toBe(false);
    expect(aside.inert).toBe(true);
    expect(removeKey).toHaveBeenCalledWith("keydown", expect.any(Function));
    expect(query.removeEventListener).toHaveBeenCalledWith("change", onResize);
    harness.mobile = false;
    harness.stateIndex = 0;
    harness.effects = [];
    SiteHeader();
    expect(harness.effects[0]()).toBeUndefined();
    expect(document.body.style.overflow).toBe("auto");
  });
});
