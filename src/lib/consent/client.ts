"use client";

import {
  canUseTracking,
  CONSENT_STORAGE_KEY,
  googleConsentSignals,
  parseStoredConsent,
  type ConsentCategory,
} from "./policy";

export const CONSENT_CHANGE_EVENT = "ek:consent-change";
export const CONSENT_BEFORE_CHANGE_EVENT = "ek:consent-before-change";

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
    typeof window !== "undefined" &&
      canUseTracking(window.location.hostname, window.location.protocol)
      ? (readConsent()?.categories ?? [])
      : [],
  );
}

/** The one gtag-compatible queue, shared by the consent manager and the GA4 adapter. */
export function enqueueGoogleCommand(...args: unknown[]) {
  const target = window as Window & { dataLayer?: unknown[] };
  target.dataLayer ??= [];
  void args;
  // eslint-disable-next-line prefer-rest-params
  target.dataLayer.push(arguments);
}

let defaultPublished = false;

export function ensureGoogleConsentDefault() {
  if (defaultPublished) return;
  defaultPublished = true;
  enqueueGoogleCommand("consent", "default", googleConsentSignals([]));
}

/** Disable consumers synchronously BEFORE a denied update reaches a loaded tag. */
export function publishConsent(command: "default" | "update") {
  window.dispatchEvent(new Event(CONSENT_BEFORE_CHANGE_EVENT));
  if (command === "default") ensureGoogleConsentDefault();
  else {
    ensureGoogleConsentDefault();
    enqueueGoogleCommand("consent", command, getEffectiveGoogleConsent());
  }
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}
