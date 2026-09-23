import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  cookies: vi.fn(),
  verify: vi.fn(),
  identity: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`);
  }),
}));
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: mocks.cookies }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/lib/firebase/admin", () => ({ adminAuth: { verifySessionCookie: mocks.verify } }));
vi.mock("@/lib/auth/live-role", () => ({ getLiveAdminIdentity: mocks.identity }));
import {
  getAdminSession,
  getStaffSession,
  requireAdminSession,
  requireStaffSession,
} from "@/lib/auth/session";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.cookies.mockResolvedValue({ get: () => ({ value: "cookie" }) });
  mocks.verify.mockResolvedValue({ uid: "test-user", iat: 100, exp: 200 });
  mocks.identity.mockResolvedValue({
    role: "admin",
    account: { email: "test@example.test", displayName: "Test Benutzer" },
    profile: undefined,
  });
});

describe("server session role boundaries", () => {
  it("allows an administrator to require admin-only access with revocation checking", async () => {
    expect((await requireAdminSession()).role).toBe("admin");
    expect(mocks.verify).toHaveBeenCalledWith("cookie", true);
  });
  it("allows staff operational access but refuses settings/users/FAQ access", async () => {
    mocks.identity.mockResolvedValue({ role: "staff", account: { email: "staff@example.test" } });
    expect((await requireStaffSession()).role).toBe("staff");
    expect(await getAdminSession()).toBeNull();
    await expect(requireAdminSession()).rejects.toThrow("redirect:/admin");
  });
  it("denies inactive or otherwise invalid identities", async () => {
    mocks.identity.mockResolvedValue(null);
    expect(await getStaffSession()).toBeNull();
    await expect(requireStaffSession()).rejects.toThrow("redirect:/admin/login");
  });
  it("does not verify absent cookies", async () => {
    mocks.cookies.mockResolvedValue({ get: () => undefined });
    expect(await getStaffSession()).toBeNull();
    expect(mocks.verify).not.toHaveBeenCalled();
  });
});
