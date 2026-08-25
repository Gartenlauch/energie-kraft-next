import type { Metadata } from "next";

import { ConfiguratorShell } from "@/components/configurator/configurator-shell";
import { HeatPumpEntry } from "@/components/configurator/heat-pump/heat-pump-entry";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { configuratorProducts } from "@/content/configurators";
import { buildMetadata } from "@/lib/seo/metadata";

const product =
  configuratorProducts.heat_pump;

export const metadata: Metadata =
  buildMetadata(product.seo);

export default function HeatPumpConfiguratorPage() {
  return (
    <>
      <Breadcrumbs currentLabel="Wärmepumpen-Konfigurator" />

      <ConfiguratorShell>
        <HeatPumpEntry />
      </ConfiguratorShell>
    </>
  );
}