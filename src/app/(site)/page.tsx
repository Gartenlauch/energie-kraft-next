import { homeContent } from "@/content";

export default function HomePage() {
  return (
    <main>
      <section className="flex min-h-screen items-center bg-background px-6">
        <div className="mx-auto w-full max-w-7xl">
          {homeContent.hero.eyebrow ? (
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest">
              {homeContent.hero.eyebrow}
            </p>
          ) : null}

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            {homeContent.hero.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/70">
            {homeContent.hero.description}
          </p>
        </div>
      </section>
    </main>
  );
}