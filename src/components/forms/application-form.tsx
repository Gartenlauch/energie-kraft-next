"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import {
  ErrorSummary,
  FieldError,
  formInputClassName,
} from "@/components/forms/form-control";
import { activeJobOpenings } from "@/content/jobs";
import { submitApplication } from "@/lib/submissions/submit-application";
import { applicationInputSchema } from "@/lib/validation/application";
import type { ApplicationInput, Salutation } from "@/types/application";

type ApplicationField = Exclude<keyof ApplicationInput, "submissionId" | "formStartedAt">;
type ApplicationErrors = Partial<Record<ApplicationField, string>>;

interface ApplicationFormValues {
  jobId: string;
  salutation: Salutation | "";
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  email: string;
  phone: string;
  qualificationExperience: string;
  privacyAccepted: boolean;
  website: string;
}

function createSubmissionId() {
  return globalThis.crypto?.randomUUID?.() ?? `fallback-${Date.now()}-${Math.random()}`;
}

function createInitialValues(initialJobId?: string): ApplicationFormValues {
  return {
    jobId: initialJobId ?? "",
    salutation: "",
    firstName: "",
    lastName: "",
    street: "",
    postalCode: "",
    city: "",
    email: "",
    phone: "",
    qualificationExperience: "",
    privacyAccepted: false,
    website: "",
  };
}

function createInput(
  values: ApplicationFormValues,
  submissionId: string,
  formStartedAt: number,
): ApplicationInput {
  return {
    submissionId,
    jobId: values.jobId,
    ...(values.salutation ? { salutation: values.salutation } : {}),
    firstName: values.firstName,
    lastName: values.lastName,
    street: values.street,
    postalCode: values.postalCode,
    city: values.city,
    email: values.email,
    phone: values.phone,
    qualificationExperience: values.qualificationExperience,
    privacyAccepted: values.privacyAccepted,
    website: values.website,
    formStartedAt,
  };
}

