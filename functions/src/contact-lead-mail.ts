import {
    LEAD_MAIL_RECIPIENT,
    sendMailgunMail,
  } from "./mailgun";
  
  import type { ContactLeadPayload } from "./contact-lead-validation";
  
  function escapeHtml(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  
  function optionalText(
    value: string | undefined,
  ): string {
    const normalized = value?.trim();
  
    return normalized
      ? escapeHtml(normalized)
      : "Keine Angabe";
  }
  
  const INTEREST_LABELS: Record<string, string> = {
    photovoltaik: "Photovoltaik",
    stromspeicher: "Stromspeicher",
    wallbox: "Wallbox",
    klimaanlage: "Klimaanlage",
    waermepumpe: "Wärmepumpe",
    sonstiges: "Sonstiges",
  };
  
  const BUILDING_TYPE_LABELS: Record<string, string> = {
    einfamilienhaus: "Einfamilienhaus",
    mehrfamilienhaus: "Mehrfamilienhaus",
    gewerbe: "Gewerbe",
    sonstiges: "Sonstiges",
  };
  
  const OWNERSHIP_LABELS: Record<string, string> = {
    eigentuemer: "Eigentümer",
    mieter: "Mieter",
    sonstiges: "Sonstiges",
  };
  
  const CONTACT_PREFERENCE_LABELS: Record<string, string> = {
    telefon: "Telefon",
    email: "E-Mail",
    egal: "Keine Präferenz",
  };
  
  interface SendContactLeadMailInput {
    leadId: string;
    lead: ContactLeadPayload;
  }
  
  export async function sendContactLeadMail({
    leadId,
    lead,
  }: SendContactLeadMailInput) {
    const interests = lead.interests
      .map(
        (interest) =>
          INTEREST_LABELS[interest] ?? interest,
      )
      .join(", ");
  
    const buildingType = lead.buildingType
      ? BUILDING_TYPE_LABELS[lead.buildingType] ??
        lead.buildingType
      : "Keine Angabe";
  
    const ownership = lead.ownership
      ? OWNERSHIP_LABELS[lead.ownership] ??
        lead.ownership
      : "Keine Angabe";
  
    const preferredContact =
      CONTACT_PREFERENCE_LABELS[
        lead.preferredContact
      ] ?? lead.preferredContact;
  
    const text = `
  Neue Website-Anfrage
  
  Lead-ID: ${leadId}
  
  Kontaktdaten
  ------------
  Vorname: ${lead.firstName}
  Nachname: ${lead.lastName}
  Firma: ${lead.company ?? "Keine Angabe"}
  E-Mail: ${lead.email}
  Telefon: ${lead.phone ?? "Keine Angabe"}
  
  Standort
  --------
  PLZ: ${lead.postalCode}
  Ort: ${lead.city}
  
  Projekt
  -------
  Interessen: ${interests}
  Gebäudetyp: ${buildingType}
  Eigentum / Nutzung: ${ownership}
  
  Bevorzugter Kontakt:
  ${preferredContact}
  
  Nachricht
  ---------
  ${lead.message}
  
  Lead-ID
  -------
  ${leadId}
  `.trim();
  
    const html = `
      <h2>Neue Website-Anfrage</h2>
  
      <p>
        <strong>Lead-ID:</strong>
        ${escapeHtml(leadId)}
      </p>
  
      <h3>Kontaktdaten</h3>
  
      <table cellpadding="6" cellspacing="0">
        <tr>
          <td><strong>Vorname</strong></td>
          <td>${escapeHtml(lead.firstName)}</td>
        </tr>
        <tr>
          <td><strong>Nachname</strong></td>
          <td>${escapeHtml(lead.lastName)}</td>
        </tr>
        <tr>
          <td><strong>Firma</strong></td>
          <td>${optionalText(lead.company)}</td>
        </tr>
        <tr>
          <td><strong>E-Mail</strong></td>
          <td>${escapeHtml(lead.email)}</td>
        </tr>
        <tr>
          <td><strong>Telefon</strong></td>
          <td>${optionalText(lead.phone)}</td>
        </tr>
      </table>
  
      <h3>Standort</h3>
  
      <table cellpadding="6" cellspacing="0">
        <tr>
          <td><strong>PLZ</strong></td>
          <td>${escapeHtml(lead.postalCode)}</td>
        </tr>
        <tr>
          <td><strong>Ort</strong></td>
          <td>${escapeHtml(lead.city)}</td>
        </tr>
      </table>
  
      <h3>Projekt</h3>
  
      <table cellpadding="6" cellspacing="0">
        <tr>
          <td><strong>Interessen</strong></td>
          <td>${escapeHtml(interests)}</td>
        </tr>
        <tr>
          <td><strong>Gebäudetyp</strong></td>
          <td>${escapeHtml(buildingType)}</td>
        </tr>
        <tr>
          <td><strong>Eigentum / Nutzung</strong></td>
          <td>${escapeHtml(ownership)}</td>
        </tr>
        <tr>
          <td><strong>Bevorzugter Kontakt</strong></td>
          <td>${escapeHtml(preferredContact)}</td>
        </tr>
      </table>
  
      <h3>Nachricht</h3>
  
      <p style="white-space: pre-wrap;">
        ${escapeHtml(lead.message)}
      </p>
  
      <hr />
  
      <p style="font-size: 12px; color: #666;">
        Lead-ID:
        ${escapeHtml(leadId)}
      </p>
    `;
  
    return sendMailgunMail({
      to: LEAD_MAIL_RECIPIENT,
      replyTo: lead.email,
      subject:
        "Neue Website-Anfrage – Energie-Kraft",
      text,
      html,
    });
  }