# FAQ-Eintragsverwaltung

## Route

`/admin/faqs`

Die Route liegt innerhalb des geschützten
Admin-Layouts.

## Funktionen

- FAQ-Einträge anzeigen
- FAQ-Einträge erstellen
- Fragen und Antworten bearbeiten
- Kategorie zuordnen
- Veröffentlichungsstatus ändern
- Route-Zuordnungen verwalten
- Sortierung pro Route verwalten
- FAQ-Schema-Sichtbarkeit pro Route verwalten
- FAQ-Einträge löschen

## Firestore

Collection:

`faqs/{faqId}`

Die Dokument-ID wird automatisch von Firestore
erzeugt.

## Route-Zuordnungen

Eine FAQ muss mindestens einer Route zugeordnet
sein.

Jede Zuordnung enthält:

- `routeKey`
- `sortOrder`
- `showInSchema`

Eine Route kann innerhalb derselben FAQ nur einmal
vorkommen.

## Kategorieprüfung

Beim Erstellen und Bearbeiten wird serverseitig
geprüft, ob die gewählte Kategorie existiert.

Die Prüfung und die Schreiboperation erfolgen in
einer Firestore-Transaktion.

## Audit-Felder

Beim Erstellen werden gesetzt:

- `createdAt`
- `updatedAt`
- `createdBy`
- `updatedBy`

Beim Bearbeiten werden aktualisiert:

- `updatedAt`
- `updatedBy`

Die UID stammt aus der geprüften Admin-Session.

## Löschschutz für Kategorien

Eine Kategorie kann nicht gelöscht werden, solange
mindestens ein FAQ-Eintrag über `categoryId` auf sie
verweist.

## Datenzugriff

Alle Lese- und Schreibzugriffe erfolgen
serverseitig über das Firebase Admin SDK.

Die Firestore Client Rules bleiben vollständig
geschlossen.

## Validierung

Formularvalidierung:

`src/lib/validation/faq-entry-admin.ts`

Zentrale fachliche Validierung:

`src/lib/validation/faq.ts`
