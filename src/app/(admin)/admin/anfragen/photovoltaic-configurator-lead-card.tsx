import {
  formatLeadDate,
  getStatusClassName,
  LeadWorkflowPanel,
  STATUS_LABELS,
} from "./lead-admin-shared";


import type {
  BuildingType,
  HouseholdPersons,
  PhotovoltaicConfiguratorLead,
  RoofMaterial,
  RoofOrientation,
  RoofRenovationPeriod,
} from "@/types/configurator";

const PERSON_LABELS: Record<
  HouseholdPersons,
  string
> = {
  1: "1 Person",
  2: "2 Personen",
  3: "3 Personen",
  "4_5": "4–5 Personen",
};

const BUILDING_LABELS: Record<
  BuildingType,
  string
> = {
  detached_house:
    "Freistehendes Einfamilienhaus",
  semi_detached_house:
    "Doppelhaushälfte",
  mid_terrace_house:
    "Reihenmittelhaus",
  end_terrace_house:
    "Reihenendhaus",
  multi_family_house:
    "Mehrfamilienhaus",
};

const MATERIAL_LABELS: Record<
  RoofMaterial,
  string
> = {
  roof_tile: "Dachziegel",
  beaver_tail: "Biberschwanz",
  slate: "Schiefer",
  metal: "Blech",
  roofing_felt: "Dachpappe",
  gravel: "Kiesdach",
  plastic: "Kunststoff",
  other: "Sonstiges",
  unknown: "Weiß ich nicht",
};

const ORIENTATION_LABELS: Record<
  RoofOrientation,
  string
> = {
  south: "Süd",
  south_east_south_west:
    "Südost / Südwest",
  east_west: "Ost-West",
  north: "Nordorientiert",
};

const RENOVATION_LABELS: Record<
  RoofRenovationPeriod,
  string
> = {
  new_build: "Neubau",
  after_1990: "Nach 1990",
  before_1990: "Vor 1990",
  before_1960: "Vor 1960",
  unknown: "Weiß ich nicht",
};

function formatNumber(
  value: number,
): string {
  return new Intl.NumberFormat(
    "de-DE",
  ).format(value);
}

interface PhotovoltaicConfiguratorLeadCardProps {
  lead: PhotovoltaicConfiguratorLead;
}

