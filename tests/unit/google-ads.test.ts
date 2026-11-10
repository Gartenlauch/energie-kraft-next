import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { JSDOM } from "jsdom";
import { act, createElement, StrictMode } from "react";
import type * as GoogleAds from "@/lib/consent/google-ads";
import type * as ConsentClient from "@/lib/consent/client";
import type * as Policy from "@/lib/consent/policy";
import type * as AdsConfig from "@/config/google-ads";
import type { ContactLeadInput } from "@/types/contact-lead";
import type { SubmitConfiguratorLeadInput } from "@/types/configurator";

// Synthetic acknowledgements and tag load events only; no Firebase/Google/mail requests.
const SEND_TO = {
  contact: "AW-10796681126/pEGMCKf9zrUdEKaPoZwo",
  heatPump: "AW-10796681126/qTv_CKr9zrUdEKaPoZwo",
};
const leadId = "aBcdEfGhIjKlMnOpQrSt";
const anotherLeadId = "uVwXyZaBcDeFgHiJkLmN";
let dom: JSDOM;
let ads: typeof GoogleAds;
let client: typeof ConsentClient;
let policy: typeof Policy;
const contactCallable = vi.fn();
const configuratorCallable = vi.fn();

function setConsent(categories = ["necessary", "marketing"], revision = policy.CONSENT_REVISION) {
  const now = Date.now();
  dom.window.localStorage.setItem(
    policy.CONSENT_STORAGE_KEY,
    JSON.stringify({
      revision,
      categories,
      consentId: "synthetic-consent",
      consentTimestamp: new Date(now).toISOString(),
      lastConsentTimestamp: new Date(now).toISOString(),
      expirationTime: now + policy.CONSENT_LIFETIME_MS,
      services: {},
      data: null,
    }),
  );
}
function commands() {
  return ((Reflect.get(dom.window, "dataLayer") ?? []) as ArrayLike<unknown>[]).map((entry) =>
    Array.from(entry),
  );
}
const conversions = () =>
  commands().filter(([command, event]) => command === "event" && event === "conversion");
const scripts = () => dom.window.document.querySelectorAll("script[src*='googletagmanager']");
const loaded = () => scripts()[0].dispatchEvent(new dom.window.Event("load"));
const acknowledge = (id = leadId, kind: "contact" | "heatPump" = "contact") =>
  ads.trackGoogleAdsLead({ ok: true, leadId: id }, kind);

beforeEach(async () => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.stubEnv("NEXT_PUBLIC_SITE_ENV", "production");
  vi.doMock("@/config/google-ads", () => ({
    GOOGLE_ADS_ENABLED: true,
    GOOGLE_ADS_ID: "AW-10796681126",
    GOOGLE_ADS_SEND_TO: SEND_TO,
  }));
  vi.doMock("client-only", () => ({}));
  vi.doMock("@/lib/firebase/client", () => ({ firebaseFunctions: {} }));
  vi.doMock("firebase/functions", () => ({
    httpsCallable: (_functions: unknown, name: string) =>
      name === "submitContactLead" ? contactCallable : configuratorCallable,
  }));
  dom = new JSDOM("<!doctype html><head></head><body></body>", {
    url: "https://www.energie-kraft.de/kontakt",
  });
  vi.stubGlobal("window", dom.window);
  vi.stubGlobal("document", dom.window.document);
  vi.stubGlobal("Event", dom.window.Event);
  ads = await import("@/lib/consent/google-ads");
  client = await import("@/lib/consent/client");
  policy = await import("@/lib/consent/policy");
  contactCallable.mockResolvedValue({ data: { ok: true, leadId, mailStatus: "failed" } });
  configuratorCallable.mockResolvedValue({
    data: { ok: true, leadId, publicReference: "TEST-ONLY" },
  });
});

