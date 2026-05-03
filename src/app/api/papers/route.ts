import { NextResponse, type NextRequest } from "next/server";
import { fetchRecentPapers } from "@/lib/pubmed";
import { summarizePaper, type PaperSummary } from "@/lib/gemini";
import { isConditionId } from "@/lib/conditions";
import { hasGemini } from "@/lib/env";

export const runtime = "nodejs";
export const revalidate = 21600; // 6 hours

interface Out {
  pmid: string;
  doi: string | null;
  title: string;
  authors: string;
  journal: string;
  publishedAt: string | null;
  pubTypes: string[];
  summary: PaperSummary | null;
}

export async function GET(req: NextRequest) {
  const condition = req.nextUrl.searchParams.get("condition") ?? "t2d";
  if (!isConditionId(condition)) {
    return NextResponse.json({ error: "Invalid condition" }, { status: 400 });
  }
  const limitParam = req.nextUrl.searchParams.get("limit");
  const limit = Math.min(Math.max(parseInt(limitParam ?? "4", 10) || 4, 1), 8);

  try {
    const papers = await fetchRecentPapers(condition, limit);

    const summaries = await Promise.all(
      papers.map(async (p): Promise<Out> => {
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
            console.error("[papers] summary error for pmid", p.pmid, err);
          }
        }
        return {
          pmid: p.pmid,
          doi: p.doi,
          title: p.title,
          authors: p.authors,
          journal: p.journal,
          publishedAt: p.publishedAt?.toISOString() ?? null,
          pubTypes: p.pubTypes,
          summary
        };
      })
    );

    return NextResponse.json(
      { condition, papers: summaries, generatedAt: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400"
        }
      }
    );
  } catch (err) {
    console.error("[papers] fetch error", err);
    return NextResponse.json({ error: "Could not load papers" }, { status: 502 });
  }
}
