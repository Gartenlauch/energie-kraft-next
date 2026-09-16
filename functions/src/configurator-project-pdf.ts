import PDFDocument from "pdfkit";
import path from "node:path";

import type { ConfiguratorLeadPayload, ConfiguratorPayload } from "./configurator-lead-validation";

interface GenerateConfiguratorProjectPdfInput {
  leadId: string;
  lead: ConfiguratorLeadPayload;
}

type ProductType = ConfiguratorPayload["type"];

interface ProductTheme {
  label: string;
  accent: string;
  soft: string;
  image: string;
}

interface PdfMetric {
  value: string;
  label: string;
  tone?: "primary" | "accent" | "navy";
}

const FUNCTIONS_ROOT = path.resolve(__dirname, "..");
const BRAND_LOGO_PATH = path.join(
  FUNCTIONS_ROOT,
  "assets",
  "branding",
  "energie-kraft-logo-transparent.png",
);
const MONTSERRAT_REGULAR_PATH = path.join(
  FUNCTIONS_ROOT,
  "assets",
  "fonts",
  "Montserrat-Regular.ttf",
);
const MONTSERRAT_SEMIBOLD_PATH = path.join(
  FUNCTIONS_ROOT,
  "assets",
  "fonts",
  "Montserrat-SemiBold.ttf",
);
const MONTSERRAT_BOLD_PATH = path.join(
  FUNCTIONS_ROOT,
  "assets",
  "fonts",
  "Montserrat-Bold.ttf",
);
const PDF_ASSET_ROOT = path.join(FUNCTIONS_ROOT, "assets", "pdf");

const FONT_REGULAR = "Montserrat-Regular";
const FONT_SEMIBOLD = "Montserrat-SemiBold";
const FONT_BOLD = "Montserrat-Bold";

const COLORS = {
  primary: "#005CA9",
  accent: "#0DA1D1",
  secondary: "#182E4C",
  navy: "#091433",
  text: "#182E4C",
  muted: "#5B687C",
  lightMuted: "#F5F7FB",
  surfaceBlue: "#E9EDF8",
  surfaceCyan: "#EAF7FB",
  border: "#D4DCE9",
  white: "#FFFFFF",
  positive: "#16856B",
  neutral: "#91A4C4",
} as const;

const PRODUCT_THEMES: Record<ProductType, ProductTheme> = {
  photovoltaic: {
    label: "Photovoltaik",
    accent: COLORS.primary,
    soft: COLORS.surfaceBlue,
    image: path.join(PDF_ASSET_ROOT, "photovoltaic.jpg"),
  },
  battery_storage: {
    label: "Stromspeicher",
    accent: COLORS.accent,
    soft: COLORS.surfaceCyan,
    image: path.join(PDF_ASSET_ROOT, "battery-storage.jpg"),
  },
  heat_pump: {
    label: "Wärmepumpe",
    accent: "#16856B",
    soft: COLORS.surfaceBlue,
    image: path.join(PDF_ASSET_ROOT, "heat-pump.jpg"),
  },
  climate: {
    label: "Klimaanlage",
    accent: "#B46823",
    soft: COLORS.surfaceCyan,
    image: path.join(PDF_ASSET_ROOT, "climate.jpg"),
  },
  wallbox: {
    label: "Wallbox",
    accent: "#6A5AA8",
    soft: COLORS.surfaceBlue,
    image: path.join(PDF_ASSET_ROOT, "wallbox.jpg"),
  },
};

const PRODUCT_CHECKS: Record<ProductType, string> = {
  photovoltaic: "Dachzustand, Verschattung, Elektroinstallation und Netzanschluss",
  battery_storage: "Wechselrichter, Aufstellort, Ersatzstromkonzept und nutzbare Kapazität",
  heat_pump: "Heizlast, Vorlauftemperaturen, Hydraulik und Wärmeverteilung",
  climate: "Raumweise Kühllast, Fensterflächen, Leitungswege und Gerätepositionen",
  wallbox: "Hausanschluss, Leitung, Schutztechnik, Ladeleistung und Fahrzeug",
};

const numberFormatter = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });
const currencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const dateFormatter = new Intl.DateTimeFormat("de-DE", { dateStyle: "long" });

function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

function formatCurrency(value: number | null): string {
  return value === null ? "Individuelle Kalkulation" : currencyFormatter.format(value);
}

function registerPdfFonts(document: PDFKit.PDFDocument): void {
  document.registerFont(FONT_REGULAR, MONTSERRAT_REGULAR_PATH);
  document.registerFont(FONT_SEMIBOLD, MONTSERRAT_SEMIBOLD_PATH);
  document.registerFont(FONT_BOLD, MONTSERRAT_BOLD_PATH);
}

function contentWidth(document: PDFKit.PDFDocument): number {
  return document.page.width - document.page.margins.left - document.page.margins.right;
}

function imageCover(
  document: PDFKit.PDFDocument,
  imagePath: string,
  x: number,
  y: number,
  width: number,
  height: number,
  position: "center" | "right" = "center",
): void {
  document.save();
  document.rect(x, y, width, height).clip();
  document.image(imagePath, x, y, {
    cover: [width, height],
    align: position,
    valign: "center",
  });
  document.restore();
}

function drawPageHeader(document: PDFKit.PDFDocument, section: string): void {
  const left = document.page.margins.left;
  const width = contentWidth(document);
  document.image(BRAND_LOGO_PATH, left, 20, { width: 112 });
  document
    .font(FONT_SEMIBOLD)
    .fontSize(7)
    .fillColor(COLORS.muted)
    .text(section.toUpperCase(), left, 30, { width, align: "right", characterSpacing: 1.2 });
  document
    .save()
    .strokeColor(COLORS.border)
    .lineWidth(0.8)
    .moveTo(left, 54)
    .lineTo(left + width, 54)
    .stroke()
    .restore();
}

function startPage(
  document: PDFKit.PDFDocument,
  section: string,
  title: string,
  subtitle: string,
): void {
  document.addPage();
  drawPageHeader(document, section);
  const left = document.page.margins.left;
  const width = contentWidth(document);
  document
    .font(FONT_SEMIBOLD)
    .fontSize(8)
    .fillColor(COLORS.accent)
    .text(section.toUpperCase(), left, 78, { characterSpacing: 1.6 });
  document.font(FONT_BOLD).fontSize(25).fillColor(COLORS.navy).text(title, left, 98, {
    width,
    lineGap: 1,
  });
  document.font(FONT_REGULAR).fontSize(9.5).fillColor(COLORS.muted).text(subtitle, left, 136, {
    width,
    lineGap: 3,
  });
  document.y = 181;
}

function metricColor(tone: PdfMetric["tone"]): string {
  if (tone === "accent") return COLORS.accent;
  if (tone === "navy") return COLORS.navy;
  return COLORS.primary;
}

function drawFeaturedMetrics(
  document: PDFKit.PDFDocument,
  metrics: readonly PdfMetric[],
  y: number,
): number {
  const left = document.page.margins.left;
  const width = contentWidth(document);
  const items = metrics.slice(0, 4);
  const columns = Math.min(2, items.length);
  const gap = 14;
  const itemWidth = (width - gap * (columns - 1)) / columns;
  const rows = Math.ceil(items.length / columns);

  items.forEach((metric, index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    const x = left + column * (itemWidth + gap);
    const top = y + row * 96;
    document.save().roundedRect(x, top, itemWidth, 80, 10).fill(COLORS.lightMuted).restore();
    document.save().rect(x, top, 5, 80).fill(metricColor(metric.tone)).restore();
    document
      .font(FONT_BOLD)
      .fontSize(18)
      .fillColor(metricColor(metric.tone))
      .text(metric.value, x + 18, top + 15, { width: itemWidth - 32 });
    document
      .font(FONT_REGULAR)
      .fontSize(7.8)
      .fillColor(COLORS.muted)
      .text(metric.label, x + 18, top + 49, { width: itemWidth - 32, lineGap: 2 });
  });

  return y + rows * 96;
}

function drawMetricStrip(
  document: PDFKit.PDFDocument,
  metrics: readonly PdfMetric[],
  y: number,
): number {
  const left = document.page.margins.left;
  const width = contentWidth(document);
  const gap = 12;
  const itemWidth = (width - gap * (metrics.length - 1)) / metrics.length;

  metrics.forEach((metric, index) => {
    const x = left + index * (itemWidth + gap);
    if (index > 0) {
      document
        .save()
        .strokeColor(COLORS.border)
        .moveTo(x - gap / 2, y + 3)
        .lineTo(x - gap / 2, y + 63)
        .stroke()
        .restore();
    }
    document
      .font(FONT_BOLD)
      .fontSize(metric.value.length > 17 ? 9.5 : metric.value.length > 12 ? 11 : 14)
      .fillColor(metricColor(metric.tone))
      .text(metric.value, x, y + 4, { width: itemWidth, align: "left" });
    document
      .font(FONT_REGULAR)
      .fontSize(7.2)
      .fillColor(COLORS.muted)
      .text(metric.label, x, y + 34, { width: itemWidth, lineGap: 2 });
  });

  return y + 76;
}

