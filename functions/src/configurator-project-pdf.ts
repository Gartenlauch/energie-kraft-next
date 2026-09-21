import PDFDocument from "pdfkit";
import path from "node:path";
import { CONFIGURATOR_PRODUCT_ORDER } from "./configurator-product-order.ts";

import type { ConfiguratorLeadPayload, ConfiguratorPayload } from "./configurator-lead-validation.js";
import type { ComponentId } from "./configurator-project-economics.js";
import type { ConfiguratorSettings } from "./configurator-settings-model.js";

interface GenerateConfiguratorProjectPdfInput {
  leadId: string;
  lead: ConfiguratorLeadPayload;
  settings?: ConfiguratorSettings;
}

type ProductType = ConfiguratorPayload["type"];
export function getSolarPdfCopy(hasStorage: boolean) {
  return {
    investmentDetail: hasStorage ? "Photovoltaik + Stromspeicher" : "Photovoltaik",
    technicalIntro: hasStorage
      ? "Die Anlage erzeugt Strom. Der Speicher verschiebt einen Teil davon in Stunden mit höherem Bedarf."
      : "Die Photovoltaikanlage erzeugt Strom für dein Zuhause und die Einspeisung ins Netz.",
    flowIntro: hasStorage
      ? "Die Wege der Energie in einem modellierten Jahr – direkt im Haus, über den Speicher und im Austausch mit dem Netz."
      : "Die Wege der Energie in einem modellierten Jahr – direkt im Haus und im Austausch mit dem Netz.",
    assumptionKeys: ["electricity_price", "feed_in", "price_growth", "pv_degradation",
      ...(hasStorage ? ["storage_efficiency"] : []), "project_horizon"],
  };
}
type Section = "cover" | "project" | "flow" | "solar_system" | "solar_economics" |
  "cashflow" | "storage" | "heating" | "comfort" | "investment" | "assumptions" | "closing";

const ROOT = path.resolve(__dirname, "..");
const ASSET = path.join(ROOT, "assets");
const IMAGE = path.join(ASSET, "pdf");
// The PDF variant preserves the SVG artwork with transparent space below SÜD.
const LOGO = path.join(ASSET, "branding", "energie-kraft-logo-pdf.png");
const FONT = {
  regular: "Montserrat-Regular",
  semibold: "Montserrat-SemiBold",
  bold: "Montserrat-Bold",
} as const;
const COLOR = {
  blue: "#005CA9",
  cyan: "#0DA1D1",
  navy: "#091433",
  ink: "#182E4C",
  muted: "#5B687C",
  soft: "#E9EDF8",
  pale: "#EAF7FB",
  line: "#D4DCE9",
  white: "#FFFFFF",
  green: "#16856B",
  orange: "#B46823",
  violet: "#6A5AA8",
} as const;
const LABEL: Record<ProductType, string> = {
  photovoltaic: "Photovoltaik",
  battery_storage: "Stromspeicher",
  heat_pump: "Wärmepumpe",
  climate: "Klimaanlage",
  wallbox: "Wallbox",
};
const PRODUCT_COLOR: Record<ProductType, string> = {
  photovoltaic: COLOR.blue,
  battery_storage: COLOR.cyan,
  heat_pump: COLOR.green,
  climate: COLOR.orange,
  wallbox: COLOR.violet,
};
const BODY_BOTTOM = 782;
const LEFT = 42;
const WIDTH = 511;
const num = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });
const money0 = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const date = new Intl.DateTimeFormat("de-DE", { dateStyle: "long" });

function euro(value: number | null): string {
  return value === null ? "Nach technischer Prüfung" : money0.format(value);
}

function componentInvestment(lead: ConfiguratorLeadPayload, type: ComponentId): string {
  const item = component(lead, type);
  return item?.pricingMode === "individual_quote_required"
    ? "Individuelles Angebot erforderlich" : euro(item?.investmentBaseEuro ?? null);
}

function format(value: number, unit = ""): string {
  return `${num.format(value)}${unit}`;
}

function product<T extends ProductType>(lead: ConfiguratorLeadPayload, type: T):
  Extract<ConfiguratorPayload, { type: T }> | undefined {
  return lead.configurators.find((item) => item.type === type) as
    Extract<ConfiguratorPayload, { type: T }> | undefined;
}

function component(lead: ConfiguratorLeadPayload, type: ComponentId) {
  return lead.economics.components.find((item) => item.component === type);
}

function selectedCost(lead: ConfiguratorLeadPayload, types: readonly ComponentId[]): number | null {
  const selected = types.map((type) => component(lead, type)).filter((item) => item !== undefined);
  if (!selected.length || selected.some((item) => item.investmentBaseEuro === null)) return null;
  return selected.reduce((sum, item) => sum + item.investmentBaseEuro!, 0);
}

/** Pages are driven by available products and canonical cashflow, never by a fixed page count. */
export function getConfiguratorReportSections(lead: ConfiguratorLeadPayload): Section[] {
  const hasPv = Boolean(product(lead, "photovoltaic"));
  const hasStorage = Boolean(product(lead, "battery_storage"));
  const hasHeating = Boolean(product(lead, "heat_pump"));
  const hasComfort = Boolean(product(lead, "climate") || product(lead, "wallbox"));
  return [
    "cover", "project",
    ...(hasPv && lead.economics.solar ? ["flow"] as const : []),
    ...(hasPv || hasStorage ? ["solar_system"] as const : []),
    ...(hasPv && lead.economics.solar ? ["solar_economics"] as const : []),
    ...(hasPv && lead.economics.solar?.investmentEuro !== null && lead.economics.projections.length > 1
      ? ["cashflow"] as const : []),
    ...(hasPv && hasStorage && lead.economics.solar ? ["storage"] as const : []),
    ...(hasHeating ? ["heating"] as const : []),
    ...(hasComfort ? ["comfort"] as const : []),
    "investment", "assumptions", "closing",
  ];
}

/** Customer wording follows the canonical availability statuses. */
export function getSolarReturnDisplay(economics: ConfiguratorLeadPayload["economics"]) {
  const solar = economics.solar;
  if (!solar) return null;
  const missing = solar.paybackStatus === "unavailable_missing_investment";
  return {
    investment: euro(solar.investmentEuro),
    payback: missing ? null : solar.paybackStatus === "reached" && solar.paybackYears !== null
      ? `${format(solar.paybackYears)} Jahre` : "Im Zeitraum offen",
    irr: missing ? null : solar.irrStatus === "valid" && solar.annualizedReturnPercent !== null
      ? `${new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(solar.annualizedReturnPercent)} %`
      : "Nicht bestimmbar",
    horizonResult: missing ? null : euro(solar.netSurplus20YearsEuro),
    missingInvestment: missing,
  };
}

function registerFonts(doc: PDFKit.PDFDocument): void {
  doc.registerFont(FONT.regular, path.join(ASSET, "fonts", "Montserrat-Regular.ttf"));
  doc.registerFont(FONT.semibold, path.join(ASSET, "fonts", "Montserrat-SemiBold.ttf"));
  doc.registerFont(FONT.bold, path.join(ASSET, "fonts", "Montserrat-Bold.ttf"));
}

function text(
  doc: PDFKit.PDFDocument, value: string, x: number, y: number, width: number,
  size = 9, weight: keyof typeof FONT = "regular", color: string = COLOR.ink,
  lineGap = 2, align: "left" | "center" | "right" = "left",
): number {
  doc.font(FONT[weight]).fontSize(size).fillColor(color);
  const height = doc.heightOfString(value, { width, lineGap, align });
  if (y + height > BODY_BOTTOM) throw new Error(`PDF text exceeds content area: ${value.slice(0, 50)}`);
  doc.text(value, x, y, { width, lineGap, align });
  return y + height;
}

function eyebrow(doc: PDFKit.PDFDocument, value: string, x: number, y: number, width = WIDTH): number {
  return text(doc, value.toUpperCase(), x, y, width, 8, "semibold", COLOR.blue, 1);
}

function rule(doc: PDFKit.PDFDocument, y: number, x = LEFT, width = WIDTH, color: string = COLOR.line): void {
  doc.save().strokeColor(color).lineWidth(0.8).moveTo(x, y).lineTo(x + width, y).stroke().restore();
}

