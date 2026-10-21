# Sprint 12.5b – Release-Finalisierung

Stand: 21. Oktober 2026. Technisch lokal geprüfter Release-Kandidat; **keine Produktionsfreigabe**. Branch `main`, HEAD `5789a508c340b788d552b4f16226e385cd21d8f5` (`perf: remove Zod dependency from public links`). Kein Staging, Commit, Push, Deployment, DNS-Eingriff, echter Lead oder Mailversand. Tracking und Indexierung bleiben aus.

## A. Cookie-Banner

Die gewünschte Umsetzung war bereits vorhanden; keine weitere Änderung an Layout oder Consent-Logik erforderlich. `layout: "bar"`, `position: "bottom"`, Vollbreite, zentrierter Inhalt bis 80 rem, Energie-Kraft-Navy/Cyan und Montserrat. Zustimmung und Ablehnung gleichwertig; drei horizontale Desktopaktionen, mobil gestapelt. GLOBALSPED ausschließlich lesend als Layoutreferenz konsultiert.

Am gebauten Kandidaten erneut gezielt geprüft: 320×640, 390×844 und 1440×900 sowie geringe Höhen 320×240 und 1440×280. Kein horizontaler Überlauf, mindestens 44 px große Bedienelemente, sichtbarer Tastaturfokus und erreichbare Aktionen. Screenshots der drei angeforderten Breiten visuell geprüft. Footer öffnet Einstellungen; Google-Bewertungen allein auswählbar und widerrufbar. Keine Tracking-Requests oder Laufzeitausnahmen. Belege: `artifacts/sprint12-5-release/banner-qa.json`, `banner-*.png`.

## B. Release-Dateiliste

**Verbindliche Einzeldatei-Whitelist: [sprint-12-5-release-files.json](sprint-12-5-release-files.json), 36 Dateien.** Alle 17 seit HEAD veränderten getrackten Dateien und 19 neue Release-Dateien sind enthalten; keine gelöschten Dateien vorhanden. Der Git-Index ist leer und unverändert.

Erfasst sind Consent einschließlich Bibliothek/Lockfile und Footer, Mailrouting, Datenschutzentwurf, Google-Bewertungen, Host-/Indexierungssperre und die ESLint-/Gitignore-Korrekturen aus 12.5a. Der vorhandene Firebase-Prüfhelfer liest jetzt standardmäßig nur Metadaten; Deploy-Quellarchive benötigen einen gesonderten optionalen Schalter und wurden in 12.5b nicht gelesen.

Ausgeschlossen und unangetastet: fremde `artifacts/**`, Feedbackpakete, `firebase-export-1792508776887SMzA2p/`, `docs/gl-aenderungen-2026-10-15.md`, `public/images/photovoltaic/pv-monitoring-dashboard.png` und Roh-/Migrationsdaten. Das PNG wird nicht benötigt; die Anwendung referenziert das bestehende WebP. Eigene QA-Nachweise, Zertifikatsbundle, `.env`, `.next` und `functions/lib` werden ebenfalls nicht gestagt. Kein `git add .` verwenden.

## C. Technische Qualität

