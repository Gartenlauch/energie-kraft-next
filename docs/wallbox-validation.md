# Wallbox: Premium-Produktdarstellung und Abnahme

Stand: 28.09.2026. Folgeauftrag auf dem bestehenden uncommitteten Wallbox-Arbeitsstand. Kein Reset, Commit, Push oder Deployment.

## Änderungen dieses Folgeauftrags

- `src/app/(site)/wallbox/_components/wallbox-product-showcase.tsx`: vier große Editorial-Splits statt getrennter Text-/Listenhälften. Desktop im Wechsel Bild links/rechts, Mobil immer Bild vor Inhalt. Reservierte 4:3-Bildflächen mit vollständigen, unverzerrten Motiven; ruhiger Wechsel zwischen Weiß und hellem CI-Blau. Kompakteres Intro mit Produktankern, klare Benefits und dezente Informationsflächen. ABL eM4 bleibt im separaten Gewerbeabschnitt. Dort wurde ausschließlich horizontaler Animationsüberlauf mit `overflow-x-clip` begrenzt: Die bestehende Einblendung um 56 px konnte bei 16 px Mobilrand vorübergehend 40 px Überbreite erzeugen.
- `src/content/wallbox-products.ts`: beide offiziellen Bilder ergänzt, Bilder nun für alle Hauptprodukte verpflichtend. Kürzere Benefits, erklärende Details und neue Positionierungszeilen; technische Bedingungen und SEO-Begriffe bleiben sichtbar.
- `src/content/pages/wallbox.ts`: nur Produktintro verdichtet und Eyebrow aktualisiert. Untere Abschnitte, Metadata, CTA-Ziele und FAQ-Anbindung unverändert.
- `docs/wallbox-product-assets.md`: Freigabe bestätigt, vollständige Bildherkunft, Abmessungen und Dateigrößen dokumentiert.
- `docs/wallbox-validation.md`: dieser aktualisierte Bericht.

Neu: `public/images/wallbox/products/alfen-eve-single-plus-de.webp` (1200 × 758 px, 55.594 Bytes) und `sigen-ev-dc.webp` (1200 × 600 px, 98.212 Bytes). Beide aus den ausdrücklich vorgegebenen offiziellen Quellen; Nutzung für Energie-Kraft vom Auftraggeber freigegeben. Kein Upscaling, keine Retusche, kein Beschnitt. Die Sigenergy-Quelldatei enthält einen vollständig deckenden Alphakanal; es ging keine Transparenz verloren. Alle Quellen: [Asset-Dokumentation](./wallbox-product-assets.md).

## SEO- und Funktionsschutz

Erhalten: Wallbox kaufen, sonnen Wallbox, sonnenHome Charger 2, sonnen Charger 2, Alfen Eve Single Plus DE, Sigenergy Sigen EV DC, Fronius Wattpilot Home 22 J, ABL Pulsar, 11/22 kW, PV-Überschussladen, Phasenumschaltung, Lastmanagement, Eichrechtskonformität und bidirektionales Laden einschließlich V2H/V2G.

Der Charger 2 bleibt ausdrücklich eingestellt. Die sonnen-App-Ankündigung für Oktober 2026 und die V2X-Kompatibilitätsbedingungen bleiben erhalten. Lange Benefit-Sätze wurden in kürzere Listenpunkte und erklärende Absätze aufgeteilt, nicht fachlich gestrichen. Keine erfundenen Preise, Offer-Daten oder Referenzprojekte.

Die bereits vorhandene FAQ-Importdatei bleibt unverändert; Firestore bleibt Laufzeitquelle. Die bereits angepassten `page.tsx` und `public-content-page.tsx` wurden in diesem Folgeauftrag nicht erneut verändert.

## Prüfungen

