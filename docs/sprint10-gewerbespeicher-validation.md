# Sprint 10 – Gewerbespeicher: Validation

## Ausgangsstand und Scope

Keine vorhandenen Änderungen an getrackten Dateien überschrieben; bestehende QA-Artefakte bleiben unberührt. Zielroute `/energieloesungen/gewerbespeicher` war eine kompakte Seite mit zwei Textabschnitten, einem passenden Gewerbe-Hero und seitenspezifischem `noIndex: true`.

Die Seite verwendet weiterhin Sprint8ContentPage / MarketingFeaturePage, PremiumHeroSection, BrandIntro mit Variante `brand`, EditorialFeatureSection und Reveal. Die gemeinsamen Komponenten wurden um optionale Hero-CTA-/Bildmaß-Props und Section-Overrides nach dem vorhandenen PublicContentPage-Muster erweitert. Bestehende Aufrufer behalten ihr Verhalten. Drei lokale Abschnitte übernehmen Anwendungen, Produktporträts und Energiemanagement.

Keine Änderungen an Homepage, privaten Produktseiten, Navigation, Header, Footer, Partnercarousel, Signet-Animation, Rechnern oder Konfiguratorlogik. Keine Datenbankänderungen, realen E-Mails, Commits, Pushes oder Deployments.

## SEO und Indexierung

- Title: **Gewerbespeicher für Unternehmen | Energie-Kraft Süd**
- Description: **Gewerbespeicher für Unternehmen in Bayern: SigenStack und sonnenPro FlexStack passend zu Photovoltaik, Lastprofil und betrieblichen Anforderungen planen.**
- Canonical: **/energieloesungen/gewerbespeicher**
- H1: **Energie speichern, Lastspitzen steuern und Eigenstrom besser nutzen**
- Seitenspezifisches noIndex entfernt; `SEARCH_NO_INDEX_DIRECTIVE`, globale Umgebungssteuerung, Robots- und Header-Sperren unverändert.
- Route im zentralen PUBLIC_ROUTES-Katalog ergänzt, damit sie in der bestehenden produktiven Sitemap berücksichtigt wird. Header-/Footer-Flags false; vorhandener Mega-Menü-Eintrag unverändert. Keine neue FAQ-Kategorie.
- Vorhandenes WebPage-/BreadcrumbList-JSON-LD erhalten. Keine Product-/Offer-/Preis-/SKU-/GTIN-/Rating-Auszeichnung.

## Finale Dramaturgie

Hero mit Kontakt- und Gewerbe-PV-CTA → Brand-Signet → Lastprofil (`einsatz`) → vier Anwendungen (`anwendungen`) → zwei Produktporträts (`produkte`, `sigenstack`, `sonnenpro-flexstack`) → Entscheidung (`entscheidung`) → Energiemanagement (`energiemanagement`) → Standort/Sicherheit (`standort`) → Wirtschaftlichkeit (`wirtschaftlichkeit`) → Gewerbe-PV (`photovoltaik`) → Region (`region`) → Service (`service`) → finaler Kontakt-CTA.

Die Reihenfolge auf Mobilgeräten bleibt Bild → Produktname/Beschreibung → technische Merkmale → Herstellerlink; SigenStack steht vor FlexStack. Große gleichartige Porträts, keine Preise oder Rankings. Eine beschriftete schematische Steuerungsdarstellung erklärt Energiemanagement ohne erfundene Messwerte.

## Fachliche Quellen und Entscheidungen

