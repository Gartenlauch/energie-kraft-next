"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";

interface ConfiguratorSubmitSuccessProps {
  leadId: string;

  reportStatus?: "generated" | "failed";

  customerMailStatus?: "accepted" | "failed";

  onRestart: () => void;
}

export function ConfiguratorSubmitSuccess({
  leadId,
  reportStatus,
  customerMailStatus,
  onRestart,
}: ConfiguratorSubmitSuccessProps) {
  const router = useRouter();

  const projectOverviewSent = reportStatus === "generated" && customerMailStatus === "accepted";

  function handleRestart() {
    /*
     * Lokalen Wizard-Zustand ebenfalls
     * zurücksetzen. Das ist insbesondere
     * wichtig, wenn wir uns bereits auf der
     * PV-Route befinden.
     */
    onRestart();

    /*
     * Ein neues Energieprojekt beginnt
     * standardmäßig beim PV-Konfigurator.
     *
     * replace verhindert außerdem, dass
     * "Zurück" wieder auf der alten
     * Success-Ansicht landet.
     */
    router.replace("/konfigurator/photovoltaik");
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
            {leadId}
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
