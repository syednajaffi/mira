import { GoogleGenerativeAI } from "@google/generative-ai";
import { env, hasGemini } from "./env";
import { pickFirstObject } from "./utils";
import type { ConditionId } from "./conditions";
import { CONDITIONS } from "./conditions";

// Centralized model name — easy to swap when Google retires versions.
// gemini-1.5-flash was retired in 2025; gemini-2.5-flash is the current stable.
const GEMINI_MODEL = "gemini-2.5-flash";

let _client: GoogleGenerativeAI | null = null;

function getClient() {
  if (!hasGemini || !env.GOOGLE_AI_API_KEY) {
    throw new Error("GOOGLE_AI_API_KEY is not configured.");
  }
  if (!_client) _client = new GoogleGenerativeAI(env.GOOGLE_AI_API_KEY);
  return _client;
}

export interface PaperSummary {
  finding: string;
  meaning: string;
  evidence: string;
  strength: "preprint" | "small-study" | "peer-reviewed" | "guideline";
  sampleSize: number | null;
}

const SUMMARY_PROMPT = `You are a careful medical research librarian writing for chronic-illness patients. You never give medical advice. You always describe what a paper found, in plain English, and never editorialize beyond what the paper says.

Given a paper title, journal, abstract, and publication types, output a JSON object with EXACTLY these fields:

- finding: One sentence, plain English, what the paper actually found. Past tense. No hype.
- meaning: One sentence on why this might matter for patients with the condition, framed cautiously ("may", "appears to", "suggests"). Never prescriptive. Never "you should".
- evidence: One sentence describing the study design (e.g., "Randomized trial of 1,200 adults over 12 months").
- strength: One of: "preprint" (not yet peer-reviewed), "small-study" (n<200 or single-center), "peer-reviewed" (published in a peer-reviewed journal, n>=200), "guideline" (clinical guideline / consensus). Use the publication types and abstract to decide; default to "peer-reviewed" if a journal is named and abstract is structured.
- sampleSize: Integer if clearly stated in the abstract; otherwise null.

Output only the JSON object, no prose, no fences.`;

export async function summarizePaper(args: {
  title: string;
  journal: string;
  abstract: string;
  pubTypes: string[];
  condition: ConditionId;
}): Promise<PaperSummary> {
  const cond = CONDITIONS[args.condition];
  const model = getClient().getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
    systemInstruction: SUMMARY_PROMPT
  });

  const userPrompt = [
    `Condition: ${cond.name}`,
    `Title: ${args.title}`,
    `Journal: ${args.journal || "(unknown)"}`,
    `Publication types: ${args.pubTypes.join(", ") || "(unknown)"}`,
    "",
    "Abstract:",
    args.abstract || "(no abstract available — infer from title only and mark strength as 'preprint' if uncertain)"
  ].join("\n");

  const result = await model.generateContent(userPrompt);
  const text = result.response.text();
  const parsed = pickFirstObject<PaperSummary>(text);
  if (!parsed || !parsed.finding) {
    return {
      finding: args.title,
      meaning: "Summary could not be generated automatically. Please read the original abstract.",
      evidence: args.pubTypes.join(", ") || "Source: PubMed",
      strength: "peer-reviewed",
      sampleSize: null
    };
  }
  if (!["preprint", "small-study", "peer-reviewed", "guideline"].includes(parsed.strength)) {
    parsed.strength = "peer-reviewed";
  }
  return parsed;
}

const SCAN_PROMPT = `You are a careful nutrition educator writing for a person living with a specific chronic condition. You never give medical advice. You always describe what is in a food product, in plain English, and reference the relevant public health guideline. You never tell anyone what to eat or not eat.

You will receive: a product name, a nutrition table per 100g, and the user's condition. Output a JSON object with EXACTLY these fields:

- level: One of "fits", "moderate", "caution". Use "fits" when the product comfortably falls within the relevant guideline. Use "moderate" when one or more nutrients approach the guideline. Use "caution" when one or more nutrients clearly exceed the guideline.
- headline: One sentence, neutral, e.g. "High in sodium for a low-sodium plan." Do NOT use words like "bad", "avoid", "don't eat", "harmful". Use words like "fits", "above guideline", "consider portion".
- reasons: Array of 1-3 short strings, each explaining one specific nutrient finding with the actual number, e.g. "Sodium 980 mg / 100g — above the WHO 2,000 mg/day target."
- guidelines: Array of 1-3 short strings citing the source of the guideline, e.g. "WHO 2012 sodium guideline".

Output only the JSON object, no prose, no fences.`;

export interface FitVerdict {
  level: "fits" | "moderate" | "caution";
  headline: string;
  reasons: string[];
  guidelines: string[];
}

export async function generateFitVerdict(args: {
  productName: string;
  nutrition: Record<string, number | string | null>;
  condition: ConditionId;
}): Promise<FitVerdict> {
  const cond = CONDITIONS[args.condition];
  const model = getClient().getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: { temperature: 0.1, responseMimeType: "application/json" },
    systemInstruction: SCAN_PROMPT
  });

  const nutritionLines = Object.entries(args.nutrition)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => `- ${k}: ${v}`)
    .join("\n");

  const guidelinesLines = cond.dietaryGuidelines
    .map((g) => `- ${g.source} — ${g.key}: ${g.range}`)
    .join("\n");

  const userPrompt = [
    `Condition: ${cond.name}`,
    `Product: ${args.productName}`,
    "",
    "Nutrition (per 100 g unless stated):",
    nutritionLines || "(insufficient data)",
    "",
    "Relevant public dietary guidelines for this condition:",
    guidelinesLines
  ].join("\n");

  const result = await model.generateContent(userPrompt);
  const text = result.response.text();
  const parsed = pickFirstObject<FitVerdict>(text);
  if (!parsed) {
    return {
      level: "moderate",
      headline: "Unable to assess fit automatically. Read the nutrition label.",
      reasons: [],
      guidelines: cond.dietaryGuidelines.map((g) => `${g.source} — ${g.key}: ${g.range}`)
    };
  }
  if (!["fits", "moderate", "caution"].includes(parsed.level)) parsed.level = "moderate";
  return parsed;
}

export async function recognizeFoodFromImage(imageBase64: string, mimeType: string): Promise<string> {
  const model = getClient().getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: { temperature: 0.0, responseMimeType: "application/json" },
    systemInstruction:
      "You are a food identification assistant. Given a photo of a food item or packaged product, output JSON: { \"name\": string, \"brand\": string|null, \"category\": string, \"barcodeVisible\": string|null }. If you cannot identify, set name to \"Unknown food\". Output only the JSON object."
  });

  const result = await model.generateContent([
    { inlineData: { data: imageBase64, mimeType } },
    { text: "Identify this food product. Return JSON only." }
  ]);
  const text = result.response.text();
  const parsed = pickFirstObject<{ name: string; brand: string | null; category: string; barcodeVisible: string | null }>(text);
  if (parsed?.barcodeVisible && /^\d{8,14}$/.test(parsed.barcodeVisible)) {
    return parsed.barcodeVisible;
  }
  return parsed?.name ?? "Unknown food";
}