function drawHorizontalBars(
  document: PDFKit.PDFDocument,
  items: readonly { label: string; value: number; color: string }[],
  unit: string,
  y: number,
  options: { currency?: boolean; height?: number } = {},
): number {
  const left = document.page.margins.left;
  const width = contentWidth(document);
  const maximum = Math.max(...items.map((item) => item.value), 1);
  const availableBarWidth = width - 180;
  let currentY = y;

  items.forEach((item) => {
    document.font(FONT_SEMIBOLD).fontSize(8).fillColor(COLORS.text).text(item.label, left, currentY, {
      width: 168,
    });
    const value = options.currency ? formatCurrency(item.value) : formatNumber(item.value) + " " + unit;
    document
      .font(FONT_SEMIBOLD)
      .fontSize(8)
      .fillColor(COLORS.text)
      .text(value, left + width - 125, currentY, { width: 125, align: "right" });
    currentY += 17;
    document
      .save()
      .roundedRect(left + 174, currentY, availableBarWidth, 15, 7.5)
      .fill(COLORS.surfaceBlue)
      .restore();
    document
      .save()
      .roundedRect(
        left + 174,
        currentY,
        Math.max(5, availableBarWidth * (item.value / maximum)),
        15,
        7.5,
      )
      .fill(item.color)
      .restore();
    currentY += options.height ?? 42;
  });

  return currentY;
}

function polarPoint(cx: number, cy: number, radius: number, angle: number): [number, number] {
  const radians = ((angle - 90) * Math.PI) / 180;
  return [cx + radius * Math.cos(radians), cy + radius * Math.sin(radians)];
}

function donutSlicePath(
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  const outerStart = polarPoint(cx, cy, outerRadius, endAngle);
  const outerEnd = polarPoint(cx, cy, outerRadius, startAngle);
  const innerStart = polarPoint(cx, cy, innerRadius, startAngle);
  const innerEnd = polarPoint(cx, cy, innerRadius, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    "M", outerStart[0], outerStart[1],
    "A", outerRadius, outerRadius, 0, largeArc, 0, outerEnd[0], outerEnd[1],
    "L", innerStart[0], innerStart[1],
    "A", innerRadius, innerRadius, 0, largeArc, 1, innerEnd[0], innerEnd[1],
    "Z",
  ].join(" ");
}

function drawDonut(
  document: PDFKit.PDFDocument,
  items: readonly { label: string; value: number; color: string }[],
  centerX: number,
  centerY: number,
  radius: number,
  centerLabel: string,
): void {
  const total = Math.max(items.reduce((sum, item) => sum + item.value, 0), 1);
  let angle = 0;
  items.forEach((item) => {
    const sweep = (item.value / total) * 359.8;
    document
      .save()
      .path(donutSlicePath(centerX, centerY, radius, radius * 0.58, angle, angle + sweep))
      .fill(item.color)
      .restore();
    angle += sweep;
  });
  document
    .font(FONT_BOLD)
    .fontSize(11)
    .fillColor(COLORS.navy)
    .text(centerLabel, centerX - radius * 0.55, centerY - 7, {
      width: radius * 1.1,
      align: "center",
    });
}

function drawLegend(
  document: PDFKit.PDFDocument,
  items: readonly { label: string; value: number; color: string }[],
  x: number,
  y: number,
  width: number,
  formatter: (value: number) => string,
): void {
  items.forEach((item, index) => {
    const top = y + index * 31;
    document.save().circle(x + 5, top + 6, 4).fill(item.color).restore();
    document.font(FONT_REGULAR).fontSize(7.5).fillColor(COLORS.muted).text(item.label, x + 16, top, {
      width: width - 80,
    });
    document
      .font(FONT_SEMIBOLD)
      .fontSize(7.5)
      .fillColor(COLORS.text)
      .text(formatter(item.value), x + width - 72, top, { width: 72, align: "right" });
  });
}

function getConfigurator(
  lead: ConfiguratorLeadPayload,
  type: ProductType,
): ConfiguratorPayload | undefined {
  return lead.configurators.find((configurator) => configurator.type === type);
}

function getPrimaryProductMetric(configurator: ConfiguratorPayload): PdfMetric {
  switch (configurator.type) {
    case "photovoltaic":
      return {
        value:
          formatNumber(configurator.result.recommendedPowerKwpMin) +
          "–" +
          formatNumber(configurator.result.recommendedPowerKwpMax) +
          " kWp",
        label: "Empfohlene Anlagenklasse",
      };
    case "battery_storage":
      return {
        value:
          formatNumber(configurator.result.recommendedUsableCapacityKwhMin) +
          "–" +
          formatNumber(configurator.result.recommendedUsableCapacityKwhMax) +
          " kWh",
        label: "Nutzbare Kapazität",
        tone: "accent",
      };
    case "heat_pump":
      return {
        value: formatNumber(configurator.result.recommendedHeatPumpCapacityKw) + " kW",
        label: "Empfohlene Wärmepumpenleistung",
      };
    case "climate":
      return {
        value: formatNumber(configurator.result.recommendedCoolingCapacityKw) + " kW",
        label: "Kühlleistung",
        tone: "accent",
      };
    case "wallbox":
      return {
        value: formatNumber(configurator.answers.chargingPowerKw) + " kW",
        label: "Gewählte Ladeleistung",
        tone: "navy",
      };
  }
}

function getNonMonetizedBenefits(lead: ConfiguratorLeadPayload): string[] {
  const benefits: string[] = [];
  const storage = getConfigurator(lead, "battery_storage");
  if (lead.products.includes("photovoltaic")) benefits.push("Mehr Energieunabhängigkeit");
  if (storage?.type === "battery_storage") {
    benefits.push("Mehr Eigenverbrauch");
    if (storage.answers.backupPreference !== "none") benefits.push("Ersatzstromoption");
  }
  if (lead.products.includes("climate")) benefits.push("Kühlkomfort");
  if (lead.products.includes("wallbox")) benefits.push("Bequemes Laden zuhause");
  return benefits;
}

function drawCover(document: PDFKit.PDFDocument, lead: ConfiguratorLeadPayload): void {
  const pageWidth = document.page.width;
  const pageHeight = document.page.height;
  imageCover(
    document,
    path.join(PDF_ASSET_ROOT, "cover-home.jpg"),
    0,
    0,
    pageWidth,
    450,
    "center",
  );
  document.save().rect(0, 0, pageWidth, 450).fillOpacity(0.68).fill(COLORS.navy).restore();
  document.save().rect(0, 0, 11, 450).fill(COLORS.accent).restore();
  document
    .save()
    .roundedRect(42, 32, 175, 49, 8)
    .fillOpacity(0.94)
    .fill(COLORS.white)
    .restore();
  document.image(BRAND_LOGO_PATH, 56, 46, { width: 145 });
  document
    .font(FONT_BOLD)
    .fontSize(31)
    .fillColor(COLORS.white)
    .text("Deine persönliche\nEnergieprojekt-Analyse", 48, 145, {
      width: 480,
      lineGap: 5,
    });
  document
    .font(FONT_REGULAR)
    .fontSize(11)
    .fillColor("#DDECF7")
    .text("Individuelle Modellierung auf Basis deiner Angaben", 50, 252, {
      width: 430,
    });
  document
    .font(FONT_SEMIBOLD)
    .fontSize(15)
    .fillColor(COLORS.white)
    .text(lead.contact.firstName + " " + lead.contact.lastName, 50, 347, { width: 350 });
  document
    .font(FONT_REGULAR)
    .fontSize(8.5)
    .fillColor("#DDECF7")
    .text(lead.installation.postalCode + " " + lead.installation.city, 50, 374, { width: 280 });
  document
    .font(FONT_REGULAR)
    .fontSize(8.5)
    .fillColor("#DDECF7")
    .text(dateFormatter.format(new Date()), 50, 393, { width: 280 });

  document
    .font(FONT_SEMIBOLD)
    .fontSize(8)
    .fillColor(COLORS.accent)
    .text("DEIN ENERGIESYSTEM", 42, 482, { characterSpacing: 1.5 });
  const products = lead.products;
  const columns = Math.min(3, products.length);
  const gap = 10;
  const availableWidth = pageWidth - 84;
  const tileWidth = (availableWidth - gap * (columns - 1)) / columns;
  const tileHeight = products.length > 3 ? 95 : 112;

  products.forEach((product, index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    const itemsInRow = Math.min(columns, products.length - row * columns);
    const rowWidth = itemsInRow * tileWidth + (itemsInRow - 1) * gap;
    const rowLeft = 42 + (availableWidth - rowWidth) / 2;
    const x = rowLeft + column * (tileWidth + gap);
    const y = 505 + row * (tileHeight + 10);
    imageCover(document, PRODUCT_THEMES[product].image, x, y, tileWidth, tileHeight);
    document
      .save()
      .rect(x, y + tileHeight - 30, tileWidth, 30)
      .fillOpacity(0.82)
      .fill(COLORS.navy)
      .restore();
    document
      .font(FONT_SEMIBOLD)
      .fontSize(8)
      .fillColor(COLORS.white)
      .text(PRODUCT_THEMES[product].label, x + 9, y + tileHeight - 20, {
        width: tileWidth - 18,
        align: "center",
      });
  });

  document
    .font(FONT_REGULAR)
    .fontSize(7.2)
    .fillColor(COLORS.muted)
    .text(
      "Diese Analyse dient als unverbindliche Projekt- und Kostenorientierung. Eine belastbare technische Auslegung und ein konkretes Angebot können erst nach einer Vor-Ort-Begehung und fachlichen Prüfung erstellt werden.",
      42,
      pageHeight - 90,
      { width: pageWidth - 84, align: "center", lineGap: 2 },
    );
}

