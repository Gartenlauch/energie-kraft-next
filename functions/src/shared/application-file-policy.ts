// Shared by the browser and Functions; only the server validates actual bytes.
export const APPLICATION_FILE_LIMITS = {
  count: 5,
  perFile: 10_000_000,
  total: 20_000_000,
} as const;
export const APPLICATION_FILE_TYPES = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
} as const;
export const APPLICATION_FILE_ACCEPT = Object.keys(APPLICATION_FILE_TYPES)
  .map((ext) => `.${ext}`)
  .join(",");
export interface ApplicationFileInput {
  name: string;
  contentType: string;
  size: number;
  base64: string;
}
export interface ApplicationFileMetadata {
  id: string;
  name: string;
  storagePath: string;
  contentType: string;
  size: number;
  uploadedAt: string | null;
}
export function sanitizeApplicationFilename(name: string) {
  return (
    name
      .normalize("NFKC")
      .split(/[\\/]/)
      .pop()!
      .replace(/[^\p{L}\p{N} ._()-]/gu, "_")
      .replace(/^\.+/, "")
      .trim()
      .slice(-160) || "Dokument"
  );
}
export function applicationFileType(name: string): string | null {
  const extension = name.split(".").pop()?.toLowerCase() ?? "";
  return Object.prototype.hasOwnProperty.call(APPLICATION_FILE_TYPES, extension)
    ? APPLICATION_FILE_TYPES[extension as keyof typeof APPLICATION_FILE_TYPES]
    : null;
}
export function validateApplicationFiles(
  files: readonly { name: string; size: number; contentType: string }[],
): string | null {
  if (files.length > APPLICATION_FILE_LIMITS.count) return "Bitte wähle höchstens 5 Dateien aus.";
  if (files.reduce((total, file) => total + file.size, 0) > APPLICATION_FILE_LIMITS.total)
    return "Alle Dateien zusammen dürfen höchstens 20 MB groß sein.";
  for (const file of files) {
    const name = sanitizeApplicationFilename(file.name);
    if (!Number.isSafeInteger(file.size) || file.size <= 0)
      return `${name}: Die Datei ist leer oder ungültig.`;
    if (file.size > APPLICATION_FILE_LIMITS.perFile) return `${name}: Höchstens 10 MB pro Datei.`;
    const expected = applicationFileType(file.name);
    if (!expected || expected !== file.contentType)
      return `${name}: Erlaubt sind PDF, DOC, DOCX, JPG/JPEG und PNG mit passendem Dateityp.`;
  }
  return null;
}
export function isApplicationStoragePath(
  applicationId: string,
  document: Pick<ApplicationFileMetadata, "id" | "storagePath">,
) {
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return (
    uuid.test(applicationId) &&
    uuid.test(document.id) &&
    document.storagePath === `applications/${applicationId}/${document.id}`
  );
}
