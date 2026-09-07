import PDFDocument from "pdfkit";
import path from "node:path";

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

interface PdfHighlight {
    value: string;
    label: string;
}

interface ProductTheme {
    label: string;
    accent: string;
    background: string;
    border: string;
}

const FUNCTIONS_ROOT =
    path.resolve(
        __dirname,
        "..",
    );

const BRAND_LOGO_PATH =
    path.join(
        FUNCTIONS_ROOT,
        "assets",
        "branding",
        "energie-kraft-logo-transparent.png",
    );

const BRAND_SUPERSIGN_PATH =
    path.join(
        FUNCTIONS_ROOT,
        "assets",
        "branding",
        "energie-kraft-supersign-transparent.png",
    );

const MONTSERRAT_REGULAR_PATH =
    path.join(
        FUNCTIONS_ROOT,
        "assets",
        "fonts",
        "Montserrat-Regular.ttf",
    );

const MONTSERRAT_SEMIBOLD_PATH =
    path.join(
        FUNCTIONS_ROOT,
        "assets",
        "fonts",
        "Montserrat-SemiBold.ttf",
    );

const MONTSERRAT_BOLD_PATH =
    path.join(
        FUNCTIONS_ROOT,
        "assets",
        "fonts",
        "Montserrat-Bold.ttf",
    );


const FONT_REGULAR = "Montserrat-Regular";
const FONT_SEMIBOLD = "Montserrat-SemiBold";
const FONT_BOLD = "Montserrat-Bold";

const COLORS = {
    primary: "#005CA9",
    secondary: "#182E4C",
    accent: "#0DA1D1",
    navy: "#091433",

    text: "#091433",
    muted: "#526178",

    lightMuted: "#F6F8FC",
    surfaceBlue: "#E9EDF8",
    surfaceCyan: "#EAF7FB",

    border: "#CFD8E7",

    white: "#FFFFFF",

    warningBackground:
        "#F6F8FC",

    warningBorder:
        "#CFD8E7",

    warningText:
        "#526178",
} as const;

const PRODUCT_THEMES: Record<
    ConfiguratorPayload["type"],
    ProductTheme
