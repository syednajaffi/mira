import Link from "next/link";
import type { Metadata } from "next";
import { SEED_EVENTS, CITIES } from "@/lib/events-data";
import { CONDITIONS, CONDITION_LIST, type ConditionId, isConditionId } from "@/lib/conditions";

export const metadata: Metadata = {
  title: "Together — events near you",
  description:
    "Once a month, in your city, with people who share your diagnosis. Six diners, one table. Hosted with charity partners."
};

interface SearchParams {
  city?: string;
  c?: string;
}

export default function TogetherPage({ searchParams }: { searchParams: SearchParams }) {
  const cityFilter = searchParams.city ?? "all";
  const condParam = searchParams.c;
  const conditionFilter: ConditionId | "all" =
    condParam && isConditionId(condParam) ? condParam : "all";

  const filtered = SEED_EVENTS.filter((e) => {
    if (cityFilter !== "all" && e.city !== cityFilter) return false;
    if (conditionFilter !== "all" && e.condition !== conditionFilter) return false;
    return true;
  });

  return (
    <div className="container-page py-12 md:py-20">
      <header className="max-w-readable">
        <p className="label">Together</p>
        <h1 className="mt-3 font-serif text-headline text-ink leading-tight">
          A dinner with the people who get it.
        </h1>
        <p className="mt-5 text-lede text-ink-soft">
          Once a month, in five cities, with the friends you haven't met yet. Single-condition tables. Vetted
          venues. Co-hosted with charity partners. A small commitment hold, fully refunded when you arrive.
        </p>
      </header>

      <section className="mt-10 grid gap-3 max-w-readable">
        <div>
          <p className="label mb-2">City</p>
          <div className="flex flex-wrap gap-2">
            <FilterChip href={buildHref(undefined, conditionFilter)} active={cityFilter === "all"}>
              All cities
            </FilterChip>
            {CITIES.map((c) => (
              <FilterChip
                key={c.name}
                href={buildHref(c.name, conditionFilter)}
                active={cityFilter === c.name}
              >
                {c.name}
                <span className="ml-1.5 text-xs text-ink-muted">{c.country}</span>
              </FilterChip>
            ))}
          </div>
        </div>
        <div>
          <p className="label mb-2">Condition</p>
          <div className="flex flex-wrap gap-2">
            <FilterChip href={buildHref(cityFilter, "all")} active={conditionFilter === "all"}>
              All conditions
            </FilterChip>
            {CONDITION_LIST.map((c) => (
              <FilterChip
                key={c.id}
                href={buildHref(cityFilter, c.id)}
                active={conditionFilter === c.id}
              >
                {c.name}
              </FilterChip>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-7 md:grid-cols-2">
        {filtered.map((e) => {
          const cond = CONDITIONS[e.condition];
          const start = new Date(e.startsAt);
          const isFull = e.reservations >= e.capacity;
          return (
            <article key={e.slug} className="surface p-7 flex flex-col">
              <div className="flex items-center gap-2 text-xs text-ink-muted">
                <span className="pill border-teal/30 bg-teal-wash text-teal-deep">{cond.name}</span>
                <span>·</span>
                <span>
                  {e.city}, {e.country}
                </span>
              </div>
              <h2 className="mt-4 font-serif text-2xl text-ink leading-snug">{e.title}</h2>
              <p className="mt-2 text-sm text-ink-muted">
                {start.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })} ·{" "}
                {start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
              </p>

              <div className="mt-5 space-y-3 text-sm">
                <div>
                  <p className="label text-ink-muted">Venue</p>
                  <p className="mt-1 text-ink">{e.venue}</p>
                  <p className="mt-1 text-ink-muted leading-relaxed">{e.venueNote}</p>
                </div>
                {e.coHostOrg && (
                  <div>
                    <p className="label text-ink-muted">Co-hosted with</p>
                    <p className="mt-1 text-ink">{e.coHostOrg}</p>
                  </div>
                )}
              </div>

              <p className="mt-5 text-sm text-ink-soft leading-relaxed">{e.description}</p>

              <div className="mt-6 pt-5 border-t border-paper-line flex items-center justify-between">
                <p className="text-sm text-ink-muted">
                  {isFull
                    ? "Fully reserved · waitlist open"
                    : `${e.capacity - e.reservations} of ${e.capacity} seats open`}
                </p>
                <Link
                  href={`/#waitlist?event=${e.slug}`}
                  className={`inline-flex h-10 items-center rounded-md px-4 text-sm font-medium no-underline transition-colors ${
                    isFull
                      ? "border border-paper-line bg-paper text-ink-soft hover:bg-paper-soft"
                      : "bg-teal text-paper hover:bg-teal-deep"
                  }`}
                >
                  {isFull ? "Join waitlist" : "Reserve a seat"}
                </Link>
              </div>
            </article>
          );
        })}

        {filtered.length === 0 && (
          <div className="md:col-span-2 surface p-10 text-center">
            <p className="font-serif text-xl text-ink">Nothing in this slice yet.</p>
            <p className="mt-2 text-ink-soft">
              Events open as each city reaches density. Add your city to the waitlist below — we open in order of
              demand.
            </p>
            <div className="mt-5">
              <Link
                href="/#waitlist"
                className="inline-flex h-10 items-center rounded-md bg-teal px-5 text-sm font-medium text-paper no-underline hover:bg-teal-deep"
              >
                Join the waitlist
              </Link>
            </div>
          </div>
        )}
      </section>

      <footer className="mt-14 max-w-readable text-xs text-ink-muted leading-relaxed">
        Mira events are social gatherings. Mira does not provide medical care, dietary prescription, or supervision.
        Attendees participate at their own discretion. Charity co-hosts and venues are listed for transparency and
        do not endorse individual dietary choices.
      </footer>
    </div>
  );
}

function FilterChip({
  href,
  active,
  children
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`h-9 inline-flex items-center rounded-full border px-4 text-sm no-underline transition-colors ${
        active
          ? "border-teal bg-teal text-paper"
          : "border-paper-line bg-paper text-ink-soft hover:border-teal/40"
      }`}
    >
      {children}
    </Link>
  );
}

function buildHref(city: string | undefined, condition: ConditionId | "all") {
  const params = new URLSearchParams();
  if (city && city !== "all") params.set("city", city);
  if (condition !== "all") params.set("c", condition);
  const qs = params.toString();
  return `/together${qs ? `?${qs}` : ""}`;
}
