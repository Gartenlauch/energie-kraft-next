"use client";

import {
    type ReactNode,
    useState,
} from "react";

import { ConfiguratorContactForm } from "@/components/configurator/configurator-contact-form";
import { ConfiguratorSubmitReview } from "@/components/configurator/configurator-submit-review";
import { ConfiguratorSubmitSuccess } from "@/components/configurator/configurator-submit-success";
import {
    buildConfiguratorLeadInput,
} from "@/lib/configurator/lead";
import {
    useConfigurator,
} from "@/lib/configurator/configurator-context";
import {
    submitConfiguratorLead,
} from "@/lib/leads/submit-configurator-lead";
import {
    configuratorLeadInputSchema,
} from "@/lib/validation/configurator/lead";
import type {
    ConfiguratorContactFormValues,
    ConfiguratorLeadType,
    SubmitConfiguratorLeadInput,
} from "@/types/configurator";

type LeadFlowStage =
    | "result"
    | "contact"
    | "submit"
    | "success";

interface ConfiguratorLeadFlowProps {
    configuratorType:
    ConfiguratorLeadType;

    renderResult: (
        onContinue: () => void,
    ) => ReactNode;

    onRestart: () => void;
}

export function ConfiguratorLeadFlow({
    configuratorType,
    renderResult,
    onRestart,
}: ConfiguratorLeadFlowProps) {
    const {
        state,
        reset,
    } = useConfigurator();

    const [
        stage,
        setStage,
    ] = useState<LeadFlowStage>(
        "result",
    );

    const [
        contactDraft,
        setContactDraft,
    ] =
        useState<ConfiguratorContactFormValues | null>(
            null,
        );

    const [
        contactFormStartedAt,
        setContactFormStartedAt,
    ] =
        useState<number | null>(
            null,
        );

    const [
        submittedLeadId,
        setSubmittedLeadId,
    ] =
        useState<string | null>(
            null,
        );

    const [
        isSubmitting,
        setIsSubmitting,
    ] =
        useState(false);

    const [
        submissionError,
        setSubmissionError,
    ] =
        useState<string | null>(
            null,
        );

    const input =
        contactDraft &&
            contactFormStartedAt !== null
            ? buildConfiguratorLeadInput(
                configuratorType,
                state,
                contactDraft,
                contactFormStartedAt,
            )
            : null;

    async function handleSubmit(
        leadInput:
            SubmitConfiguratorLeadInput,
    ) {
        if (isSubmitting) {
            return;
        }

        const parsed =
            configuratorLeadInputSchema.safeParse(
                leadInput,
            );

        if (!parsed.success) {
            setSubmissionError(
                "Die Anfrage ist noch nicht vollständig. Bitte prüfe deine Angaben.",
            );

            return;
        }

        setSubmissionError(null);
        setIsSubmitting(true);

        try {
            const result =
                await submitConfiguratorLead(
                    parsed.data,
                );

            setSubmittedLeadId(
                result.leadId,
            );

            /*
             * Technische Konfigurator-Daten
             * erst nach erfolgreicher
             * Speicherung löschen.
             */
            reset();

            setStage("success");
        } catch {
            setSubmissionError(
                "Deine Anfrage konnte momentan nicht übermittelt werden. Bitte versuche es erneut.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    if (
        stage === "success" &&
        submittedLeadId
    ) {
        return (
            <ConfiguratorSubmitSuccess
                leadId={submittedLeadId}
                onRestart={() => {
                    setContactDraft(null);
                    setContactFormStartedAt(
                        null,
                    );
                    setSubmittedLeadId(null);
                    setSubmissionError(null);
                    setStage("result");

                    onRestart();
                }}
            />
        );
    }

    if (stage === "contact") {
        return (
            <ConfiguratorContactForm
                initialValues={
                    contactDraft ??
                    undefined
                }
                initialFormStartedAt={
                    contactFormStartedAt ??
                    undefined
                }
                onBack={() =>
                    setStage("result")
                }
                onContinue={(
                    values,
                    formStartedAt,
                ) => {
                    setContactDraft(
                        values,
                    );

                    setContactFormStartedAt(
                        formStartedAt,
                    );

                    setSubmissionError(
                        null,
                    );

                    setStage("submit");
                }}
            />
        );
    }

    if (stage === "submit") {
        if (!input) {
            return (
                <div
                    role="alert"
                    className="rounded-2xl border border-red-300 bg-red-50 p-6 text-red-800"
                >
                    <p className="font-semibold">
                        Die Anfrage konnte nicht vorbereitet
                        werden.
                    </p>

                    <p className="mt-2 text-sm">
                        Bitte gehe zurück und prüfe deine
                        Angaben.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            setStage("contact")
                        }
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
                isSubmitting={
                    isSubmitting
                }
                error={
                    submissionError
                }
                onBack={() =>
                    setStage("contact")
                }
                onSubmit={() => {
                    void handleSubmit(
                        input,
                    );
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