- **Genau ein tatsächlicher Next.js-Produktionsbuild in 12.5b erfolgreich**, einschließlich TypeScript: `node scripts/sprint125-release-build.mjs`. Öffentliche App-Hosting-Konfiguration, Produktionsmodus, Emulatoren aus, Tracking aus, Indexierung aus. Der erste Sandbox-Aufruf scheiterte vor Start von Next.js an `spawn EPERM`; derselbe Aufruf außerhalb der Sandbox bestand. Lokale Umgebungsdateien unverändert; keine echten Formularübermittlungen oder produktiven Datenveränderungen.
- **Gezielte Browserprüfung erfolgreich**, siehe A. Kein vollständiger Consent-/Bewertungs-Netzwerktest wiederholt. Die vorhandenen 12.4-Nachweise und die 94 gezielten Tests aus 12.5 bleiben Vorbefunde; sie sind keine neu ausgeführten Tests aus 12.5b.
- **Ein einzelner Sitemap-/Canonical-Integrationstest bestanden**, 47 andere Tests der Datei ausgelassen. FAQ-Katalog gemockt, 43 erwartete kanonische URLs, keine Query-URLs, unverändert bei geschlossenem/offenem Indexierungsschalter. Kein produktiver FAQ-Datenbestand abgefragt.
- **HTTP-Prüfung des gebauten Kandidaten bestanden:** Impressum auf Produktions-, Review-, Preview- und fremdem Host jeweils 200, Noindex-Header/HTML und Produktions-Canonical. Ein fremder Host mit vorgetäuschtem `X-Forwarded-Host` bleibt gesperrt. Review-Robots bewirbt keine Sitemap. Datenschutzseite 200, Entwurfskennzeichnung, Datenschutzkontakt, Noindex und korrekter Canonical. Der erste Prüfskriptversuch hatte einen PowerShell-Zeichencodierungsfehler im Unicode-Suchtext; nach Korrektur ausschließlich des Prüfskripts bestanden.
- **Lint:** vollständiges `npm run lint` aus 12.5a übernommen; nicht wiederholt. ESLint für den in 12.5b angepassten Firebase-Prüfhelfer erfolgreich. Functions-TypeScript-Build und Mailrouting-/Reply-To-Tests aus 12.5 übernommen; kein geänderter Functions-Code in 12.5b und kein erneuter Functions-Build.
- **`git diff --check` erfolgreich.** Whitelist auf Eindeutigkeit, vorhandene Einzeldateien, vollständige getrackte Änderungen und Ausschluss fremder Artefakte geprüft. Keine Berechnungsformeln, Einreichungspipelines oder Datenverträge verändert.

Nachweise unter `artifacts/sprint12-5-release/`: `build.log`, `build-environment.json`, `banner-qa.json`, `production-http-qa.json`, `firebase-readiness.json`. Keine offenen lokalen Build-/TypeScript-Fehler festgestellt.

## D. Firebase – rein lesender Nachweis

Metadatenprüfung am 21.10.2026 um 10:59 Uhr MESZ, Projekt `energie-kraft-next`. Kein Firebase-MCP verfügbar; vorhandene offizielle CLI-Bibliothek 15.23.0 verwendet. Der vorgeschriebene Versionsaufruf `npx -y firebase-tools@latest --version` war im Sandbox-Cache nicht verfügbar (`ENOTCACHED`). TLS-Prüfung blieb aktiv; vorhandenes öffentliches Windows-CA-Bundle nur pro Prozess verwendet. Keine Secrets, Dokumente, Benutzer oder Bewerbungsobjekte gelesen.

