import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildClimateConfiguratorResult } from "@/lib/configurator/climate";
import { buildConfiguratorLeadInput } from "@/lib/configurator/lead";
import { configuratorReducer, createInitialConfiguratorState } from "@/lib/configurator/state";
import type { SubmitConfiguratorLeadInput } from "@/types/configurator";
import { fingerprintConfiguratorSubmission } from "../../functions/src/configurator-submission-idempotency";

const mocks = vi.hoisted(() => ({
  internalMail: vi.fn(async () => ({ id: "internal-message" })),
  customerMail: vi.fn(async () => ({ id: "customer-message" })),
  pdf: vi.fn(async () => Buffer.from("%PDF-test")),
  info: vi.fn(), warn: vi.fn(), error: vi.fn(),
}));

type StoredDocument = Record<string, unknown>;
type Reference = { id: string; path: string };

class FakeFirestore {
  readonly documents = new Map<string, StoredDocument>();
  private nextLead = 0;
  private queue = Promise.resolve();
  leadCreates = 0;
  counterWrites = 0;
  realtimeWrites = 0;

  collection(collection: string) {
    return {
      doc: (id?: string): Reference => {
        const documentId = id ?? `lead-${++this.nextLead}`;
        return { id: documentId, path: `${collection}/${documentId}` };
      },
    };
  }

  async runTransaction<T>(callback: (transaction: {
    get: (reference: Reference) => Promise<{ exists: boolean; data: () => StoredDocument | undefined }>;
    set: (reference: Reference, value: StoredDocument, options?: { merge?: boolean }) => void;
    create: (reference: Reference, value: StoredDocument) => void;
    update: (reference: Reference, value: StoredDocument) => void;
  }) => Promise<T>): Promise<T> {
    const run = async () => {
      const writes: Array<{ operation: "set" | "create" | "update"; reference: Reference;
        value: StoredDocument; merge?: boolean }> = [];
      const transaction = {
        get: async (reference: Reference) => {
          const value = this.documents.get(reference.path);
          return { exists: value !== undefined, data: () => value && structuredClone(value) };
        },
        set: (reference: Reference, value: StoredDocument, options?: { merge?: boolean }) => {
          writes.push({ operation: "set" as const, reference, value, merge: options?.merge });
        },
        create: (reference: Reference, value: StoredDocument) => {
          writes.push({ operation: "create" as const, reference, value });
        },
        update: (reference: Reference, value: StoredDocument) => {
          writes.push({ operation: "update" as const, reference, value });
        },
      };
      const result = await callback(transaction);
      for (const write of writes) {
        const previous = this.documents.get(write.reference.path);
        if (write.operation === "create" && previous) throw new Error("Document already exists");
        if (write.operation === "update" && !previous) throw new Error("Document missing");
        const document: StoredDocument = write.operation === "set" && !write.merge
          ? {} : structuredClone(previous ?? {});
        for (const [path, value] of Object.entries(write.value)) {
          const parts = path.split(".");
          let target = document;
          for (const part of parts.slice(0, -1)) {
            target[part] ??= {};
            target = target[part] as StoredDocument;
          }
          const key = parts.at(-1)!;
          const transform = typeof value === "object" && value !== null
            ? value.constructor.name : "";
          target[key] = transform === "NumericIncrementTransform"
            ? Number(target[key] ?? 0) + Number((value as { operand: number }).operand)
            : transform === "ServerTimestampTransform"
              ? "test-timestamp" : structuredClone(value);
        }
        this.documents.set(write.reference.path, document);
        if (write.operation === "set" && write.reference.path.startsWith("leads/")) this.leadCreates++;
        if (write.reference.path === "systemCounters/configuratorLead") this.counterWrites++;
        if (write.reference.path === "adminRealtime/leads") this.realtimeWrites++;
      }
      return result;
    };
    const next = this.queue.then(run, run);
    this.queue = next.then(() => undefined, () => undefined);
    return next;
  }

  get(path: string): StoredDocument | undefined { return this.documents.get(path); }
}

let fakeFirestore = new FakeFirestore();

import { handleConfiguratorLeadRequest } from "../../functions/src/configurator-lead";
const firstId = "ec36c0e2-166f-4ea0-8738-cbe44e695bc5";
const secondId = "fe924b38-73ba-4d26-a322-381c98d8df2e";

