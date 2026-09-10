"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { ErrorSummary, FieldError, formInputClassName } from "@/components/forms/form-control";
import { submitReferral } from "@/lib/submissions/submit-referral";
import {
  referralInputSchema,
  referralStepOneSchema,
  referralStepTwoSchema,
} from "@/lib/validation/referral";
import type { Salutation } from "@/types/application";
import type { ReferralInput } from "@/types/referral";

type PersonKey = "salutation" | "firstName" | "lastName" | "email";
type ReferredKey = PersonKey | "phone" | "street" | "postalCode" | "city";
type ReferralField =
  | `referrer.${PersonKey}`
  | `referredCustomer.${ReferredKey}`
  | "privacyAccepted"
  | "referredPersonPermissionConfirmed";
type ReferralErrors = Partial<Record<ReferralField, string>>;

interface ReferralValues {
  referrer: { salutation: Salutation | ""; firstName: string; lastName: string; email: string };
  referredCustomer: {
    salutation: Salutation | "";
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    postalCode: string;
    city: string;
  };
  consentAccepted: boolean;
  website: string;
}

const salutationLabels: Record<Salutation, string> = {
  frau: "Frau",
  herr: "Herr",
  divers: "Divers",
};

function createSubmissionId() {
  return globalThis.crypto?.randomUUID?.() ?? `fallback-${Date.now()}-${Math.random()}`;
}

function createInitialValues(): ReferralValues {
  return {
    referrer: { salutation: "", firstName: "", lastName: "", email: "" },
    referredCustomer: {
      salutation: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      street: "",
      postalCode: "",
      city: "",
    },
    consentAccepted: false,
    website: "",
  };
}

function toInput(
  values: ReferralValues,
  submissionId: string,
  formStartedAt: number,
): ReferralInput {
  const referredPhone = values.referredCustomer.phone.trim();
  return {
    submissionId,
    referrer: {
      ...values.referrer,
      salutation: values.referrer.salutation as Salutation,
    },
    referredCustomer: {
      ...values.referredCustomer,
      salutation: values.referredCustomer.salutation as Salutation,
      ...(referredPhone ? { phone: referredPhone } : { phone: undefined }),
    },
    privacyAccepted: values.consentAccepted,
    referredPersonPermissionConfirmed: values.consentAccepted,
    website: values.website,
    formStartedAt,
  };
}

