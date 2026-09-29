# Sprint 10 – Photovoltaik: Validierung

Stand: 29.09.2026. Ausgangsbasis: keine vorhandenen Änderungen an getrackten Dateien (`git diff --stat` leer). Bereits bestehende untracked QA-Ordner wurden unverändert erhalten. Kein Commit, Push, Deployment, Production-Write oder Versand.

## Umsetzung und Scope

Die vorhandene Kette `PhotovoltaikPage → PublicContentPage → photovoltaikContent → EditorialFeatureSection` bleibt erhalten. Bestehendes Hero, responsive Hero-Dateien, Rechner und Formeln, FAQ-Laufzeitquelle, Signet und Abschluss-CTA bleiben bestehen. Änderungen an Homepage, Gewerbe-PV-Content, Wallbox-Content, Navigation, Partner-Carousel, 2000-ms-Autoplay und Signet-Animation waren nicht erforderlich.

Freigegebene Texte wurden übernommen: regionale Positionierung aus Ainring bei Freilassing für Berchtesgadener Land, Landkreis Traunstein und angrenzende Region, über 20 Jahre, PV und Speicher als Kern, Planung und Montage aus einer Hand. Keine bayernweite Privatkundenbetreuung, österreichische oder deutschlandweite Betreuung abgeleitet.

Bestehende Themen: Komplettlösung, Eigenverbrauch, zwei Rechner, Komponenten, Monitoring, regionale Referenzen, Planung und Montage. Ergänzt: Montagesystem/Schneefang, Investition/Finanzierung/Fördermöglichkeiten und dezenter Verweis auf ergänzenden Strombezug. Bestehende Erklärtexte zu den Rechnerlinks erhalten. Kein optionaler B2B-Link nötig; keine zusätzliche Gewerbe-Section.

Keine inhaltliche Abweichung von den verbindlichen Texten. Der freigegebene dezente Satz zum verbleibenden Strombezug ist als dritter Absatz im Finanzierungskapitel umgesetzt. Kein ungeprüftes Förder-, Steuer-, Tarif-, Gratisstrom-, Autarkie-, Notstrom-, Kompatibilitäts-, SLA- oder Lastklassenversprechen. Keine alten Produktmodelle aus dem Wechselrichterbild übernommen.

Die Live-WordPress-Hauptseite konnte ergänzend nicht gelesen werden: Webabruf liefert **HTTP 403 Forbidden**. Keine Sperre umgangen und keine vollständige Live-Contentprüfung behauptet.

## Reihenfolge und Präsentation

| Anker                         | Präsentation                                                  | Fläche                         |
| ----------------------------- | ------------------------------------------------------------- | ------------------------------ |
| `pv-komplettloesung`          | Editorial mit abgestimmten Planungspunkten                    | Soft                           |
| `eigenverbrauch`              | Sigenergy-Bild links, Text rechts                             | Weiß                           |
| `pv-rechner`                  | Kompakter Editorial-Bereich mit zwei bestehenden Rechnerlinks | Blau                           |
| `komponenten`                 | Editorial mit Komponentenliste                                | Weiß                           |
| `montagesysteme`              | Text links, vollständige technische Darstellung rechts        | Soft / ruhige weiße Bildfläche |
| `monitoring`                  | Editorial mit Service-Link                                    | Weiß                           |
| `finanzierung-und-foerderung` | Editorial mit Finanzierung und Stromtarifen                   | Soft                           |
| `regionale-referenzen`        | Regionales PV-Motiv links, Referenzlinks rechts               | Blau                           |
| `planung-und-montage`         | Abschließendes Statement mit Kontakt-CTA                      | Weiß                           |

Danach bestehende FAQ-Ausgabe und genau ein bestehender Beratungs-Abschluss. Alle sieben bisherigen Anker bleiben erhalten.

## Metadaten und tatsächliche CTAs

- Title: **Photovoltaik kaufen: Planung & Montage | Energie-Kraft Süd**
- Description: **Photovoltaik kaufen in Bayern: PV-Anlagen mit Speicher, Beratung, Planung und Montage aus einer Hand. Energie-Kraft Süd aus Ainring.**
- H1: **Photovoltaik kaufen und eigenen Solarstrom erzeugen**
- Canonical: `/photovoltaik` bzw. `https://www.energie-kraft.de/photovoltaik`.
- Hero: **Projekt konfigurieren → `/konfigurator/photovoltaik`**; **PV-Beratung anfragen → `CONTACT_FORM_HREF` = `/kontakt#kontaktformular`**. Vorhandene Wrapperlogik, zwei Buttons.
- Speicher → `/stromspeicher`; Rechner → `/rechner/photovoltaik-kosten` und `/rechner/photovoltaik`.
- Monitoring → `/service-und-wartung`; Finanzierung → `/service-und-wartung/finanzierung-und-foerderung`; Stromtarife → `/energieloesungen/stromtarife-pv`.
- Referenzen → `/referenzen`, `/referenzen/ainring`; Ainring-Gruppe und tatsächliche Projekte im zentralen Datenmodell geprüft. Keine erfundenen Ortsrouten.
- Planung und Abschluss → `CONTACT_FORM_HREF`.

