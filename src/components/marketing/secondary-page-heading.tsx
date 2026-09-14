import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";

interface SecondaryPageHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

/** Compact editorial introduction for pages whose next step is a form or knowledge content. */
export function SecondaryPageHeading({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
}: SecondaryPageHeadingProps) {
  return (
    <header className="secondary-heading bg-surface-soft">
      <div className="section-shell grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
        <div className="min-w-0">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="secondary-page-title mt-5">{title}</h1>
        </div>
        <div className="min-w-0">
          <p className="lead-copy max-w-xl">{description}</p>
          {(primaryCta || secondaryCta) && (
            <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {primaryCta && (
                <Link href={primaryCta.href} className="button-primary">
                  {primaryCta.label}
                  <ArrowRightIcon className="ml-3 size-4" />
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="text-brand-primary inline-flex min-h-11 items-center py-2 font-semibold underline underline-offset-4"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
