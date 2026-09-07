import Link from "next/link";

interface BreadcrumbsProps {
  currentLabel: string;
}

export function Breadcrumbs({ currentLabel }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-border-default bg-surface/70">
      <ol className="section-shell flex min-h-12 items-center gap-2 overflow-hidden text-xs text-[var(--text-subtle)] sm:text-sm">
        <li>
          <Link href="/" className="transition hover:text-brand-primary">
            Startseite
          </Link>
        </li>

        <li aria-hidden="true" className="text-border-strong">
          /
        </li>

        <li aria-current="page" className="truncate font-medium text-brand-dark">
          {currentLabel}
        </li>
      </ol>
    </nav>
  );
}
