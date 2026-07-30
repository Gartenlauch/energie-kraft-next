"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import { FaqCategoryNotFoundError } from "@/lib/faq/category-repository";
import {
  createFaqEntry,
  deleteFaqEntry,
  FaqEntryNotFoundError,
  updateFaqEntry,
} from "@/lib/faq/entry-repository";
import {
  parseFaqEntryCreateFormData,
  parseFaqEntryDeleteFormData,
  parseFaqEntryUpdateFormData,
} from "@/lib/validation/faq-entry-admin";

const FAQ_ADMIN_PATH = "/admin/faqs";

type ActionStatus = "success" | "error";

function getActionErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? fallbackMessage;
  }

  if (error instanceof FaqEntryNotFoundError || error instanceof FaqCategoryNotFoundError) {
    return error.message;
  }

  return fallbackMessage;
}

function redirectToFaqAdmin(status: ActionStatus, message: string): never {
  const parameters = new URLSearchParams({
    status,
    message,
  });

  redirect(`${FAQ_ADMIN_PATH}?${parameters.toString()}`);
}

function revalidateFaqAdmin(): void {
  revalidatePath(FAQ_ADMIN_PATH);
  revalidatePath("/admin/faqs/categories");
  revalidatePath("/admin");
}

export async function createFaqEntryAction(formData: FormData) {
  const session = await requireAdminSession();

  try {
    const input = parseFaqEntryCreateFormData(formData);

    await createFaqEntry(input, session.uid);
  } catch (error) {
    redirectToFaqAdmin(
      "error",
      getActionErrorMessage(error, "Der FAQ-Eintrag konnte nicht erstellt werden."),
    );
  }

  revalidateFaqAdmin();

  redirectToFaqAdmin("success", "Der FAQ-Eintrag wurde erstellt.");
}

export async function updateFaqEntryAction(formData: FormData) {
  const session = await requireAdminSession();

  try {
    const { id, input } = parseFaqEntryUpdateFormData(formData);

    await updateFaqEntry(id, input, session.uid);
  } catch (error) {
    redirectToFaqAdmin(
      "error",
      getActionErrorMessage(error, "Der FAQ-Eintrag konnte nicht aktualisiert werden."),
    );
  }

  revalidateFaqAdmin();

  redirectToFaqAdmin("success", "Der FAQ-Eintrag wurde aktualisiert.");
}

export async function deleteFaqEntryAction(formData: FormData) {
  await requireAdminSession();

  try {
    const entryId = parseFaqEntryDeleteFormData(formData);

    await deleteFaqEntry(entryId);
  } catch (error) {
    redirectToFaqAdmin(
      "error",
      getActionErrorMessage(error, "Der FAQ-Eintrag konnte nicht gelöscht werden."),
    );
  }

  revalidateFaqAdmin();

  redirectToFaqAdmin("success", "Der FAQ-Eintrag wurde gelöscht.");
}
