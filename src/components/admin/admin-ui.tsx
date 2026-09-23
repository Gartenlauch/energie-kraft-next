import Link from "next/link";
import type { ReactNode } from "react";
import type { LeadStatus } from "@/types/lead";

export const ADMIN_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Neu",
  in_progress: "In Bearbeitung",
  completed: "Erledigt",
  rejected: "Abgelehnt",
};

export function AdminPageHeader({
  title,
  description,
  eyebrow,
  actions,
}: {
  title: string;
  description: string;
  eyebrow?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-wrap items-end justify-between gap-5">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="mb-2 text-xs font-bold tracking-[0.16em] text-[var(--brand-primary)] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--brand-navy)] md:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)] md:text-base">
          {description}
        </p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </header>
  );
}

export function AdminMetricGrid({ children }: { children: ReactNode }) {
  return <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{children}</section>;
}

export function AdminMetricCard({
  label,
  value,
  note,
  href,
  tone = "brand",
}: {
  label: string;
  value: number;
  note?: string;
  href?: string;
  tone?: "brand" | "new" | "progress" | "success";
}) {
  const content = (
    <>
      <span
        className={`mb-5 block h-1 w-12 rounded-full ${tone === "new" ? "bg-blue-500" : tone === "progress" ? "bg-amber-500" : tone === "success" ? "bg-emerald-500" : "bg-[var(--brand-accent)]"}`}
      />
      <span className="block text-sm font-semibold text-[var(--text-muted)]">{label}</span>
      <span className="mt-2 block text-4xl font-semibold tracking-tight text-[var(--brand-navy)]">
        {value.toLocaleString("de-DE")}
      </span>
      {note ? <span className="mt-2 block text-xs text-[var(--text-muted)]">{note}</span> : null}
    </>
  );
  const className =
    "min-h-40 rounded-2xl border border-[var(--border-default)] bg-white p-5 shadow-[0_12px_35px_rgba(9,20,51,0.05)] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]";
  return href ? (
    <Link
      href={href}
      className={`${className} hover:-translate-y-0.5 hover:border-[var(--brand-accent)]`}
    >
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}

export function AdminMiniDonut({
  values,
  total,
  label,
}: {
  values: Array<{ value: number; color: string }>;
  total: number;
  label: string;
}) {
  let offset = 0;
  return (
    <svg viewBox="0 0 42 42" className="h-24 w-24" role="img" aria-label={label}>
      <circle cx="21" cy="21" r="15.9" fill="none" stroke="#e9edf8" strokeWidth="5" />
      {total > 0
        ? values.map((item, index) => {
            const size = (item.value / total) * 100;
            const node = (
              <circle
                key={index}
                cx="21"
                cy="21"
                r="15.9"
                fill="none"
                stroke={item.color}
                strokeWidth="5"
                strokeDasharray={`${size} ${100 - size}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 21 21)"
              />
            );
            offset += size;
            return node;
          })
        : null}
      <text x="21" y="22.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#091433">
        {total}
      </text>
    </svg>
  );
}

export function AdminStatusBadge({ status }: { status: LeadStatus }) {
  const style =
    status === "new"
      ? "border-blue-200 bg-blue-50 text-blue-800"
      : status === "in_progress"
        ? "border-amber-200 bg-amber-50 text-amber-900"
        : status === "completed"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-slate-300 bg-slate-100 text-slate-700";
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}>
      {ADMIN_STATUS_LABELS[status]}
    </span>
  );
}

export function AdminToolbar({ children }: { children: ReactNode }) {
  return (
    <section className="mb-6 rounded-2xl border border-[var(--border-default)] bg-white p-4 shadow-[0_10px_30px_rgba(9,20,51,0.04)]">
      {children}
    </section>
  );
}
export function AdminEmptyState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-dashed border-[var(--border-default)] bg-white px-6 py-12 text-center">
      <h2 className="text-lg font-semibold text-[var(--brand-navy)]">{title}</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{children}</p>
    </section>
  );
}

export function AdminFilterChip({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-9 items-center rounded-full border border-[var(--border-default)] bg-[var(--surface-soft)] px-3 text-xs font-semibold text-[var(--brand-dark)] hover:border-[var(--brand-primary)]"
    >
      {children}{" "}
      <span aria-hidden="true" className="ml-2">
        ×
      </span>
    </Link>
  );
}
