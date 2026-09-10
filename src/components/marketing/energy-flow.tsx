import Link from "next/link";

/** Qualitative energy flow: no invented yields or calculator assumptions. */
export function EnergyFlow() {
  return (
    <section className="bg-surface-soft py-16 md:py-24" aria-labelledby="energy-flow-title">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="eyebrow">PV + Speicher im Tagesverlauf</p>
          <h2 id="energy-flow-title" className="section-title mt-4">
            Tagsüber erzeugen. Später weiter nutzen.
          </h2>
          <p className="lead-copy mt-6">
            Solarstrom versorgt zunächst die Verbraucher im Haus. Ein Batteriespeicher kann
            Überschüsse für den Abend aufnehmen. Was danach fehlt, liefert das Stromnetz.
          </p>
          <Link
            href="/faq/photovoltaik"
            className="text-brand-primary mt-6 inline-block py-3 font-semibold underline underline-offset-4"
          >
            Fragen zur Solarstromnutzung
          </Link>
        </div>
        <figure className="border-border-strong min-w-0 border-y py-8">
          <ol className="grid gap-6 sm:grid-cols-3">
            {[
              ["01", "Erzeugen", "Photovoltaik", "Sonnenlicht wird zu Solarstrom."],
              [
                "02",
                "Direkt nutzen",
                "Verbrauch im Haus",
                "Verfügbarer PV-Strom deckt den zeitgleichen Bedarf.",
              ],
              [
                "03",
                "Zeitlich verschieben",
                "Batteriespeicher",
                "Überschuss laden, bei späterem Bedarf entladen.",
              ],
            ].map(([number, label, title, description], index) => (
              <li key={number} className="relative">
                <div className="flex items-center gap-3">
                  <span className="text-brand-primary text-3xl font-bold">{number}</span>
                  {index < 2 && (
                    <span aria-hidden="true" className="text-brand-dark text-2xl">
                      →
                    </span>
                  )}
                </div>
                <p className="text-brand-primary mt-4 text-xs font-bold tracking-wider uppercase">
                  {label}
                </p>
                <h3 className="mt-2 text-lg">{title}</h3>
                <p className="mt-3 text-sm leading-6">{description}</p>
              </li>
            ))}
          </ol>
          <div className="border-border-strong mt-8 grid gap-4 border-t pt-6 sm:grid-cols-2">
            <p className="text-sm leading-6">
              <strong className="text-brand-primary block">→ Einspeisung ins Netz</strong>Wenn mehr
              Solarstrom verfügbar ist, als Haus und Speicher aufnehmen.
            </p>
            <p className="text-sm leading-6">
              <strong className="text-brand-primary block">← Bezug aus dem Netz</strong>Wenn
              Erzeugung und Speicher den aktuellen Bedarf nicht decken.
            </p>
          </div>
          <figcaption className="mt-6 text-xs leading-5 text-[var(--text-muted)]">
            Schematische Darstellung ohne Mengenangaben. Die tatsächlichen Energieflüsse hängen von
            Erzeugung, Ladezustand, Leistung und Steuerung ab. Ein Hausspeicher verschiebt Energie
            zwischen Tageszeiten; er ist kein saisonaler Vorrat.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
