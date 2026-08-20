"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { ADMIN_LOGIN_PATH } from "@/config/auth";
import { firebaseAuth } from "@/lib/firebase/client";


export function AdminLogoutButton() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  async function handleLogout() {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/api/admin/session",
        {
          method: "DELETE",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          "Die Abmeldung ist fehlgeschlagen.",
        );
      }
      await signOut(firebaseAuth).catch(
        () => undefined,
      );
      router.replace(ADMIN_LOGIN_PATH);
      router.refresh();
    } catch {
      setErrorMessage(
        "Die Abmeldung konnte nicht abgeschlossen werden.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      {errorMessage ? (
        <span
          className="text-sm text-red-700"
          role="alert"
        >
          {errorMessage}
        </span>
      ) : null}

      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleLogout}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting
          ? "Abmeldung …"
          : "Abmelden"}
      </button>
    </div>
  );
}