> = {
    photovoltaic: {
        label:
            "Photovoltaik",

        accent:
            COLORS.primary,

        background:
            COLORS.surfaceBlue,

        border:
            COLORS.border,
    },

    battery_storage: {
        label:
            "Stromspeicher",

        accent:
            COLORS.accent,

        background:
            COLORS.surfaceCyan,

        border:
            COLORS.border,
    },

    wallbox: {
        label:
            "Wallbox",

        accent:
            COLORS.secondary,

        background:
            COLORS.surfaceBlue,

        border:
            COLORS.border,
    },

    heat_pump: {
        label:
            "Wärmepumpe",

        accent:
            COLORS.primary,

        background:
            COLORS.surfaceBlue,

        border:
            COLORS.border,
    },

    climate: {
        label:
            "Klimaanlage",

        accent:
            COLORS.accent,

        background:
            COLORS.surfaceCyan,

        border:
            COLORS.border,
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

function registerPdfFonts(
    document: PDFKit.PDFDocument,
): void {
    document.registerFont(
        FONT_REGULAR,
        MONTSERRAT_REGULAR_PATH,
    );

    document.registerFont(
        FONT_SEMIBOLD,
        MONTSERRAT_SEMIBOLD_PATH,
    );

    document.registerFont(
        FONT_BOLD,
        MONTSERRAT_BOLD_PATH,
    );
}

function getProductHighlights(
    configurator: ConfiguratorPayload,
): PdfHighlight[] {
    switch (configurator.type) {
        case "photovoltaic":
            return [
                {
                    value:
                        `${formatNumber(
                            configurator.result
                                .recommendedPowerKwpMin,
                        )}–${formatNumber(
                            configurator.result
                                .recommendedPowerKwpMax,
                        )} kWp`,
                    label:
                        "Empfohlene Anlagenleistung",
                },
                {
                    value:
                        `${formatNumber(
                            configurator.result
                                .estimatedAnnualYieldKwhMin,
                        )}–${formatNumber(
                            configurator.result
                                .estimatedAnnualYieldKwhMax,
                        )} kWh`,
                    label:
                        "Erwarteter Jahresertrag",
                },
            ];

        case "battery_storage":
            return [
                {
                    value:
                        `${formatNumber(
                            configurator.result
                                .recommendedUsableCapacityKwhMin,
                        )}–${formatNumber(
                            configurator.result
                                .recommendedUsableCapacityKwhMax,
                        )} kWh`,
                    label:
                        "Empfohlene Speicherkapazität",
                },
                {
                    value:
                        formatBoolean(
                            configurator.result
                                .backupPowerRequested,
                        ),
                    label:
                        "Ersatzstrom gewünscht",
                },
            ];

        case "wallbox":
            return [
                {
                    value:
                        `${formatNumber(
                            configurator.answers
                                .chargingPowerKw,
                        )} kW`,
                    label:
                        "Gewählte Ladeleistung",
                },
                {
                    value:
                        `${formatCurrency(
                            configurator.result
                                .estimatedMinimumCostEuro,
                        )}–${formatCurrency(
                            configurator.result
                                .estimatedMaximumCostEuro,
                        )}`,
                    label:
                        "Projektkosten-Korridor",
                },
            ];

        case "heat_pump":
            return [
                {
                    value:
                        `${formatNumber(
                            configurator.result
                                .recommendedHeatPumpCapacityKw,
                        )} kW`,
                    label:
                        "Empfohlene Leistung",
                },
                {
                    value:
                        `${formatNumber(
                            configurator.result
                                .annualHeatPumpElectricityConsumptionKwh,
                        )} kWh`,
                    label:
                        "Geschätzter Strombedarf/Jahr",
                },
            ];

        case "climate":
            return [
                {
                    value:
                        `${formatNumber(
                            configurator.result
                                .recommendedCoolingCapacityKw,
                        )} kW`,
                    label:
                        "Empfohlene Kühlleistung",
                },
                {
                    value:
                        `${configurator.result
                            .recommendedIndoorUnitCount}`,
                    label:
                        "Empfohlene Innengeräte",
                },
            ];
    }
}

function drawHighlightCards(
    document: PDFKit.PDFDocument,
    configurator: ConfiguratorPayload,
): void {
    const highlights =
        getProductHighlights(
            configurator,
        );

    const theme =
        PRODUCT_THEMES[
        configurator.type
        ];

    const left =
        document.page.margins.left;

    const totalWidth =
        getPageContentWidth(
            document,
        );

    const gap = 12;

    const cardWidth =
        (totalWidth - gap) / 2;

    const cardHeight = 64;

    const startY =
        document.y;

    highlights
        .slice(0, 2)
        .forEach(
            (
                highlight,
                index,
            ) => {
                const x =
                    left +
                    index *
                    (cardWidth + gap);

                document
                    .save()
                    .roundedRect(
                        x,
                        startY,
                        cardWidth,
                        cardHeight,
                        9,
                    )
                    .fillAndStroke(
                        theme.background,
                        theme.border,
                    )
                    .restore();

                document
                    .font(
                        "Helvetica-Bold",
                    )
                    .fontSize(16)
                    .fillColor(
                        theme.accent,
                    )
                    .text(
                        highlight.value,
                        x + 14,
                        startY + 12,
                        {
                            width:
                                cardWidth - 28,
                        },
                    );

                document
                    .font(FONT_REGULAR)
                    .fontSize(8)
                    .fillColor(
                        COLORS.muted,
                    )
                    .text(
                        highlight.label,
                        x + 14,
                        startY + 40,
                        {
                            width:
                                cardWidth - 28,
                        },
                    );
            },
        );

    document.y =
        startY +
        cardHeight +
        14;
}


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

function drawPageHeader(
    document: PDFKit.PDFDocument,
): void {
    const left =
        document.page.margins.left;

    const width =
        getPageContentWidth(
            document,
        );

    document.image(
        BRAND_LOGO_PATH,
        left,
        20,
        {
            width: 118,
        },
    );

    document
        .font(FONT_REGULAR)
        .fontSize(7.5)
        .fillColor(
            COLORS.muted,
        )
        .text(
            "Persönliche Projektübersicht",
            left,
            38,
            {
                width,
                align: "right",
            },
        );

    document
        .save()
        .strokeColor(
            COLORS.border,
        )
        .lineWidth(0.8)
        .moveTo(
            left,
            54,
        )
        .lineTo(
            left + width,
            54,
        )
        .stroke()
        .restore();

    /*
     * Die bewährte Seitengeometrie
     * aus D-1 bleibt bestehen.
     */
    document.y = 68;
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
        .font(FONT_SEMIBOLD)
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
        .font(FONT_SEMIBOLD)
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
            .font(FONT_SEMIBOLD)
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
    product: ConfiguratorPayload["type"],
): void {
    ensureProductPageSpace(
        document,
        product,
        40,
    );

    document
        .font(FONT_SEMIBOLD)
        .fontSize(11.5)
        .fillColor(
            COLORS.navy,
        )
        .text(title);

    document.moveDown(
        0.25,
    );
}

function getPageContentBottom(
    document: PDFKit.PDFDocument,
): number {
    return (
        document.page.height -
        document.page.margins.bottom
    );
}

function startProductContinuationPage(
    document: PDFKit.PDFDocument,
    product: ConfiguratorPayload["type"],
): void {
    document.addPage();

    drawPageHeader(
        document,
    );

    const theme =
        PRODUCT_THEMES[
        product
        ];

    const badgeY =
        document.y;

    drawProductBadge(
        document,
        product,
        document.page.margins.left,
        badgeY,
    );

    document.y =
        badgeY + 36;

    document
        .font(FONT_SEMIBOLD)
        .fontSize(15)
        .fillColor(
            theme.accent,
        )
        .text(
            `${theme.label} – Fortsetzung`,
        );

    document.moveDown(
        0.8,
    );
}

function ensureProductPageSpace(
    document: PDFKit.PDFDocument,
    product: ConfiguratorPayload["type"],
    requiredHeight: number,
): void {
    const pageBottom =
        getPageContentBottom(
            document,
        );

    if (
        document.y +
        requiredHeight <=
        pageBottom
    ) {
        return;
    }

    startProductContinuationPage(
        document,
        product,
    );
}

function drawRows(
    document: PDFKit.PDFDocument,
    rows: readonly PdfRow[],
    product: ConfiguratorPayload["type"],
): void {
    const left =
        document.page.margins.left;

    const totalWidth =
        getPageContentWidth(
            document,
        );

    const labelWidth = 180;

    const valueWidth =
        totalWidth -
        labelWidth -
        18;

    for (
        const row of rows
    ) {
        document
            .font(FONT_REGULAR)
            .fontSize(8.5);

        const labelHeight =
            document.heightOfString(
                row.label,
                {
                    width:
                        labelWidth - 8,
                },
            );

        document
            .font(FONT_SEMIBOLD)
            .fontSize(8.5);

        const valueHeight =
            document.heightOfString(
                row.value,
                {
                    width:
                        valueWidth - 8,
                },
            );

        const rowHeight =
            Math.max(
                22,
                labelHeight + 8,
                valueHeight + 8,
            );

        ensureProductPageSpace(
            document,
            product,
            rowHeight + 3,
        );

        const rowTop =
            document.y;

        document
            .font(FONT_REGULAR)
            .fontSize(8.5)
            .fillColor(
                COLORS.muted,
            )
            .text(
                row.label,
                left,
                rowTop + 4,
                {
                    width:
                        labelWidth - 8,
                },
            );

        document
            .font(FONT_SEMIBOLD)
            .fontSize(8.5)
            .fillColor(
                COLORS.text,
            )
            .text(
                row.value,
                left +
                labelWidth +
                8,
                rowTop + 4,
                {
                    width:
                        valueWidth - 8,
                },
            );

        document
            .save()
            .strokeColor(
                "#E7ECE8",
            )
            .lineWidth(0.6)
            .moveTo(
                left,
                rowTop +
                rowHeight,
            )
            .lineTo(
                left +
                totalWidth,
                rowTop +
                rowHeight,
            )
            .stroke()
            .restore();

        document.y =
            rowTop +
            rowHeight +
            1;
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
        .font(FONT_REGULAR)
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
        .font(FONT_SEMIBOLD)
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
        .font(FONT_REGULAR)
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

    /*
     * Original-Logo auf Weiß.
     */
    document.image(
        BRAND_LOGO_PATH,
        left,
        42,
        {
            width: 235,
        },
    );

    /*
     * Corporate Hero.
     */
    document
        .save()
        .roundedRect(
            left,
            125,
            width,
            155,
            14,
        )
        .fill(
            COLORS.primary,
        )
        .restore();

    /*
     * Cyan-Akzent.
     */
    document
        .save()
        .roundedRect(
            left,
            125,
            8,
            155,
            4,
        )
        .fill(
            COLORS.accent,
        )
        .restore();

    document
        .font(FONT_BOLD)
        .fontSize(29)
        .fillColor(
            COLORS.white,
        )
        .text(
            "Dein persönliches",
            left + 28,
            161,
            {
                width:
                    width - 56,
            },
        );

    document
        .font(FONT_BOLD)
        .fontSize(29)
        .fillColor(
            COLORS.white,
        )
        .text(
            "Energieprojekt",
            left + 28,
            197,
            {
                width:
                    width - 56,
            },
        );

    document
        .font(FONT_REGULAR)
        .fontSize(10)
        .fillColor(
            "#DCEFFA",
        )
        .text(
            "Deine persönliche Projektübersicht von Energie-Kraft",
            left + 28,
            244,
            {
                width:
                    width - 56,
            },
        );

    document.y = 318;

    document
        .font(FONT_BOLD)
        .fontSize(17)
        .fillColor(
            COLORS.primary,
        )
        .text(
            `${lead.contact.firstName} ${lead.contact.lastName}`,
        );

    document
        .font(FONT_REGULAR)
        .fontSize(9)
        .fillColor(
            COLORS.muted,
        )
        .text(
            `${lead.installation.street}, ${lead.installation.postalCode} ${lead.installation.city}`,
            {
                width,
            },
        );

    document.moveDown(
        1.25,
    );

    document
        .font(FONT_SEMIBOLD)
        .fontSize(10)
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
            document.y + 9,
        );

    document.y =
        badgeBottom + 22;

    const infoY =
        document.y;

    document
        .save()
        .roundedRect(
            left,
            infoY,
            width,
            72,
            10,
        )
        .fillAndStroke(
            COLORS.lightMuted,
            COLORS.border,
        )
        .restore();

    document
        .font(FONT_REGULAR)
        .fontSize(7.5)
        .fillColor(
            COLORS.muted,
        )
        .text(
            "REFERENZ",
            left + 16,
            infoY + 13,
        );

    document
        .font(FONT_SEMIBOLD)
        .fontSize(8.5)
        .fillColor(
            COLORS.text,
        )
        .text(
            leadId,
            left + 16,
            infoY + 27,
        );

    document
        .font(FONT_REGULAR)
        .fontSize(7.5)
        .fillColor(
            COLORS.muted,
        )
        .text(
            "EINSTIEG",
            left + 285,
            infoY + 13,
        );

    document
        .font(FONT_SEMIBOLD)
        .fontSize(8.5)
        .fillColor(
            COLORS.primary,
        )
        .text(
            PRODUCT_THEMES[
                lead.journey.entryPoint
            ].label,
            left + 285,
            infoY + 27,
        );

    /*
     * Supersign als Corporate-
     * Gestaltungselement.
     */
    document.image(
        BRAND_SUPERSIGN_PATH,
        document.page.width -
        document.page.margins.right -
        95,
        626,
        {
            width: 95,
        },
    );

    document
        .font(FONT_REGULAR)
        .fontSize(7.5)
        .fillColor(
            COLORS.muted,
        )
        .text(
            "Unverbindliche Projektorientierung · Keine technische Planung oder Angebotszusage",
            left,
            742,
            {
                width,
                align: "left",
            },
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

    const left =
        document.page.margins.left;

    const width =
        getPageContentWidth(
            document,
        );

    const headerY =
        document.y;

    /*
     * Ein einziger kompakter Produktkopf.
     * Der bisherige zusätzliche Badge und
     * der doppelte Beschreibungstext entfallen.
     */
    document
        .save()
        .roundedRect(
            left,
            headerY,
            width,
            52,
            9,
        )
        .fill(
            theme.background,
        )
        .restore();

    document
        .font(FONT_SEMIBOLD)
        .fontSize(19)
        .fillColor(
            theme.accent,
        )
        .text(
            theme.label,
            left + 15,
            headerY + 9,
        );

    document
        .font(FONT_REGULAR)
        .fontSize(8)
        .fillColor(
            COLORS.muted,
        )
        .text(
            "Deine persönliche Energie-Kraft Einschätzung",
            left + 15,
            headerY + 33,
        );

    document.y =
        headerY + 64;

    drawHighlightCards(
        document,
        configurator,
    );

    const {
        inputRows,
        resultRows,
    } = getProductRows(
        configurator,
    );

    drawSectionTitle(
        document,
        "Deine Angaben",
        configurator.type,
    );

    drawRows(
        document,
        inputRows,
        configurator.type,
    );

    document.moveDown(
        0.2,
    );

    drawSectionTitle(
        document,
        "Ergebnis",
        configurator.type,
    );

    drawRows(
        document,
        resultRows,
        configurator.type,
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
        .font(FONT_SEMIBOLD)
        .fontSize(25)
        .fillColor(
            COLORS.primary,
        )
        .text(
            "Wie geht es weiter?",
        );

    document
        .font(FONT_REGULAR)
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
            .font(FONT_SEMIBOLD)
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
            .font(FONT_SEMIBOLD)
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
            .font(FONT_REGULAR)
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
        .font(FONT_REGULAR)
        .fontSize(9)
        .fillColor(
            COLORS.muted,
        )
        .text(
            `Deine Referenz: ${input.leadId}`,
        );

    document
        .font(FONT_SEMIBOLD)
        .fontSize(10)
        .fillColor(
            COLORS.primary,
        )
        .text(
            "Energie-Kraft",
        );

    document
        .font(FONT_REGULAR)
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
            range.start + index,
        );

        /*
         * PDFKit startet sonst beim Schreiben
         * innerhalb des unteren Seitenrandes
         * automatisch eine neue Seite.
         *
         * Deshalb deaktivieren wir den unteren
         * Margin nur temporär für die Fußzeile.
         */
        const originalBottomMargin =
            document.page.margins.bottom;

        document.page.margins.bottom = 0;

        const footerY =
            document.page.height - 32;

        document
            .save()
            .strokeColor(
                COLORS.border,
            )
            .lineWidth(1)
            .moveTo(
                document.page.margins.left,
                footerY - 8,
            )
            .lineTo(
                document.page.width -
                document.page.margins.right,
                footerY - 8,
            )
            .stroke()
            .restore();

        document
            .font(FONT_REGULAR)
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
            .font(FONT_REGULAR)
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

        document.page.margins.bottom =
            originalBottomMargin;
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

            registerPdfFonts(
                document,
            );

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
