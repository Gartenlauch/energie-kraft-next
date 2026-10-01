# Sprint 10: Signet und Partner-Carousel

> Historischer Stand vor der Routing-Migration in Sprint 10: Die hier genannten alten Energielösungen-URLs sind keine aktiven Ziele mehr. Aktuelle Zuordnung und Prüfung: [Routing-Cleanup](sprint10-energy-solutions-routing-cleanup.md).

## Umsetzung

`BrandIntro` akzeptiert `variant?: "white" | "brand"`, Standard `brand`.
Beide Varianten verwenden ausschließlich das vorhandene Asset
`/brand/energie-kraft/energie-kraft-supersign.svg`. Auch
`eksued-signet-website.svg` wurde geprüft; ein weiteres Farbasset ist unnötig.
Nur `.brand-intro--white` erhält `brightness(0) invert(1)`.
`aria-hidden="true"` und der leere Bild-Alternativtext bleiben bestehen.

`PublicContentPage`, `MarketingFeaturePage` und `Sprint8ContentPage` unterstützen
`brandIntroVariant?: BrandIntroVariant | false`, Standard `false`.
Die einzelnen Navigationsseiten aktivieren das Signet ausdrücklich. Individuelle
Seiten integrieren dieselbe Komponente direkt nach ihrem Hero beziehungsweise
Heading. Kontakt integriert sie vor dem bestehenden Formular. Keine Änderung
an Formularlogik, Content, SEO, Navigation, Partnerdaten oder Section-Reihenfolge.

Der Wrapper behält `height: 0`, die Marke `translate: 0 -50%` und
`width: clamp(6rem, 10vw, 9.5rem)`. Die Scale-/Fade-Animation läuft jetzt
**920 ms statt 760 ms**, mit unverändertem
`cubic-bezier(0.22, 1, 0.36, 1)`. Reduced Motion deaktiviert die Animation.

## Aktivierte Seiten

Quelle: aktuelle Links in `src/components/layout/site-header.tsx`.

| Route                                              | Variante | Unmittelbare Folgefläche |
| -------------------------------------------------- | -------- | ------------------------ |
| `/`                                                | white    | Brand-Blau               |
| `/photovoltaik`                                    | brand    | Soft                     |
| `/stromspeicher`                                   | brand    | Soft                     |
| `/energieloesungen/photovoltaik-fuer-unternehmen`  | brand    | Soft                     |
| `/energieloesungen/gewerbespeicher`                | brand    | Soft                     |
| `/waermepumpen`                                    | brand    | Soft                     |
| `/klimaanlagen`                                    | brand    | Soft                     |
| `/wallbox`                                         | brand    | Soft                     |
| `/energieloesungen/stromtarife-pv`                 | brand    | Soft                     |
| `/service-und-wartung`                             | brand    | Soft                     |
| `/service-und-wartung/service-und-team`            | brand    | Weiß                     |
| `/service-und-wartung/wartung-und-reinigung`       | brand    | Soft                     |
| `/service-und-wartung/finanzierung-und-foerderung` | brand    | Soft                     |
| `/ueber-uns`                                       | brand    | Soft                     |
| `/referenzen`                                      | brand    | Weiß                     |
| `/jobs`                                            | brand    | Soft                     |
| `/kontakt`                                         | brand    | Soft/Formular            |

Der Konfigurator-CTA im Header bleibt ausdrücklich ohne Signet. Andere
Rechner-, Konfigurator-, Bewerbungs-, Admin-, Rechts- und Unterseiten werden
durch den Standard `false` nicht pauschal aktiviert.

## Partner-Carousel

Die alte Konfiguration war `delay: 6500`, `playOnInit: false`,
`stopOnInteraction: false`, `stopOnFocusIn: false`. Zusätzlich stoppte die
eigene Synchronisierung bei `section:hover` und `section:focus-within`.
Ein über der großen Section stehender Mauszeiger oder der nach Pfeilklick
verbleibende Buttonfokus blockierte deshalb den Neustart. Die Plugininstanz
wurde außerdem bei jedem React-Render erneut erstellt.

