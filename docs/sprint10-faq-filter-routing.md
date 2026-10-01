# Sprint 10 – FAQ-Routing und URL-Filter

Stand: 1. Oktober 2026. Keine Datenänderungen, kein Commit, Push oder Deployment.

## Ausgangsproblem und Architektur

Der FAQ-Explorer filterte nur über lokalen React-State und interne Kategorie-IDs.
Ein Link konnte daher keine Kategorie auf `/faq` vorauswählen. Parallel existierte
eine Kategorieübersicht unter `/faq/[category]` und eine Detailseite unter
`/faq/[category]/[slug]`.

Die Kategorieübersicht wurde entfernt. Die Detailroute und ihre kanonischen URLs
bleiben erhalten. Firestore bleibt die einzige Laufzeit-Datenquelle.

## Verifizierte Kategorien

Lesende Prüfung von `getPublicFaqCatalog`, `FAQ_PRODUCT_LINKS`, den vorhandenen
Tests und `scripts/emulators/faq-sprint83a-data.mjs`; anschließend Abfrage der
aktiven Kategorien und veröffentlichten FAQs im lokalen Emulator des Projekts
`demo-energie-kraft-next`. Der Emulator wurde mit dem bestehenden lokalen Snapshot
gestartet, ohne Seed-/FAQ-Import, Datenbearbeitung oder Snapshot-Export.

| category.name | category.slug | category.id | Veröffentlichte FAQs |
| --- | --- | --- | ---: |
| Photovoltaik | photovoltaik | photovoltaik | 45 |
| Stromspeicher | stromspeicher | stromspeicher | 40 |
| Wärmepumpe | waermepumpe | waermepumpe | 40 |
| Klimaanlage | klimaanlage | klimaanlage | 40 |
| Wallbox | wallbox | wallbox | 9 |

Alle erwarteten Slugs stimmen überein. Deshalb ist kein Alias-Mapping nötig.
Die Tests verwenden absichtlich abweichende Dokument-IDs, damit die Slug-basierte
Filterung unabhängig von dieser zufälligen Gleichheit abgesichert ist.

## URL-Struktur und Synchronisation

- Alle Themen: `/faq`
- Kategorie: `/faq?category=<slug>`
- Einzelne Frage: `/faq/<category>/<slug>`

`useSearchParams()` ist die Quelle des Kategorie-Filters. Der Select verwendet
Kategorie-Slugs; die Treffer werden anhand von `FaqCatalogEntry.categorySlug`
gefiltert. Ungültige, leere oder unbekannte Werte zeigen alle Themen, ohne 404
oder automatische Weiterleitung.

