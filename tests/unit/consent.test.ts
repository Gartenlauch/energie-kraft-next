import { describe, expect, it } from "vitest";
import {
  canUseTracking,
  CONSENT_CATEGORIES,
  CONSENT_LIFETIME_MS,
  CONSENT_REVISION,
  googleConsentSignals,
  isTrackingHostAllowed,
  parseStoredConsent,
} from "../../src/lib/consent/policy";

const now = Date.now();
const record = {
  revision: CONSENT_REVISION,
  categories: ["necessary", "analytics"],
  consentId: "test-consent",
  consentTimestamp: new Date(now - 1000).toISOString(),
  lastConsentTimestamp: new Date(now - 1000).toISOString(),
  expirationTime: now - 1000 + CONSENT_LIFETIME_MS,
  data: null,
  services: { necessary: [], analytics: [], marketing: [], personalization: [], googleReviews: [] },
};

describe("consent boundary", () => {
  it("defaults to denied and maps independent categories", () => {
    expect(Object.values(googleConsentSignals([]))).toEqual(Array(4).fill("denied"));
    expect(googleConsentSignals(["analytics"])).toEqual({
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    expect(googleConsentSignals(["marketing"]).ad_personalization).toBe("denied");
    expect(googleConsentSignals(["personalization"]).ad_personalization).toBe("denied");
    expect(googleConsentSignals(["marketing", "personalization"]).ad_personalization).toBe(
      "denied",
    );
    expect(googleConsentSignals(["googleReviews"])).toEqual(googleConsentSignals([]));
    expect(googleConsentSignals(CONSENT_CATEGORIES)).toEqual(googleConsentSignals(["analytics"]));
  });

  it("accepts the library record including its timestamps and null custom data", () => {
    expect(parseStoredConsent(JSON.stringify(record), now)?.categories).toEqual(record.categories);
  });

  it.each([
    null,
    "",
    "{",
    "null",
    "[]",
    JSON.stringify({ ...record, revision: 0 }),
    JSON.stringify({ ...record, revision: 1 }),
    JSON.stringify({ ...record, expirationTime: now }),
    JSON.stringify({ ...record, expirationTime: now + CONSENT_LIFETIME_MS * 2 }),
    JSON.stringify({ ...record, lastConsentTimestamp: "invalid" }),
    JSON.stringify({ ...record, lastConsentTimestamp: new Date(now + 1000).toISOString() }),
    JSON.stringify({ ...record, categories: ["necessary", "unknown"] }),
    JSON.stringify({ ...record, categories: ["analytics"] }),
    JSON.stringify({ ...record, services: { analytics: "invalid" } }),
    JSON.stringify({ ...record, data: { email: "not-stored@example.invalid" } }),
  ])("fails closed for invalid, expired or outdated storage (%#)", (raw) => {
    expect(parseStoredConsent(raw, now)).toBeNull();
  });

  it.each([
    "review.energie-kraft.de",
    "localhost",
    "127.0.0.1",
    "energie-kraft.de",
    "preview.web.app",
    "preview.firebaseapp.com",
    "preview.hosted.app",
    "evil.energie-kraft.de",
    "energie-kraft.de.attacker.invalid",
  ])("blocks unapproved hosts: %s", (host) => {
    expect(isTrackingHostAllowed(host)).toBe(false);
    expect(canUseTracking(host, "https:", "production")).toBe(false);
  });

  it("allows only HTTPS production, independently of indexing", () => {
    expect(canUseTracking("www.energie-kraft.de", "https:", "production")).toBe(true);
    expect(canUseTracking("www.energie-kraft.de", "http:", "production")).toBe(false);
    for (const env of ["local", "ci", "preview", ""]) {
      expect(canUseTracking("www.energie-kraft.de", "https:", env)).toBe(false);
    }
  });
});