afterEach(() => {
  dom.window.close();
  vi.doUnmock("@/config/google-ads");
  vi.doUnmock("client-only");
  vi.doUnmock("@/lib/firebase/client");
  vi.doUnmock("firebase/functions");
  vi.doUnmock("next/navigation");
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("Google Ads Basic Consent Mode", () => {
  it("matches the two original event snippets supplied for this implementation", async () => {
    const config = await vi.importActual<typeof AdsConfig>("@/config/google-ads");
    expect(config.GOOGLE_ADS_ID).toBe("AW-10796681126");
    expect(config.GOOGLE_ADS_SEND_TO).toEqual(SEND_TO);
  });

  it("loads and sends nothing when the release switch is disabled", async () => {
    vi.doMock("@/config/google-ads", () => ({
      GOOGLE_ADS_ENABLED: false,
      GOOGLE_ADS_ID: "AW-10796681126",
      GOOGLE_ADS_SEND_TO: SEND_TO,
    }));
    vi.resetModules();
    policy = await import("@/lib/consent/policy");
    const disabledAds = await import("@/lib/consent/google-ads");
    setConsent();
    disabledAds.syncGoogleAds();
    disabledAds.trackGoogleAdsLead({ ok: true, leadId }, "contact");
    expect(scripts()).toHaveLength(0);
    expect(conversions()).toHaveLength(0);
  });

  it.each([
    null,
    ["necessary"],
    ["necessary", "analytics"],
    ["necessary", "googleReviews"],
    ["necessary", "personalization"],
  ])("requires independent marketing consent (%j)", (categories) => {
    if (categories) setConsent(categories);
    ads.syncGoogleAds();
    acknowledge();
    expect(scripts()).toHaveLength(0);
    expect(commands()).toHaveLength(0);
    expect(dom.window.sessionStorage.length).toBe(0);
  });

  it("requires a new decision when Ads becomes available", () => {
    setConsent(["necessary", "marketing", "analytics"], 2);
    acknowledge();
    expect(policy.CONSENT_REVISION).toBe(3);
    expect(client.readConsent()).toBeNull();
    expect(scripts()).toHaveLength(0);
  });

  it("maps all four signals without enabling personalization", () => {
    expect(policy.googleConsentSignals(["marketing", "personalization"])).toEqual({
      ad_storage: "granted",
      ad_user_data: "granted",
      analytics_storage: "denied",
      ad_personalization: "denied",
    });
  });

  it.each([
    "https://review.energie-kraft.de/kontakt",
    "https://preview.web.app/kontakt",
    "https://preview.firebaseapp.com/kontakt",
    "https://preview.hosted.app/kontakt",
    "http://localhost/kontakt",
    "http://www.energie-kraft.de/kontakt",
    "https://www.energie-kraft.de/admin",
    "https://www.energie-kraft.de/unknown/private",
  ])("blocks tracking on %s", (url) => {
    dom.reconfigure({ url });
    setConsent();
    acknowledge();
    expect(scripts()).toHaveLength(0);
    expect(conversions()).toHaveLength(0);
  });

  it.each(["local", "ci", "preview", ""])("blocks environment %s", (env) => {
    vi.stubEnv("NEXT_PUBLIC_SITE_ENV", env);
    setConsent();
    acknowledge();
    expect(scripts()).toHaveLength(0);
  });

  it("initializes the Ads destination without converting on a page visit", () => {
    setConsent();
    ads.syncGoogleAds();
    expect(commands()).toEqual([["consent", "default", policy.googleConsentSignals([])]]);
    loaded();
    expect(conversions()).toHaveLength(0);
    expect(commands().find(([cmd]) => cmd === "config")?.[2]).toMatchObject({
      send_page_view: false,
      allow_enhanced_conversions: false,
      allow_ad_personalization_signals: false,
    });
    expect(
      commands()
        .slice(0, 3)
        .map((entry) => entry.slice(0, 2)),
    ).toEqual([
      ["consent", "default"],
      ["consent", "update"],
      ["js", expect.any(Date)],
    ]);
  });

  it("deduplicates consent updates from the manager and delayed tag initialization", () => {
    setConsent();
    client.publishConsent("default");
    client.publishConsent("update");
    ads.syncGoogleAds();
    for (let index = 0; index < 72; index++) client.publishConsent("update");
    loaded();
    expect(
      commands().filter(([cmd, type]) => cmd === "consent" && type === "default"),
    ).toHaveLength(1);
    expect(commands().filter(([cmd, type]) => cmd === "consent" && type === "update")).toHaveLength(
      1,
    );
    expect(commands().find(([cmd]) => cmd === "config")?.[1]).toBe("AW-10796681126");
  });

  it("notifies local consumers when reviews change without repeating Google's state", () => {
    setConsent();
    client.publishConsent("update");
    const changed = vi.fn();
    const unsubscribe = client.subscribeToConsentChanges(changed);
    setConsent(["necessary", "marketing", "googleReviews"]);
    client.publishConsent("update");
    expect(changed).toHaveBeenCalledOnce();
    expect(client.hasGoogleReviewsConsent()).toBe(true);
    expect(commands().filter(([cmd, type]) => cmd === "consent" && type === "update")).toHaveLength(
      1,
    );
    unsubscribe();
  });

  it("publishes actual changes and expiry while keeping repeated refreshes silent", () => {
    setConsent();
    client.publishConsent("update");
    setConsent(["necessary", "analytics", "marketing"]);
    client.publishConsent("update");
    client.publishConsent("update");
    const expired = JSON.parse(dom.window.localStorage.getItem(policy.CONSENT_STORAGE_KEY)!);
    expired.expirationTime = Date.now() - 1;
    dom.window.localStorage.setItem(policy.CONSENT_STORAGE_KEY, JSON.stringify(expired));
    client.publishConsent("update");
    const updates = commands().filter(([cmd, type]) => cmd === "consent" && type === "update");
    expect(updates).toHaveLength(3);
    expect(updates.map((entry) => entry[2])).toEqual([
      policy.googleConsentSignals(["marketing"]),
      policy.googleConsentSignals(["analytics", "marketing"]),
      policy.googleConsentSignals([]),
    ]);
    expect(commands()[0].slice(0, 2)).toEqual(["consent", "default"]);
  });

  it("does not remember a revoked state when a consumer cancels publishing for reload", () => {
    setConsent();
    client.publishConsent("update");
    const cancel = (event: Event) => event.preventDefault();
    dom.window.addEventListener(client.CONSENT_BEFORE_CHANGE_EVENT, cancel);
    setConsent(["necessary"]);
    client.publishConsent("update");
    dom.window.removeEventListener(client.CONSENT_BEFORE_CHANGE_EVENT, cancel);
    client.publishConsent("update");
    const updates = commands().filter(([cmd, type]) => cmd === "consent" && type === "update");
    expect(updates).toHaveLength(2);
    expect(updates[1][2]).toEqual(policy.googleConsentSignals([]));
  });

  it.each(["contact", "heatPump"] as const)("sends %s once after the tag loads", (kind) => {
    setConsent();
    acknowledge(leadId, kind);
    acknowledge(leadId, kind);
    expect(conversions()).toHaveLength(0);
    loaded();
    acknowledge(leadId, kind);
    // Even a different label cannot count the same backend operation twice.
    acknowledge(leadId, kind === "contact" ? "heatPump" : "contact");
    expect(conversions()).toHaveLength(1);
    expect(conversions()[0][2]).toMatchObject({ send_to: SEND_TO[kind], transaction_id: leadId });
    acknowledge(anotherLeadId, kind);
    expect(conversions()).toHaveLength(2);
  });

  it("remembers sent IDs across a reload in the same tab", () => {
    setConsent();
    acknowledge();
    loaded();
    const stored = dom.window.sessionStorage.getItem("ek_ads_conversions");
    const consent = dom.window.localStorage.getItem(policy.CONSENT_STORAGE_KEY)!;
    dom.window.close();
    dom = new JSDOM("<!doctype html><head></head><body></body>", {
      url: "https://www.energie-kraft.de/kontakt",
    });
    vi.stubGlobal("window", dom.window);
    vi.stubGlobal("document", dom.window.document);
    vi.stubGlobal("Event", dom.window.Event);
    dom.window.sessionStorage.setItem("ek_ads_conversions", stored!);
    dom.window.localStorage.setItem(policy.CONSENT_STORAGE_KEY, consent);
    acknowledge();
    expect(scripts()).toHaveLength(0);
    expect(conversions()).toHaveLength(0);
  });

  it.each([false, undefined, "true"])("rejects acknowledgements with ok=%s", (ok) => {
    setConsent();
    ads.trackGoogleAdsLead({ ok, leadId }, "contact");
    expect(scripts()).toHaveLength(0);
  });

  it.each(["", "private@example.invalid", "Test Person", undefined])(
    "rejects non-backend IDs (%s)",
    (id) => {
      setConsent();
      ads.trackGoogleAdsLead({ ok: true, leadId: id }, "contact");
      expect(scripts()).toHaveLength(0);
    },
  );

  it("shares one script and one js command with GA4 in either loading order", async () => {
    setConsent(["necessary", "analytics", "marketing"]);
    const analytics = await import("@/lib/consent/analytics");
    acknowledge();
    analytics.syncAnalytics("/kontakt", "/kontakt");
    loaded();
    ads.syncGoogleAds();
    analytics.syncAnalytics("/kontakt", "/kontakt");
    expect(scripts()).toHaveLength(1);
    expect(commands().filter(([cmd]) => cmd === "js")).toHaveLength(1);
    expect(commands().filter(([cmd]) => cmd === "config")).toHaveLength(2);
    expect(conversions()).toHaveLength(1);
    expect(
      commands().filter(([cmd, event]) => cmd === "event" && event === "page_view"),
    ).toHaveLength(1);
    expect(
      commands().find(([cmd, type]) => cmd === "consent" && type === "update")?.[2],
    ).toMatchObject({
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
    });
  });

  it("adds Ads to an already initialized analytics tag without another script", async () => {
    setConsent(["necessary", "analytics"]);
    const analytics = await import("@/lib/consent/analytics");
    analytics.syncAnalytics("/kontakt", "/kontakt");
    loaded();
    setConsent(["necessary", "analytics", "marketing"]);
    client.publishConsent("update");
    acknowledge();
    expect(scripts()).toHaveLength(1);
    expect(conversions()).toHaveLength(1);
    expect(commands().filter(([cmd]) => cmd === "js")).toHaveLength(1);
  });

  it("drops an event revoked while loading and never replays it after later consent", () => {
    setConsent();
    dom.window.addEventListener(client.CONSENT_BEFORE_CHANGE_EVENT, ads.pauseGoogleAds);
    dom.window.addEventListener(client.CONSENT_CHANGE_EVENT, ads.syncGoogleAds);
    acknowledge();
    setConsent(["necessary"]);
    client.publishConsent("update");
    loaded();
    setConsent();
    client.publishConsent("update");
    expect(conversions()).toHaveLength(0);
  });

  it("blocks an expired or cross-tab-removed decision at load time", () => {
    setConsent();
    acknowledge();
    dom.window.localStorage.clear();
    loaded();
    expect(conversions()).toHaveLength(0);
    expect(commands().filter(([cmd]) => cmd === "config")).toHaveLength(0);
  });

  it("requests a reload before a denied update can reach a configured Ads tag", () => {
    setConsent();
    acknowledge();
    loaded();
    dom.window.document.cookie = "_gcl_aw=synthetic; Path=/; Secure";
    dom.window.document.cookie = "_gcl_au=synthetic; Domain=energie-kraft.de; Path=/; Secure";
    dom.window.document.cookie = "keep=1; Path=/; Secure";
    setConsent(["necessary", "analytics"]);
    // jsdom intentionally cannot navigate; replace the location with a reload spy.
    const reload = vi.fn();
    vi.stubGlobal("window", {
      location: {
        hostname: "www.energie-kraft.de",
        protocol: "https:",
        pathname: "/kontakt",
        reload,
      },
      localStorage: dom.window.localStorage,
      __ekGoogleAds: Reflect.get(dom.window, "__ekGoogleAds"),
    });
    const event = new dom.window.Event(client.CONSENT_BEFORE_CHANGE_EVENT, { cancelable: true });
    ads.pauseGoogleAds(event);
    expect(event.defaultPrevented).toBe(true);
    expect(reload).toHaveBeenCalledOnce();
    expect(dom.window.document.cookie).toBe("keep=1");
  });

  it("cancels publishing when a consumer requests reload", () => {
    const changed = vi.fn();
    dom.window.addEventListener(client.CONSENT_BEFORE_CHANGE_EVENT, (event) =>
      event.preventDefault(),
    );
    dom.window.addEventListener(client.CONSENT_CHANGE_EVENT, changed);
    client.publishConsent("update");
    expect(commands()).toHaveLength(0);
    expect(changed).not.toHaveBeenCalled();
  });

  it("drops events after a script error and permits a later new submission", () => {
    setConsent();
    acknowledge();
    scripts()[0].dispatchEvent(new dom.window.Event("error"));
    expect(scripts()).toHaveLength(0);
    acknowledge(anotherLeadId);
    loaded();
    expect(conversions()).toHaveLength(1);
    expect(conversions()[0][2]).toMatchObject({ transaction_id: anotherLeadId });
  });

  it("keeps tracking optional when session storage is unavailable", () => {
    setConsent();
    vi.spyOn(dom.window.Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => acknowledge()).not.toThrow();
    loaded();
    acknowledge();
    expect(conversions()).toHaveLength(1);
  });

  it("never submits query strings, fragments, referrers, titles or form data", () => {
    dom.reconfigure({
      url: "https://www.energie-kraft.de/kontakt?email=private%40example.invalid#0123456789",
    });
    dom.window.document.title = "Private Person";
    setConsent();
    acknowledge();
    loaded();
    expect(JSON.stringify(commands())).not.toMatch(/private|0123456789|Private Person/);
    expect(conversions()[0][2]).toEqual({
      page_location: "https://www.energie-kraft.de/kontakt",
      page_referrer: "",
      page_title: "Energie-Kraft Süd",
      transaction_id: leadId,
      send_to: SEND_TO.contact,
    });
  });

  it("mounts the Ads component under Strict Mode without duplicate initialization", async () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    vi.doMock("next/navigation", () => ({ usePathname: () => "/kontakt" }));
    const { GoogleAds } = await import("@/components/consent/google-ads");
    const { createRoot } = await import("react-dom/client");
    const root = createRoot(dom.window.document.body);
    setConsent();
    await act(async () => root.render(createElement(StrictMode, null, createElement(GoogleAds))));
    loaded();
    expect(scripts()).toHaveLength(1);
    expect(commands().filter(([cmd]) => cmd === "config")).toHaveLength(1);
    expect(conversions()).toHaveLength(0);
    await act(async () => root.unmount());
  });
});

describe("backend-confirmed lead conversions", () => {
  // Backend is mocked here: payload validation/business calculations stay in their existing tests.
  const contact = { email: "private@example.invalid" } as ContactLeadInput;
  const configurator = (types: string[]) =>
    ({
      configurators: types.map((type) => ({ type })),
    }) as SubmitConfiguratorLeadInput;

  it("waits for contact success, counts stored leads even if mail failed, and ignores retries", async () => {
    setConsent();
    const { submitContactLead } = await import("@/lib/leads/submit-contact-lead");
    let resolve!: (result: unknown) => void;
    contactCallable.mockReturnValueOnce(
      new Promise((done) => {
        resolve = done;
      }),
    );
    const submission = submitContactLead(contact);
    expect(scripts()).toHaveLength(0);
    resolve({ data: { ok: true, leadId, mailStatus: "failed" } });
    await expect(submission).resolves.toMatchObject({ ok: true, mailStatus: "failed" });
    loaded();
    await submitContactLead(contact);
    expect(conversions()).toHaveLength(1);
    expect(conversions()[0][2]).toMatchObject({ send_to: SEND_TO.contact });
    expect(contactCallable).toHaveBeenCalledWith(contact);
    expect(JSON.stringify(commands())).not.toContain(contact.email);
  });

  it.each(["contact", "configurator"])("does not convert a failed %s submission", async (kind) => {
    setConsent();
    const callable = kind === "contact" ? contactCallable : configuratorCallable;
    callable.mockRejectedValueOnce(new Error("synthetic backend failure"));
    const submission =
      kind === "contact"
        ? (await import("@/lib/leads/submit-contact-lead")).submitContactLead(contact)
        : (await import("@/lib/leads/submit-configurator-lead")).submitConfiguratorLead(
            configurator(["heat_pump"]),
          );
    await expect(submission).rejects.toThrow("synthetic backend failure");
    expect(scripts()).toHaveLength(0);
    expect(conversions()).toHaveLength(0);
  });

  it.each([
    ["photovoltaic"],
    ["battery_storage"],
    ["climate"],
    ["wallbox"],
    ["heat_pump"],
    ["photovoltaic", "battery_storage", "heat_pump", "wallbox"],
  ])("routes a completed %j project to exactly one conversion", async (...types) => {
    setConsent();
    const { submitConfiguratorLead } = await import("@/lib/leads/submit-configurator-lead");
    const input = configurator(types);
    await submitConfiguratorLead(input);
    loaded();
    await submitConfiguratorLead(input);
    expect(configuratorCallable).toHaveBeenCalledWith(input);
    expect(conversions()).toHaveLength(1);
    expect(conversions()[0][2]).toMatchObject({
      send_to: types.includes("heat_pump") ? SEND_TO.heatPump : SEND_TO.contact,
      transaction_id: leadId,
    });
  });

  it("preserves successful submissions after rejection and does not replay them on consent", async () => {
    setConsent(["necessary"]);
    const { submitContactLead } = await import("@/lib/leads/submit-contact-lead");
    await expect(submitContactLead(contact)).resolves.toMatchObject({ ok: true });
    setConsent();
    ads.syncGoogleAds();
    loaded();
    expect(conversions()).toHaveLength(0);
  });
});
