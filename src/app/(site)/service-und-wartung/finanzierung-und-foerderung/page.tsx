import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { MarketingFeaturePage } from "@/app/(site)/_components/marketing-feature-page";
import { Reveal } from "@/components/marketing/reveal";
import { ArrowRightIcon } from "@/components/ui/icons";
import { PUBLIC_ROUTES } from "@/config/routes";
import {
  fundingReview,
  fundingSources,
  fundingStatusLabels,
  fundingTopics,
  type FundingSourceKey,
  type FundingStatus,
  type FundingTopic,
} from "@/content/pages/funding";
import { sprint8Pages } from "@/content/sprint8-pages";
import { buildMetadata } from "@/lib/seo/metadata";

const content = sprint8Pages.funding;

export const metadata: Metadata = buildMetadata(content.seo);

function SourceLink({ source }: { source: FundingSourceKey }) {
  const { label, href } = fundingSources[source];
  return (
    <a
      href={href}
      className="text-brand-primary decoration-brand-primary/35 hover:decoration-brand-primary inline-flex min-h-11 items-center text-xs leading-5 font-semibold underline underline-offset-4"
    >
      {label} ↗
    </a>
  );
}

function StatusBadge({ status }: { status: FundingStatus }) {
  const colors = {
    current: "border-brand-primary/20 bg-brand-primary/5 text-brand-primary",
    scheduled: "border-brand-primary/25 bg-surface-soft text-brand-dark",
    planned: "border-amber-300 bg-amber-50 text-amber-950",
    unconfirmed: "border-border-strong bg-white text-brand-dark",
  } satisfies Record<FundingStatus, string>;
  return (
    <p
      className={`inline-flex max-w-full rounded-sm border px-3 py-2 text-xs leading-5 font-bold ${colors[status]}`}
    >
      {fundingStatusLabels[status]}
    </p>
  );
}

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

function FundingOverview() {
  const types = [
    [
      "Zuschuss",
      "Ein Teil förderfähiger Kosten wird nach Bewilligung und Nachweisen übernommen. Beispiel: der geförderte Heizungstausch.",
    ],
    [
      "Förderkredit",
      "Ein Darlehen mit Programmvorgaben. Es wird zurückgezahlt; die Bank prüft Finanzierung und Kreditwürdigkeit.",
    ],
    [
      "Steuerliche Entlastung",
      "Begünstigte Anschaffung oder Einnahmen werden steuerlich entlastet. Das ist von einem Zuschuss zu unterscheiden.",
    ],
    [
      "Einspeisevergütung",
      "Vergütung für Strom, den Ihre PV-Anlage ins Netz abgibt. Sie senkt nicht unmittelbar die Anschaffungskosten.",
    ],
  ];
  return (
    <section
      id="foerderarten"
      className="section-space bg-background"
      aria-labelledby="foerderarten-heading"
    >
      <div className="section-shell">
        <div className="border-border-strong flex flex-wrap items-center justify-between gap-4 border-b pb-7">
          <p className="text-brand-dark text-sm font-semibold">
            Stand Oktober 2026 · geprüft am{" "}
            <time dateTime={fundingReview.date}>{fundingReview.label}</time>
          </p>
          <a
            href="#quellen"
            className="text-brand-primary inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4"
          >
            Primärquellen ansehen ↓
          </a>
        </div>
        <Reveal className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="eyebrow">Die Unterschiede verstehen</p>
            <h2 id="foerderarten-heading" className="section-title mt-4">
              Welche Arten von Förderung gibt es?
            </h2>
          </div>
          <p className="lead-copy self-end">
            Nicht jede Förderung ist Geld, das Sie zurückbekommen. Für eine belastbare Planung
            unterscheiden wir vier Wege – und ihren jeweiligen Zweck.
          </p>
        </Reveal>
        <dl className="mt-12 grid gap-x-12 md:grid-cols-2">
          {types.map(([title, text], index) => (
            <div key={title} className="border-border-strong border-t py-7">
              <dt className="text-brand-navy flex items-baseline gap-4 text-xl font-semibold">
                <span className="text-brand-primary text-xs font-bold">0{index + 1}</span>
                {title}
              </dt>
              <dd className="mt-3 max-w-xl text-sm leading-7 text-[var(--text-muted)] md:pl-8">
                {text}
              </dd>
            </div>
          ))}
        </dl>
        <nav
          aria-label="Themen auf dieser Seite"
          className="border-border-strong mt-8 flex flex-wrap gap-x-8 gap-y-2 border-y py-4"
        >
          {fundingTopics.map((topic) => (
            <TextLink key={topic.id} href={`#${topic.id}`}>
              {topic.id === "batteriespeicher"
                ? "Batteriespeicher"
                : topic.id === "waermepumpen"
                  ? "Wärmepumpen"
                  : "Photovoltaik"}
            </TextLink>
          ))}
          <TextLink href="#bayern">Bayern & Region</TextLink>
          <TextLink href="#finanzierung">Finanzierungswege</TextLink>
        </nav>
        <p className="mt-5 max-w-4xl text-xs leading-6 text-[var(--text-muted)]">
          Die folgenden Angaben sind eine Orientierung für neue Vorhaben. Bei bereits gestellten
          oder zugesagten Anträgen können frühere Bedingungen gelten. Verbindlich sind die
          jeweiligen Programm- und Zusagebedingungen.
        </p>
      </div>
    </section>
  );
}

