# Firebase-Betriebsmodell

**Projekt:** Energie-Kraft Süd Relaunch
**Firebase-Projekt-ID:** `energie-kraft-next`
**Stand:** 14. Juli 2026

## 1. Grundentscheidung

Für Entwicklung und Produktion wird genau ein Firebase-Projekt verwendet:

```text
energie-kraft-next
```

Es gibt:

* kein separates Staging-Projekt,
* keinen Firebase-Alias `staging`,
* keinen Firebase-Alias `production`,
* keine zweite produktionsähnliche Firebase-Umgebung.

Die bestehende WordPress-Webseite bleibt bis zum Go-live auf der Produktivdomain aktiv. Die neue Next.js-Anwendung wird bis dahin lokal entwickelt und getestet.

## 2. Umgebungen

### Lokale Entwicklung

Die lokale Entwicklung verwendet ausschließlich die Firebase Emulator Suite.

Verwendete Emulatoren:

| Dienst          |        Port |
| --------------- | ----------: |
| Authentication  |        9099 |
| Cloud Functions |        5001 |
| Firestore       |        8080 |
| Storage         |        9199 |
| Emulator UI     | automatisch |

Der Emulator-Aufruf verwendet ausdrücklich die Projekt-ID:

```bash
firebase emulators:start --project energie-kraft-next
```

Lokale Anwendungen dürfen nicht unbemerkt auf produktive Firebase-Dienste zugreifen.

### Continuous Integration

GitHub Actions verwendet die technische Umgebung:

```text
ci
```

CI führt Installations-, Lint-, TypeScript- und Build-Prüfungen aus.

CI darf:

* keine produktiven Firebase-Daten lesen,
* keine produktiven Firebase-Daten schreiben,
* keine Firebase-Ressourcen anlegen,
* keine Deployments durchführen.

### Produktion

Produktive Firebase-Zugriffe erfolgen ausschließlich über:

```text
energie-kraft-next
```

Deployments müssen bewusst und explizit ausgeführt werden. Es gibt kein allgemeines automatisches Deployment im Quality-Workflow.

## 3. Regionen

Für alle zentralen Backend-Komponenten wird dieselbe Region verwendet:

| Dienst               | Region         |
| -------------------- | -------------- |
| Firebase App Hosting | `europe-west4` |
| Cloud Functions      | `europe-west4` |
| Firestore            | `europe-west4` |

Die Cloud-Functions-Region wird im Functions-Quellcode über `setGlobalOptions` festgelegt.

Die Firestore-Datenbank existiert zum Zeitpunkt dieser Dokumentation noch nicht. Beim späteren Anlegen der Datenbank muss ausdrücklich `europe-west4` gewählt werden.

Der Firestore-Standort kann nach dem Erstellen der Datenbank nicht ohne Migration geändert werden.

## 4. Firebase-Konfigurationsdateien

### `.firebaserc`

Die Datei enthält ausschließlich das Standardprojekt:

```json
{
  "projects": {
    "default": "energie-kraft-next"
  }
}
```

### `firebase.json`

Die Konfiguration enthält:

* Firestore Rules,
* Firestore Indexes,
* Storage Rules,
* Functions-Codebase,
* Emulator-Konfiguration,
* App-Hosting-Backend,
* `singleProjectMode: true`.

Die geplante Firestore-Region ist:

```json
"location": "europe-west4"
```

### `apphosting.yaml`

App Hosting verwendet aktuell:

```yaml
runConfig:
  minInstances: 0
```

Weitere Ressourcenlimits, Environment-Variablen und Secrets werden erst ergänzt, wenn sie fachlich benötigt werden.

## 5. Sicherheitsregeln

Für lokale Entwicklung gilt:

```text
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
```

Produktive Firebase-Zugriffe dürfen nicht allein anhand einer Client-Variable freigegeben werden.

Das Firebase Admin SDK darf ausschließlich serverseitig verwendet werden und muss in geschützten Servermodulen liegen.

Das Admin SDK umgeht Firestore Security Rules. Deshalb benötigen administrative Schreiboperationen zusätzlich:

* eine verifizierte Firebase-Session,
* eine Admin-Rollenprüfung,
* serverseitige Eingabevalidierung,
* kontrollierte Route Handler oder Server Actions.

## 6. Erlaubte npm-Scripts

Aktives Firebase-Projekt anzeigen:

```bash
npm run firebase:current
```

Verfügbare Firebase-Projekte anzeigen:

```bash
npm run firebase:projects
```

Lokale Emulatoren starten:

```bash
npm run emulators
```

Die früheren Scripts `firebase:staging` und `firebase:production` wurden entfernt, da die entsprechenden Projekt-Aliase nicht existieren und dem Ein-Projekt-Modell widersprechen.

## 7. Verbotene beziehungsweise kontrollierte Aktionen

Während der lokalen Entwicklung dürfen nicht unbeabsichtigt ausgeführt werden:

```bash
firebase deploy
firebase deploy --only firestore
firebase deploy --only functions
firebase use staging
firebase use production
```

Vor einem Deployment müssen mindestens folgende Punkte geprüft werden:

1. aktives Firebase-Projekt,
2. Zielressourcen des Deployments,
3. lokale Qualitätsprüfungen,
4. GitHub-Actions-Status,
5. Security Rules,
6. Environment-Variablen und Secrets.

## 8. Noch offene Firebase-Arbeiten

Noch nicht Bestandteil dieses Betriebsmodells beziehungsweise noch umzusetzen:

* Firestore-Datenbank anlegen,
* Emulator-Verbindung für Client SDK absichern,
* Emulator-Verbindung für Admin SDK absichern,
* Authentifizierung für den Adminbereich,
* Session Cookies,
* Admin-Rollenmodell,
* Firestore Rules Tests,
* Storage Rules Tests,
* FAQ-Datenmodell,
* FAQ-CRUD,
* Lead-Speicherung,
* produktive Secrets und Environment-Variablen.
