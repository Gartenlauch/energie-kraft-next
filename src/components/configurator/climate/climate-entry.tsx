"use client";

import { useEffect } from "react";

import { ClimateWizard } from "@/components/configurator/climate/climate-wizard";
import { useConfigurator } from "@/lib/configurator/configurator-context";

export function ClimateEntry() {
    const {
        dispatch,
        isHydrated,
    } = useConfigurator();

    useEffect(() => {
        dispatch({
            type: "SET_ACTIVE_CONFIGURATOR",
            payload: "climate",
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

    return <ClimateWizard />;
}