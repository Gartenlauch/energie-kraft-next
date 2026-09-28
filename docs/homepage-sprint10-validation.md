# Startseite – Sprint 10: SEO/GEO und Gewerbe

Stand: 28.09.2026. Ausgangsbasis: lokaler Stand auf `main`, Arbeitsbaum vor Beginn sauber.

## Umsetzung und Quellen

Die bestehende Premium-Startseite bleibt erhalten. Die im Auftrag bestätigte WordPress-Positionierung ist übernommen: Photovoltaik und Batteriespeicher als Hauptleistungen für private Haushalte und Unternehmen, alles aus einer Hand, regional von Ainring bei Freilassing aus. Wärmepumpe, Klimaanlage und Wallbox ergänzen das System.

**Unternehmensbestand seit über 20 Jahren vom Auftraggeber bestätigt.** Die Aussage steht im Unternehmensintro und in den Vertrauenselementen. Kein exaktes Gründungsjahr und kein `foundingDate` wurden ergänzt.

Die Abrufe von <https://www.energie-kraft.de/> und <https://www.energie-kraft.de/energieloesungen/photovoltaik-fuer-unternehmen/> lieferten HTTP 403. Es wurde keine Sperre umgangen. Die verbindlichen Texte stammen aus dem Sprint-Briefing; eine darüber hinausgehende Prüfung des WordPress-Originals ist nicht erfolgt.

Die vorgegebenen öffentlichen Texte wurden unverändert übernommen. Ergänzt wurde lediglich die Gewerbe-Eyebrow „Photovoltaik für Unternehmen“. „mehr energiekraft“ ist ein Absatz als Markenzeile; die Gewerbeüberschrift bleibt eine H2. Die H1 bleibt exakt „Energie intelligent planen und nachhaltig nutzen“.

## Dateien

Geändert:

- `src/content/pages/home.ts`: Title, Description, Hero und zentrale neue/geänderte Startseiten-Texte einschließlich CTA-Daten.
- `src/app/(site)/page.tsx`: bestehende Sections neu angeordnet, Gewerbe, Stromtarifhinweis und kompakter Übergang ergänzt; Hero-CTAs direkt aus `homeContent.hero`.
- `src/components/marketing/marketing-sections.tsx`: optionale Markenzeile, sekundärer Textlink und Desktop-Bildausschnitt in der bestehenden SplitFeatureSection. Bestehende Aufrufer behalten ihre Standarddarstellung.
- `src/components/layout/site-header.tsx`: ausschließlich die acht bestehenden Energielösungen-Objekte umgeordnet.

Neu:

- `tests/unit/homepage-sprint10.test.ts`: fünf Tests an tatsächlich gerenderter HTML-Ausgabe für Metadaten, H1, Anker, Reihenfolge, Gewerbe-CTAs und beide Menüs; vorhandene Datenadapter sind isoliert gemockt.
- `docs/homepage-sprint10-validation.md`.
- QA-Artefakte unter `artifacts/homepage-sprint10-qa/`, siehe Screenshot-Liste und `browser-results.json`.

Footer, Gewerbe-Unterseite, FAQ-/Review-Adapter, strukturierte Daten, Indexierungsschutz und ergänzende Produktinhalte bleiben erhalten. Es gibt keine neuen Abhängigkeiten, Routen, Formularparameter oder Konfiguratoren.

## Finale Reihenfolge

1. Premium-Hero
2. BrandIntro
3. BrandStatementSection mit Unternehmensbestand und Vertrauenselementen
4. Photovoltaik (`photovoltaik`)
5. Batteriespeicher (`stromspeicher`), unmittelbar anschließend
6. EnergyFlow, einmalig, mit anschließendem dezentem Stromtarifhinweis
7. Gewerbe (`gewerbe`)
8. Kompakter Übergang „Ihr Energiesystem sinnvoll ergänzen“
9. Wärmepumpe
10. Klimaanlage
11. Wallbox
12. Service & Wartung
13. Projektablauf
14. Referenzprojekte
15. Google-Bewertungen
16. Partnerlogos
17. FAQ aus der bestehenden Firestore-Architektur
18. Abschließender Beratungs-/Konfigurator-CTA

## Metadaten und CTA-Ziele

- Title und OpenGraph-Title: `Ihr PV Anbieter aus Bayern | Energie-Kraft Süd`.
- Description: `Ihr PV Anbieter aus Bayern: Photovoltaik und Batteriespeicher für Privatkunden und Unternehmen. Über 20 Jahre Erfahrung. Alles aus einer Hand.`
- CanonicalPath: `/`; `buildMetadata` verwendet weiterhin einen absoluten Title ohne doppelte Marke.
- Hero: „Energieprojekt konfigurieren“ → `/konfigurator`; „Photovoltaik entdecken“ → `#photovoltaik` mit existierendem Zielanker.
- PV: `/konfigurator/photovoltaik` und `/photovoltaik`.
- Speicher: `/konfigurator/stromspeicher` und `/stromspeicher`.
- Gewerbe-Hauptbutton: „Nehmen Sie jetzt mit uns Kontakt auf“ → `CONTACT_FORM_HREF`, also `/kontakt#kontaktformular`.
- Gewerbe-Textlink: „Photovoltaik für Unternehmen kennenlernen“ → bestehende Route `/energieloesungen/photovoltaik-fuer-unternehmen`.
- Einmaliger Tariflink: „Stromtarife für Photovoltaik kennenlernen“ → `/energieloesungen/stromtarife-pv`.

