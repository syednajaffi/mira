import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { lookupBarcode, nutritionForPrompt } from "@/lib/openfoodfacts";
import { generateFitVerdict, recognizeFoodFromImage } from "@/lib/gemini";
import { isConditionId, CONDITIONS } from "@/lib/conditions";
import { hasGemini } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  condition: z.enum(["t2d", "htn", "asthma"]),
  barcode: z.string().regex(/^\d{8,14}$/).optional(),
  imageDataUrl: z.string().startsWith("data:").optional()
});

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Body.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  const { condition, imageDataUrl } = parsed.data;
  let { barcode } = parsed.data;
  if (!isConditionId(condition)) {
    return NextResponse.json({ error: "Invalid condition" }, { status: 400 });
  }

  // If image supplied and no barcode, try to extract barcode/name from image.
  if (!barcode && imageDataUrl) {
    if (!hasGemini) {
      return NextResponse.json(
        { error: "Image scanning needs GOOGLE_AI_API_KEY configured" },
        { status: 501 }
      );
    }
    try {
      const m = imageDataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!m) {
        return NextResponse.json({ error: "Image must be a base64 data URL" }, { status: 400 });
      }
      const mimeType = m[1] ?? "image/jpeg";
      const base64 = m[2] ?? "";
      const recognized = await recognizeFoodFromImage(base64, mimeType);
      if (/^\d{8,14}$/.test(recognized)) {
        barcode = recognized;
      } else {
        // Cannot resolve to a barcode → return name-only soft response.
        return NextResponse.json({
          source: "image",
          productName: recognized,
          condition,
          guidelines: CONDITIONS[condition].dietaryGuidelines,
          message:
            "We could read the food name from the photo but could not match a barcode. For a full nutrient assessment, scan the barcode."
        });
      }
    } catch (err) {
      console.error("[scan] image recognition error", err);
      return NextResponse.json({ error: "Could not read the image" }, { status: 502 });
    }
  }

  if (!barcode) {
    return NextResponse.json({ error: "Provide a barcode or an image" }, { status: 400 });
  }

  try {
    const product = await lookupBarcode(barcode);
    if (!product) {
      return NextResponse.json(
        {
          source: "barcode",
          barcode,
          notFound: true,
          message:
            "Not in Open Food Facts yet. Many regional products aren't listed. You can add it for free at world.openfoodfacts.org."
        },
        { status: 200 }
      );
    }

    const nutrition = nutritionForPrompt(product);

    let verdict = null;
    if (hasGemini) {
      try {
        verdict = await generateFitVerdict({
          productName: `${product.brand ? product.brand + " — " : ""}${product.productName}`,
          nutrition,
          condition
        });
      } catch (err) {
        console.error("[scan] verdict error", err);
      }
    }

    return NextResponse.json({
      source: "barcode",
      barcode,
      product: {
        name: product.productName,
        brand: product.brand,
        imageUrl: product.imageUrl,
        servingSize: product.servingSize,
        novaGroup: product.novaGroup,
        nutrition: product.nutrition
      },
      verdict,
      condition,
      guidelines: CONDITIONS[condition].dietaryGuidelines
    });
  } catch (err) {
    console.error("[scan] lookup error", err);
    return NextResponse.json({ error: "Lookup failed" }, { status: 502 });
  }
}
