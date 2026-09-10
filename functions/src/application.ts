import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { createHash } from "node:crypto";
import { logger } from "firebase-functions";
import { HttpsError, onCall } from "firebase-functions/v2/https";

import { sendApplicationAutoReply, sendApplicationInternalMail } from "./application-mail";
import { applicationPayloadSchema, getApplicationJobTitle } from "./application-validation";
import { mailgunSendingKey } from "./mailgun";
import { attemptMailDelivery } from "./submission-workflow";
import { hasInvalidSubmissionSignals } from "./submission-security";
import {
  planApplicationDocuments,
  removeApplicationDocuments,
  validateApplicationDocumentBytes,
} from "./application-documents";
import type { ApplicationFileMetadata } from "./shared/application-file-policy";

export const submitApplication = onCall(
  {
    maxInstances: 10,
    memory: "512MiB",
    concurrency: 4,
    timeoutSeconds: 120,
    secrets: [mailgunSendingKey],
  },
  async (request) => {
    const parsed = applicationPayloadSchema.safeParse(request.data);
    if (!parsed.success) {
      logger.warn("Invalid application payload", { issueCount: parsed.error.issues.length });
      throw new HttpsError("invalid-argument", "Die übermittelten Bewerbungsdaten sind ungültig.");
    }

    const input = parsed.data;
    let fileBytes: Buffer[];
    try {
      fileBytes = validateApplicationDocumentBytes(input.documents);
    } catch (error) {
      throw new HttpsError(
        "invalid-argument",
        error instanceof Error ? error.message : "Ungültige Dokumente.",
      );
    }
    if (hasInvalidSubmissionSignals(input)) {
      logger.warn("Application spam plausibility check triggered");
      throw new HttpsError("invalid-argument", "Die Bewerbung konnte nicht verarbeitet werden.");
    }

    const jobTitle = getApplicationJobTitle(input.jobId);
    if (!jobTitle) {
      throw new HttpsError("invalid-argument", "Die ausgewählte Stelle ist nicht verfügbar.");
    }

    const firestore = getFirestore();
    const applicationReference = firestore.collection("applications").doc(input.submissionId);
    const realtimeReference = firestore.collection("adminRealtime").doc("applications");
    const timestamp = FieldValue.serverTimestamp();
    const receivedAt = new Date().toISOString();
    // Every possible Storage object is tracked BEFORE the first byte is written.
    // A lease prevents concurrent retries/deletion racing an in-flight upload.
    const payloadHash = createHash("sha256")
      .update(JSON.stringify({ ...input, formStartedAt: undefined, website: undefined }))
      .digest("hex");
    let documents = planApplicationDocuments(input.submissionId, input.documents);
    let duplicate = false;
    try {
      await firestore.runTransaction(async (transaction) => {
        const existing = await transaction.get(applicationReference);
        duplicate = false;
        if (existing.exists) {
          const data = existing.data()!;
          if (data.payloadHash !== payloadHash)
            throw new HttpsError(
              "already-exists",
              "Diese Übermittlungs-ID wurde bereits verwendet. Bitte lade das Formular neu.",
            );
          if (data.uploadState === "ready") {
            duplicate = true;
            return;
          }
          if (data.uploadState === "deleting" || data.uploadLeaseUntil > Date.now())
            throw new HttpsError(
              "aborted",
              "Die Bewerbung wird noch verarbeitet. Bitte warte kurz und versuche es erneut.",
            );
          documents = data.documents as ApplicationFileMetadata[];
          transaction.update(applicationReference, {
            uploadState: "uploading",
            uploadLeaseUntil: Date.now() + 180_000,
            updatedAt: timestamp,
          });
          return;
        }
        transaction.create(applicationReference, {
          status: "new",
          jobId: input.jobId,
          jobTitle,
          salutation: input.salutation ?? null,
          firstName: input.firstName,
          lastName: input.lastName,
          street: input.street,
          postalCode: input.postalCode,
          city: input.city,
          email: input.email,
          phone: input.phone,
          qualificationExperience: input.qualificationExperience,
          consent: { privacy: true, submittedAt: timestamp },
          meta: { source: "bewerbung", schemaVersion: 1 },
          createdAt: timestamp,
          updatedAt: timestamp,
          documents,
          payloadHash,
          uploadState: "uploading",
          uploadLeaseUntil: Date.now() + 180_000,
        });
        transaction.set(
          realtimeReference,
          { revision: FieldValue.increment(1), updatedAt: FieldValue.serverTimestamp() },
          { merge: true },
        );
      });
    } catch (error) {
      if (error instanceof HttpsError) throw error;
      logger.error("Application persistence failed", { applicationId: applicationReference.id });
      throw new HttpsError("internal", "Die Bewerbung konnte nicht gespeichert werden.");
    }
    if (duplicate) {
      const existing = await applicationReference.get();
      return {
        ok: true as const,
        applicationId: applicationReference.id,
        mailStatus: existing.data()?.mail?.internal?.status === "accepted" ? "accepted" : "failed",
      };
    }

    const bucket = getStorage().bucket();
    const remove = (path: string) => bucket.file(path).delete({ ignoreNotFound: true });
    try {
      // Also cleans a previous interrupted attempt, using the SAME tracked paths.
      await removeApplicationDocuments(documents, remove);
      for (const [index, document] of documents.entries()) {
        const bytes = fileBytes[index];
        if (!bytes) throw new Error("Missing validated document bytes");
        await bucket.file(document.storagePath).save(bytes, {
          resumable: false,
          metadata: {
            contentType: document.contentType,
            cacheControl: "private, no-store",
            contentDisposition: "attachment",
          },
        });
      }
      documents = documents.map((document) => ({
        ...document,
        uploadedAt: new Date().toISOString(),
      }));
      await applicationReference.update({
        documents,
        uploadState: "ready",
        uploadLeaseUntil: 0,
        cleanupPending: false,
        updatedAt: FieldValue.serverTimestamp(),
      });
      await realtimeReference.set(
        { revision: FieldValue.increment(1), updatedAt: FieldValue.serverTimestamp() },
        { merge: true },
      );
    } catch {
      let cleanupPending = false;
      try {
        await removeApplicationDocuments(documents, remove);
      } catch {
        cleanupPending = true;
      }
      // Retain the application and all paths even if cleanup is temporarily unavailable.
      await applicationReference
        .update({
          uploadState: "upload_failed",
          uploadLeaseUntil: 0,
          cleanupPending,
          updatedAt: FieldValue.serverTimestamp(),
        })
        .catch(() => {
          logger.error("Application upload state update failed; tracked paths retained", {
            applicationId: applicationReference.id,
          });
        });
      throw new HttpsError(
        "unavailable",
        "Die Unterlagen konnten nicht vollständig gespeichert werden. Deine Angaben bleiben erhalten. Bitte versuche es mit denselben Dateien erneut.",
      );
    }

    const mailInput = {
      applicationId: applicationReference.id,
      jobTitle,
      receivedAt,
      application: input,
      documents,
    };
    const internal = await attemptMailDelivery(
      () => sendApplicationInternalMail(mailInput),
      (error) =>
        logger.error("Application internal mail failed", {
          applicationId: applicationReference.id,
          error,
        }),
    );
    const applicant = await attemptMailDelivery(
      () => sendApplicationAutoReply(mailInput),
      (error) =>
        logger.error("Application autoreply failed", {
          applicationId: applicationReference.id,
          error,
        }),
    );

    await applicationReference
      .update({
        "mail.internal.status": internal.status,
        "mail.internal.provider": "mailgun",
        "mail.internal.messageId": internal.messageId,
        "mail.internal.updatedAt": FieldValue.serverTimestamp(),
        "mail.applicant.status": applicant.status,
        "mail.applicant.provider": "mailgun",
        "mail.applicant.messageId": applicant.messageId,
        "mail.applicant.updatedAt": FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      })
      .catch((error) =>
        logger.error("Application mail status update failed", {
          applicationId: applicationReference.id,
          error,
        }),
      );

    logger.info("Application created", {
      applicationId: applicationReference.id,
      jobId: input.jobId,
      mailStatus: internal.status,
    });
    return {
      ok: true as const,
      applicationId: applicationReference.id,
      mailStatus: internal.status,
    };
  },
);
