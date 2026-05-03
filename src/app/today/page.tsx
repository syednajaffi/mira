import Link from "next/link";
import type { Metadata } from "next";
import { fetchRecentPapers, pubmedUrl, doiUrl } from "@/lib/pubmed";
import { summarizePaper, type PaperSummary } from "@/lib/gemini";
import { CONDITIONS, CONDITION_LIST, type ConditionId, isConditionId } from "@/lib/conditions";
import { hasGemini } from "@/lib/env";
import { formatDate, formatRelative } from "@/lib/utils";

export const revalidate = 21600;

export const metadata: Metadata = {
  title: "Today's research",
  description:
    "Daily AI-summarized clinical research for Type 2 Diabetes, Hypertension, and Asthma — sourced from PubMed, with full citations."
};

export default async function TodayPage({
  searchParams
}: {
  searchParams: { c?: string };
}) {
  const condParam = searchParams.c;
  const condition: ConditionId =
    condParam && isConditionId(condParam) ? condParam : "t2d";
  const cond = CONDITIONS[condition];

  let papers: Array<{
    pmid: string;
    doi: string | null;
    title: string;
    authors: string;
    journal: string;
    publishedAt: Date | null;
    pubTypes: string[];
    abstract: string;
    summary: PaperSummary | null;
  }> = [];
  let fetchError: string | null = null;

  try {
    const raw = await fetchRecentPapers(condition, 5);
    papers = await Promise.all(
      raw.map(async (p) => {
        let summary: PaperSummary | null = null;
        if (hasGemini && p.abstract) {
          try {
            summary = await summarizePaper({
              title: p.title,
              journal: p.journal,
              abstract: p.abstract,
              pubTypes: p.pubTypes,
              condition
            });
          } catch (err) {
            console.error("[today] summary error", p.pmid, err);
          }
        }
        return { ...p, summary };
      })
    );
  } catch (err) {
    console.error("[today] fetch error", err);
    fetchError = "Could not reach PubMed right now. Try again in a minute.";
  }

  const today = new Date();

  return (
    <div className="container-page py-12 md:py-20">
      <header className="max-w-readable">
        <p className="label">{formatDate(today, "en-US")}</p>
        <h1 className="mt-3 font-serif text-headline text-ink leading-tight">
          Today, in {cond.name.toLowerCase()}.
        </h1>
        <p className="mt-5 text-lede text-ink-soft">
          {papers.length > 0
            ? `${papers.length} papers worth your attention. We never tell you what to do; we tell you what was found.`
            : "We'll have papers here as soon as PubMed responds. Try another condition while you wait."}
        </p>
      </header>

      <nav className="mt-10 flex flex-wrap gap-2">
        {CONDITION_LIST.map((c) => {
          const active = c.id === condition;
          return (
            <Link
              key={c.id}
              href={`/today?c=${c.id}`}
              className={`h-9 inline-flex items-center rounded-full border px-4 text-sm no-underline transition-colors ${
                active
                  ? "border-teal bg-teal text-paper"
                  : "border-paper-line bg-paper text-ink-soft hover:border-teal/40"
              }`}
            >
              {c.name}
            </Link>
          );
        })}
      </nav>

      {!hasGemini && (
        <div className="mt-10 rounded-lg border border-amber/40 bg-amber-wash/40 p-5 text-sm text-ink-soft">
          <p className="font-medium text-ink">Live AI summaries are not enabled in this environment.</p>
          <p className="mt-1">
            Set <code className="font-mono text-xs">GOOGLE_AI_API_KEY</code> in your environment to enable plain-English summaries.
            Free at <a className="text-teal-deep" href="https://aistudio.google.com/apikey">aistudio.google.com</a>.
          </p>
        </div>
      )}

      {fetchError && (
        <div className="mt-10 rounded-lg border border-clay/40 bg-clay-wash/40 p-5 text-sm text-ink-soft">
          {fetchError}
        </div>
      )}

      <section className="mt-12 grid gap-7 max-w-readable">
        {papers.map((p, i) => (
          <article key={p.pmid} className={`surface p-7 md:p-8 ${i === 0 ? "shadow-card" : ""}`}>
            <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
              <span className="pill border-teal/30 bg-teal-wash text-teal-deep">{cond.name}</span>
              {p.summary && (
                <span className="pill border-paper-line">
                  <StrengthDot strength={p.summary.strength} /> {prettyStrength(p.summary.strength)}
                  {p.summary.sampleSize ? ` · n = ${p.summary.sampleSize.toLocaleString()}` : ""}
                </span>
              )}
              {p.publishedAt && <span>· {formatRelative(p.publishedAt)}</span>}
            </div>

            <h2 className="mt-4 font-serif text-2xl md:text-3xl text-ink leading-snug">
              {p.title}
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              {[p.journal, p.authors].filter(Boolean).join(" · ")}
            </p>

            {p.summary ? (
              <dl className="mt-6 space-y-4 reading">
                <SummaryRow label="What they found" body={p.summary.finding} />
                <SummaryRow label="Why it might matter" body={p.summary.meaning} />
                <SummaryRow label="How strong" body={p.summary.evidence} />
              </dl>
            ) : (
              <p className="mt-5 reading text-ink-muted italic">
                Summary not available. Read the full abstract on PubMed.
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-3 text-sm">
              <Link
                href={pubmedUrl(p.pmid)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-teal-deep no-underline hover:text-teal"
              >
                Read on PubMed
                <span aria-hidden>↗</span>
              </Link>
              {p.doi && (
                <Link
                  href={doiUrl(p.doi)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-ink-muted no-underline hover:text-ink"
                >
                  DOI · {p.doi}
                </Link>
              )}
            </div>
          </article>
        ))}
      </section>

      <footer className="mt-14 max-w-readable text-xs text-ink-muted leading-relaxed">
        Mira summarizes published research for educational purposes. Summaries are produced with the help of an AI
        model and may contain errors. Always read the original paper. Never change treatment without your clinician.
      </footer>
    </div>
  );
}

function SummaryRow({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <dt className="label text-ink-muted">{label}</dt>
      <dd className="mt-1.5">{body}</dd>
    </div>
  );
}

function prettyStrength(s: PaperSummary["strength"]) {
  switch (s) {
    case "preprint":
      return "Preprint";
    case "small-study":
      return "Small study";
    case "guideline":
      return "Clinical guideline";
    default:
      return "Peer-reviewed";
  }
}

function StrengthDot({ strength }: { strength: PaperSummary["strength"] }) {
  const color =
    strength === "preprint"
      ? "bg-clay"
      : strength === "small-study"
        ? "bg-amber-deep"
        : strength === "guideline"
          ? "bg-teal-deep"
          : "bg-sage";
  return <span className={`h-1.5 w-1.5 rounded-full ${color}`} aria-hidden />;
}
