"use client";

import Link from "next/link";
import { useState } from "react";

import { contactFormContent } from "@/content/forms/contact";
import { submitContactLead } from "@/lib/leads/submit-contact-lead";
import { contactLeadInputSchema } from "@/lib/validation/contact-lead";
import type {
  BuildingType,
  ContactInterest,
  ContactLeadInput,
  ContactPreference,
  Ownership,
} from "@/types/contact-lead";

interface ContactFormValues {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  postalCode: string;
  city: string;
  interests: ContactInterest[];
  buildingType: BuildingType | "";
  ownership: Ownership | "";
  message: string;
  preferredContact: ContactPreference;
  privacyAccepted: boolean;
  website: string;
}

type ContactFieldErrors = Partial<
  Record<keyof ContactLeadInput, string>
>;

type TextFieldName =
  | "firstName"
  | "lastName"
  | "company"
  | "email"
  | "phone"
  | "postalCode"
  | "city"
  | "message"
  | "website";

const CONTACT_LEAD_FIELD_NAMES = [
  "firstName",
  "lastName",
  "company",
  "email",
  "phone",
  "postalCode",
  "city",
  "interests",
  "buildingType",
  "ownership",
  "message",
  "preferredContact",
  "privacyAccepted",
  "website",
  "formStartedAt",
] as const satisfies readonly (keyof ContactLeadInput)[];

function isContactLeadFieldName(
  value: unknown,
): value is keyof ContactLeadInput {
  return (
    typeof value === "string" &&
    CONTACT_LEAD_FIELD_NAMES.some(
      (fieldName) => fieldName === value,
    )
  );
}

function createInitialFormValues(): ContactFormValues {
  return {
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    postalCode: "",
    city: "",
    interests: [],
    buildingType: "",
    ownership: "",
    message: "",
    preferredContact: "egal",
    privacyAccepted: false,
    website: "",
  };
}

function createContactLeadInput(
  values: ContactFormValues,
  formStartedAt: number,
): ContactLeadInput {
  const company = values.company.trim();
  const phone = values.phone.trim();

  return {
    firstName: values.firstName,
    lastName: values.lastName,

    ...(company
      ? {
          company,
        }
      : {}),

    email: values.email,

    ...(phone
      ? {
          phone,
        }
      : {}),

    postalCode: values.postalCode,
    city: values.city,

    interests: values.interests,

    ...(values.buildingType
      ? {
          buildingType: values.buildingType,
        }
      : {}),

    ...(values.ownership
      ? {
          ownership: values.ownership,
        }
      : {}),

    message: values.message,
    preferredContact: values.preferredContact,
    privacyAccepted: values.privacyAccepted,

    website: values.website,
    formStartedAt,
  };
}

interface FieldErrorProps {
  id: string;
  message?: string;
}

function FieldError({
  id,
  message,
}: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      id={id}
      className="mt-2 text-sm font-medium text-red-700"
    >
      {message}
    </p>
  );
}

const inputClassName =
  "bg-background border-foreground/20 min-h-12 w-full min-w-0 rounded-md border px-4 py-3 text-base outline-none transition focus:border-foreground/50";

