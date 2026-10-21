import type { Metadata } from "next";
import { LegalPage } from "@/app/(site)/_components/legal/legal-page";
import { LegalSection } from "@/app/(site)/_components/legal/legal-section";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";
import type { SeoContent } from "@/types/content";

const seo = {
  title: "Datenschutz | Energie-Kraft Süd",
  description:
    "Freigabeentwurf der Datenschutzerklärung für die neue Website von Energie-Kraft Süd.",
  canonicalPath: "/datenschutz",
} satisfies SeoContent;

export const metadata: Metadata = buildMetadata({ ...seo, noIndex: true });

export default function DatenschutzPage() {
  return (
    <LegalPage
      seo={seo}
      eyebrow="Rechtliche Informationen · Freigabeentwurf"
      title="Datenschutzerklärung"
      documentLayout
      description="Entwurf vom 20. Oktober 2026 für die neue Next.js-/Firebase-Website. Vor Veröffentlichung sind die gekennzeichneten Angaben und die tatsächliche Produktionskonfiguration fachlich beziehungsweise rechtlich freizugeben."
    >
      <aside className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6">
        <h2 className="text-xl font-semibold">
          Entwurf – nicht zur Produktionsveröffentlichung freigegeben
        </h2>
        <p className="mt-3">
          Dieser Text beschreibt den geprüften Entwicklungsstand und enthält Vorschläge für
          Rechtsgrundlagen und Löschregeln. Die markierten Freigabepunkte, Anbieterangaben und die
          Einbindung von Google-Bewertungen müssen vor dem Go-live fachlich geklärt werden. Eine
          rechtliche Freigabe liegt mit diesem Entwurf nicht vor.
        </p>
      </aside>

      <LegalSection title="1. Verantwortlicher und Kontakt" documentLayout>
        <address className="not-italic">
          {siteConfig.legalName}
          <br />
          {siteConfig.contact.address.street}
          <br />
          {siteConfig.contact.address.postalCode} {siteConfig.contact.address.city}
          <br />
          {siteConfig.contact.address.country}
        </address>
        <p>
          E-Mail:{" "}
          <a className="underline" href={siteConfig.contact.emailHref}>
            {siteConfig.contact.email}
          </a>
          <br />
          Telefon:{" "}
          <a className="underline" href={siteConfig.contact.phoneHref}>
            {siteConfig.contact.phoneDisplay}
          </a>
        </p>
        <p>
          Datenschutzbeauftragter: Kai Stengle
          <br />
          E-Mail:{" "}
          <a className="underline" href="mailto:datenschutz@energie-kraft.de">
            datenschutz@energie-kraft.de
          </a>
        </p>
      </LegalSection>

      <LegalSection title="2. Website-Betrieb und Sicherheit" documentLayout>
        <p>
          Die neue Website verwendet Firebase App Hosting und Cloud-Funktionen aus der
          Google-Cloud-/Firebase-Infrastruktur. Beim Abruf werden technisch erforderliche
          Verbindungsdaten verarbeitet. Dazu können IP-Adresse, Zeitpunkt, angefragte Adresse,
          Browser- und Geräteinformationen sowie Fehler- und Sicherheitsdaten gehören. Dies dient
          der Auslieferung, Fehlerbehebung und Absicherung der Website.
        </p>
        <p>
          Schriftarten und allgemeine Website-Bilder werden aus den Website-Ressourcen geladen. Für
          Google-Autorenbilder gilt Abschnitt 8. Externe Karten- und Social-Media-Links öffnen den
          jeweiligen Anbieter erst bei Aufruf; ein Kartenlink allein bettet keine Karte ein.
        </p>
        <p>
          <strong>Vor Veröffentlichung bestätigen:</strong> produktive Protokollierung, Datenfelder
          und Zugriffe sowie Löschfristen einschließlich CDN-/Cloud-Logs und Sicherungen.
          Vorgeschlagene Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO: unser Interesse an einem
          verfügbaren, gegen Missbrauch und unbefugte Zugriffe geschützten Webangebot.
          Erforderlichkeit und Interessenabwägung sind zu dokumentieren.
        </p>
      </LegalSection>

      <LegalSection title="3. Kontakt- und Konfiguratoranfragen" documentLayout>
        <p>
          Wir verarbeiten die von Ihnen übermittelten Kontaktangaben und Nachrichten sowie Angaben
          zu Standort, Gebäude, Eigentumssituation und Energielösungen, soweit im jeweiligen
          Formular abgefragt. Im Konfigurator kommen Auswahl, Berechnungsannahmen und
          Projektergebnisse hinzu. Dies dient der Bearbeitung Ihrer Anfrage und der Vorbereitung
          einer Beratung beziehungsweise eines Angebots.
        </p>
        <p>
          Anfragen werden serverseitig validiert und in Firestore gespeichert.
          Übermittlungskennungen und Statusinformationen unterstützen die Zuordnung und verhindern
          doppelte Verarbeitung bei Wiederholungsversuchen. Berechtigte interne Personen können
          Anfragen bearbeiten, Projekt-PDFs erzeugen und Weiterleitungen auslösen. Interne
          Benachrichtigungen gehen an anfragen@energie-kraft.de; Eingangsbestätigungen an die
          angegebene Kontaktadresse.
        </p>
        <p>
          Erforderliche Angaben sind im Formular kenntlich gemacht. Ohne diese Angaben ist die
          jeweilige Anfrage nicht vollständig bearbeitbar. Eine Bestätigung der Datenschutzhinweise
          bestimmt für sich allein keine Rechtsgrundlage.
        </p>
        <p>
          Wenn Sie für sich eine Beratung, ein Angebot oder eine Vertragsleistung anfragen, ist Art.
          6 Abs. 1 lit. b DSGVO die vorgeschlagene Rechtsgrundlage. Sonstige allgemeine Nachrichten
          und die Kommunikation mit Ansprechpersonen eines Unternehmens sind nach Art. 6 Abs. 1 lit.
          f DSGVO gesondert zu bewerten; unser Interesse ist die sachgerechte Bearbeitung des
          jeweiligen Anliegens. Für gesetzlich aufzubewahrende Unterlagen gilt Abschnitt 11.
        </p>
        <p>
          <strong>Vor Veröffentlichung bestätigen:</strong> diese zweckbezogene Zuordnung und
          Interessenabwägung, berechtigte Empfänger und Weiterleitungen sowie die Löschregel in
          Abschnitt 11 einschließlich Postfächern und heruntergeladenen Projekt-PDFs.
        </p>
      </LegalSection>

      <LegalSection title="4. Bewerbungen und Dateiuploads" documentLayout>
        <p>
          Wir verarbeiten die ausgewählte Stelle, Anrede soweit angegeben, Namen, Anschrift,
          E-Mail-Adresse, Telefonnummer, Qualifikation und Erfahrung sowie freiwillig hochgeladene
          Unterlagen. Dateien können weitere personenbezogene Angaben enthalten. Bitte übermitteln
          Sie nur für die Bewerbung erforderliche Informationen.
        </p>
        <p>
          Bewerbungsangaben werden in Firestore, Dateien im geschützten Firebase Storage
          gespeichert. Unterlagen sind über die Anwendung nur nach Prüfung einer internen
          Zugriffsberechtigung abrufbar. Interne Benachrichtigungen gehen an
          bewerbung@energie-kraft.de, Eingangsbestätigungen an Ihre Bewerbungsadresse.
          Bewerbungsdateien werden in diesem Benachrichtigungsablauf nicht als E-Mail-Anhang
          versendet.
        </p>
        <p>
          Für die Entscheidung über eine Einstellung ist § 26 Abs. 1 Satz 1 und Abs. 8 Satz 2 BDSG
          in Verbindung mit Art. 88 DSGVO vorgesehen; Art. 6 Abs. 1 lit. b DSGVO ist für
          erforderliche vorvertragliche Maßnahmen ebenfalls zu prüfen. Die Kenntnisnahme der
          Datenschutzhinweise ist keine pauschale Einwilligung. Besondere Daten, etwa
          Gesundheitsangaben, benötigen zusätzlich eine passende Ausnahme nach Art. 9 Abs. 2 DSGVO,
          beispielsweise bei notwendiger Erfüllung arbeitsrechtlicher Pflichten in Verbindung mit §
          26 Abs. 3 BDSG. Freiwilliges Hochladen allein ersetzt diese Prüfung nicht.
        </p>
        <p>
          <strong>Löschvorschlag – vor Veröffentlichung freizugeben:</strong> Bei einer Absage
          sollen Ihre Bewerbungsdaten grundsätzlich sechs Monate nach dem dokumentierten Zugang der
          Absage gelöscht werden. Innerhalb dieses Zeitraums sollen nur die zur Verteidigung
          möglicher Rechtsansprüche erforderlichen Daten eingeschränkt zugänglich aufbewahrt werden
          (vorgeschlagen: Art. 6 Abs. 1 lit. f DSGVO). Die Fristen für mögliche
          Diskriminierungsansprüche nach § 15 Abs. 4 AGG und § 61b ArbGG begründen diesen Vorschlag,
          aber keine gesetzliche Pflicht, jede Bewerbung sechs Monate zu speichern.
        </p>
        <p>
          Bei einer Rücknahme soll die Löschung grundsätzlich nach Abschluss der Bearbeitung
          erfolgen; eine weitere Aufbewahrung setzt einen dokumentierten Grund voraus. Bei einem
          konkreten Rechtsstreit können erforderliche Nachweise bis zu dessen Abschluss und zum
          Wegfall des Sicherungszwecks länger aufbewahrt werden. Für eingestellte Personen sind nur
          erforderliche Angaben in die Personalverwaltung zu übernehmen; dort gelten gesonderte
          Regeln. Ein Bewerberpool würde eine gesonderte freiwillige Einwilligung und Frist
          benötigen.
        </p>
        <p>
          <strong>Noch offen:</strong> Freigabe der Sechsmonatsfrist innerhalb des vorgegebenen
          Prüfrahmens von drei bis sechs Monaten, dokumentierter Fristbeginn, zuständige Personen
          und Löschung in allen beteiligten Systemen. Eine manuelle Löschfunktion für Bewerbung und
          zugeordnete Dateien besteht; eine automatische fristgesteuerte Löschung ist nicht
          nachgewiesen.
        </p>
      </LegalSection>

      <LegalSection title="5. Kundenempfehlungen" documentLayout>
        <p>
          Bei „Kunden werben Kunden“ verarbeiten wir Namen und E-Mail-Adresse der empfehlenden
          Person sowie Namen, Kontaktdaten und Anschrift der empfohlenen Person. Das Formular
          verlangt die Bestätigung, dass diese Person mit der Weitergabe einverstanden ist. Daten
          werden serverseitig gespeichert; Benachrichtigungen können an die interne Bearbeitung und
          die beteiligten Personen versendet werden.
        </p>
        <p>
          Für die Bearbeitung gegenüber der empfehlenden Person kommt Art. 6 Abs. 1 lit. b DSGVO in
          Betracht, soweit sie selbst an der Empfehlungsaktion teilnimmt. Die Daten der empfohlenen
          Person stammen von der empfehlenden Person, nicht aus einer eigenen Anfrage. Die
          Bestätigung im Formular ist noch kein hinreichender Nachweis einer informierten
          Einwilligung dieser dritten Person nach Art. 6 Abs. 1 lit. a DSGVO. Ein berechtigtes
          Interesse nach lit. f erfordert eine gesonderte Abwägung und rechtfertigt nicht
          automatisch eine werbliche Kontaktaufnahme.
        </p>
        <p>
          <strong>Vor Veröffentlichung klären:</strong> rechtmäßige Weitergabe, Nachweis und Umfang
          einer Einwilligung sowie zulässiger Kontaktweg, insbesondere nach § 7 UWG. Die empfohlene
          Person ist nach Art. 14 DSGVO unter anderem über Datenquelle, Datenkategorien, Zweck und
          Rechtsgrundlage zu informieren: grundsätzlich spätestens innerhalb eines Monats, bei
          früherer Kontaktaufnahme bereits dann, bei früherer Weitergabe spätestens zu diesem
          Zeitpunkt. Der bestehende E-Mail-Hinweis mit Quellenangabe und Datenschutzlink muss dafür
          vervollständigt und seine Bereitstellung abgesichert werden. Ohne tragfähige Grundlage
          dürfen die Daten nicht für die Akquise verwendet werden; nicht erforderliche Daten sind zu
          löschen. Die Frist für abgeschlossene Empfehlungen ist noch freizugeben.
        </p>
      </LegalSection>

      <LegalSection title="6. Firebase und interner Zugang" documentLayout>
        <p>
          Firestore speichert Anfragen, Bewerbungen, Empfehlungen und Bearbeitungsinformationen.
          Firebase Storage dient privaten Bewerbungsunterlagen und internen Profilbildern. Firebase
          Authentication verwaltet interne Benutzeranmeldungen; geschützte Sitzungen und Rollen
          begrenzen den Adminzugriff. Für öffentliche Anfragen ist kein Benutzerkonto erforderlich.
        </p>
        <p>
          Eine europäische Region einzelner Ressourcen ist keine Zusage, dass sämtliche Dienste,
          Supportzugriffe oder Authentifizierungs- und Sicherheitsdaten ausschließlich in der EU
          verarbeitet werden.
        </p>
        <p>
          <strong>Vor Veröffentlichung bestätigen:</strong> Google-Vertragspartei,
          Auftragsverarbeitung und Unterauftragnehmer, tatsächliche Regionen je Dienst, Aufbewahrung
          der internen Konten und Profile sowie Drittlandübermittlungen und deren tatsächlich
          geltende Garantien. Die Zugangssicherung ist auf Art. 6 Abs. 1 lit. f DSGVO zu prüfen; für
          interne Beschäftigtendaten zusätzlich auf § 26 BDSG.
        </p>
        <p>
          Das interne Sitzungscookie „__session“ ist auf fünf Tage begrenzt. Bei Abmeldung wird es
          entfernt und die weitere Token-Erneuerung widerrufen. Der Anmeldedienst speichert außerdem
          den Anmeldestatus lokal im Browser. Sitzungsablauf und Abmeldung löschen weder das
          Benutzerkonto noch die gespeicherten Geschäftsvorgänge.
        </p>
      </LegalSection>

      <LegalSection title="7. Mailgun EU und E-Mail-Verarbeitung" documentLayout>
        <p>
          Systemnachrichten werden über den EU-API-Endpunkt von Mailgun und notify.energie-kraft.de
          versendet. Verarbeitet werden insbesondere Empfängeradresse, Absender, Betreff, Inhalt,
          gegebenenfalls zugehörige Projektunterlagen sowie Versand- und Fehlerdaten.
          Provider-Annahme bedeutet noch keine Zustellung. Ein EU-Endpunkt garantiert nicht
          ausschließlich europäische Verarbeitung aller beteiligten Systeme; auch die anschließenden
          Postfächer sind zu berücksichtigen.
        </p>
        <p>
          Die Rechtsgrundlage folgt dem jeweiligen Nachrichtenzweck, etwa einer angefragten Beratung
          oder einer Bewerbung; der Versanddienst schafft keine eigene pauschale Rechtsgrundlage.
          Die Löschung eines Vorgangs in der Website entfernt keine E-Mail-Kopien bei Mailgun oder
          in Empfängerpostfächern.
        </p>
        <p>
          <strong>Vor Veröffentlichung bestätigen:</strong> Mailgun-Vertragspartei,
          Auftragsverarbeitung, Nachrichten-/Logspeicherung, internationale Übermittlungen,
          Löschfristen und anbieterseitige Öffnungs-/Klickmessung. Auch der tatsächliche Einsatz von
          Microsoft 365 für die Unternehmenspostfächer, zugehörige Verträge, Speicherorte,
          Archivierungs- und Löschregeln ist zu bestätigen. Eine Öffnungs-/Klickmessung ist durch
          diesen Entwurf nicht freigegeben.
        </p>
      </LegalSection>

      <LegalSection title="8. Google Places und Rezensionen" documentLayout>
        <p>
          Unser Server ruft Bewertungen über die Places API ab. Nach Ihrer Freigabe der Kategorie
          „Google-Bewertungen“ zeigen wir Bewertungstexte, Autorenangaben, Profilbilder,
          Bewertungswerte, Zeitangaben und Quellenlinks von Google an. Die Anwendung führt keinen
          eigenen dauerhaften Rezensionenspeicher. Die Datenquelle dieser Autorenangaben ist Google
          Places. Server-API-Abruf und Bildabruf durch Ihren Browser sind getrennte Datenflüsse. Für
          die Darstellung der öffentlich bereitgestellten Rezensionen ist Art. 6 Abs. 1 lit. f DSGVO
          mit einer Abwägung unseres Informationsinteresses und der Rechte der bewertenden Personen
          zu prüfen; Informationspflichten nach Art. 14 DSGVO sind gesondert zu bewerten.
        </p>
        <p>
          Ohne Ihre Einwilligung erscheint ein Platzhalter; Ihr Browser ruft keine externen
          Google-Ressourcen dieses Bewertungsbereichs ab. Mit „Google-Bewertungen aktivieren“, der
          entsprechenden Kategorie in den Cookie-Einstellungen oder „Alle akzeptieren“ geben Sie die
          Darstellung frei. Anschließend lädt Ihr Browser Autorenbilder direkt von Google. Dabei
          werden Ihre IP-Adresse und technische Verbindungsdaten übermittelt; eine Verarbeitung
          außerhalb der EU ist möglich. Vorgesehene Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO
          und, soweit Speicher- oder Zugriffsvorgänge auf Ihrem Gerät stattfinden, § 25 Abs. 1
          TDDDG.
        </p>
        <p>
          Sie können Ihre Einwilligung jederzeit über „Cookie-Einstellungen“ im Footer widerrufen.
          Dann werden die Rezensionen ausgeblendet und keine weiteren externen Bilder dieses
          Bereichs abgerufen. Bereits erfolgte Übermittlungen werden dadurch nicht rückgängig. Eine
          alleinige Freigabe der Bewertungen aktiviert weder Statistik noch Werbung.
        </p>
        <p>
          Google-Profil-, Bewertungs- und Kartenlinks führen auf externe Seiten. Informationen des
          Anbieters:{" "}
          <a
            className="underline"
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google-Datenschutzerklärung
          </a>{" "}
          und{" "}
          <a
            className="underline"
            href="https://maps.google.com/help/terms_maps/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google-Maps-Nutzungsbedingungen
          </a>
          .
        </p>
        <p>
          <strong>Vor Veröffentlichung bestätigen:</strong> Anbieter-/Vertragskonstellation,
          rechtliche Freigabe der beschriebenen Verarbeitung, internationale Übermittlungen sowie
          Google-Vorgaben zu Attribution, Bildauslieferung und Caching.
        </p>
      </LegalSection>

      <LegalSection title="9. Lokale Speicherung und Consent" documentLayout>
        <p>
          Die lokal eingebundene Bibliothek „vanilla-cookieconsent“ speichert die Auswahl unter
          ek_consent im Local Storage dieses Browsers. Enthalten sind Kategorien, zufällige
          Consent-Kennung, Revision, Sprache sowie Zeit- und Ablaufangaben. Formularinhalte werden
          dort nicht abgelegt; ein serverseitiges Consent-Profil wird dafür nicht angelegt.
        </p>
        <p>
          Konfiguriert sind derzeit 180 Tage Gültigkeit ab letzter Auswahländerung; diese Dauer
          benötigt fachliche Freigabe. Fehlerhafte oder abgelaufene Einträge führen zur erneuten
          Abfrage. Über „Cookie-Einstellungen“ im Footer können Sie die Auswahl ändern oder
          widerrufen. Dies macht vergangene Übermittlungen nicht rückgängig. Für Google-Bewertungen
          gilt die gesonderte Einwilligung in Abschnitt 8.
        </p>
        <p>
          Unabhängig davon verwendet der Konfigurator Session Storage für Projektentwürfe,
          Rechnerübergaben und Wiederaufnahme bei fehlgeschlagener Übermittlung. Bei ausdrücklichem
          Neustart und beim erneuten Laden des Konfigurators mit einem als erfolgreich übermittelt
          gespeicherten Projekt wird der Entwurf entfernt. Dies ist keine zeitgesteuerte Löschung
          der serverseitigen Anfrage. Interne Anmeldungen verwenden die in Abschnitt 6 beschriebenen
          Mechanismen.
        </p>
        <p>
          <strong>Rechtliche Zuordnung zur Freigabe:</strong> Für die unbedingt erforderliche
          Speicherung der Datenschutzentscheidung, die angeforderte Konfiguratorfunktion und die
          interne Zugangssicherung kommt § 25 Abs. 2 Nr. 2 TDDDG in Betracht. Darüber hinausgehende
          Speicherzugriffe benötigen grundsätzlich eine Einwilligung nach § 25 Abs. 1 TDDDG.
          Personenbezogene Folgeverarbeitungen benötigen zusätzlich eine DSGVO-Rechtsgrundlage: für
          die Verwaltung der Auswahl ist Art. 6 Abs. 1 lit. c in Verbindung mit Art. 7 Abs. 1 DSGVO
          zu prüfen, für den Konfigurator Abschnitt 3 und für den Zugang Abschnitt 6.
          Erforderlichkeit, Consent-Wortlaut und die vorläufigen 180 Tage sowie das vollständige
          produktive Speicherinventar sind noch zu bestätigen.
        </p>
      </LegalSection>

      <LegalSection title="10. GA4 und Google Ads deaktiviert" documentLayout>
        <p>
          GA4- und Google-Ads-Webtracking sind in der neuen Website technisch deaktiviert, auch nach
          Zustimmung. Es werden darüber keine Google-Tags geladen, keine
          Seitenaufruf-/Conversion-Ereignisse und keine cookielosen Tracking-Pings versendet. Die
          lokale Consent-Schnittstelle lädt selbst keine Google-Skripte. Autorenbilder sind hiervon
          unabhängig.
        </p>
        <p>
          Eine spätere Aktivierung benötigt eine gesonderte technische und fachliche Freigabe sowie
          eine Aktualisierung dieser Informationen und des Consent-Verfahrens. Diese Aussage
          betrifft die neue Website, nicht die bisherige WordPress-Installation oder externe
          Werbekonten.
        </p>
      </LegalSection>

      <LegalSection title="11. Empfänger und Aufbewahrung" documentLayout>
        <p>
          Zugriff erhalten die für den jeweiligen Vorgang berechtigten internen Personen und
          eingesetzten technischen Dienstleister. Die Verarbeitungsvorgänge und offenen
          Anbieterangaben sind oben beschrieben. Weitere Empfänger oder Übermittlungen werden nicht
          unterstellt.
        </p>
        <p>
          Wir dürfen Daten nur so lange speichern, wie sie für ihren Zweck erforderlich sind (Art. 5
          Abs. 1 lit. e DSGVO). Entfällt der Zweck, sind sie nach Maßgabe des Art. 17 DSGVO zu
          löschen, soweit keine gesetzliche Pflicht oder notwendige Sicherung von Rechtsansprüchen
          entgegensteht. Für die Aufbewahrung wegen gesetzlicher Pflichten gilt Art. 6 Abs. 1 lit. c
          DSGVO; für erforderliche Nachweise zur Rechtsverteidigung ist lit. f gesondert abzuwägen.
        </p>
        <p>
          <strong>Vorschlag für unverbindliche Anfragen und Konfiguratorprojekte:</strong> sechs
          Monate nach abschließender Bearbeitung ohne Vertrag löschen, wenn keine weitere Beratung
          vereinbart ist und kein anderer dokumentierter Aufbewahrungsgrund besteht. Dies ist eine
          noch freizugebende betriebliche Frist, kein gesetzlicher Standard. Zugehörige PDFs,
          E-Mail-Kopien und Bearbeitungsvermerke sind einzubeziehen. Für Bewerbungen gilt der
          gesonderte Vorschlag in Abschnitt 4; für Empfehlungen ist die Frist noch offen.
        </p>
        <p>
          Nur tatsächlich aufbewahrungspflichtige Unterlagen unterliegen den gesetzlichen Fristen:
          Handels- und Geschäftsbriefe grundsätzlich sechs Jahre, Rechnungen und Buchungsbelege acht
          Jahre, Handelsbücher und Jahresabschlüsse zehn Jahre (§ 257 HGB, § 147 AO, § 14b UStG).
          Die Fristen beginnen grundsätzlich mit dem Ende des jeweils gesetzlich maßgeblichen
          Kalenderjahres. Sonderfälle und gesetzliche Verlängerungen sind zu beachten. Das bedeutet
          keine pauschale Aufbewahrung aller Kundendaten für diese Zeiträume.
        </p>
        <p>
          Die regelmäßige Verjährung nach §§ 195, 199 BGB beträgt grundsätzlich drei Jahre und
          beginnt regelmäßig mit Jahresende unter den dort genannten Voraussetzungen. Sie ist keine
          allgemeine Speicherpflicht; nur zur Sicherung konkreter Rechtsansprüche erforderliche
          Daten dürfen entsprechend länger aufbewahrt werden. Bei laufenden Verfahren ist der
          weitere Bedarf gesondert zu prüfen.
        </p>
        <p>
          <strong>Vor Veröffentlichung festlegen:</strong> Fristen und Verantwortlichkeiten für
          Empfehlungen, Cloud-/Hosting-Logs, interne Konten und Profile, Mailgun, Postfächer und
          Sicherungen. Manuelle Löschfunktionen ersetzen noch keinen vollständigen Löschprozess über
          alle Systeme. Für Geschäftsdaten wird kein automatischer Fristenlauf zugesagt.
          Sicherungskopien benötigen begrenzte Aufbewahrung und einen Ablauf, der nach einer
          Wiederherstellung bereits veranlasste Löschungen erneut berücksichtigt. Die 180 Tage der
          Consent-Auswahl sind keine Aufbewahrungsfrist für Geschäftsdaten.
        </p>
      </LegalSection>

      <LegalSection title="12. Ihre Rechte" documentLayout>
        <p>
          Nach Maßgabe der gesetzlichen Voraussetzungen bestehen Rechte auf Auskunft, Berichtigung,
          Löschung, Einschränkung und Datenübertragbarkeit. Soweit die Verarbeitung auf Einwilligung
          beruht, können Sie diese für die Zukunft widerrufen. Bei berechtigten Interessen besteht
          unter den Voraussetzungen des Art. 21 DSGVO ein Widerspruchsrecht; gegen Direktwerbung
          können Sie jederzeit widersprechen. Sie können sich bei einer Datenschutzaufsichtsbehörde
          beschweren und uns über Abschnitt 1 kontaktieren.
        </p>
        <p>
          Eine ausschließlich automatisierte Entscheidung über Vertragsabschluss oder Einstellung
          ist in den geprüften Website-Abläufen nicht implementiert. Konfiguratorberechnungen dienen
          der Projektorientierung.
        </p>
        <p>
          <strong>Vor Veröffentlichung bestätigen:</strong> zuständige Aufsichtsbehörde und deren
          Beschwerdekontakt, interner Ablauf für Betroffenenrechte und nachgelagerte Prozesse
          außerhalb der Website.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
