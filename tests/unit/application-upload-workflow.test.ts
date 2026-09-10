import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  records: new Map<string, Record<string, unknown>>(),
  objects: new Map<string, Buffer>(),
  events: [] as string[],
  failUpload: false,
  failDelete: false,
  failMail: false,
  admin: false,
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/session", () => ({
  getAdminSession: async () => (state.admin ? { uid: "test-admin" } : null),
}));
vi.mock("../../functions/src/application-mail", () => ({
  sendApplicationInternalMail: vi.fn(async () => {
    state.events.push("mail");
    if (state.failMail) throw Error("mock mail failure");
    return { id: "test-mail", message: "mock only" };
  }),
  sendApplicationAutoReply: vi.fn(async () => ({ id: "test-reply", message: "mock only" })),
}));
vi.mock("firebase-admin/firestore", () => ({
  FieldValue: { serverTimestamp: () => "timestamp", increment: (value: number) => value },
  getFirestore: () => database,
}));
vi.mock("firebase-admin/storage", () => ({ getStorage: () => ({ bucket: () => bucket }) }));
// Functions has its own firebase-admin installation; mock that resolved entry too.
vi.mock("../../functions/node_modules/firebase-admin/lib/esm/firestore/index.js", () => ({
  FieldValue: { serverTimestamp: () => "timestamp", increment: (value: number) => value },
  getFirestore: () => database,
}));
vi.mock("../../functions/node_modules/firebase-admin/lib/esm/storage/index.js", () => ({
  getStorage: () => ({ bucket: () => bucket }),
}));
vi.mock("@/lib/firebase/admin", () => ({
  adminFirestore: database,
  adminStorage: { bucket: () => bucket },
}));

const { database, bucket } = vi.hoisted(() => {
  function reference(id: string) {
    return {
      id,
      get: async () => ({ exists: state.records.has(id), data: () => state.records.get(id) }),
      update: async (value: Record<string, unknown>) => {
        if (!state.records.has(id)) throw Error("missing");
        state.events.push(`update:${value.uploadState ?? "mail"}`);
        state.records.set(id, { ...state.records.get(id), ...value });
      },
      set: async () => undefined,
    };
  }
  const database = {
    collection: () => ({ doc: reference }),
    runTransaction: async (work: (tx: object) => Promise<unknown>) =>
      work({
        get: (ref: ReturnType<typeof reference>) => ref.get(),
        create: (ref: ReturnType<typeof reference>, value: Record<string, unknown>) => {
          state.events.push("reserve");
          state.records.set(ref.id, value);
        },
        update: (ref: ReturnType<typeof reference>, value: Record<string, unknown>) => {
          state.events.push(`update:${value.uploadState}`);
          state.records.set(ref.id, { ...state.records.get(ref.id), ...value });
        },
        set: () => undefined,
      }),
    batch: () => {
      let id: string;
      return {
        delete: (ref: ReturnType<typeof reference>) => {
          id = ref.id;
        },
        set: () => undefined,
        commit: async () => {
          state.records.delete(id);
        },
      };
    },
  };
  const bucket = {
    file: (path: string) => ({
      save: async (bytes: Buffer) => {
        state.events.push("upload");
        state.objects.set(path, bytes);
        if (state.failUpload) throw Error("mock interrupted upload");
      },
      delete: async () => {
        state.events.push("remove");
        if (state.failDelete) throw Error("mock storage unavailable");
        state.objects.delete(path);
      },
      getMetadata: async () => [{ size: state.objects.get(path)?.length }],
      download: async () => {
        const bytes = state.objects.get(path);
        if (!bytes) throw Error("missing object");
        return [bytes];
      },
    }),
  };
  return { database, bucket };
});

import { submitApplication } from "../../functions/src/application";
import { deleteApplication } from "@/lib/submissions/application-repository";
import { GET as download } from "@/app/api/admin/applications/[applicationId]/documents/[documentId]/route";

const bytes = Buffer.from("%PDF-1.7\n%%EOF");
const input = {
  submissionId: "64e33d4b-c882-49f4-a0f6-625a47a10ee8",
  jobId: "elektriker",
  firstName: "Upload",
  lastName: "Test",
  street: "Testweg 1",
  postalCode: "83404",
  city: "Ainring",
  email: "upload@example.invalid",
  phone: "08654123456",
  qualificationExperience: "Lokaler Upload-Workflow-Test.",
  privacyAccepted: true,
  documents: [
    {
      name: "CV.pdf",
      contentType: "application/pdf",
      size: bytes.length,
      base64: bytes.toString("base64"),
    },
  ],
};
const submit = (data = input) =>
  submitApplication.run({ data } as Parameters<typeof submitApplication.run>[0]);

