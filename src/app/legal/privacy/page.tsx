import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Mira handles your information."
};

export default function PrivacyPage() {
  return (
    <div className="container-prose py-16 md:py-24">
      <p className="label">Legal · Privacy</p>
      <h1 className="mt-3 font-serif text-headline text-ink leading-tight">Your data, briefly.</h1>

      <section className="mt-10 reading">
        <p>
          We collect the minimum information needed to make Mira work: your email, your country/city if you tell us,
          your condition tag if you tell us, and your role (patient, caregiver, clinician, other).
        </p>
        <p>
          We use it to (a) tell you when Mira opens in your city, (b) show you the right condition's research feed
          and food guidelines, and (c) understand which cities to open next. That is all.
        </p>
        <p>
          We never sell your data. We never share your email with third parties for marketing. We never use your
          information to train AI models.
        </p>
        <p>
          We store data on Postgres hosted by Neon (United States or EU region depending on residency) and on
          Vercel for application hosting. We use Google's Gemini API to generate research summaries from public
          paper abstracts and to assess product nutrition; the prompts we send do not include your personal
          information.
        </p>
        <p>
          You can delete your data any day. Email{" "}
          <a className="text-teal-deep" href="mailto:hello@mira.health">
            hello@mira.health
          </a>{" "}
          with the subject "delete me" and we'll erase your record within 7 days.
        </p>
        <p>
          For users in the European Union: you have the rights of access, rectification, erasure, restriction,
          portability, and objection under the GDPR. Exercise any of these by emailing the address above. For users
          in India: you have analogous rights under the Digital Personal Data Protection Act, 2023.
        </p>
        <p>
          We will update this page if anything changes. Last updated: {new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}.
        </p>
      </section>
    </div>
  );
}
