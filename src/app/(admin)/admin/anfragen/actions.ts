"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { requireAdminSession, requireStaffSession } from "@/lib/auth/session";
import {
  deleteLead,
  LeadNotFoundError,
  updateLeadStatus,
  updateLeadStatuses,
} from "@/lib/leads/lead-repository";
import {
  parseLeadDeleteFormData,
  parseLeadStatusUpdateFormData,
} from "@/lib/validation/lead-admin";
import { LEAD_STATUS_VALUES, type LeadStatus } from "@/types/lead";

const LEAD_ADMIN_PATH =
  "/admin/anfragen";

type ActionStatus =
  | "success"
  | "error";

function getActionErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (error instanceof ZodError) {
    return (
      error.issues[0]?.message ??
      fallbackMessage
    );
  }

  if (error instanceof LeadNotFoundError) {
    return error.message;
  }

  return fallbackMessage;
}

function redirectToLeadAdmin(
  result: ActionStatus,
  message: string,
): never {
  const parameters =
    new URLSearchParams({
      result,
      message,
    });

  redirect(
    `${LEAD_ADMIN_PATH}?${parameters.toString()}`,
  );
}

function revalidateLeadAdmin(): void {
  revalidatePath(LEAD_ADMIN_PATH);
  revalidatePath("/admin");
}

export async function updateLeadStatusAction(
  formData: FormData,
) {
  const session =
    await requireStaffSession();

  try {
    const { id, status } =
      parseLeadStatusUpdateFormData(
        formData,
      );

    await updateLeadStatus(
      id,
      status,
      { uid: session.uid, email: session.email },
    );
  } catch (error) {
    redirectToLeadAdmin(
      "error",
      getActionErrorMessage(
        error,
        "Der Status der Anfrage konnte nicht aktualisiert werden.",
      ),
    );
  }

  revalidateLeadAdmin();

  redirectToLeadAdmin(
    "success",
    "Der Status der Anfrage wurde aktualisiert.",
  );
}

export async function deleteLeadAction(
  formData: FormData,
) {
  await requireAdminSession();

  try {
    const id =
      parseLeadDeleteFormData(
        formData,
      );

    await deleteLead(id);
  } catch (error) {
    redirectToLeadAdmin(
      "error",
      getActionErrorMessage(
        error,
        "Die Anfrage konnte nicht gelöscht werden.",
      ),
    );
  }

  revalidateLeadAdmin();

  redirectToLeadAdmin(
    "success",
    "Die Anfrage wurde endgültig gelöscht.",
  );
}

export async function bulkUpdateLeadStatusAction(formData: FormData) {
  const session = await requireStaffSession();
  let changed = 0;
  try {
    const status = String(formData.get("status"));
    const ids = formData.getAll("ids").map(String).filter((id) => id.length > 0);
    if (!(LEAD_STATUS_VALUES as readonly string[]).includes(status) || ids.length === 0 || ids.length > 100) {
      throw new Error("Ungültige Sammelaktion.");
    }
    changed = await updateLeadStatuses(ids, status as LeadStatus, { uid: session.uid, email: session.email });
  } catch (error) {
    redirectToLeadAdmin("error", getActionErrorMessage(error, "Die ausgewählten Anfragen konnten nicht aktualisiert werden."));
  }
  revalidateLeadAdmin();
  redirectToLeadAdmin("success", `${changed} Anfragen wurden aktualisiert.`);
}
