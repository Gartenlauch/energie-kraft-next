import { z } from "zod";

import {
  CONTACT_LEAD_STATUS_VALUES,
  type ContactLeadStatus,
} from "@/types/contact-lead";

const contactLeadIdSchema = z
  .string()
  .trim()
  .min(1, "Die Anfrage-ID fehlt.")
  .max(200, "Die Anfrage-ID ist ungültig.");

const contactLeadStatusSchema = z.enum(
  CONTACT_LEAD_STATUS_VALUES,
);

export interface ContactLeadStatusUpdate {
  id: string;
  status: ContactLeadStatus;
}

export function parseContactLeadStatusUpdateFormData(
  formData: FormData,
): ContactLeadStatusUpdate {
  return {
    id: contactLeadIdSchema.parse(
      formData.get("id"),
    ),

    status: contactLeadStatusSchema.parse(
      formData.get("status"),
    ),
  };
}

export function parseContactLeadDeleteFormData(
  formData: FormData,
): string {
  return contactLeadIdSchema.parse(
    formData.get("id"),
  );
}