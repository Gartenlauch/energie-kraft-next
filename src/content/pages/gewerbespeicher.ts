import { CONTACT_FORM_HREF, PUBLIC_ROUTES } from "@/config/routes";
import type { Sprint8PageContent } from "@/content/sprint8-pages";

const businessPv = {
  label: "Photovoltaik für Unternehmen",
  href: PUBLIC_ROUTES["photovoltaik-fuer-unternehmen"].href,
};

export const commercialStorageApplications = [
  {
    title: "PV-Eigenverbrauch erhöhen",
    description:
      "Überschüssige PV-Energie wird gespeichert und später im Betrieb genutzt. Das ist besonders dann relevant, wenn Erzeugung und Verbrauch zeitlich auseinanderliegen – etwa bei Verbrauch am Abend oder in der Nacht.",
  },
  {
    title: "Lastspitzen reduzieren",
    description:
      "Beim Peak Shaving gibt der Speicher während hoher Verbrauchsspitzen Energie ab und begrenzt so die benötigte Netzleistung. Ob daraus ein Kostenvorteil entsteht, hängt unter anderem vom Lastverlauf und den geltenden Bezugsbedingungen ab.",
  },
  {
    title: "Ladeinfrastruktur unterstützen",
    description:
      "Für betriebliche Elektromobilität kann ein Speicher Leistung zeitlich bereitstellen und Ladeanforderungen mit weiteren Verbrauchern koordinieren. Ob der Netzanschluss ausreicht oder erweitert werden muss, wird separat geprüft.",
  },
  {
    title: "Betriebliche Energie flexibler steuern",
    description:
      "Ein geeignetes Energiemanagement stimmt Erzeugung, Speicher und Verbraucher aufeinander ab. Die Betriebsstrategie richtet sich nach den vereinbarten Zielen und den technischen Möglichkeiten des jeweiligen Systems.",
  },
] as const;

export const commercialStorageProducts = [
  {
    id: "sigenstack",
    manufacturer: "Sigenergy",
    name: "SigenStack",
    description:
      "SigenStack ist ein modular aufgebautes Batteriespeichersystem für gewerbliche und industrielle Anwendungen. Stapelbare Batteriemodule ermöglichen eine projektspezifische Skalierung und die Anpassung an unterschiedliche Speicheranforderungen.",
    image: "/images/commercial-storage/products/sigenstack.webp",
    width: 1600,
    height: 900,
    alt: "Sigenergy SigenStack Gewerbespeicher",
    source: "https://www.sigenergy.com/de/products/sigenstack",
    sourceLabel: "Produktinformationen bei Sigenergy",
    details: [
      { label: "Systemaufbau", text: "Modular und stapelbar; kompakter Aufbau" },
      { label: "Batteriemodul", text: "12 kWh pro Modul laut Hersteller" },
      {
        label: "Systemansatz",
        text: "DC-gekoppelt für die gemeinsame Planung von PV und Speicher",
      },
      { label: "Schutz", text: "IP66; Sicherheitsmanagement auf Batteriemodulebene" },
      { label: "Monitoring", text: "Echtzeit-Systemüberwachung über Sigen Cloud" },
    ],
  },
  {
    id: "sonnenpro-flexstack",
    manufacturer: "sonnen",
    name: "sonnenPro FlexStack",
    description:
      "sonnenPro FlexStack ist ein modular konfigurierbarer Gewerbespeicher für Gewerbe, Industrie und Landwirtschaft. Leistung und Speicherkapazität lassen sich anhand des jeweiligen Projekts konfigurieren.",
    image: "/images/commercial-storage/products/sonnenpro-flexstack.webp",
    width: 1600,
    height: 889,
    alt: "sonnenPro FlexStack Gewerbespeicher",
    source: "https://www.sonnen.pro/de-de/flexstack",
    sourceLabel: "Produktinformationen bei sonnen",
    details: [
      {
        label: "Systemaufbau",
        text: "Modular; unterschiedliche Leistungs- und Kapazitätskonfigurationen",
      },
      { label: "Erweiterung", text: "In 55-kWh-Schritten laut Hersteller" },
      {
        label: "Konfiguration",
        text: "Bis 368 kW Leistung / bis 495 kWh Kapazität laut Herstellerdarstellung; abhängig von der Konfiguration",
      },
      { label: "Aufstellung", text: "Innen und außen gemäß Hersteller; Schutzart IP65" },
      { label: "Steuerung", text: "Einbindung in sonnenPro EMS" },
    ],
  },
] as const;

