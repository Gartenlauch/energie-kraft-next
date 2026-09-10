import { CONTACT_FORM_HREF } from "@/config/routes";
import { siteConfig } from "@/config/site";
import type { SeoContent } from "@/types/content";

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
  sections: readonly {
    eyebrow: string;
    title: string;
    paragraphs: readonly string[];
    items?: readonly string[];
    links?: readonly {
      eyebrow?: string;
      label: string;
      description?: string;
      href: string;
    }[];
  }[];
  ctaTitle: string;
  ctaLabel: string;
  ctaHref: string;
}

const energyBreadcrumb = [{ label: "Energielösungen", href: "/energieloesungen" }] as const;
const serviceBreadcrumb = [{ label: "Service & Wartung", href: "/service-und-wartung" }] as const;

export const sprint8Pages = {
  energySolutions: {
    seo: {
      title: "Energielösungen für Gebäude | Energie-Kraft Süd",
      description:
        "Photovoltaik, Stromspeicher, Wärmepumpe, Klima und Ladeinfrastruktur als abgestimmtes Energiesystem für private und gewerbliche Gebäude.",
      canonicalPath: "/energieloesungen",
    },
    breadcrumbLabel: "Energielösungen",
    eyebrow: "Erzeugung, Speicherung & Verbrauch",
    title: "Energie wird stärker, wenn die Komponenten zusammenpassen.",
    description:
      "Wir planen Photovoltaik und Stromspeicher als Kern eines Systems, das Wärme, Klima und Elektromobilität sinnvoll einbeziehen kann.",
    desktopSrc: "/images/home-premium/hero-energy-home-desktop.webp",
    mobileSrc: "/images/home-premium/hero-energy-home-mobile.webp",
    imageAlt: "Wohnhaus mit Photovoltaikanlage als Teil eines vernetzten Energiesystems",
    sections: [
      {
        eyebrow: "Schwerpunkt",
        title: "Photovoltaik und Speicher zuerst gemeinsam betrachten",
        paragraphs: [
          "Dachfläche und Verbrauchszeiten bilden die Grundlage: Solarstrom lässt sich direkt nutzen, in einer Batterie für später speichern oder ins Netz einspeisen. Wir stimmen Photovoltaik und Speicher darauf ab und berücksichtigen anschließend zusätzliche Verbraucher.",
        ],
        items: ["Photovoltaik", "Stromspeicher", "Eigenverbrauch", "Technische Erweiterbarkeit"],
        links: [
          {
            label: "Photovoltaik",
            description: "Solarstrom passend zum Gebäude planen.",
            href: "/photovoltaik",
          },
          {
            label: "Stromspeicher",
            description: "Eigenen Strom zeitlich flexibler nutzen.",
            href: "/stromspeicher",
          },
        ],
      },
      {
        eyebrow: "Weitere Bausteine",
        title: "Wärme, Klima und Mobilität passend ergänzen",
        paragraphs: [
          "Wärmepumpe, Klimaanlage und Wallbox haben jeweils eigene technische Anforderungen. Wir prüfen ihren Platz im Gesamtsystem, ohne jede Komponente pauschal vorauszusetzen.",
        ],
        items: ["Wärmepumpe", "Klimatisierung", "Wallbox", "Strombezug und Tarifmodell"],
        links: [
          {
            label: "Wärmepumpen",
            description: "Wärme als Teil des Energiesystems.",
            href: "/waermepumpen",
          },
          {
            label: "Klimaanlagen",
            description: "Räume effizient temperieren.",
            href: "/klimaanlagen",
          },
          { label: "Wallbox", description: "Elektromobilität mit PV verbinden.", href: "/wallbox" },
          {
            label: "Stromtarife",
            description: "Eigenstrom und Netzbezug zusammendenken.",
            href: "/energieloesungen/stromtarife-pv",
          },
        ],
      },
    ],
    ctaTitle: "Welches Energiesystem passt zu Ihrem Gebäude?",
    ctaLabel: "Projekt konfigurieren",
    ctaHref: "/konfigurator",
  },
  businessPv: {
    seo: {
      title: "Photovoltaik für Unternehmen | Energie-Kraft Süd",
      description:
        "Photovoltaik für Gewerbe, Unternehmen und Hallendächer: Verbrauch analysieren, Anlage technisch planen und Eigenstrom im Betrieb nutzen.",
      canonicalPath: "/energieloesungen/photovoltaik-fuer-unternehmen",
    },
    breadcrumbLabel: "Photovoltaik für Unternehmen",
    breadcrumbItems: energyBreadcrumb,
    eyebrow: "Energie für Unternehmen",
    title: "Dachfläche in planbaren Eigenstrom übersetzen.",
    description:
      "Für Gewerbe zählt nicht nur die Größe einer Anlage, sondern wie Erzeugung, Lastprofil, Dach und betriebliche Abläufe zusammenwirken.",
    desktopSrc: "/images/photovoltaic/photovoltaic-feature-desktop.webp",
    mobileSrc: "/images/photovoltaic/photovoltaic-feature-mobile.webp",
    imageAlt: "Fachkraft bei der Montage von Photovoltaikmodulen auf einem Dach",
    sections: [
      {
        eyebrow: "Ausgangslage",
        title: "Verbrauch und Gebäude bilden den Planungsrahmen",
        paragraphs: [
          "Ein Betrieb mit hohem Tagesverbrauch kann Solarstrom unmittelbar nutzen. Schichtbetrieb, Wochenenden und saisonale Schwankungen verändern das Lastprofil. Deshalb betrachten wir Verbrauchsverlauf, nutzbare Dachfläche, Dachzustand und Anschlussbedingungen gemeinsam.",
        ],
        items: [
          "Verbrauchs- und Lastprofil",
          "Dach- und Flächensituation",
          "Technische Einbindung",
          "Erweiterungsoptionen",
        ],
        links: [
          {
            label: "Gewerbliche Referenzen",
            description: "Reale Anlagen aus der Region ansehen.",
            href: "/pv-referenzen",
          },
          {
            label: "Gewerbespeicher",
            description: "Speicherung im betrieblichen System prüfen.",
            href: "/energieloesungen/gewerbespeicher",
          },
        ],
      },
      {
        eyebrow: "Systemlösung",
        title: "Photovoltaik, Speicher und betriebliche Verbraucher abstimmen",
        paragraphs: [
          "Ein Gewerbespeicher, Ladeinfrastruktur oder weitere Verbraucher können die Eigenstromnutzung ergänzen. Ob das fachlich sinnvoll ist, wird projektspezifisch bewertet.",
        ],
      },
      {
        eyebrow: "Umsetzung",
        title: "Von der technischen Klärung bis zum Service",
        paragraphs: [
          "Planung, Installation, Inbetriebnahme und spätere Betreuung werden als zusammenhängender Prozess organisiert. Schnittstellen und Projektumfang stimmen wir vor der Umsetzung transparent ab.",
        ],
      },
    ],
    ctaTitle: "Sie planen Photovoltaik für Ihren Betrieb?",
    ctaLabel: "Gewerbeprojekt besprechen",
    ctaHref: CONTACT_FORM_HREF,
  },
  commercialStorage: {
    seo: {
      title: "Gewerbespeicher für Unternehmen | Energie-Kraft Süd",
      description:
        "Gewerbliche Stromspeicher im Zusammenspiel mit Photovoltaik, Lastprofil und Eigenstromnutzung technisch und bedarfsgerecht planen.",
      canonicalPath: "/energieloesungen/gewerbespeicher",
      noIndex: true,
    },
    breadcrumbLabel: "Gewerbespeicher",
    breadcrumbItems: energyBreadcrumb,
    eyebrow: "Speicher für Betriebe",
    title: "Energie dann nutzen, wenn der Betrieb sie braucht.",
    description:
      "Ein Gewerbespeicher kann Erzeugung und Verbrauch zeitlich besser verbinden. Die sinnvolle Auslegung hängt vom konkreten Lastprofil ab.",
    desktopSrc: "/images/battery-storage/battery-storage-feature-desktop.webp",
    mobileSrc: "/images/battery-storage/battery-storage-feature-mobile.webp",
    imageAlt: "Stromspeichersystem als Baustein einer gewerblichen Energielösung",
    sections: [
      {
        eyebrow: "Einsatz",
        title: "Nicht die Kapazität allein entscheidet",
        paragraphs: [
          "Erzeugungsverlauf, Verbrauchsspitzen, Betriebszeiten und vorhandene Technik bestimmen, welche Speicherstrategie infrage kommt. Veraltete Produktdaten aus der früheren Website wurden nicht übernommen.",
        ],
        items: [
          "Eigenstrom zeitlich verschieben",
          "Lastverlauf analysieren",
          "PV-Erzeugung einbeziehen",
          "Technische Schnittstellen prüfen",
        ],
        links: [
          {
            label: "Photovoltaik für Unternehmen",
            href: "/energieloesungen/photovoltaik-fuer-unternehmen",
          },
          { label: "Stromspeicher für Zuhause", href: "/stromspeicher" },
        ],
      },
      {
        eyebrow: "Planung",
        title: "Speicher als Teil des betrieblichen Energiesystems",
        paragraphs: [
          "Wir bewerten einen Speicher nicht isoliert, sondern zusammen mit Photovoltaik, Netzanschluss und relevanten Verbrauchern. Konkrete Wirtschaftlichkeit entsteht erst aus verifizierten Projektdaten.",
        ],
      },
    ],
    ctaTitle: "Soll ein Speicher Ihr PV-System ergänzen?",
    ctaLabel: "Anwendung prüfen lassen",
    ctaHref: CONTACT_FORM_HREF,
  },
  electricityTariffs: {
    seo: {
      title: "Stromtarife für Photovoltaik verstehen | Energie-Kraft Süd",
      description:
        "Wie Photovoltaik, Eigenverbrauch, Speicher und ergänzender Strombezug zusammenspielen – mit einer Tarifwahl passend zum Verbrauch.",
      canonicalPath: "/energieloesungen/stromtarife-pv",
    },
    breadcrumbLabel: "Stromtarife",
    breadcrumbItems: energyBreadcrumb,
    eyebrow: "PV & Strombezug",
    title: "Eigenstrom und Netzbezug sinnvoll zusammendenken.",
    description:
      "Auch mit Photovoltaik bleibt ergänzender Strombezug relevant. Ein passendes Modell berücksichtigt Erzeugung, Verbrauch und Flexibilität.",
    desktopSrc: "/images/home-premium/hero-energy-home-desktop.webp",
    mobileSrc: "/images/home-premium/hero-energy-home-mobile.webp",
    imageAlt: "Wohngebäude mit Photovoltaik zur eigenen Stromerzeugung",
    sections: [
      {
        eyebrow: "Grundprinzip",
        title: "Zuerst den eigenen Verbrauch verstehen",
        paragraphs: [
          "Photovoltaik deckt den Strombedarf nicht zu jeder Zeit vollständig. Eigenverbrauch, mögliche Speicherung und verbleibender Netzbezug sollten deshalb gemeinsam betrachtet werden.",
        ],
        items: ["Verbrauchsprofil", "PV-Erzeugung", "Speichernutzung", "Verbleibender Netzbezug"],
        links: [
          { label: "Photovoltaik", href: "/photovoltaik" },
          { label: "Stromspeicher", href: "/stromspeicher" },
        ],
      },
      {
        eyebrow: "Tarifwahl",
        title: "Modelle vergleichen statt alte Preise fortschreiben",
        paragraphs: [
          "Tarife, Vergütungen und Anbieterbedingungen können sich ändern. Wir erklären die technischen Zusammenhänge; konkrete Konditionen müssen zum Entscheidungszeitpunkt beim jeweiligen Anbieter geprüft werden.",
        ],
      },
    ],
    ctaTitle: "Sie möchten PV und Strombezug gemeinsam planen?",
    ctaLabel: "Beratung anfragen",
    ctaHref: CONTACT_FORM_HREF,
  },
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
    desktopSrc: "/images/home-premium/service-maintenance-desktop.webp",
    mobileSrc: "/images/home-premium/service-maintenance-mobile.webp",
    imageAlt: "Fachkraft bei der Prüfung einer Energieanlage",
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
  funding: {
    seo: {
      title: "Finanzierung & Förderung für Energieprojekte",
      description:
        "Finanzierung und mögliche Förderprogramme für Photovoltaik und Energietechnik einordnen – abhängig von Vorhaben, Zeitraum und Verfügbarkeit.",
      canonicalPath: "/service-und-wartung/finanzierung-und-foerderung",
      noIndex: true,
    },
    breadcrumbLabel: "Finanzierung & Förderung",
    breadcrumbItems: serviceBreadcrumb,
    eyebrow: "Rahmenbedingungen klären",
    title: "Ein Energieprojekt braucht auch einen belastbaren finanziellen Rahmen.",
    description:
      "Finanzierungswege und Förderprogramme können sich kurzfristig verändern. Entscheidend ist die Prüfung für Ihr konkretes Vorhaben.",
    desktopSrc: "/images/home-premium/consultation-reference-desktop.webp",
    mobileSrc: "/images/home-premium/consultation-reference-mobile.webp",
    imageAlt: "Persönliche Beratung zu einem Energieprojekt",
    sections: [
      {
        eyebrow: "Finanzierung",
        title: "Investition und Projektumfang zusammen betrachten",
        paragraphs: [
          "Technischer Umfang, zeitliche Planung und Finanzierungsmodell beeinflussen sich gegenseitig. Wir schaffen zunächst Klarheit über das Projekt; konkrete Finanzierungsbedingungen kommen vom jeweiligen Finanzierungspartner.",
        ],
      },
      {
        eyebrow: "Förderung",
        title: "Programme immer aktuell und fallbezogen prüfen",
        paragraphs: [
          "Verfügbarkeit, Förderhöhe und Voraussetzungen hängen unter anderem von Programm, Zeitpunkt, Technologie und Antragstellung ab. Deshalb übernehmen wir keine alten Prozent- oder Zuschussangaben aus dem Legacy-Bestand.",
        ],
        items: [
          "Aktuellen Programmstand prüfen",
          "Voraussetzungen vor Auftrag klären",
          "Fristen und Antragsweg beachten",
          "Keine Förderung pauschal voraussetzen",
        ],
        links: [
          { label: "Photovoltaik planen", href: "/photovoltaik" },
          { label: "Energieprojekt konfigurieren", href: "/konfigurator" },
        ],
      },
    ],
    ctaTitle: "Sie möchten den Rahmen Ihres Projekts klären?",
    ctaLabel: "Projekt besprechen",
    ctaHref: CONTACT_FORM_HREF,
  },
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
