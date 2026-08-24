import { ConfiguratorPhaseIndicator } from "@/components/configurator/configurator-phase-indicator";
import type { SubmitPhotovoltaicConfiguratorLeadInput } from "@/types/configurator";

interface PhotovoltaicSubmitReviewProps {
  input: SubmitPhotovoltaicConfiguratorLeadInput;
  isSubmitting: boolean;
  error: string | null;

  onBack: () => void;
  onSubmit: () => void;
}

function formatKwh(value: number): string {
  return new Intl.NumberFormat(
    "de-DE",
  ).format(value);
}

export function PhotovoltaicSubmitReview({
  input,
  isSubmitting,
  error,
  onBack,
  onSubmit,
}: PhotovoltaicSubmitReviewProps) {
  const result =
    input.configurator.result;

  return (
    <>
      <ConfiguratorPhaseIndicator
        currentPhase="submit"
      />

      <section aria-labelledby="configurator-submit-heading">
        <p className="text-sm font-semibold tracking-widest text-brand-secondary uppercase">
          Anfrage prüfen
        </p>

        <h1
          id="configurator-submit-heading"
          className="mt-3 text-3xl font-semibold tracking-tight text-brand-primary sm:text-4xl"
        >
          Möchtest du deine Anfrage absenden?
        </h1>

        <p className="mt-4 max-w-2xl text-lg leading-8 text-foreground/70">
          Prüfe die wichtigsten Angaben noch einmal.
          Nach dem Absenden wird deine Konfiguration
          zur persönlichen Bearbeitung übermittelt.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-border-default p-6">
            <h2 className="font-semibold text-brand-primary">
              Kontaktdaten
            </h2>

            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-foreground/60">
                  Name
                </dt>
                <dd className="font-medium">
                  {input.contact.firstName}{" "}
                  {input.contact.lastName}
                </dd>
              </div>

              <div>
                <dt className="text-foreground/60">
                  E-Mail
                </dt>
                <dd className="font-medium">
                  {input.contact.email}
                </dd>
              </div>

              <div>
                <dt className="text-foreground/60">
                  Telefon
                </dt>
                <dd className="font-medium">
                  {input.contact.phone ??
                    "Keine Angabe"}
                </dd>
              </div>
            </dl>
          </article>

          <article className="rounded-2xl border border-border-default p-6">
            <h2 className="font-semibold text-brand-primary">
              Installationsort
            </h2>

            <p className="mt-4 leading-7 text-foreground/70">
              {input.installation.street}
              <br />
              {input.installation.postalCode}{" "}
              {input.installation.city}
            </p>
          </article>

          <article className="rounded-2xl border border-border-default bg-surface p-6 md:col-span-2">
            <h2 className="font-semibold text-brand-primary">
              Photovoltaik-Empfehlung
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-foreground/60">
                  Anlagenklasse
                </p>
                <p className="mt-1 font-semibold text-brand-primary">
                  ca.{" "}
                  {result.recommendedPowerKwpMin}–
                  {result.recommendedPowerKwpMax}{" "}
                  kWp
                </p>
              </div>

              <div>
                <p className="text-sm text-foreground/60">
                  Jahresertrag
                </p>
                <p className="mt-1 font-semibold text-brand-primary">
                  ca.{" "}
                  {formatKwh(
                    result.estimatedAnnualYieldKwhMin,
                  )}
                  –
                  {formatKwh(
                    result.estimatedAnnualYieldKwhMax,
                  )}{" "}
                  kWh
                </p>
              </div>

              <div>
                <p className="text-sm text-foreground/60">
                  Verbrauch
                </p>
                <p className="mt-1 font-semibold text-brand-primary">
                  {formatKwh(
                    result.projectedAnnualConsumptionKwh,
                  )}{" "}
                  kWh/Jahr
                </p>
              </div>
            </div>
          </article>
        </div>

        {error ? (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800"
          >
            {error}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onBack}
            className="min-h-12 rounded-xl border border-border-default px-6 py-3 font-medium text-brand-primary disabled:opacity-50"
          >
            Kontaktdaten ändern
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onSubmit}
            className="min-h-12 rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Anfrage wird gesendet …"
              : "Anfrage absenden"}
          </button>
        </div>
      </section>
    </>
  );
}