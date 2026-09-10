import Image from "next/image";

import { MediaPlaceholder } from "@/components/media/media-placeholder";
import { Reveal } from "@/components/marketing/reveal";
import { leadershipTeam, serviceTeamRoles, type TeamMember } from "@/content/team";

interface TeamOverviewProps {
  mode: "company" | "service";
}

function TeamPortrait({ member, priority = false }: { member: TeamMember; priority?: boolean }) {
  return (
    <figure className="group">
      <div className="bg-surface-soft relative aspect-[4/5] overflow-hidden">
        {member.image ? (
          <Image
            src={member.image}
            alt={member.imageAlt ?? ""}
            fill
            priority={priority}
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.015]"
          />
        ) : (
          <MediaPlaceholder
            motif={`Team-Portrait · ${member.role}${member.area ? ` · ${member.area}` : ""}`}
            width={1200}
            height={1500}
            className="h-full min-h-0"
          />
        )}
      </div>
      <figcaption className="border-border-default border-b py-5">
        <p className="text-brand-primary text-xs font-bold tracking-[0.12em] uppercase">
          {member.role}
        </p>
        {member.name ? <h3 className="mt-2 text-2xl">{member.name}</h3> : null}
        {member.area ? (
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{member.area}</p>
        ) : null}
      </figcaption>
    </figure>
  );
}

export function TeamOverview({ mode }: TeamOverviewProps) {
  const companyMode = mode === "company";
  const primaryMembers = companyMode ? leadershipTeam : serviceTeamRoles;

  return (
    <section className="section-space bg-background" aria-labelledby={`${mode}-team-title`}>
      <div className="section-shell">
        <Reveal className="grid gap-7 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="eyebrow">Menschen & Verantwortung</p>
            <h2 id={`${mode}-team-title`} className="section-title mt-4">
              {companyMode ? "Die Menschen hinter Energie-Kraft Süd" : "Ansprechpartner für Betrieb und Service"}
            </h2>
          </div>
          <p className="lead-copy lg:justify-self-end">
            {companyMode
              ? "Führung, Montage, Service, Vertrieb und Verwaltung arbeiten entlang eines gemeinsamen Projektziels. Verantwortliche stellen wir persönlich vor; weitere Fachbereiche zeigen wir bewusst über ihre Funktion."
              : "Technische Betreuung entsteht im Zusammenspiel von Service, Dachmontage, Vertrieb und Verwaltung. So kommt jedes Anliegen verlässlich in den passenden Fachbereich."}
          </p>
        </Reveal>

        <ul
          className={`mt-14 grid gap-x-6 gap-y-12 ${companyMode ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-3"}`}
        >
          {primaryMembers.map((member, index) => (
            <li key={member.id}>
              <Reveal delay={(index % 4) * 50}>
                <TeamPortrait member={member} priority={index < 2} />
              </Reveal>
            </li>
          ))}
        </ul>

        {companyMode ? (
          <div className="border-border-strong mt-20 border-t pt-12">
            <Reveal className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="eyebrow">Bereiche im Zusammenspiel</p>
                <h3 className="mt-4 max-w-md text-3xl">Das Team, das Projekte im Alltag trägt</h3>
              </div>
              <p className="max-w-2xl text-base leading-8 text-[var(--text-muted)]">
                Weitere Fachbereiche stellen wir rollenbezogen vor. Entscheidend ist, wer im Projekt welche Verantwortung übernimmt.
              </p>
            </Reveal>
            <ul className="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {serviceTeamRoles.map((member, index) => (
                <li key={member.id}>
                  <Reveal delay={(index % 3) * 50}>
                    <TeamPortrait member={member} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="border-border-strong mt-16 grid gap-6 border-y py-8 md:grid-cols-2 lg:grid-cols-4">
            {leadershipTeam.map((member) => (
              <div key={member.id}>
                <p className="text-brand-primary text-xs font-bold tracking-[0.12em] uppercase">{member.role}</p>
                <p className="mt-2 font-semibold">{member.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
