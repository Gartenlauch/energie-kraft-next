# Sprint 10 – Wärmepumpen: Umsetzung und Validierung

> Historischer Stand vor der Routing-Migration in Sprint 10: Die hier genannten alten Energielösungen-URLs sind keine aktiven Ziele mehr. Aktuelle Zuordnung und Prüfung: [Routing-Cleanup](sprint10-energy-solutions-routing-cleanup.md).

Stand / Herstellerprüfung: 29.09.2026. Lokaler `main`-Arbeitsstand; `git status --short` und `git diff --stat` zu Beginn ausgeführt. Keine bestehenden Änderungen an den betroffenen getrackten Dateien; vorhandene untracked QA-Ordner erhalten. Keine fremden Änderungen, bestehenden QA-Ordner oder Sicherungsbranches verändert. Kein Commit, Push, Deployment oder Produktionseingriff.

## Angebot und Content

Bestätigt durch den Auftraggeber: Energie-Kraft Süd verkauft Bosch-Luft-Wasser-Wärmepumpen, koordiniert die Installation mit qualifizierten Montagepartnern und besteht seit über 20 Jahren. Die Unternehmensdauer wird ausdrücklich nicht als Wärmepumpen-Installateur-Erfahrung dargestellt. Die laufende interne Schulung wird nicht als abgeschlossene Zertifizierung beworben.

Die historische PV-Suchintention bleibt erhalten. Title: **Wärmepumpe mit Photovoltaik | Energie-Kraft Süd**. H1: **Effizient heizen und eigenen Solarstrom intelligent nutzen**. Canonical: `/waermepumpen`. Neue Description exakt nach Auftrag. Indexierungsregeln, WebPage-/Breadcrumb-Architektur und FAQ-JSON-LD bleiben erhalten; keine erfundenen Product-/Offer-/Rating-Daten.

Die finalen öffentlichen Texte werden ausschließlich in [waermepumpen.ts](../src/content/pages/waermepumpen.ts) gepflegt. Die JSX-Datei übernimmt Texte und CTAs aus diesem Modell. Hero, Planung, Produktintro, Produktbeschreibungen/-merkmale, PV-Kombination, Effizienz, Rechner, Umsetzung und der gesamte „übrigens“-Text entsprechen der Vorgabe. Ergänzungen: sachliche gemeinsame Produkteinordnung mit Heizkörper-/Vorlauftemperaturgrenze; zwei erläuternde Absätze zu Gerätebedienung, Energiemanagement, mySigen und SG-Ready. Keine Kühlfunktion, Förderzahlen, Tarife oder weiteren Modelle ergänzt.

Reihenfolge:

1. Hero, anschließend genau ein `BrandIntro` mit `brandIntroVariant="brand"`.
2. `waermepumpen-planung`: Gebäude und Wärmebedarf.
3. `bosch-waermepumpen`: alternierende Porträts, zuerst Compress 6800i AW, dann Compress 5800i AW. Mobile Bildreihenfolge vor Produkttext.
4. `photovoltaik-kombination`: PV-Fachtext und genau ein kompakter blauer „übrigens“-Hinweis innerhalb derselben Section.
5. `energiemanagement`: Systemvoraussetzungen und Funktionsabgrenzung.
6. `effizienz`: Auslegung und Aufstellung.
7. `waermepumpen-rechner`: unveränderte Modellrechnung und Link.
8. `umsetzung`: Beratung, Verkauf, Montagekooperation und Region.
9. Vorhandene Firestore-FAQ-Ausgabe.
10. Vorhandener `finalCta` mit „Welche Wärmepumpe passt zu Ihrem Zuhause?“.

Alle sechs bisherigen Abschnittsanker bleiben erhalten. Kein zusätzlicher Abschlussblock, Sticky-Banner oder Pop-up. Keine Änderung von Rechner-/Konfiguratorlogik, Lead-, Mail- oder PDF-Prozessen. Navigation, Footer, Homepage, Signet-Code einschließlich Größe/920-ms-Animation/Reduced Motion und Vergleichsseiten unverändert. Die einzige gemeinsame Dateiänderung betrifft die Wärmepumpen-Zeile in `pageVisuals`; die Wrapper-CTA-Logik bleibt bestehen und wird über Render-Tests geprüft.

## Herstellerprüfung und Produktwahl

Genau zwei redaktionell ausgewählte Baureihen, keine Verkaufsrangliste:

