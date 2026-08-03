import Link from "next/link";

interface BreadcrumbsProps {
  currentLabel: string;
}

export function Breadcrumbs({ currentLabel }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="border-foreground/10 border-b px-6">
      <ol className="text-foreground/65 mx-auto flex min-h-12 w-full max-w-7xl items-center gap-2 text-sm">
        <li>
          <Link href="/" className="hover:text-foreground transition">
            Startseite
          </Link>
        </li>

        <li aria-hidden="true">/</li>

        <li aria-current="page" className="text-foreground font-medium">
          {currentLabel}
        </li>
      </ol>
    </nav>
  );
}
