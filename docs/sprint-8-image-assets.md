# Sprint 8 – Bildassets

Alle finalen Sprint-8-Assets sind lokale WebP-Derivate. Die Rohdateien unter `design-input/`
bleiben unverändert und sind keine produktive Abhängigkeit. Die Reproduktion erfolgt mit
`scripts/process-sprint8-assets.mjs` über das bereits verfügbare Paket `sharp`.

## Unternehmens- und Servicebild

| Finaler Pfad                                     | Zweck                                                     | Quelle                                                                 | Größe / Ratio            | Alt-Text                                                               | Status                                     |
| ------------------------------------------------ | --------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------ | ---------------------------------------------------------------------- | ------------------------------------------ |
| `/images/team/company-service-hero-desktop.webp` | Desktop-Hero für Unternehmen, Service, Jobs und Bewerbung | `design-input/reference-originals/Ainring/Service-Team_Header2025.jpg` | 1800 × 1039 · ca. 1,73:1 | Mitarbeiter von Energie-Kraft Süd auf einem Dach vor dem Alpenpanorama | final, reale Aufnahme, technisch optimiert |
| `/images/team/company-service-hero-mobile.webp`  | mobiler 4:5-Hero derselben Seiten                         | gleiche Quelle, datenschutzneutraler Crop                              | 1080 × 1350 · 4:5        | wie Desktop, ohne Namensnennung                                        | final, reale Aufnahme, technisch optimiert |

Die Aufnahme wird nicht als Einzelporträt oder Beleg für eine namentlich identifizierte Person
verwendet. Es wurden keine KI-Personen erzeugt und keine Person synthetisch verändert.

## Referenzprojekte

Finales Verzeichnis: `/images/references/projects/`. Quelle sind ausschließlich die zugehörigen
JPEGs in `design-input/reference-originals/`. Alle 32 Dateien sind final und werden zentral in
`src/content/reference-projects.ts` einem Ort, Nutzungstyp und sachlichen Alt-Text zugeordnet.

| Ort / finale Dateinamen                     | Anzahl | Größe / Ratio                 | Zweck und Alt-Text-Policy                                           | Status |
| ------------------------------------------- | -----: | ----------------------------- | ------------------------------------------------------------------- | ------ |
| `ainring-{gewerbe\|privat}-*.webp`          |      4 | 1200 × 800 · 3:2              | private/gewerbliche Projektansichten in Ainring; Gebäudeart und Ort | final  |
| `bad-reichenhall-privat-*.webp`             |      4 | 1200 × 800 · 3:2              | private Projektansichten in Bad Reichenhall                         | final  |
| `berchtesgaden-privat-*.webp`               |      4 | 1200 × 800 · 3:2              | private Projektansichten in Berchtesgaden                           | final  |
| `freilassing-{gewerbe\|privat}-*.webp`      |      9 | 1200 × 800 · 3:2              | private und gewerbliche Projektansichten in Freilassing             | final  |
| `kirchanschoering-{gewerbe\|privat}-*.webp` |      3 | 1200/1201 × 800/801 · ca. 3:2 | private und gewerbliche Projektansichten in Kirchanschöring         | final  |
| `laufen-{gewerbe\|privat}-*.webp`           |      3 | 1200 × 800 · 3:2              | private und gewerbliche Projektansichten in Laufen                  | final  |
| `saaldorf-surheim-{gewerbe\|privat}-*.webp` |      5 | 1200 × 800 · 3:2              | private und gewerbliche Projektansichten in Saaldorf-Surheim        | final  |

Dateigrößen liegen nach Optimierung zwischen rund 97 und 313 KiB. Die finalen Dateinamen sind
ebenfalls neutral: Kundennamen aus historischen Dateinamen werden weder dort noch im Datenmodell,
in sichtbarer Beschriftung oder im Alt-Text publiziert.
In Dateinamen erkennbare Leistungswerte wurden nicht als Inhaltsdaten übernommen, weil die
fachliche Zuordnung nicht zusätzlich bestätigt ist. Die Website hotlinkt keine Medien von
`www.energie-kraft.de` oder `dev.energie-kraft.de`.
