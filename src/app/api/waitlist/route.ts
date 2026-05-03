import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getDb, schema } from "@/lib/db";
import { hasDatabase } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  email: z.string().email().max(320),
  country: z.string().max(8).optional().nullable(),
  city: z.string().max(64).optional().nullable(),
  condition: z.enum(["t2d", "htn", "asthma", ""]).optional().nullable(),
  role: z.enum(["patient", "caregiver", "clinician", "other"]).optional().nullable(),
  referrer: z.string().max(256).optional().nullable()
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
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { email, country, city, condition, role, referrer } = parsed.data;

  if (!hasDatabase) {
    // Graceful: log and accept so the landing page works even before DB is wired.
    console.log("[waitlist] (no DB configured) signup:", { email, country, city, condition, role });
    return NextResponse.json({ ok: true, note: "logged" });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const ua = req.headers.get("user-agent") ?? null;

  try {
    const db = getDb();
    await db
      .insert(schema.waitlist)
      .values({
        email: email.toLowerCase().trim(),
        country: country?.toUpperCase().slice(0, 2) || null,
        city: city?.trim() || null,
        condition: (condition === "" ? null : condition) ?? null,
        role: role ?? null,
        referrer: referrer ?? null,
        ip,
        userAgent: ua
      })
      .onConflictDoNothing({ target: schema.waitlist.email });
  } catch (err) {
    console.error("[waitlist] insert error", err);
    return NextResponse.json({ error: "Could not record signup" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