function rect(doc: PDFKit.PDFDocument, x: number, y: number, width: number, height: number, fill: string): void {
  doc.save().roundedRect(x, y, width, height, 9).fill(fill).restore();
}

function imageCover(doc: PDFKit.PDFDocument, filename: string, x: number, y: number,
  width: number, height: number, align?: "center" | "right",
  valign?: "center" | "bottom"): void {
  doc.save().rect(x, y, width, height).clip();
  doc.image(path.join(IMAGE, filename), x, y, {
    cover: [width, height],
    ...(align ? { align } : {}),
    ...(valign ? { valign } : {}),
  });
  doc.restore();
}

function page(doc: PDFKit.PDFDocument, section: string, title: string, subtitle?: string): number {
  doc.addPage();
  doc.image(LOGO, LEFT, 21, { width: 111 });
  text(doc, section.toUpperCase(), 325, 29, 228, 7, "semibold", COLOR.muted);
  rule(doc, 55);
  eyebrow(doc, section, LEFT, 76);
  let titleSize = 25;
  doc.font(FONT.bold);
  while (titleSize > 18) {
    doc.fontSize(titleSize);
    if (doc.heightOfString(title, { width: WIDTH, lineGap: 1 }) <= titleSize * 1.7) break;
    titleSize -= 1;
  }
  const titleBottom = text(doc, title, LEFT, 97, WIDTH, titleSize, "bold", COLOR.navy, 1);
  const subtitleBottom = subtitle
    ? text(doc, subtitle, LEFT, titleBottom + 9, WIDTH, 9.5, "regular", COLOR.muted, 3)
    : titleBottom;
  return Math.max(178, subtitleBottom + 23);
}

function photoWithTint(doc: PDFKit.PDFDocument, filename: string, height: number): void {
  imageCover(doc, filename, 0, 0, doc.page.width, height);
  doc.save().rect(0, 0, doc.page.width, height).fillOpacity(0.66).fill(COLOR.navy).restore();
  doc.save().rect(0, 0, 10, height).fill(COLOR.cyan).restore();
  rect(doc, 42, 30, 180, 53, COLOR.white);
  doc.image(LOGO, 56, 45, { width: 145 });
}

function valueLine(doc: PDFKit.PDFDocument, label: string, value: string, y: number, options?: {
  color?: string; valueSize?: number; x?: number; width?: number;
}): number {
  const x = options?.x ?? LEFT;
  const width = options?.width ?? WIDTH;
  eyebrow(doc, label, x, y, width);
  const bottom = text(doc, value, x, y + 17, width, options?.valueSize ?? 18,
    "bold", options?.color ?? COLOR.navy, 1);
  return bottom;
}

function systemSymbol(doc: PDFKit.PDFDocument, type: ProductType | "home" | "grid",
  cx: number, cy: number, size: number, color: string): void {
  const half = size / 2;
  doc.save().strokeColor(color).fillColor(color).lineWidth(Math.max(1.5, size / 25))
    .lineCap("round").lineJoin("round");
  switch (type) {
    case "photovoltaic":
      doc.rect(cx - half * 0.76, cy - half * 0.38, size * 0.76, size * 0.48).stroke();
      doc.moveTo(cx - half * 0.38, cy - half * 0.38).lineTo(cx - half * 0.38, cy + half * 0.58).stroke();
      doc.moveTo(cx - half * 0.76, cy + half * 0.1).lineTo(cx + half * 0.76, cy + half * 0.1).stroke();
      doc.circle(cx + half * 0.68, cy - half * 0.65, size * 0.085).stroke();
      break;
    case "battery_storage":
      doc.roundedRect(cx - half * 0.53, cy - half * 0.69, size * 0.53, size * 0.68, size * 0.07).stroke();
      doc.moveTo(cx - half * 0.2, cy - half * 0.82).lineTo(cx + half * 0.2, cy - half * 0.82).stroke();
      doc.moveTo(cx - half * 0.25, cy - half * 0.16).lineTo(cx + half * 0.25, cy - half * 0.16).stroke();
      doc.moveTo(cx - half * 0.25, cy + half * 0.12).lineTo(cx + half * 0.25, cy + half * 0.12).stroke();
      break;
    case "heat_pump":
      doc.roundedRect(cx - half * 0.72, cy - half * 0.72, size * 0.72, size * 0.72, size * 0.08).stroke();
      doc.circle(cx, cy, size * 0.19).stroke();
      for (let index = 0; index < 3; index += 1) {
        const angle = index * Math.PI * 2 / 3;
        doc.moveTo(cx + Math.cos(angle) * size * 0.09, cy + Math.sin(angle) * size * 0.09)
          .lineTo(cx + Math.cos(angle + 0.55) * size * 0.2, cy + Math.sin(angle + 0.55) * size * 0.2).stroke();
      }
      break;
    case "climate":
      doc.roundedRect(cx - half * 0.74, cy - half * 0.55,
        size * 0.74, size * 0.43, size * 0.08).stroke();
      doc.moveTo(cx - half * 0.52, cy - half * 0.09)
        .lineTo(cx + half * 0.52, cy - half * 0.09).stroke();
      doc.moveTo(cx - half * 0.38, cy + half * 0.42)
        .lineTo(cx - half * 0.38, cy + half * 0.7)
        .moveTo(cx, cy + half * 0.42).lineTo(cx, cy + half * 0.7)
        .moveTo(cx + half * 0.38, cy + half * 0.42)
        .lineTo(cx + half * 0.38, cy + half * 0.7).stroke();
      break;
    case "wallbox":
      doc.roundedRect(cx - half * 0.46, cy - half * 0.71,
        size * 0.46, size * 0.65, size * 0.07).stroke();
      doc.circle(cx, cy - half * 0.35, size * 0.06).stroke();
      doc.moveTo(cx + half * 0.46, cy + half * 0.12)
        .bezierCurveTo(cx + half * 0.78, cy + half * 0.12,
          cx + half * 0.73, cy + half * 0.6, cx + half * 0.51, cy + half * 0.6).stroke();
      break;
    case "home":
      doc.moveTo(cx - half * 0.88, cy - half * 0.05).lineTo(cx, cy - half * 0.77)
        .lineTo(cx + half * 0.88, cy - half * 0.05).stroke();
      doc.rect(cx - half * 0.67, cy - half * 0.03, size * 0.67, size * 0.49).stroke();
      doc.rect(cx - half * 0.16, cy + half * 0.47, size * 0.16, size * 0.21).stroke();
      doc.rect(cx - half * 0.46, cy + half * 0.16, size * 0.15, size * 0.14).stroke();
      break;
    case "grid":
      doc.moveTo(cx, cy - half * 0.83).lineTo(cx - half * 0.54, cy + half * 0.78)
        .moveTo(cx, cy - half * 0.83).lineTo(cx + half * 0.54, cy + half * 0.78).stroke();
      doc.moveTo(cx - half * 0.68, cy - half * 0.4).lineTo(cx + half * 0.68, cy - half * 0.4)
        .moveTo(cx - half * 0.53, cy - half * 0.02).lineTo(cx + half * 0.53, cy - half * 0.02)
        .moveTo(cx - half * 0.35, cy + half * 0.42).lineTo(cx + half * 0.35, cy + half * 0.42).stroke();
      break;
  }
  doc.restore();
}

