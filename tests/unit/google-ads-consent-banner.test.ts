// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as CookieConsent from "vanilla-cookieconsent";

vi.mock("@/config/google-ads", () => ({ GOOGLE_ADS_ENABLED: true }));
import { ConsentManager } from "@/components/consent/consent-manager";
import { readConsent } from "@/lib/consent/client";
import { CONSENT_LIFETIME_MS, CONSENT_STORAGE_KEY } from "@/lib/consent/policy";

let root: Root;
let container: HTMLDivElement;
beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  localStorage.clear();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  CookieConsent.reset(true);
  vi.unstubAllGlobals();
});

describe("prepared Ads consent integration", () => {
  it("invalidates previous decisions and asks for explicit consent with revised copy", async () => {
    const now = Date.now();
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        revision: 2,
        categories: ["necessary", "marketing", "analytics"],
        consentId: "synthetic",
        consentTimestamp: new Date(now).toISOString(),
        lastConsentTimestamp: new Date(now).toISOString(),
        expirationTime: now + CONSENT_LIFETIME_MS,
        services: {},
        data: null,
      }),
    );
    await act(async () => root.render(createElement(ConsentManager)));
    expect(readConsent()).toBeNull();
    expect(CookieConsent.getConfig("revision")).toBe(3);
    expect(CookieConsent.getConfig("categories")?.marketing.enabled).toBe(false);
    act(() => CookieConsent.showPreferences());
    expect(document.querySelector("#cc-main")?.textContent).toContain(
      "Formularinhalte werden nicht übergeben",
    );
    expect(document.querySelector("#cc-main")?.textContent).toContain(
      "Personalisierte Werbung bleibt technisch deaktiviert",
    );
    expect(document.querySelector("#cc-main")?.textContent).toContain(
      "Personalisierte Werbung bieten wir derzeit nicht an. Die Auswahl dieser Kategorie aktiviert keine personalisierte Werbung.",
    );
    expect(document.querySelector("#cc-main")?.textContent).toContain(
      "Ohne Ihre Statistik-Einwilligung wird Google Analytics 4 nicht aktiviert und unsere Einbindung sendet keine Analytics-Ereignisse. Eine gesonderte Marketing-Einwilligung kann Google Ads aktivieren.",
    );
    expect(document.querySelector("#cc-main")?.textContent).not.toMatch(
      /keine Analytics-Skripte|Wird nur gemeinsam mit der Freigabe/,
    );
    act(() => CookieConsent.acceptCategory(["necessary", "marketing"]));
    expect(readConsent()?.categories).toEqual(["necessary", "marketing"]);
    expect(document.querySelector("script[src*='googletagmanager']")).toBeNull();
  });

  it("stores rejection without enabling any optional category", async () => {
    await act(async () => root.render(createElement(ConsentManager)));
    act(() => CookieConsent.acceptCategory("necessary"));
    expect(readConsent()?.categories).toEqual(["necessary"]);
    expect(document.querySelector("script[src*='googletagmanager']")).toBeNull();
  });
});
