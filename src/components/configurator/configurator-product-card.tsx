import Link from "next/link";

import type { ConfiguratorLandingProduct } from "@/types/configurator";

interface ConfiguratorProductCardProps {
  product: ConfiguratorLandingProduct;
}

export function ConfiguratorProductCard({
  product,
}: ConfiguratorProductCardProps) {
  return (
    <article className="premium-card group flex min-w-0 flex-col p-6 transition hover:-translate-y-1 hover:border-brand-accent-strong">
      <div>
        <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-brand-primary">
          {product.statusLabel}
        </span>

        <h3 className="mt-4 text-xl font-semibold tracking-tight text-brand-primary">
          {product.title}
        </h3>

        <p className="mt-3 leading-7 text-foreground/70">
          {product.description}
        </p>
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-6">
        <Link
          href={product.href}
          className="button-primary"
        >
          Konfigurator öffnen
        </Link>

        <Link
          href={product.serviceHref}
          className="button-secondary"
        >
          Mehr zu {product.title}
        </Link>
      </div>
    </article>
  );
}