[SigenStack – offizielle deutsche Produktseite](https://www.sigenergy.com/de/products/sigenstack): modular/stapelbar, 12 kWh pro Batteriemodul, kompakter Aufbau, DC-Kopplung, IP66, Schutzmechanismen auf Modulebene sowie Echtzeit-Systemüberwachung in Sigen Cloud. Keine allgemeinen Wartungsfreiheits-, Effizienz-, Verfügbarkeits- oder Sicherheitsgarantien übernommen.

[sonnenPro FlexStack – offizielle deutsche Produktseite](https://www.sonnen.pro/de-de/flexstack): Gewerbe/Industrie/Landwirtschaft, modular, Erweiterung in 55-kWh-Schritten, konfigurationsabhängig bis 368 kW / 495 kWh, IP65, Innen-/Außenaufstellung sowie sonnenPro EMS für PV-Nutzung, Lastspitzen und Verbrauchersteuerung. Maxima sind keine pauschalen Werte jeder Konfiguration. Keine allgemeine Autarkiezahl, Einspargarantie oder Aussage, Netzausbau werde überflüssig.

Die Darstellung unterscheidet Monitoring bei Sigen Cloud von den ausdrücklich beschriebenen EMS-Steuerungsfunktionen bei sonnen. Schnittstellen, Betriebsstrategie, Schutzkonzept und Backup werden projektspezifisch geprüft. Eine IP-Klasse ersetzt keine Standort-, Brandschutz-, baurechtliche oder versicherungstechnische Prüfung.

Wirtschaftlichkeit wird aus verifizierten Verbrauchs-/PV-Daten, Bezugsbedingungen, Investitions-/Betriebskosten und gemeinsamer Nutzung von Leistung/Kapazität für Eigenverbrauch und Peak Shaving bewertet. Keine garantierte Rendite, feste Amortisationszeit oder Prozentersparnis. kW und kWh werden verständlich unterschieden.

## Region, Service und Conversion

Einsatzgebiet gemäß Auftrag: Ainring, Berchtesgadener Land, Landkreis Traunstein und angrenzende Region; größere Gewerbeprojekte in ganz Bayern. Die Angabe „seit über 20 Jahren“ stammt aus dem Auftrag und dem vorhandenen Gewerbe-PV-Inhalt. Österreich und deutschlandweite Leistungsversprechen stehen nicht im sichtbaren Seitencontent.

Wartung, Instandhaltung, Reparatur/Störungsbeseitigung, Wartungsverträge und Anlagenüberwachung/Leitstelle werden im vereinbarten Serviceumfang eingeordnet; keine automatische 24/7-Überwachung behauptet.

Interne Ziele: `/energieloesungen/photovoltaik-fuer-unternehmen`, `/referenzen`, `/service-und-wartung`, `/service-und-wartung/service-und-team` sowie CONTACT_FORM_HREF (`/kontakt#kontaktformular`). Externe Links öffnen die beiden offiziellen Produktseiten gemäß bestehender target/rel-Konvention; neue Tabs werden für Screenreader angekündigt.

## FAQ

Keine passende Gewerbespeicher-Kategorie im bestehenden Routenkatalog. Keine neue Kategorie, statische FAQ-Datenquelle oder FAQ-Struktur veröffentlicht. Für eine spätere redaktionelle Freigabe und Pflege im bestehenden Admin-/Firestore-System:

- Wie groß muss ein Gewerbespeicher sein?
- Was ist Peak Shaving?
- Kann ein Gewerbespeicher ohne PV betrieben werden?
- Welche Aufstellung ist möglich?
- Wie unterscheiden sich SigenStack und FlexStack?
- Kann Ladeinfrastruktur eingebunden werden?

## Prüfungen und offene Punkte

Regressionstests: `tests/unit/gewerbespeicher-page-content.test.ts` prüft exakte SEO-Daten/H1, seitenspezifische Freigabe bei weiterhin aktiver globaler Sperre, Sitemap-Katalog, Abschnittsreihenfolge, Produkte/Herstellerlinks, lokale Bilddateien, Kontakt-/B2B-Links, Regionen, Ausschluss alter Privatprodukte/Preise und erhaltenes Signet/JSON-LD.

Browser-Harness: `scripts/sprint10-gewerbespeicher-browser.mjs`; ausschließlich lokale Leseprüfungen, keine Formularübermittlung. Vorgesehene Breiten: 1920, 1440, 1280, 1024, 390 und 375. Prüft H1/Title/Canonical, Signet, Bilder, Overflow, Produktreihenfolge, Reduced Motion, Tastaturreihenfolge der Produktlinks, CTA-Anker und interne Linkziele.

`npm run check:all`: vollständig erfolgreich (Exit 0), einschließlich ESLint, next typegen/TypeScript, 69 Unit-Testdateien mit 497 Tests, Functions-Lint/Build, lokaler Firestore-/Storage-Rules-Prüfungen und Next.js-Produktionsbuild. Die vier neuen Seitentests sind enthalten; bestehende Tests wurden nicht abgeschwächt. Ein erster Lauf stoppte am temporären Bildextraktions-Hilfsskript; nach dessen Verschiebung in eine Text-Artefaktdatei war der vollständige Lauf grün.

`git diff --check`: erfolgreich, keine Whitespace-Fehler. Keine generierten Next-Dateien manuell bearbeitet.

Browser-QA: erfolgreich gegen den lokalen Produktionsbuild auf Port 3021. Alle sechs Breiten ohne horizontalen Overflow oder defekte Bilder; exakter H1, Title, Canonical und Signet vorhanden. Beide Produkte in korrekter DOM-Reihenfolge. Kontakt-CTA auf Desktop und Mobile führt zum sichtbaren Kontaktformular. Alle fünf geprüften internen Zielrouten antworten mit 200. Keine JavaScript-Exceptions oder fehlgeschlagenen HTTP-Antworten im finalen Durchlauf. Reduced Motion: keine wartenden Reveal-Elemente und Signet-Animation `none`. Tastatur-Tab führt vom Sigenergy-Link zum sonnen-Link.

Für die öffentlichen FAQ-Abfragen der bestehenden Kontakt-/Gewerbe-PV-Zielseiten war der lokale Firestore-Emulator erforderlich. Der anfängliche Durchlauf ohne laufenden Emulator wurde nach dessen Start wiederholt. Ausschließlich Demo-Emulator, keine Produktionsabfrage, keine Formulare abgesendet. Resultat: [results.json](../artifacts/sprint10-gewerbespeicher-qa/results.json).

Visuell geprüft: Desktop-Hero, beide Produktporträts und deren Balance, Energiemanagement, Wirtschaftlichkeit, kompletter Desktop-Seitenverlauf mit Standort/Region/Service/CTA sowie mobiles Hero mit Signet und mobile Produktreihenfolge. Bilder und Texte bleiben vollständig lesbar; die vorhandenen Responsive-/Reduced-Motion-Regeln reichen aus, keine globalen CSS-Änderungen erforderlich.

## Screenshots

Alle unter `artifacts/sprint10-gewerbespeicher-qa/`, nicht gestagt:

- [01-gewerbespeicher-full-1440.png](../artifacts/sprint10-gewerbespeicher-qa/01-gewerbespeicher-full-1440.png)
- [02-gewerbespeicher-hero-1440.png](../artifacts/sprint10-gewerbespeicher-qa/02-gewerbespeicher-hero-1440.png)
- [03-gewerbespeicher-products-1440.png](../artifacts/sprint10-gewerbespeicher-qa/03-gewerbespeicher-products-1440.png)
- [04-sigenstack-1440.png](../artifacts/sprint10-gewerbespeicher-qa/04-sigenstack-1440.png)
- [05-flexstack-1440.png](../artifacts/sprint10-gewerbespeicher-qa/05-flexstack-1440.png)
- [06-gewerbespeicher-energy-management-1440.png](../artifacts/sprint10-gewerbespeicher-qa/06-gewerbespeicher-energy-management-1440.png)
- [07-gewerbespeicher-economics-1440.png](../artifacts/sprint10-gewerbespeicher-qa/07-gewerbespeicher-economics-1440.png)
- [08-gewerbespeicher-mobile-390-full.png](../artifacts/sprint10-gewerbespeicher-qa/08-gewerbespeicher-mobile-390-full.png)
- [09-gewerbespeicher-products-mobile-390.png](../artifacts/sprint10-gewerbespeicher-qa/09-gewerbespeicher-products-mobile-390.png)

Zusätzlich: Region/Service-Desktop, mobiles Hero/Signet und verkleinerter Desktop-Seitenüberblick für die Sichtprüfung.

## Dateien und Git

| Status   | Datei                                                                          |
| -------- | ------------------------------------------------------------------------------ |
| Geändert | `src/content/sprint8-pages.ts`                                                 |
| Geändert | `src/app/(site)/energieloesungen/gewerbespeicher/page.tsx`                     |
| Geändert | `src/app/(site)/_components/sprint8-content-page.tsx`                          |
| Geändert | `src/app/(site)/_components/marketing-feature-page.tsx`                        |
| Geändert | `src/config/routes.ts`                                                         |
| Neu      | `src/content/pages/gewerbespeicher.ts`                                         |
| Neu      | `src/app/(site)/energieloesungen/gewerbespeicher/gewerbespeicher-sections.tsx` |
| Neu      | `public/images/commercial-storage/products/sigenstack.webp`                    |
| Neu      | `public/images/commercial-storage/products/sonnenpro-flexstack.webp`           |
| Neu      | `tests/unit/gewerbespeicher-page-content.test.ts`                              |
| Neu      | `scripts/sprint10-gewerbespeicher-browser.mjs`                                 |
| Neu      | `docs/sprint10-gewerbespeicher-validation.md`                                  |
| Neu      | `docs/sprint10-gewerbespeicher-assets.md`                                      |

`git status --short` zeigt diese fünf geänderten Dateien und die neuen Dateien/Verzeichnisse sowie weitere vorhandene ungetrackte QA-Verzeichnisse. Es wurde nichts gestagt. `git diff --stat` für die getrackten Änderungen: 5 Dateien, 69 Einfügungen, 71 Löschungen; neue ungetrackte Dateien sind darin noch nicht enthalten.

Offener Veröffentlichungspunkt: dokumentierte Nutzungsfreigabe der beiden neuen Herstellerassets; siehe [Asset-Dokumentation](sprint10-gewerbespeicher-assets.md). Keine neue FAQ ohne Freigabe. Keine Produktionsindexierung freigegeben.
