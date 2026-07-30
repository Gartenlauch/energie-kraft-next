# Admin-Authentifizierung

## Ziel

Der Adminbereich verwendet Firebase Authentication
mit serverseitigen Firebase-Session-Cookies.

## Ablauf

1. Der Benutzer meldet sich auf `/admin/login`
   mit E-Mail und Passwort an.
2. Das Firebase Client SDK erzeugt ein ID-Token.
3. Das ID-Token wird an `/api/admin/session`
   übertragen.
4. Der Server prüft:
   - Same-Origin-Anfrage,
   - gültiges ID-Token,
   - kürzlich erfolgte Anmeldung,
   - Custom Claim `admin: true`.
5. Das Admin SDK erzeugt ein fünf Tage gültiges
   Session-Cookie.
6. Das Cookie wird als `httpOnly`, `sameSite=strict`
   und in Produktion als `secure` gespeichert.
7. Das geschützte Admin-Layout prüft das Cookie
   serverseitig.
8. Beim Logout wird das Cookie entfernt und die
   Firebase-Sitzung widerrufen.

## Session-Cookie

Cookie-Name:

`__session`

Eigenschaften:

- `httpOnly`
- `sameSite=strict`
- `secure` in Produktion
- Pfad `/`
- Gültigkeit fünf Tage

## Rollenmodell

Ein Benutzer besitzt nur dann Adminzugriff, wenn
sein Firebase-ID-Token beziehungsweise Session-Cookie
den Custom Claim enthält:

```json
{
  "admin": true
}