export function ContactLeadForm() {
  const [formValues, setFormValues] =
    useState<ContactFormValues>(
      createInitialFormValues,
    );

  const [formStartedAt, setFormStartedAt] =
    useState(() => Date.now());

  const [fieldErrors, setFieldErrors] =
    useState<ContactFieldErrors>({});

  const [generalError, setGeneralError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submittedLeadId, setSubmittedLeadId] =
    useState<string | null>(null);

  function clearFieldError(
    fieldName: keyof ContactLeadInput,
  ) {
    setFieldErrors((currentErrors) => {
      if (!currentErrors[fieldName]) {
        return currentErrors;
      }

      const nextErrors = {
        ...currentErrors,
      };

      delete nextErrors[fieldName];

      return nextErrors;
    });

    setGeneralError(null);
  }

  function handleTextChange(
    fieldName: TextFieldName,
    value: string,
  ) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }));

    clearFieldError(fieldName);
  }

  function handleInterestChange(
    interest: ContactInterest,
    checked: boolean,
  ) {
    setFormValues((currentValues) => ({
      ...currentValues,
      interests: checked
        ? currentValues.interests.includes(interest)
          ? currentValues.interests
          : [...currentValues.interests, interest]
        : currentValues.interests.filter(
            (value) => value !== interest,
          ),
    }));

    clearFieldError("interests");
  }

  function resetForm() {
    setFormValues(createInitialFormValues());
    setFormStartedAt(Date.now());
    setFieldErrors({});
    setGeneralError(null);
    setSubmittedLeadId(null);
  }

  async function handleSubmit() {
    if (isSubmitting) {
      return;
    }

    const input = createContactLeadInput(
      formValues,
      formStartedAt,
    );

    const validationResult =
      contactLeadInputSchema.safeParse(input);

    if (!validationResult.success) {
      const nextErrors: ContactFieldErrors = {};

      for (const issue of validationResult.error.issues) {
        const fieldName = issue.path[0];

        if (
          isContactLeadFieldName(fieldName) &&
          !nextErrors[fieldName]
        ) {
          nextErrors[fieldName] =
            issue.message ||
            "Bitte prüfen Sie diese Angabe.";
        }
      }

      setFieldErrors(nextErrors);
      setGeneralError(
        "Die Anfrage konnte noch nicht gesendet werden. Bitte prüfen Sie die markierten Angaben.",
      );

      return;
    }

    setFieldErrors({});
    setGeneralError(null);
    setIsSubmitting(true);

    try {
      const result = await submitContactLead(
        validationResult.data,
      );

      setSubmittedLeadId(result.leadId);
    } catch {
      setGeneralError(
        "Ihre Anfrage konnte momentan nicht übermittelt werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns telefonisch.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submittedLeadId) {
    return (
      <section
        id="projektanfrage"
        className="border-foreground/10 scroll-mt-24 border-t px-6 py-20"
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="border-foreground/10 bg-foreground/[0.025] max-w-3xl rounded-2xl border p-7 md:p-10">
            <p className="text-sm font-semibold tracking-widest uppercase">
              Anfrage übermittelt
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Vielen Dank für Ihre Anfrage
            </h2>

            <p className="text-foreground/70 mt-5 text-lg leading-8">
              Ihre Angaben wurden erfolgreich übermittelt.
              Wir prüfen Ihr Anliegen und melden uns bei Ihnen
              über den gewünschten Kontaktweg.
            </p>

            <p className="text-foreground/60 mt-5 text-sm">
              Referenz:{" "}
              <span className="font-mono">
                {submittedLeadId}
              </span>
            </p>

            <button
              type="button"
              onClick={resetForm}
              className="border-foreground/20 mt-7 inline-flex min-h-12 items-center justify-center rounded-md border px-6 py-3 text-sm font-semibold"
            >
              Weitere Anfrage senden
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="projektanfrage"
      className="border-foreground/10 scroll-mt-24 border-t px-6 py-20"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase">
            {contactFormContent.eyebrow}
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            {contactFormContent.title}
          </h2>

          <p className="text-foreground/70 mt-5 max-w-xl text-lg leading-8">
            {contactFormContent.description}
          </p>

          <div className="border-foreground/10 bg-foreground/[0.025] mt-8 rounded-xl border p-5">
            <p className="font-semibold">
              Keine technischen Unterlagen notwendig
            </p>

            <p className="text-foreground/65 mt-2 text-sm leading-6">
              Für die erste Kontaktaufnahme reichen einige
              grundlegende Angaben. Technische Details können wir
              anschließend gemeinsam klären.
            </p>
          </div>
        </div>

        <form
          noValidate
          aria-busy={isSubmitting}
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
          className="border-foreground/10 bg-background min-w-0 rounded-2xl border p-5 md:p-8"
        >
          <fieldset disabled={isSubmitting}>
            <legend className="text-xl font-semibold">
              Kontaktdaten
            </legend>

            <div className="mt-6 grid min-w-0 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-first-name"
                  className="block text-sm font-semibold"
                >
                  Vorname *
                </label>

                <input
                  id="contact-first-name"
                  type="text"
                  autoComplete="given-name"
                  value={formValues.firstName}
                  aria-invalid={
                    fieldErrors.firstName
                      ? true
                      : undefined
                  }
                  aria-describedby={
                    fieldErrors.firstName
                      ? "contact-first-name-error"
                      : undefined
                  }
                  onChange={(event) =>
                    handleTextChange(
                      "firstName",
                      event.currentTarget.value,
                    )
                  }
                  className={`${inputClassName} mt-2 ${
                    fieldErrors.firstName
                      ? "border-red-600"
                      : ""
                  }`}
                />

                <FieldError
                  id="contact-first-name-error"
                  message={fieldErrors.firstName}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-last-name"
                  className="block text-sm font-semibold"
                >
                  Nachname *
                </label>

                <input
                  id="contact-last-name"
                  type="text"
                  autoComplete="family-name"
                  value={formValues.lastName}
                  aria-invalid={
                    fieldErrors.lastName
                      ? true
                      : undefined
                  }
                  aria-describedby={
                    fieldErrors.lastName
                      ? "contact-last-name-error"
                      : undefined
                  }
                  onChange={(event) =>
                    handleTextChange(
                      "lastName",
                      event.currentTarget.value,
                    )
                  }
                  className={`${inputClassName} mt-2 ${
                    fieldErrors.lastName
                      ? "border-red-600"
                      : ""
                  }`}
                />

                <FieldError
                  id="contact-last-name-error"
                  message={fieldErrors.lastName}
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="contact-company"
                  className="block text-sm font-semibold"
                >
                  Firma
                </label>

                <input
                  id="contact-company"
                  type="text"
                  autoComplete="organization"
                  value={formValues.company}
                  onChange={(event) =>
                    handleTextChange(
                      "company",
                      event.currentTarget.value,
                    )
                  }
                  className={`${inputClassName} mt-2`}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-semibold"
                >
                  E-Mail *
                </label>

                <input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  value={formValues.email}
                  aria-invalid={
                    fieldErrors.email ? true : undefined
                  }
                  aria-describedby={
                    fieldErrors.email
                      ? "contact-email-error"
                      : undefined
                  }
                  onChange={(event) =>
                    handleTextChange(
                      "email",
                      event.currentTarget.value,
                    )
                  }
                  className={`${inputClassName} mt-2 ${
                    fieldErrors.email
                      ? "border-red-600"
                      : ""
                  }`}
                />

                <FieldError
                  id="contact-email-error"
                  message={fieldErrors.email}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-phone"
                  className="block text-sm font-semibold"
                >
                  Telefon
                </label>

                <input
                  id="contact-phone"
                  type="tel"
                  autoComplete="tel"
                  value={formValues.phone}
                  aria-invalid={
                    fieldErrors.phone ? true : undefined
                  }
                  aria-describedby={
                    fieldErrors.phone
                      ? "contact-phone-error"
                      : undefined
                  }
                  onChange={(event) =>
                    handleTextChange(
                      "phone",
                      event.currentTarget.value,
                    )
                  }
                  className={`${inputClassName} mt-2 ${
                    fieldErrors.phone
                      ? "border-red-600"
                      : ""
                  }`}
                />

                <FieldError
                  id="contact-phone-error"
                  message={fieldErrors.phone}
                />
              </div>
            </div>
          </fieldset>

          <fieldset
            disabled={isSubmitting}
            className="border-foreground/10 mt-10 border-t pt-8"
          >
            <legend className="text-xl font-semibold">
              Ihr Projekt
            </legend>

            <p className="text-foreground/65 mt-2 text-sm leading-6">
              Mehrfachauswahl möglich.
            </p>

            <div
              className="mt-6 grid gap-3 sm:grid-cols-2"
              aria-describedby={
                fieldErrors.interests
                  ? "contact-interests-error"
                  : undefined
              }
            >
              {contactFormContent.interests.map(
                (interest) => {
                  const checked =
                    formValues.interests.includes(
                      interest.value,
                    );

                  return (
                    <label
                      key={interest.value}
                      className="border-foreground/15 flex cursor-pointer gap-3 rounded-xl border p-4"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => {
                          const isChecked =
                            event.currentTarget.checked;

                          handleInterestChange(
                            interest.value,
                            isChecked,
                          );
                        }}
                        className="mt-1 h-4 w-4 shrink-0"
                      />

                      <span>
                        <span className="block font-semibold">
                          {interest.label}
                        </span>

                        <span className="text-foreground/60 mt-1 block text-sm leading-5">
                          {interest.description}
                        </span>
                      </span>
                    </label>
                  );
                },
              )}
            </div>

            <FieldError
              id="contact-interests-error"
              message={fieldErrors.interests}
            />

            <div className="mt-7 grid min-w-0 gap-6 md:grid-cols-[0.6fr_1.4fr]">
              <div>
                <label
                  htmlFor="contact-postal-code"
                  className="block text-sm font-semibold"
                >
                  PLZ *
                </label>

                <input
                  id="contact-postal-code"
                  type="text"
                  inputMode="text"
                  autoComplete="postal-code"
                  value={formValues.postalCode}
                  aria-invalid={
                    fieldErrors.postalCode
                      ? true
                      : undefined
                  }
                  aria-describedby={
                    fieldErrors.postalCode
                      ? "contact-postal-code-error"
                      : undefined
                  }
                  onChange={(event) =>
                    handleTextChange(
                      "postalCode",
                      event.currentTarget.value,
                    )
                  }
                  className={`${inputClassName} mt-2 ${
                    fieldErrors.postalCode
                      ? "border-red-600"
                      : ""
                  }`}
                />

                <FieldError
                  id="contact-postal-code-error"
                  message={fieldErrors.postalCode}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-city"
                  className="block text-sm font-semibold"
                >
                  Ort *
                </label>

                <input
                  id="contact-city"
                  type="text"
                  autoComplete="address-level2"
                  value={formValues.city}
                  aria-invalid={
                    fieldErrors.city ? true : undefined
                  }
                  aria-describedby={
                    fieldErrors.city
                      ? "contact-city-error"
                      : undefined
                  }
                  onChange={(event) =>
                    handleTextChange(
                      "city",
                      event.currentTarget.value,
                    )
                  }
                  className={`${inputClassName} mt-2 ${
                    fieldErrors.city
                      ? "border-red-600"
                      : ""
                  }`}
                />

                <FieldError
                  id="contact-city-error"
                  message={fieldErrors.city}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-building-type"
                  className="block text-sm font-semibold"
                >
                  Gebäudetyp
                </label>

                <select
                  id="contact-building-type"
                  value={formValues.buildingType}
                  onChange={(event) => {
                    const value = event.currentTarget
                      .value as BuildingType | "";

                    setFormValues((currentValues) => ({
                      ...currentValues,
                      buildingType: value,
                    }));

                    clearFieldError("buildingType");
                  }}
                  className={`${inputClassName} mt-2`}
                >
                  <option value="">
                    Keine Angabe
                  </option>

                  {contactFormContent.buildingTypes.map(
                    (option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-ownership"
                  className="block text-sm font-semibold"
                >
                  Nutzung / Eigentum
                </label>

                <select
                  id="contact-ownership"
                  value={formValues.ownership}
                  onChange={(event) => {
                    const value = event.currentTarget
                      .value as Ownership | "";

                    setFormValues((currentValues) => ({
                      ...currentValues,
                      ownership: value,
                    }));

                    clearFieldError("ownership");
                  }}
                  className={`${inputClassName} mt-2`}
                >
                  <option value="">
                    Keine Angabe
                  </option>

                  {contactFormContent.ownershipOptions.map(
                    (option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset
            disabled={isSubmitting}
            className="border-foreground/10 mt-10 border-t pt-8"
          >
            <legend className="text-xl font-semibold">
              Ihre Nachricht
            </legend>

            <div className="mt-6">
              <label
                htmlFor="contact-message"
                className="block text-sm font-semibold"
              >
                Beschreiben Sie Ihr Vorhaben *
              </label>

              <textarea
                id="contact-message"
                rows={6}
                value={formValues.message}
                aria-invalid={
                  fieldErrors.message ? true : undefined
                }
                aria-describedby={
                  fieldErrors.message
                    ? "contact-message-error"
                    : undefined
                }
                onChange={(event) =>
                  handleTextChange(
                    "message",
                    event.currentTarget.value,
                  )
                }
                className={`${inputClassName} mt-2 resize-y ${
                  fieldErrors.message
                    ? "border-red-600"
                    : ""
                }`}
              />

              <FieldError
                id="contact-message-error"
                message={fieldErrors.message}
              />
            </div>

            <div className="mt-7">
              <p className="text-sm font-semibold">
                Wie dürfen wir Sie bevorzugt kontaktieren?
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {contactFormContent.contactPreferences.map(
                  (option) => (
                    <label
                      key={option.value}
                      className="border-foreground/15 flex cursor-pointer gap-3 rounded-xl border p-4"
                    >
                      <input
                        type="radio"
                        name="preferredContact"
                        value={option.value}
                        checked={
                          formValues.preferredContact ===
                          option.value
                        }
                        onChange={() => {
                          setFormValues(
                            (currentValues) => ({
                              ...currentValues,
                              preferredContact:
                                option.value,
                            }),
                          );

                          clearFieldError(
                            "preferredContact",
                          );
                        }}
                        className="mt-1 h-4 w-4 shrink-0"
                      />

                      <span className="text-sm">
                        <span className="block font-semibold">
                          {option.label}
                        </span>

                        <span className="text-foreground/60 mt-1 block leading-5">
                          {option.description}
                        </span>
                      </span>
                    </label>
                  ),
                )}
              </div>
            </div>
          </fieldset>

          <div className="border-foreground/10 mt-10 border-t pt-8">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formValues.privacyAccepted}
                onChange={(event) => {
                  const checked =
                    event.currentTarget.checked;

                  setFormValues((currentValues) => ({
                    ...currentValues,
                    privacyAccepted: checked,
                  }));

                  clearFieldError(
                    "privacyAccepted",
                  );
                }}
                className="mt-1 h-4 w-4 shrink-0"
              />

              <span className="text-foreground/70 text-sm leading-6">
                Ich habe die{" "}
                <Link
                  href="/datenschutz"
                  className="font-semibold underline underline-offset-2"
                >
                  Datenschutzhinweise
                </Link>{" "}
                zur Kenntnis genommen und stimme der
                Verarbeitung meiner Angaben zur Bearbeitung
                meiner Anfrage zu. *
              </span>
            </label>

            <FieldError
              id="contact-privacy-error"
              message={fieldErrors.privacyAccepted}
            />

            <div
              aria-hidden="true"
              className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
            >
              <label htmlFor="contact-website">
                Website
              </label>

              <input
                id="contact-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={formValues.website}
                onChange={(event) =>
                  handleTextChange(
                    "website",
                    event.currentTarget.value,
                  )
                }
              />
            </div>

            {generalError ? (
              <p
                role="alert"
                className="mt-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
              >
                {generalError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-foreground text-background mt-7 inline-flex min-h-12 items-center justify-center rounded-md px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Anfrage wird gesendet …"
                : "Projektanfrage senden"}
            </button>

            <p className="text-foreground/55 mt-4 text-xs leading-5">
              * Pflichtfelder
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}