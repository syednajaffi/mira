// Open Food Facts API — free, open, no key. https://world.openfoodfacts.org/data
// 3M+ products globally; growing India coverage.

export interface OFFProduct {
  barcode: string;
  productName: string;
  brand: string | null;
  imageUrl: string | null;
  countries: string[];
  nutrition: {
    energyKcal: number | null;
    sugars: number | null;
    addedSugars: number | null;
    carbohydrates: number | null;
    fiber: number | null;
    proteins: number | null;
    salt: number | null;
    sodium: number | null;
    saturatedFat: number | null;
    fat: number | null;
  };
  servingSize: string | null;
  ingredients: string | null;
  novaGroup: number | null;
  raw: Record<string, unknown>;
}

interface OFFResponse {
  status: number;
  status_verbose?: string;
  product?: {
    code: string;
    product_name?: string;
    product_name_en?: string;
    brands?: string;
    image_front_url?: string;
    image_url?: string;
    countries_tags?: string[];
    serving_size?: string;
    ingredients_text?: string;
    nova_group?: number;
    nutriments?: Record<string, number | string | undefined>;
  };
}

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
}

export async function lookupBarcode(barcode: string): Promise<OFFProduct | null> {
  const cleaned = barcode.replace(/\D/g, "");
  if (cleaned.length < 8) return null;

  const url = `https://world.openfoodfacts.org/api/v2/product/${cleaned}.json?fields=code,product_name,product_name_en,brands,image_front_url,image_url,countries_tags,serving_size,ingredients_text,nova_group,nutriments`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mira/0.1 (https://mira.health) — patient nutrition education"
    },
    next: { revalidate: 86400 }
  });

  if (!res.ok) return null;
  const json = (await res.json()) as OFFResponse;
  if (json.status !== 1 || !json.product) return null;

  const p = json.product;
  const n = p.nutriments ?? {};

  const sodium100 = num(n["sodium_100g"]);
  const salt100 = num(n["salt_100g"]);
  const computedSodium = sodium100 ?? (salt100 !== null ? salt100 * 400 : null);

  return {
    barcode: p.code ?? cleaned,
    productName: p.product_name_en || p.product_name || "Unknown product",
    brand: p.brands?.split(",")[0]?.trim() || null,
    imageUrl: p.image_front_url || p.image_url || null,
    countries: p.countries_tags ?? [],
    nutrition: {
      energyKcal: num(n["energy-kcal_100g"]),
      sugars: num(n["sugars_100g"]),
      addedSugars: num(n["added-sugars_100g"]),
      carbohydrates: num(n["carbohydrates_100g"]),
      fiber: num(n["fiber_100g"]),
      proteins: num(n["proteins_100g"]),
      salt: salt100,
      sodium: computedSodium === null ? null : Math.round(computedSodium),
      saturatedFat: num(n["saturated-fat_100g"]),
      fat: num(n["fat_100g"])
    },
    servingSize: p.serving_size ?? null,
    ingredients: p.ingredients_text ?? null,
    novaGroup: num(p.nova_group),
    raw: n as Record<string, unknown>
  };
}

export function nutritionForPrompt(p: OFFProduct): Record<string, number | string | null> {
  return {
    "Energy (kcal/100g)": p.nutrition.energyKcal,
    "Sugars (g/100g)": p.nutrition.sugars,
    "Added sugars (g/100g)": p.nutrition.addedSugars,
    "Carbohydrates (g/100g)": p.nutrition.carbohydrates,
    "Fiber (g/100g)": p.nutrition.fiber,
    "Proteins (g/100g)": p.nutrition.proteins,
    "Sodium (mg/100g)": p.nutrition.sodium,
    "Salt (g/100g)": p.nutrition.salt,
    "Saturated fat (g/100g)": p.nutrition.saturatedFat,
    "Total fat (g/100g)": p.nutrition.fat,
    "NOVA processing group (1=unprocessed, 4=ultra-processed)": p.novaGroup,
    "Serving size": p.servingSize
  };
}

// Demo barcodes that work well across regions (verified to exist in OFF):
export const DEMO_BARCODES: { code: string; label: string; hint: string }[] = [
  { code: "8901491100397", label: "Maggi 2-Min Masala Noodles (India)", hint: "High sodium" },
  { code: "5449000000996", label: "Coca-Cola 330ml (Global)", hint: "High sugars" },
  { code: "8901058851273", label: "Aashirvaad Whole Wheat Atta (India)", hint: "Whole grain" },
  { code: "028400433303", label: "Lay's Classic Potato Chips (US)", hint: "High sodium + saturated fat" },
  { code: "737628064502", label: "Thai Kitchen Rice Noodles (US)", hint: "Low sodium" }
];
