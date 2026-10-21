"use client";

import { PUBLIC_ROUTE_LIST } from "@/config/routes";
import { LEGAL_ROUTE_LIST } from "@/config/legal-routes";
import { canUseTracking, CONSENT_LIFETIME_DAYS, googleConsentSignals } from "./policy";
import { enqueueGoogleCommand, ensureGoogleConsentDefault, hasConsent } from "./client";

export const GA4_MEASUREMENT_ID = "G-5XEMD60ZRV";
const disableKey = `ga-disable-${GA4_MEASUREMENT_ID}` as const;
const publicPaths = new Set<string>([
  ...PUBLIC_ROUTE_LIST.map(({ href }) => href),
  ...LEGAL_ROUTE_LIST.map(({ href }) => href),
]);

type AnalyticsWindow = Window & {
  [disableKey]?: boolean;
  __ekAnalytics?: {
    script: HTMLScriptElement;
    loaded: boolean;
    initialized: boolean;
    lastNavigation: string | null;
  };
};

/** Only public paths; query strings, fragments, arbitrary paths and titles never enter GA4. */
export function analyticsPageLocation(pathname: string): string | null {
  if (
    !publicPaths.has(pathname) &&
    !/^\/(?:faq(?:\/[a-z][a-z0-9-]*){0,2}|referenzen\/[a-z][a-z0-9-]*|konfigurator\/(?:photovoltaik|stromspeicher|klimaanlage|waermepumpe|wallbox))$/.test(
      pathname,
    )
  )
    return null;
  return `https://www.energie-kraft.de${pathname}`;
}

export function clearAnalyticsCookies() {
  // Include legacy GA cookies, host-only cookies and both first-party domain scopes.
  const paths = new Set(["/", window.location.pathname]);
  const parts = window.location.pathname.split("/").filter(Boolean);
  for (let index = 1; index <= parts.length; index++) {
    paths.add(`/${parts.slice(0, index).join("/")}`);
    paths.add(`/${parts.slice(0, index).join("/")}/`);
  }
  for (const entry of document.cookie.split(";")) {
    const name = entry.trim().split("=")[0];
    if (!name || !/^(_ga(?:_|$)|_gid$|_gat(?:_|$)|__utm[a-z]+$)/.test(name)) continue;
    for (const path of paths) {
      for (const domain of ["", window.location.hostname, "energie-kraft.de"]) {
        document.cookie = `${name}=; Max-Age=0; Path=${path};${domain ? ` Domain=${domain};` : ""} SameSite=Lax; Secure`;
      }
    }
  }
}

/** Safe on Strict Mode cleanup and when leaving the public site layout. */
export function pauseAnalytics() {
  (window as AnalyticsWindow)[disableKey] = true;
}

export function syncAnalytics(pathname: string, navigation: string) {
  const target = window as AnalyticsWindow;
  const hostAllowed = canUseTracking(window.location.hostname, window.location.protocol);
  if (!hostAllowed || !hasConsent("analytics")) {
    pauseAnalytics();
    if (target.__ekAnalytics) target.__ekAnalytics.lastNavigation = null;
    if (hostAllowed) clearAnalyticsCookies();
    return;
  }
  const pageLocation = analyticsPageLocation(pathname);
  if (!pageLocation) {
    pauseAnalytics();
    if (target.__ekAnalytics) target.__ekAnalytics.lastNavigation = null;
    return;
  }
  target[disableKey] = false;

  if (!target.__ekAnalytics) {
    const script = document.createElement("script");
    script.id = "ek-ga4";
    script.async = true;
    script.referrerPolicy = "no-referrer";
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    target.__ekAnalytics = { script, loaded: false, initialized: false, lastNavigation: null };
    // Nothing that can measure is queued while the library is still loading.
    script.onload = () => {
      target.__ekAnalytics!.loaded = true;
      const search = new URLSearchParams(window.location.search).toString();
      syncAnalytics(
        window.location.pathname,
        window.location.pathname + (search ? `?${search}` : ""),
      );
    };
    script.onerror = () => {
      pauseAnalytics();
      script.remove();
      delete target.__ekAnalytics;
    };
    document.head.appendChild(script);
  }
  const state = target.__ekAnalytics;
  if (!state.loaded) return;
  const page = { page_location: pageLocation, page_referrer: "", page_title: "Energie-Kraft Süd" };
  if (!state.initialized) {
    // Defaults MUST precede config, even when consent was saved before hydration.
    ensureGoogleConsentDefault();
    enqueueGoogleCommand("consent", "update", googleConsentSignals(["analytics"]));
    enqueueGoogleCommand("js", new Date());
    enqueueGoogleCommand("config", GA4_MEASUREMENT_ID, {
      ...page,
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_domain: "www.energie-kraft.de",
      cookie_expires: CONSENT_LIFETIME_DAYS * 86_400,
      cookie_update: false,
      cookie_flags: "SameSite=Lax;Secure",
    });
    state.initialized = true;
  }
  if (state.lastNavigation === navigation) return;
  state.lastNavigation = navigation;
  enqueueGoogleCommand("set", page);
  enqueueGoogleCommand("event", "page_view", { ...page, send_to: GA4_MEASUREMENT_ID });
}