## Gemeinsame Komponenten und Daten

`ContentSection.presentation` ermöglicht optionale explizite Fläche/Layout; der Wrapper erhält für alle bisherigen Seiten die indexbasierten Defaults. Nur PV aktiviert die neuen Vorgaben. Die PV-Bildzuordnung verwendet eigene Sigenergy-Varianten, eine vollständige SIKO-Darstellung und Ainring. `EditorialFeatureSection` besitzt eine optionale technische Bilddarstellung und Caption. Neue CSS-Regeln greifen ausschließlich über `.editorial-section--technical`; die bestehenden Cover-Layouts bleiben unverändert. Die allgemeine `ArtDirectedImage`-Komponente wurde nicht geändert.

FAQ bleibt `faqRouteKey="photovoltaik"` mit dem existierenden Firestore-Repository und authentifiziertem Admin-Import. Keine Seeds oder Imports durchgeführt. Indexierungsschutz, robots, Sitemap und strukturierte Daten bleiben unverändert. Historische Pfade werden nicht als neue Seiten oder Sitemap-Routen angelegt.

## Geänderte und neue Dateien

Geändert: `src/content/pages/photovoltaik.ts`, `src/app/(site)/_components/public-content-page.tsx`, `src/components/marketing/marketing-sections.tsx`, `src/types/content.ts`, `src/app/globals.css`, `next.config.ts`.

Neu: `public/images/photovoltaic/siko-montagesystem-schneefang.webp`, `public/images/photovoltaic/ainring-pv-region.webp`, `tests/unit/photovoltaik-page-content.test.ts`, `scripts/sprint10-photovoltaik-browser.mjs`, diese Validierungsdoku und `docs/sprint10-photovoltaik-assets.md`. QA-Dateien unter `artifacts/sprint10-photovoltaik-qa/` separat, ohne automatische Git-Staging-Aktion.

## HTTP-Nachweis: lokale Produktionsausgabe

Gegen `http://localhost:3020` mit `next start`, nach erfolgreichem Produktionsbuild, geprüft. Vorhandene Demo-Emulator-Daten wurden ohne Seeds oder Re-Import neuer FAQ-Texte geladen; keine Exporte oder Produktionsänderungen.

| Quelle ohne Slash                         | Finale Route                                       | Statusfolge ohne Slash | Statusfolge mit Slash | Finale Antwort                 |
| ----------------------------------------- | -------------------------------------------------- | ---------------------- | --------------------- | ------------------------------ |
| `/energieloesungen/photovoltaik-kaufen`   | `/photovoltaik`                                    | 308 → 200              | 308 → 308 → 200       | 200, passender Inhalt, noindex |
| `/photovoltaik/strom-speichern`           | `/stromspeicher`                                   | 308 → 200              | 308 → 308 → 200       | 200, passender Inhalt, noindex |
| `/photovoltaik/foerderungen`              | `/service-und-wartung/finanzierung-und-foerderung` | 308 → 200              | 308 → 308 → 200       | 200, passender Inhalt, noindex |
| `/photovoltaik/preistabelle-photovoltaik` | `/rechner/photovoltaik-kosten`                     | 308 → 200              | 308 → 308 → 200       | 200, passender Inhalt, noindex |
| `/photovoltaik/service-und-reparatur`     | `/service-und-wartung`                             | 308 → 200              | 308 → 308 → 200       | 200, passender Inhalt, noindex |
| `/photovoltaik/strom-produzieren`         | `/photovoltaik`                                    | 308 → 200              | 308 → 308 → 200       | 200, passender Inhalt, noindex |
| `/photovoltaik/strom-tanken`              | `/wallbox`                                         | 308 → 200              | 308 → 308 → 200       | 200, passender Inhalt, noindex |

