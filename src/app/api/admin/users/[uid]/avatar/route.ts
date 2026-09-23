import sharp from "sharp";
import { NextResponse } from "next/server";
import { getAdminSession, getStaffSession } from "@/lib/auth/session";
import { adminFirestore, adminStorage } from "@/lib/firebase/admin";
import { userManagement } from "@/lib/admin/users-server";
import { managedUserIdSchema, MAX_AVATAR_BYTES, validateAvatar } from "@/lib/admin/user-model";
import { isTrustedSameOriginRequest } from "@/lib/http/same-origin";

export const runtime = "nodejs";
type Context = { params: Promise<{ uid: string }> };
const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
};

export async function GET(_request: Request, context: Context) {
  if (!(await getStaffSession())) return new NextResponse(null, { status: 403 });
  const uid = managedUserIdSchema.safeParse((await context.params).uid);
  if (!uid.success) return new NextResponse(null, { status: 400 });
  const profile = await adminFirestore.collection("adminUsers").doc(uid.data).get();
  const path = profile.data()?.photo;
  if (typeof path !== "string" || path !== `adminUsers/${uid.data}/avatar.webp`)
    return new NextResponse(null, { status: 404 });
  try {
    const [bytes] = await adminStorage.bucket().file(path).download();
    return new NextResponse(new Uint8Array(bytes), {
      headers: { ...privateHeaders, "Content-Type": "image/webp" },
    });
  } catch {
    return new NextResponse(null, { status: 404, headers: privateHeaders });
  }
}

export async function POST(request: Request, context: Context) {
  if (!isTrustedSameOriginRequest(request))
    return NextResponse.json({ message: "Anfrage abgelehnt." }, { status: 403 });
  const actor = await getAdminSession();
  if (!actor)
    return NextResponse.json(
      { message: "Administratorberechtigung erforderlich." },
      { status: 403 },
    );
  const uid = managedUserIdSchema.safeParse((await context.params).uid);
  if (!uid.success) return NextResponse.json({ message: "Ungültiger Benutzer." }, { status: 400 });
  // Stream raw bytes with a hard bound (also covers chunked requests without Content-Length).
  const reader = request.body?.getReader();
  if (!reader) return NextResponse.json({ message: "Bild fehlt." }, { status: 400 });
  try {
    let size = 0;
    const parts: Uint8Array[] = [];
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > MAX_AVATAR_BYTES) {
        await reader.cancel();
        return NextResponse.json({ message: "Maximal 2 MB." }, { status: 413 });
      }
      parts.push(part.value);
    }
    const bytes = Buffer.concat(parts);
    validateAvatar(bytes, request.headers.get("content-type") ?? "");
    // Existing sharp dependency; decode validation, bounded pixels, strip metadata, normalize orientation.
    const image = await sharp(bytes, { limitInputPixels: 16_000_000 })
      .rotate()
      .resize(256, 256, { fit: "cover", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    await userManagement.photo(actor, uid.data, async () => {
      const path = `adminUsers/${uid.data}/avatar.webp`;
      await adminStorage
        .bucket()
        .file(path)
        .save(image, {
          resumable: false,
          contentType: "image/webp",
          metadata: { cacheControl: "private, no-store" },
        });
      return path;
    });
    return NextResponse.json({ message: "Profilbild gespeichert." }, { headers: privateHeaders });
  } catch {
    return NextResponse.json(
      {
        message:
          "Profilbild nicht gespeichert. Dateiformat und Benutzer prüfen; bei laufender Änderung später erneut versuchen.",
      },
      { status: 400, headers: privateHeaders },
    );
  }
}
