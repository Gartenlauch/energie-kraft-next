# Admin Follow-up – Umsetzung und manuelle Abnahme

## Umfang

- Anfragen: ein einheitliches Desktop-Grid mit festen Checkbox-/Datums-/Statusspalten und `minmax(0, …)` für Namen, Produkte und Ort. Mobile bleibt gestapelt.
- Weiterleitung: vorhandene deutsche Kontakt-/Konfigurator-Mailbausteine werden wiederverwendet; Kontakt, Standort, Datum, Referenz, alle fünf Produktkonfigurationen, Modellversion und gespeicherte Wirtschaftlichkeit werden in HTML und Text ausgegeben. Keine UID, Fingerprints oder Mailgun-IDs im Mailtext. Konfigurator-PDF bleibt angehängt.
- PDF: ausschließlich „PDF herunterladen“, mit einem historischen Ereignis „Projekt-PDF zum Download bereitgestellt“. Keine Zustellbehauptung für angenommene Weiterleitungsmails.
- PV-Betriebskosten: reine Präsentationslogik in `functions/src/operating-cost-presentation.ts`. Nullkosten entfernen Zeile, Annahme und Begleittext; positive Kosten bleiben sichtbar. `fixedAdditionalCostEuro` bleibt unabhängig. Wirtschaftlichkeitsformeln unverändert.
- Benutzer: Suche, Rollen-/Aktivitätsfilter, Anlegen ohne Passwort, Profiländerungen, Rollenwechsel, Deaktivierung, Passwort-Mail, bestätigtes Löschen des Auth-Logins mit Profilarchiv, Avatar und letzter Login. Profilanzeige auch im Header und in vorhandenen Aktivitäten.

## Rollen und Sicherheit

`role: "admin"` = Administrator; `role: "staff"` = Mitarbeiter. Ein bestehendes `admin: true` ohne explizite Rolle bleibt Administrator. Explizite Rollen haben Vorrang vor dem Legacy-Flag. Unbekannte Rollen werden abgelehnt.

Beide Rollen: Dashboard, Anfragen, Bewerbungen, Empfehlungen, Statusänderungen, private Bewerbungsdokumente, PDF und Weiterleitungen. Nur Administrator: Einstellungen, Konfiguratorparameter, Benutzer, sämtliche FAQ-Seiten/-Aktionen/-Importe/-Exporte und endgültige Löschaktionen. Jede Seite schützt ihre Datenabfragen selbst; die Layout-Prüfung ist nicht der einzige Schutz.

Session-Cookies bleiben erhalten. Zentrale Session- und Callable-Helfer prüfen zusätzlich das aktuelle Auth-Konto, Sperrstatus, aktuelle Claims und Profilstatus. Rollenherabstufung wirkt auch gegen alte Tokens; eine neue Administratorrolle erhöht keine alte Mitarbeiter-Session. Änderungen an E-Mail/Rolle/Aktivität widerrufen Refresh-Tokens. Danach neu anmelden.

Benutzeroperationen laufen als authentifizierte Next-Server-Actions über den Admin SDK; es gibt keine Browser-Schreibrechte und keine parallele Benutzer-Callable-API. Die Next-Same-Origin-Prüfung schützt Server-Actions; die Avatar-POST-Route prüft Origin explizit.

## Daten und Teilfehler

