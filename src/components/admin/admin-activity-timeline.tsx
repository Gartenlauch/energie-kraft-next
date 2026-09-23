import type { AdminActivity } from "@/types/admin-activity";
import type { FirestoreTimestamp } from "@/types/firestore";
import { getActorProfile } from "@/lib/admin/actor-profile";
import { AdminAvatar } from "./admin-avatar";

function format(value: FirestoreTimestamp) {
  try {
    return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(
      value.toDate(),
    );
  } catch {
    return "Zeitpunkt nicht verfügbar";
  }
}
export async function AdminActivityTimeline({
  activities,
  createdAt,
}: {
  activities: AdminActivity[];
  createdAt: FirestoreTimestamp;
}) {
  const profiles = new Map(
    await Promise.all(
      [...new Set(activities.map((item) => item.actorUid))].map(
        async (uid) => [uid, await getActorProfile(uid)] as const,
      ),
    ),
  );
  return (
    <section>
      <h3 className="font-semibold text-[var(--brand-navy)]">Bearbeitungshistorie</h3>
      <ol className="mt-4 border-l-2 border-[var(--surface-soft)] pl-5">
        {activities.map((activity) => {
          const profile = profiles.get(activity.actorUid);
          const name = profile?.displayName ?? activity.actorEmail ?? "Ehemaliger Benutzer";
          return (
            <li
              key={activity.id}
              className="relative flex items-start gap-3 pb-5 text-sm before:absolute before:top-1 before:-left-[1.68rem] before:h-3 before:w-3 before:rounded-full before:bg-[var(--brand-accent)]"
            >
              <AdminAvatar uid={activity.actorUid} name={name} photo={profile?.photo} />
              <div>
                <p className="font-semibold text-[var(--brand-dark)]">{activity.message}</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {format(activity.createdAt)} · {name}
                </p>
              </div>
            </li>
          );
        })}
        <li className="relative text-sm before:absolute before:top-1 before:-left-[1.68rem] before:h-3 before:w-3 before:rounded-full before:bg-slate-300">
          <p className="font-semibold text-[var(--brand-dark)]">Anfrage eingegangen</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">{format(createdAt)}</p>
        </li>
      </ol>
      {activities.length === 0 ? (
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          Noch keine Bearbeitungshistorie vorhanden. Der Eingang wird zur Orientierung angezeigt.
        </p>
      ) : null}
    </section>
  );
}
