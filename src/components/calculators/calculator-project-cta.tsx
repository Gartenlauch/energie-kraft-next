"use client";

import Link from "next/link";
import { writeCalculatorHandoff } from "@/lib/configurator/calculator-handoff";
import type { CalculatorHandoff } from "@/types/configurator";

type CalculatorHandoffDraft<T extends CalculatorHandoff = CalculatorHandoff> = T extends unknown
  ? Omit<T, "createdAt">
  : never;

const HREFS: Record<CalculatorHandoff["source"], string> = {
  pv_sizing: "/konfigurator/photovoltaik",
  pv_roi: "/konfigurator/photovoltaik",
  heat_pump: "/konfigurator/waermepumpe",
  climate: "/konfigurator/klimaanlage",
  wallbox: "/konfigurator/wallbox",
};

export function CalculatorProjectCta({ handoff }: { handoff: CalculatorHandoffDraft }) {
  return (
    <aside className="bg-brand-navy mt-8 overflow-hidden rounded-2xl px-6 py-7 text-white sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-8">
      <div>
        <p className="text-sm font-semibold tracking-[0.12em] text-cyan-200 uppercase">
          Nächster Schritt
        </p>
        <h3 className="mt-2 text-2xl font-semibold">Aus Orientierung wird dein Energieprojekt</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
          Kompatible Eingaben werden als editierbarer Vorschlag übernommen. Nach Abschluss erhältst
          du deine persönliche Projektanalyse als PDF.
        </p>
      </div>
      <Link
        href={HREFS[handoff.source]}
        onClick={() =>
          writeCalculatorHandoff(window.sessionStorage, {
            ...handoff,
            createdAt: Date.now(),
          } as CalculatorHandoff)
        }
        className="text-brand-primary mt-5 inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold transition hover:bg-cyan-50 sm:mt-0"
      >
        Projekt konfigurieren
      </Link>
    </aside>
  );
}