function drawCover(doc: PDFKit.PDFDocument, lead: ConfiguratorLeadPayload): void {
  photoWithTint(doc, "cover-home.jpg", 450);
  doc.save().rect(0, 450, doc.page.width, doc.page.height - 450).fill("#F8FAFD").restore();
  text(doc, "Deine persönliche\nEnergieprojekt-Analyse", 48, 147, 485, 31, "bold", COLOR.white, 5);
  text(doc, "Individuell geplant auf Basis deiner Angaben", 50, 255, 430, 11,
    "regular", "#DDECF7");
  text(doc, `${lead.contact.firstName} ${lead.contact.lastName}`, 50, 348, 365, 15,
    "semibold", COLOR.white);
  text(doc, `${lead.installation.postalCode} ${lead.installation.city}`, 50, 376, 280, 9,
    "regular", "#DDECF7");
  text(doc, date.format(new Date()), 50, 397, 280, 9, "regular", "#DDECF7");
  eyebrow(doc, "Dein Energiesystem", LEFT, 480);
  const order: readonly ProductType[] = CONFIGURATOR_PRODUCT_ORDER;
  const selected = order.filter((item) => lead.products.includes(item));
  const step = WIDTH / selected.length;
  const first = LEFT + step / 2;
  const last = LEFT + WIDTH - step / 2;
  if (selected.length > 1) rule(doc, 576, first, last - first, COLOR.line);
  selected.forEach((item, index) => {
    const center = first + index * step;
    systemSymbol(doc, item, center, 535, 35, PRODUCT_COLOR[item]);
    doc.save().circle(center, 576, 3).fill(PRODUCT_COLOR[item]).restore();
    text(doc, LABEL[item], center - step / 2, 593, step, 8.5,
      "semibold", COLOR.navy, 1, "center");
  });
  text(doc, "Gemeinsam gedacht. Individuell geplant.", LEFT, 658, WIDTH, 10,
    "semibold", COLOR.blue);
  text(doc,
    "Diese Analyse ist eine unverbindliche Projekt- und Kostenorientierung. Die technische Auslegung und das konkrete Angebot folgen nach fachlicher Prüfung vor Ort.",
    LEFT, 716, WIDTH, 8, "regular", COLOR.muted, 3);
}

function drawProject(doc: PDFKit.PDFDocument, lead: ConfiguratorLeadPayload): void {
  page(doc, "Überblick", "Dein Energieprojekt",
    "Die ausgewählten Lösungen bilden ein gemeinsames Projekt – mit unterschiedlichen Aufgaben und Kosten.");
  const eco = lead.economics;
  const totalText = eco.investmentBaseEuro === null
    ? "Noch nicht vollständig bezifferbar" : euro(eco.investmentBaseEuro);
  imageCover(doc, "project-home.jpg", LEFT, 183, WIDTH, 172, undefined, "bottom");
  doc.save().rect(LEFT, 183, WIDTH, 172).fillOpacity(0.73).fill(COLOR.navy).restore();
  doc.save().rect(LEFT, 183, 4, 172).fill(COLOR.cyan).restore();
  text(doc, "GESAMTINVESTITION", LEFT + 23, 214, 400, 8, "semibold", "#C7E8F7");
  text(doc, totalText, LEFT + 22, 241, WIDTH - 46, eco.investmentBaseEuro === null ? 20 : 35,
    "bold", COLOR.white);
  if (eco.investmentBaseEuro === null) {
    text(doc, eco.pricingMode === "individual_quote_required"
      ? "Für einzelne Komponenten ist ein individuelles Angebot erforderlich."
      : "Für einzelne Komponenten ist eine technische Preisprüfung nötig.", LEFT + 23, 303,
      WIDTH - 46, 9, "regular", COLOR.white);
  }
  const groupY = 388;
  const allGroups: { label: string; detail: string; types: ComponentId[]; value: number | null }[] = [
    {
      label: "Solarinvestition", detail: getSolarPdfCopy(Boolean(product(lead, "battery_storage"))).investmentDetail,
      types: ["photovoltaic", "battery_storage"],
      value: product(lead, "photovoltaic")
        ? (eco.solar?.investmentEuro ?? null)
        : selectedCost(lead, ["battery_storage"]),
    },
    {
      label: "Wärmepumpe", detail: "Wärmeversorgung",
      types: ["heat_pump"], value: selectedCost(lead, ["heat_pump"]),
    },
    {
      label: "Komfort & Lebensqualität", detail: getComfortPdfCopy(
        Boolean(product(lead, "climate")), Boolean(product(lead, "wallbox"))).overviewLabel,
      types: ["climate", "wallbox"], value: selectedCost(lead, ["climate", "wallbox"]),
    },
  ];
  const groups = allGroups.filter((group) => group.types.some((type) => component(lead, type)));
  groups.forEach((group, index) => {
    const rowY = groupY + index * 69;
    doc.save().rect(LEFT, rowY + 4, 3, 38).fill(index === 0 ? COLOR.blue : index === 1 ? COLOR.green : COLOR.cyan).restore();
    eyebrow(doc, group.label, LEFT + 12, rowY, 280);
    text(doc, group.detail, LEFT + 12, rowY + 19, 280, 9, "regular", COLOR.muted);
    text(doc, group.value === null && eco.pricingMode === "individual_quote_required"
      ? "Individuelles Angebot erforderlich" : euro(group.value),
      343, rowY + 7, 210, group.value === null ? 11 : 18,
      "semibold", COLOR.navy);
    rule(doc, rowY + 55);
  });
  const highlightY = groupY + groups.length * 69 + 18;
  eyebrow(doc, "Auf einen Blick", LEFT, highlightY);
  const pv = product(lead, "photovoltaic");
  const highlights = [
    ...(pv && pv.result.pricingMode === "modeled"
      ? [{ label: "PV-Jahresertrag", value: `${format(pv.result.estimatedAnnualYieldKwhMin)}–${format(pv.result.estimatedAnnualYieldKwhMax)} kWh` }] : []),
    ...(eco.solar ? [{ label: "Solarvorteil im ersten Jahr", value: euro(eco.solar.firstYearNetBenefitEuro) }] : []),
    ...(eco.heating?.annualSavingEuro !== null && eco.heating ? [{ label: "Heizkostenersparnis pro Jahr", value: euro(eco.heating.annualSavingEuro) }] : []),
  ];
  highlights.slice(0, 3).forEach((item, index) => {
    const rowY = highlightY + 27 + index * 33;
    text(doc, item.label, LEFT, rowY, 270, 9, "regular", COLOR.muted);
    text(doc, item.value, 317, rowY - 1, 236, 13, "semibold", COLOR.blue);
  });
}

function arrow(doc: PDFKit.PDFDocument, x1: number, y1: number, x2: number, y2: number,
  color: string, dashed = false): void {
  const length = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / length;
  const uy = (y2 - y1) / length;
  const arrowLength = 12;
  const baseX = x2 - ux * arrowLength;
  const baseY = y2 - uy * arrowLength;
  const normalX = -uy * 6;
  const normalY = ux * 6;
  // End the stem inside the wide part of the triangle, never at its narrow tip.
  const stemX = baseX + ux;
  const stemY = baseY + uy;
  doc.save().strokeColor(color).fillColor(color).lineWidth(3.2).lineCap("butt");
  if (dashed) {
    const joinX = baseX - ux * 5;
    const joinY = baseY - uy * 5;
    doc.dash(6, { space: 5 }).moveTo(x1, y1).lineTo(joinX, joinY).stroke().undash();
    doc.moveTo(joinX, joinY).lineTo(stemX, stemY).stroke();
  } else {
    doc.moveTo(x1, y1).lineTo(stemX, stemY).stroke();
  }
  doc.moveTo(x2, y2)
    .lineTo(baseX + normalX, baseY + normalY)
    .lineTo(baseX - normalX, baseY - normalY)
    .closePath().fill().restore();
}

function flowNode(doc: PDFKit.PDFDocument, cx: number, cy: number, radius: number,
  title: string, value: string, color: string, icon: ProductType | "home" | "grid",
  labelY: number, labelWidth: number, centerCaption = false): void {
  doc.save().circle(cx, cy, radius).fill(icon === "home" ? "#E9F4FA" : "#F1F6FA").restore();
  systemSymbol(doc, icon, cx, cy, radius * (icon === "home" ? 1.1 : 1.18), color);
  const labelX = cx - labelWidth / 2;
  const align = centerCaption ? "center" : "left";
  text(doc, title, labelX, labelY, labelWidth, 9.5, "semibold", COLOR.navy, 1, align);
  text(doc, value, labelX, labelY + 19, labelWidth, 8.5, "regular", color, 1, align);
}

function flowValue(doc: PDFKit.PDFDocument, label: string, value: number, x: number, y: number,
  width: number, color: string): void {
  text(doc, label, x, y, width, 7.5, "semibold", COLOR.muted, 0);
  text(doc, `${format(value)} kWh/a`, x, y + 16, width, 9.5, "bold", color, 0);
}

