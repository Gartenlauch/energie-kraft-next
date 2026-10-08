"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";
import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import { FieldError } from "@/components/forms/form-control";
import { configuratorContactFormSchema } from "@/lib/validation/configurator/lead";
import type { ConfiguratorContactFormValues } from "@/types/configurator";

type ContactFieldName = keyof ConfiguratorContactFormValues;

type ContactFieldErrors = Partial<Record<ContactFieldName, string>>;

interface ConfiguratorContactFormProps {
  initialValues?: ConfiguratorContactFormValues;
  initialFormStartedAt?: number;
  focusFirstName?: boolean;

  onBack: () => void;

  onContinue: (values: ConfiguratorContactFormValues, formStartedAt: number) => void;
}

function createInitialValues(): ConfiguratorContactFormValues {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    installationAtResidence: null,

    street: "",
    postalCode: "",
    city: "",

    privacyAccepted: false,

    website: "",
  };
}

const inputClassName =
  "mt-2 min-h-13 w-full min-w-0 rounded-xl border border-border-default bg-background px-4 py-3 text-base text-brand-navy";

export function ConfiguratorContactForm({
  initialValues,
  initialFormStartedAt,
  focusFirstName = true,
  onBack,
  onContinue,
}: ConfiguratorContactFormProps) {
  const [values, setValues] = useState<ConfiguratorContactFormValues>(
    () => initialValues ?? createInitialValues(),
    );

  const [formStartedAt] = useState(() => initialFormStartedAt ?? Date.now());

  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const sectionRef = useRef<HTMLElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusFirstName) {
      firstNameRef.current?.focus();
    }
  }, [focusFirstName]);

  function updateValue<TKey extends ContactFieldName>(
    key: TKey,
    value: ConfiguratorContactFormValues[TKey],
  ) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => {
      if (!current[key]) {
        return current;
      }

      const next = {
        ...current,
      };

      delete next[key];

      return next;
    });
  }

  function handleContinue() {
    const result = configuratorContactFormSchema.safeParse(values);

    if (!result.success) {
      const nextErrors: ContactFieldErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (typeof field === "string" && field in values) {
          const key = field as ContactFieldName;

          if (!nextErrors[key]) {
            nextErrors[key] = issue.message;
          }
        }
      }

      setErrors(nextErrors);
      window.requestAnimationFrame(() => {
        sectionRef.current?.querySelector<HTMLElement>(
          'input[aria-invalid="true"], [role="radiogroup"][aria-invalid="true"] input[type="radio"]',
        )?.focus();
      });
      return;
    }

    if (result.data.installationAtResidence === null) {
      return;
    }

    setErrors({});

    onContinue(
      {
        ...values,
        installationAtResidence: result.data.installationAtResidence,
      },
      formStartedAt,
    );
  }

  const addressHeading =
    values.installationAtResidence === false ? "Adresse des Installationsorts" : "Adresse";

  return (
    <>
      <ConfiguratorPhaseIndicator currentPhase="contact" />

      <section ref={sectionRef} aria-labelledby="configurator-contact-heading">
        <p className="eyebrow">Fast geschafft</p>

        <h1
          id="configurator-contact-heading"
          className="text-brand-navy mt-4 text-3xl leading-tight tracking-tight sm:text-4xl"
        >
          Deine persönliche Projektanalyse ist vorbereitet.
        </h1>

        <p className="text-foreground/70 mt-4 max-w-2xl text-lg leading-8">
          Ergänze als letzten Schritt deine Kontaktdaten. Anschließend wird deine individuelle
          Analyse als PDF erstellt und per E-Mail bereitgestellt.
        </p>

        <div className="mt-8 grid min-w-0 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="configurator-first-name"
              className="text-brand-primary block text-sm font-semibold"
            >
              Vorname *
            </label>

            <input
              ref={firstNameRef}
              id="configurator-first-name"
              aria-invalid={errors.firstName ? true : undefined}
              aria-describedby={errors.firstName ? "configurator-first-name-error" : undefined}
              type="text"
              autoComplete="given-name"
              value={values.firstName}
              onChange={(event) => updateValue("firstName", event.currentTarget.value)}
              className={inputClassName}
            />

            <FieldError id="configurator-first-name-error" message={errors.firstName} />
          </div>

          <div>
            <label
              htmlFor="configurator-last-name"
              className="text-brand-primary block text-sm font-semibold"
            >
              Nachname *
            </label>

            <input
              id="configurator-last-name"
              aria-invalid={errors.lastName ? true : undefined}
              aria-describedby={errors.lastName ? "configurator-last-name-error" : undefined}
              type="text"
              autoComplete="family-name"
              value={values.lastName}
              onChange={(event) => updateValue("lastName", event.currentTarget.value)}
              className={inputClassName}
            />

            <FieldError id="configurator-last-name-error" message={errors.lastName} />
          </div>

          <div>
            <label
              htmlFor="configurator-email"
              className="text-brand-primary block text-sm font-semibold"
            >
              E-Mail *
            </label>

            <input
              id="configurator-email"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "configurator-email-error" : undefined}
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => updateValue("email", event.currentTarget.value)}
              className={inputClassName}
            />

            <FieldError id="configurator-email-error" message={errors.email} />
          </div>

          <div>
            <label
              htmlFor="configurator-phone"
              className="text-brand-primary block text-sm font-semibold"
            >
              Telefonnummer
            </label>

            <input
              id="configurator-phone"
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={`configurator-phone-help${errors.phone ? " configurator-phone-error" : ""}`}
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(event) => updateValue("phone", event.currentTarget.value)}
              className={inputClassName}
            />

            <p id="configurator-phone-help" className="text-foreground/60 mt-2 text-sm">Optional</p>

            <FieldError id="configurator-phone-error" message={errors.phone} />
          </div>
        </div>

        <fieldset
          className="mt-10"
          role="radiogroup"
          aria-labelledby="configurator-installation-label"
          aria-invalid={errors.installationAtResidence ? true : undefined}
        >
          <legend id="configurator-installation-label" className="text-brand-primary text-lg font-semibold">
            Soll die Installation an deinem Wohnort erfolgen?
          </legend>

          <div className="mt-5">
            <SelectionGrid columns={2}>
              <SelectionCard
                aria-describedby={errors.installationAtResidence ? "configurator-installation-error" : undefined}
                title="Ja, an meinem Wohnort"
                radioName="installationAtResidence"
                radioValue="yes"
                selected={values.installationAtResidence === true}
                onSelect={() => updateValue("installationAtResidence", true)}
              />

              <SelectionCard
                aria-describedby={errors.installationAtResidence ? "configurator-installation-error" : undefined}
                title="Nein, andere Adresse"
                radioName="installationAtResidence"
                radioValue="no"
                selected={values.installationAtResidence === false}
                onSelect={() => updateValue("installationAtResidence", false)}
              />
            </SelectionGrid>
          </div>

          <FieldError id="configurator-installation-error" message={errors.installationAtResidence} />
        </fieldset>

        {values.installationAtResidence !== null ? (
          <fieldset className="mt-10">
            <legend className="text-brand-primary text-lg font-semibold">{addressHeading}</legend>

            <div className="mt-5 grid min-w-0 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="configurator-street"
                  className="text-brand-primary block text-sm font-semibold"
                >
                  Straße und Hausnummer *
                </label>

                <input
                  id="configurator-street"
                  aria-invalid={errors.street ? true : undefined}
                  aria-describedby={errors.street ? "configurator-street-error" : undefined}
                  type="text"
                  autoComplete="street-address"
                  value={values.street}
                  onChange={(event) => updateValue("street", event.currentTarget.value)}
                  className={inputClassName}
                />

                <FieldError id="configurator-street-error" message={errors.street} />
              </div>

              <div>
                <label
                  htmlFor="configurator-postal-code"
                  className="text-brand-primary block text-sm font-semibold"
                >
                  PLZ *
                </label>

                <input
                  id="configurator-postal-code"
                  aria-invalid={errors.postalCode ? true : undefined}
                  aria-describedby={errors.postalCode ? "configurator-postal-code-error" : undefined}
                  type="text"
                  autoComplete="postal-code"
                  value={values.postalCode}
                  onChange={(event) => updateValue("postalCode", event.currentTarget.value)}
                  className={inputClassName}
                />

                <FieldError id="configurator-postal-code-error" message={errors.postalCode} />
              </div>

              <div>
                <label
                  htmlFor="configurator-city"
                  className="text-brand-primary block text-sm font-semibold"
                >
                  Ort *
                </label>

                <input
                  id="configurator-city"
                  aria-invalid={errors.city ? true : undefined}
                  aria-describedby={errors.city ? "configurator-city-error" : undefined}
                  type="text"
                  autoComplete="address-level2"
                  value={values.city}
                  onChange={(event) => updateValue("city", event.currentTarget.value)}
                  className={inputClassName}
                />

                <FieldError id="configurator-city-error" message={errors.city} />
              </div>
            </div>
          </fieldset>
        ) : null}

        <div className="border-border-default bg-surface mt-10 rounded-2xl border p-5">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              id="configurator-privacy"
              aria-invalid={errors.privacyAccepted ? true : undefined}
              aria-describedby={errors.privacyAccepted ? "configurator-privacy-error" : undefined}
              type="checkbox"
              checked={values.privacyAccepted}
              onChange={(event) => updateValue("privacyAccepted", event.currentTarget.checked)}
              className="mt-1 h-5 w-5 shrink-0"
            />

            <span className="text-foreground/70 text-sm leading-6">
              Ich habe die{" "}
              <Link
                href="/datenschutz"
                target="_blank"
                className="text-brand-primary font-medium underline"
              >
                Datenschutzhinweise
              </Link>{" "}
              gelesen und stimme der Verarbeitung meiner Angaben zur Bearbeitung der Anfrage zu. *
            </span>
          </label>

          <FieldError id="configurator-privacy-error" message={errors.privacyAccepted} />
        </div>

        <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="configurator-website">Website</label>

          <input
            id="configurator-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(event) => updateValue("website", event.currentTarget.value)}
          />
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button type="button" onClick={onBack} className="button-secondary">
            Zurück zum Ergebnis
          </button>

          <button type="button" onClick={handleContinue} className="button-primary">
            Weiter zur Anfrage
          </button>
        </div>
      </section>
    </>
  );
}
