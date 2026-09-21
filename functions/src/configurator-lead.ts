import { FieldValue, getFirestore, type DocumentReference, type Firestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { mailgunSendingKey } from "./mailgun";
import { sendConfiguratorCustomerMail } from "./configurator-customer-mail";
import { generateConfiguratorProjectPdf } from "./configurator-project-pdf";
import { HttpsError, onCall } from "firebase-functions/v2/https";

import { sendConfiguratorLeadMail } from "./configurator-lead-mail";
import {
  type ConfiguratorLeadPayload,
  type ConfiguratorPayload,
  configuratorLeadPayloadSchema,
} from "./configurator-lead-validation";
import {
  type ConfiguratorSettings,
  DEFAULT_CONFIGURATOR_SETTINGS,
  buildConfiguratorPublicReference,
  configuratorSettingsSchema,
  nextConfiguratorReferenceSequence,
} from "./configurator-settings-model.js";
import { applyAuthoritativeConfiguratorModel } from "./configurator-server-model.js";
import {
  fingerprintConfiguratorSubmission,
  type ConfiguratorSubmissionRecord,
  type ConfiguratorSubmissionResult,
  type MailAttemptStatus,
} from "./configurator-submission-idempotency.js";

const LEADS_COLLECTION = "leads";
const SUBMISSIONS_COLLECTION = "configuratorSubmissions";

const ADMIN_REALTIME_COLLECTION = "adminRealtime";

const LEADS_REALTIME_DOCUMENT = "leads";

const MINIMUM_FORM_DURATION_MS = 1_500;

const CONFIGURATOR_SOURCE: Record<ConfiguratorPayload["type"], string> = {
  photovoltaic: "konfigurator/photovoltaik",

  battery_storage: "konfigurator/stromspeicher",

  wallbox: "konfigurator/wallbox",

  heat_pump: "konfigurator/waermepumpe",

  climate: "konfigurator/klimaanlage",
};

function optionalValue(value: string | undefined): string | null {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}

function buildStoredConfigurator(configurator: ConfiguratorPayload) {
  switch (configurator.type) {
    case "photovoltaic":
      return {
        type: "photovoltaic" as const,

        answers: {
          household: {
            ...configurator.answers.household,
          },

          building: {
            ...configurator.answers.building,
          },

          roof: {
            ...configurator.answers.roof,
          },

          interests: {
            ...configurator.answers.interests,
          },

          notes: {
            hasNotes: configurator.answers.notes.hasNotes,

            text: optionalValue(configurator.answers.notes.text),
          },
        },

        result: {
          ...configurator.result,
        },
      };

    case "battery_storage":
      return {
        type: "battery_storage" as const,

        answers: {
          ...configurator.answers,
        },

        result: {
          ...configurator.result,
        },
      };

    case "wallbox":
      return {
        type: "wallbox" as const,

        answers: {
          ...configurator.answers,
        },

        result: {
          ...configurator.result,
        },
      };

    case "heat_pump":
      return {
        type: "heat_pump" as const,

        answers: {
          ...configurator.answers,
        },

        result: {
          ...configurator.result,
        },
      };

    case "climate":
      return {
        type: "climate" as const,

        answers: {
          ...configurator.answers,
        },

        result: {
          ...configurator.result,
        },
      };
  }
}

function processingError(): HttpsError {
  return new HttpsError("unavailable", "Die Anfrage wird noch verarbeitet. Bitte versuche es erneut.");
}

async function claimMailAttempt(
  firestore: Firestore,
  submissionReference: DocumentReference,
  kind: "internal" | "customer",
): Promise<boolean> {
  return firestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(submissionReference);
    const record = snapshot.data() as ConfiguratorSubmissionRecord | undefined;
    if (record?.mail[kind].status !== "pending") return false;
    transaction.update(submissionReference, {
      [`mail.${kind}.status`]: "processing",
      updatedAt: FieldValue.serverTimestamp(),
    });
    return true;
  });
}