Die neue Plugininstanz wird einmal durch einen lazy `useState`-Initializer
erzeugt und über Re-Renders beibehalten:

- `delay: 2000`, `playOnInit: true`
- `stopOnInteraction: false`, `stopOnFocusIn: false`, `stopOnMouseEnter: false`
- Reduced-Motion-Breakpoint: `active: false`
- Embla: `loop: true`, `slidesToScroll: 1`, `align: "start"`

Die Pause-Policy berücksichtigt ausschließlich explizite Pause, Reduced Motion,
`document.hidden`, fehlende Viewport-Sichtbarkeit und aktives Dragging.
Hover und normaler Fokus blockieren nicht mehr. Pfeile und Tastatur bewegen
jeweils einen Schritt und rufen `autoplay.reset()` auf. Beim nächsten Start
beginnt ein neuer Zwei-Sekunden-Countdown. Embla ist die einzige Timing-Quelle;
kein eigener Intervalltimer. Cleanup entfernt Listener/Observer und stoppt das
Plugin. `reInit` und Plugin-Neustarts synchronisieren die Pause-Policy erneut.

## Prüfverfahren

Echter lokaler Headless-Chrome über Chrome DevTools Protocol, Produktionsbuild
auf `127.0.0.1:3000`, vorhandene lokale Firestore-Demo-Emulatordaten.
Keine Produktionsdatenabfrage, Formularübermittlung oder Mail.
Der erste Versuch ohne laufenden FAQ-Emulator zeigte die bestehende
Fehlerseite; danach wurde der Emulator gestartet und die QA wiederholt.

Reproduzierbar mit `node scripts/sprint10-signet-partner-browser.mjs`.
`--screenshots` erstellt gezielt die Signet-Bilder nach Ende der bestehenden
Content-Einblendungen; `--carousel` prüft gezielt das Carousel inklusive
Pointer-Hold/Release. Der normale Lauf prüft alle 17 Seiten bei **1440, 1920,
390, 375 und 1024 px**.

Die Browserprüfung misst Existenz/Anzahl, Variante, Filter, Animationsdauer,
Höhe 0, den Mittelpunkt auf der Section-Grenze, den anschließenden Content ohne
Zusatzabstand, Bildladen und Text-/Button-Kollisionen sowie horizontalen Overflow.
Die acht angeforderten Desktop-Übergänge und der mobile PV-Übergang werden
zusätzlich als Screenshots geprüft. Das Carousel wird vollständig sichtbar
gescrollt. Seine tatsächlichen gerenderten Logo-Positionen werden ausgewertet,
ohne Embla zu mocken oder einen Testtimer einzubauen.

Die vorhandenen Unit-Tests laufen in einer Node-Umgebung ohne DOM-Testbibliothek.
Statt fragile Embla-Mocks oder Quelltext-Stringtests einzuführen, erfolgt der
neue Verhaltensnachweis direkt im Browser.

## Artefakte

Unter `artifacts/sprint10-signet-partner-qa/`:

- `homepage-signet-1440.png`
- `photovoltaik-signet-1440.png`
- `business-pv-signet-1440.png`
- `service-signet-1440.png`
- `about-signet-1440.png`
- `references-signet-1440.png`
- `jobs-signet-1440.png`
- `kontakt-signet-1440.png`
- `signet-mobile-390.png`
- `partner-autoplay-t0.png`, `partner-autoplay-t2.png`, `partner-autoplay-t4.png`, `partner-autoplay-t6.png`
- `browser-results.json`, `screenshots-results.json`, `carousel-results.json`

## Tatsächliche Browserergebnisse

Alle **85 Kombinationen aus 17 Seiten und fünf Viewports** bestanden die
Signet-Prüfung. Die Screenshot-Nachaufnahme ist ebenfalls grün. Die Desktop-
Screenshots und der mobile PV-Screenshot wurden zusätzlich visuell angesehen:
Marke zentriert auf der Grenze, passender Kontrast, unverzerrt und ohne
Überdeckung wichtiger Inhalte.

