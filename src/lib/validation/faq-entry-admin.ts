import { z } from "zod";

import { FAQ_ROUTE_KEYS } from "@/config/routes";
import { faqEntryCreateSchema } from "@/lib/validation/faq";
import type { FaqEntryAdminUpdateInput, FaqEntryCreateInput, FaqPlacement } from "@/types/faq";

const faqEntryIdSchema = z
  .string()
  .trim()
  .min(1, "Die FAQ-ID ist erforderlich.")
  .max(128, "Die FAQ-ID darf höchstens 128 Zeichen enthalten.")
  .refine((value) => !value.includes("/"), "Die FAQ-ID darf keinen Schrägstrich enthalten.")
  .refine((value) => !/^__.*__$/.test(value), "Diese FAQ-ID ist reserviert.");

export const faqEntryAdminUpdateSchema = faqEntryCreateSchema.extend({
  id: faqEntryIdSchema,
});

export const faqEntryDeleteSchema = z.object({
  id: faqEntryIdSchema,
  confirmed: z.literal(true),
});

export interface ParsedFaqEntryAdminUpdate {
  id: string;
  input: FaqEntryAdminUpdateInput;
}

function parseRequiredNumber(value: FormDataEntryValue | null): number {
  if (typeof value !== "string" || value.trim() === "") {
    return Number.NaN;
  }

  return Number(value);
}

function parseCheckbox(value: FormDataEntryValue | null): boolean {
  return value === "on" || value === "true";
}

function parsePlacements(formData: FormData): FaqPlacement[] {
  const placements: FaqPlacement[] = [];

  for (const routeKey of FAQ_ROUTE_KEYS) {
    const fieldPrefix = `placement.${routeKey}`;

    const isEnabled = parseCheckbox(formData.get(`${fieldPrefix}.enabled`));

    if (!isEnabled) {
      continue;
    }

    placements.push({
      routeKey,
      sortOrder: parseRequiredNumber(formData.get(`${fieldPrefix}.sortOrder`)),
      showInSchema: parseCheckbox(formData.get(`${fieldPrefix}.showInSchema`)),
    });
  }

  return placements;
}

function getFaqEntryInputFromFormData(formData: FormData): FaqEntryCreateInput {
  return faqEntryCreateSchema.parse({
    question: formData.get("question"),
    answer: formData.get("answer"),
    categoryId: formData.get("categoryId"),
    placements: parsePlacements(formData),
    isPublished: parseCheckbox(formData.get("isPublished")),
  });
}

export function parseFaqEntryCreateFormData(formData: FormData): FaqEntryCreateInput {
  return getFaqEntryInputFromFormData(formData);
}

export function parseFaqEntryUpdateFormData(formData: FormData): ParsedFaqEntryAdminUpdate {
  const input = getFaqEntryInputFromFormData(formData);

  const parsed = faqEntryAdminUpdateSchema.parse({
    id: formData.get("id"),
    ...input,
  });

  const { id, ...updateInput } = parsed;

  return {
    id,
    input: updateInput,
  };
}

export function parseFaqEntryDeleteFormData(formData: FormData): string {
  const parsed = faqEntryDeleteSchema.parse({
    id: formData.get("id"),
    confirmed: parseCheckbox(formData.get("confirmed")),
  });

  return parsed.id;
}
