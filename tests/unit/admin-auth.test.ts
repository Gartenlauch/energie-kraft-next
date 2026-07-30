import {
  describe,
  expect,
  it,
} from "vitest";

import { isTrustedSameOriginRequest } from "@/lib/http/same-origin";
import { adminSessionRequestSchema } from "@/lib/validation/auth";

describe("Admin-Session-Validierung", () => {
  it("akzeptiert ein Firebase-ID-Token", () => {
    const result =
      adminSessionRequestSchema.safeParse({
        idToken: "valid-test-token",
      });

    expect(result.success).toBe(true);
  });

  it("lehnt ein leeres ID-Token ab", () => {
    const result =
      adminSessionRequestSchema.safeParse({
        idToken: "",
      });

    expect(result.success).toBe(false);
  });

  it("lehnt zusätzliche Felder ab", () => {
    const result =
      adminSessionRequestSchema.safeParse({
        idToken: "valid-test-token",
        admin: true,
      });

    expect(result.success).toBe(false);
  });
});

describe("Same-Origin-Schutz", () => {
  it("akzeptiert eine lokale Same-Origin-Anfrage", () => {
    const request = new Request(
      "http://localhost:3000/api/admin/session",
      {
        method: "POST",
        headers: {
          Origin:
            "http://localhost:3000",
          "Sec-Fetch-Site":
            "same-origin",
        },
      },
    );

    expect(
      isTrustedSameOriginRequest(request),
    ).toBe(true);
  });

  it("lehnt eine Cross-Origin-Anfrage ab", () => {
    const request = new Request(
      "http://localhost:3000/api/admin/session",
      {
        method: "POST",
        headers: {
          Origin:
            "https://malicious.example",
          "Sec-Fetch-Site":
            "cross-site",
        },
      },
    );

    expect(
      isTrustedSameOriginRequest(request),
    ).toBe(false);
  });

  it("lehnt eine Anfrage ohne Origin ab", () => {
    const request = new Request(
      "http://localhost:3000/api/admin/session",
      {
        method: "POST",
      },
    );

    expect(
      isTrustedSameOriginRequest(request),
    ).toBe(false);
  });

  it("berücksichtigt Forwarded-Header", () => {
    const request = new Request(
      "http://internal-service:8080/api/admin/session",
      {
        method: "POST",
        headers: {
          Origin:
            "https://www.energie-kraft.de",
          Host:
            "internal-service:8080",
          "X-Forwarded-Host":
            "www.energie-kraft.de",
          "X-Forwarded-Proto":
            "https",
          "Sec-Fetch-Site":
            "same-origin",
        },
      },
    );

    expect(
      isTrustedSameOriginRequest(request),
    ).toBe(true);
  });

  it("lehnt einen ungültigen Origin ab", () => {
    const request = new Request(
      "http://localhost:3000/api/admin/session",
      {
        method: "POST",
        headers: {
          Origin: "kein-origin",
        },
      },
    );

    expect(
      isTrustedSameOriginRequest(request),
    ).toBe(false);
  });
});