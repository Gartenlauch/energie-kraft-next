# Homepage – vollständiger Visual-Polish, erster Pass

Baseline: `76e3556`, zugleich Stand von `backup/homepage-before-full-polish`. Der Arbeitsbaum enthielt vor Beginn ausschließlich die untracked QA-Ordner der vorigen Aufträge. Kein Wechsel des Branches, Reset, Restore oder Commit.

Vor der Umsetzung wurde die vollständige Homepage bei 1920, 1440, 1280, 1024, 390 und 375 px sowie mit einer 50-%-äquivalenten Gesamtansicht geprüft. Vorher-Aufnahmen und Geometriemessungen: `artifacts/homepage-sprint10-full-polish/before/`.

## Analyse und Entscheidungen

| Bereich / Übergang | Baseline-Befund | Änderung und Zweck |
| --- | --- | --- |
| Hero → BrandIntro → Unternehmensintro | Hero und Signet bilden bereits einen zusammenhängenden Einstieg; Intro und Vertrauenselemente haben größere Außen-/Zwischenabstände. | Hero und Signet unverändert. Kontrolliert weniger Intro-Padding und Highlight-Abstand; der Inhalt folgt früher auf das Signet. |
| Photovoltaik → Speicher | Direktes Duo mit gutem Bildwechsel; bei 1920 ist das Speicherbild schmaler als das PV-Bild. | Speicher nutzt ebenfalls die vorhandene `image-wide`-Proportion. Gleiche Bilddominanz und vergleichbare Textbreiten bei wechselnder Bildseite. |
| Speicher → EnergyFlow | Klarer Flächenwechsel; lange Hauptleistungstexte benötigen ausreichend Raum. | EnergyFlow unverändert. Etwas kompakteres gemeinsames Split-Padding führt das Duo ruhiger zum bestehenden Systemblock. |
| EnergyFlow → Gewerbe | Bereits optimierter, bündiger Gewerbe-Split und dezenter Tarifhinweis. | Unverändert; bestehende Text-/Bildhöhe, Bildquelle, Object-Position und Bild-Reveal-Option erhalten. |
| Gewerbe → Ergänzungen → Wärmepumpe | Kurze weiße Zäsur und klarer Übergang funktionieren bereits. | Gewerbe und Ergänzungsintro unverändert. Wärmepumpe erhält ausschließlich das gemeinsame, etwas kompaktere Split-Padding. |
| Wärmepumpe → Klima → Wallbox | Bildwechsel und Flächenfolge funktionieren; Wallbox hatte bei großen Breiten weniger Bildanteil. | Wallbox nutzt die bestehende `image-wide`-Proportion. Einheitlicheres Padding verbindet die drei Sections, ohne ihre Flächen oder Motive gleichzumachen. |
| Wallbox → Service | Weiß → Soft und Bildwechsel links markieren den Kapitelwechsel bereits. | Flächen und Bildreihenfolge erhalten; gemeinsame Split-Abstände verbinden beide Blöcke. |
| Service → Prozess | Prozess beginnt mit mehr Außenabstand als der Serviceblock. | Startseitenspezifischer Abschnittsabstand und etwas weniger Abstand vor den Prozessschritten. Die Umsetzung schließt näher an die Leistung an. |
| Prozess → Referenzen | Beide Bereiche sind weiß; ihre addierten Außenabstände bilden eine lange Lücke. | Konsistenter Abschnittsabstand und etwas kompakterer Abstand vor dem Referenzmosaik. Prozesslinien und reale Projektbilder bleiben die visuellen Anker. |
| Referenzen → Reviews | Referenzen und Reviews besitzen große, jeweils eigene Außenabstände. | Gemeinsamer Abschnittsrhythmus, kompakterer Abstand zum Bewertungsüberblick und Carousel. Weiß → Soft bleibt erhalten. |
| Reviews → Partner | Partnerbereich hat einen anderen Padding-Rhythmus als die Reviews. | Partner-Padding übernimmt den lokalen Abschnittsabstand. Inhalte, Logos, Controls und Carousel-Logik unverändert. |
| Partner → FAQ | Flächenwechsel passt; FAQ-Headline hat mehr Abstand zum Accordion als die anderen Inhaltsblöcke. | Gemeinsamer Außenabstand und kontrollierterer Heading-/Accordion-Abstand. |
| FAQ → Final CTA | Bild-CTA ist bereits ein klarer Abschluss; davor relativ große FAQ-Abstände. | FAQ kompakter; finale Bild-/Textgeometrie erhalten. Mobile CTA-Buttons sind wie die Produkt-CTAs gleich breit. |

Alle 18 angeforderten Bestandteile wurden in der Baseline berücksichtigt; BrandIntro ist bewusst ein Signet mit Höhe 0 an der Hero-/Intro-Grenze, keine zusätzliche Leerraum-Section.

## Umsetzung und Abgrenzung

- `src/app/(site)/page.tsx`: lokale Klasse `home-page` am bestehenden Main; vorhandene `image-wide`-Option bei Speicher und Wallbox.
- `src/app/globals.css`: ausschließlich innerhalb `.home-page` wirkende Kompositionsregeln. Die vorhandene Variable `--section-space` wird lokal genutzt, ohne globale Skala, Fonts oder Farbpalette zu ändern.
- Gemeinsame Marketing-Komponenten bleiben unverändert. Die Unterseiten erhalten keine `home-page`-Klasse und behalten ihren bisherigen Stil. Daher kein durch Komponentenänderung ausgelöster Unterseiten-Smoke-Test erforderlich.
- Texte, Überschriften, Labels, Ziele, Reihenfolge, SEO, Navigation, Structured Data, Datenquellen und Geschäftslogik unverändert.
- Bestehende Bilder, mobile Quellen und Object-Positions erhalten. Crop passt sich an die jeweiligen Spaltenproportionen an; keine Duplikate, Downloads oder neue Bilder.
- Kein neues JavaScript, keine Abhängigkeit und keine zusätzliche Animation. Bestehende Fokus-, Carousel-, FAQ- und Reduced-Motion-Verhalten bleiben erhalten.
- Der Gewerbe-Padding-Selektor behält seine bestehende Priorität; der bereits optimierte Gewerbe-/Ergänzungsbereich wird nicht durch die allgemeinen Startseitenabstände überschrieben.

