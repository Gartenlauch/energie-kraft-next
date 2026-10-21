import type { Metadata } from "next";
import { LegalPage } from "@/app/(site)/_components/legal/legal-page";
import { LegalSection } from "@/app/(site)/_components/legal/legal-section";
import { siteConfig } from "@/config/site";
import { CONSENT_LIFETIME_DAYS } from "@/lib/consent/policy";
import { buildMetadata } from "@/lib/seo/metadata";
import type { SeoContent } from "@/types/content";

const seo = {
  title: "Datenschutz | Energie-Kraft Süd",
  description:
    "Informationen zum Umgang mit personenbezogenen Daten auf der Website von Energie-Kraft Süd und zu Ihren Datenschutzrechten.",
  canonicalPath: "/datenschutz",
} satisfies SeoContent;

export const metadata: Metadata = buildMetadata({ ...seo, noIndex: true });

export default function DatenschutzPage() {
  return (
    <LegalPage
      seo={seo}
      eyebrow="Rechtliche Informationen"
      title="Datenschutzerklärung"
      documentLayout
      description="Stand: 21. Oktober 2026. Diese Informationen erläutern, wie wir personenbezogene Daten beim Besuch unserer Website und bei der Nutzung ihrer Funktionen verarbeiten."
    >
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
          Wir betreiben die Website mit Google Cloud und Firebase App Hosting. Beim Aufruf werden
          Verbindungsdaten verarbeitet, insbesondere Ihre IP-Adresse, Zeitpunkt und Ziel des
          Zugriffs sowie Browser- und Geräteinformationen. Hinzu kommen technische Fehler- und
          Sicherheitsprotokolle. Wir benötigen diese Daten, um Inhalte auszuliefern, Störungen zu
          beheben und Missbrauch sowie unbefugte Zugriffe abzuwehren.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse ist ein
          verfügbarer und sicherer Websitebetrieb. Ohne die erforderlichen Verbindungsdaten kann
          die Website nicht bereitgestellt werden. Protokolldaten dürfen nur so lange gespeichert
          werden, wie sie für die Fehleranalyse und Absicherung erforderlich sind; bei einem
          konkreten Sicherheitsvorfall können notwendige Nachweise länger benötigt werden.
        </p>
        <p>
          Schriftarten und allgemeine Website-Bilder werden mit der Website bereitgestellt. Für
          Autorenbilder im Bewertungsbereich gilt Abschnitt 8. Karten und soziale Netzwerke sind
          verlinkt; beim bloßen Seitenbesuch wird darüber keine Karte oder Social-Media-Einbettung
          geladen. Erst beim Öffnen eines solchen Links besuchen Sie den jeweiligen Anbieter.
        </p>
      </LegalSection>

      <LegalSection title="3. Kontakt- und Konfiguratoranfragen" documentLayout>
        <p>
          Wenn Sie uns kontaktieren, verarbeiten wir Ihre Kontaktangaben, Ihr Anliegen und Ihre
          Nachricht. Für Anfragen zu Photovoltaik, Stromspeichern, Klimaanlagen, Wärmepumpen und
          Wallboxen kommen die von Ihnen angegebenen Projektinformationen hinzu, etwa zu Standort,
          Gebäude, Eigentum, Energieverbrauch und gewünschter Ausstattung. Konfiguratorergebnisse
          und Berechnungsannahmen werden bei einer übermittelten Anfrage mitgespeichert, damit wir
          Ihr Projekt nachvollziehen und eine Beratung oder ein Angebot vorbereiten können.
        </p>
        <p>
          Im Kontaktformular sind Name, E-Mail-Adresse, Postleitzahl, Ort, Anliegen, Nachricht und
          gewünschter Kontaktweg anzugeben. Die Telefonnummer ist nur bei gewünschtem telefonischem
          Kontakt erforderlich; Firma, Gebäudeart und Eigentumssituation sind freiwillig. Bei einer
          Konfiguratoranfrage sind Name, E-Mail-Adresse, Installationsadresse und die abgefragten
          Projektangaben erforderlich. Telefonnummer und ergänzende Anmerkungen sind dort
          freiwillig. Ohne die jeweiligen Pflichtangaben lässt sich das Onlineformular nicht
          absenden; Sie können uns auch über die Kontaktdaten in Abschnitt 1 erreichen.
        </p>
        <p>
          Wir speichern die Anfrage und ihren Bearbeitungsstand und senden Eingangsbestätigungen
          beziehungsweise interne Benachrichtigungen per E-Mail. Berechtigte Mitarbeitende können
          daraus Projektunterlagen erstellen und diese zur Bearbeitung weitergeben. Technische
          Prüfungen und Übermittlungskennungen helfen, automatisierten Missbrauch und doppelte
          Verarbeitung zu vermeiden. Empfänger und Speicherdauer erläutern die Abschnitte 6, 7
          und 11.
        </p>
        <p>
          Soweit Sie selbst eine Beratung, ein Angebot oder eine Vertragsleistung anfragen, ist
          Art. 6 Abs. 1 lit. b DSGVO die Rechtsgrundlage. Allgemeine geschäftliche Nachrichten und
          die Kommunikation mit Ansprechpersonen eines Unternehmens bearbeiten wir auf Grundlage
          von Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist die Beantwortung Ihres
          Anliegens und die Pflege der betreffenden Geschäftsbeziehung.
        </p>
        <p>
          Die Bestätigung der Datenschutzhinweise im Formular ist keine pauschale Einwilligung in
          die Verarbeitung Ihrer Daten und keine Werbeeinwilligung.
        </p>
      </LegalSection>

      <LegalSection title="4. Bewerbungen und Dateiuploads" documentLayout>
        <p>
          Wir verarbeiten Ihre Angaben, um Ihre Bewerbung zu prüfen, mit Ihnen zu kommunizieren und
          über eine Einstellung zu entscheiden. Das Onlineformular verlangt die ausgewählte Stelle,
          Namen, Anschrift, E-Mail-Adresse, Telefonnummer und Angaben zu Qualifikation und Erfahrung.
          Anrede und hochgeladene Bewerbungsunterlagen sind freiwillig. Ohne Pflichtangaben kann die
          Onlinebewerbung nicht abgesendet werden. Bei Fragen zum Bewerbungsweg können Sie uns über
          Abschnitt 1 kontaktieren.
        </p>
        <p>
          Rechtsgrundlage für die auf Ihre Bewerbung hin erforderlichen vorvertraglichen Maßnahmen
          ist Art. 6 Abs. 1 lit. b DSGVO. Die Kenntnisnahme dieser Hinweise ist keine gesonderte
          Einwilligung. Bitte übermitteln Sie nur für die Stelle relevante Informationen und
          vermeiden Sie nicht benötigte sensible Angaben, etwa zur Gesundheit oder Religion.
          Soweit besondere Daten zur Erfüllung arbeitsrechtlicher Pflichten erforderlich sind,
          gelten zusätzlich Art. 9 Abs. 2 lit. b DSGVO und die einschlägigen arbeitsrechtlichen
          Vorschriften, gegebenenfalls § 26 Abs. 3 BDSG. Für die notwendige Sicherung von
          Rechtsansprüchen kann Art. 9 Abs. 2 lit. f DSGVO einschlägig sein. Ein freiwilliger Upload
          allein ist keine ausdrückliche Einwilligung in die Verarbeitung besonderer Daten.
        </p>
        <p>
          Ihre Bewerbung und Unterlagen werden geschützt gespeichert. Zugriff erhalten die mit
          Auswahl und Personalbearbeitung befassten Personen sowie technische Dienstleister, soweit
          dies für ihre Aufgaben erforderlich ist. Sie erhalten eine Eingangsbestätigung;
          zuständige Mitarbeitende werden intern benachrichtigt. Hochgeladene Bewerbungsdateien
          werden in diesem Benachrichtigungsablauf nicht als E-Mail-Anhang versendet.
        </p>
        <p>
          Nach einer Absage beträgt die Aufbewahrungsfrist höchstens sechs Monate ab dem
          dokumentierten Zugang der Absage, soweit die Daten zur Verteidigung gegen mögliche
          Rechtsansprüche erforderlich sind. Rechtsgrundlage ist insoweit Art. 6 Abs. 1 lit. f
          DSGVO; unser berechtigtes Interesse ist die Rechtsverteidigung, insbesondere bei
          Ansprüchen nach dem Allgemeinen Gleichbehandlungsgesetz. Es besteht keine gesetzliche
          Pflicht, jede Bewerbung sechs Monate aufzubewahren.
        </p>
        <p>
          Bei einer Rücknahme endet die Speicherung mit dem Abschluss der Bearbeitung, soweit kein
          dokumentierter Aufbewahrungsgrund verbleibt. Bei einem konkreten Rechtsstreit können
          erforderliche Nachweise bis zu dessen Abschluss und dem Wegfall des Sicherungszwecks
          länger aufbewahrt werden. Bei Einstellung werden nur die für das Beschäftigungsverhältnis
          erforderlichen Angaben in die Personalverwaltung übernommen; darüber informieren wir
          gesondert. Für die Löschung von Kopien gilt ergänzend Abschnitt 11.
        </p>
      </LegalSection>

      <LegalSection title="5. Kundenempfehlungen" documentLayout>
        <p>
          Im Formular „Kunden werben Kunden“ werden Anrede, Name und E-Mail-Adresse der
          empfehlenden Person sowie Anrede, Name, E-Mail-Adresse und Anschrift der empfohlenen
          Person abgefragt. Deren Telefonnummer ist freiwillig. Ohne die Pflichtangaben und die
          verlangten Bestätigungen lässt sich das Formular nicht absenden. Die Angaben werden zur
          Zuordnung und Bearbeitung der Empfehlung und einer möglichen Prämie gespeichert. Der
          Ablauf sieht interne Benachrichtigungen sowie E-Mails an beide beteiligten Personen vor.
        </p>
        <p>
          Für die vertragliche Teilnahme der empfehlenden Person an der Aktion ist Art. 6 Abs. 1
          lit. b DSGVO einschlägig. Die Angaben der empfohlenen Person stammen dagegen von der
          empfehlenden Person; sie sind keine eigene Anfrage der empfohlenen Person.
        </p>
        <p>
          Für Werbung per E-Mail oder Telefon gelten zusätzlich die Anforderungen des § 7 UWG.
          Insbesondere ist eine vorherige ausdrückliche Einwilligung für Werbe-E-Mails und für
          Werbeanrufe gegenüber Verbrauchern erforderlich, soweit keine gesetzliche Ausnahme
          greift. Eine datenschutzrechtliche Einwilligung richtet sich nach Art. 6 Abs. 1 lit. a
          DSGVO. Auch eine Empfehlungsnachricht kann Werbung sein. Wenn Sie uns empfohlen wurden,
          haben Sie nach Art. 14 DSGVO Anspruch auf Informationen über die konkrete Datenquelle
          und die Verarbeitung: spätestens innerhalb eines Monats, bei früherer Kontaktaufnahme
          bereits beim ersten Kontakt oder bei früherer Offenlegung spätestens zu diesem Zeitpunkt.
        </p>
        <p>
          Die Speicherdauer richtet sich nach dem Abschluss der Bearbeitung und einer möglichen
          Prämienabrechnung. Nur dafür erforderliche Nachweise
          sowie gesetzlich aufzubewahrende Belege dürfen darüber hinaus gespeichert werden;
          Abschnitt 11 erläutert die gesetzlichen Fristen. Entfällt der Aufbewahrungszweck, sind
          die Daten zu löschen.
        </p>
      </LegalSection>

      <LegalSection title="6. Firebase und interner Zugang" documentLayout>
        <p>
          Für die Bearbeitung der in den Abschnitten 3 bis 5 beschriebenen Vorgänge setzen wir
          Google Cloud und Firebase ein: Cloud Functions zur Verarbeitung der Übermittlungen,
          Firestore zur Speicherung der Vorgänge und Firebase Storage für Bewerbungsunterlagen und
          interne Profilbilder. Die eingesetzten Dienste erhalten die jeweils zur Bereitstellung
          ihrer Funktion erforderlichen Daten.
        </p>
        <p>
          Firebase Authentication dient ausschließlich der Anmeldung interner Benutzer. Dabei
          werden Anmelde- und Kontodaten sowie technische Verbindungs- und Sicherheitsdaten
          verarbeitet. Nach den Anbieterinformationen wird Firebase Authentication in Rechenzentren
          in den USA betrieben. Berechtigungen begrenzen den Zugang zur internen Verwaltung. Für
          eine öffentliche Anfrage oder Bewerbung benötigen Sie kein Benutzerkonto.
        </p>
        <p>
          Die Rechtsgrundlage für die Geschäftsvorgänge richtet sich nach den vorstehenden
          Abschnitten. Zugangsschutz und die Nachvollziehbarkeit interner Bearbeitung beruhen auf
          Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist der Schutz vertraulicher
          Vorgänge vor unbefugtem Zugriff. Soweit interne Kontodaten zur Durchführung eines
          Beschäftigungsverhältnisses erforderlich sind, gilt Art. 6 Abs. 1 lit. b DSGVO.
        </p>
        <p>
          Das interne Sitzungscookie „__session“ ist höchstens fünf Tage gültig und wird bei
          Abmeldung entfernt. Zusätzlich hält Firebase den Anmeldestatus im lokalen Browserspeicher
          über das Schließen des Browsers hinaus vor; die Abmeldung beendet auch diesen Status.
          Die Fünftagesfrist des Cookies gilt nicht für diesen zusätzlichen Speicher. Konten,
          Rollen und Profile sind nur so lange vorzuhalten, wie sie für den berechtigten internen
          Zugang oder notwendige Nachweise benötigt werden. Abmeldung und Sitzungsablauf löschen
          keine Geschäftsvorgänge. Für Anbieter und internationale Verarbeitung gilt Abschnitt 11.
        </p>
      </LegalSection>

      <LegalSection title="7. E-Mail-Verarbeitung und Mailgun" documentLayout>
        <p>
          Für Eingangsbestätigungen und vorgangsbezogene Benachrichtigungen verwenden wir Mailgun,
          einen Dienst von Sinch Email, über dessen EU-Endpunkt. Verarbeitet werden Absender- und
          Empfängeradressen, Betreff, Nachrichteninhalt, gegebenenfalls Projektunterlagen sowie
          Versand- und Fehlerdaten. Zur anschließenden Bearbeitung werden Nachrichten auch in
          unseren Unternehmenspostfächern verarbeitet. Diese enthalten ebenfalls personenbezogene
          Daten aus Anfragen und Bewerbungen.
        </p>
        <p>
          Rechtsgrundlage ist dieselbe wie für den jeweiligen Vorgang: insbesondere Art. 6 Abs. 1
          lit. b DSGVO für eigene Beratungsanfragen und Bewerbungen oder lit. f für allgemeine
          geschäftliche Kommunikation. Unsere dabei verfolgten Interessen sind in den Abschnitten 3
          und 4 erläutert. Gesetzliche Aufbewahrungspflichten richten sich nach Abschnitt 11.
          E-Mail-Versand ist keine gesonderte Erlaubnis für Werbung; für Empfehlungen gilt Abschnitt 5.
        </p>
        <p>
          Die Löschung eines Websitevorgangs entfernt keine E-Mail-Kopien beim Versanddienst oder
          in Postfächern. Für diese gelten eigene Löschprozesse nach dem jeweiligen
          Bearbeitungszweck und etwaigen gesetzlichen Pflichten. Der EU-Endpunkt ist keine Zusage,
          dass alle beteiligten Systeme ausschließlich innerhalb der EU verarbeiten. Weitere
          Informationen zu Empfängern und Übermittlungen enthält Abschnitt 11.
        </p>
      </LegalSection>

      <LegalSection title="8. Google Places und Rezensionen" documentLayout>
        <p>
          Unser Server ruft Bewertungen über die Places API ab. Nach Ihrer Freigabe der Kategorie
          „Google-Bewertungen“ zeigen wir Bewertungstexte, Autorenangaben, Profilbilder,
          Bewertungswerte, Zeitangaben und Quellenlinks von Google an. Die Anwendung führt keinen
          eigenen dauerhaften Rezensionenspeicher. Die Datenquelle dieser Autorenangaben ist Google
          Places. Für die Darstellung der öffentlich bereitgestellten Rezensionen gilt Art. 6
          Abs. 1 lit. f DSGVO unter Abwägung unseres Interesses, über Kundenerfahrungen zu
          informieren, und der Rechte der bewertenden Personen.
        </p>
        <p>
          Ohne Ihre Einwilligung erscheint ein Platzhalter; Ihr Browser ruft keine externen
          Google-Ressourcen dieses Bewertungsbereichs ab. Mit „Google-Bewertungen aktivieren“, der
          entsprechenden Kategorie in den Cookie-Einstellungen oder „Alle akzeptieren“ geben Sie die
          Darstellung frei. Anschließend lädt Ihr Browser Autorenbilder direkt von Google. Dabei
          werden Ihre IP-Adresse und technische Verbindungsdaten übermittelt; eine Verarbeitung
          außerhalb der EU ist möglich. Rechtsgrundlage für diese Übermittlung ist Art. 6 Abs. 1
          lit. a DSGVO und, soweit Speicher- oder Zugriffsvorgänge auf Ihrem Gerät stattfinden,
          § 25 Abs. 1 TDDDG.
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
      </LegalSection>

      <LegalSection title="9. Lokale Speicherung und Consent" documentLayout>
        <p>
          Unsere lokal eingebundene Einwilligungsverwaltung „vanilla-cookieconsent“ speichert Ihre
          Auswahl im Local Storage, einem Speicher Ihres Browsers. Der Eintrag „ek_consent“ enthält
          Ihre Kategorienauswahl, eine zufällige Kennung, die Fassung der Abfrage sowie Sprach-,
          Zeit- und Ablaufangaben. Formularinhalte gehören nicht dazu. Die Auswahl wird hierfür
          nicht als serverseitiges Besucherprofil gespeichert; es ist kein externer Consent-Dienst
          eingebunden.
        </p>
        <p>
          Die Auswahl ist für {CONSENT_LIFETIME_DAYS} Tage ab der letzten Auswahländerung gültig.
          Fehlerhafte oder abgelaufene Einträge werden nicht als Freigabe berücksichtigt und führen
          zur erneuten Abfrage. Über „Cookie-Einstellungen“ im Footer können Sie Ihre Auswahl
          jederzeit ändern oder widerrufen. Der Widerruf berührt nicht die Rechtmäßigkeit der bis
          dahin auf Grundlage der Einwilligung erfolgten Verarbeitung. Die Freigabe für
          Google-Bewertungen ist freiwillig; bei Ablehnung bleibt die übrige Website nutzbar.
        </p>
        <p>
          Der Konfigurator nutzt unabhängig davon Session Storage für Ihre Projektentwürfe,
          technische Eingaben einschließlich eigener Anmerkungen und Ergebnisse sowie für
          Übergaben aus den Rechnern. So können Sie Ihr Projekt innerhalb derselben Tabsitzung
          fortsetzen, auch nach einer fehlgeschlagenen Übermittlung. Bei einem ausdrücklichen
          Neustart oder beim erneuten Laden eines als erfolgreich übermittelt gespeicherten
          Projekts wird dieser Entwurf entfernt. Der Speicher ist an die Browsersitzung gebunden;
          Funktionen zur Sitzungswiederherstellung können ihn erhalten. Es gibt keine zusätzliche
          feste Löschfrist in Tagen. Der lokale Entwurf ist von der gespeicherten Anfrage bei uns
          zu unterscheiden. Für interne Anmeldespeicher gilt Abschnitt 6.
        </p>
        <p>
          Für die unbedingt erforderliche Speicherung Ihrer Datenschutzentscheidung, die von Ihnen
          angeforderte Konfiguratorfunktion und die interne Anmeldung gilt § 25 Abs. 2 Nr. 2
          TDDDG. Darüber hinausgehende
          Speicherzugriffe benötigen grundsätzlich eine Einwilligung nach § 25 Abs. 1 TDDDG.
          Soweit die Verwaltung der Auswahl personenbezogene Daten umfasst, dient sie der
          Umsetzung Ihrer Entscheidung und dem Nachweis einer Einwilligung nach Art. 6 Abs. 1
          lit. c in Verbindung mit Art. 7 Abs. 1 DSGVO. Für Projekt- und Anmeldedaten gelten
          zusätzlich die Rechtsgrundlagen in den Abschnitten 3 und 6.
        </p>
      </LegalSection>

      <LegalSection title="10. GA4 und Google Ads deaktiviert" documentLayout>
        <p>
          Google Analytics 4 und Google-Ads-Webtracking sind auf dieser Website technisch
          deaktiviert, auch nach einer entsprechenden Auswahl in den Cookie-Einstellungen. Es
          werden darüber keine Google-Tags geladen, keine
          Seitenaufruf-/Conversion-Ereignisse und keine cookielosen Tracking-Pings versendet. Die
          Einwilligungsverwaltung lädt selbst keine Google-Skripte. Allein die Kategorie
          „Google-Bewertungen“ steuert derzeit zusätzliche externe Inhalte; siehe Abschnitt 8.
        </p>
        <p>
          Die Auswahlmöglichkeiten für Statistik, Marketing und personalisierte Werbung lösen
          aktuell keine entsprechende Messung oder Werbung aus. Ihre Auswahl wird nur lokal
          vermerkt. Sie ist keine vorweggenommene Einwilligung für später neu eingeführte
          Verarbeitungen.
        </p>
      </LegalSection>

      <LegalSection title="11. Empfänger und Aufbewahrung" documentLayout>
        <p>
          Empfänger sind die für Ihren Vorgang zuständigen Personen in Beratung, Projektbearbeitung
          beziehungsweise Personalverwaltung sowie die erforderlichen Stellen der IT-Verwaltung.
          Technische Empfänger sind die eingesetzten Hosting-, Datenbank-, Speicher-, Anmelde- und
          E-Mail-Dienstleister. Die Leistungen von Google Cloud/Firebase und Mailgun sind in den
          Abschnitten 2, 6 und 7 beschrieben. Gesetzlich erforderliche Offenlegungen können
          insbesondere Finanzbehörden oder Gerichte betreffen.
        </p>
        <p>
          Bei Cloud- und E-Mail-Diensten können auch Verarbeitungen oder Zugriffe außerhalb der EU
          und des Europäischen Wirtschaftsraums, insbesondere in den USA, stattfinden. Eine
          europäische Speicherregion oder ein EU-Endpunkt schließt dies nicht aus. Für solche
          Übermittlungen gelten zusätzlich die Anforderungen der Art. 44 ff. DSGVO.
        </p>
        <p>
          Unverbindliche Kontakt- und Konfiguratoranfragen ohne Vertragsabschluss sind sechs Monate
          nach abschließender Bearbeitung zu löschen, sofern kein anderer dokumentierter
          Aufbewahrungsgrund besteht. Dies ist eine betriebliche Frist, keine gesetzliche
          Mindestaufbewahrung. Nicht mehr erforderliche Angaben sind gegebenenfalls früher zu
          löschen. Für Bewerbungen gilt Abschnitt 4, für Empfehlungen Abschnitt 5.
        </p>
        <p>
          Für gesetzlich aufzubewahrende Unterlagen gilt Art. 6 Abs. 1 lit. c DSGVO.
          Nur tatsächlich aufbewahrungspflichtige Unterlagen unterliegen den gesetzlichen Fristen:
          Handels- und Geschäftsbriefe grundsätzlich sechs Jahre, Rechnungen und Buchungsbelege acht
          Jahre, Handelsbücher und Jahresabschlüsse zehn Jahre (§ 257 HGB, § 147 AO, § 14b UStG).
          Die Fristen beginnen grundsätzlich mit dem Ende des jeweils gesetzlich maßgeblichen
          Kalenderjahres. In gesetzlichen Sonderfällen können längere Fristen gelten. Das bedeutet
          keine pauschale Aufbewahrung aller Kundendaten für diese Zeiträume.
        </p>
        <p>
          Für die notwendige Geltendmachung oder Verteidigung von Rechtsansprüchen können einzelne
          Nachweise über den normalen Bearbeitungszweck hinaus benötigt werden. Grundlage ist
          Art. 6 Abs. 1 lit. f DSGVO und unser Interesse an der Rechtsdurchsetzung beziehungsweise
          Rechtsverteidigung. Eine mögliche Verjährungsfrist rechtfertigt keine pauschale
          Verlängerung für sämtliche Vorgangsdaten. Bei laufenden Verfahren richtet sich die
          weitere Speicherung nach dem konkreten Nachweisbedarf.
        </p>
        <p>
          Die Fristen betreffen auch zugehörige Bearbeitungsvermerke, Projektunterlagen, E-Mails und
          eigene Downloadkopien. Sicherungs- und Wiederherstellungskopien können einer gesonderten
          technischen Restaufbewahrung unterliegen. Die Gültigkeit der Consent-Auswahl nach
          Abschnitt 9 ist keine Aufbewahrungsfrist für Geschäftsdaten.
        </p>
      </LegalSection>

      <LegalSection title="12. Ihre Rechte" documentLayout>
        <p>
          Sie können von uns Auskunft über Ihre personenbezogenen Daten und eine Kopie verlangen
          sowie unrichtige Daten berichtigen lassen. Unter den gesetzlichen Voraussetzungen haben
          Sie Anspruch auf Löschung oder Einschränkung der Verarbeitung. Daten, die Sie uns
          bereitgestellt haben und die wir auf Grundlage einer Einwilligung oder eines Vertrags
          automatisiert verarbeiten, können Sie in einem gängigen maschinenlesbaren Format erhalten
          und, soweit technisch machbar, direkt an einen anderen Verantwortlichen übermitteln
          lassen.
        </p>
        <p>
          <strong>Ihr Widerspruchsrecht:</strong> Verarbeiten wir Daten aufgrund berechtigter
          Interessen, können Sie aus Gründen Ihrer besonderen Situation widersprechen. Wir
          verarbeiten diese Daten dann nicht weiter, es sei denn, wir weisen zwingende
          schutzwürdige Gründe nach, die Ihre Interessen, Rechte und Freiheiten überwiegen, oder
          benötigen die Daten für Rechtsansprüche. Gegen eine Verarbeitung für Direktwerbung
          einschließlich damit verbundenen Profilings können Sie jederzeit ohne Angabe von Gründen
          widersprechen; sie wird dann für diese Zwecke beendet.
        </p>
        <p>
          Eine Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen. Die
          Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt unberührt. Für
          Google-Bewertungen nutzen Sie dazu „Cookie-Einstellungen“ im Footer. Für Ihre weiteren
          Anliegen wenden Sie sich an die Kontaktdaten in Abschnitt 1, insbesondere an unseren
          Datenschutzbeauftragten. Wir beantworten Anträge grundsätzlich innerhalb eines Monats;
          über eine gesetzlich zulässige Verlängerung informieren wir Sie innerhalb dieser Frist.
        </p>
        <p>
          Sie haben außerdem das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren,
          insbesondere an Ihrem Aufenthaltsort, Arbeitsplatz oder am Ort eines vermuteten
          Verstoßes. Für unser privatwirtschaftliches Unternehmen ist grundsätzlich zuständig:
        </p>
        <address className="not-italic">
          Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)
          <br />
          Promenade 18
          <br />
          91522 Ansbach
          <br />
          <a
            className="underline"
            href="https://www.lda.bayern.de/"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.lda.bayern.de
          </a>
        </address>
        <p>
          Im Rahmen dieser Website treffen wir keine ausschließlich automatisierten Entscheidungen
          einschließlich Profiling, die Ihnen gegenüber rechtliche Wirkung entfalten oder Sie
          ähnlich erheblich beeinträchtigen. Die Konfiguratoren dienen der unverbindlichen
          Projektorientierung und entscheiden weder über einen Vertrag noch über eine Einstellung.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
