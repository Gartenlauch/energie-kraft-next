"use client";

import Link from "next/link";
import {
  useRouter,
} from "next/navigation";

import {
  ConfiguratorPhaseIndicator,
} from "@/components/configurator/configurator-phase-indicator";

interface ConfiguratorSubmitSuccessProps {
  leadId: string;
  onRestart: () => void;
}

export function ConfiguratorSubmitSuccess({
  leadId,
  onRestart,
}: ConfiguratorSubmitSuccessProps) {
  const router =
    useRouter();

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
    router.replace(
      "/konfigurator/photovoltaik",
    );
  }

  return (
    <>
      <ConfiguratorPhaseIndicator
        currentPhase="submit"
      />

      <section
        aria-labelledby="configurator-success-heading"
      >
        <p className="text-sm font-semibold tracking-widest text-brand-secondary uppercase">
          Anfrage übermittelt
        </p>

        <h1
          id="configurator-success-heading"
          className="mt-3 text-3xl font-semibold tracking-tight text-brand-primary sm:text-4xl"
        >
          Vielen Dank für deine Anfrage
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-foreground/70">
          Deine Konfiguration wurde
          erfolgreich gespeichert. Wir
          prüfen deine Angaben und melden
          uns bei dir.
        </p>

        <div className="mt-8 rounded-2xl border border-border-default bg-surface p-6">
          <p className="text-sm text-foreground/60">
            Referenz
          </p>

          <p className="mt-1 break-all font-mono text-sm font-semibold text-brand-primary">
            {leadId}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleRestart}
            className="min-h-12 rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white"
          >
            Neue Konfiguration starten
          </button>

          <Link
            href="/konfigurator"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border-default px-6 py-3 font-semibold text-brand-primary"
          >
            Zur Konfigurator-Übersicht
          </Link>
        </div>
      </section>
    </>
  );
}