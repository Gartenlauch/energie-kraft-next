"use client";
import Image from "next/image";
import { useState } from "react";
import { userInitials } from "@/lib/admin/user-model";

export function AdminAvatar({
  uid,
  name,
  photo,
  version = "",
}: {
  uid: string;
  name: string;
  photo?: string | null;
  version?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--surface-soft)] text-sm font-bold text-[var(--brand-primary)]"
      aria-label={`Profil von ${name}`}
    >
      {photo && !failed ? (
        <Image
          src={`/api/admin/users/${encodeURIComponent(uid)}/avatar?v=${encodeURIComponent(version)}`}
          alt=""
          width={44}
          height={44}
          unoptimized
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        userInitials(name)
      )}
    </span>
  );
}
