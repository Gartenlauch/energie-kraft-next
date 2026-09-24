import {
  FieldValue,
  getFirestore,
  type DocumentData,
  type Firestore,
} from "firebase-admin/firestore";
import { HttpsError, onCall, type CallableRequest } from "firebase-functions/v2/https";
import { z } from "zod";
import { generateConfiguratorProjectPdf } from "./configurator-project-pdf.js";
import type { ConfiguratorLeadPayload } from "./configurator-lead-validation.js";
import {
  configuratorSettingsSchema,
  type ConfiguratorSettings,
} from "./configurator-settings-model.js";
import { mailgunSendingKey, sendMailgunMail } from "./mailgun.js";
import { buildConfiguratorLeadMail } from "./configurator-lead-mail.js";
import { buildContactLeadMail } from "./contact-lead-mail.js";
import type { ContactLeadPayload } from "./contact-lead-validation.js";
import { checkStaffClaim, requireStaffCaller } from "./admin-authorization.js";

const id = z
  .string()
  .trim()
  .min(1)
  .max(150)
  .regex(/^[A-Za-z0-9_-]+$/);
const reportSchema = z.object({ leadId: id }).strict();
const forwardSchema = z
  .object({
    id,
    recipient: z.string().trim().email().max(254),
    message: z.string().trim().max(2_000).optional(),
  })
  .strict();

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function toDate(value: unknown): Date | null {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    try {
      return value.toDate();
    } catch {
      return null;
    }
  }
  return null;
}
export function resolveReportDate(data: DocumentData, now = new Date()) {
  return toDate(data.report?.generatedAt) ?? toDate(data.createdAt) ?? now;
}
function storedPayload(data: DocumentData): ConfiguratorLeadPayload {
  return {
    type: "configurator",
    submissionId: data.submissionId ?? "00000000-0000-4000-8000-000000000000",
    settingsVersion: data.settingsVersion ?? data.settings?.version ?? 0,
    products: data.products,
    journey: data.journey,
    configurators: data.configurators,
    economics: data.economics,
    contact: {
      firstName: data.contact.firstName,
      lastName: data.contact.lastName,
      email: data.contact.email,
      ...(data.contact.phone ? { phone: data.contact.phone } : {}),
    },
    installation: data.installation,
    privacyAccepted: true,
    formStartedAt: 1,
  } as ConfiguratorLeadPayload;
}
function storedSettings(data: DocumentData): ConfiguratorSettings | undefined {
  const parsed = configuratorSettingsSchema.safeParse(data.settings);
  return parsed.success ? parsed.data : undefined;
}
function fileName(data: DocumentData, leadId: string) {
  return `energie-kraft-projektanalyse-${data.publicReference ?? leadId}.pdf`.replace(
    /[^A-Za-z0-9._-]/g,
    "-",
  );
}

async function createPdf(data: DocumentData, leadId: string) {
  if (data.type !== "configurator")
    throw new HttpsError(
      "failed-precondition",
      "Für diese Anfrage ist kein Projekt-PDF verfügbar.",
    );
  const reportDate = resolveReportDate(data);
  const buffer = await generateConfiguratorProjectPdf({
    leadId: data.publicReference ?? leadId,
    lead: storedPayload(data),
    settings: storedSettings(data),
    reportDate,
  });
  return { buffer, filename: fileName(data, leadId), reportDate };
}

function actorActivity(
  actor: { uid: string; email: string | null },
  type: string,
  message: string,
  metadata?: Record<string, string>,
) {
  return {
    type,
    createdAt: FieldValue.serverTimestamp(),
    actorUid: actor.uid,
    actorEmail: actor.email,
    message,
    ...(metadata ? { metadata } : {}),
  };
}

export async function handleAdminGenerateLeadReport(
  request: CallableRequest<unknown>,
  firestore: Firestore = getFirestore(),
) {
  checkStaffClaim(request);
  const input = reportSchema.safeParse(request.data);
  if (!input.success) throw new HttpsError("invalid-argument", "Ungültige Anfrage-ID.");
  const actor = await requireStaffCaller(request);
  const reference = firestore.collection("leads").doc(input.data.leadId);
  const snapshot = await reference.get();
  if (!snapshot.exists) throw new HttpsError("not-found", "Anfrage nicht gefunden.");
  const data = snapshot.data()!;
  const report = await createPdf(data, snapshot.id);
  const generatedAt = data.report?.generatedAt ?? data.createdAt ?? FieldValue.serverTimestamp();
  const batch = firestore.batch();
  batch.update(reference, {
    "report.status": "generated",
    "report.filename": report.filename,
    "report.sizeBytes": report.buffer.length,
    "report.generatedAt": generatedAt,
    "report.updatedAt": FieldValue.serverTimestamp(),
  });
  batch.set(
    reference.collection("activities").doc(),
    actorActivity(actor, "report_generated", "Projekt-PDF zum Download bereitgestellt"),
  );
  await batch.commit();
  return {
    ok: true,
    filename: report.filename,
    contentType: "application/pdf",
    dataBase64: report.buffer.toString("base64"),
  };
}

