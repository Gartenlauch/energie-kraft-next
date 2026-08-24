import type { ConfiguratorLeadPayload } from "./configurator-lead-validation";
import {
  LEAD_MAIL_RECIPIENT,
  sendMailgunMail,
} from "./mailgun";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("de-DE").format(value);
}

const PERSON_LABELS: Record<string, string> = {
  "1": "1 Person",
  "2": "2 Personen",
  "3": "3 Personen",
  "4_5": "4–5 Personen",
};

const BUILDING_LABELS: Record<string, string> = {
  detached_house: "Freistehendes Einfamilienhaus",
  semi_detached_house: "Doppelhaushälfte",
  mid_terrace_house: "Reihenmittelhaus",
  end_terrace_house: "Reihenendhaus",
  multi_family_house: "Mehrfamilienhaus",
};

const ROOF_MATERIAL_LABELS: Record<string, string> = {
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

const ORIENTATION_LABELS: Record<string, string> = {
  south: "Süd",
  south_east_south_west: "Südost / Südwest",
  east_west: "Ost-West",
  north: "Nordorientiert",
};

const RENOVATION_LABELS: Record<string, string> = {
  new_build: "Neubau",
  after_1990: "Nach 1990",
  before_1990: "Vor 1990",
  before_1960: "Vor 1960",
  unknown: "Weiß ich nicht",
};

interface SendConfiguratorLeadMailInput {
  leadId: string;
  lead: ConfiguratorLeadPayload;
}

export async function sendConfiguratorLeadMail({
  leadId,
  lead,
}: SendConfiguratorLeadMailInput) {
  const answers = lead.configurator.answers;
  const result = lead.configurator.result;

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
  ]
    .filter((value): value is string => value !== null)
    .join(", ");

  const notes =
    answers.notes.hasNotes && answers.notes.text
      ? answers.notes.text
      : "Keine Anmerkungen";

  const phone =
    lead.contact.phone?.trim() || "Keine Angabe";

  const text = `
Neue Photovoltaik-Konfigurator-Anfrage

Lead-ID: ${leadId}

Kontaktdaten
------------
Vorname: ${lead.contact.firstName}
Nachname: ${lead.contact.lastName}
E-Mail: ${lead.contact.email}
Telefon: ${phone}

Installationsort
----------------
Am Wohnort: ${lead.installation.atResidence ? "Ja" : "Nein"}
Straße: ${lead.installation.street}
PLZ: ${lead.installation.postalCode}
Ort: ${lead.installation.city}

Konfiguration
-------------
Haushalt: ${PERSON_LABELS[String(answers.household.persons)]}
Jahresverbrauch: ${formatNumber(answers.household.annualConsumptionKwh)} kWh
Zukünftige Erhöhung: ${answers.household.futureIncreasePercent} %
Prognostizierter Verbrauch: ${formatNumber(answers.household.projectedConsumptionKwh)} kWh

Gebäude: ${BUILDING_LABELS[answers.building.type]}
Eigentum: Eigentümer

Dachneigung: ${answers.roof.pitch}°
Dachmaterial: ${ROOF_MATERIAL_LABELS[answers.roof.material]}
Dachausrichtung: ${ORIENTATION_LABELS[answers.roof.orientation]}
Dachalter / Sanierung: ${RENOVATION_LABELS[answers.roof.renovationPeriod]}

Weitere Interessen: ${interests || "Keine"}
Anmerkungen: ${notes}

Ergebnis
--------
Empfohlene Anlagenklasse:
ca. ${result.recommendedPowerKwpMin}–${result.recommendedPowerKwpMax} kWp

Geschätzter Jahresertrag:
ca. ${formatNumber(result.estimatedAnnualYieldKwhMin)}–${formatNumber(result.estimatedAnnualYieldKwhMax)} kWh

Technische Prüfung besonders empfohlen:
${result.technicalReviewRecommended ? "Ja" : "Nein"}

Lead-ID:
${leadId}
  `.trim();

  const html = `
    <h2>Neue Photovoltaik-Konfigurator-Anfrage</h2>

    <p><strong>Lead-ID:</strong> ${escapeHtml(leadId)}</p>

    <h3>Kontaktdaten</h3>
    <table cellpadding="6" cellspacing="0">
      <tr><td><strong>Vorname</strong></td><td>${escapeHtml(lead.contact.firstName)}</td></tr>
      <tr><td><strong>Nachname</strong></td><td>${escapeHtml(lead.contact.lastName)}</td></tr>
      <tr><td><strong>E-Mail</strong></td><td>${escapeHtml(lead.contact.email)}</td></tr>
      <tr><td><strong>Telefon</strong></td><td>${escapeHtml(phone)}</td></tr>
    </table>

    <h3>Installationsort</h3>
    <table cellpadding="6" cellspacing="0">
      <tr><td><strong>Am Wohnort</strong></td><td>${lead.installation.atResidence ? "Ja" : "Nein"}</td></tr>
      <tr><td><strong>Straße</strong></td><td>${escapeHtml(lead.installation.street)}</td></tr>
      <tr><td><strong>PLZ</strong></td><td>${escapeHtml(lead.installation.postalCode)}</td></tr>
      <tr><td><strong>Ort</strong></td><td>${escapeHtml(lead.installation.city)}</td></tr>
    </table>

    <h3>Photovoltaik-Konfiguration</h3>
    <table cellpadding="6" cellspacing="0">
      <tr><td><strong>Haushalt</strong></td><td>${escapeHtml(PERSON_LABELS[String(answers.household.persons)] ?? String(answers.household.persons))}</td></tr>
      <tr><td><strong>Jahresverbrauch</strong></td><td>${formatNumber(answers.household.annualConsumptionKwh)} kWh</td></tr>
      <tr><td><strong>Zukünftige Erhöhung</strong></td><td>${answers.household.futureIncreasePercent} %</td></tr>
      <tr><td><strong>Prognostizierter Verbrauch</strong></td><td>${formatNumber(answers.household.projectedConsumptionKwh)} kWh</td></tr>
      <tr><td><strong>Gebäude</strong></td><td>${escapeHtml(BUILDING_LABELS[answers.building.type] ?? answers.building.type)}</td></tr>
      <tr><td><strong>Eigentum</strong></td><td>Eigentümer</td></tr>
      <tr><td><strong>Dachneigung</strong></td><td>${answers.roof.pitch}°</td></tr>
      <tr><td><strong>Dachmaterial</strong></td><td>${escapeHtml(ROOF_MATERIAL_LABELS[answers.roof.material] ?? answers.roof.material)}</td></tr>
      <tr><td><strong>Dachausrichtung</strong></td><td>${escapeHtml(ORIENTATION_LABELS[answers.roof.orientation] ?? answers.roof.orientation)}</td></tr>
      <tr><td><strong>Dachalter / Sanierung</strong></td><td>${escapeHtml(RENOVATION_LABELS[answers.roof.renovationPeriod] ?? answers.roof.renovationPeriod)}</td></tr>
      <tr><td><strong>Weitere Interessen</strong></td><td>${escapeHtml(interests || "Keine")}</td></tr>
    </table>

    <h3>Anmerkungen</h3>
    <p style="white-space: pre-wrap;">${escapeHtml(notes)}</p>

    <h3>Ergebnis</h3>
    <table cellpadding="6" cellspacing="0">
      <tr>
        <td><strong>Empfohlene Anlagenklasse</strong></td>
        <td>ca. ${result.recommendedPowerKwpMin}–${result.recommendedPowerKwpMax} kWp</td>
      </tr>
      <tr>
        <td><strong>Geschätzter Jahresertrag</strong></td>
        <td>ca. ${formatNumber(result.estimatedAnnualYieldKwhMin)}–${formatNumber(result.estimatedAnnualYieldKwhMax)} kWh</td>
      </tr>
      <tr>
        <td><strong>Technische Prüfung besonders empfohlen</strong></td>
        <td>${result.technicalReviewRecommended ? "Ja" : "Nein"}</td>
      </tr>
    </table>

    <hr />

    <p style="font-size: 12px; color: #666;">
      Lead-ID: ${escapeHtml(leadId)}
    </p>
  `;

  return sendMailgunMail({
    to: LEAD_MAIL_RECIPIENT,
    replyTo: lead.contact.email,
    subject:
      "Neue PV-Konfigurator-Anfrage – Energie-Kraft",
    text,
    html,
  });
}