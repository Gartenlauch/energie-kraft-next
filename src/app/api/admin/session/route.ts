import {
  NextResponse,
  type NextRequest,
} from "next/server";

import {
  ADMIN_RECENT_SIGN_IN_MAX_AGE_SECONDS,
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_DURATION_MS,
  ADMIN_SESSION_DURATION_SECONDS,
} from "@/config/auth";
import { publicEnv } from "@/config/env/public";
import { adminAuth } from "@/lib/firebase/admin";
import { isTrustedSameOriginRequest } from "@/lib/http/same-origin";
import { adminSessionRequestSchema } from "@/lib/validation/auth";

export const runtime = "nodejs";

function createJsonResponse(
  data: Record<string, unknown>,
  status = 200,
) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function createErrorResponse(
  error: string,
  status: number,
) {
  return createJsonResponse(
    {
      error,
    },
    status,
  );
}

function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: publicEnv.isProduction,
    sameSite: "strict" as const,
    path: "/",
  };
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse> {
  if (!isTrustedSameOriginRequest(request)) {
    return createErrorResponse(
      "Die Anfrage wurde aus Sicherheitsgründen abgelehnt.",
      403,
    );
  }

  const contentType =
    request.headers.get("content-type");

  if (
    !contentType
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    return createErrorResponse(
      "Der Content-Type muss application/json sein.",
      415,
    );
  }

  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return createErrorResponse(
      "Die Anfrage enthält kein gültiges JSON.",
      400,
    );
  }

  const parsedRequest =
    adminSessionRequestSchema.safeParse(
      requestBody,
    );

  if (!parsedRequest.success) {
    return createErrorResponse(
      "Das Firebase-ID-Token ist ungültig.",
      400,
    );
  }

  try {
    const decodedToken =
      await adminAuth.verifyIdToken(
        parsedRequest.data.idToken,
        true,
      );

    const currentTimeSeconds = Math.floor(
      Date.now() / 1_000,
    );

    const authenticationAge =
      currentTimeSeconds -
      decodedToken.auth_time;

    if (
      authenticationAge < 0 ||
      authenticationAge >
        ADMIN_RECENT_SIGN_IN_MAX_AGE_SECONDS
    ) {
      return createErrorResponse(
        "Für diese Anmeldung ist eine erneute Authentifizierung erforderlich.",
        401,
      );
    }

    if (decodedToken.admin !== true) {
      return createErrorResponse(
        "Dieses Benutzerkonto besitzt keine Administratorberechtigung.",
        403,
      );
    }

    const sessionCookie =
      await adminAuth.createSessionCookie(
        parsedRequest.data.idToken,
        {
          expiresIn:
            ADMIN_SESSION_DURATION_MS,
        },
      );

    const response = createJsonResponse({
      ok: true,
    });

    response.cookies.set(
      ADMIN_SESSION_COOKIE_NAME,
      sessionCookie,
      {
        ...getSessionCookieOptions(),
        maxAge:
          ADMIN_SESSION_DURATION_SECONDS,
      },
    );

    return response;
  } catch {
    return createErrorResponse(
      "Die Anmeldung konnte nicht bestätigt werden.",
      401,
    );
  }
}

export async function DELETE(
  request: NextRequest,
): Promise<NextResponse> {
  if (!isTrustedSameOriginRequest(request)) {
    return createErrorResponse(
      "Die Anfrage wurde aus Sicherheitsgründen abgelehnt.",
      403,
    );
  }

  const sessionCookie = request.cookies.get(
    ADMIN_SESSION_COOKIE_NAME,
  )?.value;

  if (sessionCookie) {
    try {
      const decodedToken =
        await adminAuth.verifySessionCookie(
          sessionCookie,
          false,
        );

      await adminAuth.revokeRefreshTokens(
        decodedToken.uid,
      );
    } catch {
      // Auch ein ungültiges oder abgelaufenes
      // Session-Cookie wird im Browser entfernt.
    }
  }

  const response = createJsonResponse({
    ok: true,
  });

  response.cookies.set(
    ADMIN_SESSION_COOKIE_NAME,
    "",
    {
      ...getSessionCookieOptions(),
      expires: new Date(0),
      maxAge: 0,
    },
  );

  return response;
}