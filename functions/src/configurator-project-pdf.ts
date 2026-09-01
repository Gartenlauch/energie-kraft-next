import PDFDocument from "pdfkit";

import type {
    ConfiguratorLeadPayload,
    ConfiguratorPayload,
} from "./configurator-lead-validation";

interface GenerateConfiguratorProjectPdfInput {
    leadId: string;
    lead: ConfiguratorLeadPayload;
}

interface PdfRow {
    label: string;
    value: string;
}

interface ProductTheme {
    label: string;
    accent: string;
    background: string;
    border: string;
}

const COLORS = {
    primary: "#12372A",
    secondary: "#7A8F35",
    text: "#17211B",
    muted: "#66736B",
    lightMuted: "#F4F6F3",
    border: "#D9E0DA",
    white: "#FFFFFF",
    warningBackground: "#FFF8E6",
    warningBorder: "#E3B341",
    warningText: "#654B00",
} as const;

const PRODUCT_THEMES: Record<
    ConfiguratorPayload["type"],
    ProductTheme
> = {
    photovoltaic: {
        label: "Photovoltaik",
        accent: "#B77A00",
        background: "#FFF5D6",
        border: "#E7BD56",
    },

    battery_storage: {
        label: "Stromspeicher",
        accent: "#26734D",
        background: "#E8F5ED",
        border: "#79B994",
    },

    wallbox: {
        label: "Wallbox",
        accent: "#3849A5",
        background: "#EEF0FF",
        border: "#929DE0",
    },

    heat_pump: {
        label: "Wärmepumpe",
        accent: "#A44550",
        background: "#FBEDEF",
        border: "#D59098",
    },

    climate: {
        label: "Klimaanlage",
        accent: "#277597",
        background: "#EAF6FB",
        border: "#7CB8D0",
    },
};

const PERSON_LABELS: Record<string, string> = {
    "1": "1 Person",
    "2": "2 Personen",
    "3": "3 Personen",
    "4_5": "4–5 Personen",
};