| Bereich | Nachgewiesener Stand / Grenze |
| --- | --- |
| App Hosting | Backend `energie-kraft-next`, `europe-west4`, GitHub-Codebasis und Runtime-Serviceaccount vorhanden. 100 % Traffic auf `build-2026-10-19-004`, Build `READY`, Quellcommit entspricht HEAD. Acht jüngste Rollouts erfolgreich. |
| Auto-Rollouts | `codebaseBranch=main`, kein `disabled=true`. Push auf `main` kann einen Rollout auslösen; Release-Branch verwenden, wenn Functions zuerst ausgerollt werden sollen. [RolloutPolicy](https://firebase.google.com/docs/reference/apphosting/rest/v1/projects.locations.backends.traffic#RolloutPolicy). |
| Domains | Review-Host, Eigentum und Zertifikat aktiv. Produktionsdomain in dieser Backend-Domainliste noch nicht eingerichtet; spätere DNS-/Domainfreigabe erforderlich. |
| Functions | Neun aktive Gen-2-Functions, alle `europe-west4`, `nodejs22`. Aktive Formularrevisionen: `submitcontactlead-00005-kul`, `submitconfiguratorlead-00005-xit`, `submitapplication-00004-jod`, `submitreferral-00004-cah`. Kein Endpunkt aufgerufen. |
| Invoker/IAM | Alle neun geprüften Run-Services erlauben `roles/run.invoker` für `allUsers`; Callables benötigen weiterhin ihre vorhandene serverseitige Autorisierung. Keine umfassende Prüfung effektiver Projekt-/Organisationsrechte oder produktiver Datenzugriffe durchgeführt. Alt-Testendpunkt siehe E. |
| Mailgun-Secret | `MAILGUN_SENDING_KEY` existiert; Versionen 1–3 aktiviert. Compute-Runtime-Serviceaccount der Mail-Functions hat explizit Secret-Accessor; Formular-/Weiterleitungsfunctions referenzieren Version 3. Nur Existenz/Versionen/IAM geprüft, keine Payloads. |
| Firestore | `(default)`, Standard/Native, `europe-west4`; PITR und Löschschutz deaktiviert. Keine Collections/Dokumente untersucht. Betriebs-/Backupfreigabe nicht damit bestätigt. |
| Storage | Anwendungsbucket `EUROPE-WEST3`, Soft Delete sieben Tage. Keine Objekte gelesen; Berechtigungen für konkrete Bewerbungsabläufe nicht live getestet. |
| Auth | Erlaubt: `localhost`, `energie-kraft-next.firebaseapp.com`, `energie-kraft-next.web.app`. Review-/Produktionshosts fehlen. Vor Redirect-/Continue-URLs gegebenenfalls ergänzen; aktueller Passwort-Reset setzt keine solche URL. Kein produktiver Login-/Reset-Test. |
| Live-Mailrouting | Neues Routing lokal durch Quellstand und frühere Tests nachgewiesen; bereits deployte Functions nicht als aktualisiert bestätigt. 12.5b las keine Quellarchive. |
| Google Places | Echte Places-Rezensionen nach Zustimmung auf dem neuen Review-Release noch nicht nachgewiesen; bisheriger Netzwerknachweis verwendet gekennzeichnete Testdaten. |

Rollback-Ausgangspunkt: App-Hosting-Build `build-2026-10-19-004`, Commit `5789a508c340b788d552b4f16226e385cd21d8f5`. Der Build ist `READY`; Containerverfügbarkeit vor Rollback erneut prüfen. [Firebase-Rollbackverfahren](https://firebase.google.com/docs/app-hosting/rollouts). Functions werden dadurch nicht zurückgesetzt: vorherigen Quellstand separat sichern und gezielt erneut deployen. Kein Rollback ausgeführt.

## E. Tatsächlich offene Go-live-P0-Freigabepunkte

1. **Datenschutz-/Betriebsfreigabe:** Rechtsgrundlagen, Anbieter-/Drittlandangaben, Consent-Wortlaut/-Dauer, Löschfristen und verantwortliche Personen einschließlich Mailkopien/Backups freigeben. Bekannte `activities`-Löschlücken und Fristkontrolle organisatorisch/technisch abschließen. Entwurfskennzeichnung erst nach ausdrücklicher Freigabe entfernen.
2. **Alt-Endpunkt `sendMailgunTest`:** weiterhin aktiv, öffentlich auf IAM-Ebene aufrufbar, Secret-Version 1 angebunden, Revision `sendmailguntest-00001-xuw`; im aktuellen Quellcode nicht exportiert. Zusätzlicher Handler-Schutz ist nicht nachgewiesen. Schutz belegen oder Stilllegung gesondert freigeben. Keine Behauptung eines bewiesenen ungeschützten Versands; kein Aufruf erfolgt.
3. **Mail-Betriebsfreigabe:** Empfang und Zuständigkeit von `anfragen@energie-kraft.de`, `bewerbung@energie-kraft.de` und `datenschutz@energie-kraft.de` bestätigen. Abweichung zu `jobs@energie-kraft.de` aus AGENTS ausdrücklich klären; bestehenden bewussten Code nicht stillschweigend geändert. Korrigierte Functions später gezielt bereitstellen. Kein Zustellnachweis durch Code-/Mocktests.
4. **Produktive Bewertungsabnahme:** echte Google-Places-Daten einschließlich Attribution/Bildern nach Zustimmung auf dem bereitgestellten RC nachweisen. Lokale synthetische Nachweise bestätigen die Consent-Integration, nicht die produktive Places-Bereitschaft.

Kein weiterer lokaler technischer P0-Fehler nachgewiesen. Vollständige produktive Firebase-Betriebsbereitschaft bleibt bis zur Klärung der oben genannten Punkte und zur anschließenden Review-Abnahme unbestätigt. Ausstehende Domain-/HTTPS- und Indexierungsschritte sind unten als Release-Reihenfolge aufgeführt.

## F. Manuelle PowerShell-Staging-Befehle – nicht ausgeführt

```powershell
Set-Location -LiteralPath 'C:\reactWebsites\energie-kraft-next'
if ((git rev-parse HEAD) -ne '5789a508c340b788d552b4f16226e385cd21d8f5') {
    throw 'HEAD hat sich geaendert; Release-Liste erneut pruefen.'
}
if (@(git diff --cached --name-only).Count -ne 0) {
    throw 'Index ist nicht leer; vorhandenes Staging zuerst manuell pruefen.'
}
[string[]]$releaseFiles = Get-Content -LiteralPath 'docs/sprint-12-5-release-files.json' -Raw | ConvertFrom-Json
if ($releaseFiles.Count -ne 36 -or @($releaseFiles | Sort-Object -Unique).Count -ne 36) {
    throw 'Release-Whitelist hat sich geaendert.'
}
foreach ($releaseFile in $releaseFiles) {
    if (-not (Test-Path -LiteralPath $releaseFile -PathType Leaf)) {
        throw "Release-Datei fehlt: $releaseFile"
    }
    if ($releaseFile -match '^(artifacts/|firebase-export-|design-input/|migration-input/|\.env)') {
        throw "Unzulaessiger Release-Pfad: $releaseFile"
    }
}
git --literal-pathspecs add -- $releaseFiles
if ($LASTEXITCODE -ne 0) { throw 'Staging fehlgeschlagen.' }
if (Compare-Object ($releaseFiles | Sort-Object) (@(git diff --cached --name-only) | Sort-Object)) {
    throw 'Gestagte Dateien weichen von der Whitelist ab; manuell pruefen.'
}
git diff --cached --name-status
git diff --cached --check
if ($LASTEXITCODE -ne 0) { throw 'Whitespace-Pruefung fehlgeschlagen.' }
```

## G. Deployment-Reihenfolge – erst nach Freigabe

1. Whitelist manuell stagen/committen. Wegen aktiver Main-Auto-Rollouts einen separaten Release-Branch verwenden; Main-Push beziehungsweise spätere Zusammenführung ist ein Veröffentlichungsschritt. Hier nichts gestagt, committet oder gepusht.
2. Functions zuerst: gezielt `submitContactLead`, `submitConfiguratorLead`, `submitApplication`, `submitReferral`, `adminForwardLead`, `adminForwardReferral` im Projekt `energie-kraft-next` / `europe-west4`. Runtime-Secret/IAM und neuen Quellstand bestätigen. Kein pauschaler Deploy mit ungeklärter Entfernung des Alt-Endpunkts.
3. App Hosting: exakt freigegebenen RC-Commit für Backend `energie-kraft-next` ausrollen; Tracking/Indexierung aus. Vorherigen Build und Functions-Quellstand für Rollback sichern, neue Build-/Rollout-ID dokumentieren.
4. Review-Domain: Banner, Footer/Einstellungen, tatsächliche Google-Bewertungen vor/nach Zustimmung und Widerruf, Attribution, Datenschutz und Noindex gezielt abnehmen. Keine echten Leads/Mails ohne gesonderte Freigabe.
5. Produktionsdomain/DNS erst nach Freigabe einrichten; vorhandene kanonische Domain-/Redirectstrategie erhalten. Zertifikat/HTTPS, Canonicals, Sitemap und gegebenenfalls Auth-Domains prüfen; Noindex zunächst beibehalten.
6. Indexierung zuletzt und ausschließlich nach ausdrücklicher Freigabe aktivieren. Produktionshost kontrollieren; Review/Preview bleiben gesperrt. GA4/Ads bleiben aus.
7. Bei Rücknahme App Hosting auf verfügbaren vorherigen Build beziehungsweise vorherigen Commit zurückrollen. Functions separat aus gesichertem vorherigen Quellstand deployen. Falls Indexierung bereits freigegeben war, Rücknahme der Indexierung ausdrücklich mitbehandeln; Daten-/Schema-Rollback ist kein Bestandteil dieses Releases.

**Nach dieser Prüfung stoppen und auf Freigabe warten.**