function drawEnergyFlow(doc: PDFKit.PDFDocument, lead: ConfiguratorLeadPayload): void {
  const solar = lead.economics.solar;
  if (!solar) return;
  const storage = Boolean(product(lead, "battery_storage"));
  page(doc, "Energiefluss", "So nutzt du deinen Solarstrom", getSolarPdfCopy(storage).flowIntro);
  const flow = solar.withStorage;
  // Paths are drawn first and each is a single vector segment with an attached arrowhead.
  arrow(doc, 297, 314, 297, 405, COLOR.blue);
  if (storage) {
    arrow(doc, 255, 314, 137, 434, COLOR.cyan);
    arrow(doc, 158, 475, 229, 475, COLOR.cyan);
  }
  arrow(doc, 339, 314, 458, 433, COLOR.green);
  arrow(doc, 437, 475, 366, 475, COLOR.muted, true);
  flowNode(doc, 297, 235, 41, "Solaranlage", `${format(flow.generationKwh)} kWh/a`,
    COLOR.blue, "photovoltaic", 278, 154, true);
  flowNode(doc, 297, 475, 65, "Dein Zuhause", `Strombedarf ${format(flow.demandKwh)} kWh/a`,
    COLOR.navy, "home", 545, 155);
  if (storage) flowNode(doc, 112, 475, 43, "Stromspeicher",
    `${format(solar.storageUsableCapacityKwh)} kWh`, COLOR.cyan, "battery_storage", 521, 132);
  flowNode(doc, 483, 475, 43, "Stromnetz", "Bezug & Einspeisung", COLOR.muted,
    "grid", 521, 139);
  flowValue(doc, "Direktverbrauch", flow.directUseKwh, 310, 350, 122, COLOR.blue);
  if (storage) {
    flowValue(doc, "Speicherladung", flow.storageChargeKwh, 82, 350, 118, COLOR.cyan);
    flowValue(doc, "Aus Speicher", flow.storageDeliveredKwh, 158, 420, 106, COLOR.cyan);
  }
  flowValue(doc, "Einspeisung", flow.feedInKwh, 420, 350, 112, COLOR.green);
  flowValue(doc, "Netzbezug", flow.gridPurchaseKwh, 332, 420, 106, COLOR.muted);
  if (storage) text(doc, `Speicherverluste: ${format(flow.storageLossesKwh)} kWh/a`, 42, 611,
    215, 7.5, "regular", COLOR.muted);
  rule(doc, 642);
  valueLine(doc, "Eigenverbrauch", format(flow.selfConsumptionPercent, " %"), 657,
    { x: LEFT, width: 225, color: COLOR.blue, valueSize: 23 });
  valueLine(doc, "Autarkie", format(flow.autarkyPercent, " %"), 657,
    { x: 327, width: 226, color: COLOR.navy, valueSize: 23 });
  text(doc, "Modellierte Jahresbetrachtung – keine stündliche Lastgangsimulation.",
    LEFT, 737, WIDTH, 8, "regular", COLOR.muted);
}

function drawSolarSystem(doc: PDFKit.PDFDocument, lead: ConfiguratorLeadPayload,
  settings?: ConfiguratorSettings): void {
  const pv = product(lead, "photovoltaic");
  const storage = product(lead, "battery_storage");
  const solar = lead.economics.solar;
  page(doc, "Technik", "Dein Solarsystem", getSolarPdfCopy(Boolean(storage)).technicalIntro);
  if (pv) {
    imageCover(doc, "photovoltaic.jpg", LEFT, 195, 234, storage ? 211 : 279, "right");
    eyebrow(doc, "Photovoltaik", 297, 202, 256);
    text(doc, pv.result.pricingMode === "individual_quote_required" && settings
      ? `Größer als ${format(settings.photovoltaic.pricing.maxModeledSize)} kWp`
      : `${format(pv.result.recommendedPowerKwpMin)}${pv.result.recommendedPowerKwpMin === pv.result.recommendedPowerKwpMax ? "" : `–${format(pv.result.recommendedPowerKwpMax)}`} kWp`,
      297, 226, 256, 21, "bold", COLOR.navy);
    text(doc, "Empfohlene Anlagenleistung", 297, 258, 256, 8.5, "regular", COLOR.muted);
    valueLine(doc, "PV-Jahresertrag",
      pv.result.pricingMode === "individual_quote_required"
        ? "Nach individueller Auslegung"
        : `${format(pv.result.estimatedAnnualYieldKwhMin)}–${format(pv.result.estimatedAnnualYieldKwhMax)} kWh`,
      291, { x: 297, width: 256, valueSize: 13 });
    valueLine(doc, "PV-Investition", componentInvestment(lead, "photovoltaic"),
      349, { x: 297, width: 256, valueSize: 13 });
  }
  if (storage) {
    const rowY = pv ? 430 : 195;
    imageCover(doc, "battery-storage.jpg", LEFT, rowY, 234, pv ? 203 : 279);
    eyebrow(doc, "Stromspeicher", 297, rowY + 7, 256);
    text(doc,
      storage.result.pricingMode === "individual_quote_required" && settings
        ? `Größer als ${format(settings.batteryStorage.pricing.maxModeledSize)} kWh`
        : `${format(storage.result.recommendedUsableCapacityKwhMin)}${storage.result.recommendedUsableCapacityKwhMin === storage.result.recommendedUsableCapacityKwhMax ? "" : `–${format(storage.result.recommendedUsableCapacityKwhMax)}`} kWh`,
      297, rowY + 31, 256, 21, "bold", COLOR.navy);
    text(doc, "Nutzbare Speicherkapazität", 297, rowY + 63, 256, 8.5, "regular", COLOR.muted);
    valueLine(doc, "Speicherinvestition", componentInvestment(lead, "battery_storage"),
      rowY + 92, { x: 297, width: 256, valueSize: 13 });
    if (solar) {
      text(doc, `Eigenverbrauch ${format(solar.withStorage.selfConsumptionPercent, " %")}  ·  Autarkie ${format(solar.withStorage.autarkyPercent, " %")}`,
        297, rowY + 151, 256, 9, "semibold", COLOR.blue);
    }
  }
  const checkY = storage && pv ? 661 : 530;
  rule(doc, checkY);
  eyebrow(doc, "Vor Ort gemeinsam prüfen", LEFT, checkY + 19);
  const check = pv && storage
    ? "Dach und Verschattung · Elektroinstallation und Netzanschluss · Wechselrichter · Speicherstandort und Ersatzstromkonzept"
    : pv
      ? "Dach und Verschattung · Elektroinstallation und Netzanschluss · Modulanordnung"
      : "PV-Anbindung · Wechselrichter · Aufstellort · Ersatzstromkonzept";
  text(doc, check, LEFT, checkY + 42, WIDTH, 9, "regular", COLOR.ink, 3);
  if (solar) text(doc, "Die Werte beschreiben ein Jahresmodell. Die tatsächliche Auslegung folgt nach technischer Prüfung.",
    LEFT, checkY + 87, WIDTH, 8.5, "regular", COLOR.muted);
}