async function finishMailAttempt(
  firestore: Firestore,
  submissionReference: DocumentReference,
  leadReference: DocumentReference,
  kind: "internal" | "customer",
  status: "accepted" | "failed",
  messageId: string | null,
): Promise<void> {
  await firestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(submissionReference);
    const record = snapshot.data() as ConfiguratorSubmissionRecord | undefined;
    if (record?.mail[kind].status !== "processing") throw processingError();
    const timestamp = FieldValue.serverTimestamp();
    transaction.update(submissionReference, {
      [`mail.${kind}.status`]: status,
      updatedAt: timestamp,
    });
    transaction.update(leadReference, {
      [`mail.${kind}.status`]: status,
      [`mail.${kind}.provider`]: "mailgun",
      [`mail.${kind}.messageId`]: messageId,
      [`mail.${kind}.updatedAt`]: timestamp,
    });
  });
}

async function finishReport(
  firestore: Firestore,
  submissionReference: DocumentReference,
  leadReference: DocumentReference,
  status: "generated" | "failed",
  filename: string | null,
  sizeBytes: number | null,
): Promise<void> {
  await firestore.runTransaction(async (transaction) => {
    const timestamp = FieldValue.serverTimestamp();
    transaction.update(submissionReference, {
      "report.status": status,
      updatedAt: timestamp,
    });
    transaction.update(leadReference, {
      "report.status": status,
      "report.filename": filename,
      "report.sizeBytes": sizeBytes,
      "report.generatedAt": status === "generated" ? timestamp : null,
      "report.updatedAt": timestamp,
    });
  });
}

async function finalizeSubmission(
  firestore: Firestore,
  submissionReference: DocumentReference,
): Promise<ConfiguratorSubmissionResult> {
  return firestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(submissionReference);
    const record = snapshot.data() as ConfiguratorSubmissionRecord | undefined;
    if (!record) throw processingError();
    if (record.status === "completed" && record.result) return record.result;
    const internal = record.mail.internal.status;
    const customer = record.mail.customer.status;
    const report = record.report.status;
    const terminalMail = (status: MailAttemptStatus): status is "accepted" | "failed" =>
      status === "accepted" || status === "failed";
    if (!terminalMail(internal) || !terminalMail(customer) ||
      (report !== "generated" && report !== "failed")) throw processingError();
    const result: ConfiguratorSubmissionResult = {
      ok: true,
      leadId: record.leadId,
      publicReference: record.publicReference,
      mailStatus: internal,
      customerMailStatus: customer,
      reportStatus: report,
    };
    transaction.update(submissionReference, {
      status: "completed",
      result,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return result;
  });
}

interface ConfiguratorSubmissionDependencies {
  firestore: Firestore;
  sendInternalMail: typeof sendConfiguratorLeadMail;
  sendCustomerMail: typeof sendConfiguratorCustomerMail;
  generatePdf: typeof generateConfiguratorProjectPdf;
  log: Pick<typeof logger, "info" | "warn" | "error">;
}

