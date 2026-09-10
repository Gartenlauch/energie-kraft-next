import type { ReactNode } from "react";

export const formInputClassName =
  "mt-2 min-h-13 w-full min-w-0 rounded-lg border border-border-default bg-background px-4 py-3 text-base text-brand-navy";

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-sm font-semibold text-red-700">
      <span aria-hidden="true">!</span>
      <span>{message}</span>
    </p>
  );
}

export function ErrorSummary({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      tabIndex={-1}
      className="mb-8 border-l-4 border-red-700 bg-red-50 px-5 py-4 text-sm text-red-900"
    >
      <p className="font-bold">Bitte prüfen Sie die markierten Angaben.</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
