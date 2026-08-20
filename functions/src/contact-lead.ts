import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import { contactLeadPayloadSchema } from "./contact-lead-validation";

const LEADS_COLLECTION = "leads";
const ADMIN_REALTIME_COLLECTION = "adminRealtime";
const LEADS_REALTIME_DOCUMENT = "leads";

const MINIMUM_FORM_DURATION_MS = 1_500;

function optionalValue(value: string | undefined): string | null {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}

export const submitContactLead = onCall(
  {
    maxInstances: 10,
  },
  async (request) => {
    const parsed = contactLeadPayloadSchema.safeParse(
      request.data,
    );

    if (!parsed.success) {
      logger.warn("Invalid contact lead payload", {
        issueCount: parsed.error.issues.length,
      });

      throw new HttpsError(
        "invalid-argument",
        "Die übermittelten Formulardaten sind ungültig.",
      );
    }

    const input = parsed.data;

    /*
     * Honeypot:
     * Das Feld wird im Formular für echte Benutzer unsichtbar sein.
     */
    if (input.website) {
      logger.warn("Contact lead honeypot triggered");

      throw new HttpsError(
        "invalid-argument",
        "Die Anfrage konnte nicht verarbeitet werden.",
      );
    }

    /*
     * Ein extrem schnell abgesendetes Formular ist ein einfaches
     * zusätzliches Indiz für automatisierte Requests.
     */
    if (
      input.formStartedAt !== undefined &&
      Date.now() - input.formStartedAt <
      MINIMUM_FORM_DURATION_MS
    ) {
      logger.warn("Contact lead submitted too quickly");

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

    const timestamp = FieldValue.serverTimestamp();

    const batch = firestore.batch();

    batch.set(leadReference, {
      type: "contact",
      status: "new",

      contact: {
        firstName: input.firstName,
        lastName: input.lastName,
        company: optionalValue(input.company),
        email: input.email,
        phone: optionalValue(input.phone),
      },

      location: {
        postalCode: input.postalCode,
        city: input.city,
      },

      project: {
        interests: input.interests,
        buildingType: input.buildingType ?? null,
        ownership: input.ownership ?? null,
      },

      message: input.message,

      preferredContact: input.preferredContact,

      consent: {
        privacyAccepted: true,
        acceptedAt: timestamp,
      },

      meta: {
        source: "kontakt",
        schemaVersion: 1,
      },

      createdAt: timestamp,
      updatedAt: timestamp,
    });

    batch.set(
      realtimeReference,
      {
        revision: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      },
      {
        merge: true,
      },
    );

    await batch.commit();

    logger.info("Contact lead created", {
      leadId: leadReference.id,
      source: "kontakt",
    });

    return {
      ok: true,
      leadId: leadReference.id,
    };
  },
);