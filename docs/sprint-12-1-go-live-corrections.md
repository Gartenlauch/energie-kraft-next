# Sprint 12.1 – Host-Sperre, Datenschutzentwurf und Google-Autorenbilder

Stand: 20.10.2026. Kein Deployment und keine Indexierungsfreigabe.

## Indexierungssteuerung

Indexierbar ist ausschließlich der tatsächliche HTTP-Host `www.energie-kraft.de`
(Groß-/Kleinschreibung unerheblich, optional Port 443), wenn gleichzeitig
`NEXT_PUBLIC_SITE_ENV=production` und exakt `SEARCH_INDEXING_ENABLED=true` gelten.
Andere Hosts, fehlende/ungültige Authorities, Review, Preview, Apex und lokale
Umgebungen bleiben gesperrt. `Forwarded` und `X-Forwarded-Host` werden dafür nicht
ausgewertet. Die aktuelle Konfiguration mit `SEARCH_INDEXING_ENABLED=false` bleibt
unverändert. Die normalen Produktionsfreigaben ersetzen keine seitenspezifischen
Noindex-Regeln für Datenschutz, Admin, Konfigurator-Wizards oder Bewertungsaufruf.

Der gemeinsame Host-Ausdruck wird von den HTTP-Header-Regeln und der
Request-Policy verwendet. Root-Metadata liest `headers().get("host")`; robots.txt
ist ebenfalls requestabhängig und explizit dynamisch. Öffentliche Seiten lassen
bei global erlaubter Indexierung den Metadata-Schlüssel `robots` vollständig weg,
damit Next.js die Host-Sperre vom Root erbt. `robots: undefined` würde sie bei der
Zusammenführung entfernen. Die bisherigen Social-Preview-Ausnahmen gelten nur
auf dem kanonischen Host; auf Review/Preview greift die Host-Header-Sperre auch dort.

Gesperrte Hosts erlauben weiterhin Crawling, damit Bots Noindex sehen, und
bewerben weder Sitemap noch Produktionshost in robots.txt. Die Sitemap und alle
Canonical-Ziele bleiben unverändert. Die Sitemap darf als bestehende Ressource
auf Review erreichbar bleiben, trägt dort aber den Noindex-Response-Header.

Die Anfrage-Metadata macht zuvor statische HTML-Routen dynamisch. Dies ist eine
bewusste Folge der unterschiedlichen HTML-Metadata auf demselben Backend. Keine
hostübergreifende HTML-/robots-Zwischenspeicherung konfigurieren. Vor Freigabe im
echten App Hosting prüfen, dass der originale Host unverändert an Next gelangt.
Bei internem Host statt Produktionshost bleibt die Sperre sicher geschlossen;
nicht durch ungeprüfte Forwarding-Header umgehen. Ein absichtlich gespoofter
HTTP-Host ist keine Authentifizierung; die Plattform muss ihre Domainzuordnung
weiterhin selbst durchsetzen.

## Datenschutzentwurf

`src/app/(site)/datenschutz/page.tsx` enthält eine ausformulierte, weiterhin als
Entwurf markierte und seitenspezifisch mit Noindex versehene Fassung. Technische
Grundlage: vorhandene Firebase-Konfiguration, Submission- und Upload-Schemas,
Server-Mailpipeline, Admin-Sitzungen, Consent-Code und Google-Places-Adapter.
Keine Produktionseinstellungen oder Kundendaten wurden dafür abgefragt.

Vor Veröffentlichung zwingend freigeben:

- Datenschutzkontakt, gegebenenfalls Datenschutzbeauftragte und Aufsichtsbehörde.
- Rechtsgrundlagen je Verarbeitung einschließlich DSGVO/TDDDG-Speicherzugriffen,
  Bewerbungen und Informationspflichten bei Empfehlungen fremder Personen.
- Vertragspartner, Auftragsverarbeitung, Unterauftragnehmer, tatsächliche
  Ressourcenregionen und Drittlandgarantien. EU-Region/EU-Mailgun-Endpunkt allein
  ist keine Zusage einer ausschließlich europäischen Verarbeitung.
- Löschfristen/-kriterien für Anfragen, PDFs, Bewerbungen/Dateien, Empfehlungen,
  Benutzer, Logs, Mailgun, Postfächer und Backups; keine Frist wurde erfunden.
