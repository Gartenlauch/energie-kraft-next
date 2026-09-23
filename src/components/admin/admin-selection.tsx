"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { LEAD_STATUS_VALUES } from "@/types/lead";
import { ADMIN_STATUS_LABELS } from "./admin-ui";

const SelectionContext = createContext<{ selected: Set<string>; toggle(id: string): void } | null>(
  null,
);

export function AdminSelectionProvider({
  ids,
  action,
  children,
}: {
  ids: string[];
  action: (formData: FormData) => void | Promise<void>;
  children: ReactNode;
}) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const value = useMemo(
    () => ({
      selected,
      toggle(id: string) {
        setSelected((current) => {
          const next = new Set(current);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
      },
    }),
    [selected],
  );
  const allSelected = ids.length > 0 && ids.every((id) => selected.has(id));
  return (
    <SelectionContext.Provider value={value}>
      <div className="mb-3 flex min-h-11 items-center gap-3 text-sm">
        <input
          aria-label="Alle gefilterten Ergebnisse markieren"
          type="checkbox"
          checked={allSelected}
          onChange={() => setSelected(allSelected ? new Set() : new Set(ids))}
          className="h-5 w-5 accent-[var(--brand-primary)]"
        />
        <span>{allSelected ? "Alle gefilterten Ergebnisse markiert" : "Alle markieren"}</span>
      </div>
      {children}
      {selected.size > 0 ? (
        <form
          action={action}
          className="sticky bottom-4 z-30 mt-5 flex flex-wrap items-center gap-3 rounded-2xl bg-[var(--brand-navy)] p-3 text-white shadow-2xl"
        >
          <strong className="mr-auto px-2 text-sm">{selected.size} ausgewählt</strong>
          {[...selected].map((id) => (
            <input key={id} type="hidden" name="ids" value={id} />
          ))}
          <label htmlFor="bulk-status" className="sr-only">
            Status ändern
          </label>
          <select
            id="bulk-status"
            name="status"
            defaultValue="in_progress"
            className="min-h-11 rounded-lg bg-white px-3 text-sm text-slate-950"
          >
            {LEAD_STATUS_VALUES.map((status) => (
              <option key={status} value={status}>
                {ADMIN_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
          <button className="min-h-11 rounded-lg bg-[var(--brand-primary)] px-4 text-sm font-semibold hover:bg-[var(--brand-accent)]">
            Status ändern
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="min-h-11 rounded-lg border border-white/30 px-4 text-sm font-semibold hover:bg-white/10"
          >
            Auswahl aufheben
          </button>
        </form>
      ) : null}
    </SelectionContext.Provider>
  );
}

export function AdminRowCheckbox({ id, label }: { id: string; label: string }) {
  const context = useContext(SelectionContext);
  if (!context) return null;
  return (
    <input
      type="checkbox"
      aria-label={label}
      checked={context.selected.has(id)}
      onChange={() => context.toggle(id)}
      className="h-5 w-5 shrink-0 accent-[var(--brand-primary)]"
      onClick={(event) => event.stopPropagation()}
    />
  );
}
