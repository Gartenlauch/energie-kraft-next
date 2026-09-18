"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { configuratorProducts } from "@/content/configurators";
import { ProjectAnalysisPreview } from "@/components/configurator/project-analysis-preview";
import type { ConfiguratorType } from "@/types/configurator";

interface ConfiguratorJourneyActionsProps {
  currentConfigurator: ConfiguratorType;
  nextConfigurator: ConfiguratorType | null;

  onBack: () => void;
  onContinue: () => void;

  onAdvance?: () => void;

  secondaryActions?: ReactNode;
}

const NEXT_BUTTON_LABELS: Record<ConfiguratorType, string> = {
  photovoltaic: "Weiter zur Photovoltaik",
  battery_storage: "Weiter zum Stromspeicher",
  wallbox: "Weiter zur Wallbox",
  heat_pump: "Weiter zur Wärmepumpe",
  climate: "Weiter zur Klimaanlage",
};

const NEXT_CONFIGURATOR_LABELS: Record<ConfiguratorType, string> = {
  photovoltaic: "Photovoltaik-Konfigurator",
  battery_storage: "Stromspeicher-Konfigurator",
  wallbox: "Wallbox-Konfigurator",
  heat_pump: "Wärmepumpen-Konfigurator",
  climate: "Klimaanlagen-Konfigurator",
};

export function ConfiguratorJourneyActions({
  currentConfigurator,
  nextConfigurator,
  onBack,
  onContinue,
  onAdvance,
  secondaryActions,
}: ConfiguratorJourneyActionsProps) {
  const currentProduct = configuratorProducts[currentConfigurator];

  return (
    <>
      {nextConfigurator ? null : <ProjectAnalysisPreview />}
      <div className="border-brand-primary/15 mt-7 border-t pt-5">
        <h2 className="text-brand-primary text-sm font-semibold">Wie geht es weiter?</h2>
        <p className="text-foreground/70 mt-1 text-sm leading-6">
          {nextConfigurator
            ? `${currentProduct.title} ist abgeschlossen. Weiter mit dem ${NEXT_CONFIGURATOR_LABELS[nextConfigurator]}; deine Angaben bleiben erhalten.`
            : "Deine Konfiguration ist bereit für die persönliche Projektanalyse."}
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={onBack}
            className="border-border-default text-brand-primary hover:bg-surface min-h-11 rounded-xl border px-5 py-2.5 font-medium transition"
          >
            Angaben ändern
          </button>

          {nextConfigurator ? (
            <Link
              href={configuratorProducts[nextConfigurator].href}
              onClick={onAdvance}
              className="bg-brand-primary inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2.5 text-center font-semibold text-white transition hover:opacity-90"
            >
              {NEXT_BUTTON_LABELS[nextConfigurator]}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                onAdvance?.();
                onContinue();
              }}
              className="bg-brand-primary inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2.5 text-center font-semibold text-white transition hover:opacity-90"
            >
              Persönliche Projektanalyse erhalten
            </button>
          )}

          {secondaryActions}

          <Link
            href="/konfigurator"
            className="border-border-default text-brand-primary hover:bg-surface inline-flex min-h-11 items-center justify-center rounded-xl border px-5 py-2.5 text-center font-semibold transition"
          >
            Zur Übersicht
          </Link>
        </div>
      </div>
    </>
  );
}
