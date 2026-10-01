# Sprint 10 – Photovoltaik für Unternehmen

> Historischer Stand vor der Routing-Migration in Sprint 10: Die hier genannten alten Energielösungen-URLs sind keine aktiven Ziele mehr. Aktuelle Zuordnung und Prüfung: [Routing-Cleanup](sprint10-energy-solutions-routing-cleanup.md).

## Ausgangsstand und Quellen

Die bestehende Route `/energieloesungen/photovoltaik-fuer-unternehmen` enthielt drei Abschnitte zu Lastprofil/Gebäude, PV/Speicher/Verbrauchern und Umsetzung/Service. Vor Beginn bestanden keine Änderungen an versionierten Dateien; bereits vorhandene, unversionierte Homepage-/Signet-QA-Artefakte wurden erhalten.

Die WordPress-Quelle `https://www.energie-kraft.de/energieloesungen/photovoltaik-fuer-unternehmen/` lieferte beim Abruf am 29.09.2026 HTTP 403. Die Sperre wurde nicht umgangen. Die Migration basiert auf dem Themeninventar, den Textvorgaben und den ausdrücklich bestätigten Unternehmensangaben des Auftrags; ein vollständiger Live-Abgleich mit WordPress war nicht möglich.

## Inhalt und Architektur

Zurückgeführt wurden Eigenstrom und Betriebskostenbetrachtung, Effizienzcheck durch Ertrags-/Verbrauchsabgleich, Investitionsbetrachtung und projektzeitbezogene Förderprüfung, Gewerbespeicher, Skalierbarkeit, Industrie, Landwirtschaft, kommunale Projekte, über 20 Jahre Unternehmensbestand, Betreuung aus einer Hand sowie Wartung, Instandhaltung, Reparatur, Störungsbeseitigung, Wartungsverträge und Leitstelle/Anlagenüberwachung.

Erhalten wurden die vorhandenen Themen Lastprofil/Dach/Anschlussbedingungen, das gemeinsame Betrachten von PV, Speicher und betrieblichen Verbrauchern sowie Planung → Installation → Inbetriebnahme → Service. Bestehende Desktop-/Mobile-Bilder, Breadcrumbs, WebPage- und FAQ-Markup und die FAQ-Kategorie `photovoltaik` bleiben erhalten.

Nicht übernommen: störungsfreie Energieversorgung als Versprechen, garantierte Renditen oder Kostensenkungen, nahezu keine Stromkosten, pauschale Förderzusagen, unbestätigte Fördersummen/Programme, erfundene Amortisationszeiten, Verfügbarkeits-/Reaktionszeit-/24/7-Garantien oder ein exaktes Gründungsjahr. Es wurden keine Preise, Product-/Offer-/AggregateRating-Daten oder `foundingDate` ergänzt.

`Sprint8ContentPage → MarketingFeaturePage → PremiumHeroSection / EditorialFeatureSection` bleibt die Architektur. Die minimalen optionalen Section-Felder `surface` und `layout` reichen vorhandene Komponentenoptionen durch. Standardverhalten anderer Seiten bleibt erhalten; `Sprint8PageContent.sections` verwendet den bestehenden gemeinsamen Section-Typ. Signet, Animation, globale CSS-/SEO-Konfiguration, Navigation, Homepage, Partner-Carousel und Wallbox wurden nicht geändert.

## Finaler Aufbau

1. Hero mit Gewerbe-Bild, Lead und Kontakt-CTA; anschließend bestehendes Signet.
2. Eigenstrom im Betrieb (`eigenstrom`, Statement auf weicher Fläche).
3. Verbrauch, Lastprofil und Gebäude (`planung`, Editorial mit Planungsfaktoren).
4. Effizienzcheck und Wirtschaftlichkeit (`wirtschaftlichkeit`, Editorial).
5. PV und Gewerbespeicher (`gewerbespeicher`, Bild/Text mit bestehenden responsiven Systembildern).
6. Skalierbare Anwendungen (`anwendungen`, blaues Statement mit Branchen).
7. Über 20 Jahre und Betreuung aus einer Hand (`erfahrung`, Editorial).
8. Service, Wartung und Leitstelle (`service`, Editorial mit Leistungsumfang).
9. Regionale Referenzen (`referenzen`, Statement; bestehender Referenzhub).
10. Bestehende dynamische Photovoltaik-FAQs und finaler Kontakt-CTA.

