import { z } from "zod";

import { LEAD_STATUS_VALUES, type LeadStatus } from "@/types/lead";

const submissionIdSchema = z.string().trim().min(1, "Die ID fehlt.").max(200, "Die ID ist ungültig.");
const statusSchema = z.enum(LEAD_STATUS_VALUES);

export function parseSubmissionStatusFormData(formData: FormData): { id: string; status: LeadStatus } {
  return {
    id: submissionIdSchema.parse(formData.get("id")),
    status: statusSchema.parse(formData.get("status")),
  };
}

export function parseSubmissionDeleteFormData(formData: FormData) {
  return submissionIdSchema.parse(formData.get("id"));
}
