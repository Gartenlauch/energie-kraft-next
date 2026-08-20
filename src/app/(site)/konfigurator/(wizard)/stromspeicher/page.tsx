import type { Metadata } from "next";

import { ConfiguratorPlaceholder } from "@/components/configurator/configurator-placeholder";
import { configuratorProducts } from "@/content/configurators";
import { buildMetadata } from "@/lib/seo/metadata";

const product = configuratorProducts.battery_storage;

export const metadata: Metadata = buildMetadata(product.seo);

export default function StromspeicherConfiguratorPage() {
  return (
    <ConfiguratorPlaceholder
      title={product.title}
      serviceHref={product.serviceHref}
    />
  );
}