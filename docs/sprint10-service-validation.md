# Sprint 10: Service & Wartung – Validierung

## Ausgangsstand und Ergebnis

Die Hauptseite unter `/service-und-wartung` hatte einen passenden PV-Hero, Brand-Signet sowie kurze Abschnitte zu Anlagencheck, Wartung und Kontakt. Eine klare Betreuung nach System, insbesondere für Wärmepumpen und Klimaanlagen, fehlte. Der Hero und das Signet bleiben erhalten. Der Hub führt nun von der langfristigen Begleitung über vier große Servicebereiche zu Ladeinfrastruktur, Anlagencheck, Monitoring, Wartung, Anfrageablauf, Team und regionalem Kontakt.

## Fachliche Abgrenzung

| Bereich                 | Aussage im Hub                                                                                                                                                                                                        |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Photovoltaik            | Ertragskontrolle, Monitoring, Anlagencheck, Wartung, Instandhaltung und systemabhängige Störungsbeseitigung.                                                                                                          |
| Batteriespeicher        | Status, Meldungen, Kommunikation und Zusammenspiel mit PV und Energiemanagement werden zunächst eingeordnet; keine Reparaturzusage für alle Hersteller.                                                               |
| Wärmepumpe              | Für von Energie-Kraft geplante Bosch-Systeme werden Prüfung, Wartung und nötige Arbeiten je nach Anliegen gemeinsam mit qualifizierten Fach- und Montagepartnern koordiniert.                                         |
| Klimaanlage             | Filter, Innen- und Außeneinheit, Kondensatablauf, Funktion, Geräusche und Leistungsabfall sind mögliche Prüfpunkte. Wartungs- und Facharbeiten werden systemgerecht mit qualifizierten Partnern abgestimmt.           |
| Wallbox                 | Kompakte Einordnung von Kommunikation, Lastmanagement und PV-Einbindung; keine generelle Fremdsystem-Zusage.                                                                                                          |
| Monitoring / Leitstelle | Daten helfen nur bei entsprechend angebundenen Anlagen. Laufende Leitstellenüberwachung wird ausschließlich als mögliche Leistung für gewerbliche PV-Anlagen und abhängig vom vereinbarten Serviceumfang beschrieben. |
| Wartung                 | Umfang und Intervalle richten sich nach System, Nutzung und Herstellervorgaben. Es gibt kein pauschales Jahresintervall.                                                                                              |

Energie-Kraft übernimmt die persönliche Einordnung und Koordination. Der Hub behauptet weder eigene Bosch-Servicetechniker noch eine Installation oder Reparatur aller Systeme allein durch eigene Monteure. Er enthält keine Reaktionszeit, 24/7-Zusage oder automatisch enthaltenen Wartungsverträge.

## SEO, Region und interne Links

- Title: `Service & Wartung für Energieanlagen | Energie-Kraft Süd`
- Description: `Service und Wartung für Photovoltaik, Speicher, Wärmepumpen und Klimaanlagen: Anlagencheck, Monitoring und technische Betreuung durch Energie-Kraft Süd.`
- Canonical: `/service-und-wartung`
- H1: `Damit Ihre Energietechnik zuverlässig weiterarbeitet`
- Region: Ainring bei Freilassing, Berchtesgadener Land, Landkreis Traunstein und angrenzende Region. Die Angabe „seit über 20 Jahren“ wurde vom Auftraggeber bestätigt.
- Produktlinks: `/photovoltaik`, `/stromspeicher`, `/waermepumpen`, `/klimaanlagen`, `/wallbox`.
- Servicelinks: `/service-und-wartung/service-und-team`, `/service-und-wartung/wartung-und-reinigung` und der bestehende Kontaktanker `/kontakt#kontaktformular`.
- Die Klimaanlagenseite verweist bereits auf den Service-Hub; der Hub verlinkt zurück, ohne ganze Absätze zu duplizieren.

## Unterseiten und FAQ

`/service-und-wartung/service-und-team` erhielt nur eine präzisere Description und einen Listenpunkt für Wärmepumpen und Klimaanlagen. TeamOverview, URL und übrige Inhalte blieben bestehen.

`/service-und-wartung/wartung-und-reinigung` bleibt PV-orientiert und `noIndex`. Der neue Hub kennzeichnet den Link deshalb als Detailinformation zur Prüfung und Pflege von Photovoltaikanlagen. Eine spätere technologieübergreifende Erweiterung ist sinnvoll, wenn dafür eigenständige, fachlich geprüfte Inhalte für Speicher, Wärmepumpe und Klima vorliegen. Die Finanzierungs-Unterseite wurde nicht geändert; ein fachlicher Widerspruch zum Hub wurde nicht festgestellt.

Die Service-Route verwendet derzeit die FAQ-Routenzuordnung `kontakt`, zeigt auf dieser Seite aber keine eigene FAQ-Ausgabe. Produktive Firestore-Daten wurden nicht verändert. Vorschläge für eine spätere redaktionelle Prüfung:

- Welche Anlagen betreut Energie-Kraft im Service?
- Welche Angaben werden bei einer Störung benötigt?
- Gibt es Monitoring?
- Wie oft muss eine Klimaanlage gewartet werden?
- Unterstützt Energie-Kraft beim Wärmepumpen-Service?
- Kann eine bestehende PV-Anlage geprüft werden?

Antworten sollten den konkreten System- und Vertragsumfang berücksichtigen. Für Wartung ist kein pauschales Intervall zu behaupten.

## Verifikation

- `tests/unit/service-page-content.test.ts`: 3 Tests bestanden. Deckt SEO, H1, Signet, vier Systembereiche, Klima-Wartung, Wallbox, Leitstellen-Einschränkung, Links und Region ab.
- `npm run check:all`: erfolgreich; 72 Unit-Testdateien mit 508 Tests, 30 Rules-Tests, Lint, Typecheck, Functions und Build.
- `git diff --check`: erfolgreich.
- Lokale Browser-QA mit `scripts/sprint10-service-browser.mjs`: 1920, 1440, 1280, 1024, 390 und 375 px ohne horizontalen Overflow oder defekte Bilder. H1, Signet, Systemreihenfolge, Links, Tastaturfokus und Reduced Motion geprüft. Regression auf `/`, `/klimaanlagen`, `/waermepumpen`, `/photovoltaik` und `/stromspeicher` bestanden. Für deren Firestore-FAQ wurde ausschließlich die lokale Emulator-Umgebung verwendet.
- Screenshots und maschinenlesbarer QA-Bericht: `artifacts/sprint10-service-qa/` (`01` bis `09` sowie `results.json`). Diese Artefakte wurden nicht gestaged.

## Offene Punkte

Die FAQ-Vorschläge benötigen fachliche Redaktion und Einpflege über die bestehende Admin-Architektur. Eine technologieübergreifende Wartungs-Unterseite bleibt eine spätere, gesonderte Inhaltsentscheidung.
