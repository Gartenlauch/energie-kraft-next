# Sprint 13 – sonnen-Insolvenz und Serviceinformation

Stand: 22.10.2026. Lokal umgesetzt; kein Commit, Push oder Deployment.

## Seite und SEO

- Ziel-URL: `https://www.energie-kraft.de/sonnen-insolvenz`
- Title: `sonnen Insolvenz 2026: Speicher & Service | Energie-Kraft Süd`
- Description: `sonnen Insolvenz: Was für sonnenBatterie, Garantie, Ersatzteile und App bekannt ist. Energie-Kraft Süd bleibt mit eigener Serviceabteilung Ihr Ansprechpartner.`
- Canonical: Ziel-URL, über den vorhandenen Canonical-Helper.
- Eine H1: `sonnen Insolvenz 2026 – Was bedeutet das für Ihre sonnenBatterie?`
- Vier eigenständige H2 für technische Störungen, Ersatzteile/Software, Garantie/Gewährleistung und App/Monitoring/Wallbox; ergänzend Lage, eigener Service, Handlungsschritte, Unterstützung und Quellen.
- `Article` mit Datum 2026-10-22, Organisation als Autor/Herausgeber, Bild und Quellen; zusätzlich BreadcrumbList. Keine FAQPage-/QAPage-Auszeichnung und kein paralleler FAQ-Datenspeicher.
- Sitemap über PUBLIC_ROUTES; bestehender Indexierungsschalter bleibt wirksam. Lokal bleibt noindex erhalten; mit aktivierter bestehender Indexierungslogik keine zusätzliche Seitensperre.
- Service-CTAs verwenden ausschließlich `CONTACT_FORM_HREF` → `/kontakt#kontaktformular`. Der vorhandene Anker wurde im Kontaktseiten-Code geprüft. Keine Formular- oder Backendänderungen.

## Vier Teaser

Alle stehen nach dem Hero und dem vorhandenen dekorativen Markensignet, vor dem bisherigen Inhaltsbereich:

1. `/stromspeicher`: Hinweis für private sonnen-Bestandsanlagen.
2. `/gewerbespeicher`: technische Betreuung und Fragen zur Betriebssicherheit gewerblicher Bestandsanlagen.
3. `/service-und-wartung`: prominenter Hinweis mit sonnen-Foto und den Aktionen „Service anfragen“ und „Aktuelle Informationen“.
4. `/`: dezente Informationsleiste „Aktuelle Information zur sonnen-Insolvenz“.

Die vorhandenen Seitentemplates erhalten dafür lediglich einen optionalen afterHero-Slot beziehungsweise reichen den vorhandenen Slot weiter. Auf der Wallboxseite wurden ausschließlich die datierte App-Ankündigung und die pauschale Empfehlung als aktuell verfügbare sonnen-Lösung durch eine Prüfung von Lieferbarkeit, Freigabe und Softwarestand ersetzt.

## Bild

Auf ausdrücklichen Folgewunsch wird ein echtes sonnen-Herstellermotiv verwendet. Das zuvor generierte generische Motiv wurde nicht in das Repository übernommen.

- Herstellerseite: https://www.sonnen.de/stromspeicher/sonnenbatterie-10-performance
- Original: https://cdn.prod.website-files.com/682c3fa25ad959798a619e74/682c3fa25ad959798a61a31e_1222c5c78e2d56d3b33cd8fa50fc39a9_sB10p_inhome.avif
- Originalabmessungen: 5525 × 3685 px; am 22.10.2026 heruntergeladen und visuell geprüft.
- `public/images/sonnen-service/sonnenbatterie-service-hero.webp`: 1920 × 1080 px, 89.486 Bytes, WebP Qualität 82, 16:9-Mittenzuschnitt.
- `public/images/sonnen-service/sonnenbatterie-service-mobile.webp`: 960 × 1200 px, 37.932 Bytes, WebP Qualität 82; Originalausschnitt x=2100/y=300, 2640 × 3300 px. Speicher vollständig sichtbar; Zuschnitt visuell geprüft.
- Alt: „sonnenBatterie 10 performance in einem hellen Hausflur mit Holzfußboden“.
- Hero über vorhandene ArtDirectedImage-Komponente mit picture-Quellen, festen Seitenverhältnissen und hoher Ladepriorität. Service-Teaser über next/image; Wiederverwendung desselben Motivs.
- Sichtbare Quellenangabe „Bild: sonnen“, Herstellerabbildung ausdrücklich als kein Energie-Kraft-Referenzprojekt bezeichnet. Eine gesonderte Nutzungslizenz wurde nicht nachgewiesen; Nutzungsberechtigung für das Herstellerfoto bleibt durch den Auftraggeber zu klären.