Alle sieben Quellen jeweils mit/ohne Slash und mit/ohne `?utm_source=sprint10-qa`: **28 erfolgreiche echte HTTP-Ketten**. Bei Slash-Quellen lautet der erste `Location`-Header die jeweilige Quelle ohne Slash; der zweite führt zur finalen Zielroute. Ohne Slash führt der erste `Location` direkt zur Zielroute. Der Testparameter bleibt in sämtlichen Zwischen- und Finalzielen erhalten. Die Slash-Varianten sind ausdrücklich keine Ein-Hop-Redirects.

Vollständige URLs, einzelne Statuscodes, exakte `Location`- und `X-Robots-Tag`-Header pro Hop sind in [results.json](../artifacts/sprint10-photovoltaik-qa/results.json) gespeichert. Alle Ziele liefern HTTP 200; der vorhandene globale Indexierungsschutz bleibt erhalten. Keine Catch-all-Regel, keine historischen Quellen in der Sitemap, keine WordPress-Redirectänderung.

## Tatsächlich ausgeführte Prüfungen

- **`npm run check:all`: vollständig erfolgreich (Exit 0)**. ESLint, `next typegen` + TypeScript, 66 Unit-Test-Dateien mit **488 bestandenen Tests**, Functions-Lint/-Build, Firestore-/Storage-Emulator-Regeltests und Next-Produktionsbuild. Vorherige Versuche fanden Übertragungs-/Testskriptprobleme; diese wurden korrigiert. Ein Sandbox-`spawn EPERM` wurde durch die zugelassene lokale Ausführung behoben, ohne Checks zu deaktivieren.
- Neuer Render-/Content-Test: Metadaten, H1, Region/Erfahrung, neun Anker, tatsächliche zwei Hero-Links, beide Rechner, gemeinsamer Kontaktlink, ein dekoratives Signet, Sigenergy, byteidentisches SIKO-Asset, unveränderte Speicher-Hero-Zuordnung und sieben exakte permanente Redirects.
- Separater finaler ESLint-Lauf für das Browser-QA-Skript erfolgreich. Dessen Bild-Warten ist begrenzt; offscreen Lazy-Bilder einer Galerie werden nicht als defekte Bilder fehlinterpretiert. Vor Aufnahmen werden vorhandene Reveal-Bereiche durch natürliche Scroll-Interaktion eingeblendet.
- **`git diff --check`: erfolgreich (Exit 0)**. Keine Whitespace-Fehler.
- Browser: lokaler Produktionsserver, eigenes Headless Chrome via CDP, normaler Zoom bei **1920, 1440, 1280, 1024, 390, 375 px**. Hero/H1, zwei bedienbare Hero-CTAs (52 px), ein Signet mit 920-ms-Animation ohne Textkollision, tatsächliche responsive Bildquellen, vollständiges/unverzerrtes SIKO-Motiv, keine defekten PV-Bilder, kein horizontaler Overflow auch während der Reveal-Durchläufe. Sechs vorhandene PV-FAQ-Einträge; Öffnen per Enter geprüft. Konfigurator- und Kontakt-CTA bei Desktop/Mobile tatsächlich geöffnet, ohne Formularabsendung.
- Reduced Motion: Signet `animation-name: none`, kein verbliebener pending Reveal-Inhalt.
- Regression: **`/`, `/stromspeicher`, `/wallbox`, `/waermepumpen`, `/klimaanlagen`, `/energieloesungen/photovoltaik-fuer-unternehmen`**, jeweils bei 1440 und 390 px. H1, genau ein Signet, kein Overflow, keine kaputten geladenen Bilder, keine versehentlich aktivierte technische Bilddarstellung. Speicher-Hero weiterhin `residential-storage-hero-desktop/mobile.webp`. Bestehende Homepage-/Gewerbe-/Wallbox-Tests bestanden; Carousel-/Signet-Code wurde nicht verändert.
- Beide PV-Rechner geöffnet, numerische Eingabe geändert und Ergebnisberechnung über den vorhandenen Berechnen-Button ausgeführt. Rechnerlogik unverändert. Keine echten Anfragen oder E-Mails versendet.
- Keine JavaScript-Ausnahmen und keine lokalen HTTP-Fehler im abschließenden Browserlauf.
- Keine quantitative CLS-, Performance- oder Lighthouse-Messung vorgenommen; kein „CLS 0“ behauptet. Kein separater Cross-Browser-Audit oder Live-WordPress-Volltest.

