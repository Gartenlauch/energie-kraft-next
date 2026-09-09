# Sprint 8 – SEO-Baseline

Zeitraum der Exporte: 9. Januar 2025 bis 9. September 2026 (GA4) bzw. letzte
16 Monate (Search Console). Alle Werte sind aggregiert und enthalten keine Formular- oder
personenbezogenen Rohdaten.

## Vertrauensgrenze der Daten

- Bis **6. Juli 2026** werden Daten als historisch plausibel behandelt.
- Am **7. Juli 2026** beginnt ein klarer Performance-Ausreißer; am 10./11. Juli folgt der
  sprunghafte Coverage-Anstieg. Ab diesem Zeitpunkt sind URL-, Länder- und Querydaten nur
  nach Incident-Filter verwendbar.
- 31.405 als „indexiert“ gemeldete Seiten und 279.022 nicht indexierte Seiten Ende August
  sind keine legitime Contentgröße, sondern überwiegend Incident-Folge.
- GA4 weist keine Schlüsselereignisse aus. Sessions und Engagement sind nutzbar,
  Conversion-Aussagen nicht.

## Wichtigste legitime Landingpages

| Seite                                              | GSC Klicks | GSC Impressionen | GA4 Aufrufe | GA4 Landing-Sitzungen |
| -------------------------------------------------- | ---------: | ---------------: | ----------: | --------------------: |
| `/`                                                |        596 |           33.875 |       2.905 |                 2.321 |
| `/kontakt-photovoltaik/`                           |         94 |            5.846 |       3.660 |                 2.733 |
| `/energieloesungen/wallbox-kaufen/`                |        118 |            4.885 |         293 |                   123 |
| `/service-und-wartung/service-und-team/`           |         93 |            4.971 |         652 |                   231 |
| `/jobs/`                                           |         61 |            3.264 |         729 |                   303 |
| `/pv-referenzen/`                                  |         56 |            3.989 |         535 |                   123 |
| `/energieloesungen/stromtarife-pv/`                |         33 |            5.133 |         213 |                    39 |
| `/energieloesungen/batteriespeicher-photovoltaik/` |         10 |            1.166 |         759 |                   344 |
| `/energieloesungen/photovoltaik-kaufen/`           |          3 |            1.345 |         656 |                   195 |
| `/energieloesungen/photovoltaik-fuer-unternehmen/` |          2 |            1.499 |         161 |                    18 |

Wallbox ist damit eine hohe **SEO Preserve Priority**, aber unverändert Business-Priorität 3.
PV und Speicher bleiben in Navigation, Conversion und interner Verlinkung das Hauptsystem.

## Legitime Query-Themen

- Marke: `Energie Kraft Süd` und Schreibvarianten.
- Wallbox: `sonnenHome Charger 2`, kaufen und Preisintention; Produktstände müssen vor
  erneuter konkreter Nennung verifiziert werden.
- Stromtarife für PV-/Solaranlagenbesitzer und Zusammenspiel von Eigenstrom und Reststrombezug.
- Photovoltaik-Anbieter in Bayern und „in der Nähe“.
- Solarstrom bzw. Strom speichern, PV plus Speicher.
- Wärmepumpe mit Photovoltaik.
- Photovoltaik für Unternehmen und Gewerbe.
- Jobs in der Solar-/Energiebranche.
- Wartung und Reinigung von Photovoltaikanlagen.

## Regionale Signale

GA4 zeigt legitime Nutzung unter anderem aus Bad Reichenhall (267 aktive Nutzer), Traunstein
(141), Ainring (110), Freilassing (109), Waging am See (85), Laufen (60), Berchtesgaden (56),
Teisendorf (38), Siegsdorf (25), Ruhpolding (20) und Saaldorf-Surheim (15). Salzburg ist mit
259 aktiven Nutzern sichtbar, darf aber nicht mit dem deutschen Unternehmensstandort
verwechselt werden.

In Search Console sind unter anderem `photovoltaik freilassing`, `solar freilassing`,
`photovoltaik bad reichenhall`, `photovoltaik kirchanschöring`, `photovoltaik traunstein`,
`photovoltaik surheim`, `photovoltaik marquartstein`, `photovoltaik waging am see` und
`photovoltaik schönau am königssee` erkennbar. Ortsseiten werden trotzdem nur bei mehreren
echten lokalen Projekten veröffentlicht.

## Unzuverlässige Signale

- Glücksspiel-, Togel-, Casino-, APK- und Forex-Queries.
- Fremdsprachige Produkt-/Automotive-Suchen ohne Energiebezug.
- `?pid=`/`?r=`-Seiten, Serverpfade, fremde Katalogpfade und manipulierte Kategorien.
- AI-Features-Länder-/Seitendaten nach Incident-Beginn.
- Alle pauschalen Conversion-Schlüsse aus GA4, da kein Key-Event erfasst wurde.