function drawSolarEconomics(doc: PDFKit.PDFDocument, lead: ConfiguratorLeadPayload): void {
  const solar = lead.economics.solar;
  if (!solar) return;
  const display = getSolarReturnDisplay(lead.economics)!;
  page(doc, "Solarwirtschaftlichkeit", "So rechnet sich deine Solaranlage",
    product(lead, "battery_storage")
      ? "Photovoltaik und Speicher werden als eine Solarinvestition betrachtet."
      : "Die Solaranlage wird über ihre Investition und ihre jährlichen Stromvorteile betrachtet.");
  const leftX = LEFT;
  const rightX = 319;
  const rightWidth = LEFT + WIDTH - rightX;
  eyebrow(doc, "Solarinvestition", leftX, 193);
  text(doc, display.investment, leftX, 216, 275,
    solar.investmentEuro === null ? 18 : 29, "bold", COLOR.navy);
  eyebrow(doc, "Finanzieller Vorteil · Jahr 1", rightX, 193, rightWidth);
  text(doc, euro(solar.firstYearNetBenefitEuro), rightX, 216, rightWidth, 19, "bold", COLOR.blue);
  rule(doc, 281);
  if (display.missingInvestment) {
    eyebrow(doc, "Wirtschaftlichkeit", LEFT, 306);
    text(doc, "Sobald die Investition technisch geklärt ist", LEFT, 332, WIDTH, 19,
      "semibold", COLOR.navy);
    text(doc,
      "Für eine belastbare Wirtschaftlichkeitsrechnung muss die Investition zunächst technisch konkretisiert werden. Amortisation, Rendite und Ergebnis nach dem Betrachtungszeitraum bleiben bis dahin offen.",
      LEFT, 373, WIDTH, 10, "regular", COLOR.ink, 4);
  } else {
    eyebrow(doc, "Amortisation", leftX, 308, 252);
    text(doc, display.payback!, leftX, 332, 252,
      solar.paybackYears === null ? 16 : 29, "bold", COLOR.navy);
    eyebrow(doc, "Modellierte Rendite p. a.", rightX, 308, rightWidth);
    text(doc, display.irr!, rightX, 332, rightWidth, solar.annualizedReturnPercent === null ? 16 : 29,
      "bold", COLOR.blue);
    rule(doc, 408);
    valueLine(doc, `Ergebnis nach ${lead.economics.horizonYears} Jahren`,
      display.horizonResult!, 429, { valueSize: 22, color: COLOR.navy });
  }
  const compositionY = solar.paybackStatus === "unavailable_missing_investment" ? 500 : 508;
  eyebrow(doc, "So entsteht dein finanzieller Vorteil", LEFT, compositionY);
  const year = solar.annualCashflows[1];
  if (!year) return;
  const rows = [
    { label: "Direkt genutzter Solarstrom", value: year.electricityCostSavingsEuro },
    ...(product(lead, "battery_storage")
      ? [{ label: "Stromkostenersparnis durch Speicherentladung", value: year.storageAdditionalBenefitEuro }] : []),
    { label: "Einspeisung ins Netz", value: year.feedInRevenueEuro },
    { label: "Betriebskosten", value: -year.operatingCostsEuro },
  ];
  rows.forEach((row, index) => {
    const rowY = compositionY + 32 + index * 34;
    text(doc, row.label, LEFT, rowY, 342, 9, "regular", COLOR.ink);
    text(doc, `${row.value >= 0 ? "+" : "−"} ${euro(Math.abs(row.value))}`,
      399, rowY - 2, 154, 10, "semibold", row.value >= 0 ? COLOR.blue : COLOR.muted);
    rule(doc, rowY + 24);
  });
  const totalY = compositionY + 32 + rows.length * 34 + 11;
  text(doc, "Finanzieller Vorteil im ersten Jahr", LEFT, totalY, 339, 10, "semibold", COLOR.navy);
  text(doc, euro(solar.firstYearNetBenefitEuro), 399, totalY - 2, 154, 12,
    "bold", COLOR.blue);
  text(doc, "Einzelwerte gerundet. Die Summe wird aus den ungerundeten Modellwerten berechnet.",
    LEFT, totalY + 27, WIDTH, 7.2, "regular", COLOR.muted, 1);
  if (product(lead, "battery_storage")) {
    text(doc,
      "Der Speicherwert berücksichtigt geringeren Netzbezug, Speicherverluste und die entgangene Einspeisung. Strom wird nicht doppelt gezählt.",
      LEFT, totalY + 48, WIDTH, 8, "regular", COLOR.muted, 2);
  }
}

function niceTickStep(approximate: number): number {
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(approximate, 1)));
  const normalized = approximate / magnitude;
  const factor = [1, 2, 2.5, 5, 10].find((candidate) => candidate >= normalized) ?? 10;
  return factor * magnitude;
}

function drawCashflow(doc: PDFKit.PDFDocument, lead: ConfiguratorLeadPayload): void {
  const points = lead.economics.projections;
  const solar = lead.economics.solar;
  if (!solar || solar.investmentEuro === null || points.length < 2) return;
  page(doc, "Solarinvestition", "Entwicklung deiner Solarinvestition",
    "Die Linie zeigt den kumulierten Geldwert deiner Solaranlage über den modellierten Zeitraum.");
  const chart = { x: LEFT, width: WIDTH };
  const plot = { x: chart.x + 82, y: 235, width: chart.width - 108, height: 346 };
  const values = points.map((point) => point.cumulativeCashFlowEuro);
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const step = niceTickStep((max - min) / 5);
  const lower = Math.floor(min / step) * step - (min === max ? step : 0);
  const upper = Math.ceil(max / step) * step + (min === max ? step : 0);
  const xAt = (year: number) => plot.x + year / lead.economics.horizonYears * plot.width;
  const yAt = (value: number) => plot.y + (upper - value) / (upper - lower) * plot.height;
  const zeroY = yAt(0);
  for (let value = lower; value <= upper; value += step) {
    const y = yAt(value);
    doc.save().strokeColor(value === 0 ? COLOR.navy : "#E8EDF4")
      .lineWidth(value === 0 ? 1.4 : 0.7)
      .moveTo(plot.x, y).lineTo(plot.x + plot.width, y).stroke().restore();
    text(doc, euro(value), chart.x, y - 6, plot.x - chart.x - 10, 7,
      value === 0 ? "semibold" : "regular", value === 0 ? COLOR.navy : COLOR.muted, 0, "right");
  }
  for (let year = 0; year <= lead.economics.horizonYears; year += 5) {
    const x = xAt(year);
    doc.save().strokeColor(COLOR.line).lineWidth(0.8)
      .moveTo(x, plot.y + plot.height).lineTo(x, plot.y + plot.height + 5).stroke().restore();
    text(doc, `${year}`, x - 12, plot.y + plot.height + 11, 26, 8,
      "regular", COLOR.muted, 0);
  }
  doc.save().fillColor(COLOR.pale).fillOpacity(0.38).moveTo(xAt(points[0]!.year), zeroY);
  points.forEach((point) => doc.lineTo(xAt(point.year), yAt(point.cumulativeCashFlowEuro)));
  doc.lineTo(xAt(points[points.length - 1]!.year), zeroY).closePath().fill().restore();
  doc.save().strokeColor(COLOR.blue).lineWidth(3).moveTo(xAt(points[0]!.year), yAt(values[0]!));
  points.slice(1).forEach((point) => doc.lineTo(xAt(point.year), yAt(point.cumulativeCashFlowEuro)));
  doc.stroke().restore();
  const start = points[0]!;
  const end = points[points.length - 1]!;
  doc.save().circle(xAt(start.year), yAt(start.cumulativeCashFlowEuro), 5).fill(COLOR.blue).restore();
  doc.save().circle(xAt(end.year), yAt(end.cumulativeCashFlowEuro), 6).fill(COLOR.blue).restore();
  text(doc, `Start: ${euro(start.cumulativeCashFlowEuro)}`, plot.x + 3, plot.y + plot.height + 40,
    212, 9, "semibold", COLOR.navy);
  text(doc, `Jahr ${end.year}: ${euro(end.cumulativeCashFlowEuro)}`, plot.x + 218,
    plot.y + plot.height + 40, 210, 9, "semibold", COLOR.blue);
  if (solar.paybackStatus === "reached" && solar.paybackYears !== null) {
    const crossingX = xAt(solar.paybackYears);
    doc.save().strokeColor(COLOR.green).dash(3, { space: 4 }).lineWidth(1.2)
      .moveTo(crossingX, zeroY).lineTo(crossingX, plot.y + plot.height).stroke().undash().restore();
    doc.save().circle(crossingX, zeroY, 7).lineWidth(2.7)
      .fillAndStroke(COLOR.white, COLOR.green).restore();
    text(doc, `Amortisation nach ${format(solar.paybackYears)} Jahren`, LEFT, 661,
      WIDTH, 14, "semibold", COLOR.navy);
    text(doc,
      "Ab diesem Zeitpunkt ist die Anfangsinvestition im Modell rechnerisch zurückverdient.",
      LEFT, 689, WIDTH, 9, "regular", COLOR.muted);
  } else {
    text(doc, "Die Amortisation liegt außerhalb des betrachteten Zeitraums.", LEFT, 663,
      WIDTH, 10, "regular", COLOR.ink);
  }
  const milestones = [1, 5, 10, 15, lead.economics.horizonYears]
    .filter((year, index, array) => year <= lead.economics.horizonYears && array.indexOf(year) === index);
  text(doc,
    milestones.map((year) => `Jahr ${year}: ${euro(points.find((point) => point.year === year)?.cumulativeCashFlowEuro ?? null)}`).join("   ·   "),
    LEFT, 741, WIDTH, 7.5, "regular", COLOR.muted, 1);
}

