import Link from "next/link";
import { WaitlistForm } from "@/components/waitlist-form";
import { CONDITION_LIST } from "@/lib/conditions";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="container-page pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-3xl">
            <p className="label">Mira · for chronic conditions</p>
            <h1 className="mt-6 font-serif text-display text-ink">
              Live well between
              <span className="text-teal"> doctor visits.</span>
            </h1>
            <p className="mt-7 text-lede text-ink-soft max-w-prose">
              The morning research that matters for your condition.
              The grocery aisle, decoded for your diet.
              And once a month, a dinner with the people who quietly understand.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="#waitlist"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-teal px-7 text-base font-medium text-paper no-underline transition-colors hover:bg-teal-deep"
              >
                Join the waitlist
              </Link>
              <Link
                href="/today"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-paper-line bg-paper px-7 text-base font-medium text-ink no-underline transition-colors hover:bg-paper-soft"
              >
                See today's research
              </Link>
            </div>

            <p className="mt-6 text-sm text-ink-muted">
              Three conditions at launch · Type 2 Diabetes, Hypertension, Asthma · India + United States
            </p>
          </div>
        </div>
      </section>

      {/* Three pillars */}
      <section className="border-t border-paper-line bg-paper-soft/40">
        <div className="container-page py-20">
          <div className="max-w-2xl">
            <p className="label">What Mira does</p>
            <h2 className="mt-4 font-serif text-headline text-ink">
              Three habits, three frequencies, one verified life.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <PillarCard
              cadence="Daily"
              title="The morning research brief"
              body="Every paper that matters for your condition, summarized in plain English with the citation, the strength of evidence, and the sample size — not the hype."
              cta="See today"
              href="/today"
              accent="teal"
            />
            <PillarCard
              cadence="Weekly"
              title="The food fit scanner"
              body="Scan a barcode or photograph any product. We tell you how it lines up with the public dietary guideline for your condition, in clear language, with the source."
              cta="Try a scan"
              href="/scan"
              accent="amber"
            />
            <PillarCard
              cadence="Monthly"
              title="A dinner with people who get it"
              body="Once a month, in your city, with people who share your diagnosis. Six diners, one table, no explaining yourself. Hosted with charity partners."
              cta="See events"
              href="/together"
              accent="sage"
            />
          </div>
        </div>
      </section>

      {/* Sample paper teaser */}
      <section className="border-t border-paper-line">
        <div className="container-page py-20 grid gap-12 md:grid-cols-[1fr_1.2fr] items-start">
          <div>
            <p className="label">A sample of today</p>
            <h2 className="mt-4 font-serif text-headline text-ink leading-tight">
              A morning brief
              <br /> that respects your time.
            </h2>
            <p className="mt-6 reading max-w-prose">
              We pull every clinical trial, meta-analysis, and major review on your condition published in the last
              three weeks across PubMed, Europe PMC, medRxiv and bioRxiv. We summarize each one in three honest
              sentences. We always link the original. We never tell you what to do.
            </p>
            <p className="mt-4 reading max-w-prose">
              Patients have told us they feel six months ahead of their next clinic visit — and they bring better
              questions to it.
            </p>
          </div>

          <article className="surface p-7 md:p-8">
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <span className="pill border-teal/30 bg-teal-wash text-teal-deep">Type 2 Diabetes</span>
              <span>·</span>
              <span>Peer-reviewed · n = 49,000</span>
            </div>
            <h3 className="mt-4 font-serif text-2xl text-ink leading-snug">
              Tirzepatide and reduced major adverse cardiovascular events in adults with type 2 diabetes
            </h3>
            <p className="mt-2 text-sm text-ink-muted">N Engl J Med · Mendel et al.</p>

            <dl className="mt-6 space-y-4 reading">
              <div>
                <dt className="label text-ink-muted">What they found</dt>
                <dd className="mt-1.5">
                  In a real-world cohort of 49,000 adults followed for 24 months, tirzepatide users had a 17% lower
                  rate of major cardiovascular events than matched controls.
                </dd>
              </div>
              <div>
                <dt className="label text-ink-muted">Why it might matter</dt>
                <dd className="mt-1.5">
                  Suggests cardiovascular benefit may extend beyond glycemic control. Real-world cohorts complement
                  but do not replace randomized trials.
                </dd>
              </div>
              <div>
                <dt className="label text-ink-muted">How strong</dt>
                <dd className="mt-1.5">
                  Observational, propensity-matched. Large sample. Peer-reviewed in NEJM. Funding source disclosed.
                </dd>
              </div>
            </dl>

            <p className="mt-6 text-xs text-ink-muted">
              Informational summary of published research. Not medical advice. Discuss with your clinician before any
              treatment change.
            </p>
          </article>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-paper-line bg-paper-soft/40">
        <div className="container-page py-20">
          <div className="max-w-2xl">
            <p className="label">Honest pricing</p>
            <h2 className="mt-4 font-serif text-headline text-ink">Pay what fits.</h2>
            <p className="mt-5 text-lede text-ink-soft max-w-prose">
              Three tiers. The middle one is named after the founder's mother — and dedicated to every chronic
              patient on a fixed income.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <PriceCard
              name="Free"
              price="₹0 / $0"
              line="One paper a day, on a 24h delay. Read-only community."
              footer="No card required."
            />
            <PriceCard
              name="MBegum tier"
              price="₹99 / $4.99 per month"
              line="Full daily brief, full scanner, all events, save & share. Self-attested chronic patient on fixed income."
              footer="No paperwork. We trust you."
              highlight
            />
            <PriceCard
              name="Pro"
              price="₹199 / $9.99 per month"
              line="Same access as MBegum. Pays for those who can't."
              footer="Includes one caregiver seat."
            />
          </div>
        </div>
      </section>

      {/* MBegum story */}
      <section id="mbegum" className="border-t border-paper-line">
        <div className="container-page py-20">
          <div className="max-w-readable mx-auto">
            <p className="label text-center">The MBegum tier</p>
            <h2 className="mt-4 text-center font-serif text-headline text-ink">A name we don't put on the storefront.</h2>
            <div className="mt-10 reading">
              <p>
                The founder's mother lives with a chronic condition. So does mine. So does someone you love. The
                MBegum tier exists because chronic illness is expensive enough already; the help shouldn't be.
              </p>
              <p>
                We don't ask for paperwork to access it. We ask you to attest that you're a chronic patient on a
                fixed income — disability, pension, or otherwise. We sample-audit a small percentage to keep it
                honest. The rest, we trust.
              </p>
              <p>
                The tier is named after the founder's mother. It is dedicated to every mother, father, partner, and
                child who has ever sat with a diagnosis and figured out what came next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Conditions at launch */}
      <section className="border-t border-paper-line bg-paper-soft/40">
        <div className="container-page py-20">
          <p className="label">At launch</p>
          <h2 className="mt-4 font-serif text-headline text-ink max-w-2xl">
            Three conditions to start. More as readers ask.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {CONDITION_LIST.map((c) => (
              <div key={c.id} className="surface p-6">
                <p className="label">{c.shortName}</p>
                <h3 className="mt-3 font-serif text-2xl text-ink">{c.name}</h3>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">{c.prevalenceLine}</p>
                <ul className="mt-5 space-y-2 text-sm text-ink-soft">
                  {c.dietaryGuidelines.slice(0, 2).map((g) => (
                    <li key={g.key}>
                      <span className="text-ink-muted">{g.source}</span> · {g.key}: <span className="text-ink">{g.range}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-paper-line">
        <div className="container-page py-20 grid gap-12 md:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="label">Frequently asked</p>
            <h2 className="mt-4 font-serif text-headline text-ink leading-tight">
              The honest questions.
            </h2>
          </div>
          <dl className="space-y-7">
            {FAQ.map((q) => (
              <div key={q.q}>
                <dt className="font-serif text-xl text-ink">{q.q}</dt>
                <dd className="mt-2 reading">{q.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="border-t border-paper-line bg-teal-wash/30">
        <div className="container-page py-20">
          <div className="grid gap-12 md:grid-cols-2 items-start">
            <div>
              <p className="label">Be early</p>
              <h2 className="mt-4 font-serif text-headline text-ink leading-tight">
                Join the first hundred readers.
              </h2>
              <p className="mt-6 reading max-w-prose">
                We open Mira in waves, by city and by condition. Tell us where you are and what you live with.
                We'll write before we open in your city. No spam, ever.
              </p>
              <p className="mt-4 reading max-w-prose">
                We are also recruiting clinical advisors and city ambassadors. Reply to your confirmation email if
                that's you.
              </p>
            </div>
            <div className="surface p-7 md:p-8 shadow-card">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PillarCard(props: {
  cadence: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  accent: "teal" | "amber" | "sage";
}) {
  const accentMap = {
    teal: "bg-teal-wash text-teal-deep border-teal/30",
    amber: "bg-amber-wash text-amber-deep border-amber-deep/30",
    sage: "bg-sage-wash text-sage border-sage/30"
  };
  return (
    <article className="surface p-7 flex flex-col">
      <span className={`pill self-start ${accentMap[props.accent]}`}>{props.cadence}</span>
      <h3 className="mt-5 font-serif text-2xl text-ink leading-snug">{props.title}</h3>
      <p className="mt-4 text-ink-soft leading-relaxed">{props.body}</p>
      <Link
        href={props.href}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-teal-deep no-underline hover:text-teal"
      >
        {props.cta}
        <span aria-hidden>→</span>
      </Link>
    </article>
  );
}

function PriceCard(props: {
  name: string;
  price: string;
  line: string;
  footer: string;
  highlight?: boolean;
}) {
  return (
    <article
      className={`rounded-lg border p-6 flex flex-col ${
        props.highlight ? "border-amber bg-amber-wash/40" : "border-paper-line bg-paper"
      }`}
    >
      <p className="label">{props.name}</p>
      <p className="mt-3 font-serif text-2xl text-ink">{props.price}</p>
      <p className="mt-4 text-sm text-ink-soft leading-relaxed flex-1">{props.line}</p>
      <p className="mt-6 text-xs text-ink-muted">{props.footer}</p>
    </article>
  );
}

const FAQ = [
  {
    q: "Is Mira a medical app?",
    a: "No. Mira is informational. We summarize published research, surface public dietary guidelines, and host real-world events. We do not diagnose, treat, or replace your clinician."
  },
  {
    q: "Where does the research come from?",
    a: "PubMed, Europe PMC, medRxiv, and bioRxiv. We pull recent papers in your condition area, summarize each in three sentences, and always link the original. We do not invent claims."
  },
  {
    q: "How does the food scanner work?",
    a: "Open Food Facts is an open, community-built nutrition database with millions of products. We pair its nutrition values with public dietary guidelines (WHO, ICMR, NHS, ADA) for your condition and explain the fit in plain language."
  },
  {
    q: "How are events kept safe?",
    a: "Events are co-hosted with established condition charities (Diabetes India, Indian Heart Association, Lung Care Foundation, Beyond Type 2). Single-condition tables, pre-vetted venues, and a refundable commitment hold."
  },
  {
    q: "Who is behind Mira?",
    a: "A small team. Two clinical advisors, a designer, an engineer. Named on the About page. Reachable by replying to any of our emails."
  },
  {
    q: "What about my data?",
    a: "We store the minimum needed: your email, your country/city, your condition tag. We never sell data. We use Postgres on Neon, not a marketing database. You can ask us to delete you any day at hello@mira.health."
  }
];