- Auth-/Cookie-Inventar, Consent-Wortlaut und die technisch konfigurierten,
  weiterhin vorläufigen 180 Tage. Keine allgemeine Löschautomatik unterstellen.
- Öffnungs-/Klicktracking in der tatsächlichen Mailgun-Konfiguration. Keine
  Aktivierung oder Zusage über nicht überprüfte Provider-Einstellungen.
- Rechtsgrundlage und technische Lösung für Google-Autorenbilder.

Die Seite beschreibt deaktiviertes GA4-/Ads-Webtracking und die bestehende
Bildausnahme ausdrücklich. Eine Checkbox zur Kenntnisnahme der Datenschutzhinweise
wird nicht als pauschale Einwilligung für sämtliche Verarbeitungen dargestellt.
Eine redaktionelle Fassung ist noch keine rechtliche oder Produktionsfreigabe.

## Google-Autorenbilder: technische Machbarkeit und Vertragsgrenze

Der Adapter liest `reviews[].authorAttribution.photoUri` aus Places API (New).
Dies ist eine Autorenprofilbild-URI, kein `photos[].name` und kein Place-Photos-
Medienendpunkt. Für Place Photos dokumentierte Ablauf-/Cache-Regeln dürfen nicht
als besondere Erlaubnis oder feste Lebensdauer dieser Autoren-URIs ausgelegt
werden. Die URI bleibt vom Provider abhängig; keine dauerhafte Gültigkeit annehmen.

Aktuell übergibt die Komponente diese URI mit `unoptimized` an den Browser.
`referrerPolicy="no-referrer"` unterdrückt den Referrer, nicht Besucher-IP oder
Browser-Verbindungsdaten. Consent ist dafür weiterhin nicht angebunden.

Technisch ließe sich das unveränderte Bild zur Anfragezeit über einen eigenen
Server-Endpunkt weiterreichen. Bei bestätigter Zulässigkeit müsste dieser:

- nur aktuelle, vom vorhandenen Places-Adapter aufgelöste Autoren-URIs verwenden;
  keine frei eingebbare Proxy-URL und keine dauerhafte URI-/Bildsammlung;
- HTTPS-Ziele und jeden Redirect strikt begrenzen, damit kein offener Proxy/SSRF
  entsteht; Timeout, Dateigröße und Bildtyp begrenzen;
- Originalbytes ohne Umkodierung/Entfernung von Attribution ausliefern; keine
  Cookies, Besucher-IP oder Referrer zum Bildanbieter weiterreichen;
- Provider-Fetch und eigene Antwort ohne persistente Speicherung, Next-Image-
  Optimierung und Browser-/CDN-/Framework-Cache betreiben (`no-store`);
- Autorenname, verfügbaren Avatar, Profil- und Einzelrezensionslink sowie
  bestehende Google-Attribution erhalten. Kein Austausch durch erfundene Autoren.

Dies ist eine technische Möglichkeit, **keine bestätigte Vertragserlaubnis**.
Die EEA-Bedingungen untersagen insbesondere Caching außerhalb ausdrücklicher
Ausnahmen und behandeln erneutes Hosting/Weiterverbreitung außerhalb des Dienstes
restriktiv. Ein `no-store`-Header allein klärt nicht, ob ein flüchtiger eigener
Bild-Endpunkt noch erlaubte API-Darstellung oder unzulässiges Rehosting ist.
Die dokumentierten Places-Cache-Ausnahmen enthalten keine allgemeine Erlaubnis,
Autorenbilder für 30 Tage lokal oder per CDN zu speichern. Gleichzeitig verlangt
die aktuelle Attribution-Policy die verfügbaren Autorenressourcen bei ausreichendem
Platz. Avatare stillschweigend entfernen ist daher keine abgesicherte Alternative.

Offen bleiben die tatsächlich vereinbarten Vertragsbedingungen (einschließlich
EEA-Anwendbarkeit anhand des Abrechnungskontos), die Erlaubnis eines nicht
speichernden Proxys und dessen konkrete Auslieferungsregeln. Google-/Vertragsprüfung
und datenschutzrechtliche Bewertung sind getrennt erforderlich.

