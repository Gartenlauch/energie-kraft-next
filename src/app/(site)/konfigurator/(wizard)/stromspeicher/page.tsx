import type { Metadata } from "next";

import { BatteryStorageEntry } from "@/components/configurator/battery-storage/battery-storage-entry";
import { ConfiguratorShell } from "@/components/configurator/configurator-shell";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { configuratorProducts } from "@/content/configurators";
import { buildMetadata } from "@/lib/seo/metadata";

const product =
  configuratorProducts.battery_storage;

export const metadata: Metadata =
  buildMetadata(product.seo);

export default function StromspeicherConfiguratorPage() {
  return (
    <>
      <Breadcrumbs currentLabel="Stromspeicher-Konfigurator" />

      <ConfiguratorShell>
        <BatteryStorageEntry />
      </ConfiguratorShell>
    </>
  );
}