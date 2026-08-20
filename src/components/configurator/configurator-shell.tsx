import type { ReactNode } from "react";

interface ConfiguratorShellProps {
  children: ReactNode;
  aside?: ReactNode;
}

export function ConfiguratorShell({
  children,
  aside,
}: ConfiguratorShellProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div
        className={
          aside
            ? "grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]"
            : "mx-auto max-w-4xl"
        }
      >
        <main className="min-w-0">{children}</main>

        {aside ? (
          <aside className="min-w-0" aria-label="Zusätzliche Informationen">
            {aside}
          </aside>
        ) : null}
      </div>
    </div>
  );
}