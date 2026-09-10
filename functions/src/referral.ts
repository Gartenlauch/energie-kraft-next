import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { HttpsError, onCall } from "firebase-functions/v2/https";

import { mailgunSendingKey } from "./mailgun";
import {
  sendReferredCustomerNotice,
  sendReferralInternalMail,
  sendReferrerConfirmation,
} from "./referral-mail";
import { referralPayloadSchema } from "./referral-validation";
import { attemptMailDelivery, isAlreadyExistsError } from "./submission-workflow";
import { hasInvalidSubmissionSignals } from "./submission-security";

function getOverallMailStatus(statuses: readonly ("accepted" | "failed")[]) {
  const acceptedCount = statuses.filter((status) => status === "accepted").length;
  if (acceptedCount === statuses.length) return "accepted" as const;
  if (acceptedCount > 0) return "partial" as const;
  return "failed" as const;
}

export const submitReferral = onCall(
  { maxInstances: 10, secrets: [mailgunSendingKey] },
  async (request) => {
    const parsed = referralPayloadSchema.safeParse(request.data);
    if (!parsed.success) {
      logger.warn("Invalid referral payload", { issueCount: parsed.error.issues.length });
      throw new HttpsError("invalid-argument", "Die übermittelten Empfehlungsdaten sind ungültig.");
    }

    const input = parsed.data;
    if (hasInvalidSubmissionSignals(input)) {
      logger.warn("Referral spam plausibility check triggered");
      throw new HttpsError("invalid-argument", "Die Empfehlung konnte nicht verarbeitet werden.");
    }

    const firestore = getFirestore();
    const referralReference = firestore.collection("referrals").doc(input.submissionId);
    const realtimeReference = firestore.collection("adminRealtime").doc("referrals");
    const timestamp = FieldValue.serverTimestamp();
    const receivedAt = new Date().toISOString();
    const batch = firestore.batch();

    batch.create(referralReference, {
      status: "new",
      referrer: input.referrer,
      referredCustomer: {
        ...input.referredCustomer,
        phone: input.referredCustomer.phone ?? null,
      },
      consent: {
        privacy: true,
        referredPersonPermissionConfirmed: true,
        submittedAt: timestamp,
      },
      campaign: {
        // BUSINESS_RECONFIRM_BEFORE_GO_LIVE
        rewardEuro: 250,
        termsVersion: "2025-03-01",
        verificationStatus: "business-reconfirm-before-go-live",
      },
      meta: { source: "kunden-werben-kunden", schemaVersion: 1 },
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
        logger.warn("Duplicate referral suppressed", { referralId: referralReference.id });
        const existing = await referralReference.get();
        const mail = existing.data()?.mail;
        const status = getOverallMailStatus([
          mail?.internal?.status === "accepted" ? "accepted" : "failed",
          mail?.referrer?.status === "accepted" ? "accepted" : "failed",
          mail?.referredCustomer?.status === "accepted" ? "accepted" : "failed",
        ]);
        return { ok: true as const, referralId: referralReference.id, mailStatus: status };
      }
      logger.error("Referral persistence failed", { error });
      throw new HttpsError("internal", "Die Empfehlung konnte nicht gespeichert werden.");
    }

    const mailInput = { referralId: referralReference.id, receivedAt, referral: input };
    const internal = await attemptMailDelivery(
      () => sendReferralInternalMail(mailInput),
      (error) => logger.error("Referral internal mail failed", { referralId: referralReference.id, error }),
    );
    const referrer = await attemptMailDelivery(
      () => sendReferrerConfirmation(mailInput),
      (error) => logger.error("Referral confirmation failed", { referralId: referralReference.id, error }),
    );
    const referredCustomer = await attemptMailDelivery(
      () => sendReferredCustomerNotice(mailInput),
      (error) => logger.error("Referred customer notice failed", { referralId: referralReference.id, error }),
    );

    await referralReference
      .update({
        "mail.internal.status": internal.status,
        "mail.internal.provider": "mailgun",
        "mail.internal.messageId": internal.messageId,
        "mail.internal.updatedAt": FieldValue.serverTimestamp(),
        "mail.referrer.status": referrer.status,
        "mail.referrer.provider": "mailgun",
        "mail.referrer.messageId": referrer.messageId,
        "mail.referrer.updatedAt": FieldValue.serverTimestamp(),
        "mail.referredCustomer.status": referredCustomer.status,
        "mail.referredCustomer.provider": "mailgun",
        "mail.referredCustomer.messageId": referredCustomer.messageId,
        "mail.referredCustomer.updatedAt": FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      })
      .catch((error) => logger.error("Referral mail status update failed", { referralId: referralReference.id, error }));

    const mailStatus = getOverallMailStatus([
      internal.status,
      referrer.status,
      referredCustomer.status,
    ]);
    logger.info("Referral created", { referralId: referralReference.id, mailStatus });
    return { ok: true as const, referralId: referralReference.id, mailStatus };
  },
);
