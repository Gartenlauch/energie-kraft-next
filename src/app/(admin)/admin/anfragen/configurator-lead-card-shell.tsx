import type {
    ReactNode,
} from "react";

import {
    formatLeadDate,
    getStatusClassName,
    LeadWorkflowPanel,
    STATUS_LABELS,
} from "./lead-admin-shared";

import type {
    ConfiguratorLead,
} from "@/types/configurator";

interface ConfiguratorLeadCardShellProps {
    lead: ConfiguratorLead;
    badge: string;
    children: ReactNode;
}

export function ConfiguratorLeadCardShell({
    lead,
    badge,
    children,
}: ConfiguratorLeadCardShellProps) {
    return (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-5">
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-semibold text-slate-950">
                            {lead.contact.firstName}{" "}
                            {lead.contact.lastName}
                        </h2>

                        <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClassName(
                                lead.status,
                            )}`}
                        >
                            {STATUS_LABELS[lead.status]}
                        </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                        Eingegangen:{" "}
                        {formatLeadDate(lead)}
                    </p>

                    <p className="mt-1 font-mono text-xs text-slate-400">
                        {lead.id}
                    </p>
                </div>

                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
                    {badge}
                </span>
            </div>

            <div className="grid gap-8 p-6 xl:grid-cols-2">
                <div className="space-y-7">
                    <section>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                            Kontaktdaten
                        </h3>

                        <dl className="mt-4 space-y-3 text-sm">
                            <div>
                                <dt className="text-slate-500">
                                    E-Mail
                                </dt>

                                <dd>
                                    <a
                                        href={`mailto:${lead.contact.email}`}
                                        className="font-medium text-emerald-800 hover:underline"
                                    >
                                        {lead.contact.email}
                                    </a>
                                </dd>
                            </div>

                            {lead.contact.phone ? (
                                <div>
                                    <dt className="text-slate-500">
                                        Telefon
                                    </dt>

                                    <dd>
                                        <a
                                            href={`tel:${lead.contact.phone}`}
                                            className="font-medium text-emerald-800 hover:underline"
                                        >
                                            {lead.contact.phone}
                                        </a>
                                    </dd>
                                </div>
                            ) : null}
                        </dl>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                            Installationsort
                        </h3>

                        <dl className="mt-4 space-y-3 text-sm">
                            <div>
                                <dt className="text-slate-500">
                                    Am Wohnort
                                </dt>

                                <dd className="font-medium text-slate-900">
                                    {lead.installation.atResidence
                                        ? "Ja"
                                        : "Nein"}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-slate-500">
                                    Adresse
                                </dt>

                                <dd className="font-medium text-slate-900">
                                    {lead.installation.street}
                                    <br />
                                    {lead.installation.postalCode}{" "}
                                    {lead.installation.city}
                                </dd>
                            </div>
                        </dl>
                    </section>

                    {children}
                </div>

                <div className="space-y-7">
                    <LeadWorkflowPanel
                        lead={lead}
                    />

                    <section className="text-xs leading-5 text-slate-500">
                        Datenschutz wurde bei Übermittlung der
                        Konfigurator-Anfrage bestätigt.
                    </section>
                </div>
            </div>
        </article>
    );
}