export function ApplicationForm({ initialJobId }: { initialJobId?: string }) {
  const [values, setValues] = useState(() => createInitialValues(initialJobId));
  const [submissionId, setSubmissionId] = useState(createSubmissionId);
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const [errors, setErrors] = useState<ApplicationErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function updateValue<Key extends keyof ApplicationFormValues>(
    key: Key,
    value: ApplicationFormValues[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key as ApplicationField]) return current;
      const next = { ...current };
      delete next[key as ApplicationField];
      return next;
    });
    setGeneralError(null);
  }

  function focusFirstError() {
    window.requestAnimationFrame(() => {
      formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
    });
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    const parsed = applicationInputSchema.safeParse(
      createInput(values, submissionId, formStartedAt),
    );

    if (!parsed.success) {
      const nextErrors: ApplicationErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !(field in nextErrors)) {
          nextErrors[field as ApplicationField] = issue.message;
        }
      }
      setErrors(nextErrors);
      setGeneralError("Die Bewerbung konnte noch nicht gesendet werden.");
      focusFirstError();
      return;
    }

    setErrors({});
    setGeneralError(null);
    setIsSubmitting(true);
    try {
      const result = await submitApplication(parsed.data);
      setApplicationId(result.applicationId);
    } catch {
      setGeneralError(
        "Deine Bewerbung konnte momentan nicht übermittelt werden. Bitte versuche es erneut oder kontaktiere uns telefonisch.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (applicationId) {
    return (
      <div className="premium-card p-7 md:p-10" role="status">
        <p className="eyebrow">Bewerbung eingegangen</p>
        <h2 className="section-title mt-4">Vielen Dank für dein Interesse.</h2>
        <p className="mt-5 text-lg leading-8 text-[var(--text-muted)]">
          Deine Bewerbung wurde erfolgreich übermittelt.
        </p>
        <p className="mt-5 text-sm text-[var(--text-subtle)]">
          Referenz: <span className="font-mono">{applicationId}</span>
        </p>
        <button
          type="button"
          className="button-secondary mt-7"
          onClick={() => {
            setValues(createInitialValues(initialJobId));
            setSubmissionId(createSubmissionId());
            setFormStartedAt(Date.now());
            setApplicationId(null);
          }}
        >
          Weitere Bewerbung senden
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      noValidate
      aria-busy={isSubmitting}
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
      className="premium-card min-w-0 p-5 md:p-8 lg:p-10"
    >
      {generalError ? <ErrorSummary>{generalError}</ErrorSummary> : null}

      <fieldset disabled={isSubmitting}>
        <legend className="text-2xl font-bold">Stelle & persönliche Angaben</legend>
        <div className="mt-7 grid min-w-0 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="application-job" className="block text-sm font-semibold">Stelle *</label>
            <select
              id="application-job"
              value={values.jobId}
              aria-invalid={errors.jobId ? true : undefined}
              aria-describedby={errors.jobId ? "application-job-error" : undefined}
              onChange={(event) => updateValue("jobId", event.currentTarget.value)}
              className={`${formInputClassName} ${errors.jobId ? "border-red-700" : ""}`}
            >
              <option value="">Bitte auswählen</option>
              {activeJobOpenings.map((job) => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
            <FieldError id="application-job-error" message={errors.jobId} />
          </div>

          <div>
            <label htmlFor="application-salutation" className="block text-sm font-semibold">Anrede</label>
            <select
              id="application-salutation"
              autoComplete="honorific-prefix"
              value={values.salutation}
              onChange={(event) => updateValue("salutation", event.currentTarget.value as Salutation | "")}
              className={formInputClassName}
            >
              <option value="">Keine Angabe</option>
              <option value="frau">Frau</option>
              <option value="herr">Herr</option>
              <option value="divers">Divers</option>
            </select>
          </div>
          <div />

          {([
            ["firstName", "Vorname *", "given-name", "text"],
            ["lastName", "Nachname *", "family-name", "text"],
            ["street", "Straße und Hausnummer *", "street-address", "text"],
            ["postalCode", "Postleitzahl *", "postal-code", "text"],
            ["city", "Ort *", "address-level2", "text"],
            ["email", "E-Mail *", "email", "email"],
            ["phone", "Telefonnummer *", "tel", "tel"],
          ] as const).map(([key, label, autoComplete, type]) => (
            <div key={key} className={key === "street" ? "md:col-span-2" : ""}>
              <label htmlFor={`application-${key}`} className="block text-sm font-semibold">{label}</label>
              <input
                id={`application-${key}`}
                type={type}
                autoComplete={autoComplete}
                value={values[key]}
                aria-invalid={errors[key] ? true : undefined}
                aria-describedby={errors[key] ? `application-${key}-error` : undefined}
                onChange={(event) => updateValue(key, event.currentTarget.value)}
                className={`${formInputClassName} ${errors[key] ? "border-red-700" : ""}`}
              />
              <FieldError id={`application-${key}-error`} message={errors[key]} />
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset disabled={isSubmitting} className="border-border-default mt-10 border-t pt-8">
        <legend className="text-2xl font-bold">Qualifikation & Erfahrung</legend>
        <p id="application-experience-hint" className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
          Beschreibe kurz deine Ausbildung, relevante Berufserfahrung und was dich an der Stelle interessiert. Ein Datei-Upload ist nicht erforderlich.
        </p>
        <textarea
          id="application-experience"
          rows={8}
          value={values.qualificationExperience}
          aria-invalid={errors.qualificationExperience ? true : undefined}
          aria-describedby={`application-experience-hint${errors.qualificationExperience ? " application-experience-error" : ""}`}
          onChange={(event) => updateValue("qualificationExperience", event.currentTarget.value)}
          className={`${formInputClassName} resize-y ${errors.qualificationExperience ? "border-red-700" : ""}`}
        />
        <FieldError id="application-experience-error" message={errors.qualificationExperience} />
      </fieldset>

      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="application-website">Website</label>
        <input
          id="application-website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => updateValue("website", event.currentTarget.value)}
        />
      </div>

      <fieldset disabled={isSubmitting} className="border-border-default mt-10 border-t pt-8">
        <legend className="sr-only">Datenschutz</legend>
        <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm leading-6">
          <input
            type="checkbox"
            checked={values.privacyAccepted}
            aria-invalid={errors.privacyAccepted ? true : undefined}
            aria-describedby={errors.privacyAccepted ? "application-privacy-error" : undefined}
            onChange={(event) => updateValue("privacyAccepted", event.currentTarget.checked)}
            className="mt-1 size-5 shrink-0"
          />
          <span>
            Ich habe die <Link href="/datenschutz" className="text-brand-primary underline">Datenschutzerklärung</Link> zur Kenntnis genommen und stimme der elektronischen Verarbeitung meiner Daten zum Zweck der Bewerbung zu. *
          </span>
        </label>
        <FieldError id="application-privacy-error" message={errors.privacyAccepted} />
      </fieldset>

      <button type="submit" disabled={isSubmitting} className="button-primary mt-8 w-full sm:w-auto">
        {isSubmitting ? "Bewerbung wird übermittelt …" : "Bewerbung absenden"}
      </button>
    </form>
  );
}
