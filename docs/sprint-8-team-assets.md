# Sprint 8 – Team und öffentliche Rollen

Stand: 9. September 2026. Quelle ist ausschließlich die frühere öffentlich sichtbare
Service-&-Team-Darstellung. Historische Formular-, SQL- und versteckte Builder-Daten wurden
nicht zur Identifikation von Personen genutzt.

## Zentrale Datenquelle

`src/content/team.ts` ist die gemeinsame Quelle für `/ueber-uns` und
`/service-und-wartung/service-und-team`. Das Feld `name` ist optional. Rollen, die früher
ohne Namen veröffentlicht waren, bleiben auch im neuen Frontend anonym.

| Person / Funktion                     | Öffentlich benannt | Verwendetes Bild | Status                                       |
| ------------------------------------- | ------------------ | ---------------- | -------------------------------------------- |
| Kai Stengle · Geschäftsführer         | ja                 | `kai-stengle.webp` | eindeutig über Dateiname zugeordnet |
| Markus Österlein · Geschäftsführer    | ja                 | `markus-oesterlein.webp` | eindeutig über Dateiname zugeordnet |
| Stefan Pfnür · Betriebsleitung        | ja                 | `stefan-pfnuer.webp` | eindeutig über Dateiname zugeordnet |
| Michael Donnert · Vertriebsleitung    | ja                 | `michael-donnert.webp` | eindeutig über Dateiname zugeordnet |
| Vertrieb · Berchtesgadener Land       | nein               | keines verwendet | kein eindeutig zuordenbares Bild              |
| Vertrieb · BGL, Traunstein und Waging | nein               | `vertrieb-region.webp` | Rolle und Bild über Dateiname zugeordnet |
| Leitung Dachmontage                   | nein               | `dachmontage.webp` | Rolle und Bild über Dateiname zugeordnet     |
| Leitung Service-Abteilung             | nein               | `service.webp` | Rolle und Bild über Dateiname zugeordnet        |
| Leitung Verwaltung                    | nein               | keines verwendet | kein eindeutig zuordenbares Bild              |
| Verwaltung · zwei Funktionen          | nein               | `verwaltung-1.webp`, `verwaltung-2.webp` | Funktionen anonym belassen |

## Bildbestand und Lücken

`design-input/team-originals/` ist nicht vorhanden. Beim vorgesehenen rekursiven Fallback wurde
der abweichend geschriebene Ordner `design-input/team-orginals/` gefunden. Neun über Dateinamen
eindeutig zuordenbare Aufnahmen werden als native, nicht hochskalierte 4:5-WebP-Derivate genutzt.
Die Rollen `Vertrieb · Berchtesgadener Land` und `Leitung Verwaltung` bleiben ohne Bild, weil
keine eindeutige Datei vorliegt. `team-verwaltung-4.jpg` bleibt wegen uneindeutiger Zuordnung
bewusst ungenutzt.

Empfohlene Ergänzung: aktuelle, intern freigegebene 4:5-Porträts der vier öffentlich benannten
Verantwortlichen sowie – nur bei ausdrücklicher Freigabe – der anonym geführten Funktionen.
Vor Veröffentlichung sollten Rolle, Schreibweise, Bildrecht und gewünschte Namensnennung je
Person bestätigt werden. Der bereits in Sprint 7 geführte DGS-Nachweis im Footer bleibt
unverändert; weitergehende Zertifizierungs- oder Partnerclaims werden nicht neu behauptet.