Keine zweite Route, Redirect-Änderung, branchenspezifische Landingpage oder neue Gewerbe-Referenzgalerie. Einzelprojekte wurden nicht neu als Gewerbe klassifiziert.

## SEO und Verlinkung

- Title: **Photovoltaik für Unternehmen & Gewerbe | Energie-Kraft Süd**
- Description: **Photovoltaik für Unternehmen und Gewerbe in Bayern: Lastprofil analysieren, Eigenstrom nutzen und PV mit Speicher kombinieren. Planung, Installation und Service aus einer Hand.**
- H1: **Photovoltaik für Unternehmen: eigenen Solarstrom wirtschaftlich nutzen**
- Canonical unverändert: **https://www.energie-kraft.de/energieloesungen/photovoltaik-fuer-unternehmen**
- Hero und finaler CTA: **Gewerbeprojekt besprechen**, beide über `CONTACT_FORM_HREF` nach `/kontakt#kontaktformular`.

Interne Links: `/referenzen`, `/energieloesungen/gewerbespeicher`, `/wallbox`, `/service-und-wartung`, `/service-und-wartung/service-und-team`, `/kontakt#kontaktformular`. Keine neue URL und kein Gewerbe-Konfigurator.

Einsatzgebiet: von Ainring aus regional im Berchtesgadener Land und Landkreis Traunstein; größere Projekte auch in ganz Bayern. Österreich, Salzburg und deutschlandweite Abdeckung werden im neuen Seiteninhalt nicht genannt.

Serviceumfang: Wartung, Instandhaltung, Reparatur/Störungsbeseitigung und Wartungsverträge. Die Leitstelle ermöglicht laufende Überwachung, Erkennung und Prüfung von Auffälligkeiten; daraus wird keine garantierte Verfügbarkeit oder Einsatzfrist abgeleitet.

## Verifikation

Neue Content-Tests: exakter SEO Title/Description/Canonical/H1, regionale Aussagen, über 20 Jahre, erlaubter Serviceumfang, interne Links, zentrale Kontakt-CTA-Konstante, keine Österreich-/Garantieformulierungen, acht Themenabschnitte und vorhandene responsive Assets.

`npm run check:all`: vollständig bestanden (Exit 0). ESLint und Next-Typegen/TypeScript grün; 65 Unit-Testdateien mit 483 Tests grün, darunter vier neue Business-PV-Content-Tests. Functions-Lint und Functions-Build grün; 30 Firestore-/Storage-Regeltests im lokalen Demo-Emulator grün; Next.js-Produktionsbuild erfolgreich.

Der erste Sandbox-Lauf scheiterte beim Vitest-Prozessstart mit `spawn EPERM`; die Prüfkette wurde mit freigegebener lokaler Prozessausführung fortgesetzt. Ein erster Testlauf außerhalb der Sandbox zeigte ein fehlendes Environment-Mock im neuen Test (bestehende 479 Tests bestanden); nach Anpassung an das bestehende Mock-Muster war die gesamte Prüfkette grün. Bestehende Tests wurden nicht verändert.

`git diff --check`: bestanden (Exit 0); lediglich Git-Hinweise zur Windows-LF/CRLF-Konvertierung, keine Whitespace-Fehler.

Browser-Skript: `scripts/sprint10-business-pv-browser.mjs`; lokale Produktionsvorschau auf Port 3020, Chrome Headless, ausschließlich lesende Prüfungen ohne Formularversand. Viewports: 1920, 1440, 1280, 1024, 390 und 375 px.

Alle sechs Viewports bestanden: jeweils eine exakte H1, richtiger Title/Canonical, vorhandenes Signet, kein horizontaler Overflow und keine defekten Bilder. WebPage-/Breadcrumb-/FAQ-Markup vorhanden; keine neu hinzugefügten Product-/Offer-/AggregateRating-/QAPage-Daten. Keine JavaScript-Ausnahmen oder lokalen HTTP-Fehler. Der lokale Layout-Shift-Beobachter meldete bei 1920 px etwa 0,00025, bei den übrigen Breiten 0; dies ist eine lokale Stichprobe, keine Aussage zu produktiven Core Web Vitals.

FAQ-Aufklappen in allen sechs Breiten geprüft. Hero-Kontakt-CTA bei 1440 px und finaler Kontakt-CTA bei 390 px navigieren nach `/kontakt#kontaktformular` und zeigen das Formular im Viewport. Referenzen, Gewerbespeicher, Service & Wartung, Service & Team, Wallbox und Kontakt wurden im Browser geöffnet und zusätzlich mit HTTP 200 bestätigt. Keine Formularübermittlung.

