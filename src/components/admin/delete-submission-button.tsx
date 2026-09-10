"use client";

interface DeleteSubmissionButtonProps {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label: string;
  subject: string;
}

export function DeleteSubmissionButton({ action, id, label, subject }: DeleteSubmissionButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Möchten Sie ${subject} wirklich endgültig löschen?\n\nDiese Aktion kann nicht rückgängig gemacht werden.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="min-h-11 rounded-lg border border-red-300 bg-white px-5 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
        {label}
      </button>
    </form>
  );
}