export function buildForwardedLeadMail(data: DocumentData, idValue: string) {
  const reference = data.publicReference ?? idValue;
  const content = data.type === "configurator"
    ? buildConfiguratorLeadMail({ leadId: reference, lead: storedPayload(data) })
    : buildContactLeadMail({ leadId: reference, lead: {
      firstName: data.contact?.firstName ?? "", lastName: data.contact?.lastName ?? "",
      company: data.contact?.company ?? undefined, email: data.contact?.email ?? "",
      phone: data.contact?.phone ?? undefined, postalCode: data.location?.postalCode ?? "",
      city: data.location?.city ?? "", interests: data.project?.interests ?? [],
      buildingType: data.project?.buildingType ?? undefined, ownership: data.project?.ownership ?? undefined,
      preferredContact: data.preferredContact ?? "egal", message: data.message ?? "",
      privacyAccepted: true,
    } as ContactLeadPayload });
  const date = toDate(data.createdAt);
  const dateText = date ? new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Berlin" }).format(date) : "Nicht verfügbar";
  return { reference, text: `Eingegangen: ${dateText}\n\n${content.text}`,
    html: `<p><strong>Eingegangen:</strong> ${escapeHtml(dateText)}</p>${content.html}` };
}
export async function handleAdminForwardLead(
  request: CallableRequest<unknown>,
  firestore: Firestore = getFirestore(),
  send = sendMailgunMail,
) {
  checkStaffClaim(request);
  const input = forwardSchema.safeParse(request.data);
  if (!input.success)
    throw new HttpsError("invalid-argument", "Empfänger oder Eingabe ist ungültig.");
  const actor = await requireStaffCaller(request);
  const reference = firestore.collection("leads").doc(input.data.id);
  const snapshot = await reference.get();
  if (!snapshot.exists) throw new HttpsError("not-found", "Anfrage nicht gefunden.");
  const data = snapshot.data()!;
  const summary = buildForwardedLeadMail(data, snapshot.id);
  const report = data.type === "configurator" ? await createPdf(data, snapshot.id) : null;
  const note = input.data.message ? `\n\nInterne Nachricht:\n${input.data.message}` : "";
  await send({
    to: input.data.recipient,
    replyTo: data.contact?.email,
    subject: `Weitergeleitete Anfrage · ${summary.reference}`,
    text: `Energie-Kraft Admin-Weiterleitung\n\n${summary.text}${note}`,
    html: `${summary.html}${input.data.message ? `<h3>Interne Nachricht</h3><p>${escapeHtml(input.data.message).replace(/\n/g, "<br />")}</p>` : ""}`,
    ...(report
      ? {
          attachments: [
            { filename: report.filename, data: report.buffer, contentType: "application/pdf" },
          ],
        }
      : {}),
  });
  await reference
    .collection("activities")
    .add(
      actorActivity(
        actor,
        report ? "report_forwarded" : "lead_forwarded",
        report ? "Lead mit Projekt-PDF intern weitergeleitet" : "Lead intern weitergeleitet",
        { recipient: input.data.recipient },
      ),
    );
  return { ok: true };
}

export async function handleAdminForwardReferral(
  request: CallableRequest<unknown>,
  firestore: Firestore = getFirestore(),
  send = sendMailgunMail,
) {
  checkStaffClaim(request);
  const input = forwardSchema.safeParse(request.data);
  if (!input.success)
    throw new HttpsError("invalid-argument", "Empfänger oder Eingabe ist ungültig.");
  const actor = await requireStaffCaller(request);
  const reference = firestore.collection("referrals").doc(input.data.id);
  const snapshot = await reference.get();
  if (!snapshot.exists) throw new HttpsError("not-found", "Empfehlung nicht gefunden.");
  const data = snapshot.data()!;
  const referrer = `${data.referrer?.firstName ?? ""} ${data.referrer?.lastName ?? ""}`.trim();
  const referred =
    `${data.referredCustomer?.firstName ?? ""} ${data.referredCustomer?.lastName ?? ""}`.trim();
  const summary = [
    `Empfehlungsgeber: ${referrer}`,
    `E-Mail: ${data.referrer?.email ?? "Nicht angegeben"}`,
    `Empfohlene Person: ${referred}`,
    `E-Mail: ${data.referredCustomer?.email ?? "Nicht angegeben"}`,
    `Telefon: ${data.referredCustomer?.phone ?? "Nicht angegeben"}`,
    `Adresse: ${data.referredCustomer?.street ?? ""}, ${data.referredCustomer?.postalCode ?? ""} ${data.referredCustomer?.city ?? ""}`,
    `Referenz: ${snapshot.id}`,
  ].join("\n");
  await send({
    to: input.data.recipient,
    replyTo: data.referrer?.email,
    subject: `Weitergeleitete Empfehlung · ${snapshot.id}`,
    text: `${summary}${input.data.message ? `\n\nInterne Nachricht:\n${input.data.message}` : ""}`,
    html: `<h2>Weitergeleitete Empfehlung</h2><pre style="font-family:Arial,sans-serif;white-space:pre-wrap">${escapeHtml(summary)}</pre>${input.data.message ? `<h3>Interne Nachricht</h3><p>${escapeHtml(input.data.message).replace(/\n/g, "<br />")}</p>` : ""}`,
  });
  await reference
    .collection("activities")
    .add(
      actorActivity(actor, "lead_forwarded", "Empfehlung intern weitergeleitet", {
        recipient: input.data.recipient,
      }),
    );
  return { ok: true };
}

export const adminGenerateLeadReport = onCall({ invoker: "public" }, async (request) =>
  handleAdminGenerateLeadReport(request),
);
export const adminForwardLead = onCall(
  { invoker: "public", secrets: [mailgunSendingKey] },
  async (request) => handleAdminForwardLead(request),
);
export const adminForwardReferral = onCall(
  { invoker: "public", secrets: [mailgunSendingKey] },
  async (request) => handleAdminForwardReferral(request),
);
