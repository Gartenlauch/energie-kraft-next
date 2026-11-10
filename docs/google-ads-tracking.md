# Google Ads – bestätigte Website-Leads

Stand: 10.11.2026. Lokal implementiert; kein Commit, Push oder Deployment.

## Bestandsaufnahme und Snippet-Abgleich

Bereits vorhanden: direkter GA4-Webstream `G-5XEMD60ZRV`, eigener App-Router-
Pageview-Adapter, `vanilla-cookieconsent` 3.1 und die validierte lokale Entscheidung
`ek_consent`. Im Anwendungscode existiert kein GTM-Container. Historische
GTM-/Google-Tag-Kennungen aus der Migrationsdokumentation werden nicht eingebaut.
Ads war bisher technisch gesperrt und im öffentlichen Einwilligungstext als
deaktiviert beschrieben.

Die am 10.11.2026 vom Auftraggeber nachgereichten Original-Ereignis-Snippets
wurden vor dem Hinterlegen der Ziele mit ID und Labels abgeglichen. Beide stimmen
einschließlich Groß-/Kleinschreibung exakt überein:

| Conversion                        | Vollständiges `send_to`               |
| --------------------------------- | ------------------------------------- |
| EKS - Kontaktformular gesendet    | `AW-10796681126/pEGMCKf9zrUdEKaPoZwo` |
| EKS - Wärmepumpe Anfrage gesendet | `AW-10796681126/qTv_CKr9zrUdEKaPoZwo` |

Kein direkter Kontozugriff oder Änderung im Google-Ads-Konto durchgeführt.

## Umsetzung

- Kontaktformular: Conversion 1 ausschließlich nach erfolgreicher Callable-Antwort
  mit `ok: true` und der vom Backend erzeugten Lead-ID.
- PV, Stromspeicher, Klimaanlage und Wallbox: Conversion 1 an derselben bestätigten
  Erfolgsgrenze. Enthält das tatsächlich abgeschlossene Projekt eine
  Wärmepumpen-Konfiguration, wird ausschließlich Conversion 2 gesendet. Ein bloß
  ausgewähltes Interesse genügt nicht. Kombinierte Projekte erzeugen eine Meldung.
- Die bestehenden Callable-Inputs, Rückgabewerte, Validierung, Speicherung,
  Kalkulationen und Mail-Verarbeitung bleiben erhalten. Ein gespeicherter Lead
  zählt auch dann, wenn das Backend einen Mailfehler als Zusatzstatus meldet.
- Ein synchroner In-flight-Schutz im Kontaktformular verhindert parallele
  Übermittlungen vor dem nächsten React-Rendering. Der Konfigurator besitzt diesen
  Schutz bereits. Tracking liegt in den bestehenden Client-Submit-Adaptern,
  niemals in Render-Effects oder Button-Handlern.