Die vollständige Desktop-Komposition, Hero und Systembild bei 1440 px sowie Mobile-Hero/Signet und Service bei 390 px wurden zusätzlich visuell anhand der Screenshots geprüft: lesbare Typografie, kontrollierte Zeilenlängen, wechselnde Flächen und Statement-/Editorial-Proportionen, sinnvoller Systembildausschnitt. Die anderen vier Breiten wurden mit Browser-DOM-/Interaktionschecks geprüft.

Screenshot-Ziele:

- `artifacts/sprint10-business-pv-qa/01-business-pv-full-1440.png`
- `artifacts/sprint10-business-pv-qa/02-business-pv-hero-1440.png`
- `artifacts/sprint10-business-pv-qa/03-business-pv-planning-1440.png`
- `artifacts/sprint10-business-pv-qa/04-business-pv-storage-1440.png`
- `artifacts/sprint10-business-pv-qa/05-business-pv-service-1440.png`
- `artifacts/sprint10-business-pv-qa/06-business-pv-mobile-390-full.png`
- `artifacts/sprint10-business-pv-qa/07-business-pv-mobile-service-390.png`
- `artifacts/sprint10-business-pv-qa/08-business-pv-mobile-hero-390.png` (zusätzlicher Ausschnitt der vollständigen Mobile-Aufnahme zur visuellen Hero-/Signet-Prüfung)
- Maschinenlesbare Resultate: `artifacts/sprint10-business-pv-qa/results.json`.

## SEO Red Team

URL und Canonical bleiben gleich. Unternehmen/Gewerbe und Photovoltaik stehen im Title, Hero und Hauptinhalt; Speicher bleibt ein unterstützender Systembaustein. Regionaler Schwerpunkt und Bayern sind natürlich in Sätzen integriert. Keine Orts-/Keywordlisten, Österreich-Aussagen, aggressiven Ergebnisversprechen oder ungeprüften Zahlen. Sämtliche im Auftrag genannten WordPress-Themen sind abgedeckt. Die Seitenlänge wächst durch fachliche Themen statt durch wiederholte Marketingabsätze.

## Offene Punkte

WordPress-Live-Abgleich wegen HTTP 403 nicht möglich.

Die vorhandene FAQ-Auswahl umfasst „Lohnt sich eine Photovoltaikanlage 2026 noch?“, „Was kostet eine Photovoltaikanlage?“, „Wie groß sollte meine Photovoltaikanlage sein?“, „Sollte man das Dach mit Photovoltaik möglichst voll belegen?“, „Wie viel Strom erzeugt 1 kWp Photovoltaik pro Jahr?“ und „Wie viel Dachfläche benötigt 1 kWp Photovoltaik?“. Diese Fragen sind allgemeine PV-Grundlagen; eine spezifische B2B-Abdeckung von Schichtbetrieb/Lastprofil, Anschlussbedingungen, Gewerbespeichern und laufender Anlagenbetreuung fehlt. Empfehlung für einen späteren Content-Schritt: passende B2B-Fragen über die bestehende authentifizierte FAQ-Verwaltung kuratieren. Die aktuelle Anbindung wurde erhalten; keine FAQ-Daten, persistenten Emulator-Daten oder Produktionsressourcen wurden verändert.

## Dateiumfang und Git

Geändert: `src/content/sprint8-pages.ts`, `src/app/(site)/_components/marketing-feature-page.tsx`.

Neu: `tests/unit/business-pv-content.test.ts`, `scripts/sprint10-business-pv-browser.mjs`, diese Dokumentation und die QA-Artefakte im angegebenen Verzeichnis. Die Route-Datei und `Sprint8ContentPage` benötigen keine Änderung.

Kein Commit, Push, Deployment oder Staging von QA-Artefakten. `git diff --stat`: zwei versionierte Dateien, 99 Ergänzungen und 37 entfernte Zeilen. Zusätzlich sind die drei neuen Textdateien und `artifacts/sprint10-business-pv-qa/` unversioniert. Bereits vorhandene unversionierte Artefaktverzeichnisse (`homepage-sprint10-full-polish`, `homepage-sprint10-micro-polish`, `homepage-sprint10-qa`, `homepage-sprint10-visual-polish`, `sprint10-signet-partner-qa`) bleiben unverändert erhalten. Die nur für QA gestartete Produktionsvorschau und Emulatoren wurden danach beendet.
