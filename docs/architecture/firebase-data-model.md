# Firebase-Datenmodell

## FAQ-Kategorien

Collection:

`faqCategories/{categoryId}`

Persistierte Felder:

| Feld | Typ | Beschreibung |
|---|---|---|
| `name` | `string` | Anzeigename der Kategorie |
| `slug` | `string` | URL- und systemtauglicher Schlüssel |
| `sortOrder` | `number` | Globale Sortierung der Kategorie |
| `isActive` | `boolean` | Aktivstatus |
| `createdAt` | Firestore Timestamp | Zeitpunkt der Erstellung |
| `updatedAt` | Firestore Timestamp | Zeitpunkt der letzten Änderung |
| `createdBy` | `string` | UID des erstellenden Administrators |
| `updatedBy` | `string` | UID des zuletzt ändernden Administrators |

Die Firestore-Dokument-ID wird nicht zusätzlich als Feld gespeichert.

Die Dokument-ID entspricht dem Slug der Kategorie.

Beispiel:

```text
faqCategories/photovoltaik

## FAQ-Einträge

Collection:

`faqs/{faqId}`

Persistierte Felder:

| Feld | Typ | Beschreibung |
|---|---|---|
| `question` | `string` | FAQ-Frage |
| `answer` | `string` | FAQ-Antwort |
| `categoryId` | `string` | Dokument-ID der FAQ-Kategorie |
| `placements` | `array` | Route-Zuordnungen |
| `isPublished` | `boolean` | Veröffentlichungsstatus |
| `createdAt` | Firestore Timestamp | Zeitpunkt der Erstellung |
| `updatedAt` | Firestore Timestamp | Zeitpunkt der letzten Änderung |
| `createdBy` | `string` | UID des erstellenden Administrators |
| `updatedBy` | `string` | UID des zuletzt ändernden Administrators |

Die Firestore-Dokument-ID wird nicht zusätzlich als Feld gespeichert.

## Route-Zuordnungen

Jeder Eintrag in `placements` enthält:

| Feld | Typ | Beschreibung |
|---|---|---|
| `routeKey` | `FaqRouteKey` | Zugeordnete öffentliche Route |
| `sortOrder` | `number` | Sortierung der FAQ auf dieser Route |
| `showInSchema` | `boolean` | Aufnahme in das FAQ-Schema dieser Route |

Eine Route darf innerhalb derselben FAQ nur einmal vorkommen.

Eine FAQ muss mindestens einer Route zugeordnet sein.

## Unterstützte Route-Keys

- `home`
- `photovoltaik`
- `stromspeicher`
- `wallbox`
- `klimaanlagen`
- `waermepumpen`
- `kontakt`

Die technische Quelle dieser Liste ist:

`src/config/routes.ts`

## Dokumenttypen

Firestore-Dokumenttypen enthalten keine Dokument-ID:

- `FaqCategoryDocument`
- `FaqEntryDocument`

Anwendungsobjekte enthalten zusätzlich die aus dem Firestore-Pfad
gelesene ID:

- `FaqCategory`
- `FaqEntry`

## Eingabetypen

Create-Eingaben:

- `FaqCategoryCreateInput`
- `FaqEntryCreateInput`

Update-Eingaben:

- `FaqCategoryUpdateInput`
- `FaqEntryUpdateInput`

Diese Eingaben enthalten keine:

- Dokument-ID,
- Zeitstempel,
- Ersteller-UID,
- Änderungs-UID.

Audit-Felder werden ausschließlich serverseitig gesetzt.

## Zeitstempel

Persistierte Zeitstempel sind echte Firestore-Timestamps und keine
ISO-Strings.

Neue Dokumente erhalten serverseitig:

- `createdAt`
- `updatedAt`
- `createdBy`
- `updatedBy`

Bei Änderungen werden ausschließlich aktualisiert:

- `updatedAt`
- `updatedBy`

## Runtime-Validierung

Die zentrale Runtime-Validierung befindet sich unter:

`src/lib/validation/faq.ts`

Sie validiert:

- Kategorien,
- FAQ-Einträge,
- Route-Zuordnungen,
- Create-Eingaben,
- Update-Eingaben,
- leere Updates,
- doppelte Route-Zuordnungen,
- reservierte Dokument-IDs.


## Automatisierte Validierungstests

Die FAQ-Validierung wird mit Vitest getestet.

Testdatei:

`tests/unit/faq-validation.test.ts`

Die Tests prüfen unter anderem:

- gültige und ungültige Route-Keys,
- Kategorie-Slugs,
- Sortierungswerte,
- leere Update-Objekte,
- Teilupdates,
- doppelte Route-Zuordnungen,
- fehlende Route-Zuordnungen,
- reservierte Dokument-IDs,
- Normalisierung durch Parse-Helfer.

Lokale Ausführung:

```bash
npm run test