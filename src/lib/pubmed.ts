import { env } from "./env";
import type { ConditionId } from "./conditions";
import { CONDITIONS } from "./conditions";

const BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const TOOL = "mira";
const EMAIL = "research@mira.health";

interface ESearchResult {
  esearchresult: { idlist: string[]; count: string };
}

interface ESummaryAuthor {
  name?: string;
  authtype?: string;
}
interface ESummaryArticleIds {
  idtype?: string;
  value?: string;
}
interface ESummaryDoc {
  uid: string;
  title: string;
  authors?: ESummaryAuthor[];
  fulljournalname?: string;
  source?: string;
  pubdate?: string;
  sortpubdate?: string;
  articleids?: ESummaryArticleIds[];
  pmcrefcount?: string;
  pubtype?: string[];
}
interface ESummaryResult {
  result: { uids: string[] } & Record<string, ESummaryDoc | string[]>;
}

export interface PubMedPaper {
  pmid: string;
  doi: string | null;
  title: string;
  authors: string;
  journal: string;
  publishedAt: Date | null;
  abstract: string;
  pubTypes: string[];
}

function withKey(url: string) {
  const sep = url.includes("?") ? "&" : "?";
  return env.NCBI_API_KEY ? `${url}${sep}api_key=${env.NCBI_API_KEY}` : url;
}

async function esearch(query: string, days = 21, max = 30): Promise<string[]> {
  const params = new URLSearchParams({
    db: "pubmed",
    term: `${query} AND ("last ${days} days"[PDAT])`,
    retmode: "json",
    retmax: String(max),
    sort: "pub_date",
    tool: TOOL,
    email: EMAIL
  });
  const url = withKey(`${BASE}/esearch.fcgi?${params.toString()}`);
  const res = await fetch(url, { next: { revalidate: 21600 } });
  if (!res.ok) throw new Error(`PubMed esearch failed: ${res.status}`);
  const json = (await res.json()) as ESearchResult;
  return json.esearchresult?.idlist ?? [];
}

async function esummary(ids: string[]): Promise<ESummaryDoc[]> {
  if (ids.length === 0) return [];
  const params = new URLSearchParams({
    db: "pubmed",
    id: ids.join(","),
    retmode: "json",
    tool: TOOL,
    email: EMAIL
  });
  const url = withKey(`${BASE}/esummary.fcgi?${params.toString()}`);
  const res = await fetch(url, { next: { revalidate: 21600 } });
  if (!res.ok) throw new Error(`PubMed esummary failed: ${res.status}`);
  const json = (await res.json()) as ESummaryResult;
  const docs: ESummaryDoc[] = [];
  for (const uid of json.result.uids ?? []) {
    const doc = json.result[uid];
    if (doc && !Array.isArray(doc)) docs.push(doc as ESummaryDoc);
  }
  return docs;
}

async function efetchAbstracts(ids: string[]): Promise<Record<string, string>> {
  if (ids.length === 0) return {};
  const params = new URLSearchParams({
    db: "pubmed",
    id: ids.join(","),
    rettype: "abstract",
    retmode: "xml",
    tool: TOOL,
    email: EMAIL
  });
  const url = withKey(`${BASE}/efetch.fcgi?${params.toString()}`);
  const res = await fetch(url, { next: { revalidate: 21600 } });
  if (!res.ok) throw new Error(`PubMed efetch failed: ${res.status}`);
  const xml = await res.text();
  const out: Record<string, string> = {};
  const articleRegex = /<PubmedArticle>([\s\S]*?)<\/PubmedArticle>/g;
  let match;
  while ((match = articleRegex.exec(xml)) !== null) {
    const block = match[1] ?? "";
    const pmidMatch = block.match(/<PMID[^>]*>(\d+)<\/PMID>/);
    const pmid = pmidMatch?.[1];
    if (!pmid) continue;
    const abstractParts: string[] = [];
    const absRegex = /<AbstractText(?:[^>]*Label="([^"]+)")?[^>]*>([\s\S]*?)<\/AbstractText>/g;
    let aMatch;
    while ((aMatch = absRegex.exec(block)) !== null) {
      const label = aMatch[1];
      const body = (aMatch[2] ?? "").replace(/<[^>]+>/g, "").trim();
      if (!body) continue;
      abstractParts.push(label ? `${label}: ${body}` : body);
    }
    if (abstractParts.length > 0) out[pmid] = abstractParts.join("\n\n");
  }
  return out;
}

export async function fetchRecentPapers(condition: ConditionId, max = 6): Promise<PubMedPaper[]> {
  const def = CONDITIONS[condition];
  // Filter to higher-quality publication types to reduce noise.
  const query = `${def.pubmedQuery} AND (Randomized Controlled Trial[Publication Type] OR Meta-Analysis[Publication Type] OR Systematic Review[Publication Type] OR Review[Publication Type] OR Clinical Trial[Publication Type] OR Cohort Studies[MeSH])`;

  let ids = await esearch(query, 21, max * 2);
  if (ids.length < max) {
    // Fallback: relax filters, look back further
    ids = await esearch(def.pubmedQuery, 60, max * 2);
  }
  ids = ids.slice(0, max);

  const [summaries, abstracts] = await Promise.all([esummary(ids), efetchAbstracts(ids)]);

  return summaries.map((s) => {
    const doi = s.articleids?.find((a) => a.idtype === "doi")?.value ?? null;
    const authorsList = (s.authors ?? [])
      .filter((a) => a.authtype === "Author" && a.name)
      .map((a) => a.name as string);
    const authors =
      authorsList.length === 0
        ? ""
        : authorsList.length <= 3
          ? authorsList.join(", ")
          : `${authorsList[0]} et al.`;
    const dateStr = s.sortpubdate ?? s.pubdate ?? "";
    const publishedAt = dateStr ? new Date(dateStr.replace(/\//g, "-")) : null;
    return {
      pmid: s.uid,
      doi,
      title: s.title.replace(/\.$/, ""),
      authors,
      journal: s.fulljournalname ?? s.source ?? "",
      publishedAt: publishedAt && !Number.isNaN(publishedAt.getTime()) ? publishedAt : null,
      abstract: abstracts[s.uid] ?? "",
      pubTypes: s.pubtype ?? []
    };
  });
}

export function pubmedUrl(pmid: string) {
  return `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
}

export function doiUrl(doi: string) {
  return `https://doi.org/${doi}`;
}
