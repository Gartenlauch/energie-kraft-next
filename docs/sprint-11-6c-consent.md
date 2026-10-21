# Sprint 11.6c – Consent-Grundlage

Stand: 20.10.2026. Entwicklungsstand, **keine Produktionsfreigabe**.

## Architektur und Speicherung

`vanilla-cookieconsent` 3.1.0 übernimmt Dialoge, Kategorienauswahl, Fokusführung
und Speicherung. Die GLOBALSPED-Komponenten `CookieConsentBanner.tsx` und
`GoogleConsentMode.tsx` sowie `lib/tracking/google.ts` wurden als Referenz gelesen.
Ihre Tag-Loader, Attribution und Events wurden nicht übernommen.

Integration ausschließlich im öffentlichen `(site)`-Layout; dauerhafter
„Cookie-Einstellungen“-Button im Footer. Alle akzeptieren und Alle ablehnen
haben gleiches visuelles Gewicht. Notwendige Dienste bleiben aktiv.

Einziger Entscheidungsdatensatz: Local Storage `ek_consent`, Revision 1.
Vorläufige Gültigkeit: 180 Tage ab letzter Auswahländerung. Die Bibliothek speichert
Kategorien, Dienste (derzeit leere Listen), Revision, zufällige Consent-ID,
Sprache, ersten und letzten Zeitstempel sowie Ablaufzeit. `data` bleibt `null`.
Keine Formularwerte, keine Attribution, kein serverseitiges Consent-Profil.
Konfigurator-`sessionStorage` wird nicht angefasst. Auswahl gilt für diesen
Browser und Origin, nicht geräteübergreifend.

Vor Initialisierung wird der Datensatz validiert. Fehlerhaftes JSON, unbekannte
Kategorien, falsche Revision, ungültige Zeitstempel, abgelaufene Datensätze und
Custom-Daten führen zur erneuten Abfrage und sperren optionale Dienste.
Lesefehler werden als fehlende Einwilligung behandelt. Bei gesperrtem Browser-
Speicher wird keine optionale Freigabe aus flüchtigem Dialogzustand abgeleitet.

## Kategorien und Google-Signale

| Kategorie                      | Vorgesehene Wirkung                                |
| ------------------------------ | -------------------------------------------------- |
| Notwendige Dienste             | Immer aktiv; funktionsnotwendige Speicherung       |
| Statistik                      | `analytics_storage`                                |
| Marketing / Conversion-Messung | `ad_storage`, `ad_user_data`                       |
| Personalisierte Werbung        | `ad_personalization`, nur zusammen mit Marketing   |
| Google-Bewertungen             | Unabhängig; keines der vier Analytics-/Ads-Signale |

`googleConsentSignals()` bildet die fachliche Zuordnung ab.
`getEffectiveGoogleConsent()` wendet zusätzlich die Umgebungssperre an.
`publishConsent()` stellt ausschließlich lokale Consent-Kommandos in `dataLayer`
bereit: zuerst `default`, danach `update`. Alle vier effektiven Signale bleiben
derzeit auch nach vollständiger Zustimmung `denied`.
Es gibt **keinen** Tag-Loader, keine `config`-/`event`-Kommandos, keinen GTM,
keine Analytics-/Ads-Anfragen und auch keine cookielosen Tracking-Pings.

`TRACKING_ENABLED = false` und eine leere exakte Host-Allowlist sperren sämtliche
Hosts, einschließlich Produktion. Freigabe erfordert später einen ausdrücklich
reviewten Code-Change an beiden Stellen. Keine Ableitung aus `NODE_ENV` oder
`SITE_ENV`, keine Wildcards oder Suffixvergleiche.

## Widerruf und spätere Verbraucher

Dialogänderungen veröffentlichen den Zustand unmittelbar. Das native
`storage`-Event synchronisiert andere Tabs desselben Origins; dort wird auch
die Dialogauswahl neu eingelesen. Ablauf-Timer und Fokus-/Sichtbarkeitswechsel
prüfen die Gültigkeit erneut.

Spätere Verbraucher müssen `hasConsent()` bzw. `getEffectiveGoogleConsent()`
**bei jeder Übermittlung** abfragen und auf `ek:consent-change` reagieren.
Die Funktionen lesen stets den gespeicherten Zustand einschließlich Ablaufzeit.
Keine gepufferten Ereignisse nach Widerruf versenden. Schon erfolgte Übermittlungen
lassen sich durch Widerruf nicht zurückholen. Da derzeit keine Tags laufen,
werden keine bestehenden Analytics-Cookies anderer Implementierungen gelöscht.

## Google-Bewertungen: verbleibendes Drittanbieter-Risiko

`hasGoogleReviewsConsent()` und `ek:consent-change` sind die vorbereitete Schnittstelle.
Die bestehende Rezensionsdarstellung bleibt auftragsgemäß unverändert:
`customer-reviews-section.tsx` lädt externe Autorenbilder weiterhin über
`next/image` mit `unoptimized` direkt, ohne diese Freigabe zu prüfen.
Damit können trotz Ablehnung IP-Adresse und Verbindungsdaten an Google gelangen.
`referrerPolicy="no-referrer"` verhindert nicht diese Verbindung.
Das Banner benennt diese Einschränkung ausdrücklich.

