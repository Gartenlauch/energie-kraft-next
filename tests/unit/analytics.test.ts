import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { JSDOM } from "jsdom";
import { act, createElement, StrictMode } from "react";
import type * as Analytics from "../../src/lib/consent/analytics";
import type * as ConsentClient from "../../src/lib/consent/client";
import {
  CONSENT_LIFETIME_MS,
  CONSENT_REVISION,
  CONSENT_STORAGE_KEY,
} from "../../src/lib/consent/policy";

let dom: JSDOM;
let analytics: typeof Analytics;
let client: typeof ConsentClient;

function consent(categories: string[] = ["necessary", "analytics"], revision = CONSENT_REVISION) {
  const now = Date.now();
  dom.window.localStorage.setItem(
    CONSENT_STORAGE_KEY,
    JSON.stringify({
      revision,
      categories,
      consentId: "qa",
      consentTimestamp: new Date(now).toISOString(),
      lastConsentTimestamp: new Date(now).toISOString(),
      expirationTime: now + CONSENT_LIFETIME_MS,
      services: {},
      data: null,
    }),
  );
}

function commands() {
  return ((dom.window as unknown as { dataLayer?: ArrayLike<unknown>[] }).dataLayer ?? []).map(
    (entry) => Array.from(entry),
  );
}
const events = () => commands().filter(([command]) => command === "event");
const scripts = () => dom.window.document.querySelectorAll("script[src*='googletagmanager']");
const disabled = () => Reflect.get(dom.window, `ga-disable-${analytics.GA4_MEASUREMENT_ID}`);
const sync = () =>
  analytics.syncAnalytics(
    dom.window.location.pathname,
    dom.window.location.pathname + dom.window.location.search,
  );
const loaded = () => scripts()[0].dispatchEvent(new dom.window.Event("load"));

beforeEach(async () => {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SITE_ENV", "production");
  dom = new JSDOM("<!doctype html><head></head><body></body>", {
    url: "https://www.energie-kraft.de/kontakt",
  });
  vi.stubGlobal("window", dom.window);
  vi.stubGlobal("document", dom.window.document);
  vi.stubGlobal("Event", dom.window.Event);
  analytics = await import("../../src/lib/consent/analytics");
  client = await import("../../src/lib/consent/client");
});

