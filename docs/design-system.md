# Energie-Kraft Süd – Designsystem

Stand: Sprint 7

## Grundprinzipien

Das visuelle System verbindet regionale Nähe mit technischer Präzision. Große Bildflächen,
ruhige Flächen, klare Typografie und wenige gezielte Interaktionen haben Vorrang vor dekorativer
UI. Inhalte und Funktionen bleiben auch ohne Animation vollständig verständlich.

## Farben

| Semantischer Token      | Wert      | Verwendung                                           |
| ----------------------- | --------- | ---------------------------------------------------- |
| `--brand-primary`       | `#005CA9` | primäre Aktionen, Links, aktive Zustände             |
| `--brand-accent`        | `#0DA1D1` | dekorative Linien und großflächige Akzente           |
| `--brand-accent-strong` | `#007FA8` | Fokus, kleiner Text und Cyan-nahe UI mit AA-Kontrast |
| `--brand-dark`          | `#182E4C` | sekundäre dunkle Texte und Flächen                   |
| `--brand-navy`          | `#091433` | Headlines, kleine Akzente und lokale Bild-Scrims     |
| `--surface-soft`        | `#E9EDF8` | größere ruhige Hintergrundflächen                    |
| `--background`          | `#FFFFFE` | primärer Seitenhintergrund                           |
| Weiß                    | `#FFFFFF` | Karten und Text auf dunklen Flächen                  |
| Schwarz                 | `#000000` | nur wenn technisch erforderlich                      |

`#0DA1D1` bleibt eine dekorative Akzentfarbe und wird nicht als kleiner Text auf Weiß verwendet.
Zusätzliche semantische Farben wie Border, muted Text und Statusfarben sind in
`src/app/globals.css` zentral abgeleitet. Produktbereiche erhalten keine eigenen, beliebigen
Farbfamilien.

### Geprüfte Kontrastkombinationen

| Vordergrund / Hintergrund | Kontrast | Einsatz                                  |
| ------------------------- | -------: | ---------------------------------------- |
| `#005CA9` / `#FFFFFF`     |   6,77:1 | Links und Primary UI                     |
| `#007FA8` / `#FFFFFF`     |   4,56:1 | Focus und dunkles Cyan                   |
| `#182E4C` / `#FFFFFF`     |  13,69:1 | dunkler Text                             |
| `#091433` / `#FFFFFF`     |  18,11:1 | Navy und Weiß                            |
| `#526178` / `#FFFFFE`     |   6,28:1 | Muted Text                               |
| `#687487` / `#FFFFFE`     |   4,73:1 | Subtle Text                              |
| Weiß / `#005CA9`          |   6,77:1 | Footer und Textbereich der Brand-Flächen |

Der helle Akzent `#0DA1D1` erreicht auf Weiß nur 2,98:1 und ist dort auf dekorative Linien und
großflächige Elemente ohne Information beschränkt.

## Typografie

Montserrat ist die einzige Website-Schrift. Sie wird lokal über `next/font/local` mit den
Schnitten Regular 400, SemiBold 600 und Bold 700 ausgeliefert.

- Premium-Hero-H1: `clamp(2rem, 4.3vw, 4.5rem)`, Line-height 1.02
- Seiten-H1: `clamp(2.35rem, 4.5vw, 4.65rem)`, Line-height 1.04
- Section-H2: `clamp(2rem, 3.5vw, 3.65rem)`, Line-height 1.08
- Lead: `clamp(1.05rem, 1.5vw, 1.25rem)`, Line-height 1.75
- Fließtext: 1rem bis 1.0625rem, Line-height 1.6 bis 1.8
- Eyebrow: 0.75rem, Bold, Tracking 0.16em, uppercase

Headlines werden über begrenzte Zeichenbreiten und `text-wrap: balance` geführt. Sehr große
historische Brizy-Schriftgrößen werden nicht übernommen.

## Container und Abstände

- Hauptcontainer: maximal 80rem
- Schmaler Textcontainer: maximal 48rem
- Mobile Seitenrand: 1rem
- Ab 768px Seitenrand: 1.5rem
- Section-Abstand: `clamp(4.5rem, 8vw, 8rem)`
- Sticky Header: Hauptzeile 4.75rem; Desktop zusätzlich schmale Kontaktzeile

Die Homepage wechselt zwischen Full-bleed-Hero, blauem Marken-Intro, Bild-Splits, Brand-Fläche und
ruhigen Informationsbereichen. Split-Proportionen sind 50/50 und ab großen Viewports 45/55,
jeweils spiegelbar.
Auf Desktop stehen Bild und Text in einer gemeinsamen Grid-Zeile; Bild und Reveal-Wrapper
füllen deren Höhe. Mobil erhält das Bild eine eigene Fläche und der Text seine natürliche Höhe.

Der originale Gradient nutzt 230 Grad mit Cyan `#0DA1D1` bei 18 % und Primary Blue `#005CA9`
bei 82 %. Eine zusätzliche blaue Textebene hält den gesamten Contentbereich kontraststark;
der helle Cyan-Auslauf bleibt im äußeren, textfreien Rand. Der Footer verwendet Weiß/Off-White
mit Primary-Blue-Links und Dark-Blue-Text.