- [Bosch Compress 6800i AW](https://www.bosch-homecomfort.com/de/de/ocs/wohngebaeude/compress-6800i-aw-19312695-p/): Modernisierung und Neubau, Luft-Wasser-System, Heizung/Warmwasser, R290, schalloptimierter Aufbau, Systemvarianten und HomeCom Easy mit passender Ausstattung.
- [Bosch Compress 5800i AW](https://www.bosch-homecomfort.com/de/de/ocs/wohngebaeude/compress-5800i-aw-19312694-p/): Herstellerpositionierung besonders für Neubau, Heizung/Warmwasser, R290, schalloptimierter Aufbau, Innen-/Außeneinheiten und HomeCom Easy mit passender Ausstattung.
- [Herstellerübersicht](https://www.bosch-homecomfort.com/de/de/ocs/wohngebaeude/luft-wasser-waermepumpen-854511-c/): bestätigt die Baureihenpositionierung und gemeinsame Außengeräte.
- [Aktuelles Produktdatenblatt AW 10 OR-T, Artikel 8738213467](https://b5-web-product-data-service.azurewebsites.net/pdf/de-DE/8738213467.pdf), Dokument 6721873439, Stand 2026/02: Beide Produktseiten verlinken beim initial ausgewählten Außengerät dasselbe Datenblatt. Es beschreibt eine konkrete Variante, kein universelles Komplettsystem.

Dokumentierte Unklarheiten: Die 6800i-Seite bezeichnet im Werbetext einen SCOP „bei A7/W35“; die Datenansicht nennt saisonale Werte für mittleres Klima. Die 5800i-Seite nennt im Werbetext bis 4,6, in der initialen Datenauswahl 4,77 bei 35 °C. Ohne Variantenabgleich lässt sich dies nicht als direkter Widerspruch oder allgemeiner Reihenwert auflösen. Werbung zum Nachtmodus bezieht sich auf ein anderes Modell/Betriebsszenario als das AW-10-Datenblatt. Die Datentabelle enthält außerdem 0 dB(A) für geräuscharmen Betrieb; daraus folgt kein geräuschfreier Betrieb. Deshalb keine kW-, SCOP-, dB- oder Temperaturwerte im neuen statischen Content; nichts zwischen Varianten vermischt oder stillschweigend bereinigt.

## Systemintegration

[Bosch Energiemanager](https://www.bosch-homecomfort.com/de/de/wohngebaeude/wissen/heizungssteuerung/der-energiemanager/), geprüft 29.09.2026: dokumentierte kompatible Wärmepumpe, unterstützte Komponenten beziehungsweise Messkonzept sowie erforderliche Netzwerk-/Softwarevoraussetzungen. Die Herstellerquelle belegt keine pauschale vollständige Bosch-Steuerung über mySigen.

HomeCom Easy bleibt Bosch-Gerätebedienung; Bosch Energiemanager bleibt eine separate Energiemanagement-Funktion; mySigen bleibt Sigenergy-Systemdarstellung/-steuerung im freigegebenen Umfang. Keine konkrete Bosch-/Sigenergy-Schnittstellenkombination zugesichert. SG-Ready wird nicht als stufenlose Leistungsregelung oder beliebige Hersteller-API dargestellt. Winterlücke und fehlende saisonale Speicherwirkung werden ausdrücklich erklärt.

## Tatsächlich gerenderte CTA-Matrix

| Ort                                   | Beschriftung                   | Ziel                                             |
| ------------------------------------- | ------------------------------ | ------------------------------------------------ |
| Hero primär                           | Projekt konfigurieren          | `/konfigurator/waermepumpe`                      |
| Hero sekundär                         | Wärmepumpen-Beratung anfragen  | `CONTACT_FORM_HREF` = `/kontakt#kontaktformular` |
| Nach beiden Produktporträts           | Passende Wärmepumpe besprechen | `CONTACT_FORM_HREF`                              |
| PV-Fachtext, zurückhaltender Textlink | Photovoltaik entdecken         | `/photovoltaik`                                  |
| übrigens primär, heller Button        | Energieprojekt konfigurieren   | `/konfigurator`                                  |
| übrigens sekundär, Outline            | Zu den Stromspeichern          | `/stromspeicher`                                 |
| Rechner                               | Wärmepumpen-Rechner öffnen     | `/rechner/waermepumpe-kosten`                    |
| Umsetzung                             | Wärmepumpenprojekt besprechen  | `CONTACT_FORM_HREF`                              |
| finalCta                              | Wärmepumpenprojekt besprechen  | `CONTACT_FORM_HREF`                              |
| Je Produkt                            | Produktinformationen bei Bosch | jeweilige offizielle Produktseite                |

Keine Query-Parameter, Vorauswahlen oder Konfiguratoränderungen. Der vorhandene Singular-Rechnerpfad entspricht der expliziten Vorgabe und bestehenden Route.

## FAQ-Prüfung

Die vorhandenen Daten wurden read-only aus dem lokalen Emulator `127.0.0.1:8080`, Projekt `demo-energie-kraft-next`, geladen. 40 veröffentlichte Wärmepumpen-FAQ-Einträge (Kategorie/Platzierung) geprüft. Keine überholte Aussage, Energie-Kraft verkaufe oder installiere keine Wärmepumpen. Keine entsprechende Korrekturdatei nötig. Laufzeitquelle bleibt Firestore, `faqRouteKey="waermepumpen"`; keine statischen FAQs ergänzt und keine Daten verändert. Nachweis: `artifacts/sprint10-waermepumpen-qa/faq-review.json`. Produktions-FAQ wurden ausdrücklich nicht gelesen; ihr aktueller Inhalt ist nicht durch die lokale Prüfung bestätigt. Die Prüfung gilt dem angeforderten Leistungswiderspruch, nicht einer Neubewertung sämtlicher bestehender FAQ-Fachangaben.

## Verifikation

`npm run check:all`: erfolgreich, Exit 0. ESLint, `next typegen && tsc --noEmit`, 70 Unit-Testdateien / 502 Tests, Functions-Lint/-Build, lokale Firestore-/Storage-Rules (30 Tests), Next.js-Produktionsbuild erfolgreich. Neue Wärmepumpen-Render-Tests prüfen SEO, Anker/Reihenfolge, zwei Modelle und vorhandene Bilder, exakten Hinweis/CTAs, tatsächliche Hero-CTAs, Montagekooperation, Firmenhistorie, Funktionsabgrenzung, ein Signet und unveränderten Redirect. Keine Tests gelöscht oder abgeschwächt.

Der erste Sandbox-Lauf wurde beim Vitest-Start durch `spawn EPERM` blockiert; der vollständige erneute Lauf mit freigegebener Ausführung außerhalb der Sandbox war erfolgreich. Keine konkurrierenden Next-Prozesse während Typegen/Build. Browserprüfung erst danach über `next start` mit lokalen importierten Emulator-Daten, ohne Emulator-Export oder Formulareingaben. Das Rules-Testprotokoll enthält harmlose lokale Connection-reset-/VSCode-Hinweise; die Tests und die Kette enden erfolgreich. Vollständiges Log: `artifacts/sprint10-waermepumpen-qa/check-all.log`.

Die vollständige `check:all`-Kette wurde nach der im Browser gefundenen mobilen Umbruchkorrektur erneut erfolgreich abgeschlossen (Exit 0, weiterhin 502 Unit- und 30 Rules-Tests). ESLint für das abschließende Browser-QA-Script ebenfalls erfolgreich. `git diff --check` erfolgreich; nur die vorhandenen Git-Hinweise zur LF/CRLF-Konvertierung, keine Whitespace-Fehler.

### Browser und Redirects – finaler Build

Lokales Headless Chrome über CDP, Viewportbreiten **1920, 1440, 1280, 1024, 390 und 375 px**, jeweils 1000 px hoch. Alle sechs geprüft: lesbarer Hero mit beiden korrekten Links, ein Signet, zwei vollständig geladene Produktbilder, mobile Bild-vor-Text-Reihenfolge, vollständige Beschriftungen, beide Hinweisbuttons mit mindestens 44 px Höhe, Rechnerlink und sechs aktuelle Firestore-FAQs. Kein horizontaler Dokumentüberlauf, auch in der gemessenen Animationsphase. Keine Browser-JavaScript-Exceptions und keine fehlgeschlagenen lokalen HTTP-Ressourcen. Der lange Begriff „Wärmepumpenlösungen“ erhielt lokal an der neuen Produktüberschrift automatische Silbentrennung und einen sicheren Umbruch; keine globale Typografie geändert.

Die Produktüberschrift hat zusätzlich eine eigene minimale Schriftgröße von 1,625 rem statt 2 rem, damit der lange Begriff bei 375/390 px vollständig lesbar bleibt. Die Größen an den geprüften Desktopbreiten bleiben unverändert. Nach dieser abschließenden Typografieanpassung wurde die komplette `check:all`-Kette erneut erfolgreich abgeschlossen (Exit 0); die beiden betroffenen mobilen Browserprüfungen und drei mobilen Screenshots wurden wiederholt und bestanden. Der finale Browserbericht enthält weiterhin alle sechs geprüften Breiten und die unveränderten Interaktions-/Regressionsnachweise.

Gemessene kumulierte Layoutverschiebung (CLS) im lokalen Prüflauf: 1920 px ≈ 0,0051; alle übrigen Breiten 0. Diese Messung ist ein lokaler Browsernachweis, keine Feldmessung oder allgemeine Performancegarantie.

Tastatur: Tab vom primären Hero-Link zum Beratungslink, sichtbarer Fokus mit Outline; FAQ per Enter geöffnet. Reduced Motion: Media Query aktiv, Signet-Animation 0 s; ohne Reduced Motion weiterhin exakt 0,92 s. Die beiden Hinweislinks wurden tatsächlich im Browser aktiviert und erreichten `/konfigurator` beziehungsweise `/stromspeicher`. Keine Anfragen abgesendet.

Regression nach der ausschließlich routenspezifischen Änderung in der gemeinsamen Visual-Tabelle: `/`, `/photovoltaik`, `/stromspeicher`, `/klimaanlagen`, `/wallbox`, `/energieloesungen/gewerbespeicher` jeweils geladen, Inhalte und Bilder betrachtet, je ein H1, kein Dokumentüberlauf oder sichtbarer Bildfehler. Verdeckte Lazy-Loading-Bilder außerhalb der horizontalen Carousel-Fläche werden nicht als Bildfehler gezählt. Keine Vergleichsseite geändert. Dies war eine gezielte Regression, kein vollständiger Cross-Browser-/E2E-Test.

Redirect-Nachweis auf dem finalen lokalen Build:

| Eingabe                                 | Statusfolge                             | Finales Ziel    |
| --------------------------------------- | --------------------------------------- | --------------- |
| `/energieloesungen/waermepumpe-mit-pv`  | 308 → 200                               | `/waermepumpen` |
| `/energieloesungen/waermepumpe-mit-pv/` | 308 zur Variante ohne Slash → 308 → 200 | `/waermepumpen` |

Keine Redirect-/Slash-Konfiguration geändert. Maschinenlesbarer Nachweis einschließlich Viewports, Klickzielen, Tastatur, Reduced Motion, CLS, Ressourcen und Regression: `artifacts/sprint10-waermepumpen-qa/browser-results.json` (`passed: true`, QA-Prozess Exit 0).

### Screenshots

Alle Dateien unter `artifacts/sprint10-waermepumpen-qa/`, nicht gestagt:

- `01-waermepumpen-full-1440.png`
- `02-waermepumpen-hero-signet-1440.png`
- `03-waermepumpen-bosch-products-1440.png`
- `04-waermepumpen-compress-6800i-1440.png`
- `05-waermepumpen-compress-5800i-1440.png`
- `06-waermepumpen-uebrigens-system-1440.png`
- `07-waermepumpen-energiemanagement-1440.png`
- `08-waermepumpen-mobile-390-full.png`
- `09-waermepumpen-products-mobile-390.png`
- `10-waermepumpen-uebrigens-mobile-390.png`

### Geänderte und neue Dateien / Git

Geändert:

- `src/content/pages/waermepumpen.ts`: zentrale finale Texte, zwei Produktporträts, Hinweis, finalCta und Abschnittsreihenfolge.
- `src/app/(site)/waermepumpen/page.tsx`: zwei Section-Overrides, weiterhin `PublicContentPage` und ein Brand-Signet.
- `src/app/(site)/_components/public-content-page.tsx`: ausschließlich die Wärmepumpen-Hero-Bildzuordnung.

Neu / untracked, separat von `git diff --stat`:

- `src/app/(site)/waermepumpen/waermepumpen-sections.tsx`
- `tests/unit/waermepumpen-page-content.test.ts`
- `docs/sprint10-waermepumpen-validation.md`
- `docs/sprint10-waermepumpen-assets.md`
- vier neue WebPs unter `public/images/heat-pump/products/`
- Screenshots, Prüfprotokolle, Inventur und lokale QA-Scripts unter `artifacts/sprint10-waermepumpen-qa/`

`git diff --stat`: drei getrackte Dateien, 168 Einfügungen / 54 Löschungen. Die neuen Dateien sind darin nicht enthalten. Bereits vorhandene untracked Homepage-/PV-/Speicher-/Gewerbespeicher-/Signet-QA-Ordner bleiben unverändert. Nichts gestagt; `.source-assets/bosch/` weiterhin lokal ausgeschlossen und unverändert.

## Offene Freigaben

Die Nutzungsfreigabe der gelieferten Bosch-Anwendungsszene und der beiden offiziellen heruntergeladenen Produktdarstellungen ist vor einer öffentlichen Veröffentlichung zu klären. Im Paket liegt keine Lizenz-/Credit-Datei. Siehe [Asset-Dokumentation](./sprint10-waermepumpen-assets.md). Keine erfundene Lizenz. Keine offenen Modellzuordnungen bei den tatsächlich eingebundenen Assets; weitere ungeklärte Quelldateien bleiben ungenutzt.
