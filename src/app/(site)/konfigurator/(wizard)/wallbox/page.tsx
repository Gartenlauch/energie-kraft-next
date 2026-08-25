import type { Metadata } from "next";

import { ConfiguratorShell } from "@/components/configurator/configurator-shell";
import { WallboxEntry } from "@/components/configurator/wallbox/wallbox-entry";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { configuratorProducts } from "@/content/configurators";
import { buildMetadata } from "@/lib/seo/metadata";

const product =
  configuratorProducts.wallbox;

export const metadata: Metadata =
  buildMetadata(product.seo);

export default function WallboxConfiguratorPage() {
  return (
    <>
      <Breadcrumbs currentLabel="Wallbox-Konfigurator" />

      <ConfiguratorShell>
        <WallboxEntry />
      </ConfiguratorShell>
    </>
  );
}