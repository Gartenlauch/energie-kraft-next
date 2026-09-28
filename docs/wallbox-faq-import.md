# Wallbox-FAQ: geprüfter Importvorschlag

Stand: 28.09.2026. Laufzeitquelle bleibt ausschließlich Firestore. Keine Produktionsdaten wurden verändert.

Die Datei [wallbox-faq-import.json](./wallbox-faq-import.json) entspricht Schema-Version 1 der vorhandenen Admin-Importfunktion unter /admin/faqs. Grundlage sind die kuratierten lokalen Seed-Daten aus scripts/emulators/faq-sprint83a-data.mjs, kein Export der aktuellen Produktionsdaten.

## Änderungen

| Bestehende FAQ / Slug        | Maßnahme                                                                                                            |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| pv-ueberschussladen          | Bestehende ID und URL behalten; Antwort auf reines Überschussladen, Mindestleistung und Phasenumschaltung erweitern |
| wallbox-ladeleistung         | Bestehende ID und URL behalten; 11/22 kW erklären und Begrenzung durch Fahrzeug/Anschluss erhalten                  |
| dynamisches-lastmanagement   | Behalten; Wallbox-Platzierung nach den sechs gewünschten Fragen                                                     |
| wallbox-ohne-speicher        | Behalten; Wallbox-Platzierung nach den sechs gewünschten Fragen                                                     |
| wallbox-installation-planung | Behalten; Wallbox-Platzierung nach den sechs gewünschten Fragen                                                     |
| wallbox-photovoltaikanlage   | Neu: Auswahl passend zum Energiesystem                                                                              |
| wallbox-22-kw-hausanschluss  | Neu: Anschlussprüfung und Netzbetreiber                                                                             |
| bidirektionales-laden        | Neu: V2H/V2G und Grenzen der Fahrzeugkompatibilität                                                                 |
| sonnenhome-charger-2         | Neu: eingestellt, aktuelle Alfen-Lösung, kein Preis-/Verfügbarkeitsversprechen                                      |

Die Route zeigt die ersten sechs veröffentlichten Fragen nach Platzierungsreihenfolge; die Kategorie behält alle neun. Die bestehende Startseiten-Platzierung der Überschusslade-FAQ und bestehende verwandte FAQ-IDs bleiben im Vorschlag erhalten. Antworten beginnen mit einer direkten Kurzantwort, weil die öffentliche Produktseite das Feld answer rendert.

## Import über die bestehende Admin-Oberfläche

1. Aktuelle FAQ-Daten exportieren und sichern. Kategorie-ID, FAQ-IDs, Slugs und bereits vorhandene inhaltlich gleiche Fragen mit dem Vorschlag vergleichen.
2. Der Vorschlag verwendet die vorhandenen Seed-IDs. Weichen die tatsächlichen IDs ab, deren IDs einschließlich categoryId und relatedFaqIds übernehmen. Bereits vorhandene gleichartige Fragen aktualisieren, nicht zusätzlich anlegen. Aktuelle zusätzliche Platzierungen, Sichtbarkeit und redaktionelle Änderungen aus dem Export erhalten.
3. JSON in /admin/faqs laden und Vorschau prüfen. Beim unveränderten Seed-Bestand sind vier neue und fünf aktualisierte FAQs sowie eine unveränderte Kategorie zu erwarten. Nichts wird gelöscht. Abweichungen vor dem Import abgleichen.
4. Import bestätigen. Danach /wallbox sowie /faq/wallbox kontrollieren; sechs kuratierte Fragen müssen auf der Produktseite und ihre Antworten deckungsgleich im FAQ-JSON-LD erscheinen.

Der alte Emulator-Seed wird absichtlich nicht ausgeführt: Er ergänzt nur fehlende IDs und aktualisiert bestehende Einträge nicht. Ein Import ist redaktionelle Pflege über die vorhandene Authentifizierung, kein neuer FAQ-Datenspeicher.

Produktquellen und Einschränkungen: [wallbox-product-assets.md](./wallbox-product-assets.md). Anschlussregeln: [Bundesnetzagentur](https://www.bundesnetzagentur.de/DE/Fachthemen/ElektrizitaetundGas/Netzanschluss/start.html), geprüft am 28.09.2026. Die Einstellung des sonnenHome Charger 2 und das angebotene Portfolio beruhen auf der ausdrücklichen Vorgabe von Energie-Kraft.
