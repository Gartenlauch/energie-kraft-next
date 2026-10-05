import { CONTACT_FORM_HREF, PUBLIC_ROUTES } from "@/config/routes";
import type { Sprint8PageContent } from "@/content/sprint8-pages";

// Editorial snapshot, checked against the linked primary sources. Review before publication
// and when a programme or legislative status changes; never roll the date forward automatically.
export const fundingReview = { date: "2026-10-05", label: "5. Oktober 2026" } as const;

export const fundingSources = {
  solar: {
    label: "BMWE: Photovoltaik und Förderung",
    href: "https://www.energiewechsel.de/KAENEF/Redaktion/DE/Standardartikel/photovoltaik.html",
  },
  kfw270: {
    label: "KfW 270: Erneuerbare Energien – Standard",
    href: "https://www.kfw.de/partner/KfW-Partnerportal/Multiplikatoren/Förderprodukte/Erneuerbare-Energien-Standard-(270)/index.jsp",
  },
  eeg: {
    label: "Bundesnetzagentur: EEG-Vergütungssätze",
    href: "https://www.bundesnetzagentur.de/DE/Fachthemen/ElektrizitaetundGas/ErneuerbareEnergien/EEG_Foerderung/artikel.html",
  },
  tax: {
    label: "BMF: Nullsteuersatz für PV und Speicher",
    href: "https://www.bundesfinanzministerium.de/Content/DE/FAQ/foerderung-photovoltaikanlagen.html",
  },
  incomeTax: {
    label: "§ 3 Nr. 72 EStG: Einkommensteuerbefreiung",
    href: "https://www.gesetze-im-internet.de/estg/__3.html",
  },
  reform: {
    label: "Bundestag: Beratungsstand der EEG-Novelle 2027",
    href: "https://www.bundestag.de/dokumente/textarchiv/2026/kw39-de-energie-stromsektor-1211294",
  },
  business: {
    label: "KfW: PV und Batteriespeicher für Unternehmen",
    href: "https://www.kfw.de/inlandsfoerderung/Unternehmen/Energie-und-Umwelt/Photovoltaik/",
  },
  heating: {
    label: "KfW 458: Heizungsförderung für Privatpersonen",
    href: "https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestehende-Immobilie/Förderprodukte/Heizungsförderung-für-Privatpersonen-Wohngebäude-(458)/",
  },
  heatingChanges: {
    label: "KfW: BEG-Anpassungen seit Juli 2026 und Ausblick",
    href: "https://www.kfw.de/inlandsfoerderung/Bundesförderung-für-effiziente-Gebäude/Anpassungen-2026/",
  },
  heatingCredit: {
    label: "KfW: Heizungsförderung und Ergänzungskredit 358/359",
    href: "https://www.kfw.de/inlandsfoerderung/Heizungsförderung/",
  },
  lfa: {
    label: "LfA Bayern: Energiekredit Regenerativ",
    href: "https://www.lfa.de/website/de/foerderangebote/transformation/energie/er/index.php",
  },
  bavaria: {
    label: "Freistaat Bayern: Abschluss des 10.000-Häuser-Programms",
    href: "https://www.stmwi.bayern.de/presse/pressemeldungen/410-2026/",
  },
} as const;

export type FundingSourceKey = keyof typeof fundingSources;
export type FundingStatus = "current" | "scheduled" | "planned" | "unconfirmed";

export const fundingStatusLabels = {
  current: "Aktuell gültig · 2026",
  scheduled: "Bereits festgelegt · ab 2027",
  planned: "Für 2027 geplant · noch nicht gültig",
  unconfirmed: "2027 · kein neues Programm belegt",
} satisfies Record<FundingStatus, string>;

interface FundingItem {
  title: string;
  text: string;
  source: FundingSourceKey;
}

export interface FundingTopic {
  id: string;
  number: string;
  title: string;
  description: string;
  image?: { src: string; alt: string };
  current: readonly FundingItem[];
  outlook: readonly {
    status: Exclude<FundingStatus, "current">;
    title: string;
    text: string;
    source: FundingSourceKey;
  }[];
  attention: string;
  links: readonly { label: string; href: string }[];
}

