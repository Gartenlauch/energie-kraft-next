"use client";

import { showPreferences } from "vanilla-cookieconsent";

export function ConsentSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => showPreferences()}
      aria-haspopup="dialog"
      className="text-brand-primary inline-flex min-h-11 items-center underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      Cookie-Einstellungen
    </button>
  );
}
