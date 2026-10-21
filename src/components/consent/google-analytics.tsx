"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pauseAnalytics, syncAnalytics } from "@/lib/consent/analytics";
import { CONSENT_BEFORE_CHANGE_EVENT, subscribeToConsentChanges } from "@/lib/consent/client";

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navigation = `${pathname}${searchParams.size ? `?${searchParams}` : ""}`;

  useEffect(() => {
    const sync = () => syncAnalytics(pathname, navigation);
    sync();
    window.addEventListener(CONSENT_BEFORE_CHANGE_EVENT, pauseAnalytics);
    const unsubscribe = subscribeToConsentChanges(sync);
    return () => {
      unsubscribe();
      window.removeEventListener(CONSENT_BEFORE_CHANGE_EVENT, pauseAnalytics);
      pauseAnalytics();
    };
  }, [pathname, navigation]);

  return null;
}
