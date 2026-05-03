import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms under which Mira is provided."
};

export default function TermsPage() {
  return (
    <div className="container-prose py-16 md:py-24">
      <p className="label">Legal · Terms</p>
      <h1 className="mt-3 font-serif text-headline text-ink leading-tight">The agreement, plainly.</h1>

      <section className="mt-10 reading">
        <p>
          Mira is provided as an informational and community service. By using Mira you agree to these terms. If you
          do not agree, please do not use Mira.
        </p>
        <p>
          <strong className="text-ink">Not medical advice.</strong> Nothing in Mira is medical advice, diagnosis, or
          treatment. See our medical disclaimer.
        </p>
        <p>
          <strong className="text-ink">Eligibility.</strong> You must be at least 16 years old to use Mira. To
          attend events, you must be at least 18.
        </p>
        <p>
          <strong className="text-ink">Events.</strong> Mira facilitates social gatherings co-hosted with charity
          partners. You attend at your own discretion. Mira, charity partners, and venues are not liable for
          health, dietary, or other outcomes related to attendance. Please disclose dietary restrictions to the
          venue directly.
        </p>
        <p>
          <strong className="text-ink">Acceptable use.</strong> Do not impersonate clinicians. Do not promote
          unverified treatments. Do not solicit money. Do not harass anyone. We will remove accounts that violate
          this in good faith judgment.
        </p>
        <p>
          <strong className="text-ink">Subscriptions.</strong> Pro and MBegum tiers are billed monthly or yearly.
          Cancel any time; you keep access through the end of the paid period. The MBegum tier is offered on the
          honor system; we sample-audit and may move users between tiers if a clear mismatch arises.
        </p>
        <p>
          <strong className="text-ink">Liability.</strong> To the fullest extent permitted by law, Mira's liability
          is limited to amounts paid to Mira in the prior twelve months.
        </p>
        <p>
          <strong className="text-ink">Changes.</strong> We may update these terms; we will email you when we do.
        </p>
        <p>
          Questions? Write to{" "}
          <a className="text-teal-deep" href="mailto:hello@mira.health">
            hello@mira.health
          </a>
          . Last updated: {new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}.
        </p>
      </section>
    </div>
  );
}
