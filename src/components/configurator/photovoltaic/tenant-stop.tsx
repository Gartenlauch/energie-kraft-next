"use client";

import Link from "next/link";

import { ConfiguratorStepSection } from "@/components/configurator/configurator-step-section";
import { photovoltaicConfiguratorContent } from "@/content/configurators";

interface TenantStopProps {
  onBack: () => void;
}

export function TenantStop({
  onBack,
}: TenantStopProps) {
  return (
    <ConfiguratorStepSection
      headingId="photovoltaic-tenant-heading"
      eyebrow={photovoltaicConfiguratorContent.eyebrow}
      title={photovoltaicConfiguratorContent.tenant.title}
      description={
        photovoltaicConfiguratorContent.tenant.description
      }
    >
      <div className="rounded-2xl border border-border-default bg-surface p-6">
        <p className="leading-7 text-foreground/70">
          Sobald eine Zustimmung vorliegt, kannst du den
          Konfigurator jederzeit erneut starten oder direkt mit uns
          Kontakt aufnehmen.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/kontakt"
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-primary px-6 py-3 text-center font-semibold text-white transition hover:opacity-90"
        >
          Kontakt aufnehmen
        </Link>

        <Link
          href="/konfigurator"
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border-default px-6 py-3 text-center font-medium text-brand-primary transition hover:bg-surface"
        >
          Zur Konfigurator-Übersicht
        </Link>

        <button
          type="button"
          onClick={onBack}
          className="min-h-12 rounded-xl border border-border-default px-6 py-3 font-medium text-brand-primary transition hover:bg-surface"
        >
          Zurück
        </button>
      </div>
    </ConfiguratorStepSection>
  );
}