function createInput(submissionId = firstId): SubmitConfiguratorLeadInput {
  let state = configuratorReducer(createInitialConfiguratorState(), {
    type: "SET_ACTIVE_CONFIGURATOR", payload: "climate",
  });
  state = configuratorReducer(state, { type: "UPDATE_CLIMATE", payload: {
    conditionedAreaM2: 80, roomCount: 4, insulationLevel: "average",
    solarLoad: "medium", occupancyPersons: 4,
  } });
  const result = buildClimateConfiguratorResult(state);
  if (!result) throw new Error("Climate fixture incomplete");
  state = configuratorReducer(state, { type: "SET_CLIMATE_RESULT", payload: result });
  state = configuratorReducer(state, {
    type: "SET_SUBMISSION", payload: { id: submissionId, status: "idle" },
  });
  const input = buildConfiguratorLeadInput(state, {
    firstName: "Test", lastName: "Project", email: "test@example.invalid", phone: "",
    installationAtResidence: true, street: "Testweg 1", postalCode: "83395",
    city: "Freilassing", privacyAccepted: true, website: "",
  }, Date.now() - 10_000);
  if (!input) throw new Error("Lead fixture incomplete");
  return input;
}

async function submit(input: SubmitConfiguratorLeadInput) {
  const dependencies = {
    firestore: fakeFirestore,
    sendInternalMail: mocks.internalMail,
    sendCustomerMail: mocks.customerMail,
    generatePdf: mocks.pdf,
    log: { info: mocks.info, warn: mocks.warn, error: mocks.error },
  } as unknown as NonNullable<Parameters<typeof handleConfiguratorLeadRequest>[1]>;
  return handleConfiguratorLeadRequest(input, dependencies);
}

function expectOneSubmission() {
  expect(fakeFirestore.leadCreates).toBe(1);
  expect(fakeFirestore.counterWrites).toBe(1);
  expect(fakeFirestore.realtimeWrites).toBe(1);
  expect(fakeFirestore.get("systemCounters/configuratorLead")?.lastValue).toBe(1);
  expect(fakeFirestore.get("adminRealtime/leads")?.revision).toBe(1);
  expect(mocks.internalMail).toHaveBeenCalledTimes(1);
  expect(mocks.customerMail).toHaveBeenCalledTimes(1);
  expect(mocks.pdf).toHaveBeenCalledTimes(1);
}

beforeEach(() => {
  fakeFirestore = new FakeFirestore();
  vi.clearAllMocks();
  mocks.internalMail.mockResolvedValue({ id: "internal-message" });
  mocks.customerMail.mockResolvedValue({ id: "customer-message" });
  mocks.pdf.mockResolvedValue(Buffer.from("%PDF-test"));
});