Der abschließende gezielte Carousel-Lauf bestand mit Exit 0:

| Beobachtung | Zeit ab t0 | Sichtbarer Slide (Index ab 0) | Logo am linken Rand |
| --- | --- | --- | --- |
| t0 | 0 ms | 4 | K2 Systems |
| t2 | 2206 ms | 5 | Schletter |
| t4 | 4304 ms | 6 | IBC Solar |
| t6 | 6408 ms | 7 | KACO new energy |

Jede Messung zeigte genau einen zusätzlichen Schritt. Die Screenshots t0/t2/t4/t6
stammen aus diesem erfolgreichen Lauf. Ebenfalls bestanden:

- Hover über der Partner-Section: weiterer automatischer Wechsel.
- Next und Prev: manuelle Navigation und anschließender automatischer Wechsel.
- Countdown nach Next: kein weiterer Wechsel nach insgesamt 1,2 Sekunden,
  weiterer Wechsel bei insgesamt 2,5 Sekunden.
- Explizite Pause: nach dem Auslaufen der Scrollanimation 4,5 Sekunden unverändert.
- Resume: weiterer automatischer Schritt nach 2,5 Sekunden.
- Komplett außerhalb des Viewports: kein Wechsel; nach Rückkehr weiterer Schritt.
- Pointer-Hold: pausiert; Pointer-Release: automatischer Neustart.
- Reduced Motion: 4,5 Sekunden kein Wechsel und Signet-Animation `none`.
- Zurück zu normaler Bewegung: automatischer Neustart.
- Keine Browser-Runtime-Exceptions.

Die erste Zeitmessung des Gesamtlaufs begann während Lazy-Loading und Smooth-
Scrolling. Sie erfasste bereits automatische Wechsel, lag für die erste
Stichprobe aber vor dem abgeschlossenen Slidewechsel. Auch der erste
Rückkehrtest begann vor Ende des Smooth-Scrolls. Der QA-Helfer wartet deshalb
jetzt auf geladene Logos und verwendet für die Messpositionen sofortigen Scroll.
Das Verhalten der Website wurde dafür nicht geändert.
`browser-results.json` bewahrt den vollständigen Signet-Lauf und die erste
Carousel-Messung einschließlich dieser Testassertion; `carousel-results.json`
enthält den erfolgreichen abschließenden Verhaltensnachweis.
`acceptance-results.json` fasst beide erfolgreichen Prüfbereiche zusammen.

Die Hidden-Tab-Pause ist durch die bestehende Embla-Visibility-Steuerung und
die zusätzliche `document.hidden`-Policy implementiert; ein echter Tabwechsel
wurde in dieser Headless-QA nicht separat simuliert. Keine offenen
Implementierungspunkte in den beiden angeforderten Themen.

## Geänderte und neue Dateien

Geändert: `src/components/marketing/brand-intro.tsx`,
`src/components/marketing/partner-logo-carousel.tsx`, `src/app/globals.css`,
die drei Wrapper unter `src/app/(site)/_components/` und jeweils `page.tsx`
der 17 oben aufgeführten Routen. Insgesamt 23 bestehende Quelldateien.

Neu: dieses Dokument, `scripts/sprint10-signet-partner-browser.mjs` und der
QA-Artefaktordner. Der abschließende Git-Status enthält diese Änderungen und
weiterhin die vier bereits vorhandenen untracked Homepage-Artefaktordner.

## Codeprüfungen

`npm run check:all`: erfolgreich, Exit 0. Lint, Typecheck, 64 Unit-Testdateien
mit 479 Tests, Functions-Lint/-Build, 30 lokale Rules-Tests und Produktionsbuild
grün. `git diff --check`: erfolgreich. Git weist lediglich auf seine bestehende
LF/CRLF-Konvertierung hin.

Bestehende vier Homepage-QA-/Polish-Artefaktordner bleiben erhalten. Der
Sicherungsbranch wird nicht verändert. Kein Commit, Push oder Deployment.
