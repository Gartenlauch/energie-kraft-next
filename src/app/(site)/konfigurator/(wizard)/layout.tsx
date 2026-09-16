import type { ReactNode } from "react";

import { ConfiguratorProvider } from "@/lib/configurator/configurator-context";
import { DEFAULT_CONFIGURATOR_SETTINGS } from "@/lib/configurator/settings-model";
import { getCurrentConfiguratorSettings } from "@/lib/configurator/settings-repository";

interface ConfiguratorWizardLayoutProps {
  children: ReactNode;
}

export const dynamic = "force-dynamic";

export default async function ConfiguratorWizardLayout({
  children,
}: ConfiguratorWizardLayoutProps) {
  const settings = await getCurrentConfiguratorSettings().catch(() => DEFAULT_CONFIGURATOR_SETTINGS);

  return (
    <ConfiguratorProvider settings={settings}>
      {children}
    </ConfiguratorProvider>
  );
}