function comparisonBar(doc: PDFKit.PDFDocument, label: string, before: number, after: number,
  unit: string, max: number, y: number, positiveIncrease: boolean,
  reductionLabel?: string): void {
  text(doc, label, LEFT, y, WIDTH, 10, "semibold", COLOR.navy);
  const barX = 175;
  const barWidth = 260;
  const scale = Math.max(max, before, after, 1);
  const beforeWidth = before / scale * barWidth;
  const afterWidth = after / scale * barWidth;
  text(doc, "Ohne", LEFT, y + 27, 55, 8, "regular", COLOR.muted);
  text(doc, "Mit", LEFT, y + 51, 55, 8, "regular", COLOR.muted);
  doc.save().roundedRect(barX, y + 26, Math.max(2, beforeWidth), 11, 4).fill(COLOR.soft).restore();
  doc.save().roundedRect(barX, y + 50, Math.max(2, afterWidth), 11, 4).fill(COLOR.blue).restore();
  text(doc, `${format(before)}${unit}`, 445, y + 23, 108, 8.5, "semibold", COLOR.muted);
  text(doc, `${format(after)}${unit}`, 445, y + 47, 108, 8.5, "semibold", COLOR.blue);
  const delta = after - before;
  const helpful = positiveIncrease ? delta >= 0 : delta <= 0;
  const difference = reductionLabel && delta < 0
    ? `${format(Math.abs(delta))}${unit} weniger ${reductionLabel}`
    : `${delta >= 0 ? "+" : "−"}${format(Math.abs(delta))}${unit}`;
  text(doc, difference, reductionLabel ? 350 : 445, y + 72,
    reductionLabel ? 203 : 108, 8, "semibold",
    reductionLabel === "Einspeisung" ? COLOR.muted : helpful ? COLOR.green : COLOR.muted);
}

function drawStorageComparison(doc: PDFKit.PDFDocument, lead: ConfiguratorLeadPayload): void {
  const solar = lead.economics.solar;
  if (!solar) return;
  page(doc, "Stromspeicher", "Was verändert der Stromspeicher?",
    "Verglichen wird dieselbe Photovoltaikanlage – einmal ohne und einmal mit Speicher.");
  const before = solar.withoutStorage;
  const after = solar.withStorage;
  rect(doc, LEFT, 190, WIDTH, 83, COLOR.pale);
  text(doc, "Mehr eigenen Solarstrom selbst nutzen", 58, 206, WIDTH - 32, 17,
    "bold", COLOR.navy);
  text(doc, "Der Speicher verschiebt Solarüberschüsse in Zeiten, in denen du sie brauchst.",
    58, 238, WIDTH - 32, 9, "regular", COLOR.ink);
  comparisonBar(doc, "Eigenverbrauch", before.selfConsumptionPercent,
    after.selfConsumptionPercent, " %", 100, 296, true);
  comparisonBar(doc, "Autarkie", before.autarkyPercent,
    after.autarkyPercent, " %", 100, 402, true);
  comparisonBar(doc, "Netzbezug", before.gridPurchaseKwh,
    after.gridPurchaseKwh, " kWh/a", before.gridPurchaseKwh, 508, false, "Netzbezug");
  comparisonBar(doc, "Einspeisung", before.feedInKwh,
    after.feedInKwh, " kWh/a", before.feedInKwh, 614, false, "Einspeisung");
  rule(doc, 722);
  text(doc, "Zusätzlicher finanzieller Speichervorteil", LEFT, 735, 370,
    8.5, "semibold", COLOR.ink);
  text(doc, `${euro(solar.storageAdditionalAnnualBenefitEuro)} im ersten Jahr`,
    398, 734, 155, 9.5, "semibold", COLOR.blue);
}

function drawHeating(doc: PDFKit.PDFDocument, lead: ConfiguratorLeadPayload): void {
  const heat = lead.economics.heating;
  const result = product(lead, "heat_pump")?.result;
  if (!heat || !result) return;
  page(doc, "Wärme", "Was sparst du beim Heizen?",
    "Die Betriebskosten werden mit dem angegebenen oder modellierten bisherigen Heizsystem verglichen.");
  const hasReference = heat.currentAnnualEuro !== null && heat.annualSavingEuro !== null;
  eyebrow(doc, hasReference ? "Modellierte Heizkostenersparnis" : "Heizkostenvergleich", LEFT, 198);
  text(doc, hasReference ? `${euro(heat.annualSavingEuro)} / Jahr` :
    "Vergleich noch nicht möglich", LEFT, 225, WIDTH,
  hasReference ? 31 : 21, "bold", COLOR.green);
  if (hasReference && heat.savingPercent !== null) {
    text(doc, `${format(heat.savingPercent)} % weniger jährliche Heizkosten im Modell`,
      LEFT, 275, WIDTH, 10, "semibold", COLOR.navy);
  } else {
    text(doc, "Ohne belastbare Angaben zum bisherigen System wird keine Einsparung behauptet.",
      LEFT, 267, WIDTH, 9, "regular", COLOR.muted);
  }
  rule(doc, 315);
  const reference = heat.currentAnnualEuro;
  const pump = heat.heatPumpAnnualEuro;
  const scale = Math.max(reference ?? 0, pump, 1);
  const barX = 44;
  const barWidth = 365;
  text(doc, heat.referenceSource, LEFT, 339, WIDTH, 9, "semibold", COLOR.navy);
  doc.save().roundedRect(barX, 363, Math.max(3, (reference ?? 0) / scale * barWidth), 21, 5)
    .fill(COLOR.soft).restore();
  text(doc, reference === null ? "Nicht verfügbar" : `${euro(reference)} / Jahr`,
    421, 363, 132, 9, "semibold", COLOR.navy);
  text(doc, "Mit Wärmepumpe", LEFT, 419, WIDTH, 9, "semibold", COLOR.navy);
  doc.save().roundedRect(barX, 443, Math.max(3, pump / scale * barWidth), 21, 5)
    .fill(COLOR.green).restore();
  text(doc, `${euro(pump)} / Jahr`, 421, 443, 132, 9, "semibold", COLOR.green);
  if (hasReference) {
    rect(doc, LEFT, 495, WIDTH, 122, COLOR.pale);
    valueLine(doc, "Ersparnis in 10 Jahren", euro(heat.saving10YearsEuro), 512,
      { x: 57, width: 230, valueSize: 18, color: COLOR.navy });
    valueLine(doc, "Ersparnis in 20 Jahren", euro(heat.saving20YearsEuro), 512,
      { x: 314, width: 223, valueSize: 18, color: COLOR.navy });
    text(doc, "Bei unveränderten jährlichen Kosten; ohne Förderung und Finanzierung.",
      57, 583, 480, 8, "regular", COLOR.muted);
  }
  rule(doc, 634);
  eyebrow(doc, "Förderung nicht berücksichtigt", LEFT, 653);
  text(doc,
    "Mögliche Fördermittel können die tatsächliche Investition reduzieren. Ob und in welcher Höhe sie in Frage kommen, prüfen wir im weiteren Beratungsprozess.",
    LEFT, 675, WIDTH, 9, "regular", COLOR.ink, 3);
  text(doc, `Empfohlene Wärmepumpenleistung: ${format(result.recommendedHeatPumpCapacityKw)} kW`,
    LEFT, 737, WIDTH, 8, "regular", COLOR.muted);
}