## Menü vorher/nachher

| Position | Vorher | Nachher |
| --- | --- | --- |
| 1 | Photovoltaik | Photovoltaik |
| 2 | Stromspeicher | Stromspeicher |
| 3 | Wärmepumpe | Photovoltaik für Unternehmen |
| 4 | Klimaanlage | Gewerbespeicher |
| 5 | Wallbox | Wärmepumpe |
| 6 | Photovoltaik für Unternehmen | Klimaanlage |
| 7 | Gewerbespeicher | Wallbox |
| 8 | Stromtarife | Stromtarife |

Das vorhandene zeilenweise zweispaltige Desktop-Raster bleibt bestehen; mobile Ausgabe verwendet dieselben Objekte. Hrefs, Beschreibungen, Vorschaubilder, Prioritäten und Interaktionslogik sind unverändert. „Unternehmen“ bleibt `/ueber-uns`; „Für Unternehmen“ im Footer bleibt die Gewerbe-PV-Route.

## Gewerbebilder

Beide Dateien wurden visuell geöffnet und ihre Abmessungen mit `sharp.metadata()` ausgelesen:

| Bestehendes Asset | Tatsächliche Abmessungen |
| --- | --- |
| `public/images/commercial-photovoltaic/commercial-photovoltaic-hero-desktop.webp` | 1600 × 1000 px |
| `public/images/commercial-photovoltaic/commercial-photovoltaic-hero-mobile.webp` | 812 × 1015 px |

Motiv: zwei Fachkräfte auf einem großen PV-/Gewerbedach. Alt: „Zwei Fachkräfte auf einer Photovoltaikanlage auf einem Gewerbedach“. Keine Behauptung eines eigenen Referenzprojekts. Keine Downloads oder Duplikate. Bestehendes ArtDirectedImage mit lokalen responsiven Quellen, `sizes` und stabilen Bildbereichen. Der Gewerbe-Desktopausschnitt ist rechts ausgerichtet, damit beide Fachkräfte im höheren Split-Bildbereich sichtbar bleiben.

## Automatisierte Prüfung

`npm run check:all` wurde ausgeführt. Nach Korrektur der Isolation der neuen Render-Tests bestanden Lint, Typecheck, **64 Testdateien mit 479 Tests**, Functions-Lint/Build und die Emulator-Sicherheitsregeltests (Script-Exit 0).

Der anschließende Build dieser Befehlskette endete zunächst mit `EBUSY`, weil das eigene temporäre Chrome-Profil unter `.next` lag. Der QA-Browser wurde beendet und sein Profil sowie die temporäre CDP-Prüfung nach `%TEMP%` verlagert. `npm run build` bestand anschließend vollständig. Nach der visuellen Korrektur des Gewerbeausschnitts bestanden gezieltes ESLint, die fünf Startseiten-Tests und der abschließende Produktionsbuild erneut. Die gesamte `check:all`-Kette hat damit keinen abschließenden einzelnen Exit 0; ihre einzelnen Prüfschritte sind erfolgreich abgeschlossen.

Es lief kein konkurrierender Next-Dev-Prozess. Keine generierten Typen wurden manuell repariert und keine Checks deaktiviert. Ein vorheriger isolierter Vitest-Start war durch die Prozess-Sandbox (`EPERM`) blockiert; die Prüfungen liefen anschließend mit genehmigter lokaler Prozessausführung.

## Browser und offene Punkte

Chrome 153 über lokale CDP-Steuerung, gegen den finalen Produktionsbuild (`npm run start -- --port 3000`). Der vorhandene lokale Firestore-Datenstand wurde mit `firebase emulators:start --project demo-energie-kraft-next --only firestore --import=.emulator-data` geladen, ohne Export und ohne Seed. Öffentliche Environment-Prüfung: `local`, Emulator aktiv, Indexierung deaktiviert. Kein Zugriff auf produktive Firestore-Daten.

Geprüfte Breiten: **1440, 1920, 375, 390, 1024 und 1280 px**, jeweils 900 px Viewport-Höhe. 1024 prüft die Tablet-Navigation; 1280 den tatsächlichen Desktop-Navigations-Breakpoint (`xl`).

Ergebnisse:

