import type {
  ConfiguratorLeadPayload,
  ConfiguratorPayload,
} from "./configurator-lead-validation";
import {
  LEAD_MAIL_RECIPIENT,
  sendMailgunMail,
} from "./mailgun";

interface MailSection {
  heading: string;

  rows?: readonly (
    readonly [
      string,
      string,
    ]
  )[];

  paragraph?: string;
}

interface ConfiguratorMailContent {
  title: string;
  subject: string;

  sections:
  readonly MailSection[];
}

function escapeHtml(
  value: string,
): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatNumber(
  value: number,
  maximumFractionDigits = 2,
): string {
  return new Intl.NumberFormat(
    "de-DE",
    {
      maximumFractionDigits,
    },
  ).format(value);
}

function formatCurrency(
  value: number,
): string {
  return new Intl.NumberFormat(
    "de-DE",
    {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    },
  ).format(value);
}

function formatBoolean(
  value: boolean,
): string {
  return value
    ? "Ja"
    : "Nein";
}

const PERSON_LABELS:
  Record<string, string> = {
  "1": "1 Person",
  "2": "2 Personen",
  "3": "3 Personen",
  "4_5": "4–5 Personen",
};

const BUILDING_LABELS:
  Record<string, string> = {
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

const ROOF_MATERIAL_LABELS:
  Record<string, string> = {
  roof_tile:
    "Dachziegel",

  beaver_tail:
    "Biberschwanz",

  slate:
    "Schiefer",

  metal:
    "Blech",

  roofing_felt:
    "Dachpappe",

  gravel:
    "Kiesdach",

  plastic:
    "Kunststoff",

  other:
    "Sonstiges",

  unknown:
    "Weiß ich nicht",
};

const ORIENTATION_LABELS:
  Record<string, string> = {
  south:
    "Süd",

  south_east_south_west:
    "Südost / Südwest",

  east_west:
    "Ost-West",

  north:
    "Nordorientiert",
};

const RENOVATION_LABELS:
  Record<string, string> = {
  new_build:
    "Neubau",

  after_1990:
    "Nach 1990",

  before_1990:
    "Vor 1990",

  before_1960:
    "Vor 1960",

  unknown:
    "Weiß ich nicht",
};

const BATTERY_PATTERN_LABELS:
  Record<string, string> = {
  mostly_daytime:
    "Überwiegend tagsüber",

  mixed:
    "Gemischt",

  mostly_evening:
    "Überwiegend abends",
};

const BATTERY_BACKUP_LABELS:
  Record<string, string> = {
  none:
    "Keine Ersatzstromfunktion",

  selected_loads:
    "Ausgewählte Verbraucher",

  whole_home:
    "Gesamtes Gebäude",
};

const BATTERY_GOAL_LABELS:
  Record<string, string> = {
  economic:
    "Wirtschaftlichkeit",

  balanced:
    "Ausgewogen",

  high_autonomy:
    "Hohe Autarkie",
};

const CLIMATE_INSULATION_LABELS:
  Record<string, string> = {
  good:
    "Gut",

  average:
    "Durchschnittlich",

  weak:
    "Eher schwach",
};

const CLIMATE_SOLAR_LABELS:
  Record<string, string> = {
  low:
    "Gering",

  medium:
    "Mittel",

  high:
    "Hoch",
};

const CLIMATE_SYSTEM_LABELS:
  Record<string, string> = {
  singleSplit:
    "Single-Split-System",

  multiSplit:
    "Multi-Split-System",

  projectPlanning:
    "Individuelle Mehrzonenplanung",
};

const HEAT_PUMP_ASSESSMENT_LABELS:
  Record<string, string> = {
  ntReady:
    "Niedertemperatur-ready",

  individualReview:
    "Individuelle Prüfung erforderlich",
};

function buildPhotovoltaicMailContent(
  configurator:
    Extract<
      ConfiguratorPayload,
      {
        type: "photovoltaic";
      }
    >,
): ConfiguratorMailContent {
  const answers =
    configurator.answers;

  const result =
    configurator.result;

  const interests = [
    answers.interests
      .batteryStorage
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
  ]
    .filter(
      (
        value,
      ): value is string =>
        value !== null,
    )
    .join(", ");

  const notes =
    answers.notes.hasNotes &&
      answers.notes.text
      ? answers.notes.text
      : "Keine Anmerkungen";

  return {
    title:
      "Neue Photovoltaik-Konfigurator-Anfrage",

    subject:
      "Neue PV-Konfigurator-Anfrage – Energie-Kraft",

    sections: [
      {
        heading:
          "Photovoltaik-Konfiguration",

        rows: [
          [
            "Haushalt",
            PERSON_LABELS[
            String(
              answers.household
                .persons,
            )
            ] ??
            String(
              answers.household
                .persons,
            ),
          ],

          [
            "Jahresverbrauch",
            `${formatNumber(
              answers.household
                .annualConsumptionKwh,
            )} kWh`,
          ],

          [
            "Zukünftige Erhöhung",
            `${formatNumber(
              answers.household
                .futureIncreasePercent,
            )} %`,
          ],

          [
            "Prognostizierter Verbrauch",
            `${formatNumber(
              answers.household
                .projectedConsumptionKwh,
            )} kWh`,
          ],

          [
            "Gebäude",
            BUILDING_LABELS[
            answers.building.type
            ] ??
            answers.building.type,
          ],

          [
            "Eigentum",
            "Eigentümer",
          ],

          [
            "Dachneigung",
            `${answers.roof.pitch}°`,
          ],

          [
            "Dachmaterial",
            ROOF_MATERIAL_LABELS[
            answers.roof.material
            ] ??
            answers.roof.material,
          ],

          [
            "Dachausrichtung",
            ORIENTATION_LABELS[
            answers.roof
              .orientation
            ] ??
            answers.roof
              .orientation,
          ],

          [
            "Dachalter / Sanierung",
            RENOVATION_LABELS[
            answers.roof
              .renovationPeriod
            ] ??
            answers.roof
              .renovationPeriod,
          ],

          [
            "Weitere Interessen",
            interests || "Keine",
          ],
        ],
      },

      {
        heading:
          "Anmerkungen",

        paragraph:
          notes,
      },

      {
        heading:
          "Ergebnis",

        rows: [
          [
            "Empfohlene Anlagenklasse",
            `ca. ${result.recommendedPowerKwpMin}–${result.recommendedPowerKwpMax} kWp`,
          ],

          [
            "Geschätzter Jahresertrag",
            `ca. ${formatNumber(
              result
                .estimatedAnnualYieldKwhMin,
            )}–${formatNumber(
              result
                .estimatedAnnualYieldKwhMax,
            )} kWh`,
          ],

          [
            "Technische Prüfung besonders empfohlen",
            formatBoolean(
              result
                .technicalReviewRecommended,
            ),
          ],
        ],
      },
    ],
  };
}

function buildBatteryStorageMailContent(
  configurator:
    Extract<
      ConfiguratorPayload,
      {
        type: "battery_storage";
      }
    >,
): ConfiguratorMailContent {
  const answers =
    configurator.answers;

  const result =
    configurator.result;

  return {
    title:
      "Neue Stromspeicher-Konfigurator-Anfrage",

    subject:
      "Neue Stromspeicher-Konfigurator-Anfrage – Energie-Kraft",

    sections: [
      {
        heading:
          "Stromspeicher-Konfiguration",

        rows: [
          [
            "Jahresverbrauch",
            answers
              .annualConsumptionKwh ===
              undefined
              ? "Aus PV-Konfiguration übernommen"
              : `${formatNumber(
                answers
                  .annualConsumptionKwh,
              )} kWh`,
          ],

          [
            "PV-Leistung",
            answers.pvPowerKwp ===
              undefined
              ? "Aus PV-Konfiguration übernommen"
              : `${formatNumber(
                answers.pvPowerKwp,
              )} kWp`,
          ],

          [
            "Verbrauchsprofil",
            BATTERY_PATTERN_LABELS[
            answers
              .consumptionPattern
            ] ??
            answers
              .consumptionPattern,
          ],

          [
            "Ersatzstrom",
            BATTERY_BACKUP_LABELS[
            answers
              .backupPreference
            ] ??
            answers
              .backupPreference,
          ],

          [
            "Ziel",
            BATTERY_GOAL_LABELS[
            answers.goal
            ] ??
            answers.goal,
          ],
        ],
      },

      {
        heading:
          "Ergebnis",

        rows: [
          [
            "Quelle",
            result.source ===
              "photovoltaic"
              ? "Photovoltaik-Konfiguration"
              : "Eigenständige Konfiguration",
          ],

          [
            "Empfohlene nutzbare Kapazität",
            `${formatNumber(
              result
                .recommendedUsableCapacityKwhMin,
            )}–${formatNumber(
              result
                .recommendedUsableCapacityKwhMax,
            )} kWh`,
          ],

          [
            "Technische Obergrenze",
            `${formatNumber(
              result
                .technicalUpperBoundUsableCapacityKwh,
            )} kWh`,
          ],

          [
            "PV-Überschuss wahrscheinlich",
            formatBoolean(
              result.pvSurplusLikely,
            ),
          ],

          [
            "Ersatzstrom gewünscht",
            formatBoolean(
              result
                .backupPowerRequested,
            ),
          ],

          [
            "Technische Prüfung empfohlen",
            formatBoolean(
              result
                .technicalReviewRecommended,
            ),
          ],
        ],
      },
    ],
  };
}

function buildWallboxMailContent(
  configurator:
    Extract<
      ConfiguratorPayload,
      {
        type: "wallbox";
      }
    >,
): ConfiguratorMailContent {
  const answers =
    configurator.answers;

  const result =
    configurator.result;

  return {
    title:
      "Neue Wallbox-Konfigurator-Anfrage",

    subject:
      "Neue Wallbox-Konfigurator-Anfrage – Energie-Kraft",

    sections: [
      {
        heading:
          "Wallbox-Konfiguration",

        rows: [
          [
            "Jährliche Fahrleistung",
            `${formatNumber(
              answers.annualDrivingKm,
            )} km`,
          ],

          [
            "Fahrzeugverbrauch",
            `${formatNumber(
              answers
                .vehicleConsumptionKwhPer100Km,
            )} kWh/100 km`,
          ],

          [
            "Batteriekapazität",
            `${formatNumber(
              answers
                .batteryCapacityKwh,
            )} kWh`,
          ],

          [
            "Laden zu Hause",
            `${formatNumber(
              answers
                .homeChargingSharePercent,
            )} %`,
          ],

          [
            "Ladeleistung",
            `${formatNumber(
              answers.chargingPowerKw,
            )} kW`,
          ],

          [
            "PV-Ladeanteil",
            `${formatNumber(
              answers
                .pvChargingSharePercent,
            )} %`,
          ],
        ],
      },

      {
        heading:
          "Ergebnis",

        rows: [
          [
            "Fahrzeugenergie pro Jahr",
            `${formatNumber(
              result
                .annualVehicleEnergyDemandKwh,
            )} kWh`,
          ],

          [
            "Laden zu Hause",
            `${formatNumber(
              result
                .annualHomeChargingInputEnergyKwh,
            )} kWh/Jahr`,
          ],

          [
            "PV-Ladeenergie",
            `${formatNumber(
              result
                .annualPvChargingEnergyKwh,
            )} kWh/Jahr`,
          ],

          [
            "Netz-Ladeenergie",
            `${formatNumber(
              result
                .annualGridChargingEnergyKwh,
            )} kWh/Jahr`,
          ],

          [
            "Typische Ladedauer",
            `${formatNumber(
              result
                .typicalChargingTimeHours,
            )} Stunden`,
          ],

          [
            "Ladekosten",
            `${formatCurrency(
              result
                .annualHomeChargingCostEuro,
            )}/Jahr`,
          ],

          [
            "Projektkosten-Korridor",
            `${formatCurrency(
              result
                .estimatedMinimumCostEuro,
            )} – ${formatCurrency(
              result
                .estimatedMaximumCostEuro,
            )}`,
          ],

          [
            "Technische Prüfung empfohlen",
            formatBoolean(
              result
                .technicalReviewRecommended,
            ),
          ],
        ],
      },
    ],
  };
}

function buildHeatPumpMailContent(
  configurator:
    Extract<
      ConfiguratorPayload,
      {
        type: "heat_pump";
      }
    >,
): ConfiguratorMailContent {
  const answers =
    configurator.answers;

  const result =
    configurator.result;

  return {
    title:
      "Neue Wärmepumpen-Konfigurator-Anfrage",

    subject:
      "Neue Wärmepumpen-Konfigurator-Anfrage – Energie-Kraft",

    sections: [
      {
        heading:
          "Wärmepumpen-Konfiguration",

        rows: [
          [
            "Beheizte Fläche",
            `${formatNumber(
              answers.heatedAreaM2,
            )} m²`,
          ],

          [
            "Spezifischer Wärmebedarf",
            `${formatNumber(
              answers
                .specificSpaceHeatingDemandKwhPerM2Year,
            )} kWh/m²/Jahr`,
          ],

          [
            "Personen",
            formatNumber(
              answers.occupancyPersons,
            ),
          ],

          [
            "Vorlauftemperatur",
            `${formatNumber(
              answers
                .requiredFlowTemperatureC,
            )} °C`,
          ],

          [
            "Jahresarbeitszahl",
            formatNumber(
              answers
                .annualPerformanceFactor,
            ),
          ],
        ],
      },

      {
        heading:
          "Ergebnis",

        rows: [
          [
            "Empfohlene Wärmepumpenleistung",
            `${formatNumber(
              result
                .recommendedHeatPumpCapacityKw,
            )} kW`,
          ],

          [
            "Jährlicher Wärmebedarf",
            `${formatNumber(
              result
                .totalAnnualHeatDemandKwh,
            )} kWh`,
          ],

          [
            "Wärmepumpen-Stromverbrauch",
            `${formatNumber(
              result
                .annualHeatPumpElectricityConsumptionKwh,
            )} kWh/Jahr`,
          ],

          [
            "Stromkosten",
            `${formatCurrency(
              result
                .annualHeatPumpOperatingCostEuro,
            )}/Jahr`,
          ],

          [
            "Projektkosten-Korridor",
            `${formatCurrency(
              result
                .estimatedMinimumCostEuro,
            )} – ${formatCurrency(
              result
                .estimatedMaximumCostEuro,
            )}`,
          ],

          [
            "Heizsystem-Einschätzung",
            HEAT_PUMP_ASSESSMENT_LABELS[
            result
              .flowTemperatureAssessment
            ] ??
            result
              .flowTemperatureAssessment,
          ],

          [
            "Technische Prüfung empfohlen",
            formatBoolean(
              result
                .technicalReviewRecommended,
            ),
          ],
        ],
      },
    ],
  };
}

function buildClimateMailContent(
  configurator:
    Extract<
      ConfiguratorPayload,
      {
        type: "climate";
      }
    >,
): ConfiguratorMailContent {
  const answers =
    configurator.answers;

  const result =
    configurator.result;

  return {
    title:
      "Neue Klimaanlagen-Konfigurator-Anfrage",

    subject:
      "Neue Klimaanlagen-Konfigurator-Anfrage – Energie-Kraft",

    sections: [
      {
        heading:
          "Klimaanlagen-Konfiguration",

        rows: [
          [
            "Zu klimatisierende Fläche",
            `${formatNumber(
              answers
                .conditionedAreaM2,
            )} m²`,
          ],

          [
            "Räume / Zonen",
            formatNumber(
              answers.roomCount,
            ),
          ],

          [
            "Gebäudezustand",
            CLIMATE_INSULATION_LABELS[
            answers
              .insulationLevel
            ] ??
            answers
              .insulationLevel,
          ],

          [
            "Sonneneinstrahlung",
            CLIMATE_SOLAR_LABELS[
            answers.solarLoad
            ] ??
            answers.solarLoad,
          ],

          [
            "Personen",
            formatNumber(
              answers
                .occupancyPersons,
            ),
          ],
        ],
      },

      {
        heading:
          "Ergebnis",

        rows: [
          [
            "Empfohlene Kühlleistung",
            `${formatNumber(
              result
                .recommendedCoolingCapacityKw,
            )} kW`,
          ],

          [
            "Berechnete Kühllast",
            `${formatNumber(
              result
                .calculatedCoolingLoadKw,
            )} kW`,
          ],

          [
            "System",
            CLIMATE_SYSTEM_LABELS[
            result
              .systemRecommendation
            ] ??
            result
              .systemRecommendation,
          ],

          [
            "Innengeräte",
            formatNumber(
              result
                .recommendedIndoorUnitCount,
            ),
          ],

          [
            "Stromverbrauch",
            `${formatNumber(
              result
                .annualElectricityConsumptionKwh,
            )} kWh/Jahr`,
          ],

          [
            "Stromkosten",
            `${formatCurrency(
              result
                .annualOperatingCostEuro,
            )}/Jahr`,
          ],

          [
            "Projektkosten-Korridor",
            `${formatCurrency(
              result
                .estimatedMinimumCostEuro,
            )} – ${formatCurrency(
              result
                .estimatedMaximumCostEuro,
            )}`,
          ],

          [
            "Individuelle Planung empfohlen",
            formatBoolean(
              result
                .individualPlanningRecommended,
            ),
          ],
        ],
      },
    ],
  };
}

function buildConfiguratorMailContent(
  configurator:
    ConfiguratorPayload,
): ConfiguratorMailContent {
  switch (configurator.type) {
    case "photovoltaic":
      return buildPhotovoltaicMailContent(
        configurator,
      );

    case "battery_storage":
      return buildBatteryStorageMailContent(
        configurator,
      );

    case "wallbox":
      return buildWallboxMailContent(
        configurator,
      );

    case "heat_pump":
      return buildHeatPumpMailContent(
        configurator,
      );

    case "climate":
      return buildClimateMailContent(
        configurator,
      );
  }
}

const CONFIGURATOR_LABELS: Record<
  ConfiguratorPayload["type"],
  string
> = {
  photovoltaic:
    "Photovoltaik",

  battery_storage:
    "Stromspeicher",

  wallbox:
    "Wallbox",

  heat_pump:
    "Wärmepumpe",

  climate:
    "Klimaanlage",
};

function buildProjectMailContent(
  lead: ConfiguratorLeadPayload,
): ConfiguratorMailContent {
  const productContents =
    lead.configurators.map(
      (configurator) => ({
        configurator,
        content:
          buildConfiguratorMailContent(
            configurator,
          ),
      }),
    );

  const productLabels =
    lead.products.map(
      (product) =>
        CONFIGURATOR_LABELS[
        product
        ],
    );

  return {
    title:
      "Neue Energieprojekt-Konfigurator-Anfrage",

    subject:
      `Neue Energieprojekt-Anfrage – ${productLabels.join(
        " + ",
      )}`,

    sections: [
      {
        heading:
          "Energieprojekt",

        rows: [
          [
            "Produkte",
            productLabels.join(", "),
          ],

          [
            "Einstieg",
            CONFIGURATOR_LABELS[
            lead.journey
              .entryPoint
            ],
          ],

          [
            "Abgeschlossene Konfiguratoren",
            String(
              lead.journey
                .completedProducts
                .length,
            ),
          ],
        ],
      },

      ...productContents.flatMap(
        ({
          configurator,
          content,
        }) => [
            {
              heading:
                CONFIGURATOR_LABELS[
                configurator.type
                ],

              paragraph:
                "Konfigurator abgeschlossen",
            },

            ...content.sections,
          ],
      ),
    ],
  };
}

function renderTextSection(
  section: MailSection,
): string {
  if (section.rows) {
    const rows =
      section.rows
        .map(
          ([label, value]) =>
            `${label}: ${value}`,
        )
        .join("\n");

    return `${section.heading}
${"-".repeat(
      section.heading.length,
    )}
${rows}`;
  }

  return `${section.heading}
${"-".repeat(
    section.heading.length,
  )}
${section.paragraph ?? ""}`;
}

function renderHtmlSection(
  section: MailSection,
): string {
  if (section.rows) {
    const rows =
      section.rows
        .map(
          ([label, value]) =>
            `<tr>
              <td><strong>${escapeHtml(label)}</strong></td>
              <td>${escapeHtml(value)}</td>
            </tr>`,
        )
        .join("");

    return `
      <h3>${escapeHtml(section.heading)}</h3>

      <table cellpadding="6" cellspacing="0">
        ${rows}
      </table>
    `;
  }

  return `
    <h3>${escapeHtml(section.heading)}</h3>

    <p style="white-space: pre-wrap;">${escapeHtml(
    section.paragraph ?? "",
  )}</p>
  `;
}

interface SendConfiguratorLeadMailInput {
  leadId: string;
  lead: ConfiguratorLeadPayload;
}

export async function sendConfiguratorLeadMail({
  leadId,
  lead,
}: SendConfiguratorLeadMailInput) {
  const content =
    buildProjectMailContent(
      lead,
    );

  const phone =
    lead.contact.phone?.trim() ||
    "Keine Angabe";

  const installationRows:
    readonly (
      readonly [
        string,
        string,
      ]
    )[] = [
      [
        "Am Wohnort",
        lead.installation.atResidence
          ? "Ja"
          : "Nein",
      ],

      [
        "Straße",
        lead.installation.street,
      ],

      [
        "PLZ",
        lead.installation.postalCode,
      ],

      [
        "Ort",
        lead.installation.city,
      ],
    ];

  const contactRows:
    readonly (
      readonly [
        string,
        string,
      ]
    )[] = [
      [
        "Vorname",
        lead.contact.firstName,
      ],

      [
        "Nachname",
        lead.contact.lastName,
      ],

      [
        "E-Mail",
        lead.contact.email,
      ],

      [
        "Telefon",
        phone,
      ],
    ];

  const commonSections:
    readonly MailSection[] = [
      {
        heading:
          "Kontaktdaten",

        rows:
          contactRows,
      },

      {
        heading:
          "Installationsort",

        rows:
          installationRows,
      },
    ];

  const allSections = [
    ...commonSections,
    ...content.sections,
  ];

  const text = `
${content.title}

Lead-ID: ${leadId}

${allSections
      .map(renderTextSection)
      .join("\n\n")}

Lead-ID:
${leadId}
  `.trim();

  const html = `
    <h2>${escapeHtml(content.title)}</h2>

    <p>
      <strong>Lead-ID:</strong>
      ${escapeHtml(leadId)}
    </p>

    ${allSections
      .map(renderHtmlSection)
      .join("")}

    <hr />

    <p style="font-size: 12px; color: #666;">
      Lead-ID: ${escapeHtml(leadId)}
    </p>
  `;

  return sendMailgunMail({
    to: LEAD_MAIL_RECIPIENT,

    replyTo:
      lead.contact.email,

    subject:
      content.subject,

    text,

    html,
  });
}