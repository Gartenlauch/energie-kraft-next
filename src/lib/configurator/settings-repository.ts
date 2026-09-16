import "server-only";

import { FieldValue } from "firebase-admin/firestore";

import { adminFirestore } from "@/lib/firebase/admin";
import {
  DEFAULT_CONFIGURATOR_SETTINGS,
  createNextConfiguratorSettingsVersion,
  resolveConfiguratorSettingsOrDefaults,
  configuratorSettingsSchema,
  type ConfiguratorSettings,
} from "@/lib/configurator/settings-model";

const CURRENT_DOCUMENT = "current";
const SETTINGS_COLLECTION = "configuratorSettings";
const VERSIONS_COLLECTION = "configuratorSettingsVersions";

function cloneDefaults(): ConfiguratorSettings {
  return structuredClone(DEFAULT_CONFIGURATOR_SETTINGS);
}

export async function getCurrentConfiguratorSettings(): Promise<ConfiguratorSettings> {
  const snapshot = await adminFirestore.collection(SETTINGS_COLLECTION).doc(CURRENT_DOCUMENT).get();
  if (!snapshot.exists) return resolveConfiguratorSettingsOrDefaults(undefined);

  const parsed = configuratorSettingsSchema.safeParse(snapshot.data()?.settings);
  if (!parsed.success) {
    console.error("Invalid current configurator settings; using code defaults", {
      issueCount: parsed.error.issues.length,
    });
    return resolveConfiguratorSettingsOrDefaults(undefined);
  }
  return parsed.data;
}

export async function getConfiguratorSettingsVersion(
  version: number,
): Promise<ConfiguratorSettings | null> {
  if (version === 0) return cloneDefaults();
  const snapshot = await adminFirestore
    .collection(VERSIONS_COLLECTION)
    .doc(String(version))
    .get();
  if (!snapshot.exists) return null;
  const parsed = configuratorSettingsSchema.safeParse(snapshot.data()?.settings);
  return parsed.success ? parsed.data : null;
}

export async function saveConfiguratorSettings(
  input: ConfiguratorSettings,
  actorUid: string,
): Promise<ConfiguratorSettings> {
  const currentReference = adminFirestore.collection(SETTINGS_COLLECTION).doc(CURRENT_DOCUMENT);

  return adminFirestore.runTransaction(async (transaction) => {
    const currentDocument = await transaction.get(currentReference);
    const current = configuratorSettingsSchema.safeParse(currentDocument.data()?.settings);
    const currentVersion = current.success ? current.data.version : 0;
    if (input.version !== currentVersion) {
      throw new Error("Die Modellversion wurde zwischenzeitlich geändert. Bitte lade die Seite neu.");
    }
    const next = createNextConfiguratorSettingsVersion(input, currentVersion);
    const versionReference = adminFirestore
      .collection(VERSIONS_COLLECTION)
      .doc(String(next.version));

    const persisted = {
      schemaVersion: next.schemaVersion,
      version: next.version,
      settings: next,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: actorUid,
    };

    transaction.create(versionReference, persisted);
    transaction.set(currentReference, persisted);
    return next;
  });
}
