import type { Metadata } from "next";
import Link from "next/link";

import { MarketingFeaturePage } from "@/app/(site)/_components/marketing-feature-page";
import { Reveal } from "@/components/marketing/reveal";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import { CONTACT_FORM_HREF } from "@/config/routes";
import { buildMetadata } from "@/lib/seo/metadata";

const seo = {
  title: "Service & Wartung für Energieanlagen | Energie-Kraft Süd",
  description:
    "Service und Wartung für Photovoltaik, Speicher, Wärmepumpen und Klimaanlagen: Anlagencheck, Monitoring und technische Betreuung durch Energie-Kraft Süd.",
  canonicalPath: "/service-und-wartung",
};

export const metadata: Metadata = buildMetadata(seo);

const systems = [
  {
    title: "Photovoltaik-Service",
    description:
      "Bei Photovoltaikanlagen unterstützen wir bei technischen Auffälligkeiten, Ertragsabweichungen, Wartungsbedarf und Fragen zum Anlagenbetrieb. Betriebsdaten, Monitoring und sichtbare Komponenten helfen dabei, mögliche Ursachen einzugrenzen. Verschmutzung, Standort, Dachneigung und Zugänglichkeit unterscheiden sich von Anlage zu Anlage. Deshalb empfehlen wir keine pauschale regelmäßige Reinigung, sondern beurteilen zunächst, ob sie technisch und wirtschaftlich sinnvoll ist.",
    items: [
      "Sichtprüfung und Anlagenzustand",
      "Monitoring und Ertragskontrolle",
      "Ertragsauffälligkeiten einordnen",
      "Photovoltaik-Anlagencheck",
      "Fehler- und Störungseinordnung",
      "Wechselrichter und elektrische Komponenten",
      "PV-Wartung und Instandhaltung",
      "Bedarfsgerechte Reinigung",
      "Reparatur und Störungsbeseitigung je nach System",
    ],
    link: { label: "Photovoltaik", href: "/photovoltaik" },
  },
  {
    title: "Service für Batteriespeicher",
    description:
      "Bei Speichersystemen können Fehlermeldungen, Ladezustand, Kommunikation und das Zusammenspiel mit Photovoltaik und Energiemanagement relevante Hinweise liefern. Wir prüfen zunächst die Ausgangslage und stimmen die weitere Betreuung auf das vorhandene System ab.",
    items: [
      "Speicherstatus und Fehlermeldungen",
      "Kommunikation und Monitoring",
      "Zusammenspiel mit Photovoltaik",
      "Energiemanagement",
      "Systemerweiterungen",
      "Technische Betreuung nach Einordnung",
    ],
    link: { label: "Stromspeicher", href: "/stromspeicher" },
  },
  {
    title: "Service rund um die Wärmepumpe",
    description:
      "Bei den von uns geplanten Bosch-Wärmepumpensystemen begleiten wir auch Fragen nach der Inbetriebnahme. Je nach Anliegen koordinieren wir technische Prüfung, Wartung und erforderliche Arbeiten gemeinsam mit qualifizierten Fach- und Montagepartnern.",
    items: [
      "Betriebsauffälligkeiten einordnen",
      "Einstellungen und Systemzusammenhang prüfen",
      "Wartungsbedarf abstimmen",
      "Schnittstellen zu PV und Speicher berücksichtigen",
      "Fachpartner bei erforderlichen Arbeiten koordinieren",
    ],
    link: { label: "Wärmepumpen", href: "/waermepumpen" },
  },
  {
    title: "Service & Wartung für Klimaanlagen",
    description:
      "Auch bei Klimaanlagen unterstützen wir nach der Inbetriebnahme bei Fragen zu Betrieb, Pflege und Wartung. Filter, Innen- und Außeneinheit, Kondensatführung und Anlagenfunktion gehören je nach System zu den relevanten Prüfpunkten. Erforderliche Wartungs- oder Facharbeiten stimmen wir passend zum installierten System ab und koordinieren sie bei Bedarf gemeinsam mit qualifizierten Fach- und Montagepartnern.",
    items: [
      "Filter und luftführende Komponenten",
      "Innen- und Außeneinheit",
      "Kondensatablauf",
      "Anlagenfunktion",
      "Auffällige Betriebsgeräusche",
      "Nachlassende Kühl- oder Heizleistung",
    ],
    link: { label: "Klimaanlagen", href: "/klimaanlagen" },
  },
] as const;

