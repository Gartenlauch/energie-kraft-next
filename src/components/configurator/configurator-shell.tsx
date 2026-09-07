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
    <div className="min-h-[70vh] bg-surface-soft py-8 sm:py-10 lg:py-14">
      <div
        className={
          aside
            ? "section-shell grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]"
            : "section-shell max-w-5xl"
        }
      >
        <main id="main-content" className="premium-card min-w-0 p-5 sm:p-8 lg:p-12">
          {children}
        </main>

        {aside ? (
          <aside className="min-w-0" aria-label="Zusätzliche Informationen">
            {aside}
          </aside>
        ) : null}
      </div>
    </div>
  );
}