function buildSummaryMetrics(lead: ConfiguratorLeadPayload): PdfMetric[] {
  const economics = lead.economics;
  const metrics: PdfMetric[] = [
    {
      value:
        formatCurrency(economics.investmentMinEuro) +
        "–" +
        formatCurrency(economics.investmentMaxEuro),
      label: "Gesamtinvestition als belastbarer Modellkorridor",
      tone: "navy",
    },
  ];
  const positiveBenefits = economics.components.reduce(
    (sum, component) => sum + Math.max(component.firstYearEconomicEffectEuro, 0),
    0,
  );
  if (positiveBenefits > 0) {
    metrics.push({
      value: formatCurrency(positiveBenefits) + "/Jahr",
      label: "Quantifizierbare Vorteile im ersten Modelljahr",
      tone: "accent",
    });
  }
  if (economics.paybackYears !== null) {
    metrics.push({
      value: formatNumber(economics.paybackYears) + " Jahre",
      label: "Modellierter Break-even im Basisszenario",
    });
  }
  const pv = getConfigurator(lead, "photovoltaic");
  if (pv?.type === "photovoltaic") {
    metrics.push({
      value:
        formatNumber(pv.result.estimatedAnnualYieldKwhMin) +
        "–" +
        formatNumber(pv.result.estimatedAnnualYieldKwhMax) +
        " kWh",
      label: "Modellierter PV-Jahresertrag",
    });
  }
  const heatPump = getConfigurator(lead, "heat_pump");
  if (heatPump?.type === "heat_pump" && heatPump.result.annualOperatingCostDifferenceEuro !== null) {
    metrics.push({
      value: formatCurrency(heatPump.result.annualOperatingCostDifferenceEuro) + "/Jahr",
      label:
        heatPump.result.heatingComparisonKind === "reference_scenario"
          ? "Differenz zum ausdrücklich modellierten Referenzszenario"
          : "Modellierte Heizkosten-Differenz",
      tone: "accent",
    });
  }
  return metrics.slice(0, 4);
}

function drawExecutiveSummary(
  document: PDFKit.PDFDocument,
  lead: ConfiguratorLeadPayload,
): void {
  startPage(
    document,
    "Projektpotenzial",
    "Das Potenzial deines Energieprojekts",
    "Die wichtigsten Ergebnisse aus deiner individuellen Modellierung – wirtschaftliche Größen klar getrennt von Komfort- und Systemmehrwerten.",
  );
  const metricsBottom = drawFeaturedMetrics(document, buildSummaryMetrics(lead), document.y);
  const heatPump = getConfigurator(lead, "heat_pump");
  let chartBottom = metricsBottom + 10;

  document
    .font(FONT_SEMIBOLD)
    .fontSize(12)
    .fillColor(COLORS.primary)
    .text(
      heatPump?.type === "heat_pump" && heatPump.result.currentHeatingOperatingCostEuro !== null
        ? "Jährliche Heizenergiekosten im Vergleich"
        : "Investitionsverteilung",
      document.page.margins.left,
      chartBottom,
    );
  chartBottom += 25;

  if (heatPump?.type === "heat_pump" && heatPump.result.currentHeatingOperatingCostEuro !== null) {
    chartBottom = drawHorizontalBars(
      document,
      [
        {
          label: heatPump.result.heatingComparisonLabel,
          value: heatPump.result.currentHeatingOperatingCostEuro,
          color: COLORS.neutral,
        },
        {
          label: "Wärmepumpenmodell",
          value: heatPump.result.annualHeatPumpOperatingCostEuro,
          color: COLORS.accent,
        },
      ],
      "€/Jahr",
      chartBottom,
      { currency: true },
    );
  } else {
    const investments = lead.economics.components
      .map((component) => ({
        label: PRODUCT_THEMES[component.component].label,
        value: component.investmentBaseEuro,
        color: PRODUCT_THEMES[component.component].accent,
      }))
      .filter((item): item is { label: string; value: number; color: string } => item.value !== null);
    if (investments.length > 0) {
      drawDonut(document, investments, 155, chartBottom + 69, 62, formatCurrency(lead.economics.investmentBaseEuro));
      drawLegend(document, investments, 252, chartBottom + 8, 290, formatCurrency);
      chartBottom += 155;
    }
  }

  const benefits = getNonMonetizedBenefits(lead);
  const showSecondaryInvestmentChart =
    heatPump?.type === "heat_pump" &&
    heatPump.result.currentHeatingOperatingCostEuro !== null &&
    lead.products.length > 1;
  document
    .font(FONT_SEMIBOLD)
    .fontSize(11)
    .fillColor(COLORS.navy)
    .text("Was bedeutet das für dich?", 42, chartBottom + 5, { width: 510 });
  const interpretation =
    lead.economics.paybackYears === null
      ? "Die Investition wird transparent gezeigt, auch wenn das Gesamtprojekt im Modellhorizont keinen Break-even erreicht. Komfort, Resilienz und bequemes Laden werden nicht künstlich in Euro umgerechnet."
      : "Die Modellierung verbindet deinen Kostenkorridor mit den quantifizierbaren Energieeffekten. Der Break-even ist eine Orientierung und bleibt von Auslegung, Nutzung und zukünftigen Preisen abhängig.";
  document.font(FONT_REGULAR).fontSize(8.5).fillColor(COLORS.muted).text(interpretation, 42, chartBottom + 27, {
    width: 510,
    lineGap: 3,
  });
  if (benefits.length > 0 && !showSecondaryInvestmentChart) {
    document
      .font(FONT_SEMIBOLD)
      .fontSize(7.5)
      .fillColor(COLORS.accent)
      .text("NICHT MONETARISIERTE MEHRWERTE", 42, chartBottom + 79, {
        characterSpacing: 1.2,
      });
    document
      .font(FONT_REGULAR)
      .fontSize(8)
      .fillColor(COLORS.text)
      .text(benefits.join("   ·   "), 42, chartBottom + 98, { width: 510 });
  }

  if (showSecondaryInvestmentChart) {
    const investments = lead.economics.components
      .map((component) => ({
        label: PRODUCT_THEMES[component.component].label,
        value: component.investmentBaseEuro,
        color: PRODUCT_THEMES[component.component].accent,
      }))
      .filter((item): item is { label: string; value: number; color: string } => item.value !== null);
    document
      .font(FONT_SEMIBOLD)
      .fontSize(9)
      .fillColor(COLORS.primary)
      .text("INVESTITIONSVERTEILUNG", 42, 602, { characterSpacing: 1.1 });
    drawDonut(
      document,
      investments,
      135,
      670,
      45,
      formatCurrency(lead.economics.investmentBaseEuro),
    );
    drawLegend(document, investments, 220, 620, 322, formatCurrency);
  }
}

function drawProductModule(
  document: PDFKit.PDFDocument,
  configurator: ConfiguratorPayload,
  index: number,
  count: number,
): void {
  const width = contentWidth(document);
  const gap = 10;
  const columns = count > 3 ? 3 : count;
  const itemWidth = (width - gap * (columns - 1)) / columns;
  const row = Math.floor(index / columns);
  const column = index % columns;
  const x = document.page.margins.left + column * (itemWidth + gap);
  const y = 192 + row * 117;
  imageCover(document, PRODUCT_THEMES[configurator.type].image, x, y, itemWidth, 76);
  document
    .save()
    .rect(x, y + 45, itemWidth, 31)
    .fillOpacity(0.82)
    .fill(COLORS.navy)
    .restore();
  document
    .font(FONT_SEMIBOLD)
    .fontSize(7)
    .fillColor(COLORS.white)
    .text(PRODUCT_THEMES[configurator.type].label, x + 8, y + 54, {
      width: itemWidth - 16,
    });
  const metric = getPrimaryProductMetric(configurator);
  document.font(FONT_BOLD).fontSize(10).fillColor(metricColor(metric.tone)).text(metric.value, x, y + 84, {
    width: itemWidth,
    align: "center",
  });
  document.font(FONT_REGULAR).fontSize(6.5).fillColor(COLORS.muted).text(metric.label, x, y + 101, {
    width: itemWidth,
    align: "center",
  });
}

