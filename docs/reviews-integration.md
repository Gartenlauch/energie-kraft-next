# Kundenbewertungen – Sprint 8.2

Der bestehende Google-Adapter `src/lib/reviews/google-business-profile.ts` verwendet jetzt
die offizielle **Places API (New), Place Details**. Kein zweites Reviewsystem und kein Widget.
`getCustomerReviews()` liefert normalisierte Daten an die bestehende Server-Komponente auf
der Homepage zwischen Referenzen und Partnern. Trustpilot bleibt unverändert unkonfiguriert.

## Exakte Aktivierung

Diese drei serverseitigen Werte fehlen lokal und sind in `.env.example` vorbereitet:

- `GOOGLE_PLACES_API_KEY`: API-Key eines Projekts mit aktivierter Places API (New) und Abrechnung;
  auf diese API und die geeignete Server-Nutzung einschränken, Quoten/Kostenlimits festlegen.
  Niemals `NEXT_PUBLIC_` verwenden oder den Key ins Repository eintragen.
- `GOOGLE_PLACE_ID`: verifizierte Place ID des Energie-Kraft-Süd-Unternehmensprofils in Ainring.
- `GOOGLE_REVIEWS_URL`: geprüfter HTTPS-Link auf dessen Google-Profil/Bewertungsübersicht
  (z. B. der direkt aus Google Maps geteilte Profil-Link). Der vorhandene reine Adress-Suchlink
  in `site.ts` ist dafür nicht ausreichend. Keine Profil-ID/URL wird geraten.

Werte lokal in `.env.local` und später in der serverseitigen Laufzeitkonfiguration hinterlegen;
danach Server neu starten. In diesem Sprint keine Cloud-Aktivierung und kein Deploy.
Vor öffentlicher Aktivierung Datenschutz/Nutzungsbedingungen für diese Integration freigeben,
insbesondere die unmittelbar von Google geladenen Autorenbilder; Google-Verweise sind an der
Sektion sichtbar. Die bestehende Datenschutzerklärung wird nicht eigenmächtig rechtlich umgeschrieben.

## Darstellung und Ausfallverhalten

Server-GET `https://places.googleapis.com/v1/places/{PLACE_ID}?languageCode=de`, FieldMask
`rating,userRatingCount,reviews,attributions`, API-Key im Header, vier Sekunden Timeout.
Antwortvalidierung mit Zod; keine Schlüssel oder Rohantworten in Client/Logs.
Keine dauerhafte Speicherung, kein Prefetch und kein Review-Cache (`cache: "no-store"`).
Damit entsteht bei aktivierter Integration pro Homepage-Aufruf ein abrechenbarer Abruf.

Bis zu drei textliche Bewertungen in der gelieferten Relevanzreihenfolge, keine Sternefilterung.
Originaltext, Autor samt verfügbarem Profilbild/Link, Sterne, Datum, individuelle Quelllinks;
Gesamtbewertung und Anzahl stammen direkt aus der API, nicht aus der dargestellten Auswahl.
Die CTA „Alle Google-Bewertungen ansehen“ verwendet ausschließlich den zentral konfigurierten
Profil-Link und öffnet mit `noopener noreferrer` im neuen Tab. Google- und weitere gelieferte
Quellenangaben bleiben bei den Inhalten sichtbar.
Das unveränderte Google-Maps-Logo stammt aus dem offiziellen
[Attributionspaket](https://developers.google.com/static/maps/documentation/images/Google_Maps_Attribution_Assets.zip)
und liegt unter `public/images/reviews/google-maps-attribution.png` (DarkGray, 4×; Anzeige 98×18 px).

Fehlende/ungültige Konfiguration: keine Anfrage und keine leere Sektion. API-Fehler/Timeout:
Provider wird ausgelassen, Homepage bleibt nutzbar. Keine Fallback-Rezensionen und kein
Review-/AggregateRating-JSON-LD. Live-Datenprüfung ist erst nach Bereitstellung obiger Werte möglich.

Offizielle Grundlagen: [Place Details](https://developers.google.com/maps/documentation/places/web-service/place-details)
und [Attribution/Policies](https://developers.google.com/maps/documentation/places/web-service/policies).
