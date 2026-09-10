"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import {
  ReferralNotFoundError,
  deleteReferral,
  updateReferralStatus,
} from "@/lib/submissions/referral-repository";
import {
  parseSubmissionDeleteFormData,
  parseSubmissionStatusFormData,
} from "@/lib/validation/submission-admin";

const PATH = "/admin/empfehlungen";
function finish(result: "success" | "error", message: string): never {
  redirect(`${PATH}?${new URLSearchParams({ result, message }).toString()}`);
}
function message(error: unknown, fallback: string) {
  if (error instanceof ZodError) return error.issues[0]?.message ?? fallback;
  if (error instanceof ReferralNotFoundError) return error.message;
  return fallback;
}

export async function updateReferralStatusAction(formData: FormData) {
  const session = await requireAdminSession();
  try {
    const input = parseSubmissionStatusFormData(formData);
    await updateReferralStatus(input.id, input.status, session.uid);
  } catch (error) {
    finish("error", message(error, "Der Empfehlungsstatus konnte nicht aktualisiert werden."));
  }
  revalidatePath(PATH);
  revalidatePath("/admin");
  finish("success", "Der Empfehlungsstatus wurde aktualisiert.");
}

export async function deleteReferralAction(formData: FormData) {
  await requireAdminSession();
  try {
    await deleteReferral(parseSubmissionDeleteFormData(formData));
  } catch (error) {
    finish("error", message(error, "Die Empfehlung konnte nicht gelöscht werden."));
  }
  revalidatePath(PATH);
  revalidatePath("/admin");
  finish("success", "Die Empfehlung wurde endgültig gelöscht.");
}
