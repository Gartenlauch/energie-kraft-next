import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ admin: vi.fn(), staff: vi.fn(), photo: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/session", () => ({
  getAdminSession: mocks.admin,
  getStaffSession: mocks.staff,
}));
vi.mock("@/lib/admin/users-server", () => ({ userManagement: { photo: mocks.photo } }));
vi.mock("@/lib/firebase/admin", () => ({ adminFirestore: {}, adminStorage: {} }));
import { GET, POST } from "@/app/api/admin/users/[uid]/avatar/route";
const context = { params: Promise.resolve({ uid: "user-a" }) };
function request(bytes: Uint8Array, type: string, origin = "http://localhost:3000") {
  return new Request("http://localhost:3000/api/admin/users/user-a/avatar", {
    method: "POST",
    headers: { Origin: origin, "Content-Type": type },
    body: bytes as BodyInit,
  });
}
beforeEach(() => {
  vi.clearAllMocks();
  mocks.admin.mockResolvedValue({ uid: "admin", role: "admin" });
});
describe("private avatar route", () => {
  it("refuses staff uploads and anonymous downloads", async () => {
    mocks.admin.mockResolvedValue(null);
    mocks.staff.mockResolvedValue(null);
    expect((await POST(request(new Uint8Array([1]), "image/png"), context)).status).toBe(403);
    expect((await GET(new Request("http://localhost:3000"), context)).status).toBe(403);
    expect(mocks.photo).not.toHaveBeenCalled();
  });
  it("rejects cross-origin, oversized and forged image uploads before storage", async () => {
    expect(
      (await POST(request(new Uint8Array([1]), "image/png", "https://evil.test"), context)).status,
    ).toBe(403);
    expect(
      (await POST(request(new Uint8Array(2 * 1024 * 1024 + 1), "image/png"), context)).status,
    ).toBe(413);
    expect((await POST(request(new Uint8Array([1, 2, 3]), "image/png"), context)).status).toBe(400);
    expect(mocks.photo).not.toHaveBeenCalled();
  });
});