export async function handleConfiguratorLeadRequest(
  data: unknown,
  dependencies: ConfiguratorSubmissionDependencies = {
    firestore: getFirestore(),
    sendInternalMail: sendConfiguratorLeadMail,
    sendCustomerMail: sendConfiguratorCustomerMail,
    generatePdf: generateConfiguratorProjectPdf,
    log: logger,
  },
): Promise<ConfiguratorSubmissionResult> {
    const logger = dependencies.log;
    const parsed = configuratorLeadPayloadSchema.safeParse(data);

      if (!parsed.success) {
      logger.warn("Invalid configurator lead payload", {
        issueCount: parsed.error.issues.length,
      });

        throw new HttpsError(
          "invalid-argument",
          "Die übermittelten Konfigurator-Daten sind ungültig.",
        );
      }

    const input: ConfiguratorLeadPayload = parsed.data;

      if (input.website) {
      logger.warn("Configurator lead honeypot triggered");

      throw new HttpsError("invalid-argument", "Die Anfrage konnte nicht verarbeitet werden.");
      }

    const source = CONFIGURATOR_SOURCE[input.journey.entryPoint];

    const firestore = dependencies.firestore;

    const leadReference = firestore.collection(LEADS_COLLECTION).doc();

    const realtimeReference = firestore
      .collection(ADMIN_REALTIME_COLLECTION)
      .doc(LEADS_REALTIME_DOCUMENT);

    const counterReference = firestore.collection("systemCounters").doc("configuratorLead");
    const submissionReference = firestore.collection(SUBMISSIONS_COLLECTION).doc(input.submissionId);
    const payloadFingerprint = fingerprintConfiguratorSubmission(input);
    let publicReference = "";
    let authoritativeInput: ConfiguratorLeadPayload = input;
    let settingsForPdf: ConfiguratorSettings = DEFAULT_CONFIGURATOR_SETTINGS;

    let existingSubmission: ConfiguratorSubmissionRecord | null;
    try {
      existingSubmission = await firestore.runTransaction(async (transaction) => {
      const submissionDocument = await transaction.get(submissionReference);
      if (submissionDocument.exists) {
        const existing = submissionDocument.data() as ConfiguratorSubmissionRecord;
        if (existing.payloadFingerprint !== payloadFingerprint) {
          logger.warn("Configurator submission payload mismatch", { submissionId: input.submissionId });
          throw new HttpsError("already-exists", "Diese Anfrage stimmt nicht mit der ursprünglichen Konfiguration überein.");
        }
        return existing;
      }
      if (Date.now() - input.formStartedAt < MINIMUM_FORM_DURATION_MS) {
        logger.warn("Configurator lead submitted too quickly", { submissionId: input.submissionId });
        throw new HttpsError("invalid-argument", "Die Anfrage konnte nicht verarbeitet werden.");
      }
      let authoritativeSettings =
        input.settingsVersion === 0 ? DEFAULT_CONFIGURATOR_SETTINGS : undefined;
      if (!authoritativeSettings) {
        const settingsDocument = await transaction.get(
          firestore.collection("configuratorSettingsVersions").doc(String(input.settingsVersion)),
        );
        const parsedSettings = configuratorSettingsSchema.safeParse(settingsDocument.data()?.settings);
        if (!parsedSettings.success) {
          throw new HttpsError(
            "failed-precondition",
            "Die verwendete Modellversion ist nicht mehr verfügbar. Bitte starte die Konfiguration neu.",
          );
        }
        authoritativeSettings = parsedSettings.data;
      }
      const counterDocument = await transaction.get(counterReference);
      const previousValue = counterDocument.data()?.lastValue;
      const sequence = nextConfiguratorReferenceSequence(previousValue);
      publicReference = buildConfiguratorPublicReference(input.products, sequence);
      authoritativeInput = applyAuthoritativeConfiguratorModel(input, authoritativeSettings);
      settingsForPdf = authoritativeSettings;
      const timestamp = FieldValue.serverTimestamp();

      transaction.set(counterReference, { lastValue: sequence, updatedAt: timestamp }, { merge: true });
      transaction.set(leadReference, {
          type: "configurator",
          submissionId: input.submissionId,

          status: "new",
          publicReference,
          settingsVersion: authoritativeSettings.version,
          settings: authoritativeSettings,

          contact: {
        firstName: authoritativeInput.contact.firstName,

        lastName: authoritativeInput.contact.lastName,

        email: authoritativeInput.contact.email,

        phone: optionalValue(authoritativeInput.contact.phone),
          },

          installation: {
        atResidence: authoritativeInput.installation.atResidence,

        street: authoritativeInput.installation.street,

        postalCode: authoritativeInput.installation.postalCode,

        city: authoritativeInput.installation.city,
          },

      products: [...authoritativeInput.products],

          journey: {
        entryPoint: authoritativeInput.journey.entryPoint,

        selectedProducts: [...authoritativeInput.journey.selectedProducts],

        completedProducts: [...authoritativeInput.journey.completedProducts],
          },

      configurators: authoritativeInput.configurators.map(buildStoredConfigurator),

      economics: authoritativeInput.economics,

          consent: {
            privacyAccepted: true,

        acceptedAt: timestamp,
          },

          meta: {
            source,

        schemaVersion: 4,
          },

      createdAt: timestamp,

      updatedAt: timestamp,
      });

      transaction.set(
        realtimeReference,
        {
        revision: FieldValue.increment(1),

        updatedAt: FieldValue.serverTimestamp(),
        },
        {
          merge: true,
        },
      );
      transaction.create(submissionReference, {
        submissionId: input.submissionId,
        payloadFingerprint,
        leadId: leadReference.id,
        publicReference,
        status: "processing",
        mail: {
          internal: { status: "pending" },
          customer: { status: "pending" },
        },
        report: { status: "pending" },
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      return null;
      });
    } catch (error) {
      if (error instanceof HttpsError) throw error;
      // A competing transaction may have won the create precondition. Read its mapping
      // before treating this as a new attempt; no side effect runs from this branch.
      const committed = await submissionReference.get();
      if (!committed.exists) throw error;
      const record = committed.data() as ConfiguratorSubmissionRecord;
      if (record.payloadFingerprint !== payloadFingerprint) {
        logger.warn("Configurator submission payload mismatch", { submissionId: input.submissionId });
        throw new HttpsError("already-exists", "Diese Anfrage stimmt nicht mit der ursprünglichen Konfiguration überein.");
      }
      existingSubmission = record;
    }

    if (existingSubmission) {
      if (existingSubmission.status === "completed") {
        logger.info("Configurator submission replay", {
          submissionId: input.submissionId,
          leadId: existingSubmission.leadId,
          publicReference: existingSubmission.publicReference,
          status: "completed",
        });
      } else {
        logger.info("Configurator submission already processing", {
          submissionId: input.submissionId,
          leadId: existingSubmission.leadId,
          status: existingSubmission.status,
        });
      }
      // A crash after the last status write can be finalized without another external action.
      return finalizeSubmission(firestore, submissionReference);
    }

    logger.info("Configurator submission created", {
      submissionId: input.submissionId,
      leadId: leadReference.id,
      publicReference,
      products: input.products,
      status: "processing",
    });

    const projectPdfFilename = "energie-kraft-" + publicReference + ".pdf";

    // Claim before Mailgun. A crash after acceptance leaves "processing" and is never resent
    // automatically, because Firestore cannot know whether the provider accepted the message.
    if (!await claimMailAttempt(firestore, submissionReference, "internal")) throw processingError();
    let internalStatus: "accepted" | "failed" = "failed";
    let internalMessageId: string | null = null;
    try {
      const mailResult = await dependencies.sendInternalMail({
        leadId: publicReference,
        lead: authoritativeInput,
      });
      internalStatus = "accepted";
      internalMessageId = mailResult.id;
      logger.info("Configurator lead notification accepted", {
        submissionId: input.submissionId,
        leadId: leadReference.id,
        products: input.products,
      });
    } catch (error) {
      logger.error("Configurator lead notification failed", {
        submissionId: input.submissionId,
        leadId: leadReference.id,
        errorName: error instanceof Error ? error.name : "Unknown",
      });
    }
    await finishMailAttempt(
      firestore, submissionReference, leadReference, "internal", internalStatus, internalMessageId,
    );

    // Report generation is in memory. Its failure never removes the saved lead.
    let projectPdf: Buffer | null = null;
    try {
      projectPdf = await dependencies.generatePdf({
        leadId: publicReference,
        lead: authoritativeInput,
        settings: settingsForPdf,
      });
      logger.info("Configurator project report generated", {
        submissionId: input.submissionId,
        leadId: leadReference.id,
        sizeBytes: projectPdf.length,
      });
    } catch (error) {
      logger.error("Configurator project report generation failed", {
        submissionId: input.submissionId,
        leadId: leadReference.id,
        errorName: error instanceof Error ? error.name : "Unknown",
      });
    }
    await finishReport(
      firestore, submissionReference, leadReference,
      projectPdf ? "generated" : "failed",
      projectPdf ? projectPdfFilename : null,
      projectPdf?.length ?? null,
    );

    if (!await claimMailAttempt(firestore, submissionReference, "customer")) throw processingError();
    let customerStatus: "accepted" | "failed" = "failed";
    let customerMessageId: string | null = null;
    if (projectPdf) {
      try {
        const customerMailResult = await dependencies.sendCustomerMail({
          leadId: publicReference,
          lead: authoritativeInput,
          pdf: projectPdf,
          filename: projectPdfFilename,
        });
        customerStatus = "accepted";
        customerMessageId = customerMailResult.id;
        logger.info("Configurator customer mail accepted", {
          submissionId: input.submissionId,
          leadId: leadReference.id,
        });
      } catch (error) {
        logger.error("Configurator customer mail failed", {
          submissionId: input.submissionId,
          leadId: leadReference.id,
          errorName: error instanceof Error ? error.name : "Unknown",
        });
      }
    }
    await finishMailAttempt(
      firestore, submissionReference, leadReference, "customer", customerStatus, customerMessageId,
    );

    logger.info("Configurator lead created", {
      submissionId: input.submissionId,
      leadId: leadReference.id,
      publicReference,
      products: input.products,
    });
    return finalizeSubmission(firestore, submissionReference);
}

export const submitConfiguratorLead = onCall(
  { maxInstances: 10, secrets: [mailgunSendingKey] },
  async (request) => handleConfiguratorLeadRequest(request.data),
);