export const commercialStorageContent: Sprint8PageContent = {
  seo: {
    title: "Gewerbespeicher für Unternehmen | Energie-Kraft Süd",
    description:
      "Gewerbespeicher für Unternehmen in Bayern: SigenStack und sonnenPro FlexStack passend zu Photovoltaik, Lastprofil und betrieblichen Anforderungen planen.",
    canonicalPath: "/gewerbespeicher",
  },
  breadcrumbLabel: "Gewerbespeicher",
  eyebrow: "Gewerbespeicher für Unternehmen",
  title: "Energie speichern, Lastspitzen steuern und Eigenstrom besser nutzen",
  description:
    "Gewerbliche Batteriespeicher verbinden Photovoltaik, Verbrauch und betriebliche Anforderungen. Energie-Kraft Süd analysiert Lastprofil, Erzeugung, Netzanschluss und geplante Verbraucher und entwickelt daraus eine passende Speicherlösung für Ihren Betrieb.",
  desktopSrc: "/images/battery-storage/battery-storage-feature-desktop.webp",
  mobileSrc: "/images/battery-storage/battery-storage-feature-mobile.webp",
  desktopWidth: 1600,
  desktopHeight: 1200,
  mobileWidth: 1200,
  mobileHeight: 1527,
  imageAlt: "Gewerblicher Batteriespeicher neben Gewächshäusern mit Photovoltaik",
  secondaryCta: businessPv,
  sections: [
    {
      id: "einsatz",
      eyebrow: "Energie im Betrieb gezielt nutzen",
      title: "Ein Gewerbespeicher beginnt beim Lastprofil – nicht bei der Kapazität",
      surface: "white",
      paragraphs: [
        "Ob ein Batteriespeicher für einen Betrieb sinnvoll ist, hängt von weit mehr als der verfügbaren Speicherkapazität ab. Stromverbrauch, Lastspitzen, Betriebszeiten, Photovoltaikerzeugung, Netzanschluss und geplante zusätzliche Verbraucher bestimmen gemeinsam die Anforderungen.",
        "Deshalb analysieren wir zunächst, wann Energie erzeugt und wann sie im Unternehmen tatsächlich benötigt wird. Erst daraus lässt sich ableiten, welche Speicherleistung und Kapazität technisch und wirtschaftlich sinnvoll geprüft werden sollten.",
        "Leistung in Kilowatt (kW) beschreibt, wie viel Energie der Speicher gleichzeitig aufnehmen oder abgeben kann. Kapazität in Kilowattstunden (kWh) beschreibt die speicherbare Energiemenge. Für die Dimensionierung werden beide Größen zusammen mit dem zeitlichen Lastverlauf betrachtet.",
      ],
      items: [
        "Lastprofil und Betriebszeiten",
        "Photovoltaikerzeugung",
        "Lastspitzen",
        "Netzanschluss",
        "Ladeinfrastruktur",
        "Erweiterungsbedarf",
      ],
    },
    {
      id: "anwendungen",
      eyebrow: "Mehr als Solarstrom speichern",
      title: "Gewerbespeicher für Eigenverbrauch, Lastmanagement und Ladeinfrastruktur",
      paragraphs: [],
    },
    {
      id: "produkte",
      eyebrow: "Unsere Gewerbespeicher",
      title: "SigenStack und sonnenPro FlexStack",
      paragraphs: [
        "Zwei modulare Systemkonzepte für gewerbliche Anforderungen. Auslegung und Ausstattung werden für den jeweiligen Betrieb geplant.",
      ],
    },
    {
      id: "entscheidung",
      eyebrow: "Das Projekt entscheidet",
      title: "Welche Speicherlösung passt zum Betrieb?",
      surface: "soft",
      paragraphs: [
        "Welche Lösung geeignet ist, hängt von Lastprofil, PV-Erzeugung, benötigter Leistung und Kapazität, Aufstellort, Erweiterungsbedarf und den Anforderungen an Energiemanagement und Infrastruktur ab. Diese Punkte werden projektspezifisch bewertet.",
        "SigenStack verfolgt einen DC-gekoppelten Ansatz mit stapelbaren Batteriemodulen. FlexStack bietet modular konfigurierbare Leistung und Kapazität mit Einbindung in sonnenPro EMS. Die Einbindung in die vorhandene oder geplante Anlage wird für beide Systeme technisch geprüft.",
      ],
    },
    {
      id: "energiemanagement",
      eyebrow: "Erzeugung und Verbrauch verbinden",
      title: "Energiemanagement macht Speicher im Betrieb steuerbar",
      surface: "white",
      paragraphs: [
        "Ein Gewerbespeicher entfaltet seinen Nutzen nicht isoliert. Entscheidend ist, wie Photovoltaik, Speicher und betriebliche Verbraucher gemeinsam gesteuert werden.",
        "Je nach System können Erzeugung, Ladezustand, Verbrauch und Leistungsspitzen überwacht und Betriebsstrategien darauf abgestimmt werden.",
      ],
    },
    {
      id: "standort",
      eyebrow: "Technik für den Standort",
      title: "Aufstellort, Netzanschluss und Sicherheit frühzeitig prüfen",
      surface: "soft",
      paragraphs: [
        "Gewerbliche Batteriespeicher benötigen eine projektspezifische Planung von Aufstellort, elektrischer Einbindung, Zugänglichkeit und Schutzkonzept. Anforderungen unterscheiden sich je nach System, Leistung, Betriebsumgebung und Gebäude.",
        "Sigenergy nennt für SigenStack IP66 sowie Schutzmechanismen auf Modulebene, darunter Rauch- und Temperaturüberwachung. sonnen nennt für FlexStack IP65 und die Möglichkeit der Innen- und Außenaufstellung mit festem Untergrund und guter Zugänglichkeit für Installation und Service.",
        "Die IP-Schutzart allein macht nicht jeden Aufstellort zulässig. Herstellervorgaben sowie das projektspezifische Brandschutz- und Schutzkonzept müssen geprüft werden; baurechtliche und versicherungstechnische Anforderungen werden dadurch nicht ersetzt.",
        "Backup oder Ersatzstrom ist ein separates Planungsthema. Ob und in welchem Umfang dies möglich ist, muss anhand der jeweiligen Produktkonfiguration und elektrischen Einbindung geprüft werden.",
      ],
      items: [
        "Aufstellfläche und Betriebsumgebung",
        "Elektrische Einbindung",
        "Zugänglichkeit für Service",
        "Projektspezifisches Schutzkonzept",
      ],
    },
    {
      id: "wirtschaftlichkeit",
      eyebrow: "Investition verstehen",
      title: "Wirtschaftlichkeit entsteht aus dem konkreten Lastprofil",
      surface: "blue",
      layout: "statement",
      paragraphs: [
        "Ob sich ein Gewerbespeicher wirtschaftlich sinnvoll einsetzen lässt, hängt von Verbrauch, PV-Erzeugung, Lastspitzen, Strombezug, Speicherbetrieb und Investitionsumfang ab.",
        "Deshalb betrachten wir die konkrete Anwendung statt pauschaler Amortisationswerte. Erst auf Basis verifizierter Betriebsdaten kann eine belastbare Projektbewertung erfolgen.",
        "Dazu gehören zeitlich aufgelöste Verbrauchs- und Erzeugungsdaten, die geltenden Strombezugsbedingungen sowie Investitions- und Betriebskosten. Mögliche Vorteile aus Eigenverbrauch und Lastmanagement werden gemeinsam bewertet, weil beide Anwendungen dieselbe verfügbare Speicherleistung und Kapazität nutzen.",
      ],
      items: [
        "Verifizierte Verbrauchs- und PV-Daten",
        "Strombezug und Lastspitzen",
        "Geplante Betriebsstrategie",
        "Investition und laufende Kosten",
      ],
    },
    {
      id: "photovoltaik",
      eyebrow: "Gemeinsam planen",
      title: "Photovoltaik und Gewerbespeicher als betriebliches Energiesystem",
      surface: "white",
      layout: "image-right",
      image: {
        desktopSrc: "/images/commercial-photovoltaic/commercial-photovoltaic-system-desktop.webp",
        mobileSrc: "/images/commercial-photovoltaic/commercial-photovoltaic-system-mobile.webp",
        desktopWidth: 1440,
        desktopHeight: 900,
        mobileWidth: 768,
        mobileHeight: 960,
        alt: "Photovoltaikanlage auf einer großen gewerblichen Dachfläche",
      },
      paragraphs: [
        "Eine Photovoltaikanlage erzeugt häufig genau während der betrieblichen Nutzungszeiten Energie. Ein Speicher kann zusätzliche Flexibilität schaffen, wenn Erzeugung und Verbrauch zeitlich nicht vollständig zusammenpassen oder weitere Anforderungen hinzukommen.",
      ],
      links: [businessPv, { label: "Gewerbliche Referenzen", href: PUBLIC_ROUTES.referenzen.href }],
    },
    {
      id: "region",
      eyebrow: "Energie-Kraft Süd",
      title: "Gewerbespeicher planen – regional und bei größeren Projekten in Bayern",
      surface: "white",
      paragraphs: [
        "Energie-Kraft Süd besteht seit über 20 Jahren. Von Ainring aus begleiten wir gewerbliche Energieprojekte im Berchtesgadener Land, im Landkreis Traunstein und der angrenzenden Region.",
        "Bei größeren gewerblichen Projekten sind wir auch in ganz Bayern tätig. Analyse, Planung, Installation und spätere Betreuung werden dabei als zusammenhängendes Projekt betrachtet.",
      ],
    },
    {
      id: "service",
      eyebrow: "Betreuung im laufenden Betrieb",
      title: "Service passend zur Anlage und zum Betrieb",
      surface: "soft",
      paragraphs: [
        "Wartung, Instandhaltung, Reparatur und Störungsbeseitigung sowie Wartungsverträge gehören zu unseren gewerblichen Serviceleistungen. Der konkrete Umfang wird auf Anlage, Herstellervorgaben und betriebliche Anforderungen abgestimmt.",
        "Je nach vereinbartem Serviceumfang können Anlagenüberwachung über unsere Leitstelle, Wartung und technische Betreuung Bestandteil der langfristigen Betriebsbegleitung sein.",
      ],
      links: [
        { label: "Service & Wartung", href: PUBLIC_ROUTES["service-und-wartung"].href },
        { label: "Service & Team", href: PUBLIC_ROUTES["service-und-team"].href },
      ],
    },
  ],
  ctaTitle: "Welcher Gewerbespeicher passt zu Ihrem Betrieb?",
  ctaLabel: "Gewerbespeicher besprechen",
  ctaHref: CONTACT_FORM_HREF,
};