- Überall exakt ein unverändertes H1, der gewünschte Title, Canonical `https://www.energie-kraft.de/` und `noindex, nofollow, noarchive, nosnippet`.
- Keine horizontalen Überläufe beim Scrollen durch die Sections mit aktivierten Reveal-Animationen.
- Acht korrekte Menüziele in Desktop und Mobile; lange Gewerbebeschriftung passt ohne Abschneiden. Desktop-Hover zeigt die passende Vorschau, Verlassen schließt das Menü.
- Desktop bei 1440, 1920 und 1280: Enter öffnet, Tab erreicht `/photovoltaik` samt Fokus-Vorschau, Escape schließt und gibt Fokus an den Auslöser zurück. Mobile/Tablet-Escape schließt ebenfalls. Die ersten unvollständigen CDP-Enter-Ereignisse wurden durch vollständige native Tastaturereignisse gezielt nachgeprüft; finaler Bericht enthält diese tatsächlichen Ergebnisse.
- Gewerbe-Hauptbutton tatsächlich angeklickt: `/kontakt`, Hash `#kontaktformular`, vorhandener Anker im sichtbaren Bereich. Sekundärlink tatsächlich angeklickt: bestehende Gewerberoute mit passendem Canonical und Kontaktformular-CTA.
- FAQ aus dem bestehenden lokalen Datenstand vorhanden; erstes Accordion öffnet und schließt. Google-Bewertungen vorhanden; Weiter-Button bewegt das Carousel. Partner-Weiter-Button bewegt das Carousel.
- Keine fehlgeschlagen geladenen Bilder und keine HTTP-Antworten ≥ 400 im Browserlauf. Alle zusätzlich geprüften lokalen `main`-Bild-URLs antworteten mit HTTP 200. Noch nicht angeforderte Lazy-Bilder außerhalb des Carousel-Ausschnitts werden nicht als Ladefehler gewertet.
- Alle sechs Regression-Smoke-Routen laden mit H1, Title und Canonical: `/wallbox`, `/photovoltaik`, `/stromspeicher`, `/energieloesungen/photovoltaik-fuer-unternehmen`, `/kontakt`, `/konfigurator`.
- Hero, Unternehmensintro, Gewerbe-Komposition und mobile Navigation anhand der gespeicherten Ansichten visuell geprüft. Desktop-Gewerbeausschnitt zeigt beide Fachkräfte. Aufnahmen verwenden ruhende Scrollpositionen; der Overflow-Lauf behält die Reveal-Animationen bei.

Keine Lighthouse-, CLS- oder sonstigen Performance-Scores erhoben. Kein Anspruch auf vollständige Cross-Browser-/Accessibility-Abnahme; diese bleibt beim dafür vorgesehenen späteren QA-Paket.

Bei einzelnen bestehenden Next-Bildoptimierungen erschienen libvips-/GLib-Warnungen zum Farbinterpretationswert `32`; die zusätzlich geprüften lokalen Bildantworten waren dennoch HTTP 200. Die Bildoptimierungsarchitektur wurde in diesem Paket nicht geändert.

Maschinenlesbare Ergebnisse: `artifacts/homepage-sprint10-qa/browser-results.json`.

Alle 18 neuen Screenshots (nicht gestagt):

- `artifacts/homepage-sprint10-qa/desktop-1440-full.png`
- `artifacts/homepage-sprint10-qa/desktop-1440-hero.png`
- `artifacts/homepage-sprint10-qa/desktop-1440-intro.png`
- `artifacts/homepage-sprint10-qa/desktop-1440-photovoltaic.png`
- `artifacts/homepage-sprint10-qa/desktop-1440-storage.png`
- `artifacts/homepage-sprint10-qa/desktop-1440-energyflow.png`
- `artifacts/homepage-sprint10-qa/desktop-1440-commercial-transition.png`
- `artifacts/homepage-sprint10-qa/desktop-1440-mega-menu.png`
- `artifacts/homepage-sprint10-qa/desktop-1920-hero.png`
- `artifacts/homepage-sprint10-qa/mobile-375-full.png`
- `artifacts/homepage-sprint10-qa/mobile-375-commercial.png`
- `artifacts/homepage-sprint10-qa/mobile-375-commercial-image.png`
- `artifacts/homepage-sprint10-qa/mobile-375-navigation.png`
- `artifacts/homepage-sprint10-qa/mobile-390-full.png`
- `artifacts/homepage-sprint10-qa/mobile-390-commercial.png`
- `artifacts/homepage-sprint10-qa/mobile-390-commercial-image.png`
- `artifacts/homepage-sprint10-qa/mobile-390-navigation.png`
- `artifacts/homepage-sprint10-qa/tablet-1024-navigation.png`

Offen bleibt die separate vollständige Gewerbe-Unterseiten-Migration und der WordPress-Abgleich nach Behebung des HTTP-403-Zugriffsproblems. Für dieses Startseiten-Paket sind keine weiteren Geschäftsdaten oder Assets erforderlich.

Gewerbe-PV-Unterseite vorhanden; vollständige inhaltliche Alt-Neu-Migration folgt in einem eigenen Arbeitsschritt. Kein Commit, Push oder Deployment. Keine Produktionsdatenänderung, kein Seed-Lauf und keine echte Anfrage oder E-Mail versendet.
