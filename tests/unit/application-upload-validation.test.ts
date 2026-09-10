import { describe, expect, it } from "vitest";
import {
  applicationFilesSchema,
  planApplicationDocuments,
  validateApplicationDocumentBytes,
} from "../../functions/src/application-documents";
import {
  APPLICATION_FILE_LIMITS,
  isApplicationStoragePath,
  sanitizeApplicationFilename,
  validateApplicationFiles,
} from "../../functions/src/shared/application-file-policy";

const pdfBytes = Buffer.from("%PDF-1.7\n1 0 obj\n<<>>\nendobj\n%%EOF");
const pdf = {
  name: "Lebenslauf.pdf",
  contentType: "application/pdf",
  size: pdfBytes.length,
  base64: pdfBytes.toString("base64"),
};

function docx() {
  const files: [string, string][] = [
    [
      "[Content_Types].xml",
      '<Types><Override ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',
    ],
    [
      "word/document.xml",
      '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>',
    ],
  ];
  const locals: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;
  for (const [name, content] of files) {
    const local = Buffer.alloc(30);
    const directory = Buffer.alloc(46);
    const filename = Buffer.from(name);
    const bytes = Buffer.from(content);
    local.writeUInt32LE(0x04034b50);
    local.writeUInt32LE(bytes.length, 18);
    local.writeUInt32LE(bytes.length, 22);
    local.writeUInt16LE(filename.length, 26);
    directory.writeUInt32LE(0x02014b50);
    directory.writeUInt32LE(bytes.length, 20);
    directory.writeUInt32LE(bytes.length, 24);
    directory.writeUInt16LE(filename.length, 28);
    directory.writeUInt32LE(offset, 42);
    locals.push(local, filename, bytes);
    central.push(directory, filename);
    offset += local.length + filename.length + bytes.length;
  }
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50);
  end.writeUInt16LE(2, 10);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, ...central, end]);
}

describe("application document validation", () => {
  it("accepts PDF bytes and a WordprocessingML DOCX, not generic ZIP", () => {
    expect(validateApplicationDocumentBytes([pdf])[0]).toEqual(pdfBytes);
    const bytes = docx();
    const word = {
      name: "CV.docx",
      contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: bytes.length,
      base64: bytes.toString("base64"),
    };
    expect(validateApplicationDocumentBytes([word])[0]).toEqual(bytes);
    const fake = Buffer.from("PK\x03\x04this is not a Word document");
    expect(() =>
      validateApplicationDocumentBytes([
        { ...word, size: fake.length, base64: fake.toString("base64") },
      ]),
    ).toThrow(/Dateiinhalt/);
  });
  it.each([
    {
      name: "CV.doc",
      contentType: "application/msword",
      bytes: (() => {
        const bytes = Buffer.alloc(512);
        Buffer.from([208, 207, 17, 224, 161, 177, 26, 225]).copy(bytes);
        Buffer.from("WordDocument\0", "utf16le").copy(bytes, 128);
        return bytes;
      })(),
    },
    {
      name: "Zeugnis.jpg",
      contentType: "image/jpeg",
      bytes: Buffer.from([255, 216, 255, 224, 0, 0, 255, 217]),
    },
    {
      name: "Zeugnis.png",
      contentType: "image/png",
      bytes: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aC1sAAAAASUVORK5CYII=",
        "base64",
      ),
    },
  ])("accepts content signature for $name", ({ name, contentType, bytes }) => {
    expect(
      validateApplicationDocumentBytes([
        { name, contentType, size: bytes.length, base64: bytes.toString("base64") },
      ]),
    ).toHaveLength(1);
  });
  it("enforces count, empty files, exact per-file and total limits", () => {
    expect(validateApplicationFiles(Array(6).fill(pdf))).toMatch(/5 Dateien/);
    expect(validateApplicationFiles([{ ...pdf, size: 0 }])).toMatch(/leer/);
    expect(
      validateApplicationFiles([{ ...pdf, size: APPLICATION_FILE_LIMITS.perFile }]),
    ).toBeNull();
    expect(
      validateApplicationFiles([{ ...pdf, size: APPLICATION_FILE_LIMITS.perFile + 1 }]),
    ).toMatch(/10 MB/);
    expect(validateApplicationFiles(Array(2).fill({ ...pdf, size: 10_000_000 }))).toBeNull();
    expect(validateApplicationFiles(Array(3).fill({ ...pdf, size: 7_000_000 }))).toMatch(/20 MB/);
  });
  it("rejects extension/MIME spoofing, unsupported types and corrupt base64", () => {
    expect(validateApplicationFiles([{ ...pdf, name: "CV.pdf.exe" }])).not.toBeNull();
    expect(validateApplicationFiles([{ ...pdf, contentType: "image/png" }])).not.toBeNull();
    expect(() => validateApplicationDocumentBytes([{ ...pdf, size: pdf.size + 1 }])).toThrow(
      /Dateigröße/,
    );
    expect(() => validateApplicationDocumentBytes([{ ...pdf, base64: pdf.base64 + "\n" }])).toThrow(
      /Dateikodierung/,
    );
    const html = Buffer.from("<html>Not a PDF</html>");
    expect(() =>
      validateApplicationDocumentBytes([
        { ...pdf, size: html.length, base64: html.toString("base64") },
      ]),
    ).toThrow(/Dateiinhalt/);
    expect(
      applicationFilesSchema.safeParse([{ ...pdf, publicUrl: "https://example.invalid" }]).success,
    ).toBe(false);
  });
  it("sanitizes names and plans private random application-associated paths without bytes", () => {
    const appId = "64e33d4b-c882-49f4-a0f6-625a47a10ee8";
    expect(sanitizeApplicationFilename("../../CV\r\n<script>.pdf")).toBe("CV___script_.pdf");
    const [first, second] = planApplicationDocuments(appId, [pdf, pdf]);
    if (!first || !second) throw new Error("Expected two planned documents");
    expect(first.id).not.toBe(second.id);
    expect(isApplicationStoragePath(appId, first)).toBe(true);
    expect(isApplicationStoragePath("another-application", first)).toBe(false);
    expect(isApplicationStoragePath(appId, { ...first, storagePath: "../private" })).toBe(false);
    expect(first).not.toHaveProperty("base64");
    expect(first.uploadedAt).toBeNull();
  });
});
