"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import {
  ContactLeadNotFoundError,
  deleteContactLead,
  updateContactLeadStatus,
} from "@/lib/leads/contact-lead-repository";
import {
  parseContactLeadDeleteFormData,
  parseContactLeadStatusUpdateFormData,
} from "@/lib/validation/contact-lead-admin";

const CONTACT_LEAD_ADMIN_PATH =
  "/admin/anfragen";

type ActionStatus = "success" | "error";

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

  if (
    error instanceof ContactLeadNotFoundError
  ) {
    return error.message;
  }

  return fallbackMessage;
}

function redirectToLeadAdmin(
  result: ActionStatus,
  message: string,
): never {
  const parameters = new URLSearchParams({
    result,
    message,
  });

  redirect(
    `${CONTACT_LEAD_ADMIN_PATH}?${parameters.toString()}`,
  );
}

function revalidateLeadAdmin(): void {
  revalidatePath(CONTACT_LEAD_ADMIN_PATH);
  revalidatePath("/admin");
}

export async function updateContactLeadStatusAction(
  formData: FormData,
) {
  const session = await requireAdminSession();

  try {
    const { id, status } =
      parseContactLeadStatusUpdateFormData(
        formData,
      );

    await updateContactLeadStatus(
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

export async function deleteContactLeadAction(
  formData: FormData,
) {
  await requireAdminSession();

  try {
    const id =
      parseContactLeadDeleteFormData(
        formData,
      );

    await deleteContactLead(id);
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