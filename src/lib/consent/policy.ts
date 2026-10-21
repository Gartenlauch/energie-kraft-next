export const CONSENT_STORAGE_KEY = "ek_consent";
export const CONSENT_REVISION = 1;
// Provisional: requires specialist approval before launch.
export const CONSENT_LIFETIME_DAYS = 180;
export const CONSENT_LIFETIME_MS = CONSENT_LIFETIME_DAYS * 86_400_000;
export const CONSENT_CATEGORIES = [
  "necessary",
  "analytics",
  "marketing",
  "personalization",
  "googleReviews",
] as const;
export type ConsentCategory = (typeof CONSENT_CATEGORIES)[number];

// Deliberately closed. Enabling tracking requires a separate reviewed change to BOTH.
export const TRACKING_ENABLED = false;
export const TRACKING_HOST_ALLOWLIST: readonly string[] = [];

export function isTrackingHostAllowed(hostname: string): boolean {
  return TRACKING_HOST_ALLOWLIST.includes(hostname.toLowerCase());
}

export function canUseTracking(hostname: string): boolean {
  return TRACKING_ENABLED && isTrackingHostAllowed(hostname);
}

export function googleConsentSignals(categories: readonly ConsentCategory[]) {
  const granted = (category: ConsentCategory) =>
    categories.includes(category) ? ("granted" as const) : ("denied" as const);
  return {
    analytics_storage: granted("analytics"),
    ad_storage: granted("marketing"),
    ad_user_data: granted("marketing"),
    ad_personalization:
      categories.includes("marketing") && categories.includes("personalization")
        ? ("granted" as const)
        : ("denied" as const),
  };
}

export interface StoredConsent {
  categories: ConsentCategory[];
  expirationTime: number;
}

/** Validate the library's own record; do not maintain a second consent store. */
export function parseStoredConsent(raw: string | null, now = Date.now()): StoredConsent | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const first = Date.parse(value.consentTimestamp);
    const last = Date.parse(value.lastConsentTimestamp);
    if (
      value.revision !== CONSENT_REVISION ||
      typeof value.consentId !== "string" ||
      !value.consentId ||
      typeof value.consentTimestamp !== "string" ||
      typeof value.lastConsentTimestamp !== "string" ||
      !Array.isArray(value.categories) ||
      !value.categories.includes("necessary") ||
      !value.categories.every((item: unknown) =>
        CONSENT_CATEGORIES.includes(item as ConsentCategory),
      ) ||
      !Number.isFinite(first) ||
      !Number.isFinite(last) ||
      first > last ||
      last > now ||
      typeof value.expirationTime !== "number" ||
      !Number.isFinite(value.expirationTime) ||
      value.expirationTime <= now ||
      value.expirationTime > last + CONSENT_LIFETIME_MS + 1000 ||
      !value.services ||
      typeof value.services !== "object" ||
      Array.isArray(value.services) ||
      !Object.entries(value.services).every(
        ([key, services]) =>
          CONSENT_CATEGORIES.includes(key as ConsentCategory) &&
          Array.isArray(services) &&
          services.length === 0,
      ) ||
      value.data != null
    )
      return null;
    return { categories: value.categories, expirationTime: value.expirationTime };
  } catch {
    return null;
  }
}