- `npm run check:all`: **Exit 0** nach der finalen Overflow-Korrektur. ESLint, TypeScript, 474 Unit-Tests in 63 Dateien, Functions-Lint/-Build, 30 Emulator-Regeltests und optimierter Next.js-Build erfolgreich. Der erste Sandbox-Lauf wurde durch `spawn EPERM` blockiert; die vollständige Prüfung lief anschließend mit freigegebenem Prozesszugriff.
- Headless Chrome gegen den Produktionsbuild bei **1440, 1920, 375 und 390 px** (jeweils 900 px Viewporthöhe): kein horizontaler Überlauf; Bildpositionen auf Desktop abwechselnd, auf Mobil immer Bild vor Überschrift. Visuelle Sichtprüfung ausgewählter Produkt- und Übergangsscreenshots auf Desktop und Mobil.
- Alle fünf Produktbilder und die übrigen Inhaltsbilder geladen. Lokale Next-Image-URLs, keine Frontend-Hotlinks oder defekten Produktassets. Intrinsische Abmessungen und reservierte Bildflächen; `object-contain` verhindert Verzerrung und zusätzliche Ausschnitte.
- Layout-Shift-Summe **0 in allen vier lokalen Testläufen**, diesmal mit normaler Bewegungseinstellung. Keine allgemeine Core-Web-Vitals-Garantie. Der mobile Animationsüberlauf wurde separat reproduziert und seine Korrektur nachgewiesen (415 → 375 px bei erzwungenem Pending-Zustand).
- Eine H1, unverändertes Canonical `/wallbox`, parsebares WebPage-/Breadcrumb-/Service-/FAQ-JSON-LD. Sechs FAQ aus dem lokalen Demo-Emulator angezeigt; Aufklappen erfolgreich. Keine statischen Laufzeit-FAQ hinzugefügt.
- Kontakt-, Rechner- und Konfigurator-Links im DOM geprüft; Zielrouten jeweils HTTP 200. Vorhandene Unit-Tests für Rechner und Konfigurator grün. Kein vollständiger Formularversand und keine echten E-Mails.
- Legacy-URL `/energieloesungen/wallbox-kaufen` weiterhin **308** nach `/wallbox`.
- `git diff --check`: erfolgreich.

## Screenshots und Messwerte

Unter `artifacts/wallbox-qa/`:

- [Gesamte Seite, 1440 px](../artifacts/wallbox-qa/wallbox-full-1440.png)
- [Gesamte Seite, 1920 px](../artifacts/wallbox-qa/wallbox-full-1920.png)
- [Produktintro + Alfen](../artifacts/wallbox-qa/intro-alfen-1440.png)
- [Sigenergy + Fronius](../artifacts/wallbox-qa/sigenergy-fronius-1440.png)
- [ABL + Übergang zum PV-Überschussladen](../artifacts/wallbox-qa/abl-pv-1440.png)
- [Mobile Produktdarstellung, 375 px](../artifacts/wallbox-qa/mobile-products-375.png)
- [Mobile Produktdarstellung, 390 px](../artifacts/wallbox-qa/mobile-products-390.png)
- [Messwerte aller vier Viewports](../artifacts/wallbox-qa/results.json)

Zusätzlich liegen vollständige mobile Seitenaufnahmen sowie Detailansichten der einzelnen Produktbereiche vor. Die FAQ-Prüfung nutzte ausschließlich neun öffentliche Einträge aus dem vorhandenen Importvorschlag in einem temporären lokalen Emulator. Keine Produktionsdaten oder dauerhaften lokalen Datenbestände geändert.

## Bildmotiv und verbleibende Redaktion

Keine offenen Bildrechte. Das vom Auftraggeber vorgegebene Sigenergy-Asset zeigt eine breite Anwendungsszene mit SigenStor und Fahrzeug, keinen freigestellten DC-Modulrender. Es wird vollständig gezeigt; das Modul selbst lässt sich innerhalb dieses Motivs ohne Beschnitt nicht bildfüllend darstellen. Der Alfen-Render ist bereits im Herstelleroriginal eine Nahaufnahme; es wurde kein zusätzlicher Ausschnitt vorgenommen.

Der bestehende [FAQ-Importvorschlag](./wallbox-faq-import.md) muss weiterhin mit einem aktuellen Admin-Export abgeglichen und über die bestehende Oberfläche importiert werden. Keine Produktionsdaten verändert.
