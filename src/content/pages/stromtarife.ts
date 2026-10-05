import { CONTACT_FORM_HREF, PUBLIC_ROUTES } from "@/config/routes";
import type { Sprint8PageContent } from "@/content/sprint8-pages";

// Editorial snapshot: update only after a new review of the primary sources.
export const tariffReview = { date: "2026-10-05", label: "5. Oktober 2026" } as const;

export const tariffSources = {
  tariffs: {
    label: "§ 41a EnWG: Tarifmodelle und Angebotspflichten",
    href: "https://www.gesetze-im-internet.de/enwg_2005/__41a.html",
  },
  metering: {
    label: "§ 2 MsbG: intelligentes Messsystem",
    href: "https://www.gesetze-im-internet.de/messbg/__2.html",
  },
  controllable: {
    label: "Bundesnetzagentur: steuerbare Verbrauchseinrichtungen",
    href: "https://www.bundesnetzagentur.de/DE/Vportal/Energie/SteuerbareVBE/BetroffeneAnlagen_table.html",
  },
  gridFees: {
    label: "Bundesnetzagentur: Netzentgelt-Module",
    href: "https://www.bundesnetzagentur.de/DE/Vportal/Energie/SteuerbareVBE/Netzentgelt_table.html",
  },
  sharing: {
    label: "Bundesnetzagentur: Energy Sharing nach § 42c EnWG",
    href: "https://www.bundesnetzagentur.de/DE/Vportal/Energie/Energy_Sharing/start.html",
  },
  sharingLaw: {
    label: "§ 42c EnWG: gesetzliche Voraussetzungen für Energy Sharing",
    href: "https://www.gesetze-im-internet.de/enwg_2005/__42c.html",
  },
  sharingImplementation: {
    label: "Bundesnetzagentur: Umsetzung von Energy Sharing, Mitteilung Nr. 73",
    href: "https://www.bundesnetzagentur.de/DE/Beschlusskammern/BK06/BK6_81_GPKE_GeLi/Mitteilung_Nr_73/MitteilungNr73.html",
  },
  building: {
    label: "§ 42b EnWG: gemeinschaftliche Gebäudeversorgung",
    href: "https://www.gesetze-im-internet.de/enwg_2005/__42b.html",
  },
} as const;

export type TariffSourceKey = keyof typeof tariffSources;

export interface TariffModel {
  id: string;
  number: string;
  title: string;
  principle: string;
  fit: string;
  check: string;
  paragraphs: readonly string[];
}

export const tariffModels = [
  {
    id: "festpreis",
    number: "01",
    title: "Festpreistarif",
    principle: "Planbarkeit für den Reststrom",
    fit: "Wenn Sie Ihren Netzbezug kalkulieren möchten und keine laufende Preisoptimierung wünschen.",
    check: "Umfang der Preisgarantie, Laufzeit, Grundpreis und verbleibender Netzbezug.",
    paragraphs: [
      "Ein klassischer Festpreistarif bietet einen weitgehend planbaren Strompreis für einen vereinbarten Zeitraum. Welche Bestandteile die Preisgarantie umfasst, steht im Vertrag; Netzentgelte, Steuern oder Umlagen können davon ausgenommen sein.",
      "Auch mit Photovoltaik brauchen Sie normalerweise noch Netzstrom: nachts, im Winter oder bei geringer Erzeugung. Ein Speicher kann diesen Bedarf verringern und zeitlich verschieben, ersetzt den Netzbezug aber nicht automatisch vollständig.",
    ],
  },
  {
    id: "zeitvariabel",
    number: "02",
    title: "Zeitvariabler Stromtarif",
    principle: "Verbrauch nach festen Zeitfenstern planen",
    fit: "Wenn sich Laden, Heizen oder andere Verbräuche in vorab bekannte Zeitfenster verschieben lassen.",
    check: "Zeitfenster, Messanforderungen und die tatsächlich verschiebbare Strommenge.",
    paragraphs: [
      "Tageszeitabhängige Tarife unterscheiden zwischen vorher festgelegten Preiszeiten. Der Preis folgt damit einem vereinbarten Zeitplan und nicht jeder kurzfristigen Bewegung am Strommarkt.",
      "Das kann eine überschaubare Zwischenlösung zwischen Festpreis und dynamischem Tarif sein. Wallbox, Wärmepumpe oder ein technisch geeigneter Speicher können solche Zeitfenster nutzen – soweit Alltag, Komfort und Betrieb es erlauben.",
    ],
  },
  {
    id: "dynamisch",
    number: "03",
    title: "Dynamischer Stromtarif",
    principle: "Flexibilität am Strommarkt nutzen",
    fit: "Wenn flexible Verbraucher, ein geeigneter Speicher und Energiemanagement den Netzbezug gezielt verschieben können.",
    check: "Intelligentes Messsystem, Preisrisiko, Gebühren und kompatible Steuerung.",
    paragraphs: [
      "Bei einem dynamischen Stromtarif folgt der Energiepreis dem kurzfristigen Strommarkt, dem Spotmarkt. Preise verändern sich im Tagesverlauf, je nach Vertrag beispielsweise viertelstündlich. Zum Marktpreis kommen weitere Preisbestandteile und mögliche Anbietergebühren hinzu.",
      "Ein Vorteil kann entstehen, wenn Sie Netzstrom gezielt in günstigeren Zeitfenstern beziehen. Wer viel Strom während hoher Marktpreise benötigt und wenig verschieben kann, kann dagegen höhere Kosten haben. Ein dynamischer Tarif ist deshalb nicht automatisch günstiger.",
    ],
  },
  {
    id: "waermepumpenstrom",
    number: "04",
    title: "Wärmepumpen-Stromtarif",
    principle: "Liefermodell und Messkonzept abstimmen",
    fit: "Wenn der Wärmepumpenverbrauch und das passende Messkonzept ein separates Liefermodell sinnvoll machen können.",
    check: "PV-Eigenverbrauch, zusätzlicher Zähler, Grund- und Messkosten sowie § 14a.",
    paragraphs: [
      "Für Wärmepumpen bieten Lieferanten spezielle Stromtarife an. Die Wärmepumpe kann je nach Messkonzept gemeinsam mit dem Haushalt oder separat gemessen werden. Ein eigenes Liefermodell ist keine Voraussetzung für den Betrieb jeder Wärmepumpe.",
      "Ein separater Wärmepumpentarif ist nicht automatisch günstiger. Entscheidend sind Verbrauch, Strompreis, Netzentgelt, zusätzliche Grund- und Messkosten und die Frage, wie der eigene Solarstrom für die Wärmepumpe nutzbar bleibt. Wir stimmen deshalb Messkonzept, PV und Heizung gemeinsam ab.",
    ],
  },
] as const satisfies readonly TariffModel[];