- Die zufällige Firestore-Lead-ID ist die stabile `transaction_id`; kein Hash aus
  Formularwerten, keine wechselnde Client-ID und keine öffentliche Referenz mit
  Kundeninhalt. Nur das bekannte 20-stellige Auto-ID-Format wird akzeptiert.
  Deduplizierung erfolgt zusätzlich im Browserdokument und per Session Storage
  `ek_ads_conversions` (höchstens 200 bereits gesendete Kennungen). Derselbe
  bestätigte Vorgang wird auch über unterschiedliche Conversion-Arten hinweg
  lokal nur einmal gemeldet. Google kann anhand der gleichen Transaktionskennung
  weitere Wiederholungen derselben Conversion-Aktion herausfiltern.
  [Google: Transaktionskennungen](https://support.google.com/google-ads/answer/6386790?hl=de).
- Ein bewusst neu angelegter Backend-Lead ist ein neuer Vorgang. Es wird keine
  inhaltliche Dublettensuche anhand persönlicher Formularangaben eingeführt.
  Tabübergreifend und nach Ende der Sitzung bleibt die Google-Deduplizierung über
  dieselbe Transaktionskennung maßgeblich; eine garantierte Netzwerkzustellung
  oder Exactly-once-Verarbeitung wird nicht behauptet.
- GA4 und Ads teilen sich einen gtag.js-Loader, eine `dataLayer`-Queue und ein
  `js`-Kommando. Beide Ziele werden höchstens einmal pro Browserdokument
  konfiguriert. Bestehende GA4-Pageviews bleiben getrennt und adressieren explizit
  ausschließlich den GA4-Webstream. Kein zusätzliches GA4-`generate_lead` und kein GTM.

## Consent und Datenschutz

Die vorhandene Lösung wurde erweitert; es gibt keine zweite CMP oder zusätzliche
Abhängigkeit. Revision **3** erzwingt eine neue Auswahl, weil ältere Texte Ads
ausdrücklich ausgeschlossen hatten. Die Kategorien bleiben standardmäßig aus,
mit gleichgewichtiger Zustimmung/Ablehnung und Widerruf im Footer.

| Auswahl                                  | Effektive Google-Signale                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------------------- |
| Keine / nur notwendige / nur Bewertungen | Alle vier `denied`; kein Tracking-Loader                                                    |
| Nur Statistik                            | Nur `analytics_storage=granted`; kein Ads-Ziel und keine Ads-Conversion                     |
| Nur Marketing / Conversion-Messung       | `ad_storage` und `ad_user_data=granted`; Analytics bleibt gesperrt                          |
| Statistik und Marketing                  | Die drei vorgenannten Signale `granted`                                                     |
| Personalisierte Werbung                  | `ad_personalization` bleibt immer `denied`, auch bei Auswahl dieser vorbereiteten Kategorie |

Basic Consent Mode: Der gemeinsame Loader wird erst nach entsprechender
Einwilligung geladen, das Ads-Ziel ausschließlich nach Marketing-Einwilligung
aktiviert. Die vier abgelehnten Defaults stehen vor dem externen Skript bereit.
Zustimmung wird vor Initialisierung und jeder Conversion erneut aus dem validierten
Datensatz gelesen. Eine Statistik-Freigabe allein berechtigt niemals zu Ads.
[Google: Basic Consent Mode](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic).

Erfolgsereignisse ohne Einwilligung werden verworfen und bei späterer Zustimmung
nicht nachgeholt. Nur während des Tag-Ladens dürfen bereits eingewilligte
Erfolgsereignisse im Arbeitsspeicher warten. Bei Widerruf, Ablauf, Layoutwechsel
oder Ladefehler werden ausstehende Meldungen verworfen. Ein blockierter Loader
oder gesperrter Tracking-Speicher verändert das Formularergebnis nicht.

Nach Initialisierung lässt sich ein Drittanbieter-Skript nicht zuverlässig durch
Entfernen seines HTML-Elements beenden. Bei Marketing-Widerruf werden erreichbare
`_gcl_`-Cookies entfernt und die Seite neu geladen, bevor ein abgelehntes
Consent-Update an das konfigurierte Ads-Tag gelangen könnte. Damit wird kein
Advanced-Mode-Ersatzping durch unser Consent-Update ausgelöst. Die neue Auswahl
bleibt gespeichert; eine weiterhin erlaubte Statistik-Messung kann nach dem
Neuladen wieder starten. Der Dialog erläutert das Neuladen. Bereits übertragene
Daten und nicht erreichbare Cookies können lokal nicht zurückgeholt werden.

Formularinhalte werden nicht an Tracking übergeben. Seitenadressen sind auf
bekannte öffentliche Pfade begrenzt, ohne Query/Fragment; Titel ist konstant,
Referrer leer. `allow_enhanced_conversions=false`, Google Signals und
Werbepersonalisierung sind ausgeschaltet. Consent-Dialog und Datenschutzabschnitt
10 sowie Widerrufshinweis wurden entsprechend aktualisiert.

Zusätzliche Sicherung: ausschließlich `NEXT_PUBLIC_SITE_ENV=production`, HTTPS
und exakt `www.energie-kraft.de`. localhost, Review und Firebase-/Preview-Hosts
bleiben gesperrt. `GOOGLE_ADS_ENABLED` in `src/config/google-ads.ts` ist der
explizite Abschalter. Unvollständige Conversion-Ziele sperren ebenfalls Ads.

## Geänderte Dateien

Neu:

- `src/config/google-ads.ts`
- `src/lib/consent/google-tag.ts`
- `src/lib/consent/google-ads.ts`
- `src/components/consent/google-ads.tsx`
- `tests/unit/google-ads.test.ts`
- `tests/unit/google-ads-consent-banner.test.ts`
- `docs/google-ads-tracking.md`

Angepasst:

- `src/lib/consent/policy.ts`, `client.ts`, `analytics.ts`
- `src/components/consent/consent-manager.tsx`
- `src/app/(site)/layout.tsx`, `src/app/(site)/datenschutz/page.tsx`
- `src/lib/leads/submit-contact-lead.ts`, `submit-configurator-lead.ts`
- `src/components/contact/contact-lead-form.tsx`
- `tests/unit/consent.test.ts`, `analytics.test.ts`,
  `form-validation-accessibility.test.ts`, `privacy-page-content.test.ts`

## Verifikation

- `npm run typecheck`: bestanden (`next typegen` und `tsc --noEmit`).
- `npm run lint`: keine Fehler; die bestehende Warnung in
  `functions/src/inquiry-text-attachment.ts:29` betrifft eine ungenutzte
  ESLint-Ausnahme. Eine zunächst neue Importstil-Warnung im Test wurde behoben und
  die betroffene Datei anschließend separat geprüft.
- `npm run test`: **104 Testdateien, 929 Tests bestanden** im finalen aktivierbaren
  Stand. Enthalten sind Snippet-Zuordnung, bestätigte/fehlgeschlagene/wiederholte
  Übermittlungen, kombinierte Projekte, synchrone Kontakt-Doppelübermittlung,
  Ladefehler, Strict Mode, Zustimmung/Ablehnung, neue Revision, Host-/Umgebungs-
  grenzen, Widerruf, Speicherfehler und datensparsame Ereignisparameter.
- `git diff --check`: bestanden; nur Git-Hinweise zur üblichen LF/CRLF-Konvertierung.
- Vitest war zunächst durch Windows `spawn EPERM` in der Sandbox blockiert und
  wurde mit genehmigter Eskalation ausgeführt. Bei dieser ursprünglichen
  Implementierungsprüfung kein Produktionsbuild, keine Emulator-/Rules-Suite
  und keine zusätzlichen Browserrundgänge. Der anschließend angeforderte
  Produktionsbuild ist in der Abschlussprüfung weiter unten dokumentiert.
- Git: 13 vorhandene Dateien geändert, sieben neue Dateien aus obiger Liste;
  nichts gestaged oder committed. Die zu Beginn vorhandenen fremden
  unversionierten Dateien und Artefakte bleiben erhalten.

Die Tests verwenden synthetische Backend-Antworten und simulieren das Laden des
Google-Skripts. Sie senden keine Google-Events, greifen nicht auf produktives
Firebase zu und versenden keine echten E-Mails. Sie prüfen die Anwendungsgrenzen
und Befehlsfolge; sie belegen weder die tatsächliche Google-Verarbeitung noch
Cookie-Laufzeiten, Anzeigenattribution oder die aktuelle Kontokonfiguration.

## Vor dem freigegebenen Rollout / offene Kontoprüfungen

1. Aktualisierten Consent-/Datenschutzwortlaut betrieblich prüfen. Keine eigene
   rechtliche Freigabe oder Bestätigung der kontospezifischen Verträge behauptet.
2. Im Konto verbundene Google-Tag-Ziele, automatische Ereignisregeln und bisherige
   Tags prüfen. Ein remote verbundenes Ziel darf unsere getrennte Einwilligung
   nicht umgehen. Keine zusätzlichen Legacy-/GTM-Tags daneben einbauen.
3. Enhanced Conversions und automatische Erkennung nutzerbereitgestellter Daten
   auch in Google Ads/den Google-Tag-Einstellungen ausgeschaltet lassen. Bestehende
   GA4-Enhanced-Measurement-Ereignisse einschließlich Formulare und History-
   Seitenaufrufe bleiben gemäß dem vorhandenen GA4-Konzept deaktiviert.
4. Die beiden Conversion-Aktionen auf passende Lead-Kategorie und Zählmethode
   „Eine“ prüfen. Keine gleichwertige GA4-Importconversion für denselben Lead als
   zusätzliche primäre Conversion zählen. Zählmethode ersetzt keine Transaktions-ID.
5. Echter Google-/Tag-Assistant-Netzwerkcheck nach freigegebenem Deployment bleibt
   erforderlich. Ein Code-Test ist keine Google-Empfangsbestätigung. Keine
   reale Testanfrage oder Testmail wurde durch diesen Auftrag versendet.

## Prüfung mit Google Tag Assistant

Nach separat freigegebenem Deployment auf dem erlaubten Produktivhost:

1. In einem frischen Browserprofil [Tag Assistant](https://tagassistant.google.com/)
   öffnen, `https://www.energie-kraft.de` verbinden. Ohne Einwilligung darf der
   Google-Tag noch nicht erkannt werden. Zusätzlich im Netzwerk prüfen: kein
   gtag.js-Loader und keine Analytics-/Ads-Messanfrage.
2. „Nur notwendige“ wählen und neu laden: weiterhin keine Messung.
3. Nur Statistik erlauben: GA4 darf aktiv werden, kein Ads-Config oder
   Ads-Conversion-Ereignis. Nur Marketing separat prüfen: Ads darf aktiv werden,
   keine GA4-Pageviews. In Tag Assistant die vier effektiven Consent-Werte mit
   obiger Tabelle vergleichen; `ad_personalization` bleibt `denied`.
4. Nach Marketing-Einwilligung eine **gesondert autorisierte** Kontaktanfrage
   erfolgreich übermitteln: genau ein `conversion` mit dem Kontakt-`send_to`
   und zufälliger `transaction_id`. Seitenbesuch, Absendeversuch, Validierungsfehler
   und Backend-Fehler dürfen dieses Ereignis nicht erzeugen.
5. Eine autorisierte Wärmepumpen-Anfrage prüfen: nur das Wärmepumpen-`send_to`.
   Die übrigen vier Konfiguratoren verwenden das Kontaktziel. Ein Projekt mit
   abgeschlossener Wärmepumpe und weiteren Produkten meldet nur die Wärmepumpe.
   Rückkehr zur Erfolgsanzeige/Neuladen meldet keine zusätzliche Conversion.
6. Nutzlasten auf fehlende Namen, E-Mail, Telefon, Adresse, Nachricht, Query,
   Fragment und variable Titel prüfen. Enhanced Conversions dürfen nicht aktiv sein.
7. Marketing widerrufen: erreichbare `_gcl_`-Cookies werden entfernt, die Seite
   lädt neu und aktiviert danach kein Ads-Ziel. Keine ausstehenden Leads werden
   bei erneuter Zustimmung nachgemeldet. Zustimmung/Widerruf auch mit offenem
   zweitem Tab und während des Tag-Ladens kontrollieren.
8. In der Anwendung einen gemeinsamen Loader und jeweils ein Config je erlaubtem
   Ziel prüfen; Google kann selbst weitere zielbezogene Bibliotheken laden.
   Auf Review, localhost und Firebase-Hosts bleibt Anwendungstracking gesperrt,
   auch nach „Alle akzeptieren“. Für Tests keine produktive Host-Sperre aufweichen.

Quelle: [Google: Consent mit Tag Assistant prüfen](https://developers.google.com/tag-platform/security/guides/consent-debugging).
Tag Assistant bestätigt die technische Beobachtung; die spätere Zählung/
Attribution in Google Ads muss gesondert im Konto geprüft werden.

## Abschlussprüfung vor Deployment – 10.11.2026

**Ergebnis:** Produktionsbuild und lokale Tracking-Einbindung bestanden. Die
relevanten produktiven App-Hosting-/Cloud-Run-Umgebungswerte wurden zusätzlich
lesend bestätigt. Kein gefundener Build- oder Konfigurationsblocker für die
vorbereitete Tracking-Version. Dies ersetzt die noch offene Google-Kontoprüfung
und die Live-Abnahme nach einem separat freigegebenen Deployment nicht.

### Produktionsbuild

- `npm run build` mit Next.js **16.2.10**, Exit-Code **0**: Kompilierung,
  integrierte TypeScript-Prüfung, Seitendatenerfassung und sämtliche **46 statisch
  erzeugten Seiten** erfolgreich; dynamische Routen bleiben dynamisch.
- Die öffentlichen `BUILD`-Werte und `SEARCH_INDEXING_ENABLED` wurden ausschließlich
  für den Build-Prozess aus `apphosting.yaml` übernommen. Insbesondere:
  `NEXT_PUBLIC_SITE_ENV=production`, `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false`.
  Lokale Emulator-Hostvariablen wurden aus diesem Prozess entfernt. `.env.local`
  enthält weiterhin unverändert `local`/Emulator-Konfiguration und wurde nicht
  umgeschrieben. Der vorhandene Prozess-Wrapper verhindert ihr Nachladen; Next
  nennt die vorhandene Datei trotzdem in seiner Build-Übersicht.
- Der erste Versuch wurde nach erfolgreicher Kompilierung durch die Sandbox mit
  `spawn EPERM` beim TypeScript-Unterprozess gestoppt. Der erforderliche erneute
  Versuch mit genehmigten Prozessrechten wurde vollständig erfolgreich beendet.
- Build-ID: `HTUezPVHPdcBP_ZK5YuAt`. Im erzeugten Client-Chunk
  `.next/static/chunks/2qw58am10yeb8.js` bestätigt: Produktionswert direkt in der
  Tracking-Prüfung, HTTPS-/Host-Grenze, `GOOGLE_ADS_ENABLED=true`, beide vollständigen
  Conversion-Ziele und GA4-ID. Damit ist die Einbettung in den Browser-Build
  überprüft, nicht nur der TypeScript-Quelltext.
- Keine zusätzliche Testsuite oder Browserrunde ausgeführt. Die zuvor dokumentierten
  929 Unit-Tests bleiben der Nachweis aus der Implementierungsprüfung.

### App Hosting und tatsächliche Cloud-Werte

Die folgenden Metadaten wurden über authentifizierte **GET-Abfragen** gelesen.
Keine API wurde aktiviert, keine Ressource provisioniert und kein Rollout gestartet.
Eine zuerst innerhalb der Sandbox gescheiterte Metadatenabfrage wurde außerhalb
der Sandbox erfolgreich wiederholt. Es wurden nur die relevanten nicht geheimen
Umgebungswerte ausgegeben.

| Ebene | Bestätigter Stand |
| --- | --- |
| Repository | `apphosting.yaml`: `NEXT_PUBLIC_SITE_ENV="production"`, Verfügbarkeit `BUILD` und `RUNTIME` |
| App-Hosting-Ziel | Projekt/Backend `energie-kraft-next`, Region `europe-west4`; Backend-Umgebung `production` |
| Firebase-Konsolenüberschreibung | `overrideEnv`: `NEXT_PUBLIC_SITE_ENV=production`, Emulatoren `false`; kein entgegenstehender Wert |
| Aktiver App-Hosting-Build | `build-2026-10-28-000`, Zustand `READY`, laut App-Hosting-Traffic **100 %** |
| Effektive Build-Konfiguration | `config.effectiveEnv`: `NEXT_PUBLIC_SITE_ENV=production` und Emulatoren `false`, jeweils für `BUILD` und `RUNTIME` |
| Tatsächlich bediente Cloud-Run-Revision | `energie-kraft-next-build-2026-10-28-000`, **100 %** Traffic; ihre Container-Umgebung enthält ebenfalls `production` und Emulatoren `false` |

Es existiert im Repository nur `apphosting.yaml`, keine zusätzliche
`apphosting.production.yaml`. Laut Firebase haben gleichnamige
Konsolenüberschreibungen Vorrang; die oben gelesene Überschreibung stimmt mit dem
Repository überein. [Firebase: Umgebungskonfiguration](https://firebase.google.com/docs/app-hosting/configure).

`NEXT_PUBLIC_SITE_ENV` wird im Browser **beim Build fest eingebettet**. Eine
nachträgliche Änderung nur der Container-Laufzeitvariable würde einen falsch
gebauten Client nicht reparieren. Die Verfügbarkeit während `BUILD` ist deshalb
entscheidend und sowohl lokal im Bundle als auch in der effektiven Cloud-
Build-Konfiguration bestätigt. [Next.js: öffentliche Umgebungsvariablen](https://nextjs.org/docs/app/guides/environment-variables).

`GOOGLE_ADS_ENABLED` ist **keine Cloud-Umgebungsvariable**, sondern die öffentliche
Code-Konstante aus `src/config/google-ads.ts`. Im neuen lokalen Produktionsbundle
ist sie `true`. Ein gleichnamiger Console-/Cloud-Run-Env-Eintrag würde sie nicht
steuern. Ein Abschalten dieser Konstante erfordert einen neuen Build und Rollout.

**Nicht als Cloud-Nachweis verifizierbar:** Der neue Tracking-Code ist noch nicht
deployt. Sein tatsächlicher Flag-Wert und sein Verhalten in einer künftigen
produktiven Revision können daher noch nicht bestätigt werden. Der bereits
bediente Oktober-Build beweist die funktionierende Produktionsumgebung, aber
nicht die Auslieferung dieses lokalen November-Builds. Die Umgebungswerte der
künftigen Revision sind nach dem genehmigten Rollout erneut zuzuordnen.

### Doppelte Tags und verbleibende Abnahme

- Anwendungscode einschließlich ausführbarer öffentlicher JS-/HTML-Dateien auf
  direkte Google-Tags, GTM, alte Analytics-Loader, Firebase-Analytics-Initialisierung
  und weitere gängige Tracking-Loader geprüft: keine zweite Einbindung gefunden.
- `GoogleAnalytics` und `GoogleAds` sind jeweils einmal im öffentlichen
  `(site)`-Layout eingebunden. Beide verwenden ausschließlich
  `src/lib/consent/google-tag.ts`; `window.__ekGoogleTag` schützt Loader und
  `js`-Initialisierung. Die Adapter schützen zusätzlich ihre jeweilige
  `config`-Initialisierung. Zwei unterschiedliche Ziele sind beabsichtigt.
- Im erzeugten Client-Bundle gibt es einen Tracking-Chunk mit genau einer
  Anwendungscode-Stelle für `googletagmanager.com/gtag/js`. Der vorhandene gemeinsame
  `dataLayer` wird wiederverwendet; kein GTM-Container und kein zusätzlicher
  Firebase-Analytics-Loader.
- **Weiter offen vor Live-Abnahme:** verbundene Ziele und automatische Regeln im
  Google-Tag-/GA4-/Ads-Konto, ausgeschaltete automatische Erfassung von
  Formulardaten/Enhanced Conversions sowie doppelte primäre GA4-Importconversions.
  Diese Kontoeinstellungen sind durch den Anwendungscode und die gelesenen
  Hosting-Metadaten nicht verifiziert. Sie bleiben Freigabepunkte gemäß obiger
  Rollout-Checkliste.
- Der echte Netzwerk-/Consent-Nachweis über Tag Assistant bleibt nach dem
  freigegebenen Deployment erforderlich. Keine tatsächliche Conversion oder
  Anzeigenattribution an Google getestet.

In dieser Abschlussprüfung wurde ausschließlich dieses Dokument ergänzt.
Anwendungscode und Deployment-Konfiguration blieben unverändert; Build-Ausgaben
liegen lokal unter `.next/`. Kein Commit, Push, Deployment, Formularversand oder
Versand echter E-Mails.
