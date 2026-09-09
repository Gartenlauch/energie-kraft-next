import { Reveal } from "@/components/marketing/reveal";
import { leadershipTeam, serviceTeamRoles } from "@/content/team";

interface TeamOverviewProps {
  mode: "company" | "service";
}

export function TeamOverview({ mode }: TeamOverviewProps) {
  const companyMode = mode === "company";

  return (
    <section className="section-space bg-background" aria-labelledby={`${mode}-team-title`}>
      <div className="section-shell">
        <Reveal className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="eyebrow">Menschen & Verantwortung</p>
            <h2 id={`${mode}-team-title`} className="section-title mt-4">
              {companyMode ? "Führung mit fachlicher Nähe" : "Klare Bereiche für Ihr Anliegen"}
            </h2>
          </div>
          <p className="lead-copy lg:justify-self-end">
            {companyMode
              ? "Die öffentlich benannten Verantwortlichen stehen für die fachliche und organisatorische Leitung von Energie-Kraft Süd."
              : "Vertrieb, Montage, Service und Verwaltung greifen ineinander, damit Fragen strukturiert an der richtigen Stelle ankommen."}
          </p>
        </Reveal>

        <ul className="border-border-strong mt-12 grid border-y sm:grid-cols-2 lg:grid-cols-4">
          {leadershipTeam.map((member, index) => (
            <li
              key={member.id}
              className="border-border-strong py-7 sm:border-l sm:px-6 sm:first:border-l-0"
            >
              <Reveal delay={index * 60}>
                <p className="text-brand-primary text-xs font-bold tracking-[0.12em] uppercase">
                  {member.role}
                </p>
                <h3 className="mt-3 text-xl">{member.name}</h3>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <Reveal>
            <h3 className="text-2xl">Das Team dahinter</h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-[var(--text-muted)]">
              Weitere Funktionen werden entsprechend der bisherigen öffentlichen Darstellung bewusst
              ohne Personennamen geführt.
            </p>
          </Reveal>
          <ul className="grid gap-3 sm:grid-cols-2">
            {serviceTeamRoles.map((member, index) => (
              <li key={member.id} className="border-border-default bg-surface-soft border p-5">
                <Reveal delay={index * 35}>
                  <p className="font-semibold">{member.role}</p>
                  {member.area ? (
                    <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{member.area}</p>
                  ) : null}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
