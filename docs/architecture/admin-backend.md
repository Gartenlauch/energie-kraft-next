# Admin backend

## Scope and routes

The protected Admin uses the shared Energie-Kraft CI and reusable primitives from `src/components/admin`. The current routes are:

| Route | Capability | Roles |
| --- | --- | --- |
| `/admin` | Dashboard metrics, status donuts and latest items | Administrator, Mitarbeiter |
| `/admin/anfragen` | Contact and configurator Anfragen | Administrator, Mitarbeiter |
| `/admin/bewerbungen` | Applications and private documents | Administrator, Mitarbeiter |
| `/admin/empfehlungen` | Referrals | Administrator, Mitarbeiter |
| `/admin/faqs` and `/admin/faqs/categories` | FAQ CRUD and JSON transfer | Administrator only |
| `/admin/einstellungen/konfiguratoren` | Versioned configurator assumptions | Administrator only |
| `/admin/einstellungen/benutzer` | User management | Administrator only |

Every privileged page/action performs its own server-side authorization. Navigation visibility is not an authorization boundary. See [Admin authentication](admin-authentication.md).

## Workflow status

| Identifier | UI |
| --- | --- |
| `new` | Neu |
| `in_progress` | In Bearbeitung; dashboard metric **Offen** |
| `completed` | Erledigt |
| `rejected` | Abgelehnt |

`Offen` counts **only** `in_progress`; it never combines `new + in_progress`.

## Lists and actions

Operational lists support search, filters, sorting, removable filter chips, expandable detail sections, selection of the currently filtered results and bulk status updates. Bulk updates are limited and validated server-side.

There is **no bulk-delete operation**. Individual permanent deletion is Administrator-only and separately confirmed/protected.

## Anfragen and project PDF

Anfragen combine contact leads and configurator leads. Details include workflow status, activity history, `mailto:`/`tel:` actions and internal forwarding. For eligible configurator leads the single PDF action is **PDF herunterladen**. The callable securely rebuilds the project PDF from persisted lead/settings data and records `report_generated`; there are no separate “PDF ansehen” or “PDF neu erzeugen” actions.

Internal forwarding reuses the stored Anfrage data. Configurator forwarding contains contact and installation data, selected products, answers, calculated project/economic results, public project reference and the generated PDF attachment. Technical submission IDs/fingerprints are not business-facing mail content. Mail-provider acceptance is not represented as delivery confirmation.

## Activity history

Lead events are stored under `leads/{leadId}/activities/{activityId}`. Current types are:

- `status_changed`
- `report_generated`
- `lead_forwarded`
- `report_forwarded`

Referral forwarding activity uses the corresponding `referrals/{id}/activities` subcollection.
Referral status changes currently update the referral document but do not create an activity event;
applications likewise have no activity subcollection in the current repository. Actor UID and
email are stored with recorded events; display resolves the current/archived `adminUsers/{uid}`
profile where possible. Older records without activity documents still show the original
submission as orientation and remain usable.

## User management

Administrator profiles live at `adminUsers/{uid}`; canonical fields and lifecycle are documented in [Firebase data model](firebase-data-model.md). Administrators can create accounts without an initial password, edit profiles and roles, activate/deactivate accounts, trigger a Firebase password-setup/reset email, upload an avatar and delete an Auth account while archiving its profile.

Protections include:

- no self-deactivation, self-demotion or self-deletion;
- no removal of the last active Administrator;
- serialized privileged mutations through `adminLocks/userManagement`;
- revoked refresh tokens after access-affecting changes;
- `pending` fail-closed state for incomplete cross-service mutations;
- archived profiles retained for activity attribution.

Avatars use `adminUsers/{uid}/avatar.webp`. Upload is Administrator-only through `/api/admin/users/[uid]/avatar`; download requires an active internal session. JPEG, PNG and WebP up to 2 MB are signature/decoder validated, normalized to at most 256 × 256 WebP and stored without a public download token. Initials are the fallback.
