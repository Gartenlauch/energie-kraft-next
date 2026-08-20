import type { ReactNode } from "react";

interface SelectionGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
}

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

export function SelectionGrid({
  children,
  columns = 2,
}: SelectionGridProps) {
  return (
    <div className={`grid gap-4 ${columnClasses[columns]}`}>
      {children}
    </div>
  );
}