export const fundingTopics: readonly FundingTopic[] = [
  {
    id: "photovoltaik",
    number: "01",
    title: "Photovoltaik: Vergütung, Kredit und Steuerentlastung",
    description:
      "Die Photovoltaik-Förderung 2026 besteht für private Standardanlagen vor allem aus mehreren Bausteinen. Ein allgemeiner Bundeszuschuss zum Kauf ist nicht vorgesehen.",
    current: [
      {
        title: "EEG-Einspeisevergütung",
        text: "Für eingespeisten Solarstrom gelten die gesetzlichen Vergütungsregeln. Maßgeblich sind unter anderem Inbetriebnahme, Anlagengröße und Teil- oder Volleinspeisung. Mess-, Steuerungs- und Sonderregeln, etwa zu negativen Strompreisen, sind zu beachten.",
        source: "eeg",
      },
      {
        title: "KfW 270 als Förderkredit",
        text: "PV und Batteriespeicher können über eine Bank finanziert werden. Privatpersonen müssen zumindest einen Teil der erzeugten Energie einspeisen. Den Antrag vor Vorhabenbeginn mit der Bank klären; Zins und Zusage hängen auch von Bonität und Sicherheiten ab.",
        source: "kfw270",
      },
      {
        title: "0 % Umsatzsteuer",
        text: "Lieferung und Installation begünstigter PV-Anlagen einschließlich wesentlicher Komponenten unterliegen dem Nullsteuersatz, etwa auf oder nahe Wohngebäuden. Das ist eine steuerliche Entlastung beim Erwerb, kein ausgezahlter Zuschuss.",
        source: "tax",
      },
      {
        title: "Einkommensteuerbefreiung",
        text: "Einnahmen und Entnahmen aus bestimmten PV-Anlagen sind nach § 3 Nr. 72 EStG steuerfrei. Anlagen-, Gebäude- und Betreibergrenzen sind gesondert zu prüfen; nicht jede PV-Anlage fällt darunter.",
        source: "incomeTax",
      },
    ],
    outlook: [
      {
        status: "planned",
        title: "EEG-Reform noch im Gesetzgebungsverfahren",
        text: "Der Entwurf sieht für Neuanlagen ab 2027 einen Wechsel von der festen Einspeisevergütung zur Direktvermarktung mit Übergangsregeln vor. Am 24. September 2026 wurde er in erster Lesung beraten und an den Ausschuss überwiesen. Das ist noch kein endgültig beschlossenes Gesetz; Einzelheiten und Inkrafttreten können sich ändern.",
        source: "reform",
      },
    ],
    attention:
      "Inbetriebnahme und Förderantrag sind unterschiedliche Zeitpunkte. Eine Wirtschaftlichkeitsplanung für 2027 sollte geplante EEG-Regeln als eigenes Szenario berücksichtigen. Aus einem Entwurf folgt kein gesicherter Vergütungssatz.",
    links: [
      { label: "Photovoltaik kennenlernen", href: PUBLIC_ROUTES.photovoltaik.href },
      {
        label: "PV-Projekt konfigurieren",
        href: `${PUBLIC_ROUTES.konfigurator.href}/photovoltaik`,
      },
    ],
  },
  {
    id: "batteriespeicher",
    number: "02",
    title: "Batteriespeicher: die Nutzung entscheidet",
    description:
      "Für private Heimspeicher gibt es 2026 keinen allgemeinen bundesweiten Investitionszuschuss. Finanzierung und steuerliche Behandlung hängen vom Gesamtsystem ab.",
    image: {
      src: "/images/finanzierung/batteriespeicher.webp",
      alt: "Illustratives Motiv: modularer Heimspeicher mit Wechselrichter und geschlossener Kabelführung in einem Technikraum",
    },
    current: [
      {
        title: "Privat: KfW 270 prüfen",
        text: "Batteriespeicher gehören zum Förderumfang des Kredits. Bei privaten Vorhaben ist insbesondere die Einspeisevoraussetzung zu prüfen. Der Kredit muss zurückgezahlt werden.",
        source: "kfw270",
      },
      {
        title: "Nullsteuersatz bei begünstigter PV",
        text: "Ein Speicher kann einschließlich Installation mit 0 % Umsatzsteuer begünstigt sein, wenn er Strom aus einer begünstigten PV-Anlage speichern soll. Das kann auch eine Nachrüstung betreffen. Nicht jeder eigenständige Speicher ist automatisch begünstigt.",
        source: "tax",
      },
      {
        title: "Gewerblich: andere Kreditbedingungen",
        text: "Für betriebliche Vorhaben kommen je nach Projekt KfW 270 oder KfW 570 infrage. KfW 570 setzt voraus, dass keine EEG-Förderung oder vergleichbare staatliche Förderung bezogen wird. In Bayern ist zusätzlich der LfA Energiekredit Regenerativ zu prüfen.",
        source: "business",
      },
    ],
    outlook: [
      {
        status: "unconfirmed",
        title: "Kein neuer Heimspeicher-Zuschuss belegt",
        text: "Zum Prüfstand ist in den ausgewerteten Primärquellen kein allgemeines neues Bundeszuschussprogramm für private Heimspeicher ab 2027 belastbar angekündigt. Die geplante EEG-Reform ist kein Speicher-Kaufzuschuss. Einen künftigen Zuschuss deshalb nicht ins Budget einrechnen.",
        source: "reform",
      },
    ],
    attention:
      "Das bayerische PV-Speicher- beziehungsweise 10.000-Häuser-Programm ist beendet. Frühere Zuschussbeträge gelten nicht für neue Anträge. Speichergröße und Nutzung sollten zum Verbrauch passen, unabhängig von einem möglichen Förderprogramm.",
    links: [
      { label: "Stromspeicher kennenlernen", href: PUBLIC_ROUTES.stromspeicher.href },
      { label: "Speicher konfigurieren", href: `${PUBLIC_ROUTES.konfigurator.href}/stromspeicher` },
    ],
  },
  {
    id: "waermepumpen",
    number: "03",
    title: "Wärmepumpen: Zuschuss mit klaren Voraussetzungen",
    description:
      "Die BEG-Heizungsförderung über KfW 458 unterstützt den Heizungstausch in bestehenden Wohngebäuden. Für neue Anträge gelten seit dem 21. Juli 2026 geänderte Bedingungen.",
    image: {
      src: "/images/finanzierung/waermepumpe.webp",
      alt: "Illustratives Motiv: Luft-Wasser-Wärmepumpe auf einem Betonsockel neben einem Wohnhaus mit freier Luftausströmung zum Garten",
    },
    current: [
      {
        title: "30 % Grundförderung",
        text: "Für förderfähige Heizungen im Bestand. Bauantrag oder Bauanzeige müssen mindestens fünf Jahre zurückliegen; technische Mindestanforderungen und die Optimierung der Wärmeverteilung sind einzuhalten.",
        source: "heating",
      },
      {
        title: "16 % Klimageschwindigkeitsbonus",
        text: "Für selbstnutzende Eigentümer beim Austausch bestimmter funktionsfähiger Altanlagen, etwa Öl- oder mindestens 20 Jahre alter Gasheizungen. Hauptwohnsitz, Heizungsart und fachgerechte Entsorgung sind zu prüfen.",
        source: "heating",
      },
      {
        title: "Einkommensbonus: 10, 30 oder 40 %",
        text: "Für Selbstnutzende: 10 % bis 50.000 €, 30 % bis 40.000 € oder 40 % bis 30.000 € zu versteuerndem Haushaltsjahreseinkommen. Mit mindestens einem minderjährigen, kindergeldberechtigten Kind steigen die Einkommensgrenzen einmalig um 10.000 €.",
        source: "heating",
      },
      {
        title: "Kostenobergrenze und Förderdeckel",
        text: "Für die erste Wohneinheit werden höchstens 28.000 € förderfähige Kosten berücksichtigt. Insgesamt gelten höchstens 70 %, in der niedrigsten Einkommensstufe bis zu 80 %. Die Boni werden nicht unbegrenzt addiert. Der frühere Effizienzbonus ist für neue Anträge entfallen.",
        source: "heatingChanges",
      },
    ],
    outlook: [
      {
        status: "scheduled",
        title: "Festgelegte Absenkungen ab Februar 2027",
        text: "Nach den veröffentlichten KfW-Bedingungen sinkt die Kostenobergrenze der ersten Wohneinheit ab 1. Februar 2027 halbjährlich um 750 €. Der Klimageschwindigkeitsbonus sinkt jeweils um vier Prozentpunkte: auf 12 % ab Februar und 8 % ab August 2027. Maßgeblich ist die Antragstellung.",
        source: "heatingChanges",
      },
      {
        status: "planned",
        title: "Wertschöpfungsbonus angekündigt",
        text: "Die KfW kündigt für das erste Quartal 2027 eine Umstellung mit Wertschöpfungsbonus für in der EU gefertigte Wärmepumpen an. Zum Prüfstand ist dieser Bonus noch nicht beantragbar. Start, Nachweise und endgültige Bedingungen vor einer Kalkulation erneut prüfen.",
        source: "heatingChanges",
      },
    ],
    attention:
      "KfW 458 verlangt vor dem Antrag einen Lieferungs- oder Leistungsvertrag mit aufschiebender oder auflösender Förderbedingung sowie eine Bestätigung zum Antrag (BzA). Diese Vertragsbedingung darf nicht nachträglich ergänzt werden. Antrag vor Vorhabenbeginn; Umsetzung nach Zusage. Förderung steht unter Haushaltsvorbehalt, ein Rechtsanspruch besteht nicht.",
    links: [
      { label: "Wärmepumpen kennenlernen", href: PUBLIC_ROUTES.waermepumpen.href },
      { label: "Wärmepumpe konfigurieren", href: `${PUBLIC_ROUTES.konfigurator.href}/waermepumpe` },
    ],
  },
];

