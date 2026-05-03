import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getDb, schema } from "@/lib/db";
import { hasDatabase, hasTurnstile } from "@/lib/env";
import { clientIp, isDisposableEmail, rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIMIT = 5;
const WINDOW_SECONDS = 3600; // 5 signups per hour per IP

const Body = z.object({
  email: z.string().email().max(320),
  country: z.string().max(8).optional().nullable(),
  city: z.string().max(64).optional().nullable(),
  condition: z.enum(["t2d", "htn", "asthma", ""]).optional().nullable(),
  role: z.enum(["patient", "caregiver", "clinician", "other"]).optional().nullable(),
  referrer: z.string().max(256).optional().nullable(),
  turnstileToken: z.string().max(2048).optional().nullable()
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
  const { email, country, city, condition, role, referrer, turnstileToken } = parsed.data;

  if (hasTurnstile) {
    const ts = await verifyTurnstile(turnstileToken ?? undefined, clientIp(req));
    if (!ts.ok) {
      return NextResponse.json(
        { error: "Bot check failed. Refresh and try again." },
        { status: 400 }
      );
    }
  }

  if (isDisposableEmail(email)) {
    return NextResponse.json(
      { error: "Please use a real email — disposable addresses are not accepted." },
      { status: 400 }
    );
  }

  const ip = clientIp(req);
  const limit = await rateLimit("waitlist", ip, LIMIT, WINDOW_SECONDS);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many signups from this network. Try again later." },
      { status: 429, headers: rateLimitHeaders(limit, LIMIT) }
    );
  }

  if (!hasDatabase) {
    // Graceful: log and accept so the landing page works even before DB is wired.
    console.log("[waitlist] (no DB configured) signup:", { email, country, city, condition, role });
    return NextResponse.json({ ok: true, note: "logged" });
  }

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

  return NextResponse.json(
    { ok: true },
    { headers: rateLimitHeaders(limit, LIMIT) }
  );
}