export const gridFeeModules = [
  {
    title: "Modul 1",
    subtitle: "Pauschale Entlastung",
    text: "Pauschale Netzentgeltreduzierung je Marktlokation. Ein separater Zähler für das steuerbare Gerät ist hierfür nicht erforderlich. Die konkrete Pauschale richtet sich nach dem Netzgebiet.",
    condition: "Grundmodul, wenn keine andere Auswahl erfolgt.",
  },
  {
    title: "Modul 2",
    subtitle: "Reduzierter Arbeitspreis",
    text: "Der Netzentgelt-Arbeitspreis wird auf 40 % reduziert. Das betrifft nicht den gesamten Strompreis. Ein separater Zähler für den steuerbaren Verbrauch ist erforderlich; hier fällt kein Netzentgelt-Grundpreis an.",
    condition: "Alternative zu Modul 1; nicht mit Modul 3 kombinierbar.",
  },
  {
    title: "Modul 3",
    subtitle: "Zeitvariable Netzentgelte",
    text: "Seit April 2025 als Ergänzung zu Modul 1 wählbar. Der Netzbetreiber legt Zeitfenster mit drei Preisstufen fest. Ein intelligentes Messsystem und eine Marktlokation ohne registrierende Leistungsmessung sind erforderlich.",
    condition: "Nur zusammen mit Modul 1; gilt für den Netzbezug dieser Marktlokation.",
  },
] as const;

export const electricityTariffsContent = {
  seo: {
    title: "Stromtarife für PV, Speicher & Wärmepumpe | Energie-Kraft Süd",
    description:
      "Festpreis, dynamische Tarife und Wärmepumpenstrom: Welches Modell passt zu PV und Speicher? Energie-Kraft Süd hilft, Technik und Netzbezug gemeinsam zu planen.",
    canonicalPath: PUBLIC_ROUTES["stromtarife-pv"].href,
  },
  breadcrumbLabel: "Stromtarife",
  eyebrow: "Photovoltaik · Speicher · Strombezug",
  title: "Der Stromtarif gehört zum Energiesystem.",
  description:
    "Eigener Solarstrom, gespeicherte Energie und flexibler Verbrauch: Wir helfen Ihnen zu beurteilen, welche Tarifstruktur zu Ihrem Zuhause passt.",
  desktopSrc: "/images/electricity-tariffs/energy-system-hero-desktop.webp",
  mobileSrc: "/images/electricity-tariffs/energy-system-hero-mobile.webp",
  desktopWidth: 1584,
  desktopHeight: 990,
  mobileWidth: 768,
  mobileHeight: 960,
  imageAlt: "Illustratives Wohnhaus mit Photovoltaik, Wärmepumpe und Elektroauto an einer Wallbox",
  secondaryCta: { label: "Tarifmodelle verstehen", href: "#tarifmodelle" },
  sections: [],
  ctaTitle: "Welche Tarifstruktur passt zu Ihrem Energieprojekt?",
  ctaLabel: "Energieprojekt besprechen",
  ctaHref: CONTACT_FORM_HREF,
} satisfies Sprint8PageContent;
