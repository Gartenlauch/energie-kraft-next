"use client";

import { type ReactNode, useRef, useState } from "react";

import { ConfiguratorContactForm } from "@/components/configurator/configurator-contact-form";
import { ConfiguratorSubmitReview } from "@/components/configurator/configurator-submit-review";
import { ConfiguratorSubmitSuccess } from "@/components/configurator/configurator-submit-success";
import { buildConfiguratorLeadInput } from "@/lib/configurator/lead";
import { useConfigurator } from "@/lib/configurator/configurator-context";
import { submitConfiguratorLead } from "@/lib/leads/submit-configurator-lead";
import { configuratorLeadInputSchema } from "@/lib/validation/configurator/lead";
import type {
    ConfiguratorContactFormValues,
    SubmitConfiguratorLeadInput,
    SubmitConfiguratorLeadResult,
} from "@/types/configurator";

type LeadFlowStage = "result" | "contact" | "submit" | "success";

interface ConfiguratorLeadFlowProps {
  renderResult: (onContinue: () => void) => ReactNode;
}
export function ConfiguratorLeadFlow({ renderResult }: ConfiguratorLeadFlowProps) {
  const { state, dispatch } = useConfigurator();

  const [stage, setStage] = useState<LeadFlowStage>("result");

  const [contactDraft, setContactDraft] = useState<ConfiguratorContactFormValues | null>(null);

  const [contactFormStartedAt, setContactFormStartedAt] = useState<number | null>(null);

  const submitInFlight = useRef(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submissionError, setSubmissionError] = useState<string | null>(null);

    const input =
    contactDraft && contactFormStartedAt !== null
      ? buildConfiguratorLeadInput(state, contactDraft, contactFormStartedAt)
            : null;

  async function handleSubmit(leadInput: SubmitConfiguratorLeadInput) {
        if (submitInFlight.current || state.submission.status === "submitted") {
            return;
        }

    const parsed = configuratorLeadInputSchema.safeParse(leadInput);

        if (!parsed.success) {
      setSubmissionError("Die Anfrage ist noch nicht vollständig. Bitte prüfe deine Angaben.");

            return;
        }

        submitInFlight.current = true;
        setSubmissionError(null);
        setIsSubmitting(true);
        dispatch({ type: "SET_SUBMISSION", payload: { status: "submitting" } });

        let result: SubmitConfiguratorLeadResult;
        try {
            result = await submitConfiguratorLead(leadInput);
        } catch {
            dispatch({ type: "SET_SUBMISSION", payload: { status: "failed" } });
            setSubmissionError(
                "Deine Anfrage konnte momentan nicht übermittelt werden. Bitte versuche es erneut.",
            );
            submitInFlight.current = false;
            setIsSubmitting(false);
            return;
        }
        dispatch({ type: "SET_SUBMISSION", payload: {
            status: "submitted",
            publicReference: result.publicReference,
            reportStatus: result.reportStatus,
            customerMailStatus: result.customerMailStatus,
        } });
        setContactDraft(null);
        setContactFormStartedAt(null);
        setStage("success");
        setIsSubmitting(false);
    }

  if (state.submission.status === "submitted" && state.submission.publicReference) {
    return (
        <ConfiguratorSubmitSuccess
        publicReference={state.submission.publicReference}
        reportStatus={state.submission.reportStatus}
        customerMailStatus={state.submission.customerMailStatus}
        />
    );
}

    if (stage === "contact") {
        return (
            <ConfiguratorContactForm
        focusFirstName={contactDraft === null}
        initialValues={contactDraft ?? undefined}
        initialFormStartedAt={contactFormStartedAt ?? undefined}
        onBack={() => setStage("result")}
        onContinue={(values, formStartedAt) => {
          setContactDraft(values);

          setContactFormStartedAt(formStartedAt);

          setSubmissionError(null);

                    setStage("submit");
                }}
            />
        );
    }

    if (stage === "submit") {
        if (!input) {
            return (
        <div role="alert" className="rounded-2xl border border-red-300 bg-red-50 p-6 text-red-800">
          <p className="font-semibold">Die Anfrage konnte nicht vorbereitet werden.</p>

          <p className="mt-2 text-sm">Bitte gehe zurück und prüfe deine Angaben.</p>

                    <button
                        type="button"
            onClick={() => setStage("contact")}
                        className="mt-5 min-h-12 rounded-xl border border-red-300 px-5 py-3 font-medium"
                    >
                        Zurück zu den Kontaktdaten
                    </button>
                </div>
            );
        }

        return (
            <ConfiguratorSubmitReview
                input={input}
        isSubmitting={isSubmitting}
        error={submissionError}
        onBack={() => setStage("contact")}
                onSubmit={() => {
          void handleSubmit(input);
                }}
            />
        );
    }

    return (
        <>
            {renderResult(() => {
                setSubmissionError(null);
                setStage("contact");
            })}
        </>
    );
}
