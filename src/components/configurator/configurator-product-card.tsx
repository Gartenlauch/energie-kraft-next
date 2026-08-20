import Link from "next/link";

import type { ConfiguratorLandingProduct } from "@/types/configurator";

interface ConfiguratorProductCardProps {
  product: ConfiguratorLandingProduct;
}

export function ConfiguratorProductCard({
  product,
}: ConfiguratorProductCardProps) {
  return (
    <article className="flex min-w-0 flex-col rounded-2xl border border-border-default bg-background p-6">
      <div>
        <span className="inline-flex rounded-full bg-surface px-3 py-1 text-xs font-semibold text-brand-secondary">
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
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-primary px-5 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
        >
          Konfigurator öffnen
        </Link>

        <Link
          href={product.serviceHref}
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border-default px-5 py-3 text-center text-sm font-semibold text-brand-primary transition hover:bg-surface"
        >
          Mehr zu {product.title}
        </Link>
      </div>
    </article>
  );
}