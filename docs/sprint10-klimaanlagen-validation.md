# Sprint 10: Klimaanlagen-Validierung

Stand: 30.09.2026. Ausgangspunkt war die bestehende `/klimaanlagen`-Seite mit neun redaktionellen Abschnitten, Hero, Brand-Signet, FAQ und abschließendem CTA. Die zu Beginn vorhandenen nicht versionierten QA-Artefakte anderer Sprints wurden nicht verändert.

## Umsetzung

- Erhalten: H1, SEO-Titel, Canonical, FAQ-Route, Brand-Signet, allgemeines Hero-Bild, Single-Split-Bild, PV-Bild, die übrigen bisherigen Anker, Grundtexte und die allgemeine Bildsprache. Im finalen Struktur-Polish wurde die eigenständige `wartung`-Section auf ausdrücklichen Wunsch entfernt.
- Punktuell überarbeitet: Hero, Planung, Single-/Multisplit-Einordnung, Heizfunktion als Luft-Luft-Wärmepumpe, PV und Batteriespeicher als optionale Kombination, Installation, Wartung und regionale Beratung. Allgemeine Abschnitte bleiben allgemein und bilden keinen Herstellerkatalog.
- Ergänzt: `bosch-klimaanlagen` mit drei großen Produktporträts in wechselnder Bild/Text-Anordnung. Keine Preise, Produktbewertungen, Offers oder neuen Product-Markups. Climate 3200i: Single-Split, vier Nennleistungen 2,6–7,0 kW, Kühlung/Heizung, 3D-Swing, Ionisator, optionales WLAN-Gateway. Climate 6000iP: Single-Split, R290, zwei Nennkühlleistungen 2,6–3,5 kW, Kühlung/Heizung, 3D-Swing, Ionisator, optionales WLAN. Climate 5000 M: Multi-Split, je nach Außeneinheit zwei bis fünf Innengeräte, Kühlung/Heizung, mehrere Innengerätetypen. Fakten wurden am 30.09.2026 auf den [Bosch-Seiten für 3200i](https://www.bosch-homecomfort.com/de/de/ocs/wohngebaeude/climate-3200i-21911805-p/), [6000iP](https://www.bosch-homecomfort.com/de/de/ocs/wohngebaeude/climate-6000ip-22243767-p/) und [5000 M](https://www.bosch-homecomfort.com/de/de/ocs/wohngebaeude/climate-5000-m-ausseneinheit-19653490-p/) abgeglichen.
- Sichtbare Partnerformulierung im Installationsabschnitt: „Energie-Kraft Süd berücksichtigt die technischen und baulichen Anforderungen bereits bei der Planung und koordiniert die fachgerechte Installation und Inbetriebnahme gemeinsam mit qualifizierten Montagepartnern.“ Auch Hero, Produktbereich und Beratung nennen qualifizierte Partner; eigene exklusive Monteure oder Zertifizierungen werden nicht behauptet.
- Finaler Struktur-Polish: `single-split` steht vor `bosch-klimaanlagen`; danach folgen `multi-split`, `kuehlen-und-heizen`, `photovoltaik`, `komfort-und-betrieb`, `installation` und `beratung`. Die Wartung ist als kurzer Hinweis und dezenter Link zu `/service-und-wartung` am Ende der Installationsinhalte integriert. Die Hero-Regel für die Klimaanlagen-Route hält „Raumtemperaturen“ bei 1440 px zusammen.

SEO-Daten: Titel `Klimaanlage kaufen & installieren | Energie-Kraft Süd`; Description `Bosch Klimaanlage kaufen: Single- und Multisplit-Lösungen für Haus, Wohnung und Gewerbe. Beratung und Planung durch Energie-Kraft Süd aus Ainring.`; Canonical `/klimaanlagen`; H1 `Angenehme Raumtemperaturen – individuell und effizient geplant`.

Interne Ziele: Hero und Final CTA `/konfigurator/klimaanlage`, Beratung `CONTACT_FORM_HREF` (`/kontakt#kontaktformular`), PV-Abschnitt `/photovoltaik`. Die gerenderte Hero-Logik des gemeinsamen `PublicContentPage` wurde berücksichtigt: Der Konfigurator wird dort als primärer Link vor dem Kontaktlink gesetzt.

## FAQ-Prüfung

Leseprüfung der lokalen Firestore-Emulator-Daten aus `.emulator-data`, Projekt `demo-energie-kraft-next`: 40 Einträge mit Bezug zu Kategorie oder Route `klimaanlagen`. Keine überholte Aussage, dass Energie-Kraft keine Klimaanlagen verkauft; keine Behauptung exklusiv eigener Montage; keine veraltete Hersteller-/Modellnennung gefunden. Der fachliche Eintrag zur Installation durch sachkundiges Personal wurde nicht geändert. Details: `artifacts/sprint10-klimaanlagen-qa/faq-review.json`. Produktive Firestore-Daten wurden nicht abgefragt oder verändert. Es ist kein FAQ-Importvorschlag erforderlich.

## Prüfung

- `npm run check:all`: grün; Lint, Typecheck, 505 Unit-Tests, Functions-Checks, 30 Rules-Tests und Production-Build erfolgreich. Der neue Klimaanlagen-Content-Test prüft Metadaten, Reihenfolge/IDs, drei Porträts und Bilder, Herstellerlinks, gerenderte CTAs, PV-Link, Signet und Partnerformulierung.
- `git diff --check`: ohne Fehler.
- Lokale Chrome-QA auf `/klimaanlagen` bei 1920, 1440, 1280, 1024, 390 und 375 px: H1, Signet, drei Porträts, mobile Bildreihenfolge, Hero-Ziele, PV-Link, Partnertext, geladene Bilder und fehlender horizontaler Overflow geprüft. Tastaturfokus und Reduced Motion geprüft. Regression der unveränderten Routen `/`, `/photovoltaik`, `/stromspeicher`, `/waermepumpen`, `/wallbox` auf H1 und Overflow geprüft. Ergebnis: `artifacts/sprint10-klimaanlagen-qa/browser-results.json` (`passed: true`). Keine reale Anfrage versandt.
- Angeforderte zehn Screenshots: `artifacts/sprint10-klimaanlagen-qa/01-klimaanlagen-full-1440.png` bis `10-klimaanlagen-products-mobile-390.png` (Dateinamen siehe QA-Ordner). Die Produktsektion wurde auf Desktop und Mobile visuell geprüft.
- Abschließende Struktur- und Hero-QA: `artifacts/sprint10-klimaanlagen-final-polish-qa/browser-results.json` und aktualisierte Screenshots im selben Ordner. Bei allen sechs Breiten wurden Wortumbruch, Section-Reihenfolge, fehlender `wartung`-Anker, kompakter Wartungshinweis, Service-Link und direkter Übergang zur Beratung geprüft; die Zielroute `/service-und-wartung` lud erfolgreich.

Offen vor öffentlicher Veröffentlichung: die Nutzungsfreigabe für die drei offiziellen Bosch-Produktbilder; der bereitgestellte Bildordner enthält keine drei belastbar zuordenbaren Modellbilder. Siehe `docs/sprint10-klimaanlagen-assets.md`.
