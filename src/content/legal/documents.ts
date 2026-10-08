// Verbatim public legal copy retrieved on 2026-10-08.
// Sources: https://www.energie-kraft.de/impressum/ and https://www.energie-kraft.de/agb/
// Only the imprint agency credit ("konzeption und realisation") is omitted.
// Whitespace and semantic markup are normalized; wording and numbering are unchanged.
// Do not edit legal wording without an explicitly approved replacement source.

export type LegalBlock =
  | { readonly type: "paragraph" | "heading"; readonly text: string }
  | { readonly type: "list"; readonly items: readonly string[] };

export interface LegalDocumentContent {
  readonly introduction?: string;
  readonly sections: readonly {
    readonly title: string;
    readonly blocks: readonly LegalBlock[];
  }[];
}

export const imprintContent = {
  sections: [
    {
      title: "firmeninformation",
      blocks: [
        {
          type: "heading",
          text: "Firmenwortlaut:",
        },
        {
          type: "paragraph",
          text: "Energie-Kraft Süd GmbH & Co. KG",
        },
        {
          type: "heading",
          text: "Rechtsform:",
        },
        {
          type: "paragraph",
          text: "Gesellschaft mit beschränkter Haftung & Compagnie Kommanditgesellschaft (GmbH & Co. KG)",
        },
        {
          type: "heading",
          text: "Registergericht:",
        },
        {
          type: "paragraph",
          text: "Amtsgericht Traunstein, Registernummer: HRA9372",
        },
        {
          type: "paragraph",
          text: "Vertreten durch die Geschäftsführer: Markus Österlein, Kai Stengle",
        },
        {
          type: "heading",
          text: "Vertretungsberechtigte Gesellschafterin (Komplementärin):",
        },
        {
          type: "paragraph",
          text: "Energie-Kraft Süd Verwaltungs GmbH",
        },
        {
          type: "paragraph",
          text: "Registergericht: Amtsgericht Traunstein, Registernummer: HRB17443,",
        },
        {
          type: "paragraph",
          text: "Vertreten durch die Geschäftsführer: Markus Österlein, Kai Stengle",
        },
        {
          type: "heading",
          text: "Unternehmensgegenstand:",
        },
        {
          type: "paragraph",
          text: "Verkauf und Installation von Energieerzeugungsanlagen im Bereich",
        },
        {
          type: "paragraph",
          text: "der erneuerbaren Energien sowie deren Wartung und Serviceleistungen",
        },
        {
          type: "heading",
          text: "Registereintrag:",
        },
        {
          type: "paragraph",
          text: "UID-Nummer: DE814795925",
        },
        {
          type: "paragraph",
          text: "Registernummer: HRA9372",
        },
        {
          type: "paragraph",
          text: "Registergericht: Amtsgericht Traunstein",
        },
        {
          type: "heading",
          text: "Firmensitz / Anschrift:",
        },
        {
          type: "paragraph",
          text: "Gewerbestraße 12",
        },
        {
          type: "paragraph",
          text: "83404 Ainring",
        },
        {
          type: "paragraph",
          text: "Deutschland",
        },
        {
          type: "heading",
          text: "Geschäftsführer:",
        },
        {
          type: "paragraph",
          text: "Kai Stengle",
        },
        {
          type: "paragraph",
          text: "Markus Österlein",
        },
        {
          type: "heading",
          text: "Kontakt:",
        },
        {
          type: "paragraph",
          text: "Telefon: +49 (0) 8654/77161-0",
        },
        {
          type: "paragraph",
          text: "E-Mail: office@energie-kraft.de",
        },
        {
          type: "heading",
          text: "Hinweis auf EU-Streitschlichtung",
        },
        {
          type: "paragraph",
          text: "Plattform der EU-Kommission zur Online-Streitbeilegung:",
        },
        {
          type: "paragraph",
          text: "https://ec.europa.eu/consumers/odr/",
        },
        {
          type: "paragraph",
          text: "Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder verpflichtet noch bereit.",
        },
      ],
    },
    {
      title: "haftungsausschluss",
      blocks: [
        {
          type: "paragraph",
          text: "Die Energie-Kraft Süd GmbH & Co. KG geht bei der Erfassung der auf dieser Website angebotenen Daten mit großer Sorgfalt vor. Die auf dieser Website angebotenen Informationen werden ständig ohne vorherige Ankündigung überprüft und aktualisiert. Wir weisen darauf hin, dass sich Daten inzwischen geändert haben können.",
        },
        {
          type: "paragraph",
          text: "Die Energie-Kraft Süd GmbH & Co. KG übernimmt keine Gewährleistung oder Garantie für die Aktualität, Richtigkeit und Vollständigkeit dieser Informationen. Die Energie-Kraft Süd GmbH & Co. KG haftet auf keinen Fall für unmittelbare, konkrete Schäden oder Folgeschäden oder sonstige Schäden jeglicher Art, die aus welchem Grund auch immer im Zusammenhang mit dem indirekten oder direkten Gebrauch der auf dieser Website bereitgestellten Informationen entstehen. Dies gilt auch für alle anderen Websites, auf die mittels Hyperlinks verwiesen wird.",
        },
      ],
    },
  ],
} satisfies LegalDocumentContent;

