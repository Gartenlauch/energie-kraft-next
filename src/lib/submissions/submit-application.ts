import "client-only";

import { httpsCallable } from "firebase/functions";

import { firebaseFunctions } from "@/lib/firebase/client";
import type { ApplicationInput, SubmitApplicationResult } from "@/types/application";
import {
  applicationFileType,
  validateApplicationFiles,
  type ApplicationFileInput,
} from "../../../functions/src/shared/application-file-policy";

const submitApplicationCallable = httpsCallable<
  ApplicationInput & { documents: ApplicationFileInput[] },
  SubmitApplicationResult
>(firebaseFunctions, "submitApplication", { timeout: 120_000 });

export function selectedApplicationFiles(files: readonly File[]) {
  return files.map((file) => ({
    name: file.name,
    size: file.size,
    contentType: file.type || applicationFileType(file.name) || "",
  }));
}

export async function submitApplication(input: ApplicationInput, files: readonly File[] = []) {
  const metadata = selectedApplicationFiles(files);
  const error = validateApplicationFiles(metadata);
  if (error) throw new Error(error);
  const documents: ApplicationFileInput[] = [];
  for (const [index, file] of files.entries()) {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result);
        const separator = result.indexOf(",");
        if (separator < 0) reject(new Error("Die Datei konnte nicht gelesen werden."));
        else resolve(result.slice(separator + 1));
      };
      reader.onerror = () =>
        reject(new Error("Die Datei konnte nicht gelesen werden. Bitte wähle sie erneut aus."));
      reader.onabort = () => reject(new Error("Das Lesen der Datei wurde abgebrochen."));
      reader.readAsDataURL(file);
    });
    const document = metadata[index];
    if (!document) throw new Error("Die Dateiauswahl ist ungültig.");
    documents.push({ ...document, base64 });
  }
  const result = await submitApplicationCallable({ ...input, documents });
  return result.data;
}