export function getComfortPdfCopy(hasClimate: boolean, hasWallbox: boolean) {
  return {
    overviewLabel: hasClimate && hasWallbox ? "Klimaanlage + Wallbox"
      : hasClimate ? "Klimaanlage" : "Wallbox",
    intro: hasClimate && hasWallbox
      ? "Diese Komponenten ergänzen das Energieprojekt im Alltag. Ihre Investition ist Teil der Gesamtkosten."
      : hasClimate
        ? "Die Klimaanlage ergänzt das Energieprojekt im Alltag. Ihre Investition ist Teil der Gesamtkosten."
        : "Die Wallbox ergänzt das Energieprojekt im Alltag. Ihre Investition ist Teil der Gesamtkosten.",
    closing: hasClimate && hasWallbox
      ? "Klimaanlage und Wallbox ergänzen dein Energieprojekt um Komfort, bequemes Laden und moderne Infrastruktur."
      : hasClimate
        ? "Die Klimaanlage ergänzt dein Energieprojekt um angenehme Raumtemperaturen und moderne Gebäudetechnik."
        : "Die Wallbox ergänzt dein Energieprojekt um bequemes Laden zu Hause und passende Ladeinfrastruktur.",
  };
}

function drawComfort(doc: PDFKit.PDFDocument, lead: ConfiguratorLeadPayload): void {
  const climate = product(lead, "climate");
  const wallbox = product(lead, "wallbox");
  const copy = getComfortPdfCopy(Boolean(climate), Boolean(wallbox));
  page(doc, "Komfort", "Mehr Komfort und Lebensqualität",
    copy.intro);
  const both = Boolean(climate && wallbox);
  if (climate) {
    // The tall single-product crop otherwise covers only the left side of this landscape photo.
    // A centered, shorter cover keeps the full outdoor unit in view.
    const height = both ? 240 : 320;
    imageCover(doc, "climate.jpg", LEFT, 195, 235, height,
      both ? undefined : "center");
    eyebrow(doc, "Klimaanlage", 297, 202, 256);
    const titleBottom = text(doc, "Angenehme Raumtemperaturen", 297, 227, 256, 16,
      "bold", COLOR.navy);
    const copyBottom = text(doc,
      "Gezielte Kühlung der vorgesehenen Räume und Integration in das Energiesystem des Hauses.",
      297, titleBottom + 8, 256, 9, "regular", COLOR.ink, 3);
    valueLine(doc, "Empfohlene Kühlleistung", `${format(climate.result.recommendedCoolingCapacityKw)} kW`,
      Math.max(327, copyBottom + 20), { x: 297, width: 256, valueSize: 16 });
    text(doc, `${climate.result.recommendedIndoorUnitCount} Inneneinheiten im Modell`,
      297, 396, 256, 9, "regular", COLOR.muted);
  }
  if (wallbox) {
    const y = climate ? 461 : 195;
    const height = climate ? 230 : 485;
    imageCover(doc, "wallbox.jpg", LEFT, y, 235, height);
    eyebrow(doc, "Wallbox", 297, y + 7, 256);
    text(doc, "Bequem zuhause laden", 297, y + 32, 256, 16,
      "bold", COLOR.navy);
    text(doc, "Das Fahrzeug ist im Alltag dort geladen, wo du wohnst. Die Ladeinfrastruktur wird passend zum Haus geplant.",
      297, y + 68, 256, 9, "regular", COLOR.ink, 3);
    valueLine(doc, "Gewählte Ladeleistung", `${format(wallbox.answers.chargingPowerKw)} kW`,
      y + 132, { x: 297, width: 256, valueSize: 16 });
    text(doc, `${format(wallbox.result.annualHomeChargingInputEnergyKwh)} kWh modellierter Ladebedarf zuhause im Jahr`,
      297, y + 193, 256, 8.5, "regular", COLOR.muted);
  }
  rule(doc, 727);
  text(doc, copy.closing,
    LEFT, 740, WIDTH, 8, "regular", COLOR.muted, 1);
}

function drawInvestment(doc: PDFKit.PDFDocument, lead: ConfiguratorLeadPayload): void {
  const eco = lead.economics;
  page(doc, "Projektkosten", "Deine Investition im Überblick",
    "Alle ausgewählten Komponenten sind enthalten. Die Solarinvestition hat eine eigene Wirtschaftlichkeitsrechnung.");
  eyebrow(doc, "Gesamtinvestition", LEFT, 194);
  const complete = eco.investmentBaseEuro !== null;
  text(doc, complete ? euro(eco.investmentBaseEuro) : "Noch nicht vollständig bezifferbar",
    LEFT, 221, WIDTH, complete ? 31 : 22, "bold", COLOR.navy);
  if (!complete) text(doc,
    eco.pricingMode === "individual_quote_required"
      ? "Für die markierten Komponenten ist wegen der Projektgröße ein individuelles Angebot erforderlich. Ein unvollständiger Gesamtwert wird nicht als Summe ausgegeben."
      : "Für die markierten Komponenten ist eine technische Preisprüfung nötig. Ein unvollständiger Gesamtwert wird nicht als Summe ausgegeben.",
    LEFT, 269, WIDTH, 9, "regular", COLOR.muted);
  const rows = eco.components;
  if (complete && eco.investmentBaseEuro! > 0) {
    const total = eco.investmentBaseEuro!;
    let segmentX = LEFT;
    rows.forEach((row) => {
      const segmentWidth = row.investmentBaseEuro! / total * WIDTH;
      doc.save().rect(segmentX, 304, segmentWidth, 28).fill(PRODUCT_COLOR[row.component]).restore();
      segmentX += segmentWidth;
    });
    text(doc, "So verteilt sich die Investition", LEFT, 344, WIDTH, 8, "regular", COLOR.muted);
  } else {
    rule(doc, 310);
  }
  const listY = complete ? 385 : 342;
  rows.forEach((row, index) => {
    const rowY = listY + index * 63;
    doc.save().rect(LEFT, rowY + 4, 5, 35).fill(PRODUCT_COLOR[row.component]).restore();
    text(doc, LABEL[row.component], LEFT + 17, rowY, 245, 11, "semibold", COLOR.navy);
    const meaning = row.component === "photovoltaic" || row.component === "battery_storage"
      ? "Solarinvestition" : row.component === "heat_pump" ? "Wärmeversorgung" : "Komfort & Infrastruktur";
    text(doc, meaning, LEFT + 17, rowY + 24, 245, 8, "regular", COLOR.muted);
    text(doc, componentInvestment(lead, row.component), 331, rowY + 4, 222,
      row.investmentBaseEuro === null ? 11 : 16, "semibold", COLOR.navy);
    rule(doc, rowY + 53);
  });
  const groupY = listY + rows.length * 63 + 13;
  const solarCost = product(lead, "photovoltaic")
    ? (eco.solar?.investmentEuro ?? null)
    : selectedCost(lead, ["battery_storage"]);
  const comfortCost = selectedCost(lead, ["climate", "wallbox"]);
  const groups = [
    ...(product(lead, "photovoltaic") || product(lead, "battery_storage")
      ? [{ label: "Solarinvestition", value: solarCost }] : []),
    ...(product(lead, "heat_pump")
      ? [{ label: "Wärmepumpe", value: selectedCost(lead, ["heat_pump"]) }] : []),
    ...(product(lead, "climate") || product(lead, "wallbox")
      ? [{ label: "Komfort & Lebensqualität", value: comfortCost }] : []),
  ];
  if (groupY + groups.length * 24 < BODY_BOTTOM) {
    groups.forEach((group, index) => {
      const y = groupY + index * 25;
      text(doc, group.label, LEFT, y, 300, 8, "semibold", COLOR.muted);
      text(doc, euro(group.value), 352, y - 1, 201, 9, "semibold", COLOR.navy);
    });
  }
}

function assumption(lead: ConfiguratorLeadPayload, key: string): string | null {
  return lead.economics.assumptions.find((item) => item.key === key)?.value ?? null;
}

