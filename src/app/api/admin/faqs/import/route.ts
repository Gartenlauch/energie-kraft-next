import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { getAdminSession } from "@/lib/auth/session";
import {
  importFaqJson,
  InvalidFaqImportError,
} from "@/lib/faq/json-transfer-repository";
import { isTrustedSameOriginRequest } from "@/lib/http/same-origin";

export const runtime = "nodejs";

function errorResponse(error: string, status: number, details?: unknown) {
  return NextResponse.json(
    { error, ...(details ? { details } : {}) },
    { status, headers: { "Cache-Control": "no-store" } },
  );
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

  try {
    const result = await importFaqJson(value, session.uid);
    revalidatePath("/admin/faqs");
    revalidatePath("/admin/faqs/categories");
    revalidatePath("/faq", "layout");
    return NextResponse.json({ result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof InvalidFaqImportError) {
      return errorResponse(error.message, 422, error.preview);
    }

    return errorResponse("Der FAQ-Import konnte nicht abgeschlossen werden.", 500);
  }
}
