"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { requireAdminSession } from "@/lib/auth/session";
import { userManagement } from "@/lib/admin/users-server";
import { UserManagementError } from "@/lib/admin/user-management";

export type UserActionResult = { ok: boolean; message: string; uid?: string };
export async function manageUserAction(
  command: "save" | "archive" | "password",
  input: unknown,
  uid?: string,
): Promise<UserActionResult> {
  const actor = await requireAdminSession();
  try {
    if (command === "save") {
      const savedUid = await userManagement.save(actor, input, uid);
      revalidatePath("/admin", "layout");
      return {
        ok: true,
        uid: savedUid,
        message: uid
          ? "Profil gespeichert. Nach Rollen-, E-Mail- oder Aktivitätsänderungen ist eine neue Anmeldung erforderlich."
          : "Benutzer angelegt. Jetzt kann eine Passwort-Mail gesendet werden.",
      };
    }
    if (!uid) throw new UserManagementError("Benutzer fehlt.");
    if (command === "archive")
      await userManagement.archive(actor, uid, typeof input === "string" ? input : "");
    else if (command === "password") await userManagement.passwordEmail(actor, uid);
    else throw new UserManagementError("Unbekannte Aktion.");
    revalidatePath("/admin/einstellungen/benutzer");
    return {
      ok: true,
      message:
        command === "archive"
          ? "Login gelöscht; Profilhistorie archiviert."
          : "Firebase hat die Passwort-Mail angefordert. Dies ist keine Zustellbestätigung.",
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof UserManagementError
          ? error.message
          : error instanceof ZodError
            ? "Bitte alle Pflichtfelder, E-Mail und Rolle prüfen."
            : "Die Benutzeränderung konnte nicht abgeschlossen werden. E-Mail möglicherweise bereits vergeben; Liste prüfen und erneut versuchen.",
    };
  }
}
