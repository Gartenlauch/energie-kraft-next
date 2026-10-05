import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { MarketingFeaturePage } from "@/app/(site)/_components/marketing-feature-page";
import { Reveal } from "@/components/marketing/reveal";
import { ArrowRightIcon } from "@/components/ui/icons";
import { PUBLIC_ROUTES } from "@/config/routes";
import {
  electricityTariffsContent,
  gridFeeModules,
  tariffModels,
  tariffReview,
  tariffSources,
  type TariffModel,
  type TariffSourceKey,
} from "@/content/pages/stromtarife";
import { buildMetadata } from "@/lib/seo/metadata";
import { FlexibleConsumptionVisual, TariffSystemVisual } from "./_components/tariff-visuals";

export const metadata: Metadata = buildMetadata(electricityTariffsContent.seo);

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="text-brand-primary group inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
    >
      {children}
      <ArrowRightIcon className="size-4 shrink-0 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

function SourceLink({ source, dark = false }: { source: TariffSourceKey; dark?: boolean }) {
  const item = tariffSources[source];
  return (
    <a
      href={item.href}
      className={`inline-flex min-h-11 items-center text-xs leading-6 font-semibold underline underline-offset-4 ${dark ? "text-white decoration-white/50" : "text-brand-primary decoration-brand-primary/35"}`}
    >
      {item.label} ↗
    </a>
  );
}

function Introduction() {
  return (
    <section className="section-space bg-background" aria-labelledby="tarifwahl-heading">
      <div className="section-shell">
        <p className="text-xs leading-6 text-[var(--text-subtle)]">
          Hero: KI-generiertes, illustratives Motiv · kein Referenzprojekt
        </p>
        <Reveal className="mt-8 grid gap-7 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <p className="eyebrow">Technik & Tarif gemeinsam planen</p>
            <h2 id="tarifwahl-heading" className="section-title mt-4">
              Welcher Stromtarif passt zu Ihrem Energiesystem?
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-[var(--text-muted)]">
            <p>
              Wer Photovoltaik, Batteriespeicher, Wärmepumpe oder Wallbox nutzt, hat andere
              Anforderungen als ein Haushalt ohne diese Technik. Entscheidend ist, wie viel Strom
              Sie noch aus dem Netz beziehen – und zu welchen Zeiten.
            </p>
            <p>
              Festpreis, zeitvariable und dynamische Tarife bieten unterschiedliche Möglichkeiten.
              Wir betrachten Erzeugung, Verbrauch und steuerbare Geräte zusammen und helfen Ihnen,
              eine passende Tarifstruktur zu beurteilen. Die konkreten Vertragsbedingungen klären
              Sie mit Ihrem Stromlieferanten.
            </p>
          </div>
        </Reveal>
        <div className="border-border-strong mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-y py-4">
          <p className="text-brand-dark text-xs font-semibold">
            Stand Oktober 2026 · geprüft am{" "}
            <time dateTime={tariffReview.date}>{tariffReview.label}</time>
          </p>
          <TextLink href="#quellen">Offizielle Quellen</TextLink>
        </div>
      </div>
    </section>
  );
}

function EnergySystem() {
  return (
    <section
      id="energiesystem"
      className="section-space bg-background pt-0"
      aria-labelledby="energiesystem-heading"
    >
      <div className="section-shell grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">Zuerst das Zusammenspiel</p>
          <h2 id="energiesystem-heading" className="section-title mt-4">
            Eigenstrom nutzen. Netzbezug gezielt ergänzen.
          </h2>
          <p className="mt-6 leading-8 text-[var(--text-muted)]">
            Die PV-Anlage erzeugt Strom, den Ihr Haus direkt nutzen kann. Ein Speicher hält
            Überschüsse für später bereit. Wärmepumpe und Wallbox können einen Teil ihres Bedarfs
            zeitlich verschieben.
          </p>
          <p className="mt-4 leading-8 text-[var(--text-muted)]">
            Ein passendes Energiemanagement stimmt diese Möglichkeiten aufeinander ab. Der
            Stromtarif ergänzt den Bedarf, der anschließend noch aus dem Netz kommt.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6">
            <TextLink href={PUBLIC_ROUTES.photovoltaik.href}>Photovoltaik</TextLink>
            <TextLink href={PUBLIC_ROUTES.stromspeicher.href}>Stromspeicher</TextLink>
          </div>
        </Reveal>
        <TariffSystemVisual />
      </div>
    </section>
  );
}

