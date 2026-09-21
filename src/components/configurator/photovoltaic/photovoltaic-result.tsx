"use client";

import { ComparisonBars } from "@/components/charts/energy-charts";
import { ConfiguratorJourneyActions } from "@/components/configurator/configurator-journey-actions";
import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";
import {
  ResultIntro,
  ResultMetric,
  euro,
  number,
  percent,
} from "@/components/configurator/result-presentation";
import { useConfigurator } from "@/lib/configurator/configurator-context";
import { calculateProjectEconomics } from "@/lib/configurator/project-economics";
import { siteConfig } from "@/config/site";
import { CONTACT_FORM_HREF } from "@/config/routes";
import type { ConfiguratorType, PhotovoltaicConfiguratorResult } from "@/types/configurator";

interface PhotovoltaicResultProps {
  result: PhotovoltaicConfiguratorResult;
  nextConfigurator: ConfiguratorType | null;
  onBack: () => void;
  onContinue: () => void;
}

export function PhotovoltaicResult({
  result,
  nextConfigurator,
  onBack,
  onContinue,
}: PhotovoltaicResultProps) {
  const { state, dispatch } = useConfigurator();
  const solar = calculateProjectEconomics(state).solar;
  const hasStorage = Boolean(state.results.batteryStorage);
  const flow = hasStorage ? solar?.withStorage : solar?.withoutStorage;
  const individualQuoteRequired = result.pricingMode === "individual_quote_required";

  return (
    <section aria-labelledby="photovoltaic-result-heading">
      <ConfiguratorPhaseIndicator currentPhase="configuration" compact />
      <ResultIntro
        id="photovoltaic-result-heading"
        eyebrow="Deine erste Orientierung"
        title="Deine Photovoltaik-Empfehlung"
        description="Die empfohlene Anlage und ihre modellierte Wirkung auf deinen Strombedarf. Die endgültige Größe prüfen wir anhand deines Dachs und der Gegebenheiten vor Ort."
      />

      <div className="bg-brand-navy mt-8 overflow-hidden rounded-[1.5rem] px-6 py-7 text-white sm:px-9 sm:py-9">
        <p className="text-sm font-semibold tracking-[0.14em] text-cyan-200 uppercase">
          Empfohlene Anlage
        </p>
        <p className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          {individualQuoteRequired
            ? `Größer als ${number(state.settings.photovoltaic.pricing.maxModeledSize)} kWp`
            : `${number(result.recommendedPowerKwpMin)}${result.recommendedPowerKwpMin === result.recommendedPowerKwpMax ? "" : `–${number(result.recommendedPowerKwpMax)}`} kWp`}
        </p>
        <div className="mt-8 grid gap-6 border-t border-white/20 pt-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-white/70">
              Solarinvestition{hasStorage ? " mit Stromspeicher" : ""}
            </p>
            <p className="mt-1 text-2xl font-semibold break-words sm:text-3xl">
              {solar?.investmentEuro == null
                ? individualQuoteRequired ? "Individuelles Angebot erforderlich" : "Nach technischer Prüfung"
                : euro(solar.investmentEuro)}
            </p>
          </div>
          <div>
            <p className="text-sm text-white/70">Modellierter Jahresertrag</p>
            <p className="mt-1 text-2xl font-semibold sm:text-3xl">
              {flow ? `${number(flow.generationKwh, 0)} kWh` : "Nach individueller Auslegung"}
            </p>
          </div>
        </div>
      </div>

      {individualQuoteRequired ? (
        <div className="border-brand-secondary bg-surface mt-8 border-l-4 px-5 py-6 sm:px-7">
          <h2 className="text-brand-navy text-xl font-semibold">Individuelles Angebot erforderlich</h2>
          <p className="text-foreground/70 mt-3 max-w-3xl leading-7">
            Dein Photovoltaikprojekt liegt oberhalb der Größe, die wir im Konfigurator standardisiert
            modellieren. Für diese Anlagengröße erstellen wir dir gerne eine individuelle technische
            und wirtschaftliche Auslegung.
          </p>
          <p className="text-foreground/70 mt-4 leading-7">
            {siteConfig.name} · <a className="text-brand-primary underline underline-offset-4" href={siteConfig.contact.phoneHref}>{siteConfig.contact.phoneDisplay}</a>
            {" · "}<a className="text-brand-primary underline underline-offset-4" href={siteConfig.contact.emailHref}>{siteConfig.contact.email}</a>
          </p>
          <a className="bg-brand-primary focus-visible:outline-brand-secondary mt-5 inline-flex min-h-12 items-center rounded-xl px-6 py-3 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2" href={CONTACT_FORM_HREF}>
            Individuelles Angebot anfragen
          </a>
        </div>
      ) : null}

      {solar ? (
        <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-3">
          <ResultMetric
            label="Finanzieller Vorteil im ersten Jahr"
            value={euro(solar.firstYearNetBenefitEuro)}
            note="Ersparnis und Einspeisung abzüglich modellierter Betriebskosten."
          />
          {solar.paybackStatus === "reached" && solar.paybackYears !== null ? (
            <ResultMetric label="Amortisation" value={`${number(solar.paybackYears)} Jahre`} />
          ) : null}
          {solar.irrStatus === "valid" && solar.annualizedReturnPercent !== null ? (
            <ResultMetric
              label="Modellierte Rendite p. a."
              value={percent(solar.annualizedReturnPercent, 2)}
            />
          ) : null}
        </dl>
      ) : null}

      {flow ? (
        <div className="border-brand-primary/15 mt-9 border-t pt-7">
          <h2 className="text-brand-navy text-xl font-semibold">
            Wie stehen Verbrauch und Erzeugung zueinander?
          </h2>
          <ComparisonBars
            items={[
              { label: "Jährlicher Stromverbrauch", value: flow.demandKwh, color: "#91A4C4" },
              { label: "Modellierte PV-Erzeugung", value: flow.generationKwh, color: "#0DA1D1" },
            ]}
            unit="kWh/Jahr"
          />
          <p className="text-foreground/65 mt-3 max-w-3xl text-sm leading-6">
            Erzeugung und Verbrauch fallen zeitlich nicht immer zusammen. Die persönliche
            Projektanalyse ordnet Eigenverbrauch und Netzbezug genauer ein.
          </p>
        </div>
      ) : null}

      {!result.batteryStorageRequested ? (
        <div className="bg-surface mt-9 border-l-4 border-cyan-500 px-5 py-5 sm:px-7">
          <h2 className="text-brand-navy text-lg font-semibold">
            Solarstrom auch später am Tag nutzen
          </h2>
          <p className="text-foreground/70 mt-2 max-w-3xl leading-7">
            Ein Stromspeicher kann Eigenverbrauch und Autarkie erhöhen, Netzbezug senken und
            Solarenergie in die Abendstunden verschieben. Die konkrete Wirkung wird erst mit der
            Speichergröße modelliert.
          </p>
          <button
            type="button"
            onClick={() =>
              dispatch({ type: "UPDATE_INTERESTS", payload: { batteryStorage: true } })
            }
            className="bg-brand-primary focus-visible:outline-brand-secondary mt-4 min-h-12 rounded-xl px-6 py-3 font-semibold text-white transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Stromspeicher mit berücksichtigen
          </button>
        </div>
      ) : null}

      {result.technicalReviewRecommended ? (
        <p className="border-brand-secondary text-foreground/70 mt-7 border-l-4 pl-5 leading-7">
          Dein Dach erfordert eine besonders sorgfältige technische Prüfung. Daraus folgt nicht
          automatisch, dass es ungeeignet ist.
        </p>
      ) : null}
      <ConfiguratorJourneyActions
        currentConfigurator="photovoltaic"
        nextConfigurator={nextConfigurator}
        onBack={onBack}
        onContinue={onContinue}
      />
      <p className="text-foreground/60 mt-6 text-sm leading-6">
        Unverbindliche Modellorientierung; keine technische Planung, Dachprüfung oder verbindliches
        Angebot.
      </p>
    </section>
  );
}