export function PhotovoltaicConfiguratorLeadCard({
  lead,
}: PhotovoltaicConfiguratorLeadCardProps) {
  const answers =
    lead.configurator.answers;

  const result =
    lead.configurator.result;

  const interests = [
    answers.interests.batteryStorage
      ? "Stromspeicher"
      : null,
    answers.interests.climate
      ? "Klimaanlage"
      : null,
    answers.interests.heatPump
      ? "Wärmepumpe"
      : null,
    answers.interests.wallbox
      ? "Wallbox"
      : null,
  ].filter(
    (value): value is string =>
      value !== null,
  );

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

        <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
          PV-Konfigurator
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

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Haushalt & Gebäude
            </h3>

            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">
                  Haushalt
                </dt>
                <dd className="font-medium text-slate-900">
                  {
                    PERSON_LABELS[
                      answers.household.persons
                    ]
                  }
                </dd>
              </div>

              <div>
                <dt className="text-slate-500">
                  Gebäude
                </dt>
                <dd className="font-medium text-slate-900">
                  {
                    BUILDING_LABELS[
                      answers.building.type
                    ]
                  }
                </dd>
              </div>

              <div>
                <dt className="text-slate-500">
                  Aktueller Verbrauch
                </dt>
                <dd className="font-medium text-slate-900">
                  {formatNumber(
                    answers.household
                      .annualConsumptionKwh,
                  )}{" "}
                  kWh/Jahr
                </dd>
              </div>

              <div>
                <dt className="text-slate-500">
                  Mehrverbrauch
                </dt>
                <dd className="font-medium text-slate-900">
                  +
                  {
                    answers.household
                      .futureIncreasePercent
                  }{" "}
                  %
                </dd>
              </div>

              <div>
                <dt className="text-slate-500">
                  Prognostizierter Verbrauch
                </dt>
                <dd className="font-medium text-slate-900">
                  {formatNumber(
                    answers.household
                      .projectedConsumptionKwh,
                  )}{" "}
                  kWh/Jahr
                </dd>
              </div>

              <div>
                <dt className="text-slate-500">
                  Eigentum
                </dt>
                <dd className="font-medium text-slate-900">
                  Eigentümer
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Dach
            </h3>

            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">
                  Dachneigung
                </dt>
                <dd className="font-medium text-slate-900">
                  {answers.roof.pitch}°
                </dd>
              </div>

              <div>
                <dt className="text-slate-500">
                  Material
                </dt>
                <dd className="font-medium text-slate-900">
                  {
                    MATERIAL_LABELS[
                      answers.roof.material
                    ]
                  }
                </dd>
              </div>

              <div>
                <dt className="text-slate-500">
                  Ausrichtung
                </dt>
                <dd className="font-medium text-slate-900">
                  {
                    ORIENTATION_LABELS[
                      answers.roof.orientation
                    ]
                  }
                </dd>
              </div>

              <div>
                <dt className="text-slate-500">
                  Dachalter / Sanierung
                </dt>
                <dd className="font-medium text-slate-900">
                  {
                    RENOVATION_LABELS[
                      answers.roof
                        .renovationPeriod
                    ]
                  }
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="space-y-7">
          <section className="rounded-xl border border-blue-200 bg-blue-50 p-5">
            <h3 className="font-semibold text-blue-950">
              PV-Empfehlung
            </h3>

            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-blue-700">
                  Anlagenklasse
                </dt>
                <dd className="mt-1 text-lg font-semibold text-blue-950">
                  ca.{" "}
                  {
                    result.recommendedPowerKwpMin
                  }
                  –
                  {
                    result.recommendedPowerKwpMax
                  }{" "}
                  kWp
                </dd>
              </div>

              <div>
                <dt className="text-blue-700">
                  Jahresertrag
                </dt>
                <dd className="mt-1 font-semibold text-blue-950">
                  ca.{" "}
                  {formatNumber(
                    result
                      .estimatedAnnualYieldKwhMin,
                  )}
                  –
                  {formatNumber(
                    result
                      .estimatedAnnualYieldKwhMax,
                  )}{" "}
                  kWh
                </dd>
              </div>

              <div>
                <dt className="text-blue-700">
                  Zielerzeugung
                </dt>
                <dd className="font-medium text-blue-950">
                  {formatNumber(
                    result.targetAnnualGenerationKwh,
                  )}{" "}
                  kWh/Jahr
                </dd>
              </div>

              <div>
                <dt className="text-blue-700">
                  Ausrichtungsfaktor
                </dt>
                <dd className="font-medium text-blue-950">
                  {Math.round(
                    result.orientationFactor *
                      100,
                  )}{" "}
                  %
                </dd>
              </div>
            </dl>

            {result.technicalReviewRecommended ? (
              <div className="mt-5 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm font-medium text-amber-900">
                Technische Prüfung besonders
                empfohlen.
              </div>
            ) : null}
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Weitere Interessen
            </h3>

            {interests.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {interests.map(
                  (interest) => (
                    <span
                      key={interest}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                    >
                      {interest}
                    </span>
                  ),
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                Keine weiteren Interessen angegeben.
              </p>
            )}
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Anmerkungen
            </h3>

            <p className="mt-4 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-800">
              {answers.notes.hasNotes &&
              answers.notes.text
                ? answers.notes.text
                : "Keine Anmerkungen"}
            </p>
          </section>

          <LeadWorkflowPanel lead={lead} />

          <section className="text-xs leading-5 text-slate-500">
            Datenschutz wurde bei Übermittlung der
            Konfigurator-Anfrage bestätigt.
          </section>
        </div>
      </div>
    </article>
  );
}