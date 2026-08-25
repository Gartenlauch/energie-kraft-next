import type { Metadata } from "next";

import { ClimateEntry } from "@/components/configurator/climate/climate-entry";
import { ConfiguratorShell } from "@/components/configurator/configurator-shell";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { configuratorProducts } from "@/content/configurators";
import { buildMetadata } from "@/lib/seo/metadata";

const product =
  configuratorProducts.climate;

export const metadata: Metadata =
  buildMetadata(product.seo);

export default function ClimateConfiguratorPage() {
  return (
    <>
      <Breadcrumbs currentLabel="Klimaanlagen-Konfigurator" />

      <ConfiguratorShell>
        <ClimateEntry />
      </ConfiguratorShell>
    </>
  );
}