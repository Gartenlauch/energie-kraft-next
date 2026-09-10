import { getAdminSession } from "@/lib/auth/session";
import { adminFirestore, adminStorage } from "@/lib/firebase/admin";
import { FIRESTORE_COLLECTIONS } from "@/lib/firebase/collections";
import {
  APPLICATION_FILE_LIMITS,
  isApplicationStoragePath,
  sanitizeApplicationFilename,
  type ApplicationFileMetadata,
} from "../../../../../../../../functions/src/shared/application-file-policy";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ applicationId: string; documentId: string }> },
) {
  const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
  if (!(await getAdminSession()))
    return new Response("Nicht autorisiert", { status: 401, headers });
  const { applicationId, documentId } = await params;
  if (
    !isApplicationStoragePath(applicationId, {
      id: documentId,
      storagePath: `applications/${applicationId}/${documentId}`,
    })
  )
    return new Response("Nicht gefunden", { status: 404, headers });
  const snapshot = await adminFirestore
    .collection(FIRESTORE_COLLECTIONS.applications)
    .doc(applicationId)
    .get();
  const data = snapshot.data();
  const document = (data?.documents as ApplicationFileMetadata[] | undefined)?.find(
    (entry) => entry.id === documentId,
  );
  if (
    data?.meta?.source !== "bewerbung" ||
    data.uploadState !== "ready" ||
    !document?.uploadedAt ||
    !isApplicationStoragePath(applicationId, document)
  )
    return new Response("Nicht gefunden", { status: 404, headers });
  try {
    const file = adminStorage.bucket().file(document.storagePath);
    const [metadata] = await file.getMetadata();
    if (Number(metadata.size) !== document.size || document.size > APPLICATION_FILE_LIMITS.perFile)
      return new Response("Dokument nicht verfügbar", { status: 409, headers });
    const [bytes] = await file.download();
    const filename = encodeURIComponent(sanitizeApplicationFilename(document.name)).replace(
      /['()]/g,
      (character) => `%${character.charCodeAt(0).toString(16)}`,
    );
    return new Response(new Uint8Array(bytes), {
      headers: {
        ...headers,
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="Bewerbungsunterlage"; filename*=UTF-8''${filename}`,
        "Content-Security-Policy": "sandbox",
        "Content-Length": String(bytes.length),
      },
    });
  } catch {
    return new Response("Dokument vorübergehend nicht verfügbar", { status: 503, headers });
  }
}