function drawArrow(
  document: PDFKit.PDFDocument,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string = COLORS.accent,
): void {
  const angle = Math.atan2(toY - fromY, toX - fromX);
  document
    .save()
    .strokeColor(color)
    .lineWidth(2)
    .moveTo(fromX, fromY)
    .lineTo(toX, toY)
    .stroke()
    .fillColor(color)
    .moveTo(toX, toY)
    .lineTo(toX - 8 * Math.cos(angle - Math.PI / 6), toY - 8 * Math.sin(angle - Math.PI / 6))
    .lineTo(toX - 8 * Math.cos(angle + Math.PI / 6), toY - 8 * Math.sin(angle + Math.PI / 6))
    .closePath()
    .fill()
    .restore();
}

function drawFlowNode(
  document: PDFKit.PDFDocument,
  x: number,
  y: number,
  width: number,
  label: string,
  detail: string,
  tone: "primary" | "accent" | "neutral" = "neutral",
  height = 58,
): void {
  const fill = tone === "primary" ? COLORS.primary : tone === "accent" ? COLORS.accent : COLORS.white;
  const foreground = tone === "neutral" ? COLORS.navy : COLORS.white;
  document
    .save()
    .roundedRect(x, y, width, height, 11)
    .fill(fill)
    .strokeColor(tone === "neutral" ? COLORS.border : fill)
    .stroke()
    .restore();
  document
    .font(FONT_SEMIBOLD)
    .fontSize(8)
    .fillColor(foreground)
    .text(label, x + 10, y + 13, { width: width - 20, align: "center" });
  document
    .font(FONT_REGULAR)
    .fontSize(6.4)
    .fillColor(tone === "neutral" ? COLORS.muted : "#EAF7FC")
    .text(detail, x + 10, y + 31, { width: width - 20, align: "center", lineGap: 1 });
}

function drawEnergySystemPage(
  document: PDFKit.PDFDocument,
  lead: ConfiguratorLeadPayload,
): void {
  startPage(
    document,
    "Systembild",
    "Dein Energiesystem",
    "Ein gemeinsames Projekt: Komponenten greifen ineinander, Investitionen und Nutzen bleiben dennoch sauber getrennt.",
  );
  lead.configurators.forEach((configurator, index) =>
    drawProductModule(document, configurator, index, lead.configurators.length),
  );
  const rows = Math.ceil(lead.configurators.length / Math.min(3, lead.configurators.length));
  const flowTop = 192 + rows * 117 + 25;
  document
    .font(FONT_SEMIBOLD)
    .fontSize(8)
    .fillColor(COLORS.accent)
    .text("SCHEMATISCHES JAHRESMODELL", 42, flowTop, { characterSpacing: 1.4 });
  document.save().roundedRect(42, flowTop + 22, 511, 245, 14).fill(COLORS.lightMuted).restore();
  document.save().roundedRect(52, flowTop + 32, 491, 225, 12).fill(COLORS.white).restore();

  const hasPv = lead.products.includes("photovoltaic");
  const hasStorage = lead.products.includes("battery_storage");
  const consumers = [
    lead.products.includes("heat_pump") ? "Wärmepumpe" : null,
    lead.products.includes("climate") ? "Klimaanlage" : null,
    lead.products.includes("wallbox") ? "Wallbox" : null,
  ].filter((value): value is string => value !== null);

  drawFlowNode(
    document,
    67,
    flowTop + 70,
    108,
    hasPv ? "PV-Erzeugung" : "Energiequelle",
    hasPv ? "Solarstrom vom Dach" : "Ausgang des Modells",
    "primary",
  );
  drawFlowNode(document, 244, flowTop + 67, 132, "Gebäude", "Direktverbrauch zuerst", "neutral", 64);
  drawArrow(document, 175, flowTop + 99, 244, flowTop + 99);
  document.font(FONT_SEMIBOLD).fontSize(5.8).fillColor(COLORS.primary).text(
    "DIREKT NUTZEN",
    185,
    flowTop + 83,
    { width: 50, align: "center" },
  );

  drawFlowNode(document, 67, flowTop + 172, 108, "Stromnetz", hasPv ? "Restbezug & Einspeisung" : "Restbezug", "neutral");
  drawArrow(document, 175, flowTop + 193, 244, flowTop + 122, COLORS.secondary);
  document.font(FONT_REGULAR).fontSize(5.6).fillColor(COLORS.muted).text(
    "RESTBEDARF",
    178,
    flowTop + 165,
    { width: 56, align: "center" },
  );

  if (hasPv) {
    drawArrow(document, 105, flowTop + 128, 105, flowTop + 172, COLORS.neutral);
    document.font(FONT_REGULAR).fontSize(5.6).fillColor(COLORS.muted).text(
      "ÜBERSCHUSS",
      112,
      flowTop + 143,
      { width: 52 },
    );
  }

  if (hasStorage) {
    drawFlowNode(document, 244, flowTop + 172, 132, "Stromspeicher", "verschiebt Solarstrom in später", "accent", 58);
    drawArrow(document, 310, flowTop + 172, 310, flowTop + 131);
    document.font(FONT_REGULAR).fontSize(5.6).fillColor(COLORS.accent).text(
      "ZEITLICH VERSCHOBEN",
      319,
      flowTop + 145,
      { width: 76 },
    );
  }

  const consumerDetail = consumers.length > 0 ? consumers.join(" · ") : "Haushaltsstrom";
  drawFlowNode(document, 420, flowTop + 83, 108, "Verbraucher", consumerDetail, "neutral", 78);
  drawArrow(document, 376, flowTop + 99, 420, flowTop + 116);
  document.font(FONT_SEMIBOLD).fontSize(5.8).fillColor(COLORS.primary).text(
    "VERSORGEN",
    380,
    flowTop + 81,
    { width: 39, align: "center" },
  );
  document
    .font(FONT_REGULAR)
    .fontSize(7.5)
    .fillColor(COLORS.muted)
    .text(
      "Die Grafik ordnet die Jahresenergiemengen ein. Sie ist keine stündliche Lastgang- oder Netzsimulation.",
      58,
      flowTop + 274,
      { width: 480, align: "center" },
    );
}

function getProductMetrics(configurator: ConfiguratorPayload): PdfMetric[] {
  const costMetric = (minimum: number | null, maximum: number | null): PdfMetric => ({
    value:
      minimum === null || maximum === null
        ? "Individuelle Kalkulation"
        : formatCurrency(minimum) + "–" + formatCurrency(maximum),
    label: "Projektkosten-Korridor",
    tone: "navy",
  });
  switch (configurator.type) {
    case "photovoltaic":
      return [
        getPrimaryProductMetric(configurator),
        {
          value:
            formatNumber(configurator.result.estimatedAnnualYieldKwhMin) +
            "–" +
            formatNumber(configurator.result.estimatedAnnualYieldKwhMax) +
            " kWh",
          label: "Jahresertrag",
          tone: "accent",
        },
        costMetric(
          configurator.result.estimatedMinimumCostEuro,
          configurator.result.estimatedMaximumCostEuro,
        ),
      ];
    case "battery_storage": {
      const componentBenefit = configurator.result.estimatedTotalCostEuro;
      return [
        getPrimaryProductMetric(configurator),
        {
          value: formatNumber(configurator.result.technicalUpperBoundUsableCapacityKwh) + " kWh",
          label: "Technische Obergrenze",
          tone: "navy",
        },
        costMetric(
          configurator.result.estimatedMinimumCostEuro,
          configurator.result.estimatedMaximumCostEuro,
        ),
        {
          value: componentBenefit !== null && componentBenefit > 0 ? "Zusatznutzen" : "Individuell",
          label: "Wirtschaftlichkeit wird zusätzlich zur PV betrachtet",
          tone: "accent",
        },
      ];
    }
    case "heat_pump":
      return [
        getPrimaryProductMetric(configurator),
        {
          value: formatNumber(configurator.result.annualHeatPumpElectricityConsumptionKwh) + " kWh",
          label: "Strombedarf pro Jahr",
          tone: "accent",
        },
        costMetric(
          configurator.result.estimatedMinimumCostEuro,
          configurator.result.estimatedMaximumCostEuro,
        ),
        {
          value: formatCurrency(configurator.result.annualHeatPumpOperatingCostEuro),
          label: "Modellierte Betriebskosten pro Jahr",
          tone: "navy",
        },
      ];
    case "climate":
      return [
        getPrimaryProductMetric(configurator),
        {
          value: String(configurator.result.recommendedIndoorUnitCount),
          label: "Inneneinheiten / Zonen",
          tone: "accent",
        },
        costMetric(
          configurator.result.estimatedMinimumCostEuro,
          configurator.result.estimatedMaximumCostEuro,
        ),
        {
          value: formatCurrency(configurator.result.annualOperatingCostEuro),
          label: "Modellierte Betriebskosten pro Jahr",
          tone: "navy",
        },
      ];
    case "wallbox":
      return [
        getPrimaryProductMetric(configurator),
        {
          value: formatNumber(configurator.result.annualHomeChargingInputEnergyKwh) + " kWh",
          label: "Laden zuhause pro Jahr",
          tone: "accent",
        },
        costMetric(
          configurator.result.estimatedMinimumCostEuro,
          configurator.result.estimatedMaximumCostEuro,
        ),
        {
          value: formatNumber(configurator.answers.pvChargingSharePercent) + " %",
          label: "Modellierter PV-Ladeanteil",
          tone: "navy",
        },
      ];
  }
}

