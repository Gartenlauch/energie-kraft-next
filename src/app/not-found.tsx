import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    absolute: "Seite nicht gefunden | Energie-Kraft Süd",
  },
  description: "Die aufgerufene Seite wurde nicht gefunden.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center px-6 py-20">
      <section className="border-foreground/10 bg-foreground/[0.02] w-full max-w-3xl rounded-2xl border p-8 md:p-12">
        <p className="text-foreground/60 text-sm font-semibold tracking-widest uppercase">
          Fehler 404
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
          Diese Seite wurde nicht gefunden
        </h1>

        <p className="text-foreground/70 mt-6 max-w-2xl text-lg leading-8">
          Die Adresse ist möglicherweise nicht mehr aktuell, wurde geändert oder enthält einen
          Tippfehler.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/"
            className="bg-foreground text-background inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold"
          >
            Zur Startseite
          </Link>

          <Link
            href="/kontakt"
            className="border-foreground/20 inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold"
          >
            Kontakt aufnehmen
          </Link>

          <Link
            href="/photovoltaik"
            className="border-foreground/20 inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold"
          >
            Zu unseren Lösungen
          </Link>
        </div>
      </section>
    </main>
  );
}