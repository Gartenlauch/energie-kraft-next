"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { requireAdminSession, requireStaffSession } from "@/lib/auth/session";
import {
  ReferralNotFoundError,
  deleteReferral,
  updateReferralStatus,
  updateReferralStatuses,
} from "@/lib/submissions/referral-repository";
import {
  parseSubmissionDeleteFormData,
  parseSubmissionStatusFormData,
} from "@/lib/validation/submission-admin";
import { LEAD_STATUS_VALUES, type LeadStatus } from "@/types/lead";

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
  const session = await requireStaffSession();
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

export async function bulkUpdateReferralStatusAction(formData: FormData) {
  const session = await requireStaffSession();
  let changed = 0;
  try {
    const status = String(formData.get("status"));
    const ids = formData.getAll("ids").map(String).filter(Boolean);
    if (!(LEAD_STATUS_VALUES as readonly string[]).includes(status) || ids.length === 0 || ids.length > 100) throw new Error();
    changed = await updateReferralStatuses(ids, status as LeadStatus, session.uid);
  } catch { finish("error", "Die ausgewählten Empfehlungen konnten nicht aktualisiert werden."); }
  revalidatePath(PATH); revalidatePath("/admin");
  finish("success", `${changed} Empfehlungen wurden aktualisiert.`);
}
