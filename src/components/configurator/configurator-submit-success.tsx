"use client";

import Link from "next/link";

import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";

interface ConfiguratorSubmitSuccessProps {
  publicReference: string;

  reportStatus?: "generated" | "failed";

  customerMailStatus?: "accepted" | "failed";
}

export function ConfiguratorSubmitSuccess({
  publicReference,
  reportStatus,
  customerMailStatus,
}: ConfiguratorSubmitSuccessProps) {
  const projectOverviewSent = reportStatus === "generated" && customerMailStatus === "accepted";

  function handleRestart() {
    // Der Seitenwechsel lädt die aktuelle Modellversion für das neue Projekt.
    window.location.replace("/konfigurator/photovoltaik");
  }

  return (
    <>
      <ConfiguratorPhaseIndicator currentPhase="submit" />

      <section aria-labelledby="configurator-success-heading">
        <p className="eyebrow">Anfrage übermittelt</p>

        <h1
          id="configurator-success-heading"
          className="text-brand-navy mt-4 text-3xl leading-tight tracking-tight sm:text-4xl"
        >
          {projectOverviewSent
            ? "Deine Energieprojekt-Analyse ist unterwegs"
            : "Deine Anfrage ist erfolgreich angekommen"}
        </h1>

        <p className="text-foreground/70 mt-5 max-w-2xl text-lg leading-8">
          {projectOverviewSent ? (
            <>
              Wir haben deine Konfiguration erfolgreich erhalten. Du bekommst deine persönliche
              Ergebnisübersicht in wenigen Minuten per E-Mail.
            </>
          ) : (
            <>
              Wir haben deine Konfiguration erfolgreich erhalten und gespeichert. Die
              Energieprojekt-Analyse konnte momentan nicht automatisch per E-Mail bereitgestellt
              werden. Wir kümmern uns darum.
            </>
          )}
        </p>

        <div className="border-border-default bg-surface mt-8 rounded-xl border p-6">
          <p className="text-foreground/60 text-sm">Referenz</p>

          <p className="text-brand-primary mt-1 font-mono text-sm font-semibold break-all">
            {publicReference}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={handleRestart} className="button-primary">
            Neue Konfiguration starten
          </button>

          <Link href="/konfigurator" className="button-secondary">
            Zur Konfigurator-Übersicht
          </Link>
        </div>
      </section>
    </>
  );
}