function productInterpretation(configurator: ConfiguratorPayload): string {
  switch (configurator.type) {
    case "photovoltaic":
      return (
        "Die Anlagenklasse orientiert sich an deinem prognostizierten Stromverbrauch und der Dachausrichtung. " +
        "Ertrag und Kosten bleiben als Korridor sichtbar, bis Dach, Verschattung und Elektroanschluss geprüft sind."
      );
    case "battery_storage":
      return (
        "Der Speicher wird als Ergänzung zum Solarstrom modelliert. Sein finanzieller Beitrag ist ausschließlich " +
        "der zusätzliche Nutzen gegenüber PV ohne Speicher; Ersatzstrom wird nicht monetarisiert."
      );
    case "heat_pump":
      if (configurator.result.heatingComparisonKind === "unavailable") {
        return (
          "Die Wärmepumpen-Betriebskosten sind belastbar als Modellwert ausgewiesen. Weil das heutige Heizsystem " +
          "nicht bekannt ist, wird bewusst keine präzise Einsparung behauptet."
        );
      }
      return (
        "Der Betriebskostenvergleich verwendet " +
        (configurator.result.heatingComparisonBasis === "user_consumption"
          ? "deine Verbrauchsangabe."
          : "den modellierten Wärmebedarf.") +
        " Förderung ist nicht eingerechnet."
      );
    case "climate":
      return (
        "Die Auslegung verbindet Fläche, Zonen, Gebäudestandard, Sonneneintrag und Belegung. " +
        "Komfort und PV-Kompatibilität werden gezeigt, ohne einen künstlichen ROI zu behaupten."
      );
    case "wallbox":
      return (
        "Ladeleistung und Heimladeenergie basieren auf deiner Fahrleistung und deinem Ladeprofil. " +
        "Bequemes Laden zuhause wird nicht als erfundene Investitionsrendite verkauft."
      );
  }
}

function drawProductChart(
  document: PDFKit.PDFDocument,
  configurator: ConfiguratorPayload,
  y: number,
): number {
  switch (configurator.type) {
    case "photovoltaic":
      return drawHorizontalBars(
        document,
        [
          {
            label: "Prognostizierter Verbrauch",
            value: configurator.result.projectedAnnualConsumptionKwh,
            color: COLORS.neutral,
          },
          {
            label: "PV-Ertrag · Mittelwert",
            value:
              (configurator.result.estimatedAnnualYieldKwhMin +
                configurator.result.estimatedAnnualYieldKwhMax) /
              2,
            color: COLORS.primary,
          },
        ],
        "kWh/Jahr",
        y,
      );
    case "battery_storage":
      return drawHorizontalBars(
        document,
        [
          {
            label: "Empfehlung · Mittelwert",
            value:
              (configurator.result.recommendedUsableCapacityKwhMin +
                configurator.result.recommendedUsableCapacityKwhMax) /
              2,
            color: COLORS.accent,
          },
          {
            label: "Technische Obergrenze",
            value: configurator.result.technicalUpperBoundUsableCapacityKwh,
            color: COLORS.neutral,
          },
        ],
        "kWh",
        y,
      );
    case "heat_pump":
      if (configurator.result.currentHeatingOperatingCostEuro === null) {
        return drawHorizontalBars(
          document,
          [
            {
              label: "Wärmepumpenmodell",
              value: configurator.result.annualHeatPumpOperatingCostEuro,
              color: COLORS.accent,
            },
          ],
          "€/Jahr",
          y,
          { currency: true },
        );
      }
      return drawHorizontalBars(
        document,
        [
          {
            label: configurator.result.heatingComparisonLabel,
            value: configurator.result.currentHeatingOperatingCostEuro,
            color: COLORS.neutral,
          },
          {
            label: "Wärmepumpenmodell",
            value: configurator.result.annualHeatPumpOperatingCostEuro,
            color: COLORS.accent,
          },
        ],
        "€/Jahr",
        y,
        { currency: true },
      );
    case "climate":
      return drawHorizontalBars(
        document,
        [
          {
            label: "Jährlicher Kühlstrombedarf",
            value: configurator.result.annualElectricityConsumptionKwh,
            color: COLORS.accent,
          },
        ],
        "kWh/Jahr",
        y,
      );
    case "wallbox": {
      const items = [
        {
          label: "PV-Laden",
          value: configurator.result.annualPvChargingEnergyKwh,
          color: COLORS.accent,
        },
        {
          label: "Netz-Laden",
          value: configurator.result.annualGridChargingEnergyKwh,
          color: COLORS.secondary,
        },
      ];
      drawDonut(document, items, 165, y + 72, 66, formatNumber(configurator.answers.pvChargingSharePercent) + " % PV");
      drawLegend(document, items, 270, y + 28, 260, (value) => formatNumber(value) + " kWh");
      return y + 155;
    }
  }
}

function drawProductPage(
  document: PDFKit.PDFDocument,
  configurator: ConfiguratorPayload,
): void {
  document.addPage();
  drawPageHeader(document, PRODUCT_THEMES[configurator.type].label);
  const theme = PRODUCT_THEMES[configurator.type];
  imageCover(document, theme.image, 42, 76, 511, 181, configurator.type === "wallbox" ? "right" : "center");
  document.save().rect(42, 184, 511, 73).fillOpacity(0.82).fill(COLORS.navy).restore();
  document
    .font(FONT_SEMIBOLD)
    .fontSize(8)
    .fillColor("#BFEAF5")
    .text("DEIN PROJEKTBAUSTEIN", 62, 199, { characterSpacing: 1.4 });
  document.font(FONT_BOLD).fontSize(24).fillColor(COLORS.white).text(theme.label, 62, 218, {
    width: 450,
  });

  const metricsBottom = drawMetricStrip(document, getProductMetrics(configurator), 286);
  document
    .font(FONT_SEMIBOLD)
    .fontSize(12)
    .fillColor(theme.accent)
    .text(
      configurator.type === "heat_pump"
        ? "Betriebskostenvergleich"
        : configurator.type === "wallbox"
          ? "Ladeenergie im Jahresmodell"
          : configurator.type === "photovoltaic"
            ? "Erzeugung und Verbrauch"
            : configurator.type === "battery_storage"
              ? "Empfohlene Dimensionierung"
              : "Jährlicher Energiebedarf",
      42,
      metricsBottom + 12,
    );
  const chartBottom = drawProductChart(document, configurator, metricsBottom + 38);
  document.font(FONT_SEMIBOLD).fontSize(10).fillColor(COLORS.navy).text(
    "Was bedeutet das für dein Projekt?",
    42,
    chartBottom + 5,
  );
  document.font(FONT_REGULAR).fontSize(8.2).fillColor(COLORS.muted).text(
    productInterpretation(configurator),
    42,
    chartBottom + 25,
    { width: 511, lineGap: 3 },
  );
  const noteY = Math.min(chartBottom + 92, 715);
  document.save().roundedRect(42, noteY, 511, 58, 9).fill(theme.soft).restore();
  document.font(FONT_SEMIBOLD).fontSize(7.5).fillColor(theme.accent).text(
    "VOR ORT NOCH ZU PRÜFEN",
    57,
    noteY + 12,
    { characterSpacing: 1.1 },
  );
  document.font(FONT_REGULAR).fontSize(7.5).fillColor(COLORS.text).text(
    PRODUCT_CHECKS[configurator.type],
    57,
    noteY + 31,
    { width: 480 },
  );
}