**Vor Produktion erforderlich:** Bildabrufe an die separate Freigabe anbinden,
bei Widerruf zukünftige externe Abrufe verhindern und einen geeigneten lokalen
Fallback verwenden. Nicht behaupten, dass diese Sprint-Version bereits sämtliche
Drittanbieter-Verbindungen verhindert.

## Nächster Auftrag: GA4 und Google Ads

Bestehende Kennungen laut Auftrag: GA4 `G-5XEMD60ZRV`, Google Tag `GT-TBVWWSD`,
ungeprüfter alter GTM `GTM-T5J45GHS`. Keine davon wird hier geladen.
WordPress/Borlabs und primäre Google-Ads-Anruf-Conversions bleiben unverändert.

Vor Aktivierung genau einen Einbindungsweg festlegen und den alten GTM prüfen.
Direktes gtag und GTM dürfen nicht parallel dieselben Ereignisse senden.
Die GA4-Property teilt sich den Webstream mit der bestehenden Website:
Streamweite Änderungen erst auf Auswirkungen auf WordPress prüfen.

Für Pageviews einen einzigen Verantwortlichen wählen:

- Automatische Seitenaufrufe einschließlich Enhanced-Measurement-
  Browserverlaufsänderungen **oder** eine deduplizierte App-Router-Messung.
- Bei eigener Messung `send_page_view: false` bei jeder relevanten Konfiguration
  verwenden und History-basierte automatische Pageviews separat ausschließen.
  `send_page_view: false` allein verhindert nicht sämtliche History-Dopplungen.
- Initialaufruf, Client-Navigation, Consent-Erteilung und erneutes Mounten gezielt
  auf genau einen gewünschten Pageview prüfen; keine Roh-Querys/Formularwerte senden.

Enhanced Measurement erfasst bereits Formularinteraktionen. Vor eigener
Formularmessung automatische `form_start`/`form_submit` und eigene Events
abgrenzen oder die automatische Erfassung abgestimmt deaktivieren.
Ein späteres `generate_lead` darf erst nach bestätigter erfolgreicher Speicherung
ausgelöst werden, nicht beim Klick oder bloßen Submit-Versuch. Keine gleichzeitige
Ads-Direktconversion und GA4-Importconversion für denselben Geschäftsvorgang als
doppelte primäre Conversion konfigurieren. Keine realen Testleads/-mails nötig.

Fachlich freigeben lassen: Wortlaut, Speicherdauer, rechtliche Zuordnung,
Anbieter-/Transferinformationen und Datenschutzerklärung. Eine spätere wesentliche
Zweckänderung erfordert eine neue Revision statt Wiederverwendung alter Einwilligung.

Technische Quellen:
[CookieConsent-Konfiguration](https://cookieconsent.orestbida.com/reference/configuration-reference.html),
[Google Consent Mode](https://developers.google.com/tag-platform/security/guides/consent).

## Gezielte Prüfung

- `tests/unit/consent.test.ts`: 26 Fälle für Zuordnung, Standardwerte,
  Speicherung/Revision/Zeitstempel, Ablauf und explizite Host-Sperre: bestanden.
- `scripts/sprint116c-consent-browser.mjs`: bestehendes Headless-Chrome/CDP-Muster
  wiederverwendet; lokaler Server auf Port 3026. Erstbesuch, Ablehnung einschließlich
  Reload, vollständige Zustimmung, individuelle Auswahl, Widerruf, erneute
  Zustimmung, nativer Tab-Abgleich, abgelaufene/defekte Speicherung, Footer,
  Tastatur-Fokusbegrenzung, Escape/Fokusrückgabe und mobile Breite: bestanden.
  Keine Analytics-/Ads-Requests, ausschließlich `denied`-Signale, keine
  JavaScript-Laufzeitausnahmen. Ergebnis: `artifacts/sprint11-6c-consent/qa.json`.
- Der Versuch mit lokal aufgelöstem Review-Host wurde durch Next.js' Dev-Origin-
  Schutz blockiert; dieser Schutz wurde nicht verändert. Host-Sperre einschließlich
  `review.energie-kraft.de` separat im Unit-Test bestätigt. Ein echter Netzwerkcheck
  der neuen Version auf `https://review.energie-kraft.de/` ist erst nach einem
  separat freigegebenen Deployment möglich und bleibt offen.
- `npx tsc --noEmit`: bestanden. ESLint gezielt für die betroffenen TypeScript-
  und Testdateien: bestanden. Keine Gesamtsuite, kein Build, keine Firebase-Prüfung.

## Geänderte Dateien

- `package.json`, `package-lock.json`: einzige neue Abhängigkeit `vanilla-cookieconsent`.
- `src/components/consent/consent-manager.tsx`, `consent-settings-button.tsx`,
  `consent.css`: Oberfläche und Bibliotheksintegration.
- `src/lib/consent/policy.ts`, `client.ts`: Validierung, Kategoriezuordnung,
  Umgebungssperre und vorbereitete Verbraucherschnittstelle.
- `src/app/(site)/layout.tsx`, `src/components/layout/site-footer.tsx`: Einbindung.
- `tests/unit/consent.test.ts`, `scripts/sprint116c-consent-browser.mjs`:
  gezielte reproduzierbare Prüfung.
- Dieses Dokument sowie der lokale QA-Bericht.

Bestehende E-Mail-Routing-Änderungen und fremde unversionierte Artefakte wurden
nicht bearbeitet. Kein Commit, Push oder Deployment.
