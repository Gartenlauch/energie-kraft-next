import Image from "next/image";

import { MediaPlaceholder } from "@/components/media/media-placeholder";
import { Reveal } from "@/components/marketing/reveal";
import { leadershipTeam, serviceTeamRoles, type TeamMember } from "@/content/team";

interface TeamOverviewProps {
  mode: "company" | "service";
}

function TeamPortrait({
  member,
  priority = false,
  compact = false,
}: {
  member: TeamMember;
  priority?: boolean;
  compact?: boolean;
}) {
  return (
    <figure className="group">
      <div className="bg-surface-soft relative aspect-[4/5] overflow-hidden">
        {member.image ? (
          <Image
            src={member.image}
            alt={member.imageAlt ?? ""}
            fill
            priority={priority}
            sizes={
              compact
                ? "(max-width: 767px) 45vw, (max-width: 1279px) 30vw, 240px"
                : "(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
            }
            className="object-cover transition-transform duration-700 group-hover:scale-[1.015]"
          />
        ) : (
          <MediaPlaceholder
            motif={`Team-Portrait · ${member.role}${member.area ? ` · ${member.area}` : ""}`}
            width={1200}
            height={1500}
            className={
              compact
                ? "h-full min-h-0 [&_.max-w-xs]:px-3 [&_dd]:mt-0 [&_dl]:mt-3 [&_dl]:grid-cols-1 [&_dl]:gap-1 [&_dl>div]:flex [&_dl>div]:justify-center [&_dl>div]:gap-2 [&_p]:text-xs [&_p]:tracking-normal"
                : "h-full min-h-0"
            }
          />
        )}
      </div>
      <figcaption className="border-border-default border-b py-5">
        <p
          className={`text-brand-primary font-bold uppercase ${compact ? "text-[10px] leading-5 tracking-[0.06em] sm:text-xs" : "text-xs tracking-[0.12em]"}`}
        >
          {member.role}
        </p>
        {member.name ? (
          <h3 className={compact ? "mt-2 text-base leading-6 sm:text-lg" : "mt-2 text-2xl"}>
            {member.name}
          </h3>
        ) : null}
        {member.area ? (
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{member.area}</p>
        ) : null}
      </figcaption>
    </figure>
  );
}

export function TeamOverview({ mode }: TeamOverviewProps) {
  const companyMode = mode === "company";
  const primaryMembers = companyMode ? [...leadershipTeam, ...serviceTeamRoles] : serviceTeamRoles;

  return (
    <section className="section-space bg-background" aria-labelledby={`${mode}-team-title`}>
      <div className="section-shell">
        <Reveal className="grid gap-7 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="eyebrow">Menschen & Verantwortung</p>
            <h2 id={`${mode}-team-title`} className="section-title mt-4">
              {companyMode
                ? "Die Menschen hinter Energie-Kraft Süd"
                : "Ansprechpartner für Betrieb und Service"}
            </h2>
          </div>
          <p className="lead-copy lg:justify-self-end">
            {companyMode
              ? "Führung, Montage, Service, Vertrieb und Verwaltung arbeiten entlang eines gemeinsamen Projektziels. Verantwortliche stellen wir persönlich vor; weitere Fachbereiche zeigen wir bewusst über ihre Funktion."
              : "Technische Betreuung entsteht im Zusammenspiel von Service, Dachmontage, Vertrieb und Verwaltung. So kommt jedes Anliegen verlässlich in den passenden Fachbereich."}
          </p>
        </Reveal>

        <ul
          className={`mt-14 grid ${companyMode ? "grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 xl:grid-cols-5" : "gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3"}`}
        >
          {primaryMembers.map((member, index) => (
            <li key={member.id}>
              <Reveal delay={(index % 4) * 50}>
                <TeamPortrait member={member} priority={index < 2} compact={companyMode} />
              </Reveal>
            </li>
          ))}
        </ul>

        {!companyMode ? (
          <div className="border-border-strong mt-16 grid gap-6 border-y py-8 md:grid-cols-2 lg:grid-cols-4">
            {leadershipTeam.map((member) => (
              <div key={member.id}>
                <p className="text-brand-primary text-xs font-bold tracking-[0.12em] uppercase">
                  {member.role}
                </p>
                <p className="mt-2 font-semibold">{member.name}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
