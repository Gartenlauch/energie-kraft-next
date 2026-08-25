"use client";

import { useEffect } from "react";

import { WallboxWizard } from "@/components/configurator/wallbox/wallbox-wizard";
import { useConfigurator } from "@/lib/configurator/configurator-context";

export function WallboxEntry() {
  const {
    state,
    dispatch,
    isHydrated,
  } = useConfigurator();

  useEffect(() => {
    dispatch({
      type: "SET_ACTIVE_CONFIGURATOR",
      payload: "wallbox",
    });
  }, [dispatch]);

  if (!isHydrated) {
    return (
      <div
        className="min-h-40"
        aria-live="polite"
      >
        <p className="text-sm text-foreground/60">
          Konfiguration wird geladen …
        </p>
      </div>
    );
  }

  return (
    <WallboxWizard
      hasPhotovoltaicContext={
        state.results.photovoltaic !==
        undefined
      }
    />
  );
}