import { randomUUID } from "node:crypto";
import type { Auth, UserRecord } from "firebase-admin/auth";
import { FieldValue, type Firestore } from "firebase-admin/firestore";
import { claimsForRole, resolveAdminRole } from "../../../functions/src/admin-role.ts";
import { managedUserIdSchema, managedUserSchema, type ManagedUser } from "./user-model";

export class UserManagementError extends Error {}
type Actor = { uid: string; role: "admin" | "staff" };
type Dependencies = {
  auth: Auth;
  db: Firestore;
  sendPasswordEmail: (email: string) => Promise<void>;
};

export function assertAdminChangeAllowed(
  actorUid: string,
  target: Pick<UserRecord, "uid" | "disabled" | "customClaims">,
  next: { active: boolean; role: string },
  activeAdmins: number,
) {
  const removesAccess = !next.active || next.role !== "admin";
  if (actorUid === target.uid && removesAccess)
    throw new UserManagementError(
      "Das eigene Administratorkonto darf nicht deaktiviert, herabgestuft oder gelöscht werden.",
    );
  if (
    !target.disabled &&
    resolveAdminRole(target.customClaims) === "admin" &&
    removesAccess &&
    activeAdmins <= 1
  )
    throw new UserManagementError("Der letzte aktive Administrator muss erhalten bleiben.");
}

