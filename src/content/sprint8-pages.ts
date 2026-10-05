import { CONTACT_FORM_HREF, PUBLIC_ROUTES } from "@/config/routes";
import { siteConfig } from "@/config/site";
import type { CtaContent, SeoContent } from "@/types/content";
import { fundingPageContent } from "@/content/pages/funding";
import { electricityTariffsContent } from "@/content/pages/stromtarife";
import { commercialStorageContent } from "@/content/pages/gewerbespeicher";
import type { MarketingFeatureSection } from "@/app/(site)/_components/marketing-feature-page";

export interface Sprint8PageContent {
  seo: SeoContent;
  breadcrumbLabel: string;
  breadcrumbItems?: readonly { label: string; href: string }[];
  eyebrow: string;
  title: string;
  description: string;
  desktopSrc: string;
  mobileSrc: string;
  imageAlt: string;
  secondaryCta?: CtaContent;
  desktopWidth?: number;
  desktopHeight?: number;
  mobileWidth?: number;
  mobileHeight?: number;
  sections: readonly MarketingFeatureSection[];
  ctaTitle: string;
  ctaLabel: string;
  ctaHref: string;
}

const serviceBreadcrumb = [{ label: "Service & Wartung", href: "/service-und-wartung" }] as const;

export const sprint8Pages = {
  businessPv: {
    seo: {
      title: "Photovoltaik für Unternehmen & Gewerbe | Energie-Kraft Süd",
      description:
        "Photovoltaik für Unternehmen und Gewerbe in Bayern: Lastprofil analysieren, Eigenstrom nutzen und PV mit Speicher kombinieren. Planung, Installation und Service aus einer Hand.",
      canonicalPath: "/photovoltaik-fuer-unternehmen",
    },
    breadcrumbLabel: "Photovoltaik für Unternehmen",
    eyebrow: "Photovoltaik für Gewerbe & Unternehmen",
    title: "Photovoltaik für Unternehmen: eigenen Solarstrom wirtschaftlich nutzen",
    description:
      "Unternehmen verbrauchen häufig genau dann viel Strom, wenn eine Photovoltaikanlage Energie erzeugt. Wir analysieren Lastprofil, Dachflächen und technische Voraussetzungen und entwickeln daraus eine PV-Lösung, die zu Ihrem Betrieb passt – von der Planung über die Installation bis zum laufenden Service.",
    desktopSrc: "/images/commercial-photovoltaic/commercial-photovoltaic-hero-desktop.webp",
    mobileSrc: "/images/commercial-photovoltaic/commercial-photovoltaic-hero-mobile.webp",
    imageAlt: "Zwei Fachkräfte auf einer großen Photovoltaikanlage auf einem Gewerbedach",
    sections: [
      {
        id: "eigenstrom",
        eyebrow: "Eigenstrom im Betrieb",
        title: "Strom dort erzeugen, wo er im Unternehmen gebraucht wird",
        layout: "statement",
        paragraphs: [
          "Gerade Betriebe mit hohem Tagesverbrauch können einen großen Teil des erzeugten Solarstroms direkt selbst nutzen. Dadurch kann sich der Strombezug aus dem Netz reduzieren und ein größerer Teil des betrieblichen Energiebedarfs durch die eigene Anlage gedeckt werden.",
          "Entscheidend ist nicht allein die Größe der Dachfläche. Verbrauchszeiten, Lastspitzen, Betriebsabläufe und mögliche zukünftige Verbraucher bestimmen mit, welche Photovoltaiklösung wirtschaftlich und technisch sinnvoll ist.",
        ],
      },
      {
        id: "planung",
        eyebrow: "Ausgangslage",
        title: "Verbrauch, Lastprofil und Gebäude bilden den Planungsrahmen",
        paragraphs: [
          "Ein Betrieb mit hohem Tagesverbrauch kann Solarstrom unmittelbar nutzen. Schichtbetrieb, Wochenenden und saisonale Schwankungen verändern dagegen das Lastprofil. Deshalb betrachten wir Verbrauchsverlauf, nutzbare Dachflächen, Dachzustand und Anschlussbedingungen gemeinsam.",
          "Daraus entsteht eine Anlage, deren Größe und technische Auslegung nicht pauschal, sondern anhand des tatsächlichen Betriebs geplant wird.",
        ],
        items: [
          "Verbrauchs- und Lastprofil",
          "Dach- und Flächensituation",
          "Netz- und Anschlussbedingungen",
          "Erweiterungsoptionen",
        ],
        links: [
          {
            label: "Gewerbliche Referenzen",
            description: "Reale Anlagen aus der Region ansehen.",
            href: "/referenzen",
          },
          {
            label: "Gewerbespeicher",
            description: "Speicherung im betrieblichen System prüfen.",
            href: PUBLIC_ROUTES.gewerbespeicher.href,
          },
        ],
      },
      {
        id: "wirtschaftlichkeit",
        eyebrow: "Investition verstehen",
        title: "Vor der Investition prüfen, wie Erzeugung und Verbrauch zusammenpassen",
        paragraphs: [
          "Im Rahmen der Planung stellen wir den erwartbaren PV-Ertrag dem tatsächlichen Stromverbrauch des Unternehmens gegenüber. So lässt sich einschätzen, wie viel Solarstrom direkt genutzt werden kann und welche Anlagengröße zum Betrieb passt.",
          "Investitionsrahmen, Eigenstromnutzung und mögliche Erweiterungen werden transparent betrachtet. Förderprogramme und regulatorische Rahmenbedingungen können sich ändern und werden deshalb zum jeweiligen Projektzeitpunkt aktuell geprüft.",
        ],
      },
      {
        id: "gewerbespeicher",
        eyebrow: "Systemlösung",
        title: "Solarstrom speichern, wenn das Lastprofil davon profitiert",
        image: {
          desktopSrc: "/images/commercial-photovoltaic/commercial-photovoltaic-system-desktop.webp",
          mobileSrc: "/images/commercial-photovoltaic/commercial-photovoltaic-system-mobile.webp",
          desktopWidth: 1440,
          desktopHeight: 900,
          mobileWidth: 768,
          mobileHeight: 960,
          alt: "Photovoltaikanlage auf dem Dach eines Gewerbegebäudes",
        },
        paragraphs: [
          "Ein Gewerbespeicher kann überschüssigen Solarstrom zeitlich verschieben und damit die Eigenstromnutzung erhöhen. Ob ein Speicher wirtschaftlich und technisch sinnvoll ist, hängt jedoch vom konkreten Lastprofil, den Betriebszeiten und der vorhandenen Infrastruktur ab.",
          "Deshalb betrachten wir Photovoltaik und Batteriespeicher gemeinsam. Auch Ladeinfrastruktur oder weitere elektrische Verbraucher können bereits bei der Planung berücksichtigt werden.",
        ],
        links: [
          { label: "Gewerbespeicher kennenlernen", href: PUBLIC_ROUTES.gewerbespeicher.href },
          { label: "Wallbox & Ladeinfrastruktur", href: "/wallbox" },
        ],
      },
      {
        id: "anwendungen",
        eyebrow: "Von Gewerbe bis Industrie",
        title: "Photovoltaik für unterschiedliche Betriebsgrößen und Anwendungen",
        layout: "statement",
        surface: "blue",
        paragraphs: [
          "Energie-Kraft Süd plant Photovoltaiksysteme für kleinere und mittlere Gewerbebetriebe ebenso wie für größere Dachflächen in Industrie, Landwirtschaft und kommunalen Projekten. Die technische Lösung wird an Nutzung, Gebäude und Energiebedarf angepasst und so geplant, dass spätere Erweiterungen berücksichtigt werden können.",
        ],
        items: ["Gewerbebetriebe", "Industrie", "Landwirtschaft", "Kommunale Projekte"],
      },
      {
        id: "erfahrung",
        eyebrow: "Energie-Kraft Süd",
        title: "Über 20 Jahre Erfahrung für gewerbliche Energieprojekte",
        paragraphs: [
          "Energie-Kraft Süd besteht seit über 20 Jahren. Von der ersten Analyse über die technische Planung und Installation bis zur Inbetriebnahme und späteren Betreuung begleiten wir Ihr Projekt mit klaren Ansprechpartnern.",
          "Von Ainring aus realisieren wir gewerbliche Photovoltaikanlagen in unserem regionalen Schwerpunktgebiet rund um das Berchtesgadener Land und den Landkreis Traunstein und bei größeren Projekten auch in ganz Bayern.",
        ],
        items: [
          "Beratung & Analyse",
          "Planung",
          "Installation & Inbetriebnahme",
          "Service & Betreuung",
        ],
      },
      {
        id: "service",
        eyebrow: "Service nach der Inbetriebnahme",
        title: "Damit Ihre PV-Anlage auch langfristig zuverlässig arbeitet",
        paragraphs: [
          "Mit der Inbetriebnahme endet unsere Betreuung nicht. Für gewerbliche Photovoltaikanlagen bieten wir Wartung, Instandhaltung, Reparatur und Störungsbeseitigung sowie auf Wunsch passende Wartungsverträge.",
          "Über unsere Leitstelle können Anlagen laufend überwacht werden. Auffälligkeiten und Störungen lassen sich dadurch früh erkennen und gezielt prüfen.",
        ],
        items: [
          "Anlagenüberwachung",
          "Wartung",
          "Instandhaltung",
          "Reparatur und Störungsbeseitigung",
          "Wartungsverträge",
        ],
        links: [
          { label: "Service & Wartung", href: "/service-und-wartung" },
          { label: "Service & Team", href: "/service-und-wartung/service-und-team" },
        ],
      },
      {
        id: "referenzen",
        eyebrow: "Realisierte Projekte",
        title: "Photovoltaik-Projekte für Unternehmen aus der Region",
        layout: "statement",
        paragraphs: [
          "Unsere Referenzen zeigen unterschiedliche gewerbliche Photovoltaikprojekte aus dem Berchtesgadener Land, dem Landkreis Traunstein und der angrenzenden Region.",
        ],
        links: [{ label: "Gewerbliche Referenzen ansehen", href: "/referenzen" }],
      },
    ],
    ctaTitle: "Sie planen eine Photovoltaikanlage für Ihren Betrieb?",
    ctaLabel: "Gewerbeprojekt besprechen",
    ctaHref: CONTACT_FORM_HREF,
  },
  commercialStorage: commercialStorageContent,
  electricityTariffs: electricityTariffsContent,
  maintenance: {
    seo: {
      title: "PV-Wartung & Reinigung | Energie-Kraft Süd",
      description:
        "Wartung, Anlagenprüfung, Fehlererkennung und bedarfsgerechte Reinigung für Photovoltaikanlagen – individuell nach Anlagensituation.",
      canonicalPath: "/service-und-wartung/wartung-und-reinigung",
      noIndex: true,
    },
    breadcrumbLabel: "Wartung & Reinigung",
    breadcrumbItems: serviceBreadcrumb,
    eyebrow: "Service für Energieanlagen",
    title: "Technik prüfen. Auffälligkeiten einordnen. Betrieb begleiten.",
    description:
      "Wartung und Reinigung richten sich nach Anlage, Standort und festgestelltem Bedarf – nicht nach pauschalen Versprechen.",
    desktopSrc: "/images/service/maintenance-cleaning-hero-desktop.webp",
    mobileSrc: "/images/service/maintenance-cleaning-hero-mobile.webp",
    imageAlt: "Techniker prüft elektrische Komponenten an einer Photovoltaikanlage",
    sections: [
      {
        eyebrow: "Anlagenprüfung",
        title: "Hinweise erkennen, bevor daraus größere Probleme werden",
        paragraphs: [
          "Eine strukturierte Prüfung kann sichtbare Auffälligkeiten, technische Hinweise und Fragen zum Betrieb zusammenführen. Welche Prüfungen erforderlich sind, hängt von der jeweiligen Anlage ab.",
        ],
        items: [
          "Sichtbare Auffälligkeiten",
          "Technische Funktionsprüfung",
          "Fehleranalyse bei konkretem Anlass",
          "Dokumentation der nächsten Schritte",
        ],
        links: [
          { label: "Service & Team", href: "/service-und-wartung/service-und-team" },
          { label: "Serviceübersicht", href: "/service-und-wartung" },
        ],
      },
      {
        eyebrow: "Reinigung",
        title: "Bedarf statt Automatismus",
        paragraphs: [
          "Nicht jede Anlage benötigt dieselbe Reinigung. Zugänglichkeit, Verschmutzung und technische Situation werden vor Umfang und Durchführung berücksichtigt.",
        ],
      },
    ],
    ctaTitle: "Sie möchten Ihre Anlage prüfen lassen?",
    ctaLabel: "Serviceanfrage stellen",
    ctaHref: CONTACT_FORM_HREF,
  },
  funding: fundingPageContent,
  application: {
    seo: {
      title: "Bewerbung bei Energie-Kraft Süd",
      description:
        "Bewerben Sie sich bei Energie-Kraft Süd in Ainring. Senden Sie uns Ihren gewünschten Arbeitsbereich, Ihre Erfahrung und aussagekräftige Unterlagen.",
      canonicalPath: "/bewerbung",
    },
    breadcrumbLabel: "Bewerbung",
    breadcrumbItems: [{ label: "Jobs", href: "/jobs" }],
    eyebrow: "Ihr Weg zu Energie-Kraft Süd",
    title: "Zeigen Sie uns, wie Sie unser Team verstärken möchten.",
    description:
      "Auch ohne veröffentlichte Stelle können Sie Ihr Interesse an einem technischen, kaufmännischen oder kundenbezogenen Arbeitsbereich mitteilen.",
    desktopSrc: "/images/team/company-service-hero-desktop.webp",
    mobileSrc: "/images/team/company-service-hero-mobile.webp",
    imageAlt: "Mitarbeiter von Energie-Kraft Süd bei der Arbeit auf einem Dach",
    sections: [
      {
        eyebrow: "Bewerbungsweg",
        title: "Aussagekräftig und direkt Kontakt aufnehmen",
        paragraphs: [
          "Nennen Sie den gewünschten Aufgabenbereich, Ihre relevante Erfahrung und den möglichen Eintrittszeitpunkt. Lebenslauf und passende Nachweise können Sie per E-Mail übermitteln.",
          "Die Seite ist kein Versprechen einer aktuell offenen Position. Wir prüfen jede Kontaktaufnahme anhand des tatsächlichen Bedarfs.",
        ],
        links: [{ label: "Zur Arbeitgeberseite", href: "/jobs" }],
      },
      {
        eyebrow: "Arbeitsbereiche",
        title: "Technik, Montage, Service und Organisation",
        paragraphs: [
          "Unsere Arbeit verbindet Planung, Elektrotechnik, Dachmontage, technische Betreuung, Vertrieb und Verwaltung. Welche Möglichkeiten aktuell bestehen, klären wir persönlich.",
        ],
      },
    ],
    ctaTitle: "Möchten Sie sich bei uns vorstellen?",
    ctaLabel: "Bewerbung per E-Mail",
    ctaHref: siteConfig.careers.emailHref,
  },
  referral: {
    seo: {
      title: "Kunden werben Kunden | Energie-Kraft Süd",
      description:
        "Empfehlen Sie Energie-Kraft Süd persönlich weiter. So können bestehende Kunden eine Empfehlung vor dem Projektkontakt bei uns anmelden.",
      canonicalPath: "/kunden-werben-kunden",
    },
    breadcrumbLabel: "Kunden werben Kunden",
    eyebrow: "Persönlich weiterempfehlen",
    title: "Gute Erfahrungen dürfen Kreise ziehen.",
    description:
      "Bestehende Kunden können Energie-Kraft Süd weiterempfehlen und die Empfehlung vor dem ersten Projektkontakt bei uns anmelden.",
    desktopSrc: "/images/home-premium/consultation-reference-desktop.webp",
    mobileSrc: "/images/home-premium/consultation-reference-mobile.webp",
    imageAlt: "Persönliches Gespräch über ein Energieprojekt",
    sections: [
      {
        eyebrow: "Ablauf",
        title: "Empfehlung zuerst bei uns anmelden",
        paragraphs: [
          "Kontaktieren Sie uns telefonisch oder per E-Mail und nennen Sie, dass es um eine persönliche Empfehlung geht. Die aktuell gültigen Voraussetzungen und den weiteren Ablauf bestätigen wir direkt.",
          "Historische Prämienhöhen und frühere Bedingungen wurden bewusst nicht übernommen, weil deren aktueller Stand noch geschäftlich bestätigt werden muss.",
        ],
        items: [
          "Empfehlung vor dem Erstkontakt melden",
          "Einwilligung der empfohlenen Person beachten",
          "Aktuelle Bedingungen persönlich bestätigen lassen",
        ],
      },
    ],
    ctaTitle: "Sie möchten eine Empfehlung anmelden?",
    ctaLabel: "E-Mail senden",
    ctaHref: siteConfig.contact.emailHref,
  },
} satisfies Record<string, Sprint8PageContent>;
