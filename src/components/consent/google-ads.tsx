"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { GOOGLE_ADS_ENABLED } from "@/config/google-ads";
import { CONSENT_BEFORE_CHANGE_EVENT, subscribeToConsentChanges } from "@/lib/consent/client";
import {
  discardPendingGoogleAdsConversions,
  pauseGoogleAds,
  syncGoogleAds,
} from "@/lib/consent/google-ads";

export function GoogleAds() {
  const pathname = usePathname();
  useEffect(() => {
    if (!GOOGLE_ADS_ENABLED) return;
    syncGoogleAds();
    window.addEventListener(CONSENT_BEFORE_CHANGE_EVENT, pauseGoogleAds);
    const unsubscribe = subscribeToConsentChanges(syncGoogleAds);
    return () => {
      unsubscribe();
      window.removeEventListener(CONSENT_BEFORE_CHANGE_EVENT, pauseGoogleAds);
      discardPendingGoogleAdsConversions();
    };
  }, [pathname]);
  return null;
}
