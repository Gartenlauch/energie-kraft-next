import { describe, expect, it, vi } from "vitest";
import { requireStaffCaller } from "../../functions/src/admin-authorization";

describe("operative callable authorization", () => {
  it.each([{ role: "staff" }, { role: "admin" }, { admin: true }])("accepts active role %j", async (claims) => {
    const readIdentity = vi.fn(async () => ({ account: { customClaims: claims, disabled: false, email: "user@example.test" } }));
    expect(await requireStaffCaller({ auth: { uid: "user", token: { ...claims, auth_time: 100 } } } as never, readIdentity)).toEqual({ uid: "user", email: "user@example.test" });
    expect(readIdentity).toHaveBeenCalledWith("user");
  });
  it("rejects removed, disabled, revoked and pending accounts", async () => {
    const request = { auth: { uid: "user", token: { role: "staff", auth_time: 100 } } } as never;
    for (const account of [{ disabled: true, customClaims: { role: "staff" } }, { disabled: false, customClaims: {} }, { disabled: false, customClaims: { role: "staff" }, tokensValidAfterTime: new Date(101000).toISOString() }]) {
      await expect(requireStaffCaller(request, async () => ({ account }))).rejects.toMatchObject({ code: "permission-denied" });
    }
    await expect(requireStaffCaller(request, async () => ({ account: { disabled: false, customClaims: { role: "staff" } }, profile: { pending: true } }))).rejects.toMatchObject({ code: "permission-denied" });
  });
  it("rejects unauthenticated requests before any data lookup", async () => {
    const reader = vi.fn();
    await expect(requireStaffCaller({} as never, reader)).rejects.toMatchObject({ code: "permission-denied" });
    expect(reader).not.toHaveBeenCalled();
  });
});
