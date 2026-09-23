"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader, AdminToolbar, AdminEmptyState } from "./admin-ui";
import { AdminAvatar } from "./admin-avatar";
import { matchesSearchTerms } from "@/lib/admin/admin-view";
import {
  ADMIN_ROLE_LABELS,
  type ManagedUser,
  type ManagedUserInput,
  MAX_AVATAR_BYTES,
} from "@/lib/admin/user-model";
import { manageUserAction } from "@/app/(admin)/admin/einstellungen/benutzer/actions";

const fieldClass =
  "mt-2 min-h-11 w-full rounded-lg border border-[var(--border-default)] bg-white px-3 font-normal text-[var(--brand-dark)]";
const buttonClass =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--brand-primary)] px-4 text-sm font-semibold text-white disabled:opacity-50";
const blank: ManagedUserInput = {
  firstName: "",
  lastName: "",
  displayName: "",
  email: "",
  phone: "",
  jobTitle: "",
  role: "staff",
  active: true,
};

export function AdminUsers({ users, currentUid }: { users: ManagedUser[]; currentUid: string }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const flight = useRef(false);
  const [selected, setSelected] = useState<ManagedUser | null>(null);
  const [draft, setDraft] = useState<ManagedUserInput>(blank);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [photoVersion, setPhotoVersion] = useState(0);
  const [confirmation, setConfirmation] = useState("");
  function open(user: ManagedUser | null) {
    setSelected(user);
    setDraft(
      user
        ? {
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName,
            email: user.email,
            phone: user.phone,
            jobTitle: user.jobTitle,
            role: user.role,
            active: user.active,
          }
        : blank,
    );
    setMessage("");
    setConfirmation("");
    dialog.current?.showModal();
  }
  async function action(command: "save" | "archive" | "password") {
    if (flight.current) return;
    flight.current = true;
    setBusy(true);
    setMessage("");
    try {
      const result = await manageUserAction(
        command,
        command === "save" ? draft : confirmation,
        selected?.uid,
      );
      setMessage(result.message);
      if (result.ok) {
        if (command === "save" && result.uid)
          setSelected({
            ...draft,
            uid: result.uid,
            photo: selected?.photo ?? null,
            pending: false,
            archived: false,
            lastLogin: selected?.lastLogin ?? null,
          });
        if (command === "archive") dialog.current?.close();
        router.refresh();
      }
    } catch {
      setMessage(
        "Aktion nicht bestätigt. Bitte Liste neu laden, bevor du erneut anlegst oder sendest.",
      );
    } finally {
      flight.current = false;
      setBusy(false);
    }
  }
  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || flight.current) return;
    const file = new FormData(event.currentTarget).get("avatar");
    if (!(file instanceof File) || !file.size || file.size > MAX_AVATAR_BYTES) {
      setMessage("Bitte ein Bild bis 2 MB auswählen.");
      return;
    }
    flight.current = true;
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(selected.uid)}/avatar`, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const result = (await response.json()) as { message: string };
      setMessage(result.message);
      if (response.ok) {
        setSelected({ ...selected, photo: `adminUsers/${selected.uid}/avatar.webp` });
        setPhotoVersion((v) => v + 1);
        router.refresh();
      }
    } catch {
      setMessage("Bild konnte nicht hochgeladen werden.");
    } finally {
      flight.current = false;
      setBusy(false);
    }
  }
  const filtered = users.filter(
    (user) =>
      matchesSearchTerms(query, user.firstName, user.lastName, user.displayName, user.email) &&
      (!role || user.role === role) &&
      (!status || (status === "active" ? user.active : !user.active)),
  );
  const self = selected?.uid === currentUid;
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10">
      <AdminPageHeader
        eyebrow="Einstellungen"
        title="Benutzerverwaltung"
        description="Zugänge, Rollen und Benutzerprofile für das Energie-Kraft Admin-Backend verwalten."
        actions={
          <button onClick={() => open(null)} className={buttonClass}>
            + Benutzer anlegen
          </button>
        }
      />
      <AdminToolbar>
        <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
          <label className="text-sm font-semibold">
            Suche
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name oder E-Mail"
              className={fieldClass}
            />
          </label>
          <label className="text-sm font-semibold">
            Rolle
            <select value={role} onChange={(e) => setRole(e.target.value)} className={fieldClass}>
              <option value="">Alle Rollen</option>
              <option value="admin">Administrator</option>
              <option value="staff">Mitarbeiter</option>
            </select>
          </label>
          <label className="text-sm font-semibold">
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={fieldClass}
            >
              <option value="">Alle Status</option>
              <option value="active">Aktiv</option>
              <option value="inactive">Inaktiv / archiviert</option>
            </select>
          </label>
        </div>
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          {filtered.length} von {users.length} Benutzern
        </p>
      </AdminToolbar>
      <div className="mt-6 divide-y divide-[var(--border-default)] overflow-hidden rounded-2xl border border-[var(--border-default)] bg-white">
        {filtered.map((user) => (
          <button
            key={user.uid}
            onClick={() => open(user)}
            className="grid w-full grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-4 p-5 text-left hover:bg-[var(--surface-soft)] focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)] lg:grid-cols-[2.75rem_minmax(0,1.5fr)_8rem_6rem_9rem_4rem]"
          >
            <AdminAvatar
              uid={user.uid}
              name={user.displayName}
              photo={user.photo}
              version={String(photoVersion)}
            />
            <span className="min-w-0">
              <span className="block truncate font-semibold text-[var(--brand-navy)]">
                {user.displayName}
              </span>
              <span className="block truncate text-sm text-[var(--text-muted)]">{user.email}</span>
            </span>
            <span className="text-sm">{ADMIN_ROLE_LABELS[user.role]}</span>
            <span className="text-sm">
              {user.pending
                ? "Prüfung nötig"
                : user.archived
                  ? "Archiviert"
                  : user.active
                    ? "Aktiv"
                    : "Inaktiv"}
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              Letzter Login
              <br />
              {user.lastLogin
                ? new Date(user.lastLogin).toLocaleDateString("de-DE", {
                    timeZone: "Europe/Berlin",
                  })
                : "Noch keiner"}
            </span>
            <span className="text-sm font-semibold text-[var(--brand-primary)]">Details →</span>
          </button>
        ))}
      </div>
      {!filtered.length ? (
        <AdminEmptyState title="Keine Benutzer gefunden">
          Bitte Suche oder Filter anpassen.
        </AdminEmptyState>
      ) : null}
      <p role="status" className="mt-4 text-sm">
        {message}
      </p>
      <dialog
        ref={dialog}
        aria-labelledby="user-dialog-heading"
        onCancel={(event) => {
          if (busy) event.preventDefault();
        }}
        className="m-auto max-h-[90dvh] w-[min(48rem,calc(100%-2rem))] overflow-y-auto rounded-2xl border border-[var(--border-default)] p-6 backdrop:bg-[var(--brand-navy)]/60"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {selected ? (
              <AdminAvatar
                key={photoVersion}
                uid={selected.uid}
                name={draft.displayName}
                photo={selected.photo}
                version={String(photoVersion)}
              />
            ) : null}
            <h2 id="user-dialog-heading" className="text-xl font-semibold text-[var(--brand-navy)]">
              {selected ? "Benutzerprofil" : "Benutzer anlegen"}
            </h2>
          </div>
          <button
            disabled={busy}
            aria-label="Schließen"
            onClick={() => dialog.current?.close()}
            className="min-h-11 min-w-11 text-2xl"
          >
            ×
          </button>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void action("save");
          }}
          className="mt-5"
        >
          <fieldset disabled={busy || selected?.archived} className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ["firstName", "Vorname", 80],
                ["lastName", "Nachname", 80],
                ["displayName", "Anzeigename", 160],
                ["email", "E-Mail", 254],
                ["phone", "Telefonnummer", 40],
                ["jobTitle", "Funktion / Jobtitel", 120],
              ] as const
            ).map(([key, label, max]) => (
              <label key={key} className="text-sm font-semibold">
                {label}
                <input
                  type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                  required={!["phone", "jobTitle"].includes(key)}
                  maxLength={max}
                  value={draft[key]}
                  onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                  className={fieldClass}
                />
              </label>
            ))}
            <label className="text-sm font-semibold">
              Rolle
              <select
                disabled={self}
                value={draft.role}
                onChange={(e) =>
                  setDraft({ ...draft, role: e.target.value as ManagedUserInput["role"] })
                }
                className={fieldClass}
              >
                <option value="admin">Administrator</option>
                <option value="staff">Mitarbeiter</option>
              </select>
            </label>
            <label className="flex min-h-11 items-center gap-3 self-end text-sm font-semibold">
              <input
                type="checkbox"
                disabled={self}
                checked={draft.active}
                onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
                className="h-5 w-5"
              />
              Zugang aktiv
            </label>
            <button className={`${buttonClass} sm:col-span-2`}>
              {selected ? "Profil speichern" : "Benutzer ohne Passwort anlegen"}
            </button>
          </fieldset>
        </form>
        {selected && !selected.archived ? (
          <div className="mt-6 space-y-5 border-t border-[var(--border-default)] pt-5">
            <form onSubmit={upload}>
              <label className="block text-sm font-semibold">
                Profilbild · JPEG, PNG oder WebP · maximal 2 MB
                <input
                  name="avatar"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  disabled={busy}
                  className="mt-3 block w-full text-sm"
                />
              </label>
              <button disabled={busy} className={`${buttonClass} mt-3`}>
                Profilbild speichern
              </button>
            </form>
            <button
              disabled={busy || !selected.active}
              onClick={() => void action("password")}
              className={buttonClass}
            >
              Passwort-Mail senden
            </button>
            {!self ? (
              <details className="border-t border-[var(--border-default)] pt-4">
                <summary className="min-h-11 cursor-pointer text-sm font-semibold text-red-800">
                  Login endgültig löschen
                </summary>
                <p className="text-sm">
                  Der Login wird entfernt; das Profil bleibt für die Historie archiviert. Zum
                  Bestätigen {selected.email} eingeben.
                </p>
                <input
                  aria-label="E-Mail zur Löschbestätigung"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  className={fieldClass}
                />
                <button
                  disabled={busy || confirmation !== selected.email}
                  onClick={() => void action("archive")}
                  className="mt-3 min-h-11 rounded-lg bg-red-800 px-4 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Login löschen und Profil archivieren
                </button>
              </details>
            ) : (
              <p className="text-xs text-[var(--text-muted)]">
                Das eigene Administratorkonto kann nicht deaktiviert, herabgestuft oder gelöscht
                werden.
              </p>
            )}
          </div>
        ) : null}
        <p role="status" aria-live="polite" className="mt-5 text-sm text-[var(--brand-dark)]">
          {busy ? "Wird verarbeitet …" : message}
        </p>
      </dialog>
    </main>
  );
}