## Fakten und Unsicherheiten

Die Insolvenzmeldung und die geplante Bestandskundenbetreuung wurden anhand des [Berichts von pv magazine Global vom 22.10.2026](https://www.pv-magazine.com/2026/10/22/sonnen-files-for-insolvency/) überprüft. Dieser beruft sich auf Handelsblatt. Die drei im Auftrag genannten konkreten Artikel-URLs waren über das Recherchewerkzeug nicht direkt abrufbar; sie werden daher nicht als selbst gelesene Belege ausgegeben.

Für die Abgrenzung von Garantie und Gewährleistung wurde die [Information des Bundesjustizministeriums](https://www.bmj.de/DE/themen/kaufen_reisen_wohnen/onlinekauf/onlinekauf_artikel.html) verwendet; ergänzend die [sonnen-Kontaktseite](https://sonnen.de/kontakt/) für Hersteller-Servicewege. Die unternehmenseigenen Aussagen „mehr als zehn Jahre Erfahrung“ und „eigene Serviceabteilung bleibt bestehen“ stammen ausdrücklich aus dem Auftrag.

Offen bleiben langfristige Teileversorgung, Softwareunterstützung und tatsächliche Erfüllung von Herstellergarantien. Die Seite verspricht hierzu weder Verfügbarkeit noch Garantieübernahme. Individuelle Rechtsansprüche und technische Machbarkeit werden nicht pauschal beurteilt.

## Tatsächlich durchgeführte Prüfungen

- `npm run typecheck`: erfolgreich.
- ESLint für die geänderten TypeScript-/TSX-Dateien und beide betroffenen Testdateien: erfolgreich.
- `npx vitest run --config vitest.config.mjs tests/unit/sonnen-insolvenz.test.ts tests/unit/wallbox-page-content.test.ts tests/unit/search-indexing.test.ts`: 3 Dateien, 40 Tests erfolgreich. Bestehende Sitemap-Erwartung um eine Route erhöht.
- `git diff --check`: erfolgreich.
- Lokaler HTTP-Render: `/sonnen-insolvenz`, `/gewerbespeicher`, `/service-und-wartung` jeweils 200; jeweils eine H1. Landingpage-Title, Canonical, H2-Struktur und picture-Markup direkt im HTTP-HTML geprüft.
- Beide finalen Bild-URLs: HTTP 200; Abmessungen und Dateigrößen geprüft. Desktop-/Mobil-Bildmotiv visuell geprüft.
- Alle vier Hinweisvarianten separat serverseitig gerendert; Landingpage-Verlinkung und beide Service-Aktionen durch Tests geprüft.
- Vollständiger HTTP-Render von Startseite, Stromspeicher und Kontakt lokal blockiert: bestehende FAQ-Abfragen erreichen den nicht laufenden Firestore-Emulator auf 127.0.0.1:8080 nicht. Kontaktformularziel deshalb im Quellcode statt im Browser geprüft. Keine Produktionsdaten abgefragt, keine Infrastruktur verändert, kein Daten-Fallback eingebaut.
- Kein verfügbarer Browser im Browserwerkzeug. Visuelle Desktop-/Mobile-Abnahme, Interaktion und tatsächliches Overflow-Verhalten bleiben manuell zu prüfen. Keine pauschale visuelle Freigabe.
- Kein Build, keine vollständige Testsuite, keine Mailtests und keine Änderungen an Analytics, Consent, Functions oder Konfiguratoren.

## Exakte Dateiliste für Commit und Push

Nur diese 16 Dateien gehören zu dieser Umsetzung. Vorhandene fremde unversionierte Artefakte bleiben unangetastet.

```text
docs/sprint13-sonnen-insolvenz.md
public/images/sonnen-service/sonnenbatterie-service-hero.webp
public/images/sonnen-service/sonnenbatterie-service-mobile.webp
src/app/(site)/_components/public-content-page.tsx
src/app/(site)/_components/sprint8-content-page.tsx
src/app/(site)/gewerbespeicher/page.tsx
src/app/(site)/page.tsx
src/app/(site)/service-und-wartung/page.tsx
src/app/(site)/sonnen-insolvenz/page.tsx
src/app/(site)/stromspeicher/page.tsx
src/components/marketing/sonnen-service-notice.tsx
src/config/routes.ts
src/content/sonnen-insolvenz.ts
src/content/wallbox-products.ts
tests/unit/search-indexing.test.ts
tests/unit/sonnen-insolvenz.test.ts
```