function TariffOverview() {
  return (
    <section
      id="tarifmodelle"
      className="section-space bg-surface-soft/65"
      aria-labelledby="tarifmodelle-heading"
    >
      <div className="section-shell">
        <Reveal className="grid gap-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow">Vier Perspektiven auf Ihren Strombezug</p>
            <h2 id="tarifmodelle-heading" className="section-title mt-4">
              Die wichtigsten Tarifmodelle.
            </h2>
          </div>
          <p className="lead-copy self-end">
            Wie der Preis entsteht und für welchen Verbrauch Strom geliefert wird, sind zwei
            verschiedene Fragen. Auch Wärmepumpenstrom kann beispielsweise feste oder variable
            Preise haben.
          </p>
        </Reveal>
        <nav
          aria-label="Tarifmodelle auf dieser Seite"
          className="border-border-strong mt-10 grid gap-x-12 border-t md:grid-cols-2"
        >
          {tariffModels.map((model) => (
            <a
              key={model.id}
              href={`#${model.id}`}
              className="border-border-strong group flex min-w-0 items-center gap-4 border-b py-6"
            >
              <span className="text-brand-primary shrink-0 text-xs font-bold">{model.number}</span>
              <span className="min-w-0 flex-1">
                <span className="text-brand-navy block text-lg font-semibold">{model.title}</span>
                <span className="mt-2 block text-sm leading-6 text-[var(--text-muted)]">
                  {model.principle}
                </span>
              </span>
              <ArrowRightIcon className="text-brand-primary size-5 shrink-0 transition-transform group-hover:translate-x-1" />
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}

function StandardTariff({ model }: { model: TariffModel }) {
  return (
    <section
      id={model.id}
      className="section-space bg-background"
      aria-labelledby={`${model.id}-heading`}
    >
      <div className="section-shell grid gap-7 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">
            {model.number} / {model.principle}
          </p>
          <h2 id={`${model.id}-heading`} className="section-title mt-4">
            {model.title}
          </h2>
        </Reveal>
        <div className="min-w-0 space-y-5 leading-8 text-[var(--text-muted)]">
          {model.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="border-brand-primary/35 border-l-2 pl-5 text-sm">
            <strong className="text-brand-dark">Vor der Auswahl prüfen: </strong>
            {model.check}
          </p>
          {model.id === "waermepumpenstrom" ? (
            <TextLink href={PUBLIC_ROUTES.waermepumpen.href}>
              Wärmepumpe im Energiesystem planen
            </TextLink>
          ) : (
            <SourceLink source="tariffs" />
          )}
        </div>
      </div>
    </section>
  );
}

function DynamicTariff() {
  const model = tariffModels[2];
  return (
    <section
      id="dynamisch"
      className="section-space bg-brand-navy text-white"
      aria-labelledby="dynamisch-heading"
    >
      <div className="section-shell">
        <Reveal className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="eyebrow eyebrow-on-dark">03 / Flexibilität bewusst nutzen</p>
            <h2 id="dynamisch-heading" className="section-title mt-4 text-white">
              Dynamischer Stromtarif: Verbrauch und Preis zusammenbringen.
            </h2>
            {model.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-6 leading-8 text-white/90">
                {paragraph}
              </p>
            ))}
          </div>
          <FlexibleConsumptionVisual />
        </Reveal>
        <div className="mt-12 grid gap-8 border-t border-white/30 pt-9 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="text-xl text-white">PV + Speicher + dynamischer Tarif</h3>
            <p className="mt-4 text-sm leading-7 text-white/90">
              Tagsüber Solarstrom direkt nutzen, Überschüsse speichern und bei hohen Marktpreisen
              den Netzbezug möglichst reduzieren: Das ist eine mögliche Strategie. In günstigeren
              Marktphasen können flexible Verbraucher gezielt Netzstrom nutzen.
            </p>
            <p className="mt-4 text-sm leading-7 text-white/90">
              Netzladen des Speichers kommt nur infrage, wenn Speicher, Wechselrichter, EMS,
              Messkonzept und Tarif dies unterstützen. Speicherverluste, Alterung, Gebühren und die
              Trennung von PV- und Netzstrom bei einer späteren Einspeisung sind mitzudenken. Die
              Wirtschaftlichkeit muss für das konkrete System geprüft werden.
            </p>
          </div>
          <div>
            <h3 className="text-xl text-white">Smart Meter und Steuerung sind zwei Aufgaben</h3>
            <p className="mt-4 text-sm leading-7 text-white/90">
              Für den dynamischen Tarif ist ein intelligentes Messsystem einzuplanen. Es verbindet
              die Messeinrichtung mit einem Smart-Meter-Gateway; ein digitaler Zähler allein ist
              noch kein intelligentes Messsystem. Das EMS übernimmt dagegen die Abstimmung
              geeigneter Verbraucher.
            </p>
            <p className="mt-4 text-sm leading-7 text-white/90">
              Seit 1. Januar 2025 müssen alle Stromlieferanten Kunden mit intelligentem Messsystem
              einen dynamischen Tarif anbieten. Sie müssen einen solchen Tarif nicht wählen. Vor dem
              Wechsel sind Messkosten, Preisbildung, Risiken und technische Kompatibilität zu
              klären.
            </p>
            <SourceLink source="tariffs" dark />
            <br />
            <SourceLink source="metering" dark />
          </div>
        </div>
      </div>
    </section>
  );
}

function GridFees() {
  return (
    <section
      id="netzentgelt"
      className="section-space bg-surface-soft/65"
      aria-labelledby="netzentgelt-heading"
    >
      <div className="section-shell">
        <Reveal className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="eyebrow">§ 14a EnWG / eine eigene Ebene</p>
            <h2 id="netzentgelt-heading" className="section-title mt-4">
              Stromtarif und Netzentgelt gemeinsam betrachten.
            </h2>
          </div>
          <div className="leading-8 text-[var(--text-muted)]">
            <p>
              <strong className="text-brand-navy">§ 14a ist kein Stromtarif.</strong> Die Regelung
              verbindet die netzorientierte Steuerung bestimmter Geräte mit reduzierten
              Netzentgelten. Bei drohender Netzüberlastung darf der Netzbetreiber deren Netzbezug
              zeitweise begrenzen. Der normale Haushaltsverbrauch ist davon nicht betroffen.
            </p>
            <p className="mt-4">
              Die neuen Regeln betreffen grundsätzlich seit 1. Januar 2024 in Betrieb genommene
              steuerbare Geräte mit mehr als 4,2 kW Netzanschlussleistung: etwa private Wallboxen,
              Wärmepumpen und Speicher hinsichtlich ihres Netzladens. Für Bestandsanlagen und die
              Zusammenfassung kleinerer Wärmepumpen gelten besondere Vorgaben.
            </p>
            <SourceLink source="controllable" />
          </div>
        </Reveal>
        <dl className="border-brand-primary/30 mt-10 grid border-y md:grid-cols-2">
          <div className="py-7 md:pr-10">
            <dt className="text-brand-primary text-xl font-semibold">Stromtarif</dt>
            <dd className="mt-3 max-w-lg text-sm leading-7">
              Das Preis- und Vertragsmodell Ihres Stromlieferanten. Es legt unter anderem fest, ob
              der Energiepreis fest, zeitvariabel oder dynamisch ist.
            </dd>
          </div>
          <div className="border-brand-primary/30 border-t py-7 md:border-t-0 md:border-l md:pl-10">
            <dt className="text-brand-primary text-xl font-semibold">Netzentgelt</dt>
            <dd className="mt-3 max-w-lg text-sm leading-7">
              Die Kosten für die Nutzung des Stromnetzes. Sie sind üblicherweise Teil der
              Stromrechnung und können unter den §-14a-Voraussetzungen reduziert werden.
            </dd>
          </div>
        </dl>
        <div className="mt-10 grid gap-x-10 lg:grid-cols-3">
          {gridFeeModules.map((module) => (
            <div key={module.title} className="border-border-strong border-t py-7">
              <p className="text-brand-primary text-xs font-bold">{module.title}</p>
              <h3 className="text-brand-navy mt-3 text-xl">{module.subtitle}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">{module.text}</p>
              <p className="text-brand-dark mt-4 text-xs leading-6 font-semibold">
                {module.condition}
              </p>
            </div>
          ))}
        </div>
        <p className="max-w-4xl text-sm leading-7 text-[var(--text-muted)]">
          Ein günstiger Börsenpreis und ein günstiges Netzentgelt-Zeitfenster müssen nicht
          zusammenfallen. Entscheidend sind die gesamten Bezugskosten. Prüfen Sie außerdem, wie Ihr
          Liefervertrag die Netzentgeltreduzierung an Sie weitergibt; die Weitergabe ist nicht
          allein durch die Modulauswahl garantiert.
        </p>
        <SourceLink source="gridFees" />
      </div>
    </section>
  );
}

function ModelComparison() {
  return (
    <section
      id="entscheidungshilfe"
      className="section-space bg-background"
      aria-labelledby="entscheidungshilfe-heading"
    >
      <div className="section-shell">
        <Reveal>
          <p className="eyebrow">Die Anforderungen entscheiden</p>
          <h2 id="entscheidungshilfe-heading" className="section-title mt-4 max-w-4xl">
            Welches Modell passt zu welchem Energiesystem?
          </h2>
          <p className="mt-6 max-w-3xl leading-8 text-[var(--text-muted)]">
            Der passende Ansatz hängt vom verbleibenden Netzbezug, vom Zeitpunkt des Verbrauchs und
            von Ihrer Bereitschaft zur Steuerung ab. Diese Übersicht ist eine Orientierung für die
            gemeinsame Planung.
          </p>
        </Reveal>
        <dl className="border-border-strong mt-10 border-t">
          {tariffModels.map((model) => (
            <div
              key={model.id}
              className="border-border-strong grid min-w-0 gap-3 border-b py-6 md:grid-cols-[0.7fr_1.3fr] md:gap-10"
            >
              <dt>
                <TextLink href={`#${model.id}`}>{model.title}</TextLink>
              </dt>
              <dd>
                <p className="text-brand-dark text-sm leading-7 font-medium">{model.fit}</p>
                <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">
                  Zu prüfen: {model.check}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function SharedSolar() {
  return (
    <section
      id="energy-sharing"
      className="section-space bg-surface-soft/65"
      aria-labelledby="energy-sharing-heading"
    >
      <div className="section-shell">
        <Reveal className="grid gap-7 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="eyebrow">Neue Möglichkeiten / § 42c EnWG</p>
            <h2 id="energy-sharing-heading" className="section-title mt-4">
              Solarstrom gemeinsam nutzen: Energy Sharing.
            </h2>
          </div>
          <div className="space-y-5 leading-8 text-[var(--text-muted)]">
            <p>
              Energy Sharing ermöglicht unter gesetzlichen Voraussetzungen, erneuerbaren Strom mit
              weiteren Teilnehmern zu teilen. Anders als beim Eigenverbrauch im Haus wird dafür das
              öffentliche Verteilnetz genutzt. Der Anlagenbetrieb darf dabei nicht überwiegend einer
              gewerblichen oder selbstständigen beruflichen Tätigkeit dienen.
            </p>
            <p>
              Seit 1. Juni 2026 müssen Verteilnetzbetreiber die gemeinsame Nutzung innerhalb ihres
              Bilanzierungsgebiets ermöglichen. Ab 1. Juni 2028 kommt die gesetzliche Erweiterung
              auf angrenzende Bilanzierungsgebiete in derselben Regelzone hinzu. Eine gemeinsame
              Postleitzahl allein ist deshalb kein ausreichendes Kriterium.
            </p>
            <SourceLink source="sharingImplementation" />
          </div>
        </Reveal>
        <dl className="mt-10 grid gap-x-12 md:grid-cols-2">
          <div className="border-border-strong border-t py-6">
            <dt className="text-brand-navy text-lg font-semibold">
              Messung, Verträge & Abrechnung
            </dt>
            <dd className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
              Viertelstündliche Messwerte, ein vereinbarter Aufteilungsschlüssel und eine geregelte
              Bilanzierung sind nötig. Ein geeigneter Dienstleister kann Direktvermarktung und
              Abwicklung übernehmen. Das ist organisatorisch mehr als das Weiterreichen von
              PV-Überschüssen.
            </dd>
          </div>
          <div className="border-border-strong border-t py-6">
            <dt className="text-brand-navy text-lg font-semibold">Reststrom bleibt notwendig</dt>
            <dd className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
              Zur Sharing-Vereinbarung kommt ein ergänzender Stromliefervertrag. Die geteilte
              Erzeugung deckt den Bedarf nicht jederzeit. Für den Netzbezug fallen weiterhin die
              üblichen Netzentgelte und Umlagen nach den geltenden Vorgaben an.
            </dd>
          </div>
        </dl>
        <p className="max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
          Ob Energy Sharing für Ihr Projekt technisch und organisatorisch sinnvoll ist, prüfen wir
          im jeweiligen Projektkontext. Verfügbarkeit und Bedingungen geeigneter Marktpartner
          gehören zu dieser Prüfung.
        </p>
        <SourceLink source="sharing" />
        <aside
          className="border-border-strong mt-10 grid gap-5 border-t pt-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16"
          aria-labelledby="gebaeudeversorgung-heading"
        >
          <div>
            <p className="eyebrow">Im selben Gebäude / § 42b EnWG</p>
            <h3
              id="gebaeudeversorgung-heading"
              className="text-brand-navy mt-4 text-2xl leading-snug"
            >
              Gemeinschaftliche Gebäudeversorgung
            </h3>
          </div>
          <div>
            <p className="text-sm leading-7 text-[var(--text-muted)]">
              In Mehrfamilienhäusern, WEG oder gemischt genutzten Immobilien kann PV-Strom von
              mehreren Teilnehmern im selben Gebäude oder dessen Nebenanlage genutzt werden – ohne
              Durchleitung durch das öffentliche Netz. Erforderlich sind unter anderem
              viertelstündliche Verbrauchsmessung und eine geregelte Aufteilung. Für den ergänzenden
              Reststrom bleibt die Wahl des Lieferanten frei. Damit unterscheidet sich dieses Modell
              vom Energy Sharing über das Netz.
            </p>
            <SourceLink source="building" />
          </div>
        </aside>
      </div>
    </section>
  );
}

function ProjectAdvice() {
  return (
    <section className="section-space bg-background" aria-labelledby="beratung-heading">
      <div className="section-shell grid gap-8 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="eyebrow">Energie-Kraft Süd / Ainring</p>
          <h2 id="beratung-heading" className="section-title mt-4">
            Ihr Projekt als Ganzes betrachten.
          </h2>
          <p className="mt-6 leading-8 text-[var(--text-muted)]">
            Für Energieprojekte im Berchtesgadener Land und im Landkreis Traunstein in Bayern
            betrachten wir PV, Speicher, Wärmepumpe und Wallbox zusammen mit Verbrauchsprofil,
            Netzbezug, Messkonzept, Tarif und Netzentgelt.
          </p>
          <p className="mt-4 leading-8 text-[var(--text-muted)]">
            Hilfreich für das Gespräch sind Ihr Jahresstromverbrauch, vorhandene Anlagendaten und
            die Zeiten, zu denen Sie heizen oder Ihr Auto laden. Daraus lässt sich beurteilen,
            welche Flexibilität Ihr System tatsächlich bietet.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6">
            <TextLink href={PUBLIC_ROUTES.konfigurator.href}>Energieprojekt konfigurieren</TextLink>
            <TextLink href={PUBLIC_ROUTES.wallbox.href}>Wallbox & PV-Laden</TextLink>
          </div>
        </Reveal>
        <div className="border-brand-primary/25 border-l-2 pl-6 md:pl-9">
          <h3 className="text-brand-navy text-xl">Technik, Umsetzung und weitere Fragen</h3>
          <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
            Wir unterstützen bei der technischen Einordnung. Konkrete Lieferverträge, Konditionen
            und die energiewirtschaftliche Abwicklung liegen bei den jeweiligen Anbietern.
          </p>
          <TextLink href={PUBLIC_ROUTES["finanzierung-und-foerderung"].href}>
            Finanzierung & Förderung
          </TextLink>
          <p className="mt-7 text-sm leading-7 text-[var(--text-muted)]">
            Weitere Antworten zu Photovoltaik, Speichern und Wärmepumpen finden Sie in unserem
            zentralen FAQ-Bereich.
          </p>
          <TextLink href="/faq">Zum FAQ-Bereich</TextLink>
        </div>
      </div>
    </section>
  );
}

function Sources() {
  return (
    <section
      id="quellen"
      className="bg-surface-soft/60 py-12 md:py-16"
      aria-labelledby="quellen-heading"
    >
      <div className="section-shell">
        <p className="eyebrow">Offizielle Grundlagen</p>
        <h2 id="quellen-heading" className="text-brand-navy mt-4 text-2xl md:text-3xl">
          Quellen & Aktualität
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
          Geprüft am <time dateTime={tariffReview.date}>{tariffReview.label}</time>. Für die
          Umsetzung sind der aktuelle Rechtsstand, das Messkonzept und die Bedingungen von
          Lieferant, Messstellen- und Netzbetreiber maßgeblich.
        </p>
        <ul className="mt-6 grid gap-x-10 md:grid-cols-2">
          {(Object.keys(tariffSources) as TariffSourceKey[]).map((source) => (
            <li key={source} className="border-border-default border-t py-1">
              <SourceLink source={source} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function ElectricityTariffsPage() {
  return (
    <MarketingFeaturePage
      {...electricityTariffsContent}
      afterHero={
        <>
          <Introduction />
          <EnergySystem />
          <TariffOverview />
          <StandardTariff model={tariffModels[0]} />
          <StandardTariff model={tariffModels[1]} />
          <DynamicTariff />
          <StandardTariff model={tariffModels[3]} />
          <GridFees />
          <ModelComparison />
          <SharedSolar />
          <ProjectAdvice />
          <Sources />
        </>
      }
    />
  );
}