describe("configurator submission idempotency", () => {
  it("rejects an invalid submission ID before any persistence", async () => {
    await expect(submit({ ...createInput(), submissionId: "predictable" }))
      .rejects.toMatchObject({ code: "invalid-argument" });
    expect(fakeFirestore.leadCreates).toBe(0);
    expect(mocks.internalMail).not.toHaveBeenCalled();
  });

  it("atomically creates one lead, reference, counter and realtime revision", async () => {
    const result = await submit(createInput());
    expect(result).toMatchObject({
      ok: true, leadId: "lead-1", mailStatus: "accepted",
      customerMailStatus: "accepted", reportStatus: "generated",
    });
    expect(result.publicReference).toMatch(/^KA-/);
    expect(fakeFirestore.get("leads/lead-1")?.submissionId).toBe(firstId);
    expect(fakeFirestore.get(`configuratorSubmissions/${firstId}`)?.status).toBe("completed");
    expectOneSubmission();
  });

  it("returns the identical completed result on sequential replay without side effects", async () => {
    const input = createInput();
    const first = await submit(input);
    const second = await submit(input);
    expect(second).toEqual(first);
    expectOneSubmission();
  });

  it("finalizes terminal stored statuses after a lost final response", async () => {
    const input = createInput();
    const first = await submit(input);
    const record = fakeFirestore.get(`configuratorSubmissions/${firstId}`);
    if (!record) throw new Error("Submission record missing");
    record.status = "processing";
    delete record.result;
    expect(await submit(input)).toEqual(first);
    expect(fakeFirestore.get(`configuratorSubmissions/${firstId}`)?.status).toBe("completed");
    expectOneSubmission();
  });

  it("recovers after a lost response and ignores changed form timing", async () => {
    const input = createInput();
    await submit(input); // Caller does not receive or retain the result.
    const recovered = await submit({ ...input, formStartedAt: Date.now() });
    expect(recovered.leadId).toBe("lead-1");
    expect(recovered).toEqual(fakeFirestore.get(`configuratorSubmissions/${firstId}`)?.result);
    expectOneSubmission();
  });

  it("rejects a changed project or contact for an existing ID", async () => {
    const input = createInput();
    await submit(input);
    await expect(submit({ ...input, contact: { ...input.contact, email: "other@example.invalid" } }))
      .rejects.toMatchObject({ code: "already-exists" });
    const changedProject = structuredClone(input);
    const climate = changedProject.configurators[0];
    if (climate?.type !== "climate") throw new Error("Climate fixture missing");
    climate.answers.occupancyPersons = 5;
    await expect(submit(changedProject)).rejects.toMatchObject({ code: "already-exists" });
    expect(mocks.warn).toHaveBeenCalledWith("Configurator submission payload mismatch", {
      submissionId: firstId,
    });
    expectOneSubmission();
  });

  it("blocks a concurrent duplicate while the first mail pipeline is running", async () => {
    let release!: (value: { id: string }) => void;
    const pending = new Promise<{ id: string }>((resolve) => { release = resolve; });
    mocks.internalMail.mockImplementationOnce(() => pending);
    const input = createInput();
    const first = submit(input);
    await vi.waitFor(() => expect(mocks.internalMail).toHaveBeenCalledTimes(1));
    await expect(submit(input)).rejects.toMatchObject({ code: "unavailable" });
    expect(fakeFirestore.get(`configuratorSubmissions/${firstId}`)?.mail).toMatchObject({
      internal: { status: "processing" },
    });
    release({ id: "internal-message" });
    const completed = await first;
    expect(await submit(input)).toEqual(completed);
    expectOneSubmission();
  });

  it("never resends a processing mail after an ambiguous crash", async () => {
    const input = createInput();
    fakeFirestore.documents.set(`configuratorSubmissions/${firstId}`, {
      submissionId: firstId,
      payloadFingerprint: fingerprintConfiguratorSubmission(input as Parameters<typeof fingerprintConfiguratorSubmission>[0]),
      leadId: "lead-existing",
      publicReference: "KL-00001",
      status: "processing",
      mail: { internal: { status: "processing" }, customer: { status: "pending" } },
      report: { status: "pending" },
    });
    await expect(submit(input)).rejects.toMatchObject({ code: "unavailable" });
    expect(mocks.internalMail).not.toHaveBeenCalled();
    expect(mocks.customerMail).not.toHaveBeenCalled();
    expect(fakeFirestore.leadCreates).toBe(0);
  });

  it("reports failed mail attempts and does not resend them on replay", async () => {
    mocks.internalMail.mockRejectedValueOnce(new Error("mail unavailable"));
    mocks.customerMail.mockRejectedValueOnce(new Error("mail unavailable"));
    const input = createInput();
    const first = await submit(input);
    expect(first).toMatchObject({ mailStatus: "failed", customerMailStatus: "failed" });
    expect(await submit(input)).toEqual(first);
    expectOneSubmission();
  });

  it("keeps the saved lead when report generation fails and skips customer mail", async () => {
    mocks.pdf.mockRejectedValueOnce(new Error("PDF unavailable"));
    const result = await submit(createInput());
    expect(result).toMatchObject({ reportStatus: "failed", customerMailStatus: "failed" });
    expect(mocks.customerMail).not.toHaveBeenCalled();
    expect(fakeFirestore.get("leads/lead-1")?.report).toMatchObject({ status: "failed" });
    expect(fakeFirestore.leadCreates).toBe(1);
  });

  it("allows a genuinely new ID for the same customer and project", async () => {
    const first = await submit(createInput(firstId));
    const second = await submit(createInput(secondId));
    expect(second.leadId).not.toBe(first.leadId);
    expect(second.publicReference).not.toBe(first.publicReference);
    expect(fakeFirestore.leadCreates).toBe(2);
    expect(fakeFirestore.get("systemCounters/configuratorLead")?.lastValue).toBe(2);
    expect(fakeFirestore.get("adminRealtime/leads")?.revision).toBe(2);
    expect(mocks.internalMail).toHaveBeenCalledTimes(2);
    expect(mocks.customerMail).toHaveBeenCalledTimes(2);
  });
});
