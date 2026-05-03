"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { CONDITION_LIST, CONDITIONS, type ConditionId } from "@/lib/conditions";
import { DEMO_BARCODES } from "@/lib/openfoodfacts";
import { Button } from "@/components/ui/button";

interface ScanResponse {
  source: "barcode" | "image";
  barcode?: string;
  notFound?: boolean;
  productName?: string;
  message?: string;
  product?: {
    name: string;
    brand: string | null;
    imageUrl: string | null;
    servingSize: string | null;
    novaGroup: number | null;
    nutrition: Record<string, number | null>;
  };
  verdict?: {
    level: "fits" | "moderate" | "caution";
    headline: string;
    reasons: string[];
    guidelines: string[];
  } | null;
  guidelines?: { source: string; key: string; range: string }[];
}

export default function ScanPage() {
  const [condition, setCondition] = useState<ConditionId>("t2d");
  const [barcode, setBarcode] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResponse | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!barcode && !imageDataUrl) {
      setError("Enter a barcode or upload a photo first.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          condition,
          barcode: barcode || undefined,
          imageDataUrl: imageDataUrl || undefined
        })
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Lookup failed. Try again.");
      } else {
        setResult(json);
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setError("Image too large (8 MB max).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(reader.result as string);
      setBarcode("");
    };
    reader.readAsDataURL(file);
  }

  function tryDemo(code: string) {
    setBarcode(code);
    setImageDataUrl(null);
    setError(null);
    setResult(null);
  }

  return (
    <div className="container-page py-12 md:py-20">
      <header className="max-w-readable">
        <p className="label">Scan</p>
        <h1 className="mt-3 font-serif text-headline text-ink leading-tight">
          Does this fit my plan?
        </h1>
        <p className="mt-5 text-lede text-ink-soft">
          Type or paste a barcode, or upload a photo of a packaged product. Mira pulls the nutrition from
          Open Food Facts and explains how it lines up with the public dietary guideline for your condition.
        </p>
      </header>

      <form onSubmit={submit} className="mt-10 max-w-readable space-y-6">
        <div>
          <label className="label block mb-2">My condition</label>
          <div className="flex flex-wrap gap-2">
            {CONDITION_LIST.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCondition(c.id)}
                className={`h-10 rounded-full border px-4 text-sm transition-colors ${
                  condition === c.id
                    ? "border-teal bg-teal text-paper"
                    : "border-paper-line bg-paper text-ink-soft hover:border-teal/40"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="barcode" className="label block mb-2">Barcode</label>
            <input
              id="barcode"
              type="text"
              inputMode="numeric"
              pattern="\d*"
              placeholder="e.g. 5449000000996"
              value={barcode}
              onChange={(e) => {
                setBarcode(e.target.value.replace(/\D/g, "").slice(0, 14));
                setImageDataUrl(null);
              }}
              className="w-full h-12 rounded-md border border-paper-line bg-paper px-3 font-mono text-ink placeholder:text-ink-subtle focus:border-teal focus:ring-1 focus:ring-teal outline-none"
            />
          </div>
          <div>
            <label htmlFor="image" className="label block mb-2">Or photo</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onFile}
              className="w-full h-12 rounded-md border border-paper-line bg-paper px-3 text-sm text-ink-soft file:mr-3 file:rounded file:border-0 file:bg-paper-soft file:px-3 file:py-1.5 file:text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none"
            />
          </div>
        </div>

        {imageDataUrl && (
          <div className="flex items-center gap-3 text-sm text-ink-muted">
            <Image
              src={imageDataUrl}
              alt="Uploaded"
              width={64}
              height={64}
              className="h-16 w-16 rounded object-cover border border-paper-line"
            />
            <span>Photo ready. Mira will try to read a barcode or product name.</span>
            <button
              type="button"
              onClick={() => setImageDataUrl(null)}
              className="text-teal-deep hover:text-teal"
            >
              Remove
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button type="submit" size="lg" disabled={loading} className="flex-1">
            {loading ? "Looking up…" : "Check the fit"}
          </Button>
        </div>

        {error && <p className="text-sm text-clay">{error}</p>}
      </form>

      <section className="mt-8 max-w-readable">
        <p className="label mb-3">Or try one of these demo barcodes</p>
        <div className="flex flex-wrap gap-2">
          {DEMO_BARCODES.map((d) => (
            <button
              key={d.code}
              type="button"
              onClick={() => tryDemo(d.code)}
              className="rounded-full border border-paper-line bg-paper px-3 py-1.5 text-xs text-ink-soft hover:border-teal/40 hover:text-ink"
            >
              {d.label} <span className="text-ink-muted">· {d.hint}</span>
            </button>
          ))}
        </div>
      </section>

      {result && (
        <section className="mt-12 max-w-readable">
          <ScanResult result={result} condition={condition} />
        </section>
      )}

      <footer className="mt-14 max-w-readable text-xs text-ink-muted leading-relaxed">
        Mira's scanner is informational. It surfaces nutrition data from Open Food Facts and contextualizes it with
        public dietary guidelines (WHO, ICMR, NHS, ADA, AHA). It does not provide medical advice. Always discuss
        dietary changes with your clinician or registered dietitian.
      </footer>
    </div>
  );
}

function ScanResult({ result, condition }: { result: ScanResponse; condition: ConditionId }) {
  const cond = CONDITIONS[condition];

  if (result.notFound) {
    return (
      <article className="surface p-7">
        <p className="label">Not found</p>
        <h2 className="mt-3 font-serif text-2xl text-ink">{result.barcode}</h2>
        <p className="mt-3 text-ink-soft">{result.message}</p>
      </article>
    );
  }

  if (result.source === "image" && !result.product) {
    return (
      <article className="surface p-7">
        <p className="label">From the photo</p>
        <h2 className="mt-3 font-serif text-2xl text-ink">{result.productName}</h2>
        <p className="mt-3 text-ink-soft">{result.message}</p>
        <ConditionGuidelinesBlock condition={condition} />
      </article>
    );
  }

  if (!result.product) return null;

  const verdict = result.verdict;
  const levelStyles = {
    fits: { dot: "bg-sage", chip: "border-sage/40 bg-sage-wash text-sage", label: "Fits your plan" },
    moderate: { dot: "bg-amber-deep", chip: "border-amber/40 bg-amber-wash text-amber-deep", label: "Moderate" },
    caution: { dot: "bg-clay", chip: "border-clay/40 bg-clay-wash text-clay", label: "Caution" }
  } as const;
  const lv = verdict ? levelStyles[verdict.level] : levelStyles.moderate;

  return (
    <article className="surface p-7 md:p-8 shadow-card">
      <div className="flex items-start gap-5">
        {result.product.imageUrl ? (
          <Image
            src={result.product.imageUrl}
            alt={result.product.name}
            width={96}
            height={96}
            className="h-24 w-24 rounded-md object-cover border border-paper-line"
          />
        ) : (
          <div className="h-24 w-24 rounded-md bg-paper-soft border border-paper-line" />
        )}
        <div className="flex-1 min-w-0">
          <p className="label">{result.product.brand || "Open Food Facts"}</p>
          <h2 className="mt-2 font-serif text-2xl text-ink leading-snug">{result.product.name}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
            <span className="pill border-teal/30 bg-teal-wash text-teal-deep">{cond.name}</span>
            {verdict && (
              <span className={`pill ${lv.chip}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${lv.dot}`} aria-hidden />
                {lv.label}
              </span>
            )}
            {result.product.novaGroup && (
              <span className="pill border-paper-line">NOVA {result.product.novaGroup}</span>
            )}
          </div>
        </div>
      </div>

      {verdict && (
        <p className="mt-6 font-serif text-xl text-ink leading-snug">{verdict.headline}</p>
      )}

      {verdict && verdict.reasons.length > 0 && (
        <ul className="mt-5 space-y-2 text-sm text-ink-soft">
          {verdict.reasons.map((r, i) => (
            <li key={i} className="flex gap-3">
              <span className={`mt-2 h-1.5 w-1.5 rounded-full flex-shrink-0 ${lv.dot}`} aria-hidden />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      )}

      <NutritionTable nutrition={result.product.nutrition} />

      {verdict?.guidelines && verdict.guidelines.length > 0 && (
        <div className="mt-6 pt-5 border-t border-paper-line">
          <p className="label mb-2">Guidelines this is compared against</p>
          <ul className="space-y-1 text-xs text-ink-muted">
            {verdict.guidelines.map((g, i) => (
              <li key={i}>· {g}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-6 text-xs text-ink-muted leading-relaxed">
        Informational only. Talk to your clinician or registered dietitian before changing your diet.
      </p>
    </article>
  );
}

function NutritionTable({ nutrition }: { nutrition: Record<string, number | null> }) {
  const labels: Record<string, string> = {
    energyKcal: "Energy (kcal)",
    sugars: "Sugars (g)",
    addedSugars: "Added sugars (g)",
    carbohydrates: "Carbohydrates (g)",
    fiber: "Fiber (g)",
    proteins: "Protein (g)",
    sodium: "Sodium (mg)",
    salt: "Salt (g)",
    saturatedFat: "Saturated fat (g)",
    fat: "Total fat (g)"
  };
  const rows = Object.entries(labels)
    .map(([k, label]) => ({ label, value: nutrition[k] }))
    .filter((r) => r.value !== null && r.value !== undefined);

  if (rows.length === 0) return null;

  return (
    <div className="mt-6 pt-5 border-t border-paper-line">
      <p className="label mb-3">Per 100 g</p>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between border-b border-dashed border-paper-line py-1">
            <dt className="text-ink-muted">{r.label}</dt>
            <dd className="text-ink font-medium tabular-nums">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ConditionGuidelinesBlock({ condition }: { condition: ConditionId }) {
  const cond = CONDITIONS[condition];
  return (
    <div className="mt-5 pt-5 border-t border-paper-line">
      <p className="label mb-2">Guidelines for {cond.name}</p>
      <ul className="space-y-1 text-xs text-ink-muted">
        {cond.dietaryGuidelines.map((g) => (
          <li key={g.key}>
            · {g.source} — {g.key}: {g.range}
          </li>
        ))}
      </ul>
    </div>
  );
}
