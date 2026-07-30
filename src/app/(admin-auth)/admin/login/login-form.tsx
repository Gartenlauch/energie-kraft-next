"use client";

import { FirebaseError } from "firebase/app";
import {
  inMemoryPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  useState,
  type FormEvent,
} from "react";

import { ADMIN_HOME_PATH } from "@/config/auth";
import { firebaseAuth } from "@/lib/firebase/client";

interface SessionErrorResponse {
  error?: string;
}

function getFirebaseLoginError(
  error: unknown,
): string {
  if (!(error instanceof FirebaseError)) {
    return error instanceof Error
      ? error.message
      : "Die Anmeldung ist fehlgeschlagen.";
  }

  switch (error.code) {
    case "auth/invalid-credential":
    case "auth/invalid-login-credentials":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "E-Mail-Adresse oder Passwort sind nicht korrekt.";

    case "auth/invalid-email":
      return "Die E-Mail-Adresse ist ungültig.";

    case "auth/user-disabled":
      return "Dieses Benutzerkonto wurde deaktiviert.";

    case "auth/too-many-requests":
      return "Zu viele Anmeldeversuche. Bitte versuchen Sie es später erneut.";

    case "auth/network-request-failed":
      return "Die Verbindung zu Firebase Authentication ist fehlgeschlagen.";

    default:
      return "Die Anmeldung bei Firebase ist fehlgeschlagen.";
  }
}

export function AdminLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage(null);
    setIsSubmitting(true);

    let clientLoginCreated = false;

    try {
      await setPersistence(
        firebaseAuth,
        inMemoryPersistence,
      );

      const credential =
        await signInWithEmailAndPassword(
          firebaseAuth,
          email.trim(),
          password,
        );

      clientLoginCreated = true;

      const idToken =
        await credential.user.getIdToken(true);

      const response = await fetch(
        "/api/admin/session",
        {
          method: "POST",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            idToken,
          }),
        },
      );

      if (!response.ok) {
        const responseBody =
          (await response
            .json()
            .catch(
              () => null,
            )) as SessionErrorResponse | null;

        throw new Error(
          responseBody?.error ??
            "Die Admin-Sitzung konnte nicht erstellt werden.",
        );
      }

      router.replace(ADMIN_HOME_PATH);
      router.refresh();
    } catch (error) {
      setPassword("");
      setErrorMessage(
        getFirebaseLoginError(error),
      );
    } finally {
      if (clientLoginCreated) {
        await signOut(firebaseAuth).catch(
          () => undefined,
        );
      }

      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-800"
          htmlFor="admin-email"
        >
          E-Mail-Adresse
        </label>

        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          disabled={isSubmitting}
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-800"
          htmlFor="admin-password"
        >
          Passwort
        </label>

        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isSubmitting}
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {errorMessage ? (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
          aria-live="polite"
        >
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-emerald-900 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting
          ? "Anmeldung wird geprüft …"
          : "Anmelden"}
      </button>
    </form>
  );
}