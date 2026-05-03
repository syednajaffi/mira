import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Mira is a small team building a quiet companion for chronic illness. Here is what we believe."
};

export default function AboutPage() {
  return (
    <div className="container-prose py-16 md:py-24">
      <p className="label">About</p>
      <h1 className="mt-3 font-serif text-headline text-ink leading-tight">
        A quiet companion for the long road.
      </h1>

      <section className="mt-10 reading">
        <p>
          Chronic illness is mostly waiting. Waiting for the next clinic visit, the next lab result, the next paper
          your doctor hasn't read yet. Mira is for the time in between.
        </p>
        <p>
          We help people living with a chronic condition stay informed, stay nourished, and stay connected. Not by
          telling them what to do — by showing them what was found, what is on the shelf, and who lives nearby.
        </p>
      </section>

      <section id="mbegum" className="mt-16">
        <p className="label">The MBegum tier</p>
        <h2 className="mt-3 font-serif text-headline text-ink">A name we don't put on the storefront.</h2>
        <div className="mt-7 reading">
          <p>
            The founder's mother lives with a chronic condition. So the half-price tier of Mira is named after her,
            and dedicated to every patient — and every parent of a patient — on a fixed income.
          </p>
          <p>
            We don't ask for paperwork. We ask you to attest that you qualify. We sample-audit a small percentage to
            keep the tier honest; the rest, we trust. The world has enough places where chronic illness costs more.
            Mira does not need to be one of them.
          </p>
          <p>
            If, one day, this app helps even a few mothers feel less alone, the founder will consider the entire
            project a success.
          </p>
        </div>
      </section>

      <section className="mt-16">
        <p className="label">What we believe</p>
        <h2 className="mt-3 font-serif text-headline text-ink">Six small principles.</h2>
        <ol className="mt-7 space-y-5 reading list-none">
          <Principle
            n={1}
            title="Informational, not prescriptive."
            body="We summarize. We surface. We never replace a clinician. Every screen says so."
          />
          <Principle
            n={2}
            title="Citations on every claim."
            body="Every research summary links to a DOI. Every dietary verdict cites the public guideline behind it. If we cannot show you a source, we do not show you the claim."
          />
          <Principle
            n={3}
            title="Trust by minimum data."
            body="We collect the least information that lets the product work. We never sell data. We never share email lists."
          />
          <Principle
            n={4}
            title="Real cities, real venues, real charities."
            body="Events are co-hosted with established condition charities. Single-condition tables. Pre-vetted venues. A small refundable hold."
          />
          <Principle
            n={5}
            title="Pay what fits."
            body="Free tier exists. MBegum tier exists. Pro tier subsidizes both. Apple and Google take a cut on mobile; we don't pretend otherwise."
          />
          <Principle
            n={6}
            title="Quiet by design."
            body="No streaks that shame. No badges. No rage-bait. Notifications opt-in only. Read it in the morning, close it, get on with your day."
          />
        </ol>
      </section>

      <section className="mt-16">
        <p className="label">Sources we lean on</p>
        <ul className="mt-5 space-y-1.5 text-sm text-ink-soft">
          <li>· PubMed, Europe PMC, medRxiv, bioRxiv — for research</li>
          <li>· Open Food Facts — for product nutrition data</li>
          <li>· WHO, ICMR, NHS, ADA, AHA, GINA — for dietary guidelines</li>
          <li>· Diabetes India, Indian Heart Association, Lung Care Foundation, Beyond Type 2, American Heart Association — for events</li>
        </ul>
      </section>

      <section className="mt-16">
        <p className="label">Reach us</p>
        <p className="mt-3 text-ink-soft">
          A real person reads every email.{" "}
          <Link href="mailto:hello@mira.health" className="text-teal-deep">
            hello@mira.health
          </Link>
        </p>
      </section>
    </div>
  );
}

function Principle({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <li className="flex gap-5">
      <span className="font-serif text-2xl text-amber-deep tabular-nums shrink-0 w-8">{n}</span>
      <div>
        <p className="font-serif text-xl text-ink">{title}</p>
        <p className="mt-1.5 text-ink-soft leading-relaxed">{body}</p>
      </div>
    </li>
  );
}
