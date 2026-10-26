import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  record: null as Record<string, unknown> | null,
  failInternal: false,
  failCustomer: false,
}));

const { database } = vi.hoisted(() => {
  const leadReference = {
    id: "lead-1",
    update: async (value: Record<string, unknown>) => {
      if (!state.record) throw new Error("missing lead");
      state.record = { ...state.record, ...value };
    },
  };
  const realtimeReference = { id: "leads" };
  const database = {
    collection: (name: string) => ({
      doc: () => (name === "leads" ? leadReference : realtimeReference),
    }),
    batch: () => ({
      set: (reference: unknown, value: Record<string, unknown>) => {
        if (reference === leadReference) state.record = value;
      },
      commit: async () => undefined,
    }),
  };
  return { database };
});

vi.mock("firebase-admin/firestore", () => ({
  FieldValue: { serverTimestamp: () => "timestamp", increment: (value: number) => value },
  getFirestore: () => database,
}));
vi.mock("../../functions/node_modules/firebase-admin/lib/esm/firestore/index.js", () => ({
  FieldValue: { serverTimestamp: () => "timestamp", increment: (value: number) => value },
  getFirestore: () => database,
}));
vi.mock("../../functions/src/contact-lead-mail", () => ({
  sendContactLeadMail: vi.fn(async () => {
    if (state.failInternal) throw new Error("mock internal failure");
    return { id: "internal-message", message: "mock only" };
  }),
  sendContactCustomerConfirmation: vi.fn(async () => {
    if (state.failCustomer) throw new Error("mock customer failure");
    return { id: "customer-message", message: "mock only" };
  }),
}));
vi.mock("../../functions/src/mailgun", () => ({
  getMailgunErrorDetails: (error: unknown) => ({
    provider: "mailgun",
    errorName: error instanceof Error ? error.name : "Unknown",
    errorMessage: error instanceof Error ? error.message : "Unknown mail error",
  }),
  mailgunSendingKey: { value: () => "mock-only" },
}));

import { submitContactLead } from "../../functions/src/contact-lead";
import { sendContactLeadMail } from "../../functions/src/contact-lead-mail";

const input = {
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

const submit = () =>
  submitContactLead.run({ data: input } as Parameters<typeof submitContactLead.run>[0]);

beforeEach(() => {
  state.record = null;
  state.failInternal = false;
  state.failCustomer = false;
  vi.clearAllMocks();
});

describe("contact lead mail workflow", () => {
  it("persists the normalized street and passes it to mail generation", async () => {
    await submitContactLead.run({ data: { ...input, street: "  Musterstraße 12  " } } as Parameters<typeof submitContactLead.run>[0]);
    expect(state.record?.location).toEqual({ street: "Musterstraße 12", postalCode: "83404", city: "Ainring" });
    expect(sendContactLeadMail).toHaveBeenCalledWith(expect.objectContaining({ lead: expect.objectContaining({ street: "Musterstraße 12" }) }));
  });

  it("continues to save legacy submissions without street", async () => {
    await submit();
    expect(state.record?.location).toEqual({ street: null, postalCode: "83404", city: "Ainring" });
  });

  it("keeps the saved lead and records customer success when internal mail fails", async () => {
    state.failInternal = true;

    const result = await submit();

    expect(result).toMatchObject({ ok: true, mailStatus: "failed", customerMailStatus: "accepted" });
    expect(state.record).not.toBeNull();
    expect(state.record?.["mail.internal.status"]).toBe("failed");
    expect(state.record?.["mail.customer.status"]).toBe("accepted");
    expect(state.record?.["mail.customer.messageId"]).toBe("customer-message");
  });

  it("keeps the saved lead and records internal success when confirmation fails", async () => {
    state.failCustomer = true;

    const result = await submit();

    expect(result).toMatchObject({ ok: true, mailStatus: "accepted", customerMailStatus: "failed" });
    expect(state.record).not.toBeNull();
    expect(state.record?.["mail.internal.status"]).toBe("accepted");
    expect(state.record?.["mail.internal.messageId"]).toBe("internal-message");
    expect(state.record?.["mail.customer.status"]).toBe("failed");
  });
});
