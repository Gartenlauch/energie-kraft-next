# Sprint 10 – Stromspeicher: Validierung

Stand: 29.09.2026. Zielroute `/stromspeicher`. Kein Commit, Push, Deployment oder FAQ-Import.

## Ausgangsstand und Migration

Arbeitsbaum vor Umsetzung: keine getrackten Änderungen, sieben bereits vorhandene ungetrackte QA-Ordner anderer Sprint-10-Aufgaben. Diese wurden erhalten. AGENTS.md und relevante Dateien wurden geprüft. Die bestehende Seite hatte fünf fachlich gute Themen: Dimensionierung, Funktionsweise, Eigenverbrauch, Ersatzstrom, Energiemanagement; Brand-Signet und responsive Sigenergy-Hero waren bereits integriert. Keine sonnen-Produktcards im Next.js-Ausgangsstand.

Die [legitime WordPress-Seite](https://www.energie-kraft.de/energieloesungen/batteriespeicher-photovoltaik/) wurde direkt abgerufen. Erhalten bzw. neu formuliert: überschüssigen PV-Strom speichern, Morgen/Mittag/Abend, zeitliche Verschiebung, Eigenverbrauch, Überwachung und Steuerung, Kombination mit Wärmepumpe/Wallbox, Ersatzstrom. Kein Roh-WXR/SQL/GSC-Export gelesen.

Nicht migriert: sonnenBatterie 10 performance/10 performance+, sonnenProtect 8000, sonnenFlat, alte technische Werte einschließlich der früheren SigenStor-Zellangabe 280 Ah, pauschale Full-Home-/Versorgungsversprechen. Gewerbeprodukt sonnenPro FlexStack bleibt außerhalb dieser Privatkundenseite. SigenStack ebenfalls nicht integriert. Im Next.js-Bestand musste kein sonnen-Block gelöscht werden. Historische Suchanfragen nach diesen Produktnamen können künftig geringere Produktabdeckung auf dieser Seite haben; keine künstlichen Keyword-Sätze oder neuen Redirects dafür angelegt.

## Finale Struktur

1. Hero mit unverändertem H1 und vorhandenen Desktop-/Mobile-Bildern
2. Unverändertes Brand-Signet, Variante `brand`
3. `speicherloesung`: Verbrauch, kWh/kW, Dimensionierung
4. `funktionsweise`: PV-Überschuss und spätere Nutzung, vorhandenes Wohnhausmotiv
5. `speicherprodukte`: zwei große wechselnde Produktporträts; Neo vor SigenStor
6. `eigenverbrauch`: Markenblau, ohne Autarkie- oder Prozentgarantie
7. `ersatzstrom`: geplante Verbraucher und Systemkonfiguration, vorhandenes Bild
8. `energiemanagement`: mySigen, eigenes offizielles App-Motiv
9. `energiesystem`: PV, Speicher, Wallbox, Wärmepumpe
10. `region`: Ainring bei Freilassing, Berchtesgadener Land, Landkreis Traunstein
11. Bestehende dynamische Firestore-FAQ-Auswahl
12. Abschluss mit Speicherkonfiguration und persönlicher Beratung

Die regionale Positionierung und „seit über 20 Jahren“ sind ausdrücklich vom Auftrag vorgegeben und entsprechen bereits freigegebenem PV-Content. Keine zusätzlichen Orte oder Firmenkennzahlen abgeleitet.

## SEO und technische Architektur

- Title: **Stromspeicher für Photovoltaik | Energie-Kraft Süd**
- Description: **Stromspeicher für Photovoltaik: SigenStor Neo und SigenStor passend zu PV-Anlage und Verbrauch planen. Beratung, Installation und Energiemanagement aus einer Hand.**
- Canonical: **https://www.energie-kraft.de/stromspeicher**
- H1: **Solarstrom speichern und dann nutzen, wenn Sie ihn brauchen**
- Vorhandener permanenter Redirect `/energieloesungen/batteriespeicher-photovoltaik` → `/stromspeicher` erhalten; Browser/HTTP prüft Varianten mit/ohne Endslash.
- Keine zweite Speicherroute, keine Änderung an Sitemap oder Indexierungssteuerung. Header- und Mega-Menü-Architektur erhalten. Korrektur: Globale Desktop-/Mobilnavigation und Footer sind exakt auf den Stand vor dem Stromspeicher-Paket zurückgeführt. „Stromtarife“ bleibt dort auch auf `/stromspeicher` vorhanden.
- WebPage-, Service-, Breadcrumb- und FAQ-JSON-LD aus bestehender Architektur erhalten. Kein Product, Offer, AggregateRating oder QAPage ergänzt.
- Kleine rückwärtskompatible Erweiterung: optionales `finalCta` in `PublicPageContent`; alte Inhalte behalten Standardtext und Beratungsziel. Hero unterstützt sowohl bestehende Beratungs-CTAs als auch explizite Konfigurator-/Beratungs-Paare.
- Produkt-/App-Komponenten nur über vorhandene `sectionOverrides` auf `/stromspeicher`; kein globales Produktlayout und keine globale CSS-Änderung.

## Offiziell geprüftes Produktportfolio

[SigenStor Neo](https://www.sigenergy.com/de/product/sigenstor-neo): All-in-One-System für Wohngebäude; PV-Wechselrichter, Batterieleistungselektronik, Batteriemodule, EMS und integriertes Backup-Modul. Stapelbare Module. mySigen-Überwachung und Energieplanung. Keine kW/kWh-Werte, Garantie, 0-ms- oder pauschale Hausversorgungszusage übernommen.

[SigenStor](https://www.sigenergy.com/de/products/sigenstor): modularer, stapelbarer Systemturm mit PV-, Batterie- und EMS-Komponenten. Zusätzliche Energiekomponenten nach Konfiguration. EV-DC-Modul ausdrücklich optional. Backup benötigt eine passende Systemkonfiguration. Keine V2X-Freigabe oder Kapazität erfunden.

[mySigen](https://www.sigenergy.com/de/products/mysigen-app): Energiefluss, Produktions-/Verbrauchsdaten, Speicherstatus und Energiequellen, App/Webzugang sowie Betriebsstrategie/Energieplanung. Verfügbarkeit hängt von Komponenten und Konfiguration ab. Keine KI-Einsparwerte oder Tarifberatung abgeleitet. Dynamische Tarife werden im neuen Content überhaupt nicht ergänzt.

Bilder, Originaldimensionen, lokale Dateien, Dateigrößen, Alt-Texte und Rechtehinweis: [Asset-Dokumentation](sprint10-stromspeicher-assets.md). Drei neue offizielle Motive, sechs vorhandene responsive Dateien wiederverwendet; keine Händler- oder EV-Charger-Bilder als Speicherprodukt.

## Links und Conversion

**KEIN Stromtarife-PV-Link:** Ausschließlich im stromspeicher-spezifischen Main-Content und seinen CTAs kein `/energieloesungen/stromtarife-pv`. Keine Tarif-Section, kein Tarifangebot, keine Tarifberatung.

- Hero: „Projekt konfigurieren“ → `/konfigurator/stromspeicher`; „Speicherberatung anfragen“ → `CONTACT_FORM_HREF` = `/kontakt#kontaktformular`.
- Produktauswahl: „Speicherprojekt besprechen“ → `CONTACT_FORM_HREF`.
- Eigenverbrauch: „Photovoltaikanlage planen“ → `/photovoltaik`.
- Energiesystem: `/photovoltaik`, `/wallbox`, `/waermepumpen`.
- Abschluss: „Speicherprojekt konfigurieren“ → `/konfigurator/stromspeicher`; „Persönliche Beratung“ → `CONTACT_FORM_HREF`.
- Externe Herstellerlinks für beide Produkte und mySigen mit sichtbarer Quellenbezeichnung und zugänglichem Hinweis auf neuen Tab.

## FAQ-Prüfung und offene Redaktion

`faqRouteKey="stromspeicher"` erhalten; Firestore bleibt die einzige Runtime-Quelle. Nur vorhandene öffentliche FAQ-Daten des lokalen Demo-Emulators gelesen, keine privaten Geschäftsdaten, keine Produktion. 40 veröffentlichte Einträge mit Speicher-Platzierung vorhanden; auch Gewerbe- und Tariffragen gehören zum vorhandenen Katalog. Auf der Landingpage erscheinen weiterhin sechs ausgewählte Grundlagenfragen: Funktion, Sinnhaftigkeit, Größe, Eigenverbrauch/Autarkie, nutzbare Kapazität und kW/kWh. Keine Tariffrage im gerenderten Landingpage-FAQ-Block. Tastaturbedienung des vorhandenen Details/Summary-Akkordeons geprüft.

Vorhandene Nachrüstungsfrage erläutert AC-/DC-Kompatibilität; nutzbare Kapazität und Leistung werden getrennt erklärt. Die Größenantwort enthält ältere grobe Richtwerte und kennzeichnet sie als Orientierung. Empfehlung zur späteren redaktionellen Prüfung: noch stärker mit dem individuellen Verbrauchsprofil und der neuen Seitenaussage abstimmen. Keine FAQ-Daten automatisch geändert.

Nur vorgeschlagene Ergänzungen, nicht veröffentlicht:

- Worin unterscheiden sich SigenStor Neo und SigenStor?
- Welche Voraussetzungen braucht eine Ersatzstromversorgung mit meinem Speichersystem?
- Welche Funktionen bietet mySigen bei meiner Systemkonfiguration?
- Kann SigenStor Neo bzw. SigenStor in meine vorhandene PV-Anlage eingebunden werden?

## Quality Gates und Browser-QA

- `npm run check:all`: **erfolgreich (Exit 0)**. ESLint, Next Typegen/TypeScript, **68 Testdateien / 493 Tests**, Functions-Lint/Build, 30 Firestore-/Storage-Rules-Tests und optimierter Next.js-Produktionsbuild bestanden.
- Erster Sandbox-Lauf: Vitest-Start mit `spawn EPERM` blockiert; unveränderter vollständiger Check außerhalb der Sandbox erfolgreich. Keine generierten Dateien gepatcht, keine Tests abgeschwächt.
- Der Navigationstest prüft den erhaltenen globalen Footerlink auf der Speicherseite und anderen Seiten. Neue Contenttests prüfen gerenderte Seite, Metadaten, Canonical, H1, Quellen/Produkte/App, lokale Assets, CTAs, Signet, interne Links, ausgeschlossene Produkte/Tariflinks, JSON-LD und bestehenden Redirect.
- `git diff --check`: **erfolgreich**, nur übliche Windows-LF/CRLF-Hinweise.
- Zusätzlicher ESLint-Lauf für das neue QA-Skript: **erfolgreich**.
- Chrome-QA auf lokalem Produktionsbuild: **1920, 1440, 1280, 1024, 390, 375 px**, jeweils erfolgreich. Kein horizontaler Overflow, auch während Reveal-Animationen; ein Brand-Signet ohne Textkollision; kein Tariflink im Main-Content; globale Navigation/Footer enthalten den Tariflink gemäß Korrektur; vollständige Produktbilder; Neo vor SigenStor; mySigen auf Mobil vollständig sichtbar; keine kaputten geladenen Bilder oder lokalen Requests ab Status 400; keine JavaScript-Ausnahmen.
- Hero-CTAs tatsächlich bei 1440 und 390 px geklickt, richtige Konfigurator-/Kontaktformular-Ziele erreicht; keine Formulare abgesendet.
- Linkziele `/photovoltaik`, `/wallbox`, `/waermepumpen`, `/konfigurator/stromspeicher`, `/kontakt`: **HTTP 200**.
- Reduced Motion: Signet-Animation `none`, kein ausstehender Reveal.
- Gezielt geprüfte Regressionen auf `/`, `/photovoltaik`, `/wallbox`, `/waermepumpen`, `/klimaanlagen`, jeweils 1440/390 px: H1, ein Signet, Bilder, erhaltene Tariflinks im Footer und kein Overflow erfolgreich.
- Screenshots visuell geprüft: Hero, beide Produktporträts, Backup und mySigen einschließlich mobiler Produkt-/App-Ansicht. Finaler CTA und FAQ im Vollseitenscreenshot erfasst; gerenderte Abschlussziele durch Unit-Test abgesichert.
- Maschinenbericht: [results.json](../artifacts/sprint10-stromspeicher-qa/results.json).

Reproduktion: vorhandene lokale Demo-Emulatoren mit `.emulator-data` starten, erfolgreich gebaute App mit `npm run start -- --port 3021` starten, `node scripts/sprint10-stromspeicher-browser.mjs`. Das QA-Skript liest und navigiert ausschließlich; es importiert keine FAQ und sendet keine Formulare ab.

## Screenshots

Ordner: `artifacts/sprint10-stromspeicher-qa/`. Nicht gestagt.

- [01-stromspeicher-full-1440.png](../artifacts/sprint10-stromspeicher-qa/01-stromspeicher-full-1440.png)
- [02-stromspeicher-hero-1440.png](../artifacts/sprint10-stromspeicher-qa/02-stromspeicher-hero-1440.png)
- [03-stromspeicher-products-1440.png](../artifacts/sprint10-stromspeicher-qa/03-stromspeicher-products-1440.png)
- [04-stromspeicher-sigenstor-neo-1440.png](../artifacts/sprint10-stromspeicher-qa/04-stromspeicher-sigenstor-neo-1440.png)
- [05-stromspeicher-sigenstor-1440.png](../artifacts/sprint10-stromspeicher-qa/05-stromspeicher-sigenstor-1440.png)
- [06-stromspeicher-mysigen-1440.png](../artifacts/sprint10-stromspeicher-qa/06-stromspeicher-mysigen-1440.png)
- [07-stromspeicher-backup-1440.png](../artifacts/sprint10-stromspeicher-qa/07-stromspeicher-backup-1440.png)
- [08-stromspeicher-mobile-390-full.png](../artifacts/sprint10-stromspeicher-qa/08-stromspeicher-mobile-390-full.png)
- [09-stromspeicher-products-mobile-390.png](../artifacts/sprint10-stromspeicher-qa/09-stromspeicher-products-mobile-390.png)
- [10-stromspeicher-mysigen-mobile-390.png](../artifacts/sprint10-stromspeicher-qa/10-stromspeicher-mysigen-mobile-390.png)

## Dateien und verbleibende Punkte

Geändert: `src/content/pages/stromspeicher.ts`, `src/app/(site)/stromspeicher/page.tsx`, `src/app/(site)/_components/public-content-page.tsx`, `src/types/content.ts`.

Neu: `src/app/(site)/stromspeicher/stromspeicher-sections.tsx`, drei WebP-Dateien unter `public/images/battery-storage/products/`, `tests/unit/stromspeicher-page-content.test.ts`, `tests/unit/storage-navigation.test.ts`, `scripts/sprint10-stromspeicher-browser.mjs`, diese Validierung, Asset-Dokumentation und ungestagte QA-Artefakte.

Offene manuelle Punkte: Herstellerbildfreigabe vor Veröffentlichung dokumentieren; vorgeschlagene FAQ-Ergänzungen redaktionell freigeben. Keine technische Blockade. Keine Preise, SKU/GTIN, Bestand, Lieferzeit, Modellkapazitäten, erfundene Bewertungen oder Autarkiegarantien. Keine Gewerbeprodukte als Privatkundenportfolio. Seite bleibt Beratung/Information, ohne Shop-Funktion.

Git-Endstand nach Korrektur: Header, Footer und zentrale Routen entsprechen exakt HEAD (Stand vor dem Stromspeicher-Paket); vier getrackte Änderungen des ursprünglichen Speicherpakets bleiben erhalten. Die temporäre Footer-Komponente und die Tariflink-Ausnahme sind entfernt. Nichts gestagt.

Korrekturauftrag: Ausschluss gilt ausschließlich für den eigentlichen Main-Content. Keine Produkt-, Content-, Bild- oder SEO-Änderungen bei dieser Korrektur. Die früheren Vollseiten-Screenshots und der frühere Browserbericht dokumentieren den Stand vor dieser Navigationkorrektur; aktueller gezielter Prüfnachweis: `artifacts/sprint10-stromspeicher-qa/navigation-correction-results.json`.

Korrekturprüfung erfolgreich: geöffnete Desktop-Navigation bei 1440 px und Mobilnavigation bei 390 px enthalten „Stromtarife“ mit dem richtigen Ziel; der globale Footer enthält den Link ebenfalls. Im Main-Content ist kein Tariflink vorhanden. `npm run check:all`: Exit 0, 68 Testdateien / 493 Unit-Tests, 30 Rules-Tests und Produktionsbuild bestanden. `git diff --check`: bestanden. Header, Footer und Routen haben gegenüber dem Stand vor dem Speicherpaket keinen Diff; die Inhalte anderer Seiten wurden nicht bearbeitet.
