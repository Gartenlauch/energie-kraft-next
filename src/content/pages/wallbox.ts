import { CONTACT_FORM_HREF, PUBLIC_ROUTES } from "@/config/routes";
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
    title: "Wallbox kaufen, sicher laden und eigenen PV-Strom nutzen",
    description:
      "Eine Wallbox macht das Laden Ihres Elektroautos komfortabel, sicher und planbar. Wir wählen die passende Ladelösung für Fahrzeug, Hausanschluss und Energiesystem aus und verbinden sie auf Wunsch intelligent mit Photovoltaik und Stromspeicher.",
    primaryCta: {
      label: "Wallbox-Beratung anfragen",
      href: CONTACT_FORM_HREF,
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
      id: "wallbox-produkte",
      eyebrow: "Wallboxen für Ihr Energiesystem",
      title: "Welche Wallbox passt zu Ihrem Energiesystem?",
      text: [
        "Nicht jede Wallbox passt zu jeder Photovoltaik- oder Speicherlösung. Wir wählen die Ladetechnik passend zu Fahrzeug, Gebäudeanschluss und vorhandenem oder geplantem Energiesystem aus. Entscheidend sind die Schnittstellen zum Energiemanagement und Ihre gewünschten Ladefunktionen.",
      ],
    },
    {
      id: "pv-ueberschussladen",
      eyebrow: "Sonnenenergie für das Elektroauto",
      title: "Mit PV-Überschussladen mehr Solarstrom selbst nutzen",
      text: [
        "Beim PV-Überschussladen wird die aktuell nicht im Gebäude benötigte Solarenergie gezielt zum Laden des Elektrofahrzeugs verwendet. Dadurch kann der Eigenverbrauch der Photovoltaikanlage steigen.",
        "Das Fahrzeug muss dann angeschlossen sein, wenn Solarstrom verfügbar ist. Außerdem müssen Fahrzeug, Wallbox, Messtechnik und Energiemanagement zusammenpassen. Ein Hausspeicher ist dafür keine Voraussetzung; seine Nutzung wird mit dem übrigen Strombedarf abgestimmt.",
        "Automatische Phasenumschaltung bedeutet: Eine geeignete AC-Wallbox wechselt zwischen ein- und dreiphasigem Laden. So lassen sich auch geringere PV-Überschüsse nutzen. Das Energiemanagement stimmt ab, wie der verfügbare Strom auf Haus, Fahrzeug und gegebenenfalls Speicher verteilt wird. Die Funktion muss von Wallbox, Steuerung und Fahrzeug unterstützt werden.",
      ],
      cta: {
        label: "Photovoltaik kennenlernen",
        href: "/photovoltaik",
      },
    },
    {
      id: "bidirektionales-laden",
      eyebrow: "Energie in beide Richtungen",
      title: "Bidirektionales Laden: Das Elektroauto wird Teil des Energiesystems",
      text: [
        "Beim klassischen Laden fließt Strom vom Gebäude ins Fahrzeug. Bidirektionales Laden ermöglicht zusätzlich die umgekehrte Richtung: Energie aus der Fahrzeugbatterie kann das Gebäude versorgen oder ins Stromnetz zurückfließen.",
        "Vehicle-to-Home (V2H) bedeutet, dass das Fahrzeug Energie für das Haus bereitstellt. Vehicle-to-Grid (V2G) bezeichnet die Rückspeisung ins öffentliche Netz. Eine V2H-Funktion allein bedeutet noch nicht, dass auch V2G freigegeben ist.",
        "Wir bieten dafür das Sigen EV DC Lademodul im Sigenergy SigenStor-System an. Die tatsächliche V2X-Nutzung hängt von Fahrzeugmodell, Fahrzeugfreigabe, Software, Ladehardware und regulatorischen Voraussetzungen ab. Nicht jedes Elektroauto unterstützt diese Funktionen; wir prüfen die konkrete Kombination vor der Planung.",
      ],
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
      id: "wallbox-rechner",
      eyebrow: "Unverbindliche Modellrechnung",
      title: "Ladezeit, Fahrstrombedarf und Wallbox-Kosten vorab berechnen",
      text: [
        "Mit unserem Wallbox-Rechner erhalten Sie anhand von Fahrleistung, Fahrzeugverbrauch, Batteriekapazität und Ladeleistung eine erste Orientierung für den jährlichen Fahrstrombedarf und die typische Ladedauer.",
        "Zusätzlich berücksichtigt das Modell einen möglichen Photovoltaik-Anteil, veränderbare Strompreise sowie einen Kostenkorridor für Wallbox und Installation.",
      ],
      cta: {
        label: "Wallbox-Rechner öffnen",
        href: PUBLIC_ROUTES["wallbox-rechner"].href,
      },
    },
    {
      id: "komfort",
      eyebrow: "Laden im Alltag",
      title: "Komfortable Steuerung und transparente Verbrauchsdaten",
      text: [
        "Je nach System können Ladevorgänge geplant, gesteuert und dokumentiert werden. Apps oder Weboberflächen zeigen Ladezustand, Stromverbrauch und teilweise auch den Anteil des verwendeten Solarstroms.",
        "App-Steuerung und Verbrauchsdaten unterscheiden sich je nach Produkt und Systemkonfiguration. RFID kann Ladevorgänge einzelnen Nutzern zuordnen. Für die Dienstwagenabrechnung prüfen wir zusätzlich Zählerausführung, Eichrechtskonformität und die Anforderungen des Arbeitgebers – ein Verbrauchswert in der App allein genügt nicht für jeden Abrechnungsfall.",
      ],
    },
    {
      id: "unternehmen",
      eyebrow: "ABL eM4 · Gewerbe und Wohnungswirtschaft",
      title: "Wallboxen für Unternehmen und mehrere Ladepunkte",
      text: [
        "Wenn mehrere Fahrzeuge laden, zählen verfügbare Anschlussleistung, Nutzerverwaltung und nachvollziehbare Verbrauchserfassung. Wir planen Lastmanagement und Erweiterbarkeit von Anfang an mit ein.",
        "Die ABL eM4 ist als Single mit einem oder Twin mit zwei Ladepunkten erhältlich. Sie unterstützt Lastmanagement und die Anbindung an ein Backend über OCPP; eichrechtskonforme Varianten stehen für entsprechende Abrechnungsanforderungen zur Verfügung. Die passende Ausführung wählen wir für Unternehmen, Wohnungswirtschaft und gemeinsam genutzte Stellplätze aus.",
      ],
      cta: { label: "Ladeinfrastruktur besprechen", href: CONTACT_FORM_HREF },
    },
    {
      id: "installation",
      eyebrow: "Sicher umgesetzt",
      title: "Fachgerechte Wallbox-Installation",
      text: [
        "Die Wallbox wird als leistungsstarker elektrischer Verbraucher fest in die Gebäudeinstallation eingebunden. Deshalb gehören die Prüfung der vorhandenen Elektrik, passende Schutzkomponenten und eine fachgerechte Installation zwingend zur Umsetzung.",
        "Energie-Kraft plant und installiert Wallbox-Lösungen insbesondere im Berchtesgadener Land und Landkreis Traunstein sowie im regionalen Einsatzgebiet. Wir betrachten die Ladestation als Bestandteil Ihres gesamten Energie- und Mobilitätskonzepts und stimmen die erforderliche Anmeldung und Freigabe mit dem Netzbetreiber ab.",
      ],
      cta: {
        label: "Wallbox-Projekt besprechen",
        href: CONTACT_FORM_HREF,
      },
    },
  ],
} satisfies PublicPageContent;
