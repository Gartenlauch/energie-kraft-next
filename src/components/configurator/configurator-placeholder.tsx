import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ConfiguratorShell } from "@/components/configurator/configurator-shell";

interface ConfiguratorPlaceholderProps {
  title: string;
  serviceHref: string;
}

export function ConfiguratorPlaceholder({
  title,
  serviceHref,
}: ConfiguratorPlaceholderProps) {
  return (
    <>
      <Breadcrumbs currentLabel={`${title}-Konfigurator`} />

      <ConfiguratorShell>
        <section className="py-8 md:py-12">
          <p className="text-sm font-semibold tracking-widest text-brand-secondary uppercase">
            Energie-Konfigurator
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-brand-primary md:text-5xl">
            {title}-Konfigurator
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/70">
            Dieser Konfigurator wird auf der neuen gemeinsamen
            Energie-Kraft-Wizard-Architektur vorbereitet.
          </p>

          <div className="mt-8 rounded-2xl border border-border-default bg-surface p-6">
            <p className="leading-7 text-foreground/70">
              Bis zur Fertigstellung findest du auf unserer
              Themenseite weitere Informationen und kannst jederzeit
              eine persönliche Beratung anfragen.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/konfigurator"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Zur Konfigurator-Übersicht
            </Link>

            <Link
              href={serviceHref}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border-default px-6 py-3 text-sm font-semibold text-brand-primary transition hover:bg-surface"
            >
              Mehr zu {title}
            </Link>
          </div>
        </section>
      </ConfiguratorShell>
    </>
  );
}