function TopicSection({ topic, index }: { topic: FundingTopic; index: number }) {
  return (
    <section
      id={topic.id}
      className={`section-space ${index === 1 ? "bg-background" : "bg-surface-soft/55"}`}
      aria-labelledby={`${topic.id}-heading`}
    >
      <div className="section-shell">
        <Reveal className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className={index === 2 ? "lg:order-2" : undefined}>
            <p className="eyebrow">{topic.number} / Förderung nach Technologie</p>
            <h2 id={`${topic.id}-heading`} className="section-title mt-4">
              {topic.title}
            </h2>
            <p className="mt-6 max-w-2xl leading-8 text-[var(--text-muted)]">{topic.description}</p>
          </div>
          {topic.image ? (
            <figure className={index === 2 ? "lg:order-1" : undefined}>
              <div className="relative aspect-[3/2] overflow-hidden rounded-xl">
                <Image
                  src={topic.image.src}
                  alt={topic.image.alt}
                  fill
                  sizes="(max-width: 1023px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-xs text-[var(--text-subtle)]">
                KI-generiertes, illustratives Motiv · kein Referenzprojekt
              </figcaption>
            </figure>
          ) : (
            <div className="border-brand-primary/25 border-l-2 pl-7 lg:pl-10">
              <p className="text-brand-primary text-5xl font-semibold tracking-tight">
                2026{" "}
                <span className="text-brand-accent" aria-hidden="true">
                  /
                </span>{" "}
                2027
              </p>
              <p className="text-brand-dark mt-5 max-w-sm text-sm leading-7">
                Geltende Vergütung und geplante Reform getrennt betrachten. Das Jahr allein ist
                keine Förderzusage.
              </p>
              <SourceLink source="solar" />
            </div>
          )}
        </Reveal>
        <div className="mt-12 lg:mt-16">
          <StatusBadge status="current" />
          <dl className="mt-5 grid gap-x-12 lg:grid-cols-2">
            {topic.current.map((item) => (
              <div key={item.title} className="border-border-strong border-t py-6">
                <dt className="text-brand-navy text-lg font-semibold">{item.title}</dt>
                <dd>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{item.text}</p>
                  <SourceLink source={item.source} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className={`mt-7 grid gap-5 ${topic.outlook.length > 1 ? "lg:grid-cols-2" : ""}`}>
          {topic.outlook.map((item) => (
            <aside
              key={item.title}
              className="border-border-strong rounded-lg border bg-white p-6 md:p-8"
              aria-label={`${fundingStatusLabels[item.status]}: ${item.title}`}
            >
              <StatusBadge status={item.status} />
              <h3 className="text-brand-navy mt-5 text-xl leading-snug">{item.title}</h3>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--text-muted)]">
                {item.text}
              </p>
              <SourceLink source={item.source} />
            </aside>
          ))}
        </div>
        <div className="border-brand-primary/30 mt-8 border-l-2 pl-5">
          <h3 className="text-brand-navy text-sm font-bold">
            Worauf Sie vor dem Auftrag achten sollten
          </h3>
          <p className="mt-2 max-w-5xl text-sm leading-7 text-[var(--text-muted)]">
            {topic.attention}
          </p>
          {topic.id === "batteriespeicher" && <SourceLink source="bavaria" />}
        </div>
        <div className="mt-7 flex flex-wrap gap-x-8 gap-y-2">
          {topic.links.map((link) => (
            <TextLink key={link.href} href={link.href}>
              {link.label}
            </TextLink>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegionalFunding() {
  return (
    <section
      id="bayern"
      className="section-space brand-gradient text-white"
      aria-labelledby="bayern-heading"
    >
      <div className="section-shell grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow eyebrow-on-dark">Bayern · Berchtesgadener Land · Traunstein</p>
          <h2 id="bayern-heading" className="section-title mt-4 text-white">
            Bundesprogramme. Regional eingeordnet.
          </h2>
          <p className="mt-6 max-w-xl leading-8">
            Von Ainring aus betrachten wir Ihr Vorhaben im Berchtesgadener Land, im Landkreis
            Traunstein und der angrenzenden Region. Der Standort allein begründet keinen
            Förderanspruch.
          </p>
          <p className="mt-5 max-w-xl text-sm leading-7">
            Zusätzliche regionale oder kommunale Programme können projektbezogen geprüft werden.
            Verfügbarkeit, Antragstellerkreis und Kombinationsregeln müssen zum konkreten Projekt
            passen.
          </p>
        </Reveal>
        <Reveal delay={70}>
          <div className="border-t border-white/35 py-6">
            <h3 className="text-xl text-white">Für Unternehmen: LfA Energiekredit Regenerativ</h3>
            <p className="mt-3 text-sm leading-7">
              Der Kredit richtet sich unter anderem an Unternehmen, Freiberufler und
              Genossenschaften. Dach- oder Fassaden-PV und entsprechende Batteriespeicher können
              darunter fallen. Beantragung über die Hausbank; kein pauschaler privater
              Heimspeicher-Zuschuss.
            </p>
            <a
              href={fundingSources.lfa.href}
              className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-white underline underline-offset-4"
            >
              LfA-Programm und Voraussetzungen ↗
            </a>
          </div>
          <div className="border-t border-white/35 pt-6">
            <h3 className="text-xl text-white">Alte Speicherförderung ist beendet</h3>
            <p className="mt-3 text-sm leading-7">
              Das frühere 10.000-Häuser-Programm inklusive PV-Speicher-Programm ist abgeschlossen.
              Es ist keine aktuelle Antragsmöglichkeit.
            </p>
            <a
              href={fundingSources.bavaria.href}
              className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-white underline underline-offset-4"
            >
              Abschlussmeldung des Freistaats Bayern ↗
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Financing() {
  const steps = [
    [
      "Projekt und Kosten abgrenzen",
      "PV, Speicher und Heizung als zusammenhängendes Energiesystem planen. Angebote und förderfähige Kosten je Maßnahme getrennt erfassen.",
    ],
    [
      "Eigenmittel und Kredit abstimmen",
      "Mit Hausbank oder Finanzierungspartner Eigenmittel, Monatsbelastung, Laufzeit, Zinsbindung und Sicherheiten besprechen. KfW 270 ist ein möglicher Weg für PV und Speicher.",
    ],
    [
      "Zuschüsse und Kombinationen prüfen",
      "Für eine bereits bewilligte Heizungsmaßnahme kann KfW 358/359 als Ergänzungskredit infrage kommen. Zuschuss und Kredit sind dabei getrennte Zusagen. Kombinationsregeln und Doppelförderungsverbote prüfen.",
    ],
    [
      "Antragsweg vor Umsetzung sichern",
      "Antrag und Vertragsgestaltung richten sich nach dem Programm. Eine spätere Zuschussauszahlung bei der Liquiditätsplanung berücksichtigen. Erst auf Grundlage bestätigter Bedingungen umsetzen.",
    ],
  ];
  return (
    <section
      id="finanzierung"
      className="section-space bg-background"
      aria-labelledby="finanzierung-heading"
    >
      <div className="section-shell">
        <Reveal className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="eyebrow">Von der Idee zur Finanzierung</p>
            <h2 id="finanzierung-heading" className="section-title mt-4">
              Ein Projekt. Mehrere Wege zur Finanzierung.
            </h2>
          </div>
          <p className="lead-copy self-end">
            Ein Förderkredit ersetzt keine Finanzierungsprüfung. Entscheidend ist, welche Kosten Sie
            tragen können – auch wenn ein erwarteter Zuschuss kleiner ausfällt oder entfällt.
          </p>
        </Reveal>
        <ol className="border-border-strong mt-12 border-t">
          {steps.map(([title, text], index) => (
            <li
              key={title}
              className="border-border-strong grid gap-3 border-b py-7 md:grid-cols-[3rem_0.85fr_1.15fr] md:gap-6"
            >
              <span className="text-brand-primary text-sm font-bold">0{index + 1}</span>
              <h3 className="text-brand-navy text-xl leading-snug">{title}</h3>
              <p className="text-sm leading-7 text-[var(--text-muted)]">{text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-5 flex flex-wrap gap-x-8">
          <SourceLink source="kfw270" />
          <SourceLink source="heatingCredit" />
        </div>
        <div className="bg-surface-soft mt-10 grid gap-6 rounded-lg p-6 md:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h3 className="text-brand-navy text-xl">Mit Ihrem konkreten Vorhaben starten</h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
              Hilfreich sind Standort, Eigentums- und Nutzungssituation, geplanter Umfang und
              Zeitrahmen. Beim Heizungstausch zusätzlich: Gebäudealter sowie Art und Alter der
              bestehenden Heizung. Sensible Einkommensnachweise gehören in den vorgesehenen
              Antragsprozess.
            </p>
          </div>
          <Link href={PUBLIC_ROUTES.konfigurator.href} className="button-primary">
            Energieprojekt konfigurieren
          </Link>
        </div>
        <p className="mt-6 max-w-4xl text-xs leading-6 text-[var(--text-muted)]">
          Wir unterstützen bei der technischen Projektplanung und Einordnung möglicher Förderwege.
          Kreditentscheidung und Konditionen kommen vom Finanzierungspartner; individuelle Steuer-
          und Rechtsfragen klären Sie mit den zuständigen Fachleuten. Diese Übersicht ersetzt keine
          individuelle Finanzierungs- oder Steuerberatung.
        </p>
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
        <p className="eyebrow">Nachprüfbar planen</p>
        <h2 id="quellen-heading" className="text-brand-navy mt-4 text-2xl md:text-3xl">
          Quellen & Aktualität
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
          Geprüft am <time dateTime={fundingReview.date}>{fundingReview.label}</time>. Die Links
          führen zu den offiziellen Informationen. Vor Antragstellung den aktuellen Stand erneut
          prüfen – besonders bei den Plänen für 2027.
        </p>
        <ul className="mt-6 grid gap-x-10 md:grid-cols-2">
          {(Object.keys(fundingSources) as FundingSourceKey[]).map((source) => (
            <li key={source} className="border-border-default border-t py-1">
              <SourceLink source={source} />
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs leading-6 text-[var(--text-subtle)]">
          Die drei Fotomotive dieser Seite sind KI-generierte Illustrationen. Sie zeigen keine
          dokumentierten Energie-Kraft-Projekte.
        </p>
      </div>
    </section>
  );
}

export default function FundingPage() {
  return (
    <MarketingFeaturePage
      {...content}
      brandIntroVariant="brand"
      afterHero={
        <>
          <FundingOverview />
          {fundingTopics.map((topic, index) => (
            <TopicSection key={topic.id} topic={topic} index={index} />
          ))}
          <RegionalFunding />
          <Financing />
          <Sources />
        </>
      }
    />
  );
}
