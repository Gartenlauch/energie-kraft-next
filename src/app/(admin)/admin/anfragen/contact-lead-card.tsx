import {
  formatLeadDate,
  getStatusClassName,
  LeadWorkflowPanel,
  STATUS_LABELS,
} from "./lead-admin-shared";


import type {
  ContactInterest,
  ContactLead,
} from "@/types/contact-lead";

const INTEREST_LABELS: Record<
  ContactInterest,
  string
> = {
  photovoltaik: "Photovoltaik",
  stromspeicher: "Stromspeicher",
  wallbox: "Wallbox",
  klimaanlage: "Klimaanlage",
  waermepumpe: "Wärmepumpe",
  sonstiges: "Sonstiges",
};

const BUILDING_TYPE_LABELS = {
  einfamilienhaus: "Einfamilienhaus",
  mehrfamilienhaus: "Mehrfamilienhaus",
  gewerbe: "Gewerbe",
  sonstiges: "Sonstiges",
} as const;

const OWNERSHIP_LABELS = {
  eigentuemer: "Eigentümer",
  mieter: "Mieter",
  sonstiges: "Sonstiges",
} as const;

const CONTACT_PREFERENCE_LABELS = {
  telefon: "Telefon",
  email: "E-Mail",
  egal: "Keine Präferenz",
} as const;

interface ContactLeadCardProps {
  lead: ContactLead;
}

export function ContactLeadCard({
  lead,
}: ContactLeadCardProps) {
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
            Eingegangen: {formatLeadDate(lead)}
          </p>

          <p className="mt-1 font-mono text-xs text-slate-400">
            {lead.id}
          </p>
        </div>

        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
          Kontaktformular
        </span>
      </div>

      <div className="grid gap-8 p-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-7">
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Kontaktdaten
            </h3>

            <dl className="mt-4 space-y-3 text-sm">
              {lead.contact.company ? (
                <div>
                  <dt className="text-slate-500">
                    Firma
                  </dt>
                  <dd className="font-medium text-slate-900">
                    {lead.contact.company}
                  </dd>
                </div>
              ) : null}

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

              <div>
                <dt className="text-slate-500">
                  Ort
                </dt>
                <dd className="font-medium text-slate-900">
                  {lead.location.postalCode}{" "}
                  {lead.location.city}
                </dd>
              </div>

              <div>
                <dt className="text-slate-500">
                  Bevorzugter Kontakt
                </dt>
                <dd className="font-medium text-slate-900">
                  {
                    CONTACT_PREFERENCE_LABELS[
                      lead.preferredContact
                    ]
                  }
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Projekt
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">
              {lead.project.interests.map(
                (interest) => (
                  <span
                    key={interest}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                  >
                    {INTEREST_LABELS[interest]}
                  </span>
                ),
              )}
            </div>

            <dl className="mt-4 space-y-3 text-sm">
              {lead.project.buildingType ? (
                <div>
                  <dt className="text-slate-500">
                    Gebäudetyp
                  </dt>
                  <dd className="font-medium text-slate-900">
                    {
                      BUILDING_TYPE_LABELS[
                        lead.project.buildingType
                      ]
                    }
                  </dd>
                </div>
              ) : null}

              {lead.project.ownership ? (
                <div>
                  <dt className="text-slate-500">
                    Nutzung / Eigentum
                  </dt>
                  <dd className="font-medium text-slate-900">
                    {
                      OWNERSHIP_LABELS[
                        lead.project.ownership
                      ]
                    }
                  </dd>
                </div>
              ) : null}
            </dl>
          </section>
        </div>

        <div className="space-y-7">
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Nachricht
            </h3>

            <p className="mt-4 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-800">
              {lead.message}
            </p>
          </section>

          <LeadWorkflowPanel lead={lead} />

          <section className="text-xs leading-5 text-slate-500">
            Datenschutz wurde bei Übermittlung der
            Anfrage bestätigt.
          </section>
        </div>
      </div>
    </article>
  );
}