beforeEach(() => {
  state.records.clear();
  state.objects.clear();
  state.events = [];
  state.failUpload = false;
  state.failDelete = false;
  state.failMail = false;
  state.admin = false;
  vi.clearAllMocks();
});
describe("application upload persistence (mock infrastructure, no emails)", () => {
  it("reserves metadata before Storage, then mails; mail failure never loses files/data", async () => {
    state.failMail = true;
    const result = await submit();
    expect(result.ok).toBe(true);
    expect(result.mailStatus).toBe("failed");
    expect(state.events.indexOf("reserve")).toBeLessThan(state.events.indexOf("upload"));
    expect(state.events.indexOf("upload")).toBeLessThan(state.events.indexOf("mail"));
    expect(state.records.get(input.submissionId)?.uploadState).toBe("ready");
    expect(JSON.stringify(state.records.get(input.submissionId))).not.toContain(
      bytes.toString("base64"),
    );
    expect(state.objects.size).toBe(1);
  });
  it("suppresses duplicate uploads/mails and binds the ID to the same payload", async () => {
    await submit();
    await submit();
    expect(state.events.filter((event) => event === "upload")).toHaveLength(1);
    expect(state.events.filter((event) => event === "mail")).toHaveLength(1);
    await expect(submit({ ...input, firstName: "Changed" })).rejects.toMatchObject({
      code: "already-exists",
    });
  });
  it("cleans interrupted writes, preserves application data and retries the same paths", async () => {
    state.failUpload = true;
    await expect(submit()).rejects.toMatchObject({ code: "unavailable" });
    const documents = state.records.get(input.submissionId)?.documents;
    expect(state.objects.size).toBe(0);
    expect(state.events).not.toContain("mail");
    expect(state.records.get(input.submissionId)?.uploadState).toBe("upload_failed");
    state.failUpload = false;
    await submit();
    expect((state.records.get(input.submissionId)?.documents as { id: string }[])[0]!.id).toBe(
      (documents as { id: string }[])[0]!.id,
    );
    expect(state.objects.size).toBe(1);
  });
  it("tracks paths if cleanup fails and never lets an active upload race deletion", async () => {
    state.failDelete = true;
    await expect(submit()).rejects.toMatchObject({ code: "unavailable" });
    expect(state.records.get(input.submissionId)?.cleanupPending).toBe(true);
    const data = state.records.get(input.submissionId)!;
    state.records.set(input.submissionId, { ...data, uploadLeaseUntil: Date.now() + 180_000 });
    await expect(deleteApplication(input.submissionId)).rejects.toThrow(/übertragen/);
    await expect(submit()).rejects.toMatchObject({ code: "aborted" });
  });
  it("deletes Storage before Firestore and retains failed deletions for retry", async () => {
    await submit();
    state.failDelete = true;
    await expect(deleteApplication(input.submissionId)).rejects.toThrow(/erneuten Bereinigung/);
    expect(state.records.get(input.submissionId)?.uploadState).toBe("deleting");
    expect(state.objects.size).toBe(1);
    await expect(submit()).rejects.toMatchObject({ code: "aborted" });
    state.failDelete = false;
    await deleteApplication(input.submissionId);
    expect(state.records.has(input.submissionId)).toBe(false);
    expect(state.objects.size).toBe(0);
  });
  it("rejects spoofed bytes before any writes", async () => {
    await expect(
      submit({
        ...input,
        documents: [
          { ...input.documents[0]!, base64: Buffer.alloc(bytes.length).toString("base64") },
        ],
      }),
    ).rejects.toMatchObject({ code: "invalid-argument" });
    expect(state.events).toEqual([]);
  });
  it("authorizes every download and checks application/document ownership", async () => {
    await submit();
    const documentId = (state.records.get(input.submissionId)?.documents as { id: string }[])[0]!
      .id;
    const params = Promise.resolve({ applicationId: input.submissionId, documentId });
    const request = new Request("http://localhost/api/admin/applications/test/documents/test");
    expect((await download(request, { params })).status).toBe(401);
    state.admin = true;
    const response = await download(request, { params });
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toContain("no-store");
    expect(response.headers.get("Content-Disposition")).toContain("attachment");
    expect(Buffer.from(await response.arrayBuffer())).toEqual(bytes);
    const wrong = Promise.resolve({
      applicationId: "11111111-1111-4111-8111-111111111111",
      documentId,
    });
    expect((await download(request, { params: wrong })).status).toBe(404);
  });
});
