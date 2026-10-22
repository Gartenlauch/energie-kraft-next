import { PUBLIC_ROUTES } from "@/config/routes";

export const sonnenInformation = {
  path: PUBLIC_ROUTES["sonnen-insolvenz"].href,
  date: "2026-10-22",
  displayDate: "22.10.2026",
  title: "sonnen Insolvenz 2026 – Was bedeutet das für Ihre sonnenBatterie?",
  seo: {
    title: "sonnen Insolvenz 2026: Speicher & Service | Energie-Kraft Süd",
    description:
      "sonnen Insolvenz: Was für sonnenBatterie, Garantie, Ersatzteile und App bekannt ist. Energie-Kraft Süd bleibt mit eigener Serviceabteilung Ihr Ansprechpartner.",
    canonicalPath: PUBLIC_ROUTES["sonnen-insolvenz"].href,
  },
  image: {
    src: "/images/sonnen-service/sonnenbatterie-service-hero.webp",
    mobileSrc: "/images/sonnen-service/sonnenbatterie-service-mobile.webp",
    alt: "sonnenBatterie 10 performance in einem hellen Hausflur mit Holzfußboden",
    width: 1920,
    height: 1080,
  },
  sources: [
    {
      label: "pv magazine Global: Sonnen files for insolvency",
      href: "https://www.pv-magazine.com/2026/10/22/sonnen-files-for-insolvency/",
      description:
        "Bericht vom 22.10.2026 zum Insolvenzantrag und zur geplanten Bestandskundenbetreuung; unter Bezug auf Handelsblatt.",
    },
    {
      label: "Bundesjustizministerium: Gewährleistung und Garantie beim Kauf von Waren",
      href: "https://www.bmj.de/DE/themen/kaufen_reisen_wohnen/onlinekauf/onlinekauf_artikel.html",
      description:
        "Allgemeine rechtliche Einordnung der gesetzlichen Mängelrechte und freiwilligen Garantie.",
    },
    {
      label: "sonnen: Kontakt und Servicewege",
      href: "https://sonnen.de/kontakt/",
      description:
        "Herstellerkontakt für Bestandskunden; die Erreichbarkeit einzelner Angebote kann sich ändern.",
    },
  ],
  questions: [
    {
      id: "technische-stoerungen",
      title: "Wer hilft bei technischen Störungen meiner sonnenBatterie?",
      paragraphs: [
        "Energie-Kraft Süd bleibt Ihr Ansprechpartner für den sonnenBatterie Service. Das gilt für Anliegen zu bestehenden Speichern ebenso wie zu sonnen-Wallboxen.",
        "Unsere Serviceabteilung ist weiterhin für unsere Bestandskunden erreichbar. Wir betreuen vorrangig sonnen-Anlagen, die von Energie-Kraft Süd installiert oder bereits betreut wurden. Ob darüber hinaus Unterstützung möglich ist, prüfen wir abhängig vom jeweiligen Anliegen und unseren verfügbaren Kapazitäten.",
        "Halten Sie Modell, Seriennummer, Installationsdatum und die genaue Fehlermeldung bereit. Fotos der Anzeige und vorhandene Betriebsdaten helfen bei der Einordnung. Wir stimmen den nächsten Prüfschritt mit Ihnen ab. Reparaturumfang, benötigte Teile, Termin und mögliche Kosten werden für den Einzelfall geklärt.",
      ],
    },
    {
      id: "ersatzteile-software",
      title: "Sind Ersatzteile und Software-Updates für sonnenBatterien weiterhin verfügbar?",
      paragraphs: [
        "Eine langfristige Versorgung mit Ersatzteilen und Software-Updates lässt sich derzeit nicht verbindlich zusagen. Die angekündigte Fortführung der Bestandskundenbetreuung ist keine Zusicherung, dass jedes Bauteil oder jede digitale Funktion dauerhaft verfügbar bleibt.",
        "Bei einer konkreten Störung prüfen wir die benötigte Komponente und die verfügbaren Servicewege. Ob ein Ersatzteil beschafft werden kann oder ein Update für Ihr Modell freigegeben ist, muss jeweils aktuell geklärt werden. Bewahren Sie Anlagendokumentation und vorhandene Fehlermeldungen auf. Nehmen Sie Änderungen an Software oder Einstellungen nur nach Herstelleranleitung oder fachlicher Abstimmung vor.",
      ],
    },
    {
      id: "garantie-gewaehrleistung",
      title: "Was passiert mit der Garantie meiner sonnenBatterie nach der Insolvenz?",
      paragraphs: [
        "Herstellergarantie und gesetzliche Gewährleistung sind unterschiedliche Ansprüche. Eine sonnen Garantie richtet sich gegen den in Ihren Garantiebedingungen genannten Garantiegeber und nach den dort geregelten Voraussetzungen. Der Insolvenzantrag allein beantwortet nicht, wie ein konkreter Garantiefall abgewickelt wird. Die tatsächliche Erfüllung durch den Hersteller ist derzeit nicht abschließend gesichert.",
        "Sichern Sie Rechnung, Vertrag, Inbetriebnahmeprotokoll und Garantieunterlagen. Melden Sie einen Mangel zeitnah schriftlich bei Ihrem Vertragspartner. Wir unterstützen bei der technischen Dokumentation, übernehmen damit aber keine Herstellergarantie. Für die rechtliche Prüfung individueller Ansprüche helfen eine Verbraucherzentrale oder eine anwaltliche Beratung.",
      ],
    },
    {
      id: "app-monitoring-wallbox",
      title:
        "Was tun, wenn die sonnen-App, das Monitoring oder die Wallbox nicht mehr funktioniert?",
      paragraphs: [
        "Eine nicht erreichbare sonnen App oder fehlende Monitoring-Daten beweisen für sich genommen keinen Defekt des Speichers. Ursache können die lokale Internetverbindung, die Kommunikation einzelner Geräte oder ein externer Dienst sein. Welche Anlagenfunktionen tatsächlich betroffen sind, muss getrennt geprüft werden.",
        "Prüfen Sie zunächst, ob Ihr Internetzugang funktioniert, und notieren Sie Zeitpunkt, Fehlermeldung sowie den sichtbaren Status von Speicher oder Wallbox. Geben Sie diese Informationen mit Ihrer Serviceanfrage weiter. Teilen Sie keine Passwörter oder Zugangscodes mit. Öffnen Sie keine Gerätegehäuse und überbrücken Sie keine Schutzeinrichtungen. Neustarts oder Änderungen erfolgen nur nach der jeweiligen Anleitung oder fachlicher Rücksprache.",
        "Bei einer Wallbox betrachten wir zusätzlich Fahrzeug, Ladefreigabe und Energiemanagement. Eine dauerhafte Verfügbarkeit von Cloud-Steuerung, App-Funktionen oder künftigen Freigaben können wir nicht versprechen.",
      ],
    },
  ],
} as const;
