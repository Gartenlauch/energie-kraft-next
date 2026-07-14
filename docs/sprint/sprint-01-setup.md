# Übergabe Sprint 1 → Sprint 2

**Projekt:** Energie-Kraft Süd Relaunch
**Repository/Projekt:** `energie-kraft-next`
**Produktivdomain:** `https://www.energie-kraft.de`

## 1. Aktueller Stand

Das Next.js-Grundprojekt ist lokal lauffähig. Folgende Prüfungen laufen erfolgreich:

```bash
npm run lint
npm run typecheck
npm run build
```

Aktive Routen:

```text
/        → öffentliche Startseite
/admin   → Administrationsbereich
```

Die bestehende WordPress-/Brizy-Seite bleibt bis zum Go-live unverändert live.

---

## 2. Getroffene Entscheidungen

### Architektur

* Next.js App Router
* TypeScript
* Tailwind CSS
* Firebase für:

  * Firestore
  * Functions
  * Storage
  * Authentication
* ein einziges Firebase-Projekt:

```text
energie-kraft-next
```

* kein separates Staging-Projekt
* Entwicklung und Tests zunächst lokal
* Firebase Emulator Suite für Testdaten vorgesehen
* Node.js 22 als gemeinsame Runtime
* bevorzugte Firebase-Region: `europe-west4`

### Routing

Route Groups werden zur Trennung verwendet:

```text
(site)   → öffentliche Webseite
(admin)  → Administration
```

Route Groups erscheinen nicht in der URL.

Die Admin-Seite muss deshalb unter folgendem Pfad liegen:

```text
src/app/(admin)/admin/page.tsx
```

und nicht direkt unter:

```text
src/app/(admin)/page.tsx
```

### Content

* keine sichtbaren öffentlichen Texte dauerhaft direkt in Komponenten
* zentrale Content-Dateien pro Route
* bestehende WordPress-Inhalte bilden die SEO-Basis
* keine Herstellernamen im Hero oder in generischen Startseiten-/Produkttexten
* Herstellernamen dürfen in FAQs vorkommen, wenn fachlich sinnvoll
* keine Herstellerwarnung im FAQ-Admin

### SEO

* Canonicals zeigen später immer auf:

```text
https://www.energie-kraft.de
```

* Firebase-Standarddomain darf vor dem Go-live nicht indexiert werden
* Sitemap, Robots, Metadata Builder, Canonical Builder und Schema Builder werden zentral aufgebaut
* GA4 wird verwendet
* Consent Mode v2 ist erforderlich
* `generate_lead` darf erst nach erfolgreicher serverseitiger Speicherung ausgelöst werden

### FAQ

FAQs werden von Anfang an in Firestore verwaltet.

Benötigte Eigenschaften:

* Kategorie
* Sortierung
* Veröffentlichungsstatus
* Zuordnung zu einer oder mehreren Routen
* `showInSchema`
* route-spezifische Sortierung

Geplante Collections:

```text
faqCategories/{categoryId}
faqs/{faqId}
```

---

## 3. Erstellte beziehungsweise angepasste Dateien

Nach aktuellem Stand vorhanden oder bearbeitet:

```text
src/app/layout.tsx
src/app/globals.css

src/app/(site)/page.tsx

src/app/(admin)/admin/page.tsx
src/app/(admin)/admin/layout.tsx

src/lib/firebase/admin.ts
src/lib/utils/cn.ts

package.json
package-lock.json
tsconfig.json
eslint.config.mjs
```

Die ursprüngliche Next.js-Startseite:

```text
src/app/page.tsx
```

wurde entfernt beziehungsweise durch die Route unter `(site)` ersetzt.

### Firebase Admin

`firebase-admin` wurde als reguläre Root-Dependency installiert:

```bash
npm install firebase-admin
```

Grund: Das Admin SDK wird von der Next.js-Anwendung serverseitig zur Laufzeit verwendet.

### Klassen-Utility

Für `src/lib/utils/cn.ts` wurden installiert:

```bash
npm install clsx tailwind-merge
```

Inhalt:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

### Typecheck

Der Typecheck sollte die Next.js-Routentypen vorab neu generieren:

```json
{
  "typecheck": "next typegen && tsc --noEmit"
}
```

---

## 4. Bereits behobene Probleme

### Fehlendes `firebase-admin`

Fehler:

```text
Cannot find module 'firebase-admin/app'
```

Ursache:

`firebase-admin` war nicht im Root-Projekt installiert.

Lösung:

```bash
npm install firebase-admin
```

### Fehlende Utility-Abhängigkeiten

Fehler:

```text
Cannot find module 'clsx'
Cannot find module 'tailwind-merge'
```

Lösung:

```bash
npm install clsx tailwind-merge
```

### Veraltete Next.js-Routentypen

Fehler:

```text
Cannot find module '../../src/app/page.js'
```

Ursache:

Die ursprüngliche `src/app/page.tsx` wurde verschoben, `.next` enthielt aber noch alte Routentypen.

Lösung:

```powershell
Remove-Item -Recurse -Force .next
npm run typecheck
```

### Route-Group-Konflikt

Fehler:

```text
You cannot have two parallel pages that resolve to the same path.
```

Ursache:

Sowohl `(site)` als auch `(admin)` enthielten eine direkte `page.tsx`. Beide ergaben dadurch `/`.

Korrektur:

```text
src/app/(site)/page.tsx            → /
src/app/(admin)/admin/page.tsx     → /admin
```

---

