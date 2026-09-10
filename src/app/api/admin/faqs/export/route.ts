import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/session";
import { exportFaqJson } from "@/lib/faq/json-transfer-repository";

export const runtime = "nodejs";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Die Admin-Sitzung ist abgelaufen." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const document = await exportFaqJson();
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(`${JSON.stringify(document, null, 2)}\n`, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="faq-export-${date}.json"`,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
