import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Security & Privacy",
  description:
    "How Mira protects your information today, what is deferred to V2, and what we will not do."
};

export default function SecurityPage() {
  return (
    <div className="container-prose py-16 md:py-24">
      <p className="label">Legal · Security &amp; privacy</p>
      <h1 className="mt-3 font-serif text-headline text-ink leading-tight">
        Quiet by design. Honest about the gaps.
      </h1>
      <p className="mt-6 text-lede text-ink-soft">
        We believe security in healthcare is mostly a matter of telling the truth about what you do
        and what you don't. This page is that truth.
      </p>

      <Section title="Today, in V1, we collect very little">
        <p>
          Mira is an information and community platform, not a medical record. We deliberately do
          not store any protected health information. From you we collect:
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-1.5">
          <li>Your email address.</li>
          <li>Your country and (optional) city.</li>
          <li>Your self-disclosed condition tag, if you tell us.</li>
          <li>Your role (patient, caregiver, clinician, other), if you tell us.</li>
          <li>Server-side request metadata (IP, user-agent, timestamps) for abuse defense.</li>
        </ul>
        <p>That is the whole list. We do not collect lab values, prescriptions, or diagnoses.</p>
      </Section>

      <Section title="The eleven things in place right now">
        <ul className="space-y-3 list-none">
          <Item title="HTTPS-only, with HSTS preload (max-age=63072000)" body="Every request is encrypted in transit. Browsers refuse to connect over plain HTTP for two years after first visit." />
          <Item title="Strict Content Security Policy" body="Scripts, styles, fonts, images, and outbound API calls are restricted to an explicit allowlist (Vercel, PubMed, Open Food Facts, Google AI). XSS injection has no path to a known origin." />
          <Item title="Cross-origin isolation" body="X-Frame-Options DENY, Referrer-Policy strict-origin, Cross-Origin-Opener-Policy same-origin, Cross-Origin-Resource-Policy same-site, Permissions-Policy disabling camera, microphone, and Google FLoC tracking." />
          <Item title="Postgres SSL with channel binding" body="Database connections require sslmode=require with channel binding, defending against active man-in-the-middle." />
          <Item title="Secrets encrypted at rest in Vercel" body="API keys and database URLs are stored as Sensitive environment variables, encrypted with AWS KMS. They cannot be read back through the CLI." />
          <Item title="Drizzle ORM with parameterized queries" body="All database queries use prepared statements. SQL injection has no path." />
          <Item title="Zod validation at every API boundary" body="Inbound payloads are schema-validated before any code runs. Malformed or unexpected fields are rejected with a 400." />
          <Item title="Postgres-backed rate limiting" body="Per-IP fixed-window limits: 5 waitlist signups/hour, 30 food scans/hour, 60 research fetches/hour. Single atomic upsert per check; race-condition-safe across serverless instances." />
          <Item title="Disposable email blocklist" body="Submissions from common throwaway providers (mailinator, guerrillamail, 10minutemail, and 17 others) are rejected." />
          <Item title="Cloudflare Turnstile bot protection" body="Privacy-friendly proof-of-humanity check on the waitlist form, verified server-side. Activates automatically when configured; falls open when Cloudflare is unreachable so legitimate users are never locked out." />
          <Item title="Continuous dependency scanning" body="GitHub Dependabot opens grouped pull requests for npm and GitHub Actions updates every Monday. CodeQL runs SAST on every push and weekly on a schedule." />
        </ul>
      </Section>

      <Section title="What we will never do">
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Sell, rent, or share your email or condition data with third parties.</li>
          <li>Use your information to train AI models.</li>
          <li>Send your personal information to OpenAI or any LLM provider in our prompts. We summarize <em>public</em> research papers and <em>public</em> nutrition data, never user records.</li>
          <li>Send marketing emails. The only emails you will get are city launch notices and replies to your own messages.</li>
          <li>Track you across the web. No FLoC, no third-party advertising pixels, no Facebook Pixel, no Google Ads.</li>
          <li>Lock you in. You can ask us to delete every byte we hold by replying to any email or writing to <Link href="mailto:hello@mira.health" className="text-teal-deep">hello@mira.health</Link>. We respond within seven days.</li>
        </ul>
      </Section>

      <Section title="What is deferred until V2 (and why we are honest about it)">
        <p>
          The hardening below is meaningful only when there are user accounts and stored health
          records. Until those exist, this work would be theater. We will turn it on before the
          first verified patient is onboarded.
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-1.5">
          <li>Mandatory MFA on every account.</li>
          <li>WebAuthn / hardware keys on the admin plane.</li>
          <li>Per-user envelope encryption for any stored medical document, with master keys in a hardware security module.</li>
          <li>End-to-end encryption (Signal Protocol) on community chat.</li>
          <li>Audit-log immutability triggers and seven-year retention.</li>
          <li>Postgres row-level security policies for multi-tenant isolation.</li>
          <li>Independent third-party penetration test before paid launch.</li>
          <li>SOC 2 Type II readiness audit before the first enterprise contract.</li>
          <li>Public bug bounty via HackerOne after revenue.</li>
        </ul>
      </Section>

      <Section title="Where your data lives">
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Application: Vercel (United States, by default; configurable per region in V2).</li>
          <li>Database: Neon Postgres, AWS US-East-1.</li>
          <li>AI inference: Google Gemini API (United States). We send only anonymous research-paper text and anonymous nutrition data — never your information.</li>
          <li>Authentication: not yet — V1 is read-only with a public waitlist.</li>
        </ul>
      </Section>

      <Section title="Reporting a vulnerability">
        <p>
          If you believe you have found a security issue, write to{" "}
          <Link href="mailto:security@mira.health" className="text-teal-deep">
            security@mira.health
          </Link>{" "}
          with a description and reproduction steps. We will respond within 48 hours and credit you
          publicly if you wish. We do not yet run a bug bounty, but we will say thank you, and we
          will fix it.
        </p>
      </Section>

      <Section title="The principles behind all of this">
        <ol className="list-decimal pl-6 space-y-1.5">
          <li>Collect the least data that lets the product work.</li>
          <li>Encrypt everything in transit and at rest, by default.</li>
          <li>Validate at every boundary, even when we wrote both sides.</li>
          <li>Tell the truth about what we do not yet protect.</li>
          <li>Make deletion as easy as signup.</li>
          <li>Treat your data the way we would want a clinician to treat ours.</li>
        </ol>
      </Section>

      <p className="mt-12 text-sm text-ink-muted">
        This page was last updated on{" "}
        {new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
        . We will update it whenever any of the above materially changes, and we will note the
        change in the change log.
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="font-serif text-2xl md:text-3xl text-ink leading-snug">{title}</h2>
      <div className="mt-5 reading">{children}</div>
    </section>
  );
}

function Item({ title, body }: { title: string; body: string }) {
  return (
    <li className="flex gap-4">
      <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-sage flex-shrink-0" aria-hidden />
      <div>
        <p className="font-serif text-lg text-ink">{title}</p>
        <p className="mt-1 text-ink-soft leading-relaxed">{body}</p>
      </div>
    </li>
  );
}