function drawCashflowChart(
  document: PDFKit.PDFDocument,
  projections: ConfiguratorLeadPayload["economics"]["projections"],
  y: number,
): number {
  const left = document.page.margins.left;
  const width = contentWidth(document);
  const height = 230;
  const plotLeft = left + 58;
  const plotWidth = width - 76;
  const values = projections.map((projection) => projection.cumulativeCashFlowEuro);
  const minimum = Math.min(0, ...values);
  const maximum = Math.max(0, ...values);
  const range = Math.max(maximum - minimum, 1);
  const mapY = (value: number) => y + height - ((value - minimum) / range) * height;
  const lastProjection = projections[projections.length - 1];
  const mapX = (year: number) =>
    plotLeft + (year / Math.max(lastProjection?.year ?? 20, 1)) * plotWidth;

  document.save().roundedRect(left, y, width, height, 12).fill(COLORS.lightMuted).restore();
  [minimum, 0, maximum].forEach((value) => {
    const lineY = mapY(value);
    document
      .save()
      .strokeColor(value === 0 ? COLORS.secondary : COLORS.border)
      .lineWidth(value === 0 ? 1.2 : 0.6)
      .moveTo(plotLeft, lineY)
      .lineTo(plotLeft + plotWidth, lineY)
      .stroke()
      .restore();
    document
      .font(FONT_REGULAR)
      .fontSize(6.5)
      .fillColor(COLORS.muted)
      .text(formatCurrency(value), left + 4, lineY - 4, { width: 48, align: "right" });
  });
  const horizonYears = Math.max(lastProjection?.year ?? 20, 1);
  [...new Set([0, ...Array.from({ length: 4 }, (_, index) => Math.round(((index + 1) * horizonYears) / 4))])].forEach((year) => {
    const x = mapX(year);
    document
      .font(FONT_REGULAR)
      .fontSize(6.5)
      .fillColor(COLORS.muted)
      .text(String(year), x - 10, y + height + 7, { width: 20, align: "center" });
  });

  projections.forEach((projection, index) => {
    const x = mapX(projection.year);
    const pointY = mapY(projection.cumulativeCashFlowEuro);
    if (index === 0) document.moveTo(x, pointY);
    else document.lineTo(x, pointY);
  });
  document.strokeColor(COLORS.primary).lineWidth(3).stroke();

  const breakEven = projections.find(
    (projection) => projection.year > 0 && projection.cumulativeCashFlowEuro >= 0,
  );
  if (breakEven) {
    const x = mapX(breakEven.year);
    const pointY = mapY(breakEven.cumulativeCashFlowEuro);
    document.save().circle(x, pointY, 5).fill(COLORS.accent).restore();
    document.font(FONT_SEMIBOLD).fontSize(7).fillColor(COLORS.primary).text(
      "Break-even · Jahr " + breakEven.year,
      Math.min(x + 8, left + width - 112),
      Math.max(y + 9, pointY - 18),
      { width: 112 },
    );
  }
  const final = projections[projections.length - 1];
  if (final) {
    document.font(FONT_SEMIBOLD).fontSize(7).fillColor(COLORS.primary).text(
      formatCurrency(final.cumulativeCashFlowEuro),
      plotLeft + plotWidth - 92,
      Math.max(y + 8, mapY(final.cumulativeCashFlowEuro) - 19),
      { width: 90, align: "right" },
    );
  }
  document.font(FONT_REGULAR).fontSize(6.5).fillColor(COLORS.muted).text(
    "Jahre",
    left + width - 34,
    y + height + 7,
  );
  return y + height + 30;
}

function drawScenarioRange(
  document: PDFKit.PDFDocument,
  scenarios: ConfiguratorLeadPayload["economics"]["scenarios"],
  y: number,
): number {
  const left = document.page.margins.left;
  const width = contentWidth(document);
  const labels = { conservative: "Konservativ", base: "Basis", favorable: "Günstig" } as const;
  const modeled = scenarios.filter(
    (scenario): scenario is typeof scenario & { finalCumulativeCashFlowEuro: number } =>
      scenario.finalCumulativeCashFlowEuro !== null,
  );
  document.save().roundedRect(left, y, width, 112, 12).fill(COLORS.lightMuted).restore();
  if (modeled.length === 0) {
    document.font(FONT_SEMIBOLD).fontSize(9).fillColor(COLORS.navy).text(
      "Ergebnisbereich erst nach individueller Kalkulation",
      left + 18,
      y + 44,
      { width: width - 36, align: "center" },
    );
    return y + 124;
  }
  const minimum = Math.min(...modeled.map((scenario) => scenario.finalCumulativeCashFlowEuro));
  const maximum = Math.max(...modeled.map((scenario) => scenario.finalCumulativeCashFlowEuro));
  const range = Math.max(maximum - minimum, 1);
  const axisLeft = left + 62;
  const axisWidth = width - 124;
  const mapX = (value: number) => axisLeft + ((value - minimum) / range) * axisWidth;
  document.save().moveTo(axisLeft, y + 51).lineTo(axisLeft + axisWidth, y + 51).lineWidth(5).lineCap("round").strokeColor(COLORS.surfaceBlue).stroke().restore();
  modeled.forEach((scenario) => {
    const x = mapX(scenario.finalCumulativeCashFlowEuro);
    const color = scenario.id === "base" ? COLORS.primary : scenario.id === "favorable" ? COLORS.accent : COLORS.neutral;
    document.save().circle(x, y + 51, scenario.id === "base" ? 7 : 5).fill(color).restore();
    document.font(FONT_SEMIBOLD).fontSize(6.7).fillColor(color).text(
      labels[scenario.id],
      x - 42,
      y + 20,
      { width: 84, align: "center" },
    );
    document.font(FONT_SEMIBOLD).fontSize(6.7).fillColor(COLORS.text).text(
      formatCurrency(scenario.finalCumulativeCashFlowEuro),
      x - 50,
      y + 67,
      { width: 100, align: "center" },
    );
  });
  document.font(FONT_REGULAR).fontSize(6.4).fillColor(COLORS.muted).text(
    "Der Bereich verändert sich vor allem durch Projektkosten, PV-Ertrag und die wirtschaftlichen Modellannahmen.",
    left + 24,
    y + 91,
    { width: width - 48, align: "center" },
  );
  return y + 124;
}

