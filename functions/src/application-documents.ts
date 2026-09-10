import { randomUUID } from "node:crypto";
import { inflateRawSync } from "node:zlib";
import { z } from "zod";
import {
  APPLICATION_FILE_LIMITS,
  sanitizeApplicationFilename,
  validateApplicationFiles,
  type ApplicationFileInput,
  type ApplicationFileMetadata,
} from "./shared/application-file-policy";

export const applicationFilesSchema = z
  .array(
    z
      .object({
        name: z.string().min(1).max(255),
        contentType: z.string().max(100),
        size: z.number().int().positive().max(APPLICATION_FILE_LIMITS.perFile),
        base64: z
          .string()
          .min(4)
          .max(Math.ceil(APPLICATION_FILE_LIMITS.perFile / 3) * 4),
      })
      .strict(),
  )
  .max(APPLICATION_FILE_LIMITS.count)
  .default([]);

// Read bounded ZIP central-directory entries, not arbitrary decompressed archives.
// A DOCX must be a WordprocessingML package, not just a file with a ZIP header.
function isDocx(bytes: Buffer): boolean {
  const end = bytes.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (end < 0 || end + 22 > bytes.length) return false;
  const count = bytes.readUInt16LE(end + 10);
  let offset = bytes.readUInt32LE(end + 16);
  if (count > 2048) return false;
  let contentTypes = false;
  let wordDocument = false;
  let expanded = 0;
  for (let index = 0; index < count; index++) {
    if (offset + 46 > bytes.length || bytes.readUInt32LE(offset) !== 0x02014b50) return false;
    const flags = bytes.readUInt16LE(offset + 8);
    const method = bytes.readUInt16LE(offset + 10);
    const compressed = bytes.readUInt32LE(offset + 20);
    const size = bytes.readUInt32LE(offset + 24);
    const nameLength = bytes.readUInt16LE(offset + 28);
    const name = bytes.subarray(offset + 46, offset + 46 + nameLength).toString("utf8");
    expanded += size;
    if (flags & 1 || expanded > 80_000_000 || /vbaProject|\.exe$|\.js$/i.test(name)) return false;
    if (name === "[Content_Types].xml" || name === "word/document.xml") {
      const local = bytes.readUInt32LE(offset + 42);
      if (
        local + 30 > bytes.length ||
        bytes.readUInt32LE(local) !== 0x04034b50 ||
        size > 20_000_000
      )
        return false;
      const start = local + 30 + bytes.readUInt16LE(local + 26) + bytes.readUInt16LE(local + 28);
      if (start + compressed > bytes.length) return false;
      const packed = bytes.subarray(start, start + compressed);
      const xml = (
        method === 0
          ? packed
          : method === 8
            ? inflateRawSync(packed, { maxOutputLength: 20_000_000 })
            : Buffer.alloc(0)
      ).toString("utf8");
      if (name === "[Content_Types].xml")
        contentTypes =
          xml.includes(
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml",
          ) && !/macroEnabled/i.test(xml);
      if (name === "word/document.xml")
        wordDocument =
          xml.includes("http://schemas.openxmlformats.org/wordprocessingml/2006/main") ||
          xml.includes("http://purl.oclc.org/ooxml/wordprocessingml/main");
    }
    offset += 46 + nameLength + bytes.readUInt16LE(offset + 30) + bytes.readUInt16LE(offset + 32);
  }
  return contentTypes && wordDocument;
}

function matchesContent(bytes: Buffer, contentType: string) {
  if (contentType === "application/pdf")
    return (
      bytes.subarray(0, 5).toString() === "%PDF-" &&
      bytes.subarray(-1024).includes(Buffer.from("%%EOF"))
    );
  if (contentType === "image/jpeg")
    return (
      bytes.length >= 4 &&
      bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255])) &&
      bytes.subarray(-2).equals(Buffer.from([255, 217]))
    );
  if (contentType === "image/png")
    return (
      bytes.length >= 33 &&
      bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) &&
      bytes.subarray(12, 16).toString() === "IHDR" &&
      bytes.subarray(-8, -4).toString() === "IEND"
    );
  if (contentType === "application/msword")
    return (
      bytes.length >= 512 &&
      bytes.subarray(0, 8).equals(Buffer.from([208, 207, 17, 224, 161, 177, 26, 225])) &&
      bytes.includes(Buffer.from("WordDocument\0", "utf16le"))
    );
  return isDocx(bytes);
}

export function validateApplicationDocumentBytes(files: readonly ApplicationFileInput[]) {
  const error = validateApplicationFiles(files);
  if (error) throw new Error(error);
  return files.map((file) => {
    const bytes = Buffer.from(file.base64, "base64");
    // Re-encoding also rejects whitespace, malformed padding and ignored junk.
    if (bytes.length !== file.size || bytes.toString("base64") !== file.base64)
      throw new Error("Ungültige Dateikodierung oder Dateigröße.");
    let valid = false;
    try {
      valid = matchesContent(bytes, file.contentType);
    } catch {
      /* Malformed container. */
    }
    if (!valid)
      throw new Error(
        `${sanitizeApplicationFilename(file.name)}: Der Dateiinhalt passt nicht zum Dateityp.`,
      );
    return bytes;
  });
}

export function planApplicationDocuments(
  applicationId: string,
  files: readonly ApplicationFileInput[],
): ApplicationFileMetadata[] {
  return files.map((file) => {
    const id = randomUUID();
    return {
      id,
      name: sanitizeApplicationFilename(file.name),
      storagePath: `applications/${applicationId}/${id}`,
      size: file.size,
      contentType: file.contentType,
      uploadedAt: null,
    };
  });
}

export async function removeApplicationDocuments(
  documents: readonly ApplicationFileMetadata[],
  remove: (path: string) => Promise<unknown>,
) {
  const results = await Promise.allSettled(
    documents.map((document) => remove(document.storagePath)),
  );
  if (results.some((result) => result.status === "rejected"))
    throw new Error("Dokumente konnten nicht vollständig entfernt werden. Bitte erneut versuchen.");
}