function drawAssumptions(doc: PDFKit.PDFDocument, lead: ConfiguratorLeadPayload,
  settings?: ConfiguratorSettings): void {
  page(doc, "Transparenz", "Annahmen und nächste technische Prüfung",
    "Die wichtigsten Grundlagen des Jahresmodells und die Punkte für die Prüfung vor Ort.");
  const columnWidth = 238;
  const rightX = 315;
  eyebrow(doc, "So haben wir gerechnet", LEFT, 195, columnWidth);
  const solarKeys = lead.economics.solar
    ? getSolarPdfCopy(Boolean(product(lead, "battery_storage"))).assumptionKeys : [];
  const solarLabels: Record<string, string> = {
    electricity_price: "Netzstrompreis", feed_in: "Einspeisewert",
    price_growth: "Strompreisentwicklung", pv_degradation: "PV-Degradation",
    storage_efficiency: "Speicherwirkungsgrad", project_horizon: "Betrachtungszeitraum",
  };
  const solarItems = solarKeys.map((key) => ({ label: solarLabels[key]!, value: assumption(lead, key) }))
    .filter((item) => item.value !== null);
  if (!lead.economics.solar && product(lead, "photovoltaic")) solarItems.push({
    label: "Solarwirtschaftlichkeit", value: "Individuelles Angebot erforderlich",
  });
  if (lead.economics.solar) solarItems.push({
    label: "PV-Betriebskosten",
    value: `${num.format(lead.economics.solar.firstYearOperatingCostsEuro)} €/Jahr`,
  });
  const heatingItems: { label: string; value: string }[] = [];
  if (lead.economics.heating) {
    heatingItems.push({ label: "Heizungsvergleich", value: lead.economics.heating.referenceSource });
    const fuel = assumption(lead, "heating_fuel_price");
    if (fuel) heatingItems.push({ label: "Preis Vergleichsheizung", value: fuel });
    const efficiency = assumption(lead, "heating_efficiency");
    if (efficiency) heatingItems.push({ label: "Wirkungsgrad Vergleich", value: efficiency });
    const heat = product(lead, "heat_pump");
    if (heat) {
      heatingItems.push({ label: "Wärmepumpen-JAZ", value: format(heat.answers.annualPerformanceFactor) });
      if (settings) heatingItems.push({ label: "Wärmepumpen-Strompreis",
        value: `${num.format(settings.heatPump.electricityPriceEuroPerKwh)} €/kWh` });
    }
  }
  let rowY = 224;
  for (const group of [
    { title: "Solar", items: solarItems },
    { title: "Heizung", items: heatingItems },
  ]) {
    if (!group.items.length) continue;
    text(doc, group.title, LEFT, rowY, columnWidth, 8, "semibold", COLOR.blue, 1);
    rowY += 18;
    for (const item of group.items) {
      const labelEnd = text(doc, item.label, LEFT, rowY, columnWidth, 7.5, "regular", COLOR.muted, 1);
      const valueEnd = text(doc, item.value!, LEFT, labelEnd + 3, columnWidth, 9,
        "semibold", COLOR.navy, 1);
      rowY = valueEnd + 8;
    }
    rowY += 7;
  }
  eyebrow(doc, "Vor Ort prüfen wir", rightX, 195, columnWidth);
  const checks: { label: string; value: string }[] = [
    ...(product(lead, "photovoltaic") ? [{ label: "Dach & Netz", value: "Dachzustand, Verschattung, Netzanschluss und Elektroinstallation" }] : []),
    ...(product(lead, "battery_storage") ? [{ label: "Speicher", value: "Wechselrichter, Aufstellort und Ersatzstromkonzept" }] : []),
    ...(product(lead, "heat_pump") ? [{ label: "Heizung", value: "Heizlast, Vorlauftemperatur und Wärmeverteilung" }] : []),
    ...(product(lead, "climate") ? [{ label: "Kühlung", value: "Raumweise Last, Leitungswege und Gerätepositionen" }] : []),
    ...(product(lead, "wallbox") ? [{ label: "Laden", value: "Hausanschluss, Leitung und Schutztechnik" }] : []),
  ];
  let checkY = 228;
  for (const check of checks) {
    const labelEnd = text(doc, check.label, rightX, checkY, columnWidth, 9,
      "semibold", COLOR.blue, 1);
    const valueEnd = text(doc, check.value, rightX, labelEnd + 5, columnWidth, 8,
      "regular", COLOR.ink, 2);
    checkY = valueEnd + 20;
  }
  rule(doc, 674);
  text(doc,
    "Diese Werte sind eine Modellierung, kein verbindliches Angebot. Tatsächliche Erträge, Verbrauch und Kosten hängen von Auslegung, Nutzung und künftigen Preisen ab. Förderung, Finanzierung und Steuern sind nicht eingerechnet.",
    LEFT, 690, WIDTH, 8.5, "regular", COLOR.muted, 3);
}

function drawClosing(doc: PDFKit.PDFDocument, lead: ConfiguratorLeadPayload): void {
  doc.addPage();
  photoWithTint(doc, "closing-solar.jpg", 365);
  text(doc, "Der nächste Schritt zu\ndeinem Energieprojekt", 46, 143, 485, 28,
    "bold", COLOR.white, 5);
  text(doc, "Deine Angaben sind die Grundlage für unsere fachliche Prüfung.", 47, 245, 430,
    10, "regular", "#DDECF7");
  const steps = [
    { number: "01", title: "Angaben prüfen", body: "Wir betrachten die ausgewählten Lösungen als gemeinsames Energieprojekt." },
    { number: "02", title: "Vor Ort prüfen", body: "Wir sehen uns die technischen Gegebenheiten und deine Anforderungen an." },
    { number: "03", title: "Individuell planen", body: "Danach erstellen wir die belastbare Auslegung und ein konkretes Angebot." },
  ];
  steps.forEach((step, index) => {
    const x = LEFT + index * 173;
    text(doc, step.number, x, 401, 155, 20, "bold", COLOR.cyan);
    text(doc, step.title, x, 439, 155, 10, "semibold", COLOR.navy);
    text(doc, step.body, x, 464, 155, 8, "regular", COLOR.muted, 3);
  });
  rect(doc, LEFT, 584, WIDTH, 92, COLOR.soft);
  text(doc, "Energie-Kraft Süd", 60, 602, 475, 14, "semibold", COLOR.blue);
  text(doc, `energie-kraft.de  ·  ${lead.contact.firstName}, deine Anfrage ist bei uns eingegangen.`,
    60, 636, 475, 9, "regular", COLOR.ink);
  text(doc,
    "Die modellierten Projektpreise können vom späteren Angebot abweichen. Technische Details und Montagebedingungen werden vor Ort belastbar geprüft.",
    LEFT, 726, WIDTH, 8, "regular", COLOR.muted, 2);
}

function addFooters(doc: PDFKit.PDFDocument, reference: string): void {
  const range = doc.bufferedPageRange();
  for (let index = 1; index < range.count - 1; index += 1) {
    doc.switchToPage(range.start + index);
    const footerY = doc.page.height - 28;
    const originalBottomMargin = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    rule(doc, footerY - 9);
    doc.font(FONT.regular).fontSize(7).fillColor(COLOR.muted)
      .text(`Energie-Kraft · Projekt ${reference}`, LEFT, footerY, { width: 300, lineBreak: false });
    doc.font(FONT.regular).fontSize(7).fillColor(COLOR.muted)
      .text(`Seite ${index + 1} von ${range.count}`, 453, footerY,
        { width: 100, align: "right", lineBreak: false });
    doc.page.margins.bottom = originalBottomMargin;
  }
}

export async function generateConfiguratorProjectPdf(input: GenerateConfiguratorProjectPdfInput): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
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
    registerFonts(doc);
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("error", (error: Error) => reject(error));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    for (const section of getConfiguratorReportSections(input.lead)) {
      switch (section) {
        case "cover": drawCover(doc, input.lead); break;
        case "project": drawProject(doc, input.lead); break;
        case "flow": drawEnergyFlow(doc, input.lead); break;
        case "solar_system": drawSolarSystem(doc, input.lead, input.settings); break;
        case "solar_economics": drawSolarEconomics(doc, input.lead); break;
        case "cashflow": drawCashflow(doc, input.lead); break;
        case "storage": drawStorageComparison(doc, input.lead); break;
        case "heating": drawHeating(doc, input.lead); break;
        case "comfort": drawComfort(doc, input.lead); break;
        case "investment": drawInvestment(doc, input.lead); break;
        case "assumptions": drawAssumptions(doc, input.lead, input.settings); break;
        case "closing": drawClosing(doc, input.lead); break;
      }
    }
    addFooters(doc, input.leadId);
    doc.end();
  });
}