afterEach(() => {
  dom.window.close();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("GA4 basic consent boundary", () => {
  it.each([
    null,
    ["necessary"],
    ["necessary", "googleReviews"],
    ["necessary", "marketing", "personalization"],
  ])("loads nothing for %j", (categories) => {
    if (categories) consent(categories);
    sync();
    expect(scripts()).toHaveLength(0);
    expect(events()).toHaveLength(0);
    expect(disabled()).toBe(true);
    if (categories?.includes("googleReviews")) expect(client.hasGoogleReviewsConsent()).toBe(true);
  });

  it.each([
    "https://review.energie-kraft.de",
    "https://preview.hosted.app",
    "https://preview.web.app",
    "https://preview.firebaseapp.com",
    "http://localhost",
    "http://www.energie-kraft.de",
  ])("blocks %s even with consent", (url) => {
    dom.reconfigure({ url });
    consent();
    sync();
    expect(scripts()).toHaveLength(0);
    expect(events()).toHaveLength(0);
  });

  it.each(["local", "ci", "preview"])("blocks the %s environment", (env) => {
    vi.stubEnv("NEXT_PUBLIC_SITE_ENV", env);
    consent();
    sync();
    expect(scripts()).toHaveLength(0);
  });

  it("requires a fresh decision for revision 1", () => {
    consent(["necessary", "analytics", "googleReviews"], 1);
    sync();
    expect(client.readConsent()).toBeNull();
    expect(scripts()).toHaveLength(0);
  });

  it("initializes once, deduplicates effects, and counts A → B → A", () => {
    consent();
    sync();
    sync();
    expect(scripts()).toHaveLength(1);
    expect(events()).toHaveLength(0);
    loaded();
    sync();
    analytics.pauseAnalytics();
    sync();
    expect(events()).toHaveLength(1);
    for (const path of ["/photovoltaik", "/kontakt"]) {
      dom.reconfigure({ url: `https://www.energie-kraft.de${path}` });
      sync();
      sync();
    }
    expect(events()).toHaveLength(3);
    expect(commands().filter(([command]) => command === "config")).toHaveLength(1);
    const config = commands().find(([command]) => command === "config")![2];
    expect(config).toMatchObject({
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_update: false,
      cookie_expires: 180 * 86400,
    });
  });

  it("mounts under React Strict Mode without duplicate initialization or page_view", async () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    vi.doMock("next/navigation", () => ({
      usePathname: () => "/kontakt",
      useSearchParams: () => new URLSearchParams(),
    }));
    const { GoogleAnalytics } = await import("../../src/components/consent/google-analytics");
    const { createRoot } = await import("react-dom/client");
    const root = createRoot(dom.window.document.body);
    try {
      consent();
      await act(async () =>
        root.render(createElement(StrictMode, null, createElement(GoogleAnalytics))),
      );
      loaded();
      expect(scripts()).toHaveLength(1);
      expect(events()).toHaveLength(1);
      expect(commands().filter(([command]) => command === "config")).toHaveLength(1);
      await act(async () => root.unmount());
      expect(disabled()).toBe(true);
    } finally {
      vi.doUnmock("next/navigation");
    }
  });

  it("revokes before the Google update, clears cookies, and reuses one initialization", () => {
    consent();
    sync();
    loaded();
    dom.window.addEventListener(client.CONSENT_BEFORE_CHANGE_EVENT, analytics.pauseAnalytics);
    dom.window.addEventListener(client.CONSENT_CHANGE_EVENT, sync);
    dom.window.document.cookie = "_ga=host; Path=/; Secure";
    dom.window.document.cookie = "_ga_5XEMD60ZRV=parent; Domain=energie-kraft.de; Path=/; Secure";
    dom.window.document.cookie = "_gid=nested; Path=/kontakt; Secure";
    dom.window.document.cookie = "keep=1; Path=/; Secure";
    const layer = Reflect.get(dom.window, "dataLayer") as unknown[];
    const push = layer.push.bind(layer);
    layer.push = (...items) => {
      expect(disabled()).toBe(true);
      return push(...items);
    };
    consent(["necessary", "googleReviews"]);
    client.publishConsent("update");
    layer.push = push;
    expect(dom.window.document.cookie).toBe("keep=1");
    expect(client.hasGoogleReviewsConsent()).toBe(true);
    dom.reconfigure({ url: "https://www.energie-kraft.de/photovoltaik" });
    sync();
    expect(events()).toHaveLength(1);
    consent();
    client.publishConsent("update");
    sync();
    expect(events()).toHaveLength(2);
    expect(scripts()).toHaveLength(1);
    expect(commands().filter(([command]) => command === "config")).toHaveLength(1);
  });

  it("handles revocation, expiry and navigation while the tag is loading", () => {
    consent();
    sync();
    consent(["necessary"]);
    sync();
    loaded();
    expect(events()).toHaveLength(0);
    expect(commands().filter(([c]) => c === "config")).toHaveLength(0);
    dom.reconfigure({ url: "https://www.energie-kraft.de/photovoltaik" });
    consent();
    sync();
    expect(events()).toHaveLength(1);
    dom.window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    sync();
    expect(disabled()).toBe(true);
    expect(events()).toHaveLength(1);
  });

  it("never submits query, fragment, document title or referrer values", () => {
    dom.reconfigure({
      url: "https://www.energie-kraft.de/kontakt?email=private%40example.invalid&phone=0123456789#name",
    });
    dom.window.document.title = "private@example.invalid";
    consent();
    sync();
    loaded();
    sync();
    expect(events()).toHaveLength(1);
    expect(events()[0][2]).toMatchObject({
      page_location: "https://www.energie-kraft.de/kontakt",
      page_referrer: "",
      page_title: "Energie-Kraft Süd",
    });
    expect(JSON.stringify(commands())).not.toMatch(/private|0123456789|#name/);
  });

  it.each(["/admin", "/unknown/person@example.invalid", "/kontakt/0123456789"])(
    "does not load on non-public path %s",
    (path) => {
      consent();
      analytics.syncAnalytics(path, path);
      expect(scripts()).toHaveLength(0);
    },
  );
});