/** All managed Auth mutations share a Firestore lock. No Auth writes in retried transactions. */
export function createUserManagement({ auth, db, sendPasswordEmail }: Dependencies) {
  const profiles = db.collection("adminUsers");
  async function authorize(actor: Actor) {
    if (actor.role !== "admin")
      throw new UserManagementError("Administratorberechtigung erforderlich.");
    const [user, profile] = await Promise.all([
      auth.getUser(actor.uid),
      profiles.doc(actor.uid).get(),
    ]);
    const data = profile.data();
    if (
      user.disabled ||
      resolveAdminRole(user.customClaims) !== "admin" ||
      data?.active === false ||
      data?.pending ||
      data?.archived
    )
      throw new UserManagementError("Kein aktiver Administratorzugang.");
  }
  async function allAuthUsers() {
    const users: UserRecord[] = [];
    let pageToken: string | undefined;
    do {
      const page = await auth.listUsers(1000, pageToken);
      users.push(...page.users);
      pageToken = page.pageToken;
    } while (pageToken);
    return users;
  }
  async function locked<T>(actor: Actor, task: () => Promise<T>): Promise<T> {
    await authorize(actor);
    const lock = db.collection("adminLocks").doc("userManagement");
    const owner = randomUUID();
    await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(lock);
      if (snapshot.exists)
        throw new UserManagementError(
          "Eine Benutzeränderung läuft bereits. Bitte später erneut versuchen.",
        );
      transaction.create(lock, { owner, createdAt: FieldValue.serverTimestamp() });
    });
    try {
      await authorize(actor);
      return await task();
    } finally {
      await db.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(lock);
        if (snapshot.data()?.owner === owner) transaction.delete(lock);
      });
    }
  }
  async function targetUser(uid: string) {
    managedUserIdSchema.parse(uid);
    const user = await auth.getUser(uid);
    const profile = await profiles.doc(uid).get();
    if (!resolveAdminRole(user.customClaims) && !profile.exists)
      throw new UserManagementError("Kein verwaltetes Benutzerkonto.");
    if (profile.data()?.archived) throw new UserManagementError("Dieses Konto ist archiviert.");
    return user;
  }
  async function activeAdminCount() {
    const users = (await allAuthUsers()).filter(
      (user) => !user.disabled && resolveAdminRole(user.customClaims) === "admin",
    );
    const states = await Promise.all(users.map((user) => profiles.doc(user.uid).get()));
    return states.filter((snapshot) => {
      const p = snapshot.data();
      return !p?.pending && !p?.archived && p?.active !== false;
    }).length;
  }
  async function list(actor: Actor): Promise<ManagedUser[]> {
    await authorize(actor);
    const [accounts, stored] = await Promise.all([allAuthUsers(), profiles.get()]);
    const byUid = new Map(stored.docs.map((doc) => [doc.id, doc.data()]));
    const rows: ManagedUser[] = accounts
      .filter((user) => resolveAdminRole(user.customClaims) || byUid.has(user.uid))
      .map((user) => {
        const p = byUid.get(user.uid);
        return {
          uid: user.uid,
          firstName: p?.firstName ?? "",
          lastName: p?.lastName ?? "",
          displayName: user.displayName ?? p?.displayName ?? user.email ?? "Benutzer",
          email: user.email ?? "",
          phone: p?.phone ?? "",
          jobTitle: p?.jobTitle ?? "",
          role: resolveAdminRole(user.customClaims) ?? p?.role ?? "staff",
          active: !user.disabled && p?.active !== false && !p?.pending && !p?.archived,
          photo: p?.photo ?? null,
          lastLogin: user.metadata.lastSignInTime || null,
          archived: Boolean(p?.archived),
          pending: Boolean(p?.pending),
        };
      });
    for (const [uid, p] of byUid)
      if (!accounts.some((user) => user.uid === uid))
        rows.push({
          uid,
          firstName: p.firstName ?? "",
          lastName: p.lastName ?? "",
          displayName: p.displayName ?? "Archiviertes Konto",
          email: p.email ?? "",
          phone: p.phone ?? "",
          jobTitle: p.jobTitle ?? "",
          role: p.role ?? "staff",
          active: false,
          photo: p.photo ?? null,
          lastLogin: null,
          archived: true,
          pending: Boolean(p.pending),
        });
    return rows;
  }
  async function save(actor: Actor, raw: unknown, uid?: string) {
    const input = managedUserSchema.parse(raw);
    return locked(actor, async () => {
      const existing = uid ? await targetUser(uid) : null;
      if (existing) assertAdminChangeAllowed(actor.uid, existing, input, await activeAdminCount());
      // Newly created accounts start disabled; partial failures never grant untracked access.
      const user =
        existing ??
        (await auth.createUser({
          email: input.email,
          displayName: input.displayName,
          disabled: true,
        }));
      const reference = profiles.doc(user.uid);
      // Self-protection has already enforced active/admin. Profile failures must not
      // lock the sole administrator out of an otherwise unchanged permission level.
      const self = user.uid === actor.uid;
      await reference.set(
        {
          pending: !self,
          ...(existing
            ? {}
            : {
                ...input,
                active: false,
                archived: false,
                createdAt: FieldValue.serverTimestamp(),
                createdByUid: actor.uid,
              }),
        },
        { merge: true },
      );
      try {
        await auth.updateUser(user.uid, {
          email: input.email,
          displayName: input.displayName,
          disabled: !input.active,
          ...(existing?.email !== input.email ? { emailVerified: false } : {}),
        });
        await auth.setCustomUserClaims(user.uid, claimsForRole(user.customClaims, input.role));
        const accessChanged =
          !existing ||
          existing.email !== input.email ||
          resolveAdminRole(existing.customClaims) !== input.role ||
          existing.disabled === input.active;
        if (accessChanged) await auth.revokeRefreshTokens(user.uid);
        await reference.set(
          {
            ...input,
            pending: false,
            archived: false,
            updatedAt: FieldValue.serverTimestamp(),
            updatedByUid: actor.uid,
            ...(!existing ? { uid: user.uid, photo: null } : {}),
          },
          { merge: true },
        );
      } catch {
        if (self) throw new UserManagementError(
          "Profiländerung unvollständig. Administratorrechte bleiben erhalten. Anmeldung gegebenenfalls mit der neuen E-Mail erneuern und Profil erneut speichern.",
        );
        // pending remains set: both cookie and callable access fail closed until repaired by an admin.
        throw new UserManagementError(
          "Konto angelegt/gefunden, Änderung aber unvollständig. Der Zugang bleibt gesperrt. Profil erneut speichern; keine neue Anlage versuchen.",
        );
      }
      return user.uid;
    });
  }
  async function archive(actor: Actor, uid: string, confirmation: string) {
    return locked(actor, async () => {
      const user = await targetUser(uid);
      if (confirmation !== user.email)
        throw new UserManagementError("Zum Löschen die vollständige E-Mail-Adresse bestätigen.");
      assertAdminChangeAllowed(
        actor.uid,
        user,
        { active: false, role: "staff" },
        await activeAdminCount(),
      );
      const reference = profiles.doc(uid);
      await reference.set(
        {
          uid,
          displayName: user.displayName ?? user.email ?? "Benutzer",
          email: user.email ?? "",
          role: resolveAdminRole(user.customClaims),
          pending: true,
          active: false,
          updatedAt: FieldValue.serverTimestamp(),
          updatedByUid: actor.uid,
        },
        { merge: true },
      );
      try {
        await auth.updateUser(uid, { disabled: true });
        await auth.revokeRefreshTokens(uid);
        await auth.deleteUser(uid);
        await reference.set(
          {
            archived: true,
            pending: false,
            deletedAt: FieldValue.serverTimestamp(),
            deletedByUid: actor.uid,
          },
          { merge: true },
        );
      } catch {
        throw new UserManagementError(
          "Löschung unvollständig. Zugang gesperrt; Profilhistorie bleibt erhalten. Administratorprüfung erforderlich.",
        );
      }
    });
  }
  async function passwordEmail(actor: Actor, uid: string) {
    return locked(actor, async () => {
      const user = await targetUser(uid);
      if (user.disabled || !user.email)
        throw new UserManagementError(
          "Passwort-Mail erfordert ein aktives Konto mit E-Mail-Adresse.",
        );
      try {
        await sendPasswordEmail(user.email);
      } catch {
        throw new UserManagementError(
          "Konto bleibt bestehen. Passwort-Mail fehlgeschlagen; bitte später erneut senden.",
        );
      }
    });
  }
  async function photo(actor: Actor, uid: string, store: () => Promise<string>) {
    return locked(actor, async () => {
      await targetUser(uid);
      const path = await store();
      await profiles
        .doc(uid)
        .set(
          { photo: path, updatedAt: FieldValue.serverTimestamp(), updatedByUid: actor.uid },
          { merge: true },
        );
    });
  }
  return { list, save, archive, passwordEmail, photo };
}