- `adminUsers/{uid}` enthält Profilfelder, Rolle/Aktivität, privaten Bildpfad, Server-Zeitstempel und Ersteller-/Bearbeiter-UID. Archivierte Profile erhalten Löschzeitpunkt/-akteur und bleiben für die Aktivitätshistorie erhalten.
- `adminLocks/userManagement` serialisiert privilegierte Benutzeränderungen über Instanzen hinweg. Nach Erwerb wird die Berechtigung erneut geprüft; die Zahl aktiver Administratoren wird einschließlich Legacy-Konten vollständig und paginiert aus Auth ermittelt. Auth-Aufrufe werden nicht in einer wiederholbaren Firestore-Transaktion ausgeführt.
- Die Sperre hat bewusst keine automatische Ablaufübernahme: Ein unterbrochener Auth-Aufruf darf nicht mit einer zweiten Mutation überlappen. Bei Prozessabbruch muss ein berechtigter Betreiber nach Prüfung, dass keine Operation mehr läuft, Auth/Profil abgleichen und genau dieses Sperrdokument kontrolliert freigeben. Es gibt keine browserseitige Freigabe.
- Neue Auth-Konten starten deaktiviert. Während unvollständiger Änderungen sperrt `pending` den Zugang bis zur Reparatur durch erneutes Speichern. Sichere Änderungen am eigenen weiterhin aktiven Administratorkonto setzen keine solche Dauersperre; ein fehlgeschlagener Profilabgleich darf nicht den einzigen Administrator aussperren.
- Auth und Firestore bieten keine gemeinsame Transaktion. Bei Infrastrukturfehlern kann ein manueller Abgleich erforderlich sein, insbesondere nach bereits erfolgter Auth-Löschung oder fehlgeschlagener erstmaliger Profilpersistenz. Ein neu angelegter Login bleibt vor erfolgreicher Profilanlage deaktiviert; diese Fälle nicht blind erneut anlegen. E-Mail-Fehler löschen niemals ein erfolgreich angelegtes Konto.
- Passwort-Mails laufen über den [Firebase-Passwort-Reset-Flow](https://firebase.google.com/docs/reference/rest/auth#section-send-password-reset-email). Lokal wird nur der Auth-Emulator angesprochen. Versand ist eine ausdrückliche Aktion nach Anlage; keine initialen Passwörter. Provider-Annahme ist keine Zustellbestätigung.

## Profilbilder

Storage-Pfad: `adminUsers/{uid}/avatar.webp`. Upload ausschließlich durch Administrator über `/api/admin/users/[uid]/avatar`; Download nur mit gültiger interner Session. Kein öffentlicher Download-Token, keine Base64-Daten in Firestore. Maximal 2 MB, JPEG/PNG/WebP, Dateisignatur plus vollständige Dekodierung, begrenzte Pixelzahl, Normalisierung auf höchstens 256 × 256 Pixel und Entfernung von Metadaten. Das bereits vorhandene `sharp` ist nun Laufzeitabhängigkeit, ohne Versionswechsel oder neue Pakete.

Storage-Rules bleiben vollständig geschlossen. Firestore erlaubt Mitarbeitern nur die benötigten Realtime-Signale; Profile, Sperren und privilegierte Schreibzugriffe bleiben serverseitig. Inaktive, archivierte und unvollständige Profile erhalten auch keine Realtime-Leserechte.

## Prüfnachweis vom 23.09.2026

| Ausgeführte Prüfung | Ergebnis |
| --- | --- |
| `npm run typecheck` | Erfolgreich. Zunächst beschädigte generierte `.next/dev/types/validator.ts` gesichert; anschließend Test-Typfehler behoben. |
| `npm run functions:check` | Erfolgreich außerhalb der Sandbox; erster Sandbox-Versuch scheiterte an EPERM beim Schreiben nach `functions/lib`. |
| Gezielte Tests: `admin-users`, `admin-view`, `configurator-project-economics`, `configurator-project-pdf` | 4 Dateien / 69 Tests erfolgreich; Vitest benötigte wegen `spawn EPERM` einen Lauf außerhalb der Sandbox. |
| Zusätzliche gezielte Tests: Benutzer, Session, Callable, Avatar-Route | Zunächst 38/41 erfolgreich. Die drei Fehler kamen aus dem Mock der separaten Functions-Admin-SDK-Installation; durch injizierten Identity-Reader korrigiert und im vollständigen Lauf grün. |
| `npm run check:all` – abschließender Lauf | Erfolgreich, Exit 0. Root-Lint, Typprüfung, 58 Unit-Testdateien / 456 Tests, Functions-Lint/-Build, 30 Firestore-/Storage-Regeltests und Next-Produktionsbuild. Frühere Läufe stoppten an inzwischen korrigierten Test-Typen bzw. dem alten `getAdminSession`-Download-Mock. |
| `npm ls sharp --omit=dev` | Vorhandenes `sharp@0.35.4` als direkte Runtime-Abhängigkeit erkannt. Keine Paketversionen geändert. |
| `git diff --check` | Erfolgreich; lediglich Git-Hinweise zur lokalen LF/CRLF-Konvertierung. |

Keine visuelle Browser-QA durchgeführt, keine produktiven Firebase-Zugriffe und keine echten Mails. Der bestehende lokale Redesign-Arbeitsstand und `artifacts/reference-qa/` bleiben erhalten. Kein Commit, Push oder Deployment.

Die npm-Versuche zur bloßen Runtime-Einordnung scheiterten an Cache-Berechtigung, fehlendem Offline-Cache bzw. Zertifikatsprüfung. TLS wurde nicht abgeschaltet. Manifest und vorhandene Lockfile-Klassifizierungen wurden gezielt geändert, ohne neue Pakete oder Versionsänderungen.

Wichtige Implementierungsdateien:

- `functions/src/admin-role.ts`, `admin-authorization.ts`, `admin-submission-actions.ts`
- `functions/src/configurator-lead-mail.ts`, `contact-lead-mail.ts`, `operating-cost-presentation.ts`, `configurator-project-pdf.ts`, `configurator-project-economics.ts`
- `src/lib/auth/session.ts`, `live-role.ts`, `src/app/api/admin/session/route.ts`
- `src/lib/admin/user-model.ts`, `user-management.ts`, `users-server.ts`, `actor-profile.ts`
- `src/components/admin/admin-users.tsx`, `admin-avatar.tsx`, `admin-navigation.tsx`, `admin-activity-timeline.tsx`, `admin-submission-actions.tsx`
- `src/app/(admin)/admin/einstellungen/benutzer/`, `src/app/api/admin/users/[uid]/avatar/route.ts`
- Operative Admin-Seiten/-Aktionen, FAQ-/Einstellungsseitengates, Anfragen-Grid, PV-Ergebnisdarstellung und `firestore.rules`.

## Manuelle QA – lokal, ohne echte externe Testmails

### Anfragen

- [ ] Desktop: kurze/lange Namen, mehrere Produkte, mit/ohne Referenz und verschiedene Status mischen. Alle Ortsangaben beginnen exakt in derselben Spalte; keine Überläufe. Mobile prüfen.
- [ ] Suche, Produkt-/Statusfilter und Sortierung kombinieren; Detailansicht und Sammelstatus prüfen.
- [ ] Nur „PDF herunterladen“ sichtbar; Download lesbar, richtige persistierte Projektdaten und Referenz, ein nachvollziehbarer Historieneintrag.
- [ ] Kontaktweiterleitung im Mock/Testprovider: Firma, Telefon, Ort, bevorzugter Kontakt, Nachricht, Interessen, Gebäudetyp, Eigentum und Eingangsdatum vorhanden; HTML und Klartext prüfen.
- [ ] Konfiguratorweiterleitung mit allen fünf Produkten: vollständige Antworten, Kontakt/Installation, Einstieg/abgeschlossene Produkte, Modellversion, Ergebnisse, Solar-/Speicher-/Heizvergleich. Projekt-PDF als Anhang prüfen.
- [ ] Keine technischen IDs/Fingerprints im Inhalt; Weiterleitungsaktivität vorhanden. Reale externe Testmails nur nach gesonderter Freigabe.

### Betriebskosten

- [ ] Neue Modellversion mit `photovoltaic.annualOperatingCostEuro = 0` speichern; **neues** Projekt konfigurieren. Keine PV-Betriebskostenzeile/-erwähnung in Ergebnis, Projektübersicht, PDF-Vorteilsaufstellung und PDF-Annahmen.
- [ ] Neue Modellversion mit positivem Wert, z. B. 200, speichern; neues Projekt prüfen. Kosten und erklärender Text erscheinen wieder; Ersparnis berücksichtigt den Abzug.
- [ ] Zusätzliche Projektkosten unverändert separat lassen. Bereits gespeicherte Projekte behalten ihre historische Modellversion; ein geänderter aktueller Parameter schreibt alte Projekte nicht um.

### Benutzer und Berechtigungen

- [ ] Administrator und Mitarbeiter ohne Anfangspasswort anlegen; Konto bleibt beim Schließen des Dialogs erhalten.
- [ ] Passwort-Mail bewusst auslösen; lokalen Auth-Emulator verwenden. Fehlerfall: Konto bleibt bestehen, erneutes Senden möglich.
- [ ] Mitarbeiter anmelden: operative Navigation vorhanden; Einstellungen/FAQ fehlen. Direkte URLs zu Einstellungen, Benutzern, FAQs und Kategorien sowie Import/Export und zugrunde liegende Aktionen abweisen.
- [ ] Mitarbeiter: Detailansichten, Suche/Filter/Sortierung, Einzel-/Sammelstatus, Bewerbungsdokumente, PDF, Lead-/Empfehlungsweiterleitung testen. Keine endgültigen Löschaktionen verfügbar.
- [ ] Administrator: FAQ, Konfiguratoreinstellungen und Benutzerverwaltung weiterhin erreichbar. Legacy-Administrator ohne Profil und ohne `role` kann sich weiter anmelden.
- [ ] Profilfelder und E-Mail ändern; Suchtreffer und Anzeige prüfen. Rollenwechsel erfordert erneute Anmeldung, alte Session darf nicht erhöhte Rechte erhalten.
- [ ] Avatar hochladen; Liste, geöffnetes Profil, Header und Aktivität prüfen. Ohne Bild Initialen. SVG, falschen Dateityp und >2 MB ablehnen; direkter Storage-Zugriff verweigert.
- [ ] Anderen Benutzer deaktivieren: neue Anmeldung und bestehende Session/Callables abweisen. Profilhistorie erhalten. Reaktivierung anschließend prüfen.
- [ ] Eigene Deaktivierung/Herabstufung/Löschung verhindern, auch bei direkt manipuliertem Request.
- [ ] Letzten aktiven Administrator schützen; zwei gleichzeitige Änderungen dürfen nicht beide Administratorzugänge entfernen.
- [ ] Anderes Konto löschen: E-Mail-Bestätigung erforderlich, Auth-Login entfernt, Profil archiviert, bestehende Aktivitäten weiterhin lesbar.

## Späteres Deployment – hier nicht ausgeführt

- Next.js/App-Hosting-Anwendung für neue Routen, Server-Actions, Sessions und UI.
- Functions: `adminGenerateLeadReport`, `adminForwardLead`, `adminForwardReferral` (aktuelle Rollenprüfung); `submitConfiguratorLead` (gemeinsame Mail-/PDF-Präsentation). `submitContactLead` verwendet den extrahierten, inhaltlich kompatiblen Mailbuilder.
- `firestore.rules` für kanonische Rollen/Realtimesignale und serverkontrollierte Profile/Sperren.
- `storage.rules` unverändert, kein eigenes Regel-Deployment wegen Avataren erforderlich.
- Vor Produktion: Runtime-Service-Account braucht die bisherigen Auth-/Firestore-/Storage-Admin-Operationen und zusätzlich Auth-Benutzerverwaltung; nur erforderliche Rechte prüfen, keine pauschale Projekt-Owner-Rolle vergeben. Firebase-Reset-Mailvorlage/Absender und zulässige Domains prüfen. Hier keine IAM-/Provider-Konfiguration geändert.

## Regel-Audit (Firebase Security Rules Auditor)

```json
{
  "score": 5,
  "summary": "Scoped rules review: no client create/update/delete path for protected profiles, roles, locks or avatars; role authority comes from trusted claims and server-owned profiles. Internal reads are scoped, denied by default and backed by emulator tests.",
  "findings": []
}
```

Die Bewertung betrifft die geänderten Regeln, nicht eine pauschale Sicherheitszertifizierung des Gesamtsystems. Admin-SDK-Zugriffe werden separat durch Session-, Rollen-, Eingabe-, Datei- und Mutationsprüfungen geschützt.
