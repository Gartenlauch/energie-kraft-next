"use client";

import { euro, number, percent } from "@/components/configurator/result-presentation";
import { useConfigurator } from "@/lib/configurator/configurator-context";
import { calculateProjectEconomics } from "@/lib/configurator/project-economics";

const PRODUCT_LABELS = {
  photovoltaic: "Photovoltaik",
  battery_storage: "Stromspeicher",
  heat_pump: "Wärmepumpe",
  climate: "Klimaanlage",
  wallbox: "Wallbox",
} as const;

export function ProjectAnalysisPreview() {
  const { state } = useConfigurator();
  const economics = calculateProjectEconomics(state);
  const solar = economics.solar;
  const heating = economics.heating;
  const hasClimate = Boolean(state.results.climate);
  const hasWallbox = Boolean(state.results.wallbox);
  const hasStorage = Boolean(state.results.batteryStorage);
  const individualQuoteProducts = economics.components
    .filter((component) => component.pricingMode === "individual_quote_required")
    .map((component) => PRODUCT_LABELS[component.component]);

  return (
    <section aria-labelledby="project-analysis-preview-heading" className="mt-7">
      <div className="bg-brand-navy overflow-hidden rounded-[1.5rem] px-6 py-7 text-white sm:px-9 sm:py-9">
        <p className="text-sm font-semibold tracking-[0.15em] text-cyan-200 uppercase">
          Dein Energieprojekt
        </p>
        <h2
          id="project-analysis-preview-heading"
          className="mt-2 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Deine Lösungen im Zusammenhang
        </h2>
        <div className="mt-6 border-t border-white/20 pt-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-cyan-200 uppercase">
            Gesamtinvestition
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight break-words sm:text-4xl">
            {economics.investmentBaseEuro === null
              ? "Noch nicht vollständig bezifferbar"
              : euro(economics.investmentBaseEuro)}
          </p>
          {economics.missingInvestmentComponents.length ? (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
              {individualQuoteProducts.length
                ? `Für ${individualQuoteProducts.join(", ")} ist aufgrund der Projektgröße ein individuelles Angebot erforderlich. Ein vollständiger Gesamtbetrag ist deshalb noch nicht möglich.`
                : `Die Investition für ${economics.missingInvestmentComponents.map((component) => PRODUCT_LABELS[component]).join(", ")} wird nach technischer Prüfung ergänzt. Ein vollständiger Gesamtbetrag ist deshalb noch nicht möglich.`}
            </p>
          ) : (
            <p className="mt-3 text-sm text-white/65">
              Modellierter Gesamtbetrag für alle ausgewählten Lösungen; kein verbindliches Angebot.
            </p>
          )}
        </div>
      </div>

      <div className="border-brand-primary/15 mt-8 border-t">
        {solar ? (
          <div className="border-brand-primary/15 grid gap-3 border-b py-6 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8">
            <h3 className="text-brand-secondary text-xs font-semibold tracking-[0.13em] uppercase">
              Solarinvestition
            </h3>
            <div className="min-w-0">
              <p className="text-brand-navy text-lg font-semibold">
                Photovoltaik{hasStorage ? " + Stromspeicher" : ""}
              </p>
              <p className="text-brand-primary mt-1 text-2xl font-semibold break-words">
                {solar.investmentEuro === null
                  ? "Nach technischer Prüfung"
                  : euro(solar.investmentEuro)}
              </p>
              <p className="text-foreground/70 mt-3 text-sm leading-6">
                Finanzieller Vorteil im ersten Jahr:{" "}
                <strong className="text-brand-navy">{euro(solar.firstYearNetBenefitEuro)}</strong>
              </p>
              {(solar.paybackStatus === "reached" && solar.paybackYears !== null) ||
              (solar.irrStatus === "valid" && solar.annualizedReturnPercent !== null) ? (
                <p className="text-foreground/70 mt-1 text-sm leading-6">
                  {solar.paybackStatus === "reached" && solar.paybackYears !== null
                    ? `Amortisation: ${number(solar.paybackYears)} Jahre`
                    : ""}
                  {solar.paybackStatus === "reached" &&
                  solar.paybackYears !== null &&
                  solar.irrStatus === "valid" &&
                  solar.annualizedReturnPercent !== null
                    ? " · "
                    : ""}
                  {solar.irrStatus === "valid" && solar.annualizedReturnPercent !== null
                    ? `Modellierte Rendite p. a.: ${percent(solar.annualizedReturnPercent, 2)}`
                    : ""}
                </p>
              ) : null}
            </div>
          </div>
        ) : state.results.photovoltaic?.pricingMode === "individual_quote_required" ? (
          <div className="border-brand-primary/15 border-b py-6">
            <h3 className="text-brand-navy text-lg font-semibold">Individuelles Angebot erforderlich</h3>
            <p className="text-foreground/70 mt-2 text-sm leading-6">
              Die Photovoltaikanlage liegt oberhalb des standardisiert modellierten Größenbereichs.
              Die Wirtschaftlichkeit wird individuell ausgelegt.
            </p>
          </div>
        ) : null}

        {heating ? (
          <div className="border-brand-primary/15 grid gap-3 border-b py-6 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8">
            <h3 className="text-brand-secondary text-xs font-semibold tracking-[0.13em] uppercase">
              Wärmepumpe
            </h3>
            <div className="min-w-0">
              <p className="text-brand-navy text-lg font-semibold">Heizkosten im Vergleich</p>
              <p className="text-brand-primary mt-1 text-2xl font-semibold break-words">
                {heating.annualSavingEuro === null
                  ? "Vergleich nach Klärung des Heizsystems"
                  : heating.annualSavingEuro > 0
                    ? `${euro(heating.annualSavingEuro)} weniger pro Jahr`
                    : heating.annualSavingEuro < 0
                      ? `${euro(-heating.annualSavingEuro)} mehr pro Jahr`
                      : "Gleiche modellierte Heizkosten"}
              </p>
              {heating.savingPercent !== null ? (
                <p className="text-foreground/70 mt-2 text-sm">
                  {percent(heating.savingPercent)} gegenüber der bisherigen Heizung
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {hasClimate || hasWallbox ? (
          <div className="border-brand-primary/15 grid gap-3 border-b py-6 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8">
            <h3 className="text-brand-secondary text-xs font-semibold tracking-[0.13em] uppercase">
              Komfort &amp; Lebensqualität
            </h3>
            <div className="min-w-0">
              <p className="text-brand-navy text-lg font-semibold">
                {[hasClimate ? "Klimaanlage" : null, hasWallbox ? "Wallbox" : null]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <p className="text-foreground/70 mt-2 text-sm leading-6">
                {hasClimate && hasWallbox
                  ? "Gezielte Kühlung und bequemes Laden zu Hause – abgestimmt auf dein Energiesystem."
                  : hasClimate
                    ? "Gezielte Kühlung, abgestimmt auf deine Räume und dein Energiesystem."
                    : "Bequemes Laden zu Hause, passend zu deinem Fahrzeug und deiner Installation."}
              </p>
            </div>
          </div>
        ) : null}

        {!solar && hasStorage ? (
          <div className="border-brand-primary/15 grid gap-3 border-b py-6 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8">
            <h3 className="text-brand-secondary text-xs font-semibold tracking-[0.13em] uppercase">
              Stromspeicher
            </h3>
            <div className="min-w-0">
              <p className="text-brand-navy text-lg font-semibold">Solarenergie später nutzen</p>
              <p className="text-foreground/70 mt-2 text-sm leading-6">
                {state.results.batteryStorage?.pricingMode === "individual_quote_required"
                  ? "Für diese Speichergröße ist eine individuelle technische Planung erforderlich."
                  : "Die konkrete Wirkung im Zusammenspiel mit Photovoltaik wird in der weiteren Planung geprüft."}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <aside
        aria-labelledby="project-analysis-pdf-heading"
        className="bg-surface mt-8 border-l-4 border-cyan-500 px-5 py-5 sm:px-7 sm:py-6"
      >
        <h3
          id="project-analysis-pdf-heading"
          className="text-brand-navy text-sm font-semibold tracking-[0.1em] uppercase"
        >
          KOSTENLOSE PERSÖNLICHE PROJEKTANALYSE
        </h3>
        <p className="text-foreground/70 mt-3 text-sm leading-6">
          Hier im Browser erhältst du bereits eine kompakte Auswertung deiner Konfiguration mit den
          wichtigsten Empfehlungen, Kosten und Einsparpotenzialen.
        </p>
        <p className="text-foreground/70 mt-2 text-sm leading-6">
          Nach Eingabe deiner Kontaktdaten erstellen wir zusätzlich deine persönliche
          PDF-Projektanalyse mit detaillierter Wirtschaftlichkeitsberechnung, Energiefluss, Annahmen
          und den nächsten Planungsschritten.
        </p>
        <p className="text-foreground/60 mt-3 text-xs leading-5">
          Unverbindliche Orientierung – keine technische Planung und kein Angebot.
        </p>
      </aside>
    </section>
  );
}