export function ReferralForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [values, setValues] = useState(createInitialValues);
  const [submissionId, setSubmissionId] = useState(createSubmissionId);
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const [errors, setErrors] = useState<ReferralErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referralId, setReferralId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const stepTitleRef = useRef<HTMLHeadingElement>(null);

  function clearError(field: ReferralField) {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setGeneralError(null);
  }

  function updateReferrer<Key extends PersonKey>(key: Key, value: ReferralValues["referrer"][Key]) {
    setValues((current) => ({ ...current, referrer: { ...current.referrer, [key]: value } }));
    clearError(`referrer.${key}`);
  }

  function updateReferred<Key extends ReferredKey>(
    key: Key,
    value: ReferralValues["referredCustomer"][Key],
  ) {
    setValues((current) => ({
      ...current,
      referredCustomer: { ...current.referredCustomer, [key]: value },
    }));
    clearError(`referredCustomer.${key}`);
  }

  function focusFirstError() {
    window.requestAnimationFrame(() => {
      formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
    });
  }

  function moveToStep(nextStep: 1 | 2 | 3) {
    setStep(nextStep);
    setErrors({});
    setGeneralError(null);
    window.requestAnimationFrame(() => stepTitleRef.current?.focus());
  }

  function mapIssues(
    prefix: "referrer" | "referredCustomer",
    issues: readonly { path: PropertyKey[]; message: string }[],
  ) {
    const next: ReferralErrors = {};
    for (const issue of issues) {
      const key = issue.path[0];
      if (typeof key === "string") next[`${prefix}.${key}` as ReferralField] ??= issue.message;
    }
    setErrors(next);
    setGeneralError("Bitte prüfe die markierten Angaben, bevor du fortfährst.");
    focusFirstError();
  }

  function continueFromStepOne() {
    const parsed = referralStepOneSchema.safeParse(values.referrer);
    if (!parsed.success) {
      mapIssues("referrer", parsed.error.issues);
      return;
    }
    moveToStep(2);
  }

  function continueFromStepTwo() {
    const parsed = referralStepTwoSchema.safeParse({
      ...values.referredCustomer,
      phone: values.referredCustomer.phone.trim() || undefined,
    });
    if (!parsed.success) {
      mapIssues("referredCustomer", parsed.error.issues);
      return;
    }
    moveToStep(3);
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    const parsed = referralInputSchema.safeParse(toInput(values, submissionId, formStartedAt));
    if (!parsed.success) {
      const next: ReferralErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".") as ReferralField;
        next[key] ??= issue.message;
      }
      setErrors(next);
      setGeneralError("Die Empfehlung konnte noch nicht gesendet werden.");
      focusFirstError();
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setGeneralError(null);
    try {
      const result = await submitReferral(parsed.data);
      setReferralId(result.referralId);
    } catch {
      setGeneralError(
        "Deine Empfehlung konnte momentan nicht übermittelt werden. Bitte versuche es erneut oder kontaktiere uns telefonisch.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (referralId) {
    return (
      <div className="premium-card p-7 md:p-10" role="status">
        <p className="eyebrow">Empfehlung eingegangen</p>
        <h2 className="section-title mt-4">Vielen Dank für dein Vertrauen.</h2>
        <p className="mt-5 text-lg leading-8 text-[var(--text-muted)]">
          Deine Empfehlung wurde erfolgreich übermittelt.
        </p>
        <p className="mt-5 text-sm text-[var(--text-subtle)]">
          Referenz: <span className="font-mono">{referralId}</span>
        </p>
        <button
          type="button"
          className="button-secondary mt-7"
          onClick={() => {
            setValues(createInitialValues());
            setSubmissionId(createSubmissionId());
            setFormStartedAt(Date.now());
            setStep(1);
            setReferralId(null);
          }}
        >
          Weitere Empfehlung senden
        </button>
      </div>
    );
  }

  const personFields = [
    ["firstName", "Vorname *", "given-name", "text"],
    ["lastName", "Nachname *", "family-name", "text"],
    ["email", "E-Mail *", "email", "email"],
  ] as const;

  return (
    <form
      ref={formRef}
      noValidate
      aria-busy={isSubmitting}
      onSubmit={(event) => {
        event.preventDefault();
        if (step === 1) continueFromStepOne();
        else if (step === 2) continueFromStepTwo();
        else void handleSubmit();
      }}
      className="premium-card min-w-0 overflow-hidden"
    >
      <ol
        className="grid grid-cols-3 border-b border-[var(--border-default)] bg-[var(--surface-soft)]"
        aria-label="Formularfortschritt"
      >
        {["Ihre Angaben", "Empfohlene Person", "Prüfen"].map((label, index) => {
          const itemStep = (index + 1) as 1 | 2 | 3;
          const active = step === itemStep;
          const complete = step > itemStep;
          return (
            <li
              key={label}
              aria-current={active ? "step" : undefined}
              className={`min-w-0 border-l border-[var(--border-default)] px-2 py-4 text-center text-xs font-bold first:border-l-0 sm:px-4 sm:text-sm ${active ? "bg-brand-primary text-white" : complete ? "text-brand-primary" : "text-[var(--text-muted)]"}`}
            >
              <span className="block">0{itemStep}</span>
              <span className="mt-1 hidden sm:block">{label}</span>
            </li>
          );
        })}
      </ol>

      <div className="p-5 md:p-8 lg:p-10">
        {generalError ? <ErrorSummary>{generalError}</ErrorSummary> : null}
        <h2 ref={stepTitleRef} tabIndex={-1} className="text-2xl font-bold">
          {step === 1 ? "Ihre Angaben" : step === 2 ? "Empfohlene Person" : "Angaben prüfen"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          {step === 1
            ? "Wer spricht die Empfehlung aus?"
            : step === 2
              ? "Für wen dürfen wir ein mögliches Energieprojekt prüfen?"
              : "Bitte kontrolliere beide Bereiche vor der Einwilligung."}
        </p>

        {step === 1 ? (
          <fieldset disabled={isSubmitting} className="mt-7">
            <legend className="sr-only">Empfehlungsgeberin oder Empfehlungsgeber</legend>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="referrer-salutation" className="block text-sm font-semibold">
                  Anrede *
                </label>
                <select
                  id="referrer-salutation"
                  autoComplete="section-referrer honorific-prefix"
                  value={values.referrer.salutation}
                  aria-invalid={errors["referrer.salutation"] ? true : undefined}
                  aria-describedby={
                    errors["referrer.salutation"] ? "referrer-salutation-error" : undefined
                  }
                  onChange={(event) =>
                    updateReferrer("salutation", event.currentTarget.value as Salutation | "")
                  }
                  className={`${formInputClassName} ${errors["referrer.salutation"] ? "border-red-700" : ""}`}
                >
                  <option value="">Bitte auswählen</option>
                  {Object.entries(salutationLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <FieldError
                  id="referrer-salutation-error"
                  message={errors["referrer.salutation"]}
                />
              </div>
              {personFields.map(([key, label, autoComplete, type]) => (
                <div key={key} className={key === "email" ? "md:col-span-2" : ""}>
                  <label htmlFor={`referrer-${key}`} className="block text-sm font-semibold">
                    {label}
                  </label>
                  <input
                    id={`referrer-${key}`}
                    type={type}
                    autoComplete={`section-referrer ${autoComplete}`}
                    value={values.referrer[key]}
                    aria-invalid={errors[`referrer.${key}`] ? true : undefined}
                    aria-describedby={
                      errors[`referrer.${key}`] ? `referrer-${key}-error` : undefined
                    }
                    onChange={(event) => updateReferrer(key, event.currentTarget.value)}
                    className={`${formInputClassName} ${errors[`referrer.${key}`] ? "border-red-700" : ""}`}
                  />
                  <FieldError id={`referrer-${key}-error`} message={errors[`referrer.${key}`]} />
                </div>
              ))}
            </div>
          </fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset disabled={isSubmitting} className="mt-7">
            <legend className="sr-only">Empfohlene Kundin oder empfohlener Kunde</legend>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="referred-salutation" className="block text-sm font-semibold">
                  Anrede *
                </label>
                <select
                  id="referred-salutation"
                  autoComplete="section-referred honorific-prefix"
                  value={values.referredCustomer.salutation}
                  aria-invalid={errors["referredCustomer.salutation"] ? true : undefined}
                  aria-describedby={
                    errors["referredCustomer.salutation"] ? "referred-salutation-error" : undefined
                  }
                  onChange={(event) =>
                    updateReferred("salutation", event.currentTarget.value as Salutation | "")
                  }
                  className={`${formInputClassName} ${errors["referredCustomer.salutation"] ? "border-red-700" : ""}`}
                >
                  <option value="">Bitte auswählen</option>
                  {Object.entries(salutationLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <FieldError
                  id="referred-salutation-error"
                  message={errors["referredCustomer.salutation"]}
                />
              </div>
              {personFields.map(([key, label, autoComplete, type]) => (
                <div key={key} className={key === "email" ? "md:col-span-2" : ""}>
                  <label htmlFor={`referred-${key}`} className="block text-sm font-semibold">
                    {label}
                  </label>
                  <input
                    id={`referred-${key}`}
                    type={type}
                    autoComplete={`section-referred ${autoComplete}`}
                    value={values.referredCustomer[key]}
                    aria-invalid={errors[`referredCustomer.${key}`] ? true : undefined}
                    aria-describedby={
                      errors[`referredCustomer.${key}`] ? `referred-${key}-error` : undefined
                    }
                    onChange={(event) => updateReferred(key, event.currentTarget.value)}
                    className={`${formInputClassName} ${errors[`referredCustomer.${key}`] ? "border-red-700" : ""}`}
                  />
                  <FieldError
                    id={`referred-${key}-error`}
                    message={errors[`referredCustomer.${key}`]}
                  />
                </div>
              ))}
              {(
                [
                  ["phone", "Telefonnummer", "tel", "tel"],
                  ["street", "Straße und Hausnummer *", "street-address", "text"],
                  ["postalCode", "Postleitzahl *", "postal-code", "text"],
                  ["city", "Ort *", "address-level2", "text"],
                ] as const
              ).map(([key, label, autoComplete, type]) => (
                <div key={key} className={key === "street" ? "md:col-span-2" : ""}>
                  <label htmlFor={`referred-${key}`} className="block text-sm font-semibold">
                    {label}
                  </label>
                  <input
                    id={`referred-${key}`}
                    type={type}
                    autoComplete={`section-referred ${autoComplete}`}
                    value={values.referredCustomer[key]}
                    aria-invalid={errors[`referredCustomer.${key}`] ? true : undefined}
                    aria-describedby={
                      errors[`referredCustomer.${key}`] ? `referred-${key}-error` : undefined
                    }
                    onChange={(event) => updateReferred(key, event.currentTarget.value)}
                    className={`${formInputClassName} ${errors[`referredCustomer.${key}`] ? "border-red-700" : ""}`}
                  />
                  <FieldError
                    id={`referred-${key}-error`}
                    message={errors[`referredCustomer.${key}`]}
                  />
                </div>
              ))}
            </div>
          </fieldset>
        ) : null}

        {step === 3 ? (
          <div className="mt-7">
            <div className="grid gap-8 md:grid-cols-2">
              <section
                aria-labelledby="referrer-summary-title"
                className="border-border-default border-t pt-5"
              >
                <h3
                  id="referrer-summary-title"
                  className="text-sm font-bold tracking-[0.12em] uppercase"
                >
                  Ihre Angaben
                </h3>
                <dl className="mt-5 space-y-3 text-sm">
                  <div>
                    <dt className="text-[var(--text-subtle)]">Anrede</dt>
                    <dd className="font-semibold">
                      {values.referrer.salutation
                        ? salutationLabels[values.referrer.salutation]
                        : "Keine Angabe"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-subtle)]">Name</dt>
                    <dd className="font-semibold">
                      {values.referrer.firstName} {values.referrer.lastName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-subtle)]">E-Mail</dt>
                    <dd className="font-semibold break-all">{values.referrer.email}</dd>
                  </div>
                </dl>
              </section>
              <section
                aria-labelledby="referred-summary-title"
                className="border-border-default border-t pt-5"
              >
                <h3
                  id="referred-summary-title"
                  className="text-sm font-bold tracking-[0.12em] uppercase"
                >
                  Empfohlene Person
                </h3>
                <dl className="mt-5 space-y-3 text-sm">
                  <div>
                    <dt className="text-[var(--text-subtle)]">Anrede</dt>
                    <dd className="font-semibold">
                      {values.referredCustomer.salutation
                        ? salutationLabels[values.referredCustomer.salutation]
                        : "Keine Angabe"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-subtle)]">Name</dt>
                    <dd className="font-semibold">
                      {values.referredCustomer.firstName} {values.referredCustomer.lastName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-subtle)]">E-Mail</dt>
                    <dd className="font-semibold break-all">{values.referredCustomer.email}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-subtle)]">Telefon</dt>
                    <dd className="font-semibold">
                      {values.referredCustomer.phone || "Keine Angabe"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-subtle)]">Straße</dt>
                    <dd className="font-semibold">{values.referredCustomer.street}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-subtle)]">PLZ / Ort</dt>
                    <dd className="font-semibold">
                      {values.referredCustomer.postalCode} {values.referredCustomer.city}
                    </dd>
                  </div>
                </dl>
              </section>
            </div>

            <div className="border-border-default mt-8 border-t pt-7">
              <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm leading-6">
                <input
                  type="checkbox"
                  checked={values.consentAccepted}
                  aria-invalid={
                    errors.privacyAccepted || errors.referredPersonPermissionConfirmed
                      ? true
                      : undefined
                  }
                  aria-describedby={
                    errors.privacyAccepted || errors.referredPersonPermissionConfirmed
                      ? "referral-consent-error"
                      : undefined
                  }
                  onChange={(event) => {
                    const checked = event.currentTarget.checked;
                    setValues((current) => ({ ...current, consentAccepted: checked }));
                    clearError("privacyAccepted");
                    clearError("referredPersonPermissionConfirmed");
                  }}
                  className="mt-1 size-5 shrink-0"
                />
                <span>
                  Ich habe die{" "}
                  <Link href="/datenschutz" className="text-brand-primary underline">
                    Datenschutzerklärung
                  </Link>{" "}
                  zur Kenntnis genommen und stimme der elektronischen Verarbeitung der Angaben zu.
                  Ich bestätige, dass ich das Einverständnis der empfohlenen Person eingeholt habe
                  und ihre Daten für diese Anfrage verarbeitet werden dürfen. *
                </span>
              </label>
              <FieldError
                id="referral-consent-error"
                message={errors.privacyAccepted ?? errors.referredPersonPermissionConfirmed}
              />
            </div>
          </div>
        ) : null}

        <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="referral-website">Website</label>
          <input
            id="referral-website"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(event) => {
              const website = event.currentTarget.value;
              setValues((current) => ({ ...current, website }));
            }}
          />
        </div>

        <div className="mt-9 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {step > 1 ? (
            <button
              type="button"
              disabled={isSubmitting}
              className="button-secondary"
              onClick={() => moveToStep(step === 3 ? 2 : 1)}
            >
              Angaben ändern / vorherige Seite
            </button>
          ) : (
            <span />
          )}
          <button type="submit" disabled={isSubmitting} className="button-primary">
            {step < 3
              ? "Nächste Seite"
              : isSubmitting
                ? "Empfehlung wird übermittelt …"
                : "Empfehlung absenden"}
          </button>
        </div>
      </div>
    </form>
  );
}