function drawEconomicsPage(
  document: PDFKit.PDFDocument,
  lead: ConfiguratorLeadPayload,
): void {
  startPage(
    document,
    "Wirtschaftlichkeit",
    "Was spart dein Energiesystem?",
    "Solarstrom, Speicher und Heizbetrieb werden in verständlichen Gruppen gezeigt. Komfort- und Infrastrukturbausteine erhalten bewusst keinen erfundenen ROI.",
  );
  const economics = lead.economics;
  const pvStorage = economics.components.filter(
    (component) => component.component === "photovoltaic" || component.component === "battery_storage",
  );
  const pvStorageInvestment = pvStorage.some((component) => component.investmentBaseEuro === null)
    ? null
    : pvStorage.reduce((sum, component) => sum + (component.investmentBaseEuro ?? 0), 0);
  const photovoltaic = pvStorage.find((component) => component.component === "photovoltaic");
  const storage = pvStorage.find((component) => component.component === "battery_storage");
  const pvStorageEffect = pvStorage.reduce(
    (sum, component) => sum + component.firstYearEconomicEffectEuro,
    0,
  );
  const groupMetrics: PdfMetric[] = [
    {
      value: formatCurrency(pvStorageInvestment),
      label: "PV + Speicher · modellierte Investition",
      tone: "navy",
    },
    {
      value: formatCurrency(photovoltaic?.firstYearEconomicEffectEuro ?? 0),
      label: "PV-Nutzen im ersten Jahr",
      tone: "primary",
    },
    {
      value: formatCurrency(storage?.firstYearEconomicEffectEuro ?? 0),
      label: "zusätzlicher Speichernutzen",
      tone: "accent",
    },
    {
      value: formatCurrency(pvStorageEffect),
      label: "quantifizierbarer Effekt · Jahr 1",
      tone: pvStorageEffect >= 0 ? "accent" : "navy",
    },
  ];
  const stripBottom = drawMetricStrip(document, groupMetrics, document.y);
  document.font(FONT_SEMIBOLD).fontSize(11).fillColor(COLORS.primary).text(
    "So entsteht der quantifizierbare Nutzen",
    42,
    stripBottom + 6,
  );
  const contributionItems = [
    ...(photovoltaic ? [{ label: "Solarstrom sparen & einspeisen", value: Math.max(photovoltaic.firstYearEconomicEffectEuro, 0), color: COLORS.primary }] : []),
    ...(storage ? [{ label: "PV-Überschuss zeitlich verschieben", value: Math.max(storage.firstYearEconomicEffectEuro, 0), color: COLORS.accent }] : []),
  ];
  const contributionsBottom = contributionItems.length > 0
    ? drawHorizontalBars(document, contributionItems, "€/Jahr", stripBottom + 34, { currency: true, height: 34 })
    : stripBottom + 62;
  document.font(FONT_REGULAR).fontSize(7.3).fillColor(COLORS.muted).text(
    "Der Speicher wird ausschließlich als zusätzlicher Nutzen gegenüber PV ohne Speicher gerechnet. Einspeisewert und Speicherverluste sind berücksichtigt; es gibt keine Doppelzählung.",
    42,
    contributionsBottom + 2,
    { width: 511, lineGap: 2 },
  );

  const heatPump = lead.configurators.find((item) => item.type === "heat_pump");
  if (heatPump?.type === "heat_pump") {
    document.font(FONT_SEMIBOLD).fontSize(11).fillColor(COLORS.primary).text(
      "Wärmepumpe · Betriebskosten separat betrachtet",
      42,
      contributionsBottom + 56,
    );
    const heatingItems = [
      ...(heatPump.result.currentHeatingOperatingCostEuro === null ? [] : [{ label: heatPump.result.heatingComparisonLabel, value: heatPump.result.currentHeatingOperatingCostEuro, color: COLORS.neutral }]),
      { label: "Wärmepumpenmodell", value: heatPump.result.annualHeatPumpOperatingCostEuro, color: PRODUCT_THEMES.heat_pump.accent },
    ];
    const heatingBottom = drawHorizontalBars(document, heatingItems, "€/Jahr", contributionsBottom + 84, { currency: true, height: 34 });
    document.font(FONT_SEMIBOLD).fontSize(8.5).fillColor(COLORS.navy).text(
      heatPump.result.annualOperatingCostDifferenceEuro === null
        ? "Ohne belastbare Vergleichsbasis wird keine Einsparung behauptet."
        : `Jährliche Differenz im Modell: ${formatCurrency(heatPump.result.annualOperatingCostDifferenceEuro)}`,
      42,
      heatingBottom + 1,
      { width: 511 },
    );
    document.font(FONT_REGULAR).fontSize(7).fillColor(COLORS.muted).text(
      "Die vollständige Wärmepumpeninvestition wird nicht gegen null gerechnet: Auch ein alternatives neues Heizsystem hätte Investitionskosten. Förderung ist nicht eingerechnet.",
      42,
      heatingBottom + 22,
      { width: 511, lineGap: 2 },
    );
  } else if (economics.projections.length > 0) {
    document.font(FONT_SEMIBOLD).fontSize(11).fillColor(COLORS.primary).text(
      "Kumulierter Modellwert · Solarprojekt",
      42,
      contributionsBottom + 56,
    );
    drawCashflowChart(document, economics.projections, contributionsBottom + 82);
  }

  startPage(
    document,
    "Wirtschaftlichkeit",
    "Investition und Mehrwerte",
    "Das Gesamtprojekt bleibt transparent: finanzielle Modellwerte, Komfort und Infrastruktur werden klar voneinander getrennt.",
  );
  const totalMetrics: PdfMetric[] = [
    {
      value: economics.investmentMinEuro === null || economics.investmentMaxEuro === null
        ? "Individuelle Kalkulation"
        : `${formatCurrency(economics.investmentMinEuro)}–${formatCurrency(economics.investmentMaxEuro)}`,
      label: "Gesamtprojekt · Investitionskorridor",
      tone: "navy",
    },
    {
      value: formatCurrency(economics.modeledComponentsInvestmentBaseEuro),
      label: economics.pricingMode === "modeled" ? "modellierte Basisinvestition" : "bereits modellierbare Komponenten",
      tone: "primary",
    },
    {
      value: formatCurrency(economics.firstYearQuantifiedEffectEuro),
      label: "quantifizierter Nettoeffekt · Jahr 1",
      tone: economics.firstYearQuantifiedEffectEuro >= 0 ? "accent" : "navy",
    },
    {
      value: economics.finalCumulativeCashFlowEuro === null ? "Nicht berechenbar" : formatCurrency(economics.finalCumulativeCashFlowEuro),
      label: `kanonisches Gesamtergebnis · ${economics.horizonYears} Jahre`,
      tone: "navy",
    },
  ];
  const totalBottom = drawMetricStrip(document, totalMetrics, document.y);
  const investments = economics.components
    .map((component) => ({ label: PRODUCT_THEMES[component.component].label, value: component.investmentBaseEuro, color: PRODUCT_THEMES[component.component].accent }))
    .filter((item): item is { label: string; value: number; color: string } => item.value !== null);
  document.font(FONT_SEMIBOLD).fontSize(10).fillColor(COLORS.primary).text("Investitionsverteilung", 42, totalBottom + 2);
  if (investments.length > 0) {
    drawDonut(document, investments, 148, totalBottom + 101, 65, formatCurrency(economics.modeledComponentsInvestmentBaseEuro));
    drawLegend(document, investments, 246, totalBottom + 30, 294, formatCurrency);
  }

  const quantified = economics.components
    .filter((component) => component.analysisKind === "economic_effect")
    .map((component) => `${PRODUCT_THEMES[component.component].label}: ${formatCurrency(component.firstYearEconomicEffectEuro)} im ersten Jahr`);
  const benefits = getNonMonetizedBenefits(lead);
  const columnsY = totalBottom + 190;
  drawCompactListPanel(document, 42, columnsY, 247, "FINANZIELL QUANTIFIZIERT", quantified, COLORS.primary);
  drawCompactListPanel(document, 306, columnsY, 247, "NICHT ALS ROI MONETARISIERT", benefits, COLORS.accent);

  document.font(FONT_SEMIBOLD).fontSize(10).fillColor(COLORS.navy).text(
    "Wie groß ist der mögliche Ergebnisbereich?",
    42,
    columnsY + 174,
  );
  drawScenarioRange(document, economics.scenarios, columnsY + 197);
}

function drawCompactListPanel(
  document: PDFKit.PDFDocument,
  x: number,
  y: number,
  width: number,
  title: string,
  items: readonly string[],
  accent: string,
): void {
  document.save().roundedRect(x, y, width, 150, 11).fill(COLORS.lightMuted).restore();
  document.save().rect(x, y, width, 5).fill(accent).restore();
  document.font(FONT_SEMIBOLD).fontSize(7.2).fillColor(accent).text(title, x + 13, y + 18, {
    width: width - 26,
    characterSpacing: 0.8,
  });
  const visibleItems = items.slice(0, 5);
  visibleItems.forEach((item, index) => {
    const itemY = y + 47 + index * 19;
    document.save().circle(x + 16, itemY + 3, 2).fill(accent).restore();
    document.font(FONT_REGULAR).fontSize(6.7).fillColor(COLORS.text).text(item, x + 25, itemY - 1, {
      width: width - 38,
      height: 17,
      ellipsis: true,
    });
  });
  if (visibleItems.length === 0) {
    document.font(FONT_REGULAR).fontSize(6.8).fillColor(COLORS.muted).text(
      "Für diese Auswahl ist kein finanzieller Effekt hinterlegt.",
      x + 13,
      y + 55,
      { width: width - 26 },
    );
  }
}

function drawAssumptionColumn(
  document: PDFKit.PDFDocument,
  x: number,
  y: number,
  width: number,
  title: string,
  items: readonly { label: string; value: string }[],
  accent: string,
  height = 230,
): void {
  document.save().roundedRect(x, y, width, height, 11).fill(COLORS.lightMuted).restore();
  document.save().rect(x, y, width, 5).fill(accent).restore();
  document.font(FONT_SEMIBOLD).fontSize(7.5).fillColor(accent).text(title, x + 13, y + 19, {
    width: width - 26,
    characterSpacing: 1,
  });
  let itemY = y + 51;
  items.forEach((item) => {
    document.font(FONT_REGULAR).fontSize(6.8).fillColor(COLORS.muted).text(item.label, x + 13, itemY, {
      width: width - 26,
    });
    document.font(FONT_SEMIBOLD).fontSize(7.5).fillColor(COLORS.text).text(item.value, x + 13, itemY + 13, {
      width: width - 26,
      lineGap: 2,
    });
    const valueHeight = document.heightOfString(item.value, { width: width - 26, lineGap: 2 });
    const rowHeight = Math.max(43, valueHeight + 29);
    document
      .save()
      .strokeColor(COLORS.border)
      .lineWidth(0.5)
      .moveTo(x + 13, itemY + rowHeight - 5)
      .lineTo(x + width - 13, itemY + rowHeight - 5)
      .stroke()
      .restore();
    itemY += rowHeight;
  });
}

function getCustomerInputs(lead: ConfiguratorLeadPayload): { label: string; value: string }[] {
  const items = [
    { label: "Projektort", value: lead.installation.postalCode + " " + lead.installation.city },
    {
      label: "Ausgewählte Bereiche",
      value: lead.products.map((product) => PRODUCT_THEMES[product].label).join(", "),
    },
  ];
  const pv = getConfigurator(lead, "photovoltaic");
  if (pv?.type === "photovoltaic") {
    items.push({
      label: "Stromverbrauch",
      value: formatNumber(pv.answers.household.annualConsumptionKwh) + " kWh/Jahr",
    });
  }
  const heatPump = getConfigurator(lead, "heat_pump");
  if (heatPump?.type === "heat_pump") {
    items.push({
      label: "Heizsystem",
      value: heatPump.result.heatingComparisonLabel,
    });
    if (heatPump.answers.annualGasConsumptionKwh !== undefined) {
      items.push({
        label: "Gasverbrauch",
        value: formatNumber(heatPump.answers.annualGasConsumptionKwh) + " kWh/Jahr",
      });
    }
    if (heatPump.answers.annualOilConsumptionLitres !== undefined) {
      items.push({
        label: "Heizölverbrauch",
        value: formatNumber(heatPump.answers.annualOilConsumptionLitres) + " Liter/Jahr",
      });
    }
  }
  return items.slice(0, 8);
}

