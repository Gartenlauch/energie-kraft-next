"use client";

import {
  GOOGLE_ADS_ENABLED,
  GOOGLE_ADS_ID,
  GOOGLE_ADS_SEND_TO,
  type GoogleAdsConversion,
} from "@/config/google-ads";
import { analyticsPageLocation } from "./analytics";
import { enqueueGoogleCommand, hasConsent } from "./client";
import { ensureGoogleTag } from "./google-tag";
import { canUseTracking } from "./policy";

const STORAGE_KEY = "ek_ads_conversions";
const MAX_REMEMBERED_LEADS = 200;
// Backend-generated Firestore auto IDs; never derive an ID from form fields.
const LEAD_ID = /^[A-Za-z0-9]{20}$/;

type GoogleAdsWindow = Window & {
  __ekGoogleAds?: {
    initialized: boolean;
    pending: Map<string, GoogleAdsConversion>;
    sent: Set<string>;
  };
};

function isAllowed() {
  return (
    GOOGLE_ADS_ENABLED &&
    canUseTracking(window.location.hostname, window.location.protocol) &&
    hasConsent("marketing") &&
    analyticsPageLocation(window.location.pathname) !== null &&
    Object.values(GOOGLE_ADS_SEND_TO).every(
      (value) => typeof value === "string" && value.startsWith(`${GOOGLE_ADS_ID}/`),
    )
  );
}

function getState() {
  const target = window as GoogleAdsWindow;
  if (!target.__ekGoogleAds) {
    let sent: string[] = [];
    try {
      const stored: unknown = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(stored)) {
        sent = stored.filter((id): id is string => typeof id === "string" && LEAD_ID.test(id));
      }
    } catch {
      // In-memory and Google's transaction_id deduplication remain available.
    }
    target.__ekGoogleAds = {
      initialized: false,
      pending: new Map(),
      sent: new Set(sent.slice(-MAX_REMEMBERED_LEADS)),
    };
  }
  return target.__ekGoogleAds;
}

export function clearGoogleAdsCookies() {
  const paths = new Set(["/"]);
  const parts = window.location.pathname.split("/").filter(Boolean);
  for (let index = 1; index <= parts.length; index++) {
    paths.add(`/${parts.slice(0, index).join("/")}`);
    paths.add(`/${parts.slice(0, index).join("/")}/`);
  }
  for (const entry of document.cookie.split(";")) {
    const name = entry.trim().split("=")[0];
    if (!name || !/^_gcl_/.test(name)) continue;
    for (const path of paths) {
      for (const domain of ["", window.location.hostname, "energie-kraft.de"]) {
        document.cookie = `${name}=; Max-Age=0; Path=${path};${domain ? ` Domain=${domain};` : ""} SameSite=Lax; Secure`;
      }
    }
  }
}

export function discardPendingGoogleAdsConversions() {
  (window as GoogleAdsWindow).__ekGoogleAds?.pending.clear();
}

/** Before a denied update, discard unsent events and remove the configured tag by reload. */
export function pauseGoogleAds(event: Event) {
  if (isAllowed()) return;
  const state = (window as GoogleAdsWindow).__ekGoogleAds;
  state?.pending.clear();
  if (!GOOGLE_ADS_ENABLED) return;
  clearGoogleAdsCookies();
  if (state?.initialized && event.cancelable) {
    event.preventDefault();
    window.location.reload();
  }
}

export function syncGoogleAds() {
  try {
    if (!isAllowed()) {
      discardPendingGoogleAdsConversions();
      return;
    }
    const state = getState();
    if (!ensureGoogleTag(GOOGLE_ADS_ID, syncGoogleAds, discardPendingGoogleAdsConversions)) return;
    const page = {
      page_location: analyticsPageLocation(window.location.pathname),
      page_referrer: "",
      page_title: "Energie-Kraft Süd",
    };
    if (!state.initialized) {
      enqueueGoogleCommand("config", GOOGLE_ADS_ID, {
        ...page,
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        allow_enhanced_conversions: false,
      });
      state.initialized = true;
    }
    for (const [leadId, conversion] of state.pending) {
      // Check persisted consent at the actual point of dispatch, including expiry.
      if (!isAllowed()) {
        state.pending.clear();
        return;
      }
      state.pending.delete(leadId);
      if (state.sent.has(leadId)) continue;
      enqueueGoogleCommand("event", "conversion", {
        ...page,
        send_to: GOOGLE_ADS_SEND_TO[conversion],
        transaction_id: leadId,
      });
      state.sent.add(leadId);
      try {
        window.sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify([...state.sent].slice(-MAX_REMEMBERED_LEADS)),
        );
      } catch {
        // Optional tracking storage must never affect a successful lead submission.
      }
    }
  } catch {
    discardPendingGoogleAdsConversions();
  }
}

/** Call only with the backend acknowledgement, never on a click or a render. */
export function trackGoogleAdsLead(
  result: { ok: unknown; leadId: unknown },
  conversion: GoogleAdsConversion,
): void {
  try {
    if (
      typeof window === "undefined" ||
      result.ok !== true ||
      typeof result.leadId !== "string" ||
      !LEAD_ID.test(result.leadId) ||
      !isAllowed()
    )
      return;
    const state = getState();
    if (state.sent.has(result.leadId) || state.pending.has(result.leadId)) return;
    state.pending.set(result.leadId, conversion);
    syncGoogleAds();
  } catch {
    // Tracking is optional; a backend-confirmed submission must stay successful.
  }
}
