import { describe, expect, it } from "vitest";

import {
  buildApplicationAutoReply,
  buildApplicationInternalMail,
} from "../../functions/src/application-mail";
import { buildConfiguratorLeadMail } from "../../functions/src/configurator-lead-mail";
import type { ConfiguratorLeadPayload } from "../../functions/src/configurator-lead-validation";
import {
  buildContactCustomerConfirmation,
  buildContactLeadMail,
} from "../../functions/src/contact-lead-mail";
import type { ContactLeadPayload } from "../../functions/src/contact-lead-validation";
import { APPLICATION_SUBMISSION_RECIPIENT, INTERNAL_SUBMISSION_RECIPIENT } from "../../functions/src/mailgun";
import {
  buildReferralInternalMail,
  buildReferrerConfirmation,
} from "../../functions/src/referral-mail";

const contact: ContactLeadPayload = {
  firstName: "Erika",
  lastName: "Musterfrau",
  email: "erika@example.test",
  postalCode: "83404",
  city: "Ainring",
  interests: ["photovoltaik"],
  message: "Bitte melden Sie sich bei mir.",
  preferredContact: "email",
  privacyAccepted: true,
};

const application = {
  submissionId: "64e33d4b-c882-49f4-a0f6-625a47a10ee8",
  jobId: "elektriker",
  firstName: "Max",
  lastName: "Mustermann",
  street: "Musterweg 1",
  postalCode: "83404",
  city: "Ainring",
  email: "max@example.test",
  phone: "+49 8654 123456",
  qualificationExperience: "Erfahrung in der Elektrotechnik.",
  privacyAccepted: true,
};

const referral = {
  submissionId: "795df3fb-3e8d-4615-966c-f72c8e465273",
  referrer: {
    salutation: "frau" as const,
    firstName: "Erika",
    lastName: "Musterfrau",
    email: "erika@example.test",
  },
  referredCustomer: {
    salutation: "herr" as const,
    firstName: "Max",
    lastName: "Mustermann",
    email: "max@example.test",
    street: "Musterweg 1",
    postalCode: "83404",
    city: "Ainring",
  },
  privacyAccepted: true,
  referredPersonPermissionConfirmed: true,
};

const configurator = {
  settingsVersion: 1,
  products: [],
  configurators: [],
  journey: { entryPoint: "photovoltaic", completedProducts: [] },
  contact: { firstName: "Erika", lastName: "Musterfrau", email: "erika@example.test" },
  installation: {
    atResidence: true,
    street: "Musterweg 1",
    postalCode: "83404",
    city: "Ainring",
  },
} as ConfiguratorLeadPayload;

describe("submission mail recipients", () => {
  it.each([undefined, []])("builds application notifications without documents (%s)", (documents) => {
    const input = {
      applicationId: application.submissionId,
      jobTitle: "Elektriker:in (w/m/d)",
      receivedAt: "2026-09-24T12:00:00.000Z",
      application,
      documents,
    };
    const mail = buildApplicationInternalMail(input);
    expect(mail.text).toContain("Unterlagen: 0");
    expect(mail.html).toContain("Unterlagen (0)");
    expect(mail.html).not.toContain("undefined");
    expect(buildApplicationAutoReply(input).to).toBe(application.email);
  });
  it("routes customer inquiries and applications to their dedicated recipients", () => {
    expect(INTERNAL_SUBMISSION_RECIPIENT).toBe("anfragen@energie-kraft.de");
    expect(APPLICATION_SUBMISSION_RECIPIENT).toBe("bewerbung@energie-kraft.de");
    expect(buildContactLeadMail({ leadId: "lead-1", lead: contact }).to).toBe(
      INTERNAL_SUBMISSION_RECIPIENT,
    );
    expect(
      buildApplicationInternalMail({
        applicationId: application.submissionId,
        jobTitle: "Elektriker:in",
        receivedAt: "2026-09-24T12:00:00.000Z",
        application,
      }).to,
    ).toBe(APPLICATION_SUBMISSION_RECIPIENT);
    expect(
      buildReferralInternalMail({
        referralId: referral.submissionId,
        receivedAt: "2026-09-24T12:00:00.000Z",
        referral,
      }).to,
    ).toBe(INTERNAL_SUBMISSION_RECIPIENT);
    expect(buildConfiguratorLeadMail({ leadId: "EK-00001", lead: configurator }).to).toBe(
      INTERNAL_SUBMISSION_RECIPIENT,
    );
  });

  it.each(["photovoltaic", "battery_storage", "heat_pump"] as const)(
    "routes %s inquiries only to the customer inquiry mailbox",
    (product) => {
      const mail = buildConfiguratorLeadMail({
        leadId: "EK-00001",
        lead: { ...configurator, products: [product], journey: { ...configurator.journey, entryPoint: product } },
      });
      expect(mail.to).toBe("anfragen@energie-kraft.de");
      expect(mail).not.toHaveProperty("cc");
      expect(mail).not.toHaveProperty("bcc");
    },
  );

  it("keeps internal reply-to addresses and application confirmations correctly separated", () => {
    const input = {
      applicationId: application.submissionId,
      jobTitle: "Elektriker:in",
      receivedAt: "2026-09-24T12:00:00.000Z",
      application,
    };
    const contactMail = buildContactLeadMail({ leadId: "lead-1", lead: contact });
    const applicationMail = buildApplicationInternalMail(input);
    expect(contactMail.replyTo).toBe(contact.email);
    expect(applicationMail.replyTo).toBe(application.email);
    expect(buildApplicationAutoReply(input)).toMatchObject({
      to: application.email,
      replyTo: "bewerbung@energie-kraft.de",
    });
    for (const mail of [contactMail, applicationMail, buildApplicationAutoReply(input)]) {
      expect(mail).not.toHaveProperty("cc");
      expect(mail).not.toHaveProperty("bcc");
    }
  });

  it("sends contact confirmation to the requester with a reference", () => {
    const mail = buildContactCustomerConfirmation({ leadId: "lead-1", lead: contact });

    expect(mail.to).toBe(contact.email);
    expect(mail.replyTo).toBe(INTERNAL_SUBMISSION_RECIPIENT);
    expect(mail.text).toContain("lead-1");
    expect(mail.text).not.toContain(contact.message);
  });

  it("keeps user confirmations addressed to their submitted email", () => {
    expect(
      buildApplicationAutoReply({
        applicationId: application.submissionId,
        jobTitle: "Elektriker:in",
        receivedAt: "2026-09-24T12:00:00.000Z",
        application,
      }).to,
    ).toBe(application.email);
    expect(
      buildReferrerConfirmation({
        referralId: referral.submissionId,
        receivedAt: "2026-09-24T12:00:00.000Z",
        referral,
      }).to,
    ).toBe(referral.referrer.email);
  });
});