function drawAssumptionsPage(
  document: PDFKit.PDFDocument,
  lead: ConfiguratorLeadPayload,
): void {
  startPage(
    document,
    "Transparenz",
    "So haben wir gerechnet",
    "Nur entscheidungsrelevante Eingaben und Annahmen. Was erst vor Ort belastbar geklärt werden kann, bleibt ausdrücklich offen.",
  );
  const gap = 12;
  const width = (contentWidth(document) - gap) / 2;
  const assumptionPriority = [
    "electricity_price",
    "heating_comparison",
    "heating_fuel_price",
    "heating_efficiency",
    "oil_energy_content",
    "heating_comparison_basis",
    "storage_efficiency",
    "pv_degradation",
    "project_horizon",
    "price_growth",
    "feed_in",
  ];
  const modelItems = assumptionPriority
    .map((key) => lead.economics.assumptions.find((assumption) => assumption.key === key))
    .filter((assumption) => assumption !== undefined)
    .slice(0, 4)
    .map((assumption) => ({ label: assumption.label, value: assumption.value }));
  const checks = lead.products.map((product) => ({
    label: PRODUCT_THEMES[product].label,
    value: PRODUCT_CHECKS[product],
  }));
  drawAssumptionColumn(
    document,
    42,
    190,
    width,
    "DEINE ANGABEN",
    getCustomerInputs(lead).slice(0, 4),
    COLORS.primary,
  );
  drawAssumptionColumn(
    document,
    42 + width + gap,
    190,
    width,
    "MODELLANNAHMEN",
    modelItems,
    COLORS.accent,
  );
  const checksY = 438;
  document.save().roundedRect(42, checksY, contentWidth(document), 250, 11).fill(COLORS.lightMuted).restore();
  document.save().rect(42, checksY, contentWidth(document), 5).fill(COLORS.secondary).restore();
  document.font(FONT_SEMIBOLD).fontSize(7.5).fillColor(COLORS.secondary).text(
    "VOR ORT ZU PRÜFEN",
    56,
    checksY + 19,
    { characterSpacing: 1 },
  );
  checks.forEach((item, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const itemX = 58 + column * 247;
    const itemY = checksY + 53 + row * 61;
    document.font(FONT_SEMIBOLD).fontSize(7.5).fillColor(PRODUCT_THEMES[lead.products[index] ?? "photovoltaic"].accent).text(item.label, itemX, itemY, { width: 225 });
    document.font(FONT_REGULAR).fontSize(6.8).fillColor(COLORS.text).text(item.value, itemX, itemY + 16, { width: 225, lineGap: 2 });
  });
  document
    .font(FONT_REGULAR)
    .fontSize(7)
    .fillColor(COLORS.muted)
    .text(lead.economics.limitations.join(" · "), 42, 710, {
      width: 511,
      align: "center",
      lineGap: 2,
    });
}

function drawClosingPage(
  document: PDFKit.PDFDocument,
  lead: ConfiguratorLeadPayload,
): void {
  document.addPage();
  const pageWidth = document.page.width;
  imageCover(
    document,
    path.join(PDF_ASSET_ROOT, "closing-solar.jpg"),
    0,
    0,
    pageWidth,
    365,
    "center",
  );
  document.save().rect(0, 0, pageWidth, 365).fillOpacity(0.62).fill(COLORS.navy).restore();
  document.save().roundedRect(42, 30, 178, 52, 8).fillOpacity(0.94).fill(COLORS.white).restore();
  document.image(BRAND_LOGO_PATH, 56, 45, { width: 145 });
  document
    .font(FONT_BOLD)
    .fontSize(28)
    .fillColor(COLORS.white)
    .text("Der nächste Schritt zu\ndeinem Energieprojekt", 46, 142, {
      width: 485,
      lineGap: 5,
    });
  document
    .font(FONT_REGULAR)
    .fontSize(10)
    .fillColor("#DDECF7")
    .text("Deine Angaben bilden die Grundlage für die fachliche Einordnung.", 47, 241, {
      width: 430,
    });

  const steps = [
    {
      number: "01",
      title: "Angaben prüfen",
      text: "Wir betrachten deine Konfiguration und die ausgewählten Lösungen als gemeinsames Energieprojekt.",
    },
    {
      number: "02",
      title: "Vor-Ort-Begehung",
      text: "Wir prüfen die technischen Gegebenheiten direkt bei dir vor Ort.",
    },
    {
      number: "03",
      title: "Individuell planen",
      text: "Erst nach der Vor-Ort-Begehung und fachlichen Prüfung erstellen wir die belastbare Auslegung und ein konkretes Angebot.",
    },
  ];
  const gap = 12;
  const stepWidth = (pageWidth - 84 - gap * 2) / 3;
  steps.forEach((step, index) => {
    const x = 42 + index * (stepWidth + gap);
    document.font(FONT_BOLD).fontSize(20).fillColor(COLORS.accent).text(step.number, x, 407);
    document.font(FONT_SEMIBOLD).fontSize(9).fillColor(COLORS.navy).text(step.title, x, 441, {
      width: stepWidth,
    });
    document.font(FONT_REGULAR).fontSize(7.5).fillColor(COLORS.muted).text(step.text, x, 465, {
      width: stepWidth,
      lineGap: 3,
    });
  });
  document.save().roundedRect(42, 570, pageWidth - 84, 92, 12).fill(COLORS.surfaceBlue).restore();
  document.font(FONT_SEMIBOLD).fontSize(13).fillColor(COLORS.primary).text(
    "Energie-Kraft Süd",
    60,
    590,
  );
  document.font(FONT_REGULAR).fontSize(8.5).fillColor(COLORS.text).text(
    "energie-kraft.de  ·  " + lead.contact.firstName + ", deine Anfrage ist bei uns eingegangen.",
    60,
    620,
    { width: pageWidth - 120 },
  );
  document.font(FONT_REGULAR).fontSize(6.8).fillColor(COLORS.muted).text(
    "Die modellierten Projektpreise können vom späteren Angebot deutlich abweichen. Dachkonstruktion, Unterbau, Modulanzahl und -layout, Dachart, Leitungswege, Entfernung zur Verteilung, elektrische Infrastruktur, Gerätestandorte und projektspezifische Montagebedingungen werden erst vor Ort belastbar bewertet.",
    42,
    741,
    { width: pageWidth - 84, align: "center", lineGap: 2 },
  );
}

function addPageFooters(document: PDFKit.PDFDocument, publicReference: string): void {
  const range = document.bufferedPageRange();
  const totalPages = range.count;
  for (let index = 1; index < totalPages - 1; index += 1) {
    document.switchToPage(range.start + index);
    const originalBottomMargin = document.page.margins.bottom;
    document.page.margins.bottom = 0;
    const footerY = document.page.height - 27;
    document
      .save()
      .strokeColor(COLORS.border)
      .lineWidth(0.7)
      .moveTo(document.page.margins.left, footerY - 8)
      .lineTo(document.page.width - document.page.margins.right, footerY - 8)
      .stroke()
      .restore();
    document.font(FONT_REGULAR).fontSize(6.8).fillColor(COLORS.muted).text(
      `Energie-Kraft · Projekt: ${publicReference}`,
      document.page.margins.left,
      footerY,
      { lineBreak: false },
    );
    document.font(FONT_REGULAR).fontSize(6.8).fillColor(COLORS.muted).text(
      "Seite " + (index + 1) + " von " + totalPages,
      document.page.margins.left,
      footerY,
      { width: contentWidth(document), align: "right", lineBreak: false },
    );
    document.page.margins.bottom = originalBottomMargin;
  }
}

export async function generateConfiguratorProjectPdf(
  input: GenerateConfiguratorProjectPdfInput,
): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const document = new PDFDocument({
      size: "A4",
      margins: { top: 64, right: 42, bottom: 52, left: 42 },
      bufferPages: true,
      info: {
        Title: "Energie-Kraft – Persönliche Energieprojekt-Analyse",
        Author: "Energie-Kraft",
        Subject: "Persönliche Modellierung eines Energieprojekts",
        Creator: "Energie-Kraft Konfigurator",
      },
    });
    registerPdfFonts(document);
    const chunks: Buffer[] = [];
    document.on("data", (chunk: Buffer) => chunks.push(chunk));
    document.on("error", (error: Error) => reject(error));
    document.on("end", () => resolve(Buffer.concat(chunks)));

    drawCover(document, input.lead);
    drawExecutiveSummary(document, input.lead);
    drawEnergySystemPage(document, input.lead);
    input.lead.configurators.forEach((configurator) => drawProductPage(document, configurator));
    drawEconomicsPage(document, input.lead);
    drawAssumptionsPage(document, input.lead);
    drawClosingPage(document, input.lead);
    addPageFooters(document, input.leadId);
    document.end();
  });
}
