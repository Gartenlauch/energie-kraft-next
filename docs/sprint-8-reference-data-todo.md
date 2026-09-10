# Sprint 8.1 – Referenzdaten vor Go-Live

Stand: 9. September 2026. Alle Bilder sind reale Legacy-Projektaufnahmen. Die in den
Quelldateinamen erkennbaren Leistungswerte wurden als Arbeitswerte übernommen; der Speicherstatus
ist ein plausibler temporärer Wert. Da nicht beide Angaben fachlich bestätigt sind, ist jedes
Projekt im Code mit `dataStatus: "placeholder"` markiert.

**MUST_VERIFY_BEFORE_GO_LIVE:** Anlagenleistung und Speicherstatus jedes Projekts durch die
Fachabteilung bestätigen. Erst danach darf `dataStatus` auf `verified` gesetzt werden.

| Ort | Bild | kWp | kWp bestätigt? | Speicherstatus | bestätigt? | Platzhalter? | Fehlende echte Daten |
| --- | --- | ---: | --- | --- | --- | --- | --- |
| Ainring | `ainring-gewerbe-01.webp` | 424,5 | nein | ohne Speicher | nein | ja | kWp, Speicher |
| Ainring | `ainring-privat-01.webp` | 19,24 | nein | mit Speicher | nein | ja | kWp, Speicher |
| Ainring | `ainring-privat-02.webp` | 7 | nein | ohne Speicher | nein | ja | kWp, Speicher |
| Ainring | `ainring-privat-03.webp` | 9,72 | nein | mit Speicher | nein | ja | kWp, Speicher |
| Bad Reichenhall | `bad-reichenhall-privat-01.webp` | 24,36 | nein | mit Speicher | nein | ja | kWp, Speicher |
| Bad Reichenhall | `bad-reichenhall-privat-02.webp` | 8,28 | nein | ohne Speicher | nein | ja | kWp, Speicher |
| Bad Reichenhall | `bad-reichenhall-privat-03.webp` | 12,75 | nein | mit Speicher | nein | ja | kWp, Speicher |
| Bad Reichenhall | `bad-reichenhall-privat-04.webp` | 13,485 | nein | mit Speicher | nein | ja | kWp, Speicher |
| Berchtesgaden | `berchtesgaden-privat-01.webp` | 18,75 | nein | mit Speicher | nein | ja | kWp, Speicher |
| Berchtesgaden | `berchtesgaden-privat-02.webp` | 19,74 | nein | mit Speicher | nein | ja | kWp, Speicher |
| Berchtesgaden | `berchtesgaden-privat-03.webp` | 43 | nein | ohne Speicher | nein | ja | kWp, Speicher |
| Berchtesgaden | `berchtesgaden-privat-04.webp` | 7 | nein | mit Speicher | nein | ja | kWp, Speicher |
| Freilassing | `freilassing-gewerbe-01.webp` | 24,3 | nein | ohne Speicher | nein | ja | kWp, Speicher |
| Freilassing | `freilassing-gewerbe-02.webp` | 99,75 | nein | mit Speicher | nein | ja | kWp, Speicher |
| Freilassing | `freilassing-gewerbe-03.webp` | 29,64 | nein | ohne Speicher | nein | ja | kWp, Speicher |
| Freilassing | `freilassing-privat-01.webp` | 10 | nein | mit Speicher | nein | ja | kWp, Speicher |
| Freilassing | `freilassing-privat-02.webp` | 11 | nein | mit Speicher | nein | ja | kWp, Speicher |
| Freilassing | `freilassing-privat-03.webp` | 15,3 | nein | mit Speicher | nein | ja | kWp, Speicher |
| Freilassing | `freilassing-privat-04.webp` | 18 | nein | ohne Speicher | nein | ja | kWp, Speicher |
| Freilassing | `freilassing-privat-05.webp` | 6 | nein | ohne Speicher | nein | ja | kWp, Speicher |
| Freilassing | `freilassing-privat-06.webp` | 7,56 | nein | mit Speicher | nein | ja | kWp, Speicher |
| Kirchanschöring | `kirchanschoering-gewerbe-01.webp` | 54,375 | nein | ohne Speicher | nein | ja | kWp, Speicher |
| Kirchanschöring | `kirchanschoering-gewerbe-02.webp` | 60,03 | nein | mit Speicher | nein | ja | kWp, Speicher |
| Kirchanschöring | `kirchanschoering-privat-01.webp` | 10 | nein | mit Speicher | nein | ja | kWp, Speicher |
| Laufen | `laufen-gewerbe-01.webp` | 21,44 | nein | ohne Speicher | nein | ja | kWp, Speicher |
| Laufen | `laufen-privat-01.webp` | 10 | nein | mit Speicher | nein | ja | kWp, Speicher |
| Laufen | `laufen-privat-02.webp` | 21 | nein | mit Speicher | nein | ja | kWp, Speicher |
| Saaldorf-Surheim | `saaldorf-surheim-gewerbe-01.webp` | 300,15 | nein | mit Speicher | nein | ja | kWp, Speicher |
| Saaldorf-Surheim | `saaldorf-surheim-gewerbe-02.webp` | 99,66 | nein | ohne Speicher | nein | ja | kWp, Speicher |
| Saaldorf-Surheim | `saaldorf-surheim-privat-01.webp` | 10,2 | nein | mit Speicher | nein | ja | kWp, Speicher |
| Saaldorf-Surheim | `saaldorf-surheim-privat-02.webp` | 10 | nein | mit Speicher | nein | ja | kWp, Speicher |
| Saaldorf-Surheim | `saaldorf-surheim-privat-03.webp` | 9,24 | nein | ohne Speicher | nein | ja | kWp, Speicher |

## SEO-Schutz

Solange `dataStatus === "placeholder"` gilt, werden kWp und Speicherstatus nicht in Metadata,
Description, OpenGraph, JSON-LD, Schema.org oder redaktioneller SEO-Copy verwendet. Sie erscheinen
nur als sichtbare, ausdrücklich temporäre Projektmetadaten an den realen Bildern.
