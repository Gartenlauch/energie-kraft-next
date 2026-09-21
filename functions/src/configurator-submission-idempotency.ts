import { createHash } from "node:crypto";
import type { ConfiguratorLeadPayload } from "./configurator-lead-validation.js";

export type MailAttemptStatus = "pending" | "processing" | "accepted" | "failed";
export type ReportStatus = "pending" | "generated" | "failed";

export interface ConfiguratorSubmissionResult {
  ok: true;
  leadId: string;
  publicReference: string;
  mailStatus: "accepted" | "failed";
  customerMailStatus: "accepted" | "failed";
  reportStatus: "generated" | "failed";
}

export interface ConfiguratorSubmissionRecord {
  submissionId: string;
  payloadFingerprint: string;
  leadId: string;
  publicReference: string;
  status: "processing" | "completed";
  mail: {
    internal: { status: MailAttemptStatus };
    customer: { status: MailAttemptStatus };
  };
  report: { status: ReportStatus };
  result?: ConfiguratorSubmissionResult;
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .filter(([, item]) => item !== undefined)
      .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export function fingerprintConfiguratorSubmission(input: ConfiguratorLeadPayload): string {
  // Results/economics are recomputed on the server. Form timing and the empty honeypot are transient.
  const meaningfulPayload = {
    type: input.type,
    settingsVersion: input.settingsVersion,
    products: input.products,
    journey: input.journey,
    configurators: input.configurators.map(({ type, answers }) => ({ type, answers })),
    contact: {
      ...input.contact,
      phone: input.contact.phone?.trim() || undefined,
    },
    installation: input.installation,
    privacyAccepted: input.privacyAccepted,
  };
  return createHash("sha256").update(canonicalJson(meaningfulPayload)).digest("hex");
}
