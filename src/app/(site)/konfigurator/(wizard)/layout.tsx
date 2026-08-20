import type { ReactNode } from "react";

import { ConfiguratorProvider } from "@/lib/configurator/configurator-context";

interface ConfiguratorWizardLayoutProps {
  children: ReactNode;
}

export default function ConfiguratorWizardLayout({
  children,
}: ConfiguratorWizardLayoutProps) {
  return (
    <ConfiguratorProvider>
      {children}
    </ConfiguratorProvider>
  );
}