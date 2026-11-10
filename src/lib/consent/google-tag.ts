"use client";

import {
  enqueueGoogleCommand,
  ensureGoogleConsentDefault,
  getEffectiveGoogleConsent,
} from "./client";

type GoogleTagWindow = Window & {
  __ekGoogleTag?: {
    script: HTMLScriptElement;
    loaded: boolean;
    initialized: boolean;
    onLoad: Set<() => void>;
    onError: Set<() => void>;
  };
};

/** Consumers must check their own consent before calling this shared loader. */
export function ensureGoogleTag(
  destinationId: string,
  onLoad: () => void,
  onError: () => void,
): boolean {
  const target = window as GoogleTagWindow;
  if (!target.__ekGoogleTag) {
    // Defaults must already exist when Google's library starts executing.
    ensureGoogleConsentDefault();
    const script = document.createElement("script");
    script.id = "ek-google-tag";
    script.async = true;
    script.referrerPolicy = "no-referrer";
    script.src = `https://www.googletagmanager.com/gtag/js?id=${destinationId}`;
    const state = {
      script,
      loaded: false,
      initialized: false,
      onLoad: new Set<() => void>(),
      onError: new Set<() => void>(),
    };
    target.__ekGoogleTag = state;
    script.onload = () => {
      state.loaded = true;
      const listeners = [...state.onLoad];
      state.onLoad.clear();
      state.onError.clear();
      for (const listener of listeners) listener();
    };
    script.onerror = () => {
      script.remove();
      delete target.__ekGoogleTag;
      for (const listener of state.onError) listener();
      state.onLoad.clear();
      state.onError.clear();
    };
    document.head.appendChild(script);
  }
  const state = target.__ekGoogleTag;
  if (!state.loaded) {
    state.onLoad.add(onLoad);
    state.onError.add(onError);
    return false;
  }
  if (!state.initialized) {
    // No measurement commands while loading; callbacks recheck current consent.
    ensureGoogleConsentDefault();
    enqueueGoogleCommand("consent", "update", getEffectiveGoogleConsent());
    enqueueGoogleCommand("js", new Date());
    state.initialized = true;
  }
  return true;
}
