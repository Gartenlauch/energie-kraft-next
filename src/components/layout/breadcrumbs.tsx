import Link from "next/link";

interface BreadcrumbsProps {
  currentLabel: string;
  items?: readonly { label: string; href: string }[];
}

export function Breadcrumbs({ currentLabel, items = [] }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="border-border-default bg-surface/70 border-b">
      <ol className="section-shell flex min-h-12 items-center gap-2 overflow-hidden text-xs text-[var(--text-subtle)] sm:text-sm">
        <li>
          <Link href="/" className="hover:text-brand-primary transition">
            Startseite
          </Link>
        </li>

        {items.map((item) => (
          <li key={item.href} className="contents">
            <span aria-hidden="true" className="text-border-strong">
              /
            </span>
            <Link href={item.href} className="hover:text-brand-primary truncate transition">
              {item.label}
            </Link>
          </li>
        ))}

        <li className="contents">
          <span aria-hidden="true" className="text-border-strong">
            /
          </span>
          <span aria-current="page" className="text-brand-dark truncate font-medium">
            {currentLabel}
          </span>
        </li>
      </ol>
    </nav>
  );
}
