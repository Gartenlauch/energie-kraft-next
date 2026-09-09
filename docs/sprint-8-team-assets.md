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
| Kai Stengle · Geschäftsführer         | ja                 | keines verfügbar | Name und Rolle aus öffentlicher Legacy-Seite |
| Markus Österlein · Geschäftsführer    | ja                 | keines verfügbar | Name und Rolle aus öffentlicher Legacy-Seite |
| Stefan Pfnür · Betriebsleitung        | ja                 | keines verfügbar | Name und Rolle aus öffentlicher Legacy-Seite |
| Michael Donnert · Vertriebsleitung    | ja                 | keines verfügbar | Name und Rolle aus öffentlicher Legacy-Seite |
| Vertrieb · Berchtesgadener Land       | nein               | keines verwendet | Datenschutzentscheidung erhalten             |
| Vertrieb · BGL, Traunstein und Waging | nein               | keines verwendet | Datenschutzentscheidung erhalten             |
| Leitung Dachmontage                   | nein               | keines verwendet | Datenschutzentscheidung erhalten             |
| Leitung Service-Abteilung             | nein               | keines verwendet | Datenschutzentscheidung erhalten             |
| Leitung Verwaltung                    | nein               | keines verwendet | Datenschutzentscheidung erhalten             |
| Verwaltung · zwei Funktionen          | nein               | keines verwendet | Datenschutzentscheidung erhalten             |

## Bildbestand und Lücken

`design-input/team-originals/` ist nicht vorhanden. Es gibt deshalb keine freigegebenen
Einzelporträts. Die reale Aufnahme `design-input/reference-originals/Ainring/Service-Team_Header2025.jpg`
wird nur als Unternehmens-/Service-Hero genutzt. Die abgebildete Person wird nicht namentlich
identifiziert; der Alt-Text enthält keinen Namen.

Empfohlene Ergänzung: aktuelle, intern freigegebene 4:5-Porträts der vier öffentlich benannten
Verantwortlichen sowie – nur bei ausdrücklicher Freigabe – der anonym geführten Funktionen.
Vor Veröffentlichung sollten Rolle, Schreibweise, Bildrecht und gewünschte Namensnennung je
Person bestätigt werden. Der bereits in Sprint 7 geführte DGS-Nachweis im Footer bleibt
unverändert; weitergehende Zertifizierungs- oder Partnerclaims werden nicht neu behauptet.
