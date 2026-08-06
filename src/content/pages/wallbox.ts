import type { PublicPageContent } from "@/types/content";

export const wallboxContent = {
  seo: {
    title: "Wallbox kaufen & PV-Strom laden | Energie-Kraft Süd",
    description:
      "Wallbox kaufen und Elektroauto sicher zu Hause laden. Mit Photovoltaik, Überschussladen und intelligentem Lastmanagement.",
    canonicalPath: "/wallbox",
  },

  faqRouteKey: "wallbox",

  hero: {
    eyebrow: "Wallbox und E-Mobilität",
    title: "Elektroauto sicher laden und eigenen PV-Strom nutzen",
    description:
      "Wir planen Ihre Wallbox passend zu Fahrzeug, Gebäudeanschluss und Photovoltaikanlage – für komfortables Laden zu Hause oder im Unternehmen.",
    primaryCta: {
      label: "Wallbox-Beratung anfragen",
      href: "/kontakt",
    },
    secondaryCta: {
      label: "Ladelösung entdecken",
      href: "#wallbox-planung",
    },
  },

  sections: [
    {
      id: "wallbox-planung",
      eyebrow: "Mehr als nur eine Ladestation",
      title: "Wallbox passend zu Fahrzeug und Gebäude planen",
      text: [
        "Eine Wallbox ermöglicht das kontrollierte und komfortable Laden eines Elektrofahrzeugs am eigenen Stellplatz. Für eine sichere und leistungsfähige Lösung müssen Ladeleistung, Hausanschluss, Leitungswege und vorhandene Energieanlage zusammen betrachtet werden.",
        "Wir prüfen die technischen Voraussetzungen und integrieren die Ladestation in eine bestehende oder neu geplante Photovoltaikanlage.",
      ],
      items: [
        "Prüfung von Hausanschluss und verfügbarer Leistung",
        "Abstimmung auf Fahrzeug und gewünschte Ladegeschwindigkeit",
        "Planung von Leitungsweg und Montageort",
        "Integration in die bestehende Elektroinstallation",
        "Anbindung an Photovoltaik und Stromspeicher",
        "Vorbereitung auf zusätzliche Ladepunkte",
      ],
    },
    {
      id: "wallbox-rechner",
      eyebrow: "Unverbindliche Modellrechnung",
      title:
        "Ladezeit, Fahrstrombedarf und Wallbox-Kosten vorab berechnen",
      text: [
        "Mit unserem Wallbox-Rechner erhalten Sie anhand von Fahrleistung, Fahrzeugverbrauch, Batteriekapazität und Ladeleistung eine erste Orientierung für den jährlichen Fahrstrombedarf und die typische Ladedauer.",
        "Zusätzlich berücksichtigt das Modell einen möglichen Photovoltaik-Anteil, veränderbare Strompreise sowie einen Kostenkorridor für Wallbox und Installation.",
      ],
      cta: {
        label: "Wallbox-Rechner öffnen",
        href: "/rechner/wallbox-kosten",
      },
    },
    {
      id: "pv-ueberschussladen",
      eyebrow: "Sonnenenergie für das Elektroauto",
      title: "Mit PV-Überschussladen mehr Solarstrom selbst nutzen",
      text: [
        "Beim PV-Überschussladen wird die aktuell nicht im Gebäude benötigte Solarenergie gezielt zum Laden des Elektrofahrzeugs verwendet. Dadurch kann der Eigenverbrauch der Photovoltaikanlage steigen.",
        "Wie gut das funktioniert, hängt unter anderem von PV-Leistung, verfügbarer Ladeleistung, Fahrzeug, Wallbox und Energiemanagement ab. Alle Komponenten müssen technisch miteinander kommunizieren können.",
      ],
      cta: {
        label: "Photovoltaik kennenlernen",
        href: "/photovoltaik",
      },
    },
    {
      id: "lastmanagement",
      eyebrow: "Leistung intelligent verteilen",
      title: "Lastmanagement schützt den Gebäudeanschluss",
      text: [
        "Beim gleichzeitigen Betrieb mehrerer großer Verbraucher kann die verfügbare Anschlussleistung begrenzt sein. Ein geeignetes Lastmanagement berücksichtigt den aktuellen Gebäudeverbrauch und passt die Ladeleistung entsprechend an.",
        "Das ist besonders relevant bei mehreren Ladepunkten oder in Kombination mit Wärmepumpe, Stromspeicher und weiteren leistungsstarken Verbrauchern.",
      ],
      items: [
        "Dynamische Anpassung der Ladeleistung",
        "Berücksichtigung des aktuellen Hausverbrauchs",
        "Steuerung mehrerer Ladepunkte",
        "Vermeidung unnötiger Lastspitzen",
        "Abstimmung mit Energiemanagement und Speicher",
        "Erweiterbare Lösung für zukünftige Fahrzeuge",
      ],
    },
    {
      id: "komfort",
      eyebrow: "Laden im Alltag",
      title: "Komfortable Steuerung und transparente Verbrauchsdaten",
      text: [
        "Je nach System können Ladevorgänge geplant, gesteuert und dokumentiert werden. Apps oder Weboberflächen zeigen Ladezustand, Stromverbrauch und teilweise auch den Anteil des verwendeten Solarstroms.",
        "Bei betrieblich genutzten Fahrzeugen oder mehreren Nutzern können zusätzliche Funktionen für Zugangssteuerung und Verbrauchserfassung relevant sein.",
      ],
    },
    {
      id: "installation",
      eyebrow: "Sicher umgesetzt",
      title: "Fachgerechte Wallbox-Installation",
      text: [
        "Die Wallbox wird als leistungsstarker elektrischer Verbraucher fest in die Gebäudeinstallation eingebunden. Deshalb gehören die Prüfung der vorhandenen Elektrik, passende Schutzkomponenten und eine fachgerechte Installation zwingend zur Umsetzung.",
        "Wir planen die Wallbox nicht isoliert, sondern als Bestandteil Ihres gesamten Energie- und Mobilitätskonzepts.",
      ],
      cta: {
        label: "Wallbox-Projekt besprechen",
        href: "/kontakt",
      },
    },
  ],
} satisfies PublicPageContent;