Minimale Handlungsoptionen, jeweils nach Freigabe:

1. Google bestätigt die konkrete Proxy-Auslieferung: begrenzten, cachefreien
   Originalbild-Endpunkt umsetzen und Netzwerkverhalten prüfen. Darstellung kann
   beim Erstaufruf bestehen bleiben. Die Rechtsgrundlage der Verarbeitung bleibt
   gesondert zu bestätigen.
2. Vorherige Einwilligung für das gesamte Google-Rezensionsmodul; erst danach
   Rezensionen einschließlich Attribution/Bildern laden. Das verändert den
   Erstaufruf und erfüllt nicht den Wunsch nach sofort sichtbaren Bewertungen.
3. Falls weder Proxy noch unverzüglicher Direktabruf rechtlich freigegeben sind:
   komplettes Modul vorläufig ausblenden und nur einen externen Bewertungslink
   anbieten. Ebenfalls sichtbare Änderung und deshalb eigener Freigabebedarf.

Die bestehende Darstellung wurde nicht geändert. Die Kombination „sofort sichtbar,
kein direkter Browserabruf, keine ungeklärte Proxy-Erlaubnis“ ist derzeit nicht
freigegeben umsetzbar. Keine Behauptung vollständiger Datenschutzkonformität.

### Offizielle Quellen, abgerufen am 20.10.2026

- [Places API Policy: Attribution und Caching](https://developers.google.com/maps/documentation/places/web-service/policies)
- [AuthorAttribution: photoUri](https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#AuthorAttribution)
- [EEA Terms, 3.3.2: Scraping/Rehosting und Caching](https://cloud.google.com/terms/maps-platform/eea)
- [EEA Service Specific Terms, 15: Places API](https://cloud.google.com/terms/maps-platform/eea/maps-service-terms)
- [EEA Permitted Uses](https://cloud.google.com/terms/maps-platform/eea-places-api-permitted-uses)
- [Firebase-Datenschutzinformationen](https://firebase.google.com/support/privacy)
- [DSGVO, insbesondere Art. 13, 14 und 15–22](https://eur-lex.europa.eu/eli/reg/2016/679)

## Noch vor Produktionsumschaltung

Datenschutz-/Bilderentscheidung freigeben; Release-Dateien gezielt aufnehmen;
App-Hosting- und separate Functions-Version mit bestehender Mailrouting-Korrektur
bestätigen; Secrets/IAM/Auth/Storage-Bereitschaft und alte WordPress-DNS-Werte
sichern. Nach separat autorisiertem Rollout echte Host-Header, HTML-Metadata,
robots.txt, Canonicals und unveränderte Sitemap auf Produktion und Review prüfen.
Erst dann Produktionsindexierung separat freigeben. Tracking bleibt deaktiviert.

## Gezielte Prüfergebnisse

- `tests/unit/search-indexing.test.ts`: 48 Tests bestanden; tatsächliche
  Next.js-Pfad-/Header-Matcher, Root-Metadata und robots-Handler mit Host-Matrix,
  gefälschten Forwarding-Headern, Freigabeschalter, lokalen Umgebungen,
  Seitensperren, Canonicals und unveränderter Sitemap. FAQ-Datenquelle gemockt;
  keine Produktionsdatenabfrage.
- `tests/unit/faq-filter-routing.test.ts` und
  `tests/unit/google-review-page.test.ts`: zusammen 22 Tests bestanden.
- `tsc --noEmit --incremental false`: bestanden. Gezieltes ESLint für alle
  geänderten TypeScript-Dateien und `git diff --check`: bestanden.
- Vitest benötigte wegen Windows-`spawn EPERM` die genehmigte Ausführung außerhalb
  der Sandbox. Geprüft werden der echte Root-Generator und der notwendige
  Vererbungsvertrag: kein eigener `robots`-Schlüssel auf erlaubten Unterseiten.
- Keine Gesamtsuite, kein Build, kein Browser-Rundgang, keine echte Formularsendung,
  kein Commit, Push, Deployment, DNS-Eingriff oder Aktivierung von Indexierung/Tracking.
  Die neue Version ist auf Review/Produktion noch nicht ausgerollt oder geprüft.
