"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import {
  deleteLead,
  LeadNotFoundError,
  updateLeadStatus,
} from "@/lib/leads/lead-repository";
import {
  parseLeadDeleteFormData,
  parseLeadStatusUpdateFormData,
} from "@/lib/validation/lead-admin";

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
    await requireAdminSession();

  try {
    const { id, status } =
      parseLeadStatusUpdateFormData(
        formData,
      );

    await updateLeadStatus(
      id,
      status,
      session.uid,
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