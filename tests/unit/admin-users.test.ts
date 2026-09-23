import { describe, expect, it, vi } from "vitest";
import type { Auth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";
import {
  claimsForRole,
  effectiveAdminRole,
  resolveAdminRole,
} from "../../functions/src/admin-role";
import { assertAdminChangeAllowed, createUserManagement } from "@/lib/admin/user-management";
import {
  managedUserSchema,
  MAX_AVATAR_BYTES,
  userInitials,
  validateAvatar,
} from "@/lib/admin/user-model";

const input = {
  firstName: "Max",
  lastName: "Mustermann",
  displayName: "Max Mustermann",
  email: "max@example.test",
  phone: "+49 1234",
  jobTitle: "Beratung",
  role: "staff" as const,
  active: true,
};
const actor = { uid: "admin-a", role: "admin" as const };
function account(uid: string, role = "admin", disabled = false) {
  return {
    uid,
    email: `${uid}@example.test`,
    displayName: uid,
    disabled,
    customClaims: { role } as Record<string, unknown>,
    metadata: {},
  };
}

function harness() {
  const accounts = new Map([
    ["admin-a", account("admin-a")],
    ["admin-b", account("admin-b")],
    ["staff", account("staff", "staff")],
  ]);
  const stored = new Map<string, Record<string, unknown>>();
  const ref = (path: string) => ({
    path,
    id: path.split("/").at(-1)!,
    get: async () => ({ exists: stored.has(path), data: () => stored.get(path) }),
    set: vi.fn(async (data: Record<string, unknown>) => {
      stored.set(path, { ...stored.get(path), ...data });
    }),
  });
  let chain: Promise<unknown> = Promise.resolve();
  const db = {
    collection: (name: string) => ({
      doc: (uid: string) => ref(`${name}/${uid}`),
      get: async () => ({
        docs: [...stored]
          .filter(([key]) => key.startsWith(`${name}/`))
          .map(([key, value]) => ({ id: key.split("/").at(-1), data: () => value })),
      }),
    }),
    runTransaction: <T>(work: (t: unknown) => Promise<T>) => {
      const next = chain.then(() =>
        work({
          get: (r: ReturnType<typeof ref>) => r.get(),
          create: (r: ReturnType<typeof ref>, data: Record<string, unknown>) =>
            stored.set(r.path, data),
          delete: (r: ReturnType<typeof ref>) => stored.delete(r.path),
        }),
      );
      chain = next.catch(() => undefined);
      return next;
    },
  };
  const auth = {
    getUser: vi.fn(async (uid: string) => {
      const user = accounts.get(uid);
      if (!user) throw new Error("missing");
      return { ...user };
    }),
    listUsers: vi.fn(async () => ({ users: [...accounts.values()] })),
    createUser: vi.fn(async (data: object) => {
      const user = { ...account("created", "staff"), customClaims: {}, ...data };
      accounts.set(user.uid, user);
      return user;
    }),
    updateUser: vi.fn(async (uid: string, data: object) => {
      const user = { ...accounts.get(uid)!, ...data };
      accounts.set(uid, user);
      return user;
    }),
    setCustomUserClaims: vi.fn(async (uid: string, claims: Record<string, unknown>) => {
      accounts.get(uid)!.customClaims = claims;
    }),
    revokeRefreshTokens: vi.fn(async () => undefined),
    deleteUser: vi.fn(async (uid: string) => {
      accounts.delete(uid);
    }),
  };
  const sendPasswordEmail = vi.fn(async () => undefined);
  const service = createUserManagement({
    auth: auth as unknown as Auth,
    db: db as unknown as Firestore,
    sendPasswordEmail,
  });
  return { service, auth, stored, accounts, sendPasswordEmail };
}

describe("admin roles and live access", () => {
  it.each([
    [{ admin: true }, "admin"],
    [{ role: "admin" }, "admin"],
    [{ role: "staff" }, "staff"],
    [{ role: "staff", admin: true }, "staff"],
    [{}, null],
    [{ role: "unknown", admin: true }, null],
  ])("resolves trusted claims %j", (claims, expected) =>
    expect(resolveAdminRole(claims)).toBe(expected),
  );
  it("preserves unrelated claims but removes legacy elevation for staff", () =>
    expect(claimsForRole({ admin: true, other: 1 }, "staff")).toEqual({
      admin: false,
      role: "staff",
      other: 1,
    }));
  it("denies disabled, pending, archived and revoked access", () => {
    const token = { role: "admin", auth_time: 100 };
    expect(effectiveAdminRole(token, { ...account("a"), disabled: true })).toBeNull();
    for (const profile of [{ active: false }, { archived: true }, { pending: true }])
      expect(effectiveAdminRole(token, account("a"), profile)).toBeNull();
    expect(
      effectiveAdminRole(token, {
        ...account("a"),
        tokensValidAfterTime: new Date(101_000).toISOString(),
      }),
    ).toBeNull();
  });
  it("does not elevate stale tokens and applies live demotion", () => {
    expect(effectiveAdminRole({ role: "staff" }, account("a"))).toBe("staff");
    expect(effectiveAdminRole({ role: "admin" }, account("a", "staff"))).toBe("staff");
    expect(
      effectiveAdminRole({ admin: true }, { ...account("a"), customClaims: { admin: true } }),
    ).toBe("admin");
  });
});

describe("managed users", () => {
  it("does not lock the sole administrator out after a failed self-profile update", async () => {
    const h = harness();
    h.accounts.delete("admin-b");
    h.auth.setCustomUserClaims.mockRejectedValueOnce(new Error("unavailable"));
    await expect(h.service.save(actor, { ...input, role: "admin", email: "admin-a@example.test" }, actor.uid)).rejects.toThrow("Administratorrechte bleiben erhalten");
    expect(h.stored.get("adminUsers/admin-a")?.pending).toBe(false);
    expect(effectiveAdminRole({ role: "admin" }, h.accounts.get("admin-a")!, h.stored.get("adminUsers/admin-a"))).toBe("admin");
  });
  it("creates a disabled-first account without a password and commits claims/profile", async () => {
    const h = harness();
    expect(await h.service.save(actor, input)).toBe("created");
    expect(h.auth.createUser).toHaveBeenCalledWith({
      email: input.email,
      displayName: input.displayName,
      disabled: true,
    });
    expect(h.accounts.get("created")).toMatchObject({
      disabled: false,
      customClaims: { role: "staff", admin: false },
    });
    expect(h.stored.get("adminUsers/created")).toMatchObject({ ...input, pending: false });
  });
  it("rejects staff creation, forged admin actors, avatar writes and password requests", async () => {
    const h = harness();
    await expect(h.service.save({ uid: "staff", role: "staff" }, input)).rejects.toThrow(
      "Administrator",
    );
    await expect(h.service.save({ uid: "staff", role: "admin" }, input)).rejects.toThrow(
      "Administrator",
    );
    const upload = vi.fn(async () => "photo");
    await expect(
      h.service.photo({ uid: "staff", role: "staff" }, "staff", upload),
    ).rejects.toThrow();
    await expect(
      h.service.passwordEmail({ uid: "staff", role: "staff" }, "staff"),
    ).rejects.toThrow();
    expect(upload).not.toHaveBeenCalled();
    expect(h.auth.createUser).not.toHaveBeenCalled();
  });
  it.each([
    { active: false, role: "admin" },
    { active: true, role: "staff" },
  ])("blocks self change %j", async (change) => {
    const h = harness();
    await expect(h.service.save(actor, { ...input, ...change }, actor.uid)).rejects.toThrow(
      "eigene",
    );
    expect(h.auth.updateUser).not.toHaveBeenCalled();
  });
  it("blocks self deletion", async () => {
    const h = harness();
    await expect(h.service.archive(actor, actor.uid, `${actor.uid}@example.test`)).rejects.toThrow(
      "eigene",
    );
  });
  it.each([
    { active: false, role: "admin" },
    { active: true, role: "staff" },
    { active: false, role: "staff" },
  ])("protects the final administrator including legacy accounts %j", (next) => {
    expect(() =>
      assertAdminChangeAllowed(
        "other",
        { ...account("last"), customClaims: { admin: true } },
        next,
        1,
      ),
    ).toThrow("letzte");
  });
  it("serializes competing administrators so mutual demotions cannot remove both", async () => {
    const h = harness();
    const results = await Promise.allSettled([
      h.service.save(actor, input, "admin-b"),
      h.service.save({ uid: "admin-b", role: "admin" }, input, "admin-a"),
    ]);
    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect(
      [...h.accounts.values()].filter((user) => resolveAdminRole(user.customClaims) === "admin"),
    ).toHaveLength(1);
  });
  it("updates email and role, preserves unrelated claims and revokes sessions", async () => {
    const h = harness();
    h.accounts.get("staff")!.customClaims = { role: "staff", tenant: "existing" };
    await h.service.save(actor, { ...input, role: "admin" }, "staff");
    expect(h.accounts.get("staff")).toMatchObject({
      email: input.email,
      customClaims: { role: "admin", admin: true, tenant: "existing" },
    });
    expect(h.auth.revokeRefreshTokens).toHaveBeenCalledWith("staff");
  });
  it("deactivates login and preserves profile history", async () => {
    const h = harness();
    await h.service.save(actor, { ...input, active: false }, "staff");
    expect(h.accounts.get("staff")?.disabled).toBe(true);
    expect(h.stored.get("adminUsers/staff")?.active).toBe(false);
  });
  it("requires delete confirmation then archives profile and removes login", async () => {
    const h = harness();
    await expect(h.service.archive(actor, "staff", "wrong")).rejects.toThrow("bestätigen");
    await h.service.archive(actor, "staff", "staff@example.test");
    expect(h.accounts.has("staff")).toBe(false);
    expect(h.stored.get("adminUsers/staff")).toMatchObject({
      archived: true,
      active: false,
      pending: false,
    });
  });
  it("leaves partial claim failures pending and repairs on retry", async () => {
    const h = harness();
    h.auth.setCustomUserClaims.mockRejectedValueOnce(new Error("unavailable"));
    await expect(h.service.save(actor, input, "staff")).rejects.toThrow("unvollständig");
    expect(h.stored.get("adminUsers/staff")?.pending).toBe(true);
    await h.service.save(actor, input, "staff");
    expect(h.stored.get("adminUsers/staff")?.pending).toBe(false);
  });
  it("does not delete a created user if password email fails", async () => {
    const h = harness();
    const uid = await h.service.save(actor, input);
    h.sendPasswordEmail.mockRejectedValueOnce(new Error("mail unavailable"));
    await expect(h.service.passwordEmail(actor, uid)).rejects.toThrow("Konto bleibt bestehen");
    expect(h.accounts.has(uid)).toBe(true);
    expect(h.auth.deleteUser).not.toHaveBeenCalled();
  });
});

describe("profile validation and avatars", () => {
  it.each([
    { email: "bad" },
    { role: "owner" },
    { firstName: "" },
    { displayName: "" },
    { active: "yes" },
  ])("rejects invalid input %j", (bad) =>
    expect(managedUserSchema.safeParse({ ...input, ...bad }).success).toBe(false),
  );
  it("uses initials", () => expect(userInitials("Max Mustermann")).toBe("MM"));
  it("rejects unsupported types, spoofed signatures and oversize data", () => {
    expect(() => validateAvatar(new Uint8Array([1, 2]), "image/svg+xml")).toThrow();
    expect(() => validateAvatar(new Uint8Array([1, 2]), "image/png")).toThrow();
    expect(() => validateAvatar(new Uint8Array(MAX_AVATAR_BYTES + 1), "image/jpeg")).toThrow(
      "2 MB",
    );
    expect(() =>
      validateAvatar(new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), "image/png"),
    ).not.toThrow();
  });
});
