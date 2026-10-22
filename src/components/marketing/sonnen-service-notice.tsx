import Image from "next/image";
import { PublicLink as Link } from "@/components/ui/public-link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { CONTACT_FORM_HREF } from "@/config/routes";
import { sonnenInformation } from "@/content/sonnen-insolvenz";

const notices = {
  storage: {
    title: "Ihre sonnenBatterie. Unser Service bleibt.",
    text: "Informationen zur sonnen-Insolvenz und Unterstützung für private Bestandsanlagen durch Energie-Kraft Süd.",
  },
  commercial: {
    title: "sonnen-Bestandsanlagen im Gewerbe betreuen",
    text: "Was die aktuelle Meldung für technische Betreuung und Fragen zur Betriebssicherheit bedeutet – mit Unterstützung für Ihre konkrete Anlage.",
  },
  service: {
    title: "sonnen Insolvenz: Wir bleiben für Sie da.",
    text: "Unsere eigene Serviceabteilung bleibt bestehen. Für bestehende sonnenBatterien und Wallboxen ist Energie-Kraft Süd weiterhin Ihr Ansprechpartner.",
  },
};

export function SonnenServiceNotice({ variant }: { variant: keyof typeof notices | "home" }) {
  const isHome = variant === "home";
  const notice = isHome
    ? { ...notices.storage, title: "Aktuelle Information zur sonnen-Insolvenz" }
    : notices[variant];
  return (
    <aside
      aria-label={isHome ? "Aktuelle sonnen-Information" : "sonnen: Information und Service"}
      className={
        isHome ? "bg-brand-primary text-white" : "bg-surface-soft border-border-default border-b"
      }
    >
      <div className="section-shell grid gap-7 py-9 md:py-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
        <div className="flex items-start gap-6">
          {variant === "service" && (
            <Image
              src={sonnenInformation.image.src}
              alt={sonnenInformation.image.alt}
              width={192}
              height={108}
              sizes="192px"
              className="hidden aspect-video w-48 rounded-lg object-cover lg:block"
            />
          )}
          <div>
            <p className={isHome ? "eyebrow eyebrow-on-dark" : "eyebrow"}>
              Aktuelle Information · {sonnenInformation.displayDate}
            </p>
            <h2
              className={`${isHome ? "text-white" : "text-brand-navy"} mt-3 max-w-3xl text-xl leading-snug font-semibold md:text-2xl`}
            >
              {notice.title}
            </h2>
            <p
              className={`${isHome ? "text-white" : "text-brand-dark"} mt-3 max-w-3xl text-sm leading-7 md:text-base`}
            >
              {notice.text}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          {variant === "service" && (
            <Link href={CONTACT_FORM_HREF} className="button-primary">
              Service anfragen
            </Link>
          )}
          <Link
            href={sonnenInformation.path}
            className={
              isHome
                ? "button-light"
                : variant === "service"
                  ? "button-secondary"
                  : "text-brand-primary inline-flex min-h-11 items-center gap-3 font-semibold underline underline-offset-4"
            }
          >
            Aktuelle Informationen <ArrowRightIcon className="ml-2 size-4 shrink-0" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
