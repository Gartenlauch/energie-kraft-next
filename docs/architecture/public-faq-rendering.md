# Öffentliche FAQ-Ausgabe

Erweiterung Sprint 8.3A: [Katalog, Detailseiten, Adminfelder und lokaler Import](../sprint-8-3a-content-faq.md).

## Datenquelle

Öffentliche FAQs werden ausschließlich aus
Firestore geladen.

Collection:

`faqs`

Kategorien:

`faqCategories`

## Serverseitiger Zugriff

Der öffentliche Datenzugriff erfolgt über:

`src/lib/faq/public-repository.ts`

Es wird das Firebase Admin SDK verwendet.

Die Firestore Client Rules bleiben weiterhin
vollständig geschlossen.

## Veröffentlichungsbedingungen

Eine FAQ wird öffentlich angezeigt, wenn:

1. `isPublished === true`
2. auf Landingpages eine Placement-Zuordnung für die aktuelle Route
   vorhanden ist; Katalog und Detailseiten benötigen kein passendes Placement
3. die zugeordnete Kategorie existiert
4. die Kategorie `isActive === true` ist

## Sortierung

Die Ausgabe wird primär über:

`placement.sortOrder`

sortiert.

Bei gleicher Sortierung folgen:

1. `category.sortOrder`
2. alphabetische Sortierung der Frage

## Route-Keys

Die unterstützten Route-Keys werden zentral unter:

`src/config/routes.ts`

verwaltet.

Die Placement-Abfrage wird für Startseite und Produktseiten verwendet:

- photovoltaik
- stromspeicher
- wallbox
- klimaanlagen
- waermepumpen
- kontakt

Sie liefert maximal sechs Einträge. `/faq`, Kategorie- und Detailseiten verwenden
den vollständigen veröffentlichten Katalog aktiver Kategorien. Siehe Sprint-8.3A-Dokumentation.

## Strukturierte Daten

Das Feld:

`placement.showInSchema`

steuert, ob eine öffentlich sichtbare FAQ zusätzlich
in das generische Schema.org-FAQPage-JSON-LD
aufgenommen wird.

Nur bereits sichtbar veröffentlichte FAQs können im
JSON-LD erscheinen.

## Google FAQ Rich Results

Google stellt FAQ Rich Results seit Mai 2026 nicht
mehr in der Google-Suche dar.

Die Schema-Ausgabe dient daher nicht als
Rich-Result-Taktik, sondern als semantische,
maschinenlesbare Struktur für Schema.org-kompatible
Systeme, Suchmaschinen und AI-Systeme.

## Sicherheit

Audit-Felder wie:

- `createdBy`
- `updatedBy`
- `createdAt`
- `updatedAt`

werden nicht an öffentliche Komponenten
weitergereicht.

Die öffentliche Darstellung verwendet ausschließlich
den Typ:

`PublicFaqEntry`

## Rendering

Die Startseite wird aktuell dynamisch gerendert, damit
CI-Builds keine produktiven Firestore-Zugriffe
ausführen.

Caching und gezielte Revalidierung werden später
separat optimiert.
