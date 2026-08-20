import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-950">Dashboard</h1>

        <p className="mt-2 text-slate-600">
          Zentrale Verwaltung der Inhalte und Anfragen von Energie-Kraft Süd.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Link
          href="/admin/faqs"
          className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
        >
          <p className="text-sm font-medium text-emerald-800">Inhalte</p>

          <h2 className="mt-2 text-xl font-semibold text-slate-950">FAQs</h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            FAQ-Kategorien, Fragen, Veröffentlichungsstatus und Seitenausspielungen verwalten.
          </p>

          <p className="mt-5 text-sm font-semibold text-emerald-800 group-hover:underline">
            FAQ-Verwaltung öffnen →
          </p>
        </Link>

        <Link
          href="/admin/anfragen"
          className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
        >
          <p className="text-sm font-medium text-emerald-800">
            Vertrieb
          </p>

          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            Anfragen
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Eingehende Kontakt-, Rechner- und
            Beratungsanfragen bearbeiten.
          </p>

          <p className="mt-5 text-sm font-semibold text-emerald-800 group-hover:underline">
            Anfragen öffnen →
          </p>
        </Link>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-emerald-800">Personal</p>

          <h2 className="mt-2 text-xl font-semibold text-slate-950">Bewerbungen</h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Bewerbungen und zugehörige Dokumente sicher verwalten.
          </p>
        </section>
      </div>
    </main>
  );
}
