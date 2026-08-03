import { siteConfig } from "@/config/site";
import type { PublicPageContent } from "@/types/content";

export const kontaktContent = {
  seo: {
    title: "Kontakt & Energieberatung | Energie-Kraft Süd",
    description:
      "Kontaktieren Sie Energie-Kraft Süd in Ainring für eine persönliche Beratung zu Photovoltaik, Stromspeichern, Wallboxen, Klimaanlagen und Wärmepumpen.",
    canonicalPath: "/kontakt",
  },

  faqRouteKey: "kontakt",

  hero: {
    eyebrow: "Kontakt und Beratung",
    title: "Lassen Sie uns über Ihr Energieprojekt sprechen",
    description:
      "Ob Photovoltaikanlage, Stromspeicher, Wallbox, Klimaanlage oder Wärmepumpe: Wir betrachten Ihre Anforderungen und entwickeln eine passende Lösung für Ihr Gebäude.",
    primaryCta: {
      label: "Jetzt anrufen",
      href: siteConfig.contact.phoneHref,
    },
    secondaryCta: {
      label: "E-Mail schreiben",
      href: siteConfig.contact.emailHref,
    },
  },

  sections: [
    {
      id: "kontakt",
      eyebrow: "Direkter Kontakt",
      title: "So erreichen Sie Energie-Kraft Süd",
      text: [
        "Sie möchten ein neues Projekt besprechen, eine bestehende Energieanlage erweitern oder zunächst klären, welche Lösung für Ihr Gebäude sinnvoll ist? Kontaktieren Sie uns telefonisch oder per E-Mail.",
        "Je genauer Sie Ihr Vorhaben beschreiben, desto gezielter können wir Ihre Anfrage einordnen und den nächsten sinnvollen Schritt vorbereiten.",
      ],
      links: [
        {
          eyebrow: "Telefon",
          label: siteConfig.contact.phoneDisplay,
          description: "Rufen Sie uns direkt an und besprechen Sie Ihr Anliegen.",
          href: siteConfig.contact.phoneHref,
        },
        {
          eyebrow: "E-Mail",
          label: siteConfig.contact.email,
          description: "Senden Sie uns die wichtigsten Informationen zu Ihrem Projekt.",
          href: siteConfig.contact.emailHref,
        },
        {
          eyebrow: "Standort",
          label: `${siteConfig.contact.address.street}, ${siteConfig.contact.address.postalCode} ${siteConfig.contact.address.city}`,
          description: "Öffnen Sie unseren Standort in Google Maps.",
          href: siteConfig.contact.mapHref,
          external: true,
        },
      ],
    },
    {
      id: "projektinformationen",
      eyebrow: "Anfrage vorbereiten",
      title: "Diese Informationen helfen bei der ersten Einschätzung",
      text: [
        "Für eine erste Einordnung benötigen wir noch keine vollständige technische Dokumentation. Einige grundlegende Angaben helfen uns jedoch, Ihr Vorhaben schneller der richtigen Fachrichtung zuzuordnen.",
      ],
      items: [
        "Welche Lösung interessiert Sie?",
        "Handelt es sich um ein Wohn- oder Gewerbegebäude?",
        "Wo befindet sich das Gebäude?",
        "Ist bereits eine Photovoltaik- oder Heizungsanlage vorhanden?",
        "Geht es um eine neue Anlage oder eine Erweiterung?",
        "Wann soll das Projekt ungefähr umgesetzt werden?",
      ],
    },
    {
      id: "beratung",
      eyebrow: "Persönlich und individuell",
      title: "Von der ersten Anfrage zur passenden Lösung",
      text: [
        "Nach Ihrer Kontaktaufnahme klären wir zunächst die wesentlichen Anforderungen. Je nach Projekt folgen eine technische Bestandsaufnahme, eine Beratung vor Ort oder die Zusammenstellung weiterer Unterlagen.",
        "Unser Ziel ist keine pauschale Standardlösung, sondern ein technisch und wirtschaftlich sinnvolles Konzept, das zum Gebäude und zur geplanten Nutzung passt.",
      ],
      items: [
        "Erste Einordnung Ihrer Anfrage",
        "Klärung der technischen Ausgangssituation",
        "Abstimmung Ihrer Ziele und Prioritäten",
        "Planung geeigneter Komponenten und Leistungen",
        "Transparentes individuelles Angebot",
        "Begleitung bis zur fachgerechten Umsetzung",
      ],
    },
    {
      id: "leistungen",
      eyebrow: "Unsere Themen",
      title: "Zu diesen Energielösungen beraten wir Sie",
      text: [
        "Unsere Leistungen können einzeln geplant oder zu einem abgestimmten Energiesystem kombiniert werden.",
      ],
      links: [
        {
          label: "Photovoltaik",
          description: "Eigenen Solarstrom erzeugen und intelligent nutzen.",
          href: "/photovoltaik",
        },
        {
          label: "Stromspeicher",
          description: "Solarstrom speichern und den Eigenverbrauch erhöhen.",
          href: "/stromspeicher",
        },
        {
          label: "Wallbox",
          description: "Elektrofahrzeuge sicher und mit PV-Strom laden.",
          href: "/wallbox",
        },
        {
          label: "Klimaanlagen",
          description: "Räume individuell und effizient klimatisieren.",
          href: "/klimaanlagen",
        },
        {
          label: "Wärmepumpen",
          description: "Wärmeversorgung und Photovoltaik sinnvoll verbinden.",
          href: "/waermepumpen",
        },
      ],
    },
  ],
} satisfies PublicPageContent;