## QA

`npm run check:all` vollständig mit Exit 0 bestanden: ESLint, Typegen/TypeScript, 64 Unit-Testdateien mit 479 Tests, Functions-Lint/Build, 30 Emulator-Regeltests und Produktionsbuild. Keine Prüfungen abgeschwächt. Für Typegen/Build lief kein konkurrierender Next-Dev-Prozess.

Browser: lokaler Chrome 153 gegen den Produktionsbuild, vorhandene lokale Firestore-Emulatordaten ohne Export/Seed. Vorher und nachher vollständig bei 1920, 1440, 1280, 1024, 390 und 375 px betrachtet; zusätzlich 50-%-äquivalente Gesamtansicht (CSS-Viewport 2880 px, Device Scale 0.5). Layoutentscheidungen beruhen auf den regulären Viewports.

Die DOM-Inhalte der statischen Sections einschließlich Linktexten und Zielen wurden vor/nach als SHA-256 verglichen; alle sechs Vergleiche identisch. Metadaten, H1 und sämtliche vorhandenen JSON-LD-Scripts ebenfalls identisch. Der providerabhängige Review-Text ist vom statischen Hash ausgenommen; seine Datenquelle und Komponentenimplementierung sind unverändert.

| Viewport | Seitenhöhe vorher | Seitenhöhe nachher |
| --- | --- | --- |
| 1920 | 12860 px | 12351 px |
| 1440 | 12135 px | 11597 px |
| 1280 | 11847 px | 11357 px |
| 1024 | 12137 px | 11683 px |
| 390 | 18628 px | 18116 px |
| 375 | 18935 px | 18423 px |

Die Verringerung entsteht durch die kontrollierten Abstände, ohne Inhalte zu entfernen. Bei 1440 sinkt beispielsweise das Unternehmensintro von 752 auf 680 px, der Prozess von 706 auf 603 px, die Referenzen von 1003 auf 909 px, Reviews von 1130 auf 1000 px und FAQ von 685 auf 574 px. Der zuvor optimierte Gewerbeblock bleibt 777 px hoch und das Ergänzungsintro 152 px. Auch bei allen anderen geprüften Breiten bleiben Hero, EnergyFlow, Gewerbe und Ergänzungsintro geometrisch unverändert.

Keine horizontalen Überläufe, auch beim Scrollen mit aktiven Reveals und bei reduzierter Ansicht. Alle gemessenen Desktop-Splits haben bündige Text-/Bildhöhen; alle Produktbilder geladen. Keine HTTP-Fehler ≥ 400 im Browserlauf. FAQ öffnet/schließt, Google-Reviews- und Partner-Carousel bewegen sich auch bei 390 px. Bei Reduced Motion: aktivierte Präferenz, keine ausstehenden Reveal-Elemente und kein Overflow. Bildmotive, Desktop-/Mobil-Crops, CTA-Gruppen und die gesamte Flächenfolge wurden anhand der Aufnahmen geprüft.

Vorher-/Nachher-Ergebnisdateien:

- `artifacts/homepage-sprint10-full-polish/before/browser-results.json`
- `artifacts/homepage-sprint10-full-polish/browser-results.json`

Alle angeforderten Nachher-Screenshots unter `artifacts/homepage-sprint10-full-polish/` (dieselben Dateinamen für die Vergleichsbilder unter `before/`):

1. `01-homepage-full-1440.png`
2. `02-homepage-full-1920.png`
3. `03-homepage-overview-reduced-zoom.png`
4. `04-hero-intro-1440.png`
5. `05-pv-storage-energyflow-1440.png`
6. `06-commercial-additional-1440.png`
7. `07-heat-climate-wallbox-1440.png`
8. `08-service-process-1440.png`
9. `09-references-reviews-partners-1440.png`
10. `10-faq-final-cta-1440.png`
11. `11-homepage-mobile-390-full.png`
12. `12-mobile-pv-storage.png`
13. `13-mobile-commercial-products.png`
14. `14-mobile-trust-faq.png`

Zusätzlich in beiden Ständen: `homepage-full-1280.png`, `homepage-full-1024.png`, `homepage-full-375.png`. Alte QA-Ordner unverändert und keine Artefakte gestagt.

Keine offenen technischen oder visuellen Fehler aus diesen Prüfungen. Bewusste Entscheidung des ersten Passes: Split-Höhen bleiben inhaltsgetrieben. Beispielsweise sind PV/Speicher bei 1920 nach Angleichung der Textspalten 743/807 px hoch; für identische Höhen würden künstliche Leerflächen erforderlich. Keine gemeinsamen Marketing-Komponenten geändert und keine Unterseiten durch die lokalen Regeln betroffen; deshalb keine zusätzlichen Unterseiten-Smoke-Tests ausgeführt.

`git diff --check` bestanden. Geänderte Anwendungsdateien: `page.tsx` und `globals.css`; zusätzlich diese neue Dokumentation und der neue QA-Ordner.

Rollback-Referenz bleibt `backup/homepage-before-full-polish`. Die Änderungen werden ausschließlich zur Abnahme präsentiert; kein Commit, Push oder Deployment.
