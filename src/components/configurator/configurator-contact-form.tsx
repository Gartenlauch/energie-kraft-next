"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";
import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
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

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm font-medium text-red-700">{message}</p>;
}

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

      <section aria-labelledby="configurator-contact-heading">
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
              type="text"
              autoComplete="given-name"
              value={values.firstName}
              onChange={(event) => updateValue("firstName", event.currentTarget.value)}
              className={inputClassName}
            />

            <FieldError message={errors.firstName} />
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
              type="text"
              autoComplete="family-name"
              value={values.lastName}
              onChange={(event) => updateValue("lastName", event.currentTarget.value)}
              className={inputClassName}
            />

            <FieldError message={errors.lastName} />
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
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => updateValue("email", event.currentTarget.value)}
              className={inputClassName}
            />

            <FieldError message={errors.email} />
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
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(event) => updateValue("phone", event.currentTarget.value)}
              className={inputClassName}
            />

            <p className="text-foreground/60 mt-2 text-sm">Optional</p>

            <FieldError message={errors.phone} />
          </div>
        </div>

        <fieldset className="mt-10">
          <legend className="text-brand-primary text-lg font-semibold">
            Soll die Installation an deinem Wohnort erfolgen?
          </legend>

          <div className="mt-5">
            <SelectionGrid columns={2}>
              <SelectionCard
                title="Ja, an meinem Wohnort"
                selected={values.installationAtResidence === true}
                onSelect={() => updateValue("installationAtResidence", true)}
              />

              <SelectionCard
                title="Nein, andere Adresse"
                selected={values.installationAtResidence === false}
                onSelect={() => updateValue("installationAtResidence", false)}
              />
            </SelectionGrid>
          </div>

          <FieldError message={errors.installationAtResidence} />
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
                  type="text"
                  autoComplete="street-address"
                  value={values.street}
                  onChange={(event) => updateValue("street", event.currentTarget.value)}
                  className={inputClassName}
                />

                <FieldError message={errors.street} />
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
                  type="text"
                  autoComplete="postal-code"
                  value={values.postalCode}
                  onChange={(event) => updateValue("postalCode", event.currentTarget.value)}
                  className={inputClassName}
                />

                <FieldError message={errors.postalCode} />
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
                  type="text"
                  autoComplete="address-level2"
                  value={values.city}
                  onChange={(event) => updateValue("city", event.currentTarget.value)}
                  className={inputClassName}
                />

                <FieldError message={errors.city} />
              </div>
            </div>
          </fieldset>
        ) : null}

        <div className="border-border-default bg-surface mt-10 rounded-2xl border p-5">
          <label className="flex cursor-pointer items-start gap-3">
            <input
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

          <FieldError message={errors.privacyAccepted} />
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
