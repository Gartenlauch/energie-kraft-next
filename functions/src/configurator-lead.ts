import {
  FieldValue,
  getFirestore,
} from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  sendConfiguratorLeadMail,
} from "./configurator-lead-mail";
import {
  type ConfiguratorLeadPayload,
  type ConfiguratorPayload,
  configuratorLeadPayloadSchema,
} from "./configurator-lead-validation";
import {
  mailgunSendingKey,
} from "./mailgun";

const LEADS_COLLECTION = "leads";

const ADMIN_REALTIME_COLLECTION =
  "adminRealtime";

const LEADS_REALTIME_DOCUMENT =
  "leads";

const MINIMUM_FORM_DURATION_MS =
  1_500;

const CONFIGURATOR_SOURCE: Record<
  ConfiguratorPayload["type"],
  string
> = {
  photovoltaic:
    "konfigurator/photovoltaik",

  battery_storage:
    "konfigurator/stromspeicher",

  wallbox:
    "konfigurator/wallbox",

  heat_pump:
    "konfigurator/waermepumpe",

  climate:
    "konfigurator/klimaanlage",
};

function optionalValue(
  value: string | undefined,
): string | null {
  const normalized =
    value?.trim();

  return normalized
    ? normalized
    : null;
}

function buildStoredConfigurator(
  configurator: ConfiguratorPayload,
) {
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
            hasNotes:
              configurator.answers.notes
                .hasNotes,

            text: optionalValue(
              configurator.answers.notes
                .text,
            ),
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

export const submitConfiguratorLead =
  onCall(
    {
      maxInstances: 10,

      secrets: [
        mailgunSendingKey,
      ],
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

      const input:
        ConfiguratorLeadPayload =
        parsed.data;

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
        Date.now() -
        input.formStartedAt <
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

      const configuratorType =
        input.configurator.type;

      const source =
        CONFIGURATOR_SOURCE[
        configuratorType
        ];

      const firestore =
        getFirestore();

      const leadReference =
        firestore
          .collection(
            LEADS_COLLECTION,
          )
          .doc();

      const realtimeReference =
        firestore
          .collection(
            ADMIN_REALTIME_COLLECTION,
          )
          .doc(
            LEADS_REALTIME_DOCUMENT,
          );

      const timestamp =
        FieldValue.serverTimestamp();

      const batch =
        firestore.batch();

      batch.set(
        leadReference,
        {
          type: "configurator",

          status: "new",

          contact: {
            firstName:
              input.contact.firstName,

            lastName:
              input.contact.lastName,

            email:
              input.contact.email,

            phone:
              optionalValue(
                input.contact.phone,
              ),
          },

          installation: {
            atResidence:
              input.installation
                .atResidence,

            street:
              input.installation
                .street,

            postalCode:
              input.installation
                .postalCode,

            city:
              input.installation
                .city,
          },

          configurator:
            buildStoredConfigurator(
              input.configurator,
            ),

          consent: {
            privacyAccepted: true,

            acceptedAt:
              timestamp,
          },

          meta: {
            source,

            schemaVersion: 2,
          },

          createdAt:
            timestamp,

          updatedAt:
            timestamp,
        },
      );

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
       * Lead und Realtime-Signal werden
       * vollständig gespeichert, bevor
       * Mailgun aufgerufen wird.
       */
      await batch.commit();

      let mailStatus:
        | "accepted"
        | "failed" =
        "accepted";

      let mailMessageId:
        string | null =
        null;

      try {
        const mailResult =
          await sendConfiguratorLeadMail(
            {
              leadId:
                leadReference.id,

              lead: input,
            },
          );

        mailMessageId =
          mailResult.id;

        await leadReference.update(
          {
            "mail.internal.status":
              "accepted",

            "mail.internal.provider":
              "mailgun",

            "mail.internal.messageId":
              mailMessageId,

            "mail.internal.updatedAt":
              FieldValue.serverTimestamp(),
          },
        );

        logger.info(
          "Configurator lead notification accepted",
          {
            leadId:
              leadReference.id,

            configuratorType,

            provider:
              "mailgun",

            messageId:
              mailMessageId,
          },
        );
      } catch (error) {
        mailStatus =
          "failed";

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
          .catch(
            () => undefined,
          );

        logger.error(
          "Configurator lead notification failed",
          {
            leadId:
              leadReference.id,

            configuratorType,

            provider:
              "mailgun",

            error:
              error instanceof Error
                ? {
                  name:
                    error.name,

                  message:
                    error.message,
                }
                : "Unknown mail error",
          },
        );
      }

      logger.info(
        "Configurator lead created",
        {
          leadId:
            leadReference.id,

          configuratorType,

          source,
        },
      );

      return {
        ok: true,

        leadId:
          leadReference.id,

        mailStatus,
      };
    },
  );