function ServiceSystemsSection() {
  return (
    <section
      id="service-systeme"
      className="section-space bg-background"
      aria-labelledby="service-systeme-heading"
    >
      <div className="section-shell">
        <Reveal className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="eyebrow">Service für Ihr Energiesystem</p>
            <h2 id="service-systeme-heading" className="section-title mt-4">
              Photovoltaik, Speicher, Wärmepumpe und Klima gezielt betreuen
            </h2>
          </div>
          <p className="lead-copy self-end">
            Jedes System hat eigene Komponenten und Betriebsdaten. Wir betrachten die konkrete
            Anlage und ordnen den passenden Service danach ein.
          </p>
        </Reveal>
        <div className="border-border-strong mt-12 border-t lg:mt-16">
          {systems.map((system, index) => (
            <article
              key={system.title}
              className="border-border-strong grid gap-7 border-b py-10 md:py-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:py-16"
            >
              <Reveal>
                <p className="text-brand-primary text-sm font-bold tracking-[0.16em]">
                  0{index + 1} / 04
                </p>
                <h3 className="text-brand-navy mt-5 max-w-lg text-[clamp(1.65rem,2.8vw,2.6rem)] leading-tight font-semibold">
                  {system.title}
                </h3>
                <p className="mt-5 max-w-xl leading-8 text-[var(--text-muted)]">
                  {system.description}
                </p>
                <Link
                  href={system.link.href}
                  className="text-brand-primary group mt-5 inline-flex min-h-11 items-center gap-2 font-semibold underline-offset-4 hover:underline"
                >
                  {system.link.label}
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1" />
                </Link>
              </Reveal>
              <Reveal delay={80} className="lg:pt-10">
                <ul className="grid gap-x-8 sm:grid-cols-2">
                  {system.items.map((item) => (
                    <li
                      key={item}
                      className="border-border-default text-brand-dark flex items-start gap-3 border-t py-4 text-sm leading-6"
                    >
                      <CheckIcon className="text-brand-primary mt-1 size-4 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceProcessSection() {
  const steps = [
    "Anlage und Anliegen beschreiben",
    "Fehlermeldungen, Fotos oder Monitoring-Daten bereitstellen",
    "Nächsten sinnvollen Prüfschritt gemeinsam abstimmen",
  ];
  return (
    <section
      id="serviceablauf"
      className="section-space bg-background"
      aria-labelledby="serviceablauf-heading"
    >
      <div className="section-shell">
        <Reveal>
          <p className="eyebrow">So helfen Sie uns bei der Vorbereitung</p>
          <h2 id="serviceablauf-heading" className="section-title mt-4 max-w-4xl">
            Mit den richtigen Informationen schneller zur technischen Einordnung
          </h2>
        </Reveal>
        <ol className="border-border-strong mt-12 grid border-y md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step}
              className="border-border-strong py-8 md:border-l md:px-8 md:first:border-l-0"
            >
              <Reveal delay={index * 70}>
                <span className="text-brand-primary text-sm font-bold">0{index + 1}</span>
                <h3 className="mt-5 text-xl leading-snug">{step}</h3>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const sections = [
  {
    id: "service-begleitung",
    eyebrow: "Auch nach der Inbetriebnahme",
    title: "Service gehört für uns zum Energiesystem dazu",
    layout: "statement",
    paragraphs: [
      "Mit der Inbetriebnahme endet ein Energieprojekt nicht. Anlagen werden genutzt, erweitert und technisch weiterentwickelt. Bei Fragen, Auffälligkeiten oder Wartungsbedarf unterstützen wir dabei, die Situation strukturiert einzuordnen und die nächsten sinnvollen Schritte festzulegen.",
      "Welche Betreuung erforderlich ist, hängt von der installierten Technik, dem konkreten Anliegen und dem vereinbarten Serviceumfang ab. Deshalb arbeiten wir nicht mit pauschalen Wartungs- oder Reparaturversprechen, sondern betrachten das jeweilige System.",
    ],
    items: [
      "Persönliche Ansprechpartner",
      "Strukturierte Aufnahme des Anliegens",
      "Technische Einordnung",
      "Abgestimmte nächste Schritte",
      "Langfristige Betreuung",
    ],
  },
  {
    id: "service-systeme",
    eyebrow: "Service für Ihr Energiesystem",
    title: "Photovoltaik, Speicher, Wärmepumpe und Klima gezielt betreuen",
    paragraphs: [],
  },
  {
    id: "ladeinfrastruktur",
    eyebrow: "Weitere Energiekomponenten",
    title: "Auch Ladeinfrastruktur gehört zum Gesamtsystem",
    surface: "soft",
    paragraphs: [
      "Bei Wallboxen und Ladeinfrastruktur können Kommunikation, Lastmanagement, Photovoltaik-Einbindung und das Zusammenspiel mit weiteren Energiekomponenten Teil der technischen Einordnung sein.",
    ],
    links: [{ label: "Wallbox", href: "/wallbox" }],
  },
  {
    id: "anlagencheck-monitoring",
    eyebrow: "Anlagencheck",
    title: "Auffälligkeiten strukturiert aufnehmen und gezielt prüfen",
    paragraphs: [
      "Bei Fehlermeldungen, ungewöhnlichem Anlagenverhalten oder auffälligen Ertrags- und Verbrauchsdaten hilft eine strukturierte Aufnahme der Ausgangslage. Je genauer die Informationen sind, desto gezielter lässt sich der nächste Prüfschritt vorbereiten.",
      "Hilfreich sind insbesondere der genaue Meldungstext, Zeitpunkt und Häufigkeit einer Auffälligkeit, vorhandene Monitoring-Verläufe sowie Anlagendokumentation und Fotos.",
    ],
    items: [
      "Anlage und betroffenes System benennen",
      "Fehlermeldung dokumentieren",
      "Zeitpunkt und Häufigkeit festhalten",
      "Monitoring-Daten bereitstellen",
      "Fotos und Dokumentation ergänzen",
      "Nächste Prüfschritte abstimmen",
    ],
  },
  {
    id: "monitoring",
    eyebrow: "Anlagen im Blick behalten",
    title: "Monitoring unterstützt die frühzeitige Einordnung von Auffälligkeiten",
    surface: "blue",
    paragraphs: [
      "Bei entsprechend angebundenen Anlagen können Betriebs- und Ertragsdaten dabei helfen, Abweichungen frühzeitig zu erkennen und technische Auffälligkeiten einzuordnen.",
      "Für gewerbliche Photovoltaikanlagen kann – abhängig vom vereinbarten Serviceumfang – auch eine laufende Anlagenüberwachung über unsere Leitstelle Bestandteil der Betreuung sein.",
    ],
  },
  {
    id: "wartung",
    eyebrow: "Wartung nach System und Bedarf",
    title: "Nicht jede Anlage benötigt dieselben Wartungsschritte",
    paragraphs: [
      "Wartungsbedarf unterscheidet sich je nach Technik, Hersteller, Einsatzbedingungen und Nutzung. Deshalb orientieren sich Umfang und Intervalle an der konkreten Anlage und den jeweiligen Herstellervorgaben.",
      "Bei Photovoltaik, Batteriespeicher, Wärmepumpe und Klimaanlage stehen jeweils andere Komponenten und Prüfpunkte im Vordergrund. Entscheidend ist eine fachlich passende Betreuung statt eines pauschalen Standardprogramms.",
    ],
    items: [
      "Herstellervorgaben berücksichtigen",
      "Anlagenzustand bewerten",
      "Technische Funktionen prüfen",
      "Verschmutzung und Zugänglichkeit einordnen",
      "Auffälligkeiten dokumentieren",
      "Nächste Schritte transparent abstimmen",
    ],
  },
  {
    id: "serviceablauf",
    eyebrow: "So helfen Sie uns bei der Vorbereitung",
    title: "Mit den richtigen Informationen schneller zur technischen Einordnung",
    paragraphs: [],
  },
  {
    id: "service-team",
    eyebrow: "Persönliche Ansprechpartner",
    title: "Ihr Anliegen kommt in den passenden Fachbereich",
    surface: "soft",
    paragraphs: [
      "Technische Fragen, Wartungsbedarf und organisatorische Anliegen benötigen unterschiedliche Kompetenzen. Unser Service-Team ordnet die Anfrage ein und stimmt die nächsten Schritte mit den beteiligten Fachbereichen und – wenn erforderlich – externen Fachpartnern ab.",
    ],
    links: [
      { label: "Service & Team kennenlernen", href: "/service-und-wartung/service-und-team" },
    ],
  },
  {
    id: "region",
    eyebrow: "Energie-Kraft Süd",
    title: "Service aus Ainring für Ihre Energietechnik",
    paragraphs: [
      "Energie-Kraft Süd besteht seit über 20 Jahren. Von Ainring bei Freilassing aus betreuen wir Energieprojekte und Anlagen im Berchtesgadener Land, im Landkreis Traunstein und der angrenzenden Region.",
      "Unser Ziel ist nicht nur eine funktionierende Inbetriebnahme, sondern auch ein klarer Ansprechpartner für Fragen, Erweiterungen und technische Betreuung im weiteren Anlagenbetrieb.",
    ],
  },
] as const;

export default function ServicePage() {
  return (
    <MarketingFeaturePage
      brandIntroVariant="brand"
      seo={seo}
      breadcrumbLabel="Service & Wartung"
      eyebrow="Service & Wartung"
      title="Damit Ihre Energietechnik zuverlässig weiterarbeitet"
      description="Wir unterstützen Sie bei Anlagenchecks, Wartung, Monitoring und technischen Auffälligkeiten – für Photovoltaik, Stromspeicher, Wärmepumpen und Klimaanlagen. Persönlich koordiniert von Energie-Kraft Süd aus Ainring."
      desktopSrc="/images/service/service-solar-legacy-desktop.webp"
      mobileSrc="/images/service/service-solar-legacy-mobile.webp"
      desktopWidth={1800}
      desktopHeight={1000}
      imageAlt="Photovoltaikanlage im Abendlicht als Teil eines betreuten Energiesystems"
      sections={sections}
      sectionOverrides={{
        "service-systeme": <ServiceSystemsSection />,
        serviceablauf: <ServiceProcessSection />,
      }}
      ctaTitle="Sie haben eine Servicefrage zu Ihrer Anlage?"
      ctaLabel="Serviceanfrage stellen"
      ctaHref={CONTACT_FORM_HREF}
    />
  );
}
