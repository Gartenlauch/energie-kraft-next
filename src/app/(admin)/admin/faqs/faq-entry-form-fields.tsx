import { FAQ_ROUTE_KEYS, FAQ_ROUTE_LABELS } from "@/config/routes";
import type { FaqCategory, FaqEntryCreateInput } from "@/types/faq";

interface FaqEntryFormFieldsProps {
  categories: FaqCategory[];
  idPrefix: string;
  initialValue?: FaqEntryCreateInput;
}

export function FaqEntryFormFields({
  categories,
  idPrefix,
  initialValue,
}: FaqEntryFormFieldsProps) {
  const placementsByRoute = new Map(
    initialValue?.placements.map((placement) => [placement.routeKey, placement]) ?? [],
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor={`${idPrefix}-question`}
          className="block text-sm font-medium text-slate-800"
        >
          Frage
        </label>

        <input
          id={`${idPrefix}-question`}
          name="question"
          type="text"
          required
          minLength={5}
          maxLength={250}
          defaultValue={initialValue?.question ?? ""}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
          placeholder="Wie lange dauert die Installation?"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor={`${idPrefix}-answer`} className="block text-sm font-medium text-slate-800">
          Antwort
        </label>

        <textarea
          id={`${idPrefix}-answer`}
          name="answer"
          required
          minLength={10}
          maxLength={20000}
          rows={7}
          defaultValue={initialValue?.answer ?? ""}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
          placeholder="Ausführliche und fachlich korrekte Antwort …"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor={`${idPrefix}-category`}
            className="block text-sm font-medium text-slate-800"
          >
            Kategorie
          </label>

          <select
            id={`${idPrefix}-category`}
            name="categoryId"
            required
            defaultValue={initialValue?.categoryId ?? ""}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
          >
            <option value="" disabled>
              Kategorie auswählen
            </option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
                {category.isActive ? "" : " – inaktiv"}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800">
            <input
              name="isPublished"
              type="checkbox"
              defaultChecked={initialValue?.isPublished ?? false}
              className="h-4 w-4 rounded border-slate-300"
            />
            FAQ veröffentlicht
          </label>
        </div>
      </div>

      <fieldset className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <legend className="px-2 text-sm font-semibold text-slate-900">Seitenausspielung</legend>

        <p className="mb-5 text-sm leading-6 text-slate-600">
          Mindestens eine Route muss aktiviert sein. „Im FAQ-Schema“ steuert die strukturierte
          FAQ-Auszeichnung auf der jeweiligen Seite.
        </p>

        <div className="space-y-4">
          {FAQ_ROUTE_KEYS.map((routeKey) => {
            const placement = placementsByRoute.get(routeKey);

            const fieldPrefix = `placement.${routeKey}`;

            const fieldId = `${idPrefix}-${routeKey}`;

            return (
              <div
                key={routeKey}
                className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[minmax(180px,1fr)_160px_180px]"
              >
                <label className="flex items-center gap-3 text-sm font-semibold text-slate-900">
                  <input
                    id={`${fieldId}-enabled`}
                    name={`${fieldPrefix}.enabled`}
                    type="checkbox"
                    defaultChecked={placement !== undefined}
                    className="h-4 w-4 rounded border-slate-300"
                  />

                  {FAQ_ROUTE_LABELS[routeKey]}
                </label>

                <div className="space-y-2">
                  <label
                    htmlFor={`${fieldId}-sort-order`}
                    className="block text-xs font-medium text-slate-600"
                  >
                    Sortierung
                  </label>

                  <input
                    id={`${fieldId}-sort-order`}
                    name={`${fieldPrefix}.sortOrder`}
                    type="number"
                    min={0}
                    max={100000}
                    step={1}
                    defaultValue={placement?.sortOrder ?? 10}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950"
                  />
                </div>

                <label className="flex items-center gap-3 self-end rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-800">
                  <input
                    name={`${fieldPrefix}.showInSchema`}
                    type="checkbox"
                    defaultChecked={placement?.showInSchema ?? false}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Im FAQ-Schema
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
