import { z } from "zod";

import {
  LEAD_STATUS_VALUES,
  type LeadStatus,
} from "@/types/lead";

const leadIdSchema = z
  .string()
  .trim()
  .min(
    1,
    "Die Anfrage-ID fehlt.",
  )
  .max(
    200,
    "Die Anfrage-ID ist ungültig.",
  );

const leadStatusSchema = z.enum(
  LEAD_STATUS_VALUES,
);

export interface LeadStatusUpdate {
  id: string;
  status: LeadStatus;
}

export function parseLeadStatusUpdateFormData(
  formData: FormData,
): LeadStatusUpdate {
  return {
    id: leadIdSchema.parse(
      formData.get("id"),
    ),

    status:
      leadStatusSchema.parse(
        formData.get("status"),
      ),
  };
}

export function parseLeadDeleteFormData(
  formData: FormData,
): string {
  return leadIdSchema.parse(
    formData.get("id"),
  );
}