"use client";

import Link from "next/link";
import { useEffect } from "react";

interface SiteErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function SiteError({ error, reset }: SiteErrorProps) {
  useEffect(() => {
    console.error("[site-error-boundary]", {
      name: error.name,
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <main className="px-6 py-24">
      <section className="border-foreground/10 bg-foreground/[0.02] mx-auto max-w-3xl rounded-2xl border p-8 md:p-12">
        <p className="text-foreground/60 text-sm font-semibold tracking-widest uppercase">
          Technischer Fehler
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
          Diese Seite konnte nicht vollständig geladen werden
        </h1>

        <p className="text-foreground/70 mt-6 max-w-2xl text-lg leading-8">
          Beim Laden der benötigten Daten ist ein Fehler aufgetreten. Sie können den Vorgang erneut
          versuchen oder zur Startseite zurückkehren.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={reset}
            className="bg-foreground text-background inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md px-5 py-3 text-sm font-semibold"
          >
            Erneut versuchen
          </button>

          <Link
            href="/"
            className="border-foreground/20 inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold"
          >
            Zur Startseite
          </Link>

          <Link
            href="/kontakt"
            className="border-foreground/20 inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold"
          >
            Kontakt aufnehmen
          </Link>
        </div>

        {error.digest ? (
          <p className="text-foreground/50 mt-8 text-xs">Fehlerreferenz: {error.digest}</p>
        ) : null}
      </section>
    </main>
  );
}
