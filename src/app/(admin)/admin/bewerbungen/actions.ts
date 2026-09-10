"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import {
  ApplicationNotFoundError,
  ApplicationDocumentCleanupError,
  deleteApplication,
  updateApplicationStatus,
} from "@/lib/submissions/application-repository";
import {
  parseSubmissionDeleteFormData,
  parseSubmissionStatusFormData,
} from "@/lib/validation/submission-admin";

const PATH = "/admin/bewerbungen";

function finish(result: "success" | "error", message: string): never {
  redirect(`${PATH}?${new URLSearchParams({ result, message }).toString()}`);
}

function message(error: unknown, fallback: string) {
  if (error instanceof ZodError) return error.issues[0]?.message ?? fallback;
  if (error instanceof ApplicationNotFoundError || error instanceof ApplicationDocumentCleanupError)
    return error.message;
  return fallback;
}

export async function updateApplicationStatusAction(formData: FormData) {
  const session = await requireAdminSession();
  try {
    const input = parseSubmissionStatusFormData(formData);
    await updateApplicationStatus(input.id, input.status, session.uid);
  } catch (error) {
    finish("error", message(error, "Der Bewerbungsstatus konnte nicht aktualisiert werden."));
  }
  revalidatePath(PATH);
  revalidatePath("/admin");
  finish("success", "Der Bewerbungsstatus wurde aktualisiert.");
}

export async function deleteApplicationAction(formData: FormData) {
  await requireAdminSession();
  try {
    await deleteApplication(parseSubmissionDeleteFormData(formData));
  } catch (error) {
    finish("error", message(error, "Die Bewerbung konnte nicht gelöscht werden."));
  }
  revalidatePath(PATH);
  revalidatePath("/admin");
  finish("success", "Die Bewerbung wurde endgültig gelöscht.");
}
