"use client";

import {
  canUseTracking,
  CONSENT_STORAGE_KEY,
  googleConsentSignals,
  parseStoredConsent,
  type ConsentCategory,
} from "./policy";

export const CONSENT_CHANGE_EVENT = "ek:consent-change";

export function readConsent() {
  if (typeof window === "undefined") return null;
  try {
    return parseStoredConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    return null;
  }
}

/** Check at the point of use, including expiry and cross-tab revocation. */
export function hasConsent(category: ConsentCategory): boolean {
  return category === "necessary" || Boolean(readConsent()?.categories.includes(category));
}

/** Shared notification from the manager, including expiry and cross-tab changes. */
export function subscribeToConsentChanges(listener: () => void): () => void {
  window.addEventListener(CONSENT_CHANGE_EVENT, listener);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, listener);
}

export function hasGoogleReviewsConsent(): boolean {
  return hasConsent("googleReviews");
}

export function getEffectiveGoogleConsent() {
  return googleConsentSignals(
    typeof window !== "undefined" && canUseTracking(window.location.hostname)
      ? (readConsent()?.categories ?? [])
      : [],
  );
}

/** Local consent commands only. No script loader, config, event or network transport. */
export function publishConsent(command: "default" | "update") {
  const target = window as Window & { dataLayer?: unknown[] };
  target.dataLayer ??= [];
  // gtag-compatible native arguments object; no Google code is loaded.
  function enqueue(...args: unknown[]) {
    void args;
    // eslint-disable-next-line prefer-rest-params
    target.dataLayer!.push(arguments);
  }
  enqueue(
    "consent",
    command,
    command === "default" ? googleConsentSignals([]) : getEffectiveGoogleConsent(),
  );
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}