Editorial-Seiten wechseln breite Statements, echte Bild-Splits und offene Textspalten.
CTA-Links werden einmal im DOM ausgegeben, unabhängig vom Breakpoint.

## Radien und Schatten

- Klein: 0.5rem
- Controls/Buttons: 0.5rem
- Karten: 0.75rem
- Gerahmte Bildflächen: 1rem
- Schatten werden nur für Hierarchie und schwebende Navigation verwendet; keine Glasmorphism-
  oder Neon-Effekte.

## Buttons und Links

- `.button-primary`: Primary Blue, weiße Schrift, mindestens 52px hoch
- `.button-secondary`: helle Fläche, sichtbare Kontur, Navy-Schrift
- `.button-light`: weiße Aktion auf dunkler CI-Fläche
- Primäre und sekundäre Aktionen dürfen nebeneinander stehen, bleiben mobil aber voll touchbar.
- Textlinks erhalten klare Hover-/Focus-Zustände und nach Möglichkeit einen Richtungspfeil.

## Karten

`.premium-card` verwendet eine feine Border, einen ruhigen weißen Hintergrund und einen
zurückhaltenden Schatten. Karten werden nur für echte funktionale oder inhaltliche Gruppen
eingesetzt. Lange Inhaltsseiten verwenden überwiegend offene Spalten und Listen statt Card-Raster.

## Formulare

- Mindesthöhe für Textfelder: 52px, im Konfigurator teils 56px
- Vollständige Breitenbegrenzung durch `min-width: 0` und `max-width: 100%`
- Sichtbarer Cyan-Fokusring mit zusätzlichem Border-Wechsel
- Fehlerzustände bleiben semantisch mit `aria-invalid`, Fehlermeldung und rotem Status erhalten
- Checkboxen, Radioauswahl und Selection Cards haben große Touch-Ziele

## Bilder

- Eigene lokale WebP-Assets; keine Hotlinks
- Responsive Art Direction mit unterschiedlichen Desktop-/Mobile-Crops über Next.js
  `getImageProps()` und `<picture>`
- LCP-Hero mit hoher Fetch-Priorität; nachgelagerte Bilder werden lazy geladen
- Große Bilder nutzen ruhige, glaubwürdige Architektur- und Beratungssituationen
- Keine Logos oder Layouttexte innerhalb generierter Fotos
- Alt-Texte beschreiben den tatsächlichen Bildinhalt, rein dekorative CI-Signets bleiben leer

Alle Asset-Spezifikationen stehen in [sprint-7-image-assets.md](./sprint-7-image-assets.md).

## Motion

- Text-Reveal: 16px vertikal, 720ms
- Bild-Reveal: 56px von der jeweiligen Bildseite, 720ms
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- Viewport-Reveals laufen nur einmal und verändern keine Layoutmaße.
- Das Signet steht mittig auf der Grenze von Hero und erster Inhaltssection. Es bleibt sichtbar.
  Bei jedem Laden/Betreten: CSS-Reveal mit 760ms Opacity/Scale von 0,8 auf 1, ohne Session-Sperre,
  Overlay oder Layout Shift. Reduced Motion zeigt sofort den Endzustand.
- Bei `prefers-reduced-motion: reduce` stehen Signet und Inhalte sofort im Endzustand;
  Translationen, Smooth Scrolling und Carousel-Automatik sind deaktiviert.

## Partnerlogos

- Originaldateien aus `public/brand/partners/`
- Keine nachgezeichneten oder generierten Markenlogos
- Fünf große Logos auf Desktop; kompakte und horizontale Marken erhalten unterschiedliche Höhenlimits
- Embla Carousel React und Autoplay 8.6.0 übernehmen Loop, Drag/Swipe und den 6500-ms-Takt
- Pfeiltasten funktionieren, sobald der Carousel-Viewport fokussiert ist
- Langsamer Wechsel alle 6,5 Sekunden, nur im sichtbaren Bereich und aktiven Browser-Tab
- Pause bei Hover/Fokus; nach Touch und Viewport-Wiedereintritt wird automatisch fortgesetzt
- Nur die ausdrückliche Pause-Taste setzt eine dauerhafte Pause
- Separate Pause-/Start-Taste; keine Live-Region und kein Autoplay bei Reduced Motion
- Keine native Scrollbar; manuelle Buttons, Touch/Drag und Pfeiltasten bleiben nutzbar

## Responsive und Accessibility

- Desktop-Mega-Menüs werden unterhalb 1280px durch ein eigenständiges Touch-Accordion ersetzt.
- Touch-Ziele sind mindestens 44px, primäre Controls in der Regel 48–56px hoch.
- Navigation unterstützt Tastatur, `Escape`, `aria-expanded` und `aria-controls`.
- Ein Skip-Link führt zum Hauptinhalt.
- `prefers-reduced-motion` deaktiviert Scroll- und Bewegungsanimationen.
- Fokus ist niemals ausschließlich über Farbe erkennbar.
- Bilder behalten ein festes Seitenverhältnis und verursachen keinen Layout Shift.
