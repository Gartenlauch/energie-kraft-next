import { NextResponse, type NextRequest } from "next/server";

import { getAdminSession } from "@/lib/auth/session";
import { previewFaqJsonImport } from "@/lib/faq/json-transfer-repository";
import { isTrustedSameOriginRequest } from "@/lib/http/same-origin";

export const runtime = "nodejs";

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (!isTrustedSameOriginRequest(request)) {
    return errorResponse("Die Anfrage wurde aus Sicherheitsgründen abgelehnt.", 403);
  }

  const session = await getAdminSession();
  if (!session) return errorResponse("Die Admin-Sitzung ist abgelaufen.", 401);

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return errorResponse("Die Datei muss gültiges JSON enthalten.", 415);
  }

  let value: unknown;
  try {
    value = await request.json();
  } catch {
    return errorResponse("Die Datei enthält kein gültiges JSON.", 400);
  }

  const preview = await previewFaqJsonImport(value);
  return NextResponse.json(
    { preview },
    { status: preview.valid ? 200 : 422, headers: { "Cache-Control": "no-store" } },
  );
}
