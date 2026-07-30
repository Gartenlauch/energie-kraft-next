"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import {
  createFaqCategory,
  deleteFaqCategory,
  FaqCategoryAlreadyExistsError,
  FaqCategoryInUseError,
  FaqCategoryNotFoundError,
  updateFaqCategory,
} from "@/lib/faq/category-repository";
import {
  parseFaqCategoryCreateFormData,
  parseFaqCategoryDeleteFormData,
  parseFaqCategoryUpdateFormData,
} from "@/lib/validation/faq-category-admin";

const FAQ_CATEGORIES_PATH =
  "/admin/faqs/categories";

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
    error instanceof
      FaqCategoryAlreadyExistsError ||
    error instanceof FaqCategoryNotFoundError ||
    error instanceof FaqCategoryInUseError
  ) {
    return error.message;
  }

  return fallbackMessage;
}

function redirectToCategoryAdmin(
  status: ActionStatus,
  message: string,
): never {
  const parameters = new URLSearchParams({
    status,
    message,
  });

  redirect(
    `${FAQ_CATEGORIES_PATH}?${parameters.toString()}`,
  );
}

function revalidateCategoryAdmin(): void {
  revalidatePath(FAQ_CATEGORIES_PATH);
  revalidatePath("/admin");
}

export async function createFaqCategoryAction(
  formData: FormData,
) {
  const session = await requireAdminSession();

  try {
    const input =
      parseFaqCategoryCreateFormData(
        formData,
      );

    await createFaqCategory(
      input,
      session.uid,
    );
  } catch (error) {
    redirectToCategoryAdmin(
      "error",
      getActionErrorMessage(
        error,
        "Die FAQ-Kategorie konnte nicht erstellt werden.",
      ),
    );
  }

  revalidateCategoryAdmin();

  redirectToCategoryAdmin(
    "success",
    "Die FAQ-Kategorie wurde erstellt.",
  );
}

export async function updateFaqCategoryAction(
  formData: FormData,
) {
  const session = await requireAdminSession();

  try {
    const { id, input } =
      parseFaqCategoryUpdateFormData(
        formData,
      );

    await updateFaqCategory(
      id,
      input,
      session.uid,
    );
  } catch (error) {
    redirectToCategoryAdmin(
      "error",
      getActionErrorMessage(
        error,
        "Die FAQ-Kategorie konnte nicht aktualisiert werden.",
      ),
    );
  }

  revalidateCategoryAdmin();

  redirectToCategoryAdmin(
    "success",
    "Die FAQ-Kategorie wurde aktualisiert.",
  );
}

export async function deleteFaqCategoryAction(
  formData: FormData,
) {
  await requireAdminSession();

  try {
    const categoryId =
      parseFaqCategoryDeleteFormData(
        formData,
      );

    await deleteFaqCategory(categoryId);
  } catch (error) {
    redirectToCategoryAdmin(
      "error",
      getActionErrorMessage(
        error,
        "Die FAQ-Kategorie konnte nicht gelöscht werden.",
      ),
    );
  }

  revalidateCategoryAdmin();

  redirectToCategoryAdmin(
    "success",
    "Die FAQ-Kategorie wurde gelöscht.",
  );
}