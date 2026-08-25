"use client";

import { useEffect } from "react";

import { HeatPumpWizard } from "@/components/configurator/heat-pump/heat-pump-wizard";
import { useConfigurator } from "@/lib/configurator/configurator-context";

export function HeatPumpEntry() {
  const {
    dispatch,
    isHydrated,
  } = useConfigurator();

  useEffect(() => {
    dispatch({
      type: "SET_ACTIVE_CONFIGURATOR",
      payload: "heat_pump",
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

  return <HeatPumpWizard />;
}