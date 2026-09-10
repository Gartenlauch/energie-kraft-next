import { sendMailgunMail } from "./mailgun";
import type { ApplicationPayload } from "./application-validation";
import type { ApplicationFileMetadata } from "./shared/application-file-policy";

const APPLICATION_RECIPIENT = "jobs@energie-kraft.de";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function salutationLabel(value: ApplicationPayload["salutation"]): string {
  return value ? { frau: "Frau", herr: "Herr", divers: "Divers" }[value] : "Keine Angabe";
}

interface ApplicationMailInput {
  applicationId: string;
  jobTitle: string;
  receivedAt: string;
  application: Omit<ApplicationPayload, "documents">;
  documents?: readonly ApplicationFileMetadata[];
}

export function buildApplicationInternalMail(input: ApplicationMailInput) {
  const { applicationId, jobTitle, receivedAt, application } = input;
  const address = `${application.street}, ${application.postalCode} ${application.city}`;
  return {
    to: APPLICATION_RECIPIENT,
    replyTo: application.email,
    subject: `Neue Bewerbung – ${jobTitle}`,
    text: [
      `Stelle: ${jobTitle}`,
      `Name: ${salutationLabel(application.salutation)} ${application.firstName} ${application.lastName}`,
      `Adresse: ${address}`,
      `E-Mail: ${application.email}`,
      `Telefon: ${application.phone}`,
      "",
      "Qualifikation / Erfahrung:",
      application.qualificationExperience,
      "",
      `Application-ID: ${applicationId}`,
      `Eingangszeit: ${receivedAt}`,
      "",
      `Unterlagen: ${input.documents?.length ?? 0}`,
      ...(input.documents ?? []).map(
        (document) => `- ${document.name} (${(document.size / 1_000_000).toFixed(2)} MB)`,
      ),
      "Geschützter Zugriff nach Admin-Anmeldung: https://www.energie-kraft.de/admin/bewerbungen",
    ].join("\n"),
    html: `
      <h2>Neue Bewerbung</h2>
      <table cellpadding="6" cellspacing="0">
        <tr><td><strong>Stelle</strong></td><td>${escapeHtml(jobTitle)}</td></tr>
        <tr><td><strong>Name</strong></td><td>${escapeHtml(`${salutationLabel(application.salutation)} ${application.firstName} ${application.lastName}`)}</td></tr>
        <tr><td><strong>Adresse</strong></td><td>${escapeHtml(address)}</td></tr>
        <tr><td><strong>E-Mail</strong></td><td>${escapeHtml(application.email)}</td></tr>
        <tr><td><strong>Telefon</strong></td><td>${escapeHtml(application.phone)}</td></tr>
      </table>
      <h3>Qualifikation / Erfahrung</h3>
      <p style="white-space:pre-wrap">${escapeHtml(application.qualificationExperience)}</p>
      <hr />
      <p><strong>Application-ID:</strong> ${escapeHtml(applicationId)}<br />
      <strong>Eingangszeit:</strong> ${escapeHtml(receivedAt)}</p>
      <h3>Unterlagen (${input.documents?.length ?? 0})</h3>
      <ul>${(input.documents ?? []).map((document) => `<li>${escapeHtml(document.name)} (${(document.size / 1_000_000).toFixed(2)} MB)</li>`).join("")}</ul>
      <p><a href="https://www.energie-kraft.de/admin/bewerbungen">Dokumente im geschützten Admin-Bereich abrufen</a> (Anmeldung erforderlich).</p>
    `.trim(),
  };
}

export function buildApplicationAutoReply(input: ApplicationMailInput) {
  const { applicationId, jobTitle, application } = input;
  return {
    to: application.email,
    replyTo: APPLICATION_RECIPIENT,
    subject: "Deine Bewerbung bei Energie-Kraft Süd ist eingegangen",
    text: `Hallo ${application.firstName},\n\nvielen Dank für deine Bewerbung als ${jobTitle}. Deine Angaben wurden aufgenommen.\n\nReferenz: ${applicationId}\n\nViele Grüße\nEnergie-Kraft Süd`,
    html: `<p>Hallo ${escapeHtml(application.firstName)},</p><p>vielen Dank für deine Bewerbung als <strong>${escapeHtml(jobTitle)}</strong>. Deine Angaben wurden aufgenommen.</p><p>Referenz: ${escapeHtml(applicationId)}</p><p>Viele Grüße<br />Energie-Kraft Süd</p>`,
  };
}

export function sendApplicationInternalMail(input: ApplicationMailInput) {
  return sendMailgunMail(buildApplicationInternalMail(input));
}

export function sendApplicationAutoReply(input: ApplicationMailInput) {
  return sendMailgunMail(buildApplicationAutoReply(input));
}