export const fundingPageContent = {
  seo: {
    title: "PV, Speicher & Wärmepumpe: Förderung 2026/2027 in Bayern",
    description:
      "Finanzierung und Förderung für Photovoltaik, Batteriespeicher und Wärmepumpen in Bayern: gültige Regeln 2026, Pläne 2027 und KfW. Einordnung aus Ainring.",
    canonicalPath: PUBLIC_ROUTES["finanzierung-und-foerderung"].href,
  },
  breadcrumbLabel: "Finanzierung & Förderung",
  breadcrumbItems: [
    { label: "Service & Wartung", href: PUBLIC_ROUTES["service-und-wartung"].href },
  ],
  eyebrow: "Finanzierung & Förderung · Bayern",
  title: "Finanzierung & Förderung für Ihr Energieprojekt",
  description:
    "Förderung für Photovoltaik, Batteriespeicher und Wärmepumpen verständlich einordnen: Was gilt 2026, was ist für 2027 geplant – und was passt zu Ihrem Vorhaben?",
  desktopSrc: "/images/finanzierung/photovoltaik-desktop.webp",
  mobileSrc: "/images/finanzierung/photovoltaik-mobile.webp",
  desktopWidth: 1536,
  desktopHeight: 1024,
  mobileWidth: 768,
  mobileHeight: 1024,
  imageAlt:
    "Illustratives Motiv: modernes Wohnhaus mit auf einer Ziegeldachfläche montierten Photovoltaikmodulen",
  secondaryCta: { label: "Fördermöglichkeiten ansehen", href: "#foerderarten" },
  sections: [],
  ctaTitle: "Lassen Sie uns Ihr Energieprojekt gemeinsam prüfen.",
  ctaLabel: "Projekt besprechen",
  ctaHref: CONTACT_FORM_HREF,
} satisfies Sprint8PageContent;
