import { sendMailgunMail } from "./mailgun";
import type { ReferralPayload } from "./referral-validation";

const REFERRAL_RECIPIENT = "anfragen@energie-kraft.de";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function salutationLabel(value: "frau" | "herr" | "divers"): string {
  return { frau: "Frau", herr: "Herr", divers: "Divers" }[value];
}

interface ReferralMailInput {
  referralId: string;
  receivedAt: string;
  referral: ReferralPayload;
}

export function buildReferralInternalMail(input: ReferralMailInput) {
  const { referralId, receivedAt, referral } = input;
  const phone = referral.referredCustomer.phone || "Keine Angabe";
  return {
    to: REFERRAL_RECIPIENT,
    replyTo: referral.referrer.email,
    subject: "Neue Kundenempfehlung",
    text: [
      `Empfehlungsgeber: ${salutationLabel(referral.referrer.salutation)} ${referral.referrer.firstName} ${referral.referrer.lastName}`,
      `E-Mail: ${referral.referrer.email}`,
      "",
      `Empfohlene Person: ${salutationLabel(referral.referredCustomer.salutation)} ${referral.referredCustomer.firstName} ${referral.referredCustomer.lastName}`,
      `E-Mail: ${referral.referredCustomer.email}`,
      `Telefon: ${phone}`,
      `Adresse: ${referral.referredCustomer.street}, ${referral.referredCustomer.postalCode} ${referral.referredCustomer.city}`,
      "",
      `Referral-ID: ${referralId}`,
      `Eingangszeit: ${receivedAt}`,
    ].join("\n"),
    html: `
      <h2>Neue Kundenempfehlung</h2>
      <h3>Empfehlungsgeber:in</h3>
      <p>${escapeHtml(`${salutationLabel(referral.referrer.salutation)} ${referral.referrer.firstName} ${referral.referrer.lastName}`)}<br />${escapeHtml(referral.referrer.email)}</p>
      <h3>Empfohlene Person</h3>
      <p>${escapeHtml(`${salutationLabel(referral.referredCustomer.salutation)} ${referral.referredCustomer.firstName} ${referral.referredCustomer.lastName}`)}<br />${escapeHtml(referral.referredCustomer.email)}<br />${escapeHtml(phone)}<br />${escapeHtml(`${referral.referredCustomer.street}, ${referral.referredCustomer.postalCode} ${referral.referredCustomer.city}`)}</p>
      <hr />
      <p><strong>Referral-ID:</strong> ${escapeHtml(referralId)}<br /><strong>Eingangszeit:</strong> ${escapeHtml(receivedAt)}</p>
    `.trim(),
  };
}

export function buildReferrerConfirmation(input: ReferralMailInput) {
  const { referralId, referral } = input;
  return {
    to: referral.referrer.email,
    replyTo: REFERRAL_RECIPIENT,
    subject: "Ihre Empfehlung wurde aufgenommen",
    text: `Hallo ${referral.referrer.firstName},\n\nvielen Dank. Ihre Empfehlung wurde aufgenommen und wird anhand der Aktionsbedingungen geprüft. Damit ist noch keine Prämienzusage verbunden.\n\nReferenz: ${referralId}\n\nViele Grüße\nEnergie-Kraft Süd`,
    html: `<p>Hallo ${escapeHtml(referral.referrer.firstName)},</p><p>vielen Dank. Ihre Empfehlung wurde aufgenommen und wird anhand der Aktionsbedingungen geprüft. Damit ist noch keine Prämienzusage verbunden.</p><p>Referenz: ${escapeHtml(referralId)}</p><p>Viele Grüße<br />Energie-Kraft Süd</p>`,
  };
}

export function buildReferredCustomerNotice(input: ReferralMailInput) {
  const { referral, referralId } = input;
  return {
    to: referral.referredCustomer.email,
    replyTo: REFERRAL_RECIPIENT,
    subject: "Information zu einer persönlichen Empfehlung",
    text: `Hallo ${referral.referredCustomer.firstName},\n\n${referral.referrer.firstName} ${referral.referrer.lastName} hat Sie Energie-Kraft Süd für ein mögliches Energieprojekt empfohlen. Ihre Kontaktdaten wurden uns mit bestätigtem Einverständnis übermittelt. Wir verwenden sie ausschließlich zur Bearbeitung dieser Anfrage.\n\nReferenz: ${referralId}\n\nWeitere Informationen: https://www.energie-kraft.de/datenschutz\n\nViele Grüße\nEnergie-Kraft Süd`,
    html: `<p>Hallo ${escapeHtml(referral.referredCustomer.firstName)},</p><p>${escapeHtml(`${referral.referrer.firstName} ${referral.referrer.lastName}`)} hat Sie Energie-Kraft Süd für ein mögliches Energieprojekt empfohlen. Ihre Kontaktdaten wurden uns mit bestätigtem Einverständnis übermittelt. Wir verwenden sie ausschließlich zur Bearbeitung dieser Anfrage.</p><p>Referenz: ${escapeHtml(referralId)}</p><p><a href="https://www.energie-kraft.de/datenschutz">Informationen zum Datenschutz</a></p><p>Viele Grüße<br />Energie-Kraft Süd</p>`,
  };
}

export function sendReferralInternalMail(input: ReferralMailInput) {
  return sendMailgunMail(buildReferralInternalMail(input));
}
export function sendReferrerConfirmation(input: ReferralMailInput) {
  return sendMailgunMail(buildReferrerConfirmation(input));
}
export function sendReferredCustomerNotice(input: ReferralMailInput) {
  return sendMailgunMail(buildReferredCustomerNotice(input));
}
