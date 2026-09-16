"use server";

import { redirect } from "next/navigation";

import { requireAdminSession } from "@/lib/auth/session";
import { configuratorSettingsSchema } from "@/lib/configurator/settings-model";
import { saveConfiguratorSettings } from "@/lib/configurator/settings-repository";

const PATH = "/admin/einstellungen/konfiguratoren";

export async function saveConfiguratorSettingsAction(formData: FormData): Promise<never> {
  const session = await requireAdminSession();
  const raw = formData.get("settings");

  try {
    if (typeof raw !== "string") throw new Error("Die Einstellungen fehlen.");
    const parsed = configuratorSettingsSchema.parse(JSON.parse(raw));
    const saved = await saveConfiguratorSettings(parsed, session.uid);
    redirect(`${PATH}?status=success&version=${saved.version}`);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    const message = error instanceof Error ? error.message : "Die Einstellungen sind ungültig.";
    redirect(`${PATH}?status=error&message=${encodeURIComponent(message)}`);
  }
}
