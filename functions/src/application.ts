import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { HttpsError, onCall } from "firebase-functions/v2/https";

import {
  sendApplicationAutoReply,
  sendApplicationInternalMail,
} from "./application-mail";
import {
  applicationPayloadSchema,
  getApplicationJobTitle,
} from "./application-validation";
import { mailgunSendingKey } from "./mailgun";
import { attemptMailDelivery, isAlreadyExistsError } from "./submission-workflow";
import { hasInvalidSubmissionSignals } from "./submission-security";

export const submitApplication = onCall(
  { maxInstances: 10, secrets: [mailgunSendingKey] },
  async (request) => {
    const parsed = applicationPayloadSchema.safeParse(request.data);
    if (!parsed.success) {
      logger.warn("Invalid application payload", { issueCount: parsed.error.issues.length });
      throw new HttpsError("invalid-argument", "Die übermittelten Bewerbungsdaten sind ungültig.");
    }

    const input = parsed.data;
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
    const batch = firestore.batch();

    batch.create(applicationReference, {
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
    });
    batch.set(
      realtimeReference,
      { revision: FieldValue.increment(1), updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );

    try {
      await batch.commit();
    } catch (error) {
      if (isAlreadyExistsError(error)) {
        logger.warn("Duplicate application suppressed", { applicationId: applicationReference.id });
        const existing = await applicationReference.get();
        const status = existing.data()?.mail?.internal?.status === "accepted" ? "accepted" : "failed";
        return { ok: true as const, applicationId: applicationReference.id, mailStatus: status };
      }
      logger.error("Application persistence failed", { error });
      throw new HttpsError("internal", "Die Bewerbung konnte nicht gespeichert werden.");
    }

    const mailInput = {
      applicationId: applicationReference.id,
      jobTitle,
      receivedAt,
      application: input,
    };
    const internal = await attemptMailDelivery(
      () => sendApplicationInternalMail(mailInput),
      (error) => logger.error("Application internal mail failed", { applicationId: applicationReference.id, error }),
    );
    const applicant = await attemptMailDelivery(
      () => sendApplicationAutoReply(mailInput),
      (error) => logger.error("Application autoreply failed", { applicationId: applicationReference.id, error }),
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
      .catch((error) => logger.error("Application mail status update failed", { applicationId: applicationReference.id, error }));

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
