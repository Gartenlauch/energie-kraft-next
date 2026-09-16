import { NextResponse } from "next/server";

import { DEFAULT_CONFIGURATOR_SETTINGS } from "@/lib/configurator/settings-model";
import { getCurrentConfiguratorSettings } from "@/lib/configurator/settings-repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getCurrentConfiguratorSettings();
    return NextResponse.json(settings, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Configurator settings could not be loaded; using defaults", error);
    return NextResponse.json(DEFAULT_CONFIGURATOR_SETTINGS, {
      headers: { "Cache-Control": "no-store" },
    });
  }
}
