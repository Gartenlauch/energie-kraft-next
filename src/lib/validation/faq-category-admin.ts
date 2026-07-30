import { z } from "zod";

import { faqCategoryCreateSchema } from "@/lib/validation/faq";
import type {
  FaqCategoryAdminUpdateInput,
  FaqCategoryCreateInput,
} from "@/types/faq";

const faqCategoryIdSchema =
  faqCategoryCreateSchema.shape.slug;

export const faqCategoryAdminUpdateSchema =
  z.object({
    id: faqCategoryIdSchema,
    name: faqCategoryCreateSchema.shape.name,
    sortOrder:
      faqCategoryCreateSchema.shape.sortOrder,
    isActive: z.boolean(),
  });

export const faqCategoryDeleteSchema = z.object({
  id: faqCategoryIdSchema,
  confirmed: z.literal(true),
});

export interface ParsedFaqCategoryAdminUpdate {
  id: string;
  input: FaqCategoryAdminUpdateInput;
}

function parseRequiredNumber(
  value: FormDataEntryValue | null,
): number {
  if (
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    return Number.NaN;
  }

  return Number(value);
}

function parseCheckbox(
  value: FormDataEntryValue | null,
): boolean {
  return value === "on" || value === "true";
}

export function parseFaqCategoryCreateFormData(
  formData: FormData,
): FaqCategoryCreateInput {
  return faqCategoryCreateSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    sortOrder: parseRequiredNumber(
      formData.get("sortOrder"),
    ),
    isActive: parseCheckbox(
      formData.get("isActive"),
    ),
  });
}

export function parseFaqCategoryUpdateFormData(
  formData: FormData,
): ParsedFaqCategoryAdminUpdate {
  const parsed =
    faqCategoryAdminUpdateSchema.parse({
      id: formData.get("id"),
      name: formData.get("name"),
      sortOrder: parseRequiredNumber(
        formData.get("sortOrder"),
      ),
      isActive: parseCheckbox(
        formData.get("isActive"),
      ),
    });

  return {
    id: parsed.id,
    input: {
      name: parsed.name,
      sortOrder: parsed.sortOrder,
      isActive: parsed.isActive,
    },
  };
}

export function parseFaqCategoryDeleteFormData(
  formData: FormData,
): string {
  const parsed = faqCategoryDeleteSchema.parse({
    id: formData.get("id"),
    confirmed: parseCheckbox(
      formData.get("confirmed"),
    ),
  });

  return parsed.id;
}