Reproduktion: Nach lokalem `npm run check:all` vorhandene Demo-Emulatoren mit `npx firebase emulators:start --project demo-energie-kraft-next --only auth,firestore,storage --import=.emulator-data` und `npm run start -- --port 3020` starten; dann `node scripts/sprint10-photovoltaik-browser.mjs`. Ausschließlich Screenshot-Nachaufnahmen: `node scripts/sprint10-photovoltaik-browser.mjs --screenshots-only`, ohne den kompletten Ergebnisbericht zu überschreiben. Keine konkurrierenden Next-Dev-/Typegen-/Build-Prozesse.

## Screenshots und visuelle Prüfung

Alle Aufnahmen unter `artifacts/sprint10-photovoltaik-qa/`. Die normale Prüfung bleibt bei Browserzoom 100 %. Die zusätzliche Übersicht wird bei identischer CSS-Viewport-Geometrie mit reduzierter Rasterauflösung (Device Scale Factor 0,25) aufgenommen; keine daraus abgeleiteten Lesbarkeits- oder Performancebehauptungen.

- [01-photovoltaik-full-1440.png](../artifacts/sprint10-photovoltaik-qa/01-photovoltaik-full-1440.png)
- [02-photovoltaik-hero-signet-1440.png](../artifacts/sprint10-photovoltaik-qa/02-photovoltaik-hero-signet-1440.png)
- [03-photovoltaik-sigenergy-1440.png](../artifacts/sprint10-photovoltaik-qa/03-photovoltaik-sigenergy-1440.png)
- [04-photovoltaik-siko-schneefang-1440.png](../artifacts/sprint10-photovoltaik-qa/04-photovoltaik-siko-schneefang-1440.png)
- [05-photovoltaik-monitoring-region-1440.png](../artifacts/sprint10-photovoltaik-qa/05-photovoltaik-monitoring-region-1440.png)
- [06-photovoltaik-mobile-390-full.png](../artifacts/sprint10-photovoltaik-qa/06-photovoltaik-mobile-390-full.png)
- [07-photovoltaik-siko-schneefang-mobile-390.png](../artifacts/sprint10-photovoltaik-qa/07-photovoltaik-siko-schneefang-mobile-390.png)
- [08-photovoltaik-overview-reduced-zoom.png](../artifacts/sprint10-photovoltaik-qa/08-photovoltaik-overview-reduced-zoom.png)
- [09-photovoltaik-region-1440.png](../artifacts/sprint10-photovoltaik-qa/09-photovoltaik-region-1440.png)
- [10-photovoltaik-sigenergy-mobile-390.png](../artifacts/sprint10-photovoltaik-qa/10-photovoltaik-sigenergy-mobile-390.png)

Die Desktop- und Mobile-Details von SIKO und Sigenergy sowie die Seitenrhythmus-Übersicht wurden visuell geprüft. Schneefangrohre und Montageelemente bleiben vollständig sichtbar; die mobile SIKO-Darstellung behält das Querformat und enthält keine generierten oder retuschierten Teile. Sigenergy-Gerät und Logo bleiben klar sichtbar. Details zu Originalen, tatsächlichem Format, Bytes und Abmessungen: [Asset-Inventur](sprint10-photovoltaik-assets.md).

## Verbleibende Punkte und Git

Kein funktionaler Blocker. Die Live-WordPress-Seite bleibt aufgrund von HTTP 403 ungeprüft. Hersteller-/Modell- oder Normdetails wurden nicht unabhängig bestätigt und deshalb nicht ergänzt. Die SIKO-/Schneefang-Zuordnung ist die explizite Auftraggeberangabe.

Optionale redaktionelle FAQ-Vorschläge für eine gesonderte Admin-Prüfung: Dach-Eignung, Speichergröße, verfügbarer Monitoring-/Serviceumfang und objektspezifische Schneefangplanung. Keine globale FAQ-Änderung, automatische Veröffentlichung oder Produktionseinspielung in diesem Paket. Die bestehende gemeinsame Gewerbe-PV-FAQ-Anbindung bleibt bestehen.

Abschließender `git diff --stat`: sechs getrackte Dateien, 216 hinzugefügte und 50 entfernte Zeilen. Neue Dateien erscheinen dort nicht: zwei finale WebP-Dateien, zwei Dokumente, ein Test, ein Browser-QA-Skript und der neue QA-Ordner. Vorhandene untracked Ordner `homepage-sprint10-full-polish`, `homepage-sprint10-micro-polish`, `homepage-sprint10-qa`, `homepage-sprint10-visual-polish`, `sprint10-business-pv-qa` und `sprint10-signet-partner-qa` bleiben erhalten. Keine Datei gestagt; kein Commit, Push oder Deployment.
