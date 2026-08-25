"use client";

import { useEffect } from "react";

import { BatteryStorageWizard } from "@/components/configurator/battery-storage/battery-storage-wizard";
import {
  buildBatteryStoragePhotovoltaicHandoff,
} from "@/lib/configurator/battery-storage";
import { useConfigurator } from "@/lib/configurator/configurator-context";

export function BatteryStorageEntry() {
  const {
    state,
    dispatch,
    isHydrated,
  } = useConfigurator();

  useEffect(() => {
    dispatch({
      type: "SET_ACTIVE_CONFIGURATOR",
      payload: "battery_storage",
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

  const photovoltaicHandoff =
    buildBatteryStoragePhotovoltaicHandoff(
      state,
    );

  return (
    <BatteryStorageWizard
      key={
        photovoltaicHandoff
          ? "photovoltaic-handoff"
          : "standalone"
      }
      photovoltaicHandoff={
        photovoltaicHandoff
      }
    />
  );
}