"use client";

import { deleteContactLeadAction } from "./actions";

interface DeleteContactLeadButtonProps {
  leadId: string;
  leadName: string;
}

export function DeleteContactLeadButton({
  leadId,
  leadName,
}: DeleteContactLeadButtonProps) {
  return (
    <form
      action={deleteContactLeadAction}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Möchten Sie die Anfrage von "${leadName}" wirklich endgültig löschen?\n\nDiese Aktion kann nicht rückgängig gemacht werden.`,
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input
        type="hidden"
        name="id"
        value={leadId}
      />

      <button
        type="submit"
        className="min-h-11 rounded-lg border border-red-300 bg-white px-5 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
      >
        Anfrage löschen
      </button>
    </form>
  );
}