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
import { INTERNAL_SUBMISSION_RECIPIENT } from "../../functions/src/mailgun";
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
  it("uses the one pre-launch recipient for every internal notification", () => {
    expect(INTERNAL_SUBMISSION_RECIPIENT).toBe("anfrage@energie-kraft.de");
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
    ).toBe(INTERNAL_SUBMISSION_RECIPIENT);
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
