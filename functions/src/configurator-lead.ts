import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import { sendConfiguratorLeadMail } from "./configurator-lead-mail";
import { configuratorLeadPayloadSchema } from "./configurator-lead-validation";
import { mailgunSendingKey } from "./mailgun";

const LEADS_COLLECTION = "leads";
const ADMIN_REALTIME_COLLECTION = "adminRealtime";
const LEADS_REALTIME_DOCUMENT = "leads";

const MINIMUM_FORM_DURATION_MS = 1_500;

function optionalValue(
  value: string | undefined,
): string | null {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}

export const submitConfiguratorLead = onCall(
  {
    maxInstances: 10,
    secrets: [mailgunSendingKey],
  },
  async (request) => {
    const parsed =
      configuratorLeadPayloadSchema.safeParse(
        request.data,
      );

    if (!parsed.success) {
      logger.warn(
        "Invalid configurator lead payload",
        {
          issueCount:
            parsed.error.issues.length,
        },
      );

      throw new HttpsError(
        "invalid-argument",
        "Die übermittelten Konfigurator-Daten sind ungültig.",
      );
    }

    const input = parsed.data;

    if (input.website) {
      logger.warn(
        "Configurator lead honeypot triggered",
      );

      throw new HttpsError(
        "invalid-argument",
        "Die Anfrage konnte nicht verarbeitet werden.",
      );
    }

    if (
      Date.now() - input.formStartedAt <
      MINIMUM_FORM_DURATION_MS
    ) {
      logger.warn(
        "Configurator lead submitted too quickly",
      );

      throw new HttpsError(
        "invalid-argument",
        "Die Anfrage konnte nicht verarbeitet werden.",
      );
    }

    const firestore = getFirestore();

    const leadReference = firestore
      .collection(LEADS_COLLECTION)
      .doc();

    const realtimeReference = firestore
      .collection(ADMIN_REALTIME_COLLECTION)
      .doc(LEADS_REALTIME_DOCUMENT);

    const timestamp =
      FieldValue.serverTimestamp();

    const answers =
      input.configurator.answers;

    const batch = firestore.batch();

    batch.set(leadReference, {
      type: "configurator",
      status: "new",

      contact: {
        firstName: input.contact.firstName,
        lastName: input.contact.lastName,
        email: input.contact.email,
        phone: optionalValue(
          input.contact.phone,
        ),
      },

      installation: {
        atResidence:
          input.installation.atResidence,
        street: input.installation.street,
        postalCode:
          input.installation.postalCode,
        city: input.installation.city,
      },

      configurator: {
        type: "photovoltaic",

        answers: {
          household: {
            ...answers.household,
          },

          building: {
            ...answers.building,
          },

          roof: {
            ...answers.roof,
          },

          interests: {
            ...answers.interests,
          },

          notes: {
            hasNotes:
              answers.notes.hasNotes,
            text: optionalValue(
              answers.notes.text,
            ),
          },
        },

        result: {
          ...input.configurator.result,
        },
      },

      consent: {
        privacyAccepted: true,
        acceptedAt: timestamp,
      },

      meta: {
        source:
          "konfigurator/photovoltaik",
        schemaVersion: 1,
      },

      createdAt: timestamp,
      updatedAt: timestamp,
    });

    batch.set(
      realtimeReference,
      {
        revision:
          FieldValue.increment(1),
        updatedAt:
          FieldValue.serverTimestamp(),
      },
      {
        merge: true,
      },
    );

    /*
     * Wichtig:
     * Der Lead und das Realtime-Signal werden
     * vollständig gespeichert, bevor Mailgun
     * aufgerufen wird.
     */
    await batch.commit();

    let mailStatus:
      | "accepted"
      | "failed" = "accepted";

    let mailMessageId:
      | string
      | null = null;

    try {
      const mailResult =
        await sendConfiguratorLeadMail({
          leadId: leadReference.id,
          lead: input,
        });

      mailMessageId = mailResult.id;

      await leadReference.update({
        "mail.internal.status":
          "accepted",
        "mail.internal.provider":
          "mailgun",
        "mail.internal.messageId":
          mailMessageId,
        "mail.internal.updatedAt":
          FieldValue.serverTimestamp(),
      });

      logger.info(
        "Configurator lead notification accepted",
        {
          leadId: leadReference.id,
          provider: "mailgun",
          messageId: mailMessageId,
        },
      );
    } catch (error) {
      mailStatus = "failed";

      await leadReference
        .update({
          "mail.internal.status":
            "failed",
          "mail.internal.provider":
            "mailgun",
          "mail.internal.messageId":
            null,
          "mail.internal.updatedAt":
            FieldValue.serverTimestamp(),
        })
        .catch(() => undefined);

      logger.error(
        "Configurator lead notification failed",
        {
          leadId: leadReference.id,
          provider: "mailgun",
          error:
            error instanceof Error
              ? {
                  name: error.name,
                  message: error.message,
                }
              : "Unknown mail error",
        },
      );
    }

    logger.info(
      "Configurator lead created",
      {
        leadId: leadReference.id,
        source:
          "konfigurator/photovoltaik",
      },
    );

    return {
      ok: true,
      leadId: leadReference.id,
      mailStatus,
    };
  },
);