Select-Änderungen verwenden `router.push(..., { scroll: false })`. Die bewusste
Abweichung von der bevorzugten Replace-Variante ermöglicht die ausdrücklich
geforderten Zurück-/Vor-Schritte zwischen gewählten Kategorien. Grundlage:
[Next.js useRouter](https://nextjs.org/docs/app/api-reference/functions/use-router).
Der Filter wird nicht zusätzlich als lokaler State geführt.

Andere Query-Parameter bleiben bei Select-Änderungen erhalten. „Alle Themen“
entfernt `category` vollständig. Suchtext bleibt lokal und beim Kategorienwechsel
erhalten; die bestehende `matchesSearchTerms`-Logik sucht innerhalb der Kategorie.
Die Ergebnis-Komponente erhält einen Schlüssel aus Kategorie und Suchtext und
setzt damit ihre Pagination bei Änderungen, auch über die History, auf 12 zurück.
Suchfeld und Select bleiben dabei montiert und behalten ihre Bedienbarkeit.

## Links, Redirects und Detailseiten

EnergyFlow („Fragen zur Solarstromnutzung“), Themenlinks auf `/faq` und
PublicFaqSection verweisen auf den Query-Filter. Ohne `categorySlug` führt
PublicFaqSection weiterhin auf `/faq`; `categoryLabel` bestimmt nur den Linktext.
Kategorie-Breadcrumb und Zurücklink der Detailseite verwenden ebenfalls den Filter.

`next.config.ts` enthält genau den permanenten Redirect
`/faq/:category` → `/faq?category=:category` (HTTP 308). Es gibt keinen FAQ-Catch-All.
Die darunterliegende Detailroute wird nicht erfasst.

## SEO und strukturierte Daten

Alle Query-Zustände behalten Titel, Beschreibung und Canonical der Hauptseite
`/faq`. Filter sind keine zusätzlichen SEO-Landingpages. Die Sitemap enthält
die Hauptseite und Detailseiten, keine Kategorie-Redirects oder Query-Zustände.
Detail-Canonicals bleiben unverändert. Keine neuen FAQPage-/QAPage-Entitäten;
lediglich das Kategorie-Linkziel im vorhandenen Detail-Breadcrumb wurde angepasst.

## Verifikation

- `tests/unit/faq-filter-routing.test.ts`: zehn Tests für Direktfilter,
  ungültige Werte, Slugs statt IDs, Pagination, Linkziele, Detail-Canonicals,
  Redirect-Konfiguration und Sitemap.
- `scripts/sprint10-faq-filter-browser.mjs`: lokale Chromium-QA auf Port 3020,
  abgestimmt auf den oben dokumentierten Emulator-Snapshot. Prüft 1440, 1024,
  390 und 375 px; direkte Kategorieaufrufe, Trefferzahl, Suchkombination,
  Filterwechsel, Reset, Back/Forward, Pagination, Query-Erhalt, Fokus,
  Scrollposition, Überbreite, echte Homepage-/Produktlinks, HTTP-Status,
  Redirects und Detail-Canonical. Keine Formulare oder externen Schreibzugriffe.
- Ergebnisse und Screenshots: `artifacts/sprint10-faq-filter-routing/`.
- Browser-QA: alle vier Breiten bestanden, Screenshots zusätzlich visuell geprüft.
  HTTP 200 für `/faq`, alle fünf Direktfilter und den ungültigen Filter;
  HTTP 308 für die alten Photovoltaik-/Stromspeicher-Kategoriepfade.
  Detail-Regression geprüft an
  `/faq/photovoltaik/lohnt-sich-eine-photovoltaikanlage-2026`: HTTP 200,
  unveränderter Canonical und korrekter Kategorie-Zurücklink. Keine erfassten
  JavaScript-Ausnahmen. Bestehender Next.js-Entwicklungshinweis zu globalem
  Smooth-Scrolling; kein Sprung beim getesteten Select-Wechsel.
- `npm run check:all`: vollständig grün (Exit 0). ESLint, frisch generierte
  Routentypen und TypeScript, 75 Testdateien / 525 Tests, Functions-Lint/-Build,
  30 Rules-Tests im isolierten Emulator und Next.js-Produktionsbuild bestanden.
  Der Build enthält `/faq` und `/faq/[category]/[slug]`, keine Kategorieübersicht.
  Vollständiges Protokoll: `artifacts/sprint10-faq-filter-routing/check-all.log`.
- `git diff --check`: bestanden. Kein Patch an generierten Dateien.
- Ein vorheriger direkter `tsc --noEmit`-Aufruf traf noch auf veraltete generierte
  Typen für die gelöschte Route; das reguläre `next typegen` im Quality Gate hat
  diese erfolgreich neu erzeugt. Vitest/Chrome wurden wegen Sandbox-Prozessgrenzen
  außerhalb der Sandbox ausgeführt, weiterhin ausschließlich lokal.

## Dateien

Geändert: `next.config.ts`, `src/app/sitemap.ts`,
`src/app/(site)/faq/page.tsx`, `src/app/(site)/faq/[category]/[slug]/page.tsx`,
`src/components/faq/faq-explorer.tsx`, `src/components/faq/public-faq-section.tsx`
und `src/components/marketing/energy-flow.tsx`.

Gelöscht: `src/app/(site)/faq/[category]/page.tsx`.

Neu: diese Dokumentation, `tests/unit/faq-filter-routing.test.ts` und
`scripts/sprint10-faq-filter-browser.mjs`. Lokale QA-Artefakte liegen unversioniert
unter `artifacts/sprint10-faq-filter-routing/`; bestehende Artefakte bleiben erhalten.

## Offene Punkte

Keine fachlichen Eingaben erforderlich. Die Prüfung betrifft ausschließlich
lokale Daten; produktive Kategorien wurden nicht abgefragt oder verändert.