export const agbContent = {
  introduction: "Allgemeine Geschäftsbedingungen Energiekraft Süd GmbH & Co. KG, Stand 01.02.2025",
  sections: [
    {
      title: "1. anwendungsbereich",
      blocks: [
        {
          type: "paragraph",
          text: "1.1 Diese Allgemeinen Geschäftsbedingungen gelten für alle von uns zu erbringenden Leistungen - unabhängig ihres tatsächlichen und rechtlichen Charakters - ausschließlich. Sonstige Allgemeine Geschäftsbedingungen, insbesondere jene unserer Kunden, werden ausdrücklich nicht, auch nicht ergänzend, Gegenstand unserer vertraglichen Leistungen, es sei denn, wir haben deren Geltung in Textform zugestimmt. Eine konkludente Zustimmung fremder Allgemeiner Geschäftsbedingungen wird ausgeschlossen. Eine derartige Zustimmung wird insbesondere auch nicht dadurch erteilt, dass wir diesen nach Eingang bei uns nicht widersprechen oder Leistungen in Kenntnis entgegenstehender oder von unseren Geschäftsbedingungen abweichender Bedingungen des Kunden vorbehaltlos ausführen.",
        },
        {
          type: "paragraph",
          text: "1.2 Diese Geschäftsbedingungen gelten grundsätzlich sowohl gegenüber Verbrauchern als auch gegenüber Unternehmern gleichermaßen, es sei denn, der Anwendungsbereich einer jeweiligen Klausel wird nachfolgend ausnahmsweise ausdrücklich eingegrenzt.",
        },
      ],
    },
    {
      title: "2. vertragsschluss, angebot und annahme",
      blocks: [
        {
          type: "paragraph",
          text: "2.1 Voraussetzung eines Vertragsabschlusses sind gemäß §§ 145 ff. BGB zwei übereinstimmende Willenserklärungen.",
        },
        {
          type: "paragraph",
          text: "2.2 Unsere Angebote sind zunächst freibleibend und unverbindlich, ausgenommen den Fall, dass ausdrücklich ein verbindliches Angebot abgegeben wird. Das Auftragsschreiben des Kunden stellt somit erst ein bindendes Angebot auf Abschluss eines Vertrags dar. Dieses Angebot können wir innerhalb von 14 Tagen nach Zugang des Auftragsschreibens bei uns annehmen. Bis zum Ablauf dieses Zeitraums ist das Auftragsschreiben für den Kunden bindend. Für die Rechtzeitigkeit der Annahme ist der Zugang unserer Auftragsbestätigung (Annahme) beim Kunden entscheidend. Geht unsere Auftragsbestätigung beim Kunden verspätet ein, wird dieser uns hierüber unverzüglich informieren. Alternativ zur Auftragsbestätigung kommt ein Vertrag auch durch die beidseitige Unterschrift unter einem gesonderten Vertragsdokument zustande, dass wir in einem Abstimmungstermin gemeinsam mit dem Kunden ausfüllen.",
        },
      ],
    },
    {
      title: "3. zahlungsbedingungen, preise, eigentumsvorbehalt",
      blocks: [
        {
          type: "paragraph",
          text: "3.1 Sämtliche Zahlungen finden bargeldlos statt und sind fristgemäß auf das sich aus unseren Rechnungen ergebende Konto zu leisten.",
        },
        {
          type: "list",
          items: [
            '3.1.1 Bis zur vollständigen Bezahlung behalten wir uns das Eigentum an gelieferten Waren nebst Zubehör vor (nachfolgend: „Vorbehaltsware");',
            "3.1.2 Der Kunde darf die Vorbehaltsware nur im gewöhnlichen Geschäftsverkehr weiterveräußern bzw. vermieten. Zu anderen Verfügungen über die Vorbehaltsware, insbesondere zu ihrer Verpfändung oder Sicherungsübereignung, ist der Kunde nicht berechtigt;",
            "3.1.3 Der Kunde tritt an uns für den Fall der Weiterveräußerung/ Vermietung der Vorbehaltsware schon jetzt - bis zur Erfüllung aller unserer Ansprüche - die ihm aus den genannten Geschäften entstehenden Forderungen gegen seine Kunden zur Sicherheit ab;",
            "3.1.4 Werden Eigentumsvorbehaltsgegenstände als wesentliche Bestandteile in das Grundstück/Gebäude des Kunden eingebaut, überträgt der Kunde uns unmittelbar mit dem Einbau die in einem dem Wert der Vorbehaltsware zum Wert des Grundstücks/Gebäudes entsprechenden Eigentumsrechte hieran;",
            "3.1.5 Über Zwangsvollstreckungsmaßnahmen Dritter in die Vorbehaltsware hat uns der Kunde unverzüglich unter Übergabe der für eine Intervention notwendigen Unterlagen zu unterrichten; dies gilt auch für Beeinträchtigungen sonstiger Art. Unabhängig davon hat der Kunde bereits im Vorhinein Dritte auf die an den Gegenständen bestehenden Rechte hinzuweisen, die mit unseren Lieferungen und Leistungen in Berührung kommen.",
          ],
        },
        {
          type: "paragraph",
          text: "3.2 Der Kunde ist ermächtigt, die an uns aus dem Weiterverkauf bzw. der Vermietung der Vorbehaltsware abgetretenen Forderungen einzuziehen. Wir sind zum Widerruf der Einziehungsermächtigung und der Erlaubnis zum Weiterverkauf nach Ziffer 3.1.2 berechtigt, für den Fall, dass",
        },
        {
          type: "list",
          items: [
            "3.2.1 nach Vertragsschluss eine wesentliche Verschlechterung in den Vermögensverhältnissen des Kunden erkennbar wird, durch die ein Anspruch von uns gefährdet wird, insbesondere bei Zahlungseinstellung oder einem Antrag auf Eröffnung des Insolvenzverfahrens über das Vermögen des Kunden;",
            "3.2.2 sich der Kunde mit Zahlungen in Verzug befindet; oder",
            "3.2.3 der Kunde außerhalb eines ordnungsgemäßen Geschäftsverkehrs über die Vorbehaltsware verfügt hat.",
          ],
        },
        {
          type: "paragraph",
          text: "3.3 Unser Anspruch auf (Abschlags-)Zahlungen richtet sich nach dem Leistungsfortschritt nach Maßgabe der vereinbarten Zahlungsbedingungen.",
        },
        {
          type: "paragraph",
          text: "3.4 Abschlagszahlungen werden innerhalb von 14 Kalendertagen und die Schlusszahlung innerhalb von 30 Kalendertagen nach Zugang der jeweiligen Rechnung fällig, soweit mit unserem Angebot nicht andere Fälligkeitsfristen vereinbart wurden. Leistet der Kunde innerhalb dieser Zeiträume nicht, gerät er automatisch mit der Zahlung in Verzug.",
        },
        {
          type: "paragraph",
          text: "3.5 Nur für Unternehmer: Sollte zwischen Vertragsabschluss und dem vereinbarten Lieferzeitpunkt bzw. Leistungsbeginn ein Zeitraum von mehr als vier Monaten liegen, in dem es zu lieferantenbedingten Preiserhöhungen um mehr als 10 % kommt, sind wir gegen Nachweis der Erhöhung berechtigt, unsere Preise entsprechend anzupassen. Etwaige Preiserhöhungen werden dem Kunden unverzüglich mitgeteilt. Sofern der ursprünglich vereinbarte Vertragsgesamtpreis hierdurch um mehr als 5 % steigt, ist der Kunde berechtigt, vom Vertrag zurückzutreten.",
        },
      ],
    },
    {
      title: "4. pflichten des kunden, versicherungspflicht",
      blocks: [
        {
          type: "paragraph",
          text: "4.1 Der Kunde ist verpflichtet, sämtliche für die Herstellung, Lieferung oder den Einbau der nach dem Vertrag zu erbringenden Leistungen erforderlichen Zustimmungen, Genehmigungen, Anordnungen und Mitteilungen öffentlich- wie privatrechtlicher Natur so rechtzeitig vor deren Beginn einzuholen, dass es zu keinen Verzögerungen kommt.",
        },
        {
          type: "paragraph",
          text: "4.2 Der Kunde versichert, dass er entweder Eigentümer des Grundstücks/Gebäudes ist, auf dem die vertragsgegenständliche Leistung erbracht oder zu dem die Ware geliefert werden soll oder er zumindest eine vergleichbare Berechtigung besitzt.",
        },
        {
          type: "paragraph",
          text: "4.3 Der Kunde hat die Pflicht uns bzw. den von uns zur Erbringung der vereinbarten Leistung unterbeauftragten Dritten spätestens bis zum vereinbarten Zeitpunkt des Beginns der Leistungserbringung die Flächen auf dem Grundstück/Gebäude behinderungsfrei zur Verfügung zu stellen sowie sämtliche Pläne und Unterlagen zu übergeben, die für die vertragsgemäße Ausführung der zu erbringenden Leistungen erforderlich sind.",
        },
        {
          type: "paragraph",
          text: "4.4 Der Kunde trägt das Baugrundrisiko. Sofern dem Kunden etwaige Unwägbarkeiten, Gefahren oder anderweitige Besonderheiten, im Bereich des Baufeldes oder Mängel in anderen Bereichen der Anlage bekannt sein sollten, hat er die Pflicht, uns rechtzeitig vor Beginn der Leistungen hierauf schriftlich hinzuweisen. Diese Pflicht umfasst auch den Hinweis auf alle vorhandenen Wasser-, Abwasserrohre, elektrische Leitungen etc., die mit den von uns auszuführenden Leistungen in Konflikt stehen könnten. Für etwaige Schäden oder Mängel, die darauf zurückzuführen sind, dass der Kunde seiner Hinweispflicht nicht oder nur unzureichend nachgekommen ist, übernehmen wir, mit Ausnahme bei Vorsatz und grober Fahrlässigkeit, keine Haftung.",
        },
        {
          type: "paragraph",
          text: "4.5 Im Falle einer Aufdachanlage hat der Kunde die Mangelfreiheit der Gewerke, auf denen die Anlage aufsetzt, vor Montagebeginn sowohl im Hinblick auf deren statische Eignung und Tragfähigkeit als auch im Hinblick auf deren Dichtigkeit hin zu überprüfen und uns vor dem geplanten Montagebeginn auf etwaige Mängel im vorbenannten Sinn hinzuweisen. Dem Kunden ist bekannt, dass, sollte er keine eigene Fachexpertise besitzen, er insoweit angehalten ist, diese Gewerke zuvor auf eigene Kosten durch einen Sachverständigen (Dachdecker/Baustatiker) begutachten zu lassen. Eine Haftung für von uns nicht zu vertretende Mängel und Schäden der Vorgewerke ist ebenso ausgeschlossen, wie die Haftung für Mängel oder Schäden an unseren Werkleistungen, sofern diese auf einem unterlassenen Hinweis des Kunden beruhen. Im Übrigen hat uns der Kunde im Fall eines Ziegeldachs Ersatz-Dachziegel für eine Fläche von mindestens 2 % der gesamten Dachfläche unentgeltlich zur Verfügung zu stellen.",
        },
        {
          type: "paragraph",
          text: "4.6 Unabhängig vom Abschluss eines Wartungsvertrages ist der Kunde verpflichtet, die Anlage nach Inbetriebnahme regelmäßig auf deren ordnungsgemäßen Betrieb, insbesondere hinsichtlich der Leistungsdaten und Störmeldungen, hin zu überprüfen.",
        },
        {
          type: "paragraph",
          text: "Kommt der Kunde dem nicht nach, haften wir weder für entstehende Nutzungs- und Betriebsausfallschäden noch für eine Verringerung der Einspeisevergütung.",
        },
        {
          type: "paragraph",
          text: "4.7 Der Kunde ist verpflichtet, uns sowie etwaigen von uns beauftragten Nachunternehmern während des gesamten Bauvorhabens ungehinderten Zugang zu den Grundstücken, Gebäudeteilen bzw. Dachflächen, auf denen die Anlage errichtet werden soll, zu gewährleisten, soweit es zur Erbringung unserer Leistungen erforderlich ist.",
        },
        {
          type: "paragraph",
          text: "4.8 Wir sind berechtigt jedoch nicht verpflichtet, die Örtlichkeiten vor dem Leistungsbeginn zu besichtigen und zu prüfen, ob die Voraussetzungen der Ziffern 4.1 bis 4.7 erfüllt sind. Soweit erforderlich, hat der Kunde uns hierfür Zugang zu gewähren.",
        },
        {
          type: "paragraph",
          text: "4.9 Dem Kunden ist bewusst, dass, sollten die Voraussetzungen der Ziffern 4.1 bis 4.7 nicht erfüllt sein, sich zum einen die Vertragstermine um die Dauer der Verzögerung mit einem Zuschlag für die Wiederaufnahme der Arbeiten und eine etwaige Verschiebung in eine ungünstigere Jahreszeit verschieben und zum anderen Mehrkosten entstehen können, die der Kunde zu zahlen hat. Der Kunde hat uns daher unverzüglich zu benachrichtigen, sobald der Eintritt von Verzögerungen absehbar ist.",
        },
        {
          type: "paragraph",
          text: "4.10 Klargestellt wird, dass unsererseits keine anderen, auch keine an die Ausführung der von uns angebotenen Leistungen angrenzenden, Gewerke ausgeführt werden. Insbesondere erbringen wir keine Erd-, Pflaster-, Maurer-, Putzer-, Maler-, Reinigungs-, Abdichtungs- oder Dachdeckerarbeiten. Insoweit ist dem Kunden bekannt, dass er ggfs. weitere Handwerker zu beauftragen hat. Die Baustelle wird von uns besenrein zurückgelassen. Sollten unsere Leistungen die Leistung anderer Unternehmen erforderlich machen, werden wir den Kunden hierauf hinweisen und die Schnittstelle zu unseren Leistungen koordinieren und abstimmen.",
        },
        {
          type: "paragraph",
          text: "4.11 Dem Kunden ist bekannt, dass es sich bei allen Zeichnungen, Plänen, Renderings etc. ausschließlich um unverbindliche Entwurfsskizzen handelt. Die Ausführung vor Ort kann aus technischen Gründen hiervon abweichen. Ein Anspruch auf Übereinstimmung der Bauausführung mit den Entwurfsskizzen hat der Kunde nicht.",
        },
        {
          type: "paragraph",
          text: "4.12 Wir weisen auf die erhöhte Rutschgefahr von Schneemassen auf Photovoltaikmodulen hin. Insbesondere bei Aufdachanlagen besteht ein erhöhtes Unfall- bzw. Verletzungsrisiko aufgrund möglicher Dachlawinen. Durch den Aufbau einer Photovoltaikanlage, kann es insbesondere dazu kommen, dass Schneefänge ihren Zweck nicht mehr erfüllen. Der Kunde ist zur entsprechenden Verkehrssicherung verpflichtet.",
        },
        {
          type: "paragraph",
          text: "4.13 Der Kunde ist verpflichtet, die von uns erbrachten Leistungen mindestens zur vollen Zahlung der Schlussrechnung insbesondere gegen Feuer-, Sturm-, Hagel-, Überspannungs- und Diebstahlschäden zu versichern und uns den Versicherungsschutz nach Aufforderung nachzuweisen.",
        },
      ],
    },
    {
      title: "5. lieferung, gefahrübergang und abnahme",
      blocks: [
        {
          type: "paragraph",
          text: "5.1 Bei der Lieferung einer Ware geht die Gefahr des zufälligen Untergangs und der zufälligen Verschlechterung bei einem Kunden, der Verbraucher ist, mit deren Übergabe auf den Kunden über. Ist der Kunde Unternehmer, geht die Gefahr mit der Übergabe auf einen zum Transport bestimmten Dritten auf den Kunden über.",
        },
        {
          type: "paragraph",
          text: "5.2 Im Falle eines Werkvertrages geht die Leistungs- und Vergütungsgefahr mit dem Zeitpunkt auf den Kunden über, in dem er die tatsächliche Sachherrschaft über die erbrachten Leistungen erhält, spätestens aber mit der Abnahme.",
        },
        {
          type: "paragraph",
          text: "5.3 Unsere Leistungen sind abzunehmen, sofern das Gesetz dies vorsieht, eine Abnahme vertraglich vereinbart wurde oder wir den Kunden gesondert zur Erklärung einer förmlichen Abnahme auffordern. Für sinnvoll abgrenzbare, selbstständig nutzbare Teile unserer Leistungen sind wir berechtigt, Teilabnahmen zu verlangen.",
        },
        {
          type: "paragraph",
          text: "5.4 Sollte keine förmliche Abnahme gefordert sein, treten bei werkvertraglichen Leistungen die Abnahmewirkungen",
        },
        {
          type: "list",
          items: [
            "5.4.1 Spätestens zwölf Werktage (Montag bis einschließlich Samstag) nach der Anzeige der Fertigstellung der Leistungen ein, sofern der Kunde die Abnahme innerhalb dieses Zeitraums nicht unter Angabe mindestens eines wesentlichen Mangels verweigert.",
            "5.4.2 Nach Ablauf von sechs Werktagen (Montag bis einschließlich Freitag) ein, nachdem der Kunde die Leistung oder einzelne Teile der Leistung in Benutzung genommen hat.",
          ],
        },
        {
          type: "paragraph",
          text: "5.5 In jedem Fall steht uns ein Anspruch auf Durchführung einer gemeinsamen Feststellung des Zustands unserer Leistungen unverzüglich nach der Fertigstellung der Modulmontage zu. Mit der Durchführung dieser Zustandsfeststellung geht die Gefahr des zufälligen Untergangs und der zufälligen Verschlechterung dieser Teilleistungen sowie die diesbezüglichen Verkehrssicherungspflichten auf den Kunden über. Wir laden den Kunden rechtzeitig zum Termin der Zustandsfeststellung ein. Sollte der Kunde diesem Termin unentschuldigt fernbleiben, sind wir berechtigt, die Zustandsfeststellung allein durchzuführen, wobei das Ergebnis für den Kunden verbindlich ist.",
        },
      ],
    },
    {
      title: "6. termine",
      blocks: [
        {
          type: "paragraph",
          text: "6.1 Die Einhaltung vereinbarter Ausführungszeiträume und Termine setzt die vertragsgemäße Mitwirkung des Kunden, insbesondere die uneingeschränkte Beachtung und Umsetzung der sich aus den Ziffern 4.1 bis 4.7 ergebenden Pflichten, voraus.",
        },
        {
          type: "paragraph",
          text: "6.2 Nachdem unsere Leistungen in der Regel unter freiem Himmel zu erbringen sind, setzt die Einhaltung der vereinbarten Termine außerdem voraus, dass die Witterungsbedingungen die plangemäße Ausführung zulassen. Dies kann insbesondere im Fall von Gewitter, Sturm, Regen, Schnee oder Frost nicht möglich sein.",
        },
        {
          type: "paragraph",
          text: "6.3 In den Fällen der Ziffern 6.2 und 6.3 sowie bei sonstigen Ereignissen höherer Gewalt und allen von uns nicht zu vertretenden, unter Anwendung der im Einzelfall zumutbaren Sorgfalt nicht abwendbaren Ereignissen, insbesondere währungs-, handelspolitische, sonstige hoheitliche Maßnahmen, Streik, Pandemien, Kriegsereignisse, wesentliche Betriebsstörungen (z. B. Feuer, Maschinenbruch, Rohstoff- oder Energiemangel) und nicht nur kurzfristige Lieferschwierigkeiten, die unsere Leistungsausführung behindern, verlängern bzw. verschieben sich die vereinbarten Ausführungszeiträume bzw. Termine um die Dauer der Behinderung mit einem Zuschlag für die Wiederaufnahme der Arbeiten und die etwaige Verschiebung in eine ungünstigere Jahreszeit.",
        },
        {
          type: "paragraph",
          text: "6.4 Ausschließlich für Unternehmer gilt: Hat der Kunde eine Mitwirkungspflicht, insbesondere im Zusammenhang mit den Ziffern 4.1 bis 4.7, schuldhaft verletzt, sodass wir in der ordnungsgemäßen Ausführungen unserer Leistungen behindert sind, hat uns der Kunde ab dem Zeitpunkt, ab dem er sich in Verzug mit der Annahme der Leistung befindet, pro Werktag des Annahmeverzugs eine Vertragsstrafe in Höhe von 0,1 % der Bruttoauftragssumme, höchstens jedoch insgesamt 5 % der Bruttoauftragssumme, zu zahlen. Die Geltendmachung von Schadensersatzansprüchen neben der Vertragsstrafe bleibt unberührt. Eine verwirkte Vertragsstrafe wird auf solche Schadensersatzansprüche jedoch angerechnet.",
        },
        {
          type: "paragraph",
          text: "6.5 Bei einer Warenlieferung an einen Unternehmer gelten die vereinbarten Liefertermine mit der Anzeige der Versandbereitschaft als eingehalten.",
        },
      ],
    },
    {
      title:
        "7. untersuchungs- und rügepflicht (nur für unternehmer im rahmen von kauf- und werklieferungsverträgen)",
      blocks: [
        {
          type: "paragraph",
          text: "7.1 In allen Fällen eines Kauf- oder Werklieferungsvertrags hat der Kunde die gelieferte Ware unverzüglich nach Ablieferung auf Menge und Beschaffenheit hin zu untersuchen.",
        },
        {
          type: "paragraph",
          text: "7.2 Erkennbare Sachmängel sind uns unverzüglich, spätestens jedoch innerhalb von fünf Arbeitstagen (Montag bis einschließlich Freitag) nach Ablieferung der Ware schriftlich anzuzeigen. Verdeckte Sachmängel sind uns unverzüglich, spätestens jedoch innerhalb von fünf Arbeitstagen nach ihrer Entdeckung schriftlich anzuzeigen.",
        },
        {
          type: "paragraph",
          text: "7.3 Kommt der Kunde den sich aus den Ziffern 7.1 und 7.2 ergebenden Pflichten nicht nach, gilt die Ware als genehmigt und dem Kunden stehen Ansprüche im Zusammenhang hiermit nicht mehr zu. Das gilt nicht, wenn der Mangel objektiv nicht erkennbar war, wir den Mangel arglistig verschwiegen oder eine Garantie für die Beschaffenheit der Sache übernommen haben.",
        },
        {
          type: "paragraph",
          text: "7.4 Sollte die Ware darüber hinaus auch einer Abnahme durch den Kunden unterliegen, ist die Rüge etwaiger Sachmängel im Sinne der Ziffer 7.2 ausgeschlossen, die für den Kunden bei der Abnahme erkennbar waren und dennoch nicht vorbehalten wurden.",
        },
        {
          type: "paragraph",
          text: "7.5 Der Kunde ist verpflichtet, uns mit der Anzeige etwaiger Mängel an der gelieferten Ware auch die Gelegenheit einzuräumen, diese vor Ort anzusehen, zu überprüfen und, falls erforderlich, auszubauen. Der Kunde stimmt bereits jetzt zu, dass diese Gelegenheit neben uns auch unmittelbar von unseren Zulieferern, Produktherstellern und jedem anderen hierzu von uns bestimmten Dritten wahrgenommen werden kann.",
        },
      ],
    },
    {
      title: "8. mängel und haftung",
      blocks: [
        {
          type: "paragraph",
          text: "8.1 Etwaige Gewährleistungsansprüche des Kunden richten sich nach den gesetzlichen Vorgaben.",
        },
        {
          type: "paragraph",
          text: "8.2 Schadens- und Aufwendungsersatzansprüche des Kunden, gleich aus welchem Rechtsgrund, sind ausgeschlossen, soweit es sich nicht handelt",
        },
        {
          type: "list",
          items: [
            "8.2.1 um Aufwendungsersatzansprüchen nach § 439 Abs. 2, 3 BGB;",
            "8.2.2 um eine Haftung nach dem Produkthaftungsgesetz;",
            "8.2.3 um einen Fall des Vorsatzes oder der groben Fahrlässigkeit;",
            "8.2.4 bei schuldhafter Verletzung des Lebens, des Körpers oder der Gesundheit;",
            "8.2.5 bei Verletzung wesentlicher Vertragspflichten, das heißt solcher Pflichten, deren Erfüllung die ordnungsgemäße Durchführung des Vertrages erst ermöglichen und auf deren Einhaltung der Kunde deshalb vertrauen darf. Die Haftung wegen Verletzung wesentlicher Vertragspflichten ist jedoch beschränkt auf den Ersatz des vorhersehbaren, vertragstypischen Schadens, soweit wir nicht aufgrund Vorsatzes oder grober Fahrlässigkeit, Verletzung des Lebens, des Körpers oder der Gesundheit oder nach dem Produkthaftungsgesetz haften.",
          ],
        },
        {
          type: "paragraph",
          text: "8.3 Soweit unsere Haftung gemäß Ziff. 8.2 ausgeschlossen oder beschränkt ist, umfasst das auch die persönliche Haftung unserer Mitarbeiter, Erfüllungsgehilfen und gesetzlichen Vertreter.",
        },
        {
          type: "paragraph",
          text: "8.4 Mängelansprüche bestehen nicht wegen Schäden, die nach dem Gefahrenübergang auf eine fehlerhafte, unsachgemäße Nutzung oder Wartung, übermäßige Beanspruchung, ungeeignete Betriebsmittel, natürliche Abnutzung oder anderweitige äußere Einflüsse zurückzuführen sind, die nicht in unserem Verantwortungsbereich liegen.",
        },
        {
          type: "paragraph",
          text: "8.5 Im Falle einer Nachlieferung gilt für Unternehmer Ziffer 7.",
        },
      ],
    },
    {
      title: "9. garantien",
      blocks: [
        {
          type: "paragraph",
          text: "9.1 Für den Fall, dass seitens des Herstellers/Lieferanten (Garantiegeber) einzelner Komponenten unserer Leistungen eine Garantie ausgegeben wird, weisen wir hiermit ausdrücklich darauf hin, dass es sich hierbei um eine sog. Herstellergarantie handelt. Wir selbst treten nicht in diese Garantiebedingungen ein. Wir sind nicht verpflichtet, den Kunden bei der Durchsetzung eines Garantieanspruchs gegenüber des Garantiegebers zu beraten, hierbei mitzuwirken oder auf andere Weise zu unterstützen.",
        },
        {
          type: "paragraph",
          text: "9.2 Ansprüche aus der Garantie stehen ausschließlich dem Endkunden gegenüber dem Garantiegeber zu. Für den Fall, dass es sich bei unserem Kunden nicht um den Endkunden der vertragsgegenständlichen Anlage handelt, empfehlen wir unseren Kunden, die Garantiebedingungen auch an den Endkunden weiterzuleiten. Für eine Missachtung oder einen Verstoß gegen die Garantiebedingungen, die zu einem möglichen Verlust etwaiger Ansprüche aus der Garantie führen können, haften wir nicht.",
        },
        {
          type: "paragraph",
          text: "9.3 Macht der Kunde innerhalb des Gewährleistungszeitraums uns gegenüber Ansprüche wegen Mängeln geltend, die auch von der Garantie des Herstellers/Lieferanten abgedeckt sind, ist der Kunde verpflichtet, uns diese Garantieansprüche abzutreten.",
        },
        {
          type: "paragraph",
          text: "9.4 Die für den Austausch eines von der Herstellergarantie umfassten defekten Systemteils benötigte Arbeitszeit hat der Kunde im Garantiefall selbst zu tragen. Insoweit wird an dieser Stelle auf die entsprechenden Regelungen der Herstellergarantie verwiesen.",
        },
      ],
    },
    {
      title: "10. verjährung",
      blocks: [
        {
          type: "paragraph",
          text: "10.1 Bei einem Vertrag über kauf- oder werklieferungsvertragliche Leistungen beträgt die Verjährungsfrist im Sinne des § 438 Abs. 1 Nr. 3 BGB für Ansprüche und Rechte wegen Mängeln ein Jahr, es sei denn beim Kunden handelt es sich um einen Verbraucher im Sinne des § 13 BGB. In diesem Fall beträgt die Verjährungsfrist auch im Übrigen zwei Jahre.",
        },
        {
          type: "paragraph",
          text: "10.2 Im Falle des Abschlusses eines Werkvertrages betragen die Verjährungsfristen für Ansprüche und Rechte des Kunden wegen Mängeln:",
        },
        {
          type: "list",
          items: [
            "10.2.1 für sämtliche Teile von maschinellen, elektro-technischen/ elektronischen Anlagen (wie insb. Stromspeicher, Wechselrichter, Schaltschränke und Messeinrichtungen), bei denen die Wartung Einfluss auf Sicherheit und Funktionsfähigkeit hat, sofern und soweit der Kunde für die Dauer der Verjährungsfrist mit uns einen Wartungsvertrag abschließt 5 Jahre",
            "10.2.2 für den Fall, dass kein Wartungsvertrag abgeschlossen wird, zwei Jahre",
            "10.2.3 für Transformatoren und Übergabestationen einheitlich, zwei Jahre",
            "10.2.4 für alle sonstigen Leistungen einheitlich fünf Jahre",
          ],
        },
        {
          type: "paragraph",
          text: "10.3 In allen übrigen Fällen verjähren Ansprüche des Kunden in der gesetzlich dafür vorgesehenen Verjährungsfrist. Die Verjährungsfristen beginnen mit dem gesetzlich bestimmten Verjährungsbeginn.",
        },
        {
          type: "paragraph",
          text: "10.4 Mit einer Nachbesserungsmaßnahme ist ein Anerkenntnis einer Rechtspflicht ausdrücklich nicht verbunden. Diese Maßnahmen erfolgen, soweit nicht ausdrücklich etwas anderes vereinbart oder erklärt wird, ausschließlich aus Kulanz, mit der Folge, dass hierdurch ein Neubeginn der Verjährungsfrist nicht begründet wird.",
        },
        {
          type: "paragraph",
          text: "10.5 Dem Kunden ist bewusst, dass wir bei technischen Produkten (bspw. Stromspeicher, Wechselrichter, Schaltschränke, Messeinrichtungen) auf die Mitwirkung der Produkthersteller angewiesen sind und daher selbst nur sehr bedingt Einfluss auf die Dauer einer etwaigen Nachbesserungsmaßnahme nehmen können. Etwaige in diesem Zusammenhang entstehende Schäden bzw. Aufwendungen des Kunden (insb. Ertragsausfälle) haben wir nicht zu erstatten, sofern wir dem Kunden gegenüber nachweisen, dass die Verzögerung der Nachbesserungsmaßnahme nicht durch uns zu vertreten ist.",
        },
      ],
    },
  ],
} satisfies LegalDocumentContent;
