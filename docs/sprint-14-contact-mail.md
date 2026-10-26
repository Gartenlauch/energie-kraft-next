# Sprint 14 – Kontaktadresse und KPLUS-Anlagen

## Verhalten

- `/kontakt` verlangt „Straße und Hausnummer“ (3–150 Zeichen nach Trimmen). Das Feld steht über PLZ und Ort, mobil stehen die Felder untereinander.
- Der vorhandene Callable speichert die Straße als `location.street`. Alte Datensätze ohne das Feld bleiben gültig; alte Clients speichern `null`.
- Admin-Anzeige, interne HTML-Mail und Admin-Weiterleitung berücksichtigen die Straße.
- Interne Kontakt- und Konfigurator-Mails sowie deren Admin-Weiterleitungen erhalten `Kontaktanfrage.txt` bzw. `Konfiguratoranfrage.txt`. Keine personenbezogenen Dateinamen.
- Format: `text/plain; charset=utf-8`, UTF-8 mit BOM für Windows-Erkennung, CRLF, Überschriften und einzelne `Feld: Wert`-Zeilen. Freitext und Leerzeilen bleiben erhalten; Tabulatoren werden zu Leerzeichen. Kein erzeugtes HTML-, Tabellen- oder RTF-Layout. Kundenfreitext wird als Klartext übernommen.
- Kontaktdatei: Kontaktdaten einschließlich Firma, Telefon und Adresse; Interessen, Gebäudetyp, Eigentum/Nutzung, vollständige Nachricht und bevorzugter Kontaktweg.
- Konfiguratordatei: gemeinsame normalisierte Mailabschnitte für Kontaktdaten, Installationsort, Produkte und Projektweg, alle vorhandenen Produktkonfigurationen und ihre Ergebnisse, Investitionen sowie vorhandene Wirtschaftlichkeit, Modellannahmen und Grenzen. Berücksichtigt Photovoltaik, Stromspeicher, Wärmepumpe, Klimaanlage und Wallbox einzeln und kombiniert. Keine Neuberechnung.
- Die Anlagen enthalten keine zusätzlich ausgegebenen internen IDs, Modellversionsnummern, Versanddaten oder Tokens. Weiterleitungen enthalten zusätzlich Eingangszeitpunkt und gegebenenfalls die interne Nachricht.
- Vorhandene HTML-Layouts bleiben erhalten (Kontaktmail ergänzt nur die Straßenzeile). Bestehende PDF-Anhänge und Kundenbestätigungen bleiben erhalten. Keine zusätzliche Storage-Speicherung; Empfänger, Secrets und Versanddomain bleiben gleich.

## Veröffentlichung nach separater Freigabe

1. **Zuerst Firebase Functions** mit den Änderungen an `submitContactLead`, `submitConfiguratorLead` und `adminForwardLead` veröffentlichen. Die Mailmodule werden in diese Functions eingebunden. Andere Functions sind für Sprint 14 nicht erforderlich.
2. **Danach App Hosting** mit dem neuen Kontaktformular und der Admin-Anzeige veröffentlichen.

Die bisherige Functions-Validierung ist strikt und würde das neue Feld ablehnen: Deshalb die App nicht zuerst veröffentlichen. Die neue Functions-Validierung akzeptiert während des Übergangs weiterhin das fehlende Straßenfeld alter bzw. bereits geöffneter Formulare; eine übermittelte Straße muss dagegen 3–150 Zeichen enthalten. Das neue Formular verlangt die Straße immer. Es gibt keinen zeitgesteuerten Wechsel zur serverseitigen Pflicht. Eine spätere Verschärfung benötigt einen eigenen abgestimmten Rollout; bestehende Dokumente benötigen keine Migration.

Bei einem Rollback kann zuerst die App zurückgenommen werden. Die neuen Functions funktionieren mit der alten App weiter. Die Functions nicht zurücknehmen, solange die neue App oder bereits geöffnete neue Formulare Anfragen mit Straße senden können.

Visuelle Prüfung auf Desktop/Mobilgerät sowie Öffnen/Kopieren der TXT-Dateien in der konkreten Outlook-/KPLUS-Installation verbleiben als manuelle Abnahme. Kein realer Testversand ohne separate Freigabe.
