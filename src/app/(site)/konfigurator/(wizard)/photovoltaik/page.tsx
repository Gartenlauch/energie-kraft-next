import type { Metadata } from "next";

import { ConfiguratorShell } from "@/components/configurator/configurator-shell";
import { PhotovoltaicWizard } from "@/components/configurator/photovoltaic/photovoltaic-wizard";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { configuratorProducts } from "@/content/configurators";
import { buildMetadata } from "@/lib/seo/metadata";

const product = configuratorProducts.photovoltaic;

export const metadata: Metadata = buildMetadata(product.seo);

export default function PhotovoltaikConfiguratorPage() {
  return (
    <>
      <Breadcrumbs currentLabel="Photovoltaik-Konfigurator" />

      <ConfiguratorShell>
        <PhotovoltaicWizard />
      </ConfiguratorShell>
    </>
  );
}