## 5. Geplante, aber noch zu verifizierende Basisdateien

Zu Beginn von Sprint 2 prüfen, ob diese Dateien bereits vollständig vorhanden sind. Falls nicht, anlegen:

```text
src/config/env.ts
src/config/site.ts
src/config/routes.ts

src/lib/firebase/client.ts
src/lib/firebase/admin.ts

src/lib/seo/canonical.ts
src/lib/seo/metadata.ts
src/lib/seo/schema.ts

src/content/index.ts
src/content/site.ts
src/content/navigation.ts
src/content/pages/home.ts
src/content/metadata/home.ts

src/types/content.ts
src/types/faq.ts
src/types/lead.ts

src/app/robots.ts
src/app/sitemap.ts
src/app/not-found.tsx
src/app/error.tsx
src/app/global-error.tsx

firebase.json
.firebaserc
firestore.rules
firestore.indexes.json
storage.rules

functions/src/index.ts
functions/package.json
```

---

## 6. Offene Punkte für Sprint 2

Empfohlener Sprint-Titel:

```text
Sprint 2 — Firebase Emulatoren, Auth-Grundlage und Firestore-Datenmodell
```

Prioritäten:

1. tatsächlichen Repository-Stand und vorhandene Dateien prüfen
2. Firebase-Projekt `energie-kraft-next` vollständig initialisieren
3. `.firebaserc` und `firebase.json` einrichten
4. Emulatoren konfigurieren:

   * Auth
   * Firestore
   * Functions
   * Storage
5. Firebase Client SDK und Admin SDK sauber trennen
6. Environment-Validierung mit Zod einrichten
7. Firestore- und Storage-Regeln zunächst `deny by default`
8. FAQ-TypeScript-Modell finalisieren
9. Firestore-Datenmodell dokumentieren
10. erste Emulator-Tests erstellen
11. Admin-Authentication konzipieren
12. serverseitige Session-Strategie festlegen
13. FAQ-Admin-Grundlayout und Route Protection vorbereiten

Noch nicht umgesetzt:

* Firebase Auth Login
* Admin Session Cookies
* geschützte Admin-Routen
* FAQ-CRUD
* Firestore-Abfragen
* Lead-Speicherung
* Bewerbungsverwaltung
* Storage-Uploads
* produktive Cloud Functions
* Consent Banner
* GA4-Integration
* Consent Mode v2
* Redirect-Inventar
* vollständige Sitemap
* finale Schema.org-Struktur
* Premium Video Hero
* mobile Posterbild-Logik

---

## 7. Risiken und wichtige Hinweise

### Ein Firebase-Projekt

Da nur ein Firebase-Projekt verwendet wird, besteht ein erhöhtes Risiko, dass lokale Tests versehentlich Produktionsdaten verändern.

Gegenmaßnahmen:

* lokal konsequent Emulatoren verwenden
* Emulator-Verbindung eindeutig über Environment-Variablen steuern
* keine Testdaten in das echte Firestore schreiben
* Security Rules zunächst vollständig geschlossen halten

### Admin SDK

`firebase-admin` darf ausschließlich serverseitig verwendet werden.

Nicht importieren in:

```text
"use client"-Komponenten
Browser-Code
Client Hooks
```

Empfehlung:

```ts
import "server-only";
```

in allen Admin-SDK-Modulen.

### Firebase-Standarddomain

Vor dem Go-live darf die App-Hosting-Domain nicht indexierbar sein.

Schutzmaßnahmen:

* Meta-Robots `noindex`
* `robots.txt`
* `X-Robots-Tag`
* Produktionsindexierung erst unmittelbar zum Domainwechsel aktivieren

### Firestore Security

Das Admin SDK umgeht Firestore Security Rules. Daher müssen Schreiboperationen zusätzlich serverseitig geschützt werden durch:

* verifizierte Auth-Sessions
* Rollenprüfung
* Eingabevalidierung
* kontrollierte Server Actions oder Route Handler

### SEO-Migration

Die bestehende WordPress-Seite rankt bereits gut. Vor dem Go-live fehlen noch:

* vollständiges URL-Inventar
* alte und neue Route pro Seite
* 301-Redirect-Matrix
* Canonical-Prüfung
* Metadatenvergleich
* Sitemapvergleich
* Schema-Vergleich
* Prüfung bestehender Backlinks und indexierter URLs

### Region

Die Firestore-Region kann später nicht einfach geändert werden. Vor dem Anlegen der produktiven Datenbank nochmals bestätigen:

```text
europe-west4
```

---

## 8. Definition of Done für Sprint 1

Sprint 1 ist abgeschlossen, weil:

```text
✅ Next.js-Projekt läuft lokal
✅ App Router funktioniert
✅ öffentliche Route / funktioniert
✅ Admin-Route /admin funktioniert
✅ Route-Group-Konflikt behoben
✅ TypeScript-Prüfung erfolgreich
✅ ESLint-Prüfung erfolgreich
✅ Production-Build erfolgreich
✅ Firebase Admin SDK wird aufgelöst
✅ Tailwind-Utilities werden aufgelöst
✅ ein Firebase-Projekt verbindlich festgelegt
✅ zentrale Architekturentscheidungen dokumentiert
```

**Ausgangslage für Sprint 2:** Das Frontend-Grundsystem ist stabil. Der nächste Schwerpunkt ist die sichere Firebase-Infrastruktur mit Emulatoren, Datenmodell, Auth-Grundlage und Vorbereitung des FAQ-Admins.