const BUILDING_LABELS: Record<string, string> = {
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

const HEAT_PUMP_ASSESSMENT_LABELS:
    Record<string, string> = {
    ntReady:
        "Niedertemperatur-ready",

    individualReview:
        "Individuelle Prüfung erforderlich",
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

const numberFormatter =
    new Intl.NumberFormat(
        "de-DE",
        {
            maximumFractionDigits: 1,
        },
    );

const currencyFormatter =
    new Intl.NumberFormat(
        "de-DE",
        {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
        },
    );

function formatNumber(
    value: number,
): string {
    return numberFormatter.format(
        value,
    );
}

function formatCurrency(
    value: number,
): string {
    return currencyFormatter.format(
        value,
    );
}

function formatBoolean(
    value: boolean,
): string {
    return value
        ? "Ja"
        : "Nein";
}

function getPageContentWidth(
    document: PDFKit.PDFDocument,
): number {
    return (
        document.page.width -
        document.page.margins.left -
        document.page.margins.right
    );
}

function drawHorizontalLine(
    document: PDFKit.PDFDocument,
    y: number,
    color: string = COLORS.border,
): void {
    document
        .save()
        .strokeColor(color)
        .lineWidth(1)
        .moveTo(
            document.page.margins.left,
            y,
        )
        .lineTo(
            document.page.width -
            document.page.margins.right,
            y,
        )
        .stroke()
        .restore();
}

function drawPageHeader(
    document: PDFKit.PDFDocument,
): void {
    const left =
        document.page.margins.left;

    document
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(COLORS.primary)
        .text(
            "ENERGIE-KRAFT",
            left,
            34,
            {
                continued: false,
            },
        );

    document
        .font("Helvetica")
        .fontSize(8)
        .fillColor(COLORS.muted)
        .text(
            "Persönliche Projektübersicht",
            left + 95,
            36,
        );

    drawHorizontalLine(
        document,
        54,
    );

    document.y = 78;
}

function drawProductBadge(
    document: PDFKit.PDFDocument,
    product:
        ConfiguratorPayload["type"],
    x: number,
    y: number,
): number {
    const theme =
        PRODUCT_THEMES[product];

    document
        .font("Helvetica-Bold")
        .fontSize(9);

    const width =
        document.widthOfString(
            theme.label,
        ) + 22;

    document
        .save()
        .roundedRect(
            x,
            y,
            width,
            23,
            11.5,
        )
        .fillAndStroke(
            theme.background,
            theme.border,
        )
        .restore();

    document
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(theme.accent)
        .text(
            theme.label,
            x + 11,
            y + 7,
            {
                lineBreak: false,
            },
        );

    return width;
}

function drawProductBadges(
    document: PDFKit.PDFDocument,
    products:
        readonly ConfiguratorPayload["type"][],
    startY: number,
): number {
    const left =
        document.page.margins.left;

    const right =
        document.page.width -
        document.page.margins.right;

    let x = left;
    let y = startY;

    for (
        const product of products
    ) {
        document
            .font("Helvetica-Bold")
            .fontSize(9);

        const theme =
            PRODUCT_THEMES[product];

        const badgeWidth =
            document.widthOfString(
                theme.label,
            ) + 22;

        if (
            x + badgeWidth > right
        ) {
            x = left;
            y += 31;
        }

        const width =
            drawProductBadge(
                document,
                product,
                x,
                y,
            );

        x += width + 8;
    }

    return y + 23;
}

function drawSectionTitle(
    document: PDFKit.PDFDocument,
    title: string,
): void {
    document
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor(COLORS.primary)
        .text(title);

    document.moveDown(0.55);
}

function drawRows(
    document: PDFKit.PDFDocument,
    rows: readonly PdfRow[],
): void {
    const left =
        document.page.margins.left;

    const totalWidth =
        getPageContentWidth(
            document,
        );

    const labelWidth = 190;

    const valueWidth =
        totalWidth -
        labelWidth -
        20;

    for (
        const row of rows
    ) {
        const rowTop =
            document.y;

        document
            .font("Helvetica")
            .fontSize(9)
            .fillColor(COLORS.muted);

        const labelHeight =
            document.heightOfString(
                row.label,
                {
                    width:
                        labelWidth - 12,
                },
            );

        document
            .font("Helvetica-Bold")
            .fontSize(9)
            .fillColor(COLORS.text);

        const valueHeight =
            document.heightOfString(
                row.value,
                {
                    width:
                        valueWidth - 12,
                },
            );

        const rowHeight =
            Math.max(
                29,
                labelHeight + 14,
                valueHeight + 14,
            );

        document
            .save()
            .roundedRect(
                left,
                rowTop,
                totalWidth,
                rowHeight,
                5,
            )
            .fill(
                COLORS.lightMuted,
            )
            .restore();

        document
            .font("Helvetica")
            .fontSize(9)
            .fillColor(COLORS.muted)
            .text(
                row.label,
                left + 9,
                rowTop + 8,
                {
                    width:
                        labelWidth - 18,
                },
            );

        document
            .font("Helvetica-Bold")
            .fontSize(9)
            .fillColor(COLORS.text)
            .text(
                row.value,
                left +
                labelWidth +
                10,
                rowTop + 8,
                {
                    width:
                        valueWidth - 18,
                },
            );

        document.y =
            rowTop +
            rowHeight +
            5;
    }
}

function drawDisclaimer(
    document: PDFKit.PDFDocument,
): void {
    const left =
        document.page.margins.left;

    const width =
        getPageContentWidth(
            document,
        );

    const y =
        document.y;

    const text =
        "Diese Projektübersicht dient ausschließlich als unverbindliche Orientierung. " +
        "Sie ist kein Angebot, keine technische Planung und keine Zusage zur technischen Umsetzbarkeit. " +
        "Verbindliche Angaben zu Auslegung, Kosten, Förderfähigkeit, Montage und technischer Realisierbarkeit " +
        "sind erst nach fachlicher Prüfung und gegebenenfalls einer Vor-Ort-Besichtigung möglich.";

    document
        .font("Helvetica")
        .fontSize(9);

    const textHeight =
        document.heightOfString(
            text,
            {
                width:
                    width - 30,
            },
        );

    const boxHeight =
        textHeight + 48;

    document
        .save()
        .roundedRect(
            left,
            y,
            width,
            boxHeight,
            8,
        )
        .fillAndStroke(
            COLORS.warningBackground,
            COLORS.warningBorder,
        )
        .restore();

    document
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(
            COLORS.warningText,
        )
        .text(
            "Wichtiger Hinweis",
            left + 15,
            y + 13,
        );

    document
        .font("Helvetica")
        .fontSize(9)
        .fillColor(
            COLORS.warningText,
        )
        .text(
            text,
            left + 15,
            y + 31,
            {
                width:
                    width - 30,
                lineGap: 2,
            },
        );

    document.y =
        y + boxHeight + 12;
}

function getPhotovoltaicRows(
    configurator:
        Extract<
            ConfiguratorPayload,
            {
                type: "photovoltaic";
            }
        >,
): {
    inputRows: PdfRow[];
    resultRows: PdfRow[];
} {
    const answers =
        configurator.answers;

    const result =
        configurator.result;

    const interests = [
        answers.interests
            .batteryStorage
            ? "Stromspeicher"
            : null,

        answers.interests
            .wallbox
            ? "Wallbox"
            : null,

        answers.interests
            .heatPump
            ? "Wärmepumpe"
            : null,

        answers.interests
            .climate
            ? "Klimaanlage"
            : null,
    ]
        .filter(
            (
                value,
            ): value is string =>
                value !== null,
        )
        .join(", ");

    return {
        inputRows: [
            {
                label:
                    "Haushalt",
                value:
                    PERSON_LABELS[
                    String(
                        answers
                            .household
                            .persons,
                    )
                    ] ??
                    String(
                        answers
                            .household
                            .persons,
                    ),
            },

            {
                label:
                    "Gebäude",
                value:
                    BUILDING_LABELS[
                    answers
                        .building
                        .type
                    ] ??
                    answers
                        .building
                        .type,
            },

            {
                label:
                    "Aktueller Stromverbrauch",
                value:
                    `${formatNumber(
                        answers
                            .household
                            .annualConsumptionKwh,
                    )} kWh/Jahr`,
            },

            {
                label:
                    "Prognostizierter Stromverbrauch",
                value:
                    `${formatNumber(
                        answers
                            .household
                            .projectedConsumptionKwh,
                    )} kWh/Jahr`,
            },

            {
                label:
                    "Dachneigung",
                value:
                    `${answers.roof.pitch}°`,
            },

            {
                label:
                    "Dachmaterial",
                value:
                    ROOF_MATERIAL_LABELS[
                    answers
                        .roof
                        .material
                    ] ??
                    answers
                        .roof
                        .material,
            },

            {
                label:
                    "Dachausrichtung",
                value:
                    ORIENTATION_LABELS[
                    answers
                        .roof
                        .orientation
                    ] ??
                    answers
                        .roof
                        .orientation,
            },

            {
                label:
                    "Dachalter / Sanierung",
                value:
                    RENOVATION_LABELS[
                    answers
                        .roof
                        .renovationPeriod
                    ] ??
                    answers
                        .roof
                        .renovationPeriod,
            },

            {
                label:
                    "Weitere Energielösungen",
                value:
                    interests || "Keine",
            },
        ],

        resultRows: [
            {
                label:
                    "Empfohlene Anlagenklasse",
                value:
                    `ca. ${formatNumber(
                        result
                            .recommendedPowerKwpMin,
                    )}–${formatNumber(
                        result
                            .recommendedPowerKwpMax,
                    )} kWp`,
            },

            {
                label:
                    "Geschätzter Jahresertrag",
                value:
                    `ca. ${formatNumber(
                        result
                            .estimatedAnnualYieldKwhMin,
                    )}–${formatNumber(
                        result
                            .estimatedAnnualYieldKwhMax,
                    )} kWh/Jahr`,
            },

            {
                label:
                    "Stromspeicher berücksichtigt",
                value:
                    formatBoolean(
                        result
                            .batteryStorageRequested,
                    ),
            },

            {
                label:
                    "Vertiefte technische Prüfung",
                value:
                    result
                        .technicalReviewRecommended
                        ? "Besonders empfohlen"
                        : "Standardprüfung",
            },
        ],
    };
}

function getBatteryStorageRows(
    configurator:
        Extract<
            ConfiguratorPayload,
            {
                type:
                "battery_storage";
            }
        >,
): {
    inputRows: PdfRow[];
    resultRows: PdfRow[];
} {
    const answers =
        configurator.answers;

    const result =
        configurator.result;

    return {
        inputRows: [
            {
                label:
                    "Jahresverbrauch",
                value:
                    answers
                        .annualConsumptionKwh ===
                        undefined
                        ? "Aus Photovoltaik-Konfiguration übernommen"
                        : `${formatNumber(
                            answers
                                .annualConsumptionKwh,
                        )} kWh/Jahr`,
            },

            {
                label:
                    "PV-Leistung",
                value:
                    answers.pvPowerKwp ===
                        undefined
                        ? "Aus Photovoltaik-Konfiguration übernommen"
                        : `${formatNumber(
                            answers
                                .pvPowerKwp,
                        )} kWp`,
            },

            {
                label:
                    "Verbrauchsprofil",
                value:
                    BATTERY_PATTERN_LABELS[
                    answers
                        .consumptionPattern
                    ] ??
                    answers
                        .consumptionPattern,
            },

            {
                label:
                    "Ersatzstrom",
                value:
                    BATTERY_BACKUP_LABELS[
                    answers
                        .backupPreference
                    ] ??
                    answers
                        .backupPreference,
            },

            {
                label:
                    "Ziel",
                value:
                    BATTERY_GOAL_LABELS[
                    answers.goal
                    ] ??
                    answers.goal,
            },
        ],

        resultRows: [
            {
                label:
                    "Empfohlene nutzbare Kapazität",
                value:
                    `ca. ${formatNumber(
                        result
                            .recommendedUsableCapacityKwhMin,
                    )}–${formatNumber(
                        result
                            .recommendedUsableCapacityKwhMax,
                    )} kWh`,
            },

            {
                label:
                    "Technische Obergrenze",
                value:
                    `${formatNumber(
                        result
                            .technicalUpperBoundUsableCapacityKwh,
                    )} kWh`,
            },

            {
                label:
                    "PV-Überschuss wahrscheinlich",
                value:
                    formatBoolean(
                        result
                            .pvSurplusLikely,
                    ),
            },

            {
                label:
                    "Technische Prüfung",
                value:
                    result
                        .technicalReviewRecommended
                        ? "Besonders empfohlen"
                        : "Standardprüfung",
            },
        ],
    };
}

function getWallboxRows(
    configurator:
        Extract<
            ConfiguratorPayload,
            {
                type: "wallbox";
            }
        >,
): {
    inputRows: PdfRow[];
    resultRows: PdfRow[];
} {
    const answers =
        configurator.answers;

    const result =
        configurator.result;

    return {
        inputRows: [
            {
                label:
                    "Jährliche Fahrleistung",
                value:
                    `${formatNumber(
                        answers.annualDrivingKm,
                    )} km/Jahr`,
            },

            {
                label:
                    "Fahrzeugverbrauch",
                value:
                    `${formatNumber(
                        answers
                            .vehicleConsumptionKwhPer100Km,
                    )} kWh/100 km`,
            },

            {
                label:
                    "Fahrzeug-Batteriekapazität",
                value:
                    `${formatNumber(
                        answers
                            .batteryCapacityKwh,
                    )} kWh`,
            },

            {
                label:
                    "Laden zu Hause",
                value:
                    `${formatNumber(
                        answers
                            .homeChargingSharePercent,
                    )} %`,
            },

            {
                label:
                    "Gewünschte Ladeleistung",
                value:
                    `${formatNumber(
                        answers.chargingPowerKw,
                    )} kW`,
            },

            {
                label:
                    "PV-Ladeanteil",
                value:
                    `${formatNumber(
                        answers
                            .pvChargingSharePercent,
                    )} %`,
            },
        ],

        resultRows: [
            {
                label:
                    "Typische Ladedauer",
                value:
                    `${formatNumber(
                        result
                            .typicalChargingTimeHours,
                    )} Stunden`,
            },

            {
                label:
                    "Laden zu Hause",
                value:
                    `${formatNumber(
                        result
                            .annualHomeChargingInputEnergyKwh,
                    )} kWh/Jahr`,
            },

            {
                label:
                    "PV-Ladeenergie",
                value:
                    `${formatNumber(
                        result
                            .annualPvChargingEnergyKwh,
                    )} kWh/Jahr`,
            },

            {
                label:
                    "Geschätzter Kostenkorridor",
                value:
                    `${formatCurrency(
                        result
                            .estimatedMinimumCostEuro,
                    )} – ${formatCurrency(
                        result
                            .estimatedMaximumCostEuro,
                    )}`,
            },

            {
                label:
                    "Technische Prüfung",
                value:
                    result
                        .technicalReviewRecommended
                        ? "Besonders empfohlen"
                        : "Standardprüfung",
            },
        ],
    };
}

function getHeatPumpRows(
    configurator:
        Extract<
            ConfiguratorPayload,
            {
                type: "heat_pump";
            }
        >,
): {
    inputRows: PdfRow[];
    resultRows: PdfRow[];
} {
    const answers =
        configurator.answers;

    const result =
        configurator.result;

    return {
        inputRows: [
            {
                label:
                    "Beheizte Fläche",
                value:
                    `${formatNumber(
                        answers.heatedAreaM2,
                    )} m²`,
            },

            {
                label:
                    "Spezifischer Wärmebedarf",
                value:
                    `${formatNumber(
                        answers
                            .specificSpaceHeatingDemandKwhPerM2Year,
                    )} kWh/m²/Jahr`,
            },

            {
                label:
                    "Personen",
                value:
                    String(
                        answers
                            .occupancyPersons,
                    ),
            },

            {
                label:
                    "Benötigte Vorlauftemperatur",
                value:
                    `${formatNumber(
                        answers
                            .requiredFlowTemperatureC,
                    )} °C`,
            },

            {
                label:
                    "Angenommene Jahresarbeitszahl",
                value:
                    formatNumber(
                        answers
                            .annualPerformanceFactor,
                    ),
            },
        ],

        resultRows: [
            {
                label:
                    "Empfohlene Wärmepumpenleistung",
                value:
                    `${formatNumber(
                        result
                            .recommendedHeatPumpCapacityKw,
                    )} kW`,
            },

            {
                label:
                    "Jährlicher Wärmebedarf",
                value:
                    `${formatNumber(
                        result
                            .totalAnnualHeatDemandKwh,
                    )} kWh/Jahr`,
            },

            {
                label:
                    "Geschätzter Strombedarf",
                value:
                    `${formatNumber(
                        result
                            .annualHeatPumpElectricityConsumptionKwh,
                    )} kWh/Jahr`,
            },

            {
                label:
                    "Systemeinschätzung",
                value:
                    HEAT_PUMP_ASSESSMENT_LABELS[
                    result
                        .flowTemperatureAssessment
                    ] ??
                    result
                        .flowTemperatureAssessment,
            },

            {
                label:
                    "Geschätzter Kostenkorridor",
                value:
                    `${formatCurrency(
                        result
                            .estimatedMinimumCostEuro,
                    )} – ${formatCurrency(
                        result
                            .estimatedMaximumCostEuro,
                    )}`,
            },

            {
                label:
                    "Technische Prüfung",
                value:
                    result
                        .technicalReviewRecommended
                        ? "Besonders empfohlen"
                        : "Standardprüfung",
            },
        ],
    };
}

function getClimateRows(
    configurator:
        Extract<
            ConfiguratorPayload,
            {
                type: "climate";
            }
        >,
): {
    inputRows: PdfRow[];
    resultRows: PdfRow[];
} {
    const answers =
        configurator.answers;

    const result =
        configurator.result;

    return {
        inputRows: [
            {
                label:
                    "Zu klimatisierende Fläche",
                value:
                    `${formatNumber(
                        answers
                            .conditionedAreaM2,
                    )} m²`,
            },

            {
                label:
                    "Räume / Zonen",
                value:
                    String(
                        answers.roomCount,
                    ),
            },

            {
                label:
                    "Gebäudezustand",
                value:
                    CLIMATE_INSULATION_LABELS[
                    answers
                        .insulationLevel
                    ] ??
                    answers
                        .insulationLevel,
            },

            {
                label:
                    "Sonneneinstrahlung",
                value:
                    CLIMATE_SOLAR_LABELS[
                    answers.solarLoad
                    ] ??
                    answers.solarLoad,
            },

            {
                label:
                    "Personen",
                value:
                    String(
                        answers
                            .occupancyPersons,
                    ),
            },
        ],

        resultRows: [
            {
                label:
                    "Empfohlene Kühlleistung",
                value:
                    `${formatNumber(
                        result
                            .recommendedCoolingCapacityKw,
                    )} kW`,
            },

            {
                label:
                    "Empfohlene Innengeräte",
                value:
                    String(
                        result
                            .recommendedIndoorUnitCount,
                    ),
            },

            {
                label:
                    "Systemempfehlung",
                value:
                    CLIMATE_SYSTEM_LABELS[
                    result
                        .systemRecommendation
                    ] ??
                    result
                        .systemRecommendation,
            },

            {
                label:
                    "Geschätzter Strombedarf",
                value:
                    `${formatNumber(
                        result
                            .annualElectricityConsumptionKwh,
                    )} kWh/Jahr`,
            },

            {
                label:
                    "Geschätzter Kostenkorridor",
                value:
                    `${formatCurrency(
                        result
                            .estimatedMinimumCostEuro,
                    )} – ${formatCurrency(
                        result
                            .estimatedMaximumCostEuro,
                    )}`,
            },

            {
                label:
                    "Individuelle Planung",
                value:
                    result
                        .individualPlanningRecommended
                        ? "Empfohlen"
                        : "Standardplanung",
            },
        ],
    };
}

function getProductRows(
    configurator:
        ConfiguratorPayload,
): {
    inputRows: PdfRow[];
    resultRows: PdfRow[];
} {
    switch (configurator.type) {
        case "photovoltaic":
            return getPhotovoltaicRows(
                configurator,
            );

        case "battery_storage":
            return getBatteryStorageRows(
                configurator,
            );

        case "wallbox":
            return getWallboxRows(
                configurator,
            );

        case "heat_pump":
            return getHeatPumpRows(
                configurator,
            );

        case "climate":
            return getClimateRows(
                configurator,
            );
    }
}

function drawCover(
    document: PDFKit.PDFDocument,
    input:
        GenerateConfiguratorProjectPdfInput,
): void {
    const {
        lead,
        leadId,
    } = input;

    const left =
        document.page.margins.left;

    const width =
        getPageContentWidth(
            document,
        );

    document
        .save()
        .rect(
            0,
            0,
            document.page.width,
            190,
        )
        .fill(
            COLORS.primary,
        )
        .restore();

    document
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor(
            COLORS.white,
        )
        .text(
            "ENERGIE-KRAFT",
            left,
            52,
        );

    document
        .font("Helvetica-Bold")
        .fontSize(30)
        .fillColor(
            COLORS.white,
        )
        .text(
            "Deine persönliche",
            left,
            92,
        )
        .text(
            "Projektübersicht",
        );

    document
        .font("Helvetica")
        .fontSize(12)
        .fillColor("#DCE8E1")
        .text(
            "Orientierung für dein Energieprojekt",
            left,
            164,
        );

    document.y = 235;

    document
        .font("Helvetica-Bold")
        .fontSize(19)
        .fillColor(
            COLORS.primary,
        )
        .text(
            `${lead.contact.firstName} ${lead.contact.lastName}`,
        );

    document
        .font("Helvetica")
        .fontSize(10)
        .fillColor(
            COLORS.muted,
        )
        .text(
            `${lead.installation.street}, ${lead.installation.postalCode} ${lead.installation.city}`,
            {
                width,
            },
        );

    document.moveDown(1.5);

    document
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor(
            COLORS.text,
        )
        .text(
            "Dein Energieprojekt",
        );

    const badgeBottom =
        drawProductBadges(
            document,
            lead.products,
            document.y + 10,
        );

    document.y =
        badgeBottom + 27;

    document
        .save()
        .roundedRect(
            left,
            document.y,
            width,
            86,
            8,
        )
        .fill(
            COLORS.lightMuted,
        )
        .restore();

    const infoTop =
        document.y + 16;

    document
        .font("Helvetica")
        .fontSize(8)
        .fillColor(
            COLORS.muted,
        )
        .text(
            "Referenz",
            left + 15,
            infoTop,
        );

    document
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(
            COLORS.text,
        )
        .text(
            leadId,
            left + 15,
            infoTop + 15,
            {
                width:
                    width - 30,
            },
        );

    document
        .font("Helvetica")
        .fontSize(8)
        .fillColor(
            COLORS.muted,
        )
        .text(
            "Einstieg",
            left + 15,
            infoTop + 43,
        );

    document
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(
            COLORS.text,
        )
        .text(
            PRODUCT_THEMES[
                lead.journey
                    .entryPoint
            ].label,
            left + 15,
            infoTop + 58,
        );

    document.y += 112;

    drawDisclaimer(
        document,
    );
}

function drawProductPage(
    document: PDFKit.PDFDocument,
    configurator:
        ConfiguratorPayload,
): void {
    document.addPage();

    drawPageHeader(
        document,
    );

    const theme =
        PRODUCT_THEMES[
        configurator.type
        ];

    drawProductBadge(
        document,
        configurator.type,
        document.page.margins.left,
        document.y,
    );

    document.y += 40;

    document
        .font("Helvetica-Bold")
        .fontSize(24)
        .fillColor(theme.accent)
        .text(
            theme.label,
        );

    document
        .font("Helvetica")
        .fontSize(10)
        .fillColor(
            COLORS.muted,
        )
        .text(
            "Deine Angaben und unsere rechnerische Orientierung",
        );

    document.moveDown(1.4);

    const {
        inputRows,
        resultRows,
    } = getProductRows(
        configurator,
    );

    drawSectionTitle(
        document,
        "Deine Angaben",
    );

    drawRows(
        document,
        inputRows,
    );

    document.moveDown(0.8);

    drawSectionTitle(
        document,
        "Ergebnis",
    );

    drawRows(
        document,
        resultRows,
    );
}

function drawNextStepsPage(
    document: PDFKit.PDFDocument,
    input:
        GenerateConfiguratorProjectPdfInput,
): void {
    document.addPage();

    drawPageHeader(
        document,
    );

    document
        .font("Helvetica-Bold")
        .fontSize(25)
        .fillColor(
            COLORS.primary,
        )
        .text(
            "Wie geht es weiter?",
        );

    document
        .font("Helvetica")
        .fontSize(11)
        .fillColor(
            COLORS.muted,
        )
        .text(
            "Deine Konfiguration ist bei uns eingegangen. " +
            "Die Ergebnisse helfen uns, dein Energieprojekt fachlich einzuordnen.",
            {
                lineGap: 3,
            },
        );

    document.moveDown(1.5);

    const steps = [
        {
            number: "01",
            title:
                "Wir prüfen deine Angaben",
            text:
                "Wir sehen uns die Konfiguration und die gewählten Energielösungen gemeinsam an.",
        },

        {
            number: "02",
            title:
                "Wir klären technische Details",
            text:
                "Falls Angaben fehlen oder eine technische Prüfung erforderlich ist, stimmen wir die nächsten Punkte mit dir ab.",
        },

        {
            number: "03",
            title:
                "Du erhältst eine individuelle Einschätzung",
            text:
                "Erst auf Grundlage der fachlichen Prüfung können belastbare Aussagen zu Auslegung, Umsetzung und konkreten Kosten getroffen werden.",
        },
    ];

    const left =
        document.page.margins.left;

    const width =
        getPageContentWidth(
            document,
        );

    for (
        const step of steps
    ) {
        const y =
            document.y;

        document
            .save()
            .roundedRect(
                left,
                y,
                width,
                86,
                8,
            )
            .fill(
                COLORS.lightMuted,
            )
            .restore();

        document
            .font("Helvetica-Bold")
            .fontSize(18)
            .fillColor(
                COLORS.secondary,
            )
            .text(
                step.number,
                left + 15,
                y + 17,
                {
                    width: 45,
                },
            );

        document
            .font("Helvetica-Bold")
            .fontSize(11)
            .fillColor(
                COLORS.primary,
            )
            .text(
                step.title,
                left + 65,
                y + 16,
                {
                    width:
                        width - 80,
                },
            );

        document
            .font("Helvetica")
            .fontSize(9)
            .fillColor(
                COLORS.muted,
            )
            .text(
                step.text,
                left + 65,
                y + 36,
                {
                    width:
                        width - 80,
                    lineGap: 2,
                },
            );

        document.y =
            y + 98;
    }

    document.moveDown(0.5);

    drawDisclaimer(
        document,
    );

    document.moveDown(1);

    document
        .font("Helvetica")
        .fontSize(9)
        .fillColor(
            COLORS.muted,
        )
        .text(
            `Deine Referenz: ${input.leadId}`,
        );

    document
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(
            COLORS.primary,
        )
        .text(
            "Energie-Kraft",
        );

    document
        .font("Helvetica")
        .fontSize(9)
        .fillColor(
            COLORS.muted,
        )
        .text(
            "energie-kraft.de",
        );
}

function addPageFooters(
    document: PDFKit.PDFDocument,
): void {
    const range =
        document.bufferedPageRange();

    const totalPages =
        range.count;

    for (
        let index = 0;
        index < totalPages;
        index += 1
    ) {
        document.switchToPage(
            index,
        );

        const footerY =
            document.page.height - 32;

        drawHorizontalLine(
            document,
            footerY - 8,
            "#E6EBE7",
        );

        document
            .font("Helvetica")
            .fontSize(7.5)
            .fillColor(
                COLORS.muted,
            )
            .text(
                "Energie-Kraft · Persönliche Projektübersicht",
                document.page.margins.left,
                footerY,
                {
                    lineBreak: false,
                },
            );

        document
            .font("Helvetica")
            .fontSize(7.5)
            .fillColor(
                COLORS.muted,
            )
            .text(
                `Seite ${index + 1} von ${totalPages}`,
                document.page.margins.left,
                footerY,
                {
                    width:
                        getPageContentWidth(
                            document,
                        ),
                    align: "right",
                    lineBreak: false,
                },
            );
    }
}

export async function generateConfiguratorProjectPdf(
    input:
        GenerateConfiguratorProjectPdfInput,
): Promise<Buffer> {
    return new Promise<Buffer>(
        (
            resolve,
            reject,
        ) => {
            const document =
                new PDFDocument({
                    size: "A4",
                    margins: {
                        top: 64,
                        right: 52,
                        bottom: 58,
                        left: 52,
                    },

                    bufferPages: true,

                    info: {
                        Title:
                            "Energie-Kraft – Persönliche Projektübersicht",

                        Author:
                            "Energie-Kraft",

                        Subject:
                            `Energieprojekt ${input.leadId}`,

                        Creator:
                            "Energie-Kraft Konfigurator",
                    },
                });

            const chunks:
                Buffer[] = [];

            document.on(
                "data",
                (
                    chunk: Buffer,
                ) => {
                    chunks.push(chunk);
                },
            );

            document.on(
                "error",
                (
                    error: Error,
                ) => {
                    reject(error);
                },
            );

            document.on(
                "end",
                () => {
                    resolve(
                        Buffer.concat(
                            chunks,
                        ),
                    );
                },
            );

            drawCover(
                document,
                input,
            );

            for (
                const configurator of
                input.lead
                    .configurators
            ) {
                drawProductPage(
                    document,
                    configurator,
                );
            }

            drawNextStepsPage(
                document,
                input,
            );

            addPageFooters(
                document,
            );

            document.end();
        },
    );
}