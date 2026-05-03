import type { NextRequest } from "next/server";
import { sql } from "drizzle-orm";
import { getDb } from "./db";
import { hasDatabase } from "./env";

/**
 * Postgres-backed fixed-window rate limiter. Single round-trip per check using
 * an upsert that increments and returns the new count. Resets the window when
 * the previous one expired.
 *
 * Without a database (e.g. preview deploys without DATABASE_URL set) it falls
 * open — the API still works, just unprotected. That's the right default for
 * V1 because the alternative is hard-failing every request.
 */
export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: Date;
}

export async function rateLimit(
  bucket: string,
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const resetAt = new Date(Date.now() + windowSeconds * 1000);
  if (!hasDatabase) {
    return { ok: true, remaining: limit, resetAt };
  }

  const key = `${bucket}:${identifier}`.slice(0, 200);

  try {
    const db = getDb();
    // Atomic upsert: insert with count=1 and now(); on conflict, if window
    // expired reset to 1, otherwise increment. Returns the resulting count.
    const rows = await db.execute<{ count: number; window_start: Date }>(sql`
      INSERT INTO rate_limits (key, count, window_start, updated_at)
      VALUES (${key}, 1, NOW(), NOW())
      ON CONFLICT (key) DO UPDATE SET
        count = CASE
          WHEN rate_limits.window_start < NOW() - (${windowSeconds} || ' seconds')::interval THEN 1
          ELSE rate_limits.count + 1
        END,
        window_start = CASE
          WHEN rate_limits.window_start < NOW() - (${windowSeconds} || ' seconds')::interval THEN NOW()
          ELSE rate_limits.window_start
        END,
        updated_at = NOW()
      RETURNING count, window_start
    `);
    const row = rows[0] as { count: number; window_start: Date } | undefined;
    if (!row) {
      return { ok: true, remaining: limit, resetAt };
    }
    const count = Number(row.count);
    const windowStart = new Date(row.window_start);
    return {
      ok: count <= limit,
      remaining: Math.max(0, limit - count),
      resetAt: new Date(windowStart.getTime() + windowSeconds * 1000)
    };
  } catch (err) {
    console.error("[rate-limit] error, failing open:", err);
    return { ok: true, remaining: limit, resetAt };
  }
}

export function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip") ?? req.ip ?? "unknown";
}

export function rateLimitHeaders(result: RateLimitResult, limit: number): HeadersInit {
  return {
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.floor(result.resetAt.getTime() / 1000)),
    "Retry-After": String(Math.max(1, Math.ceil((result.resetAt.getTime() - Date.now()) / 1000)))
  };
}

// Disposable email blocklist — small but high-signal set.
// Full list at https://github.com/disposable-email-domains; we keep a hand-picked
// subset of the highest-volume offenders to avoid bundle weight.
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "10minutemail.com",
  "10minutemail.net",
  "tempmail.com",
  "temp-mail.org",
  "throwaway.email",
  "yopmail.com",
  "trashmail.com",
  "maildrop.cc",
  "getnada.com",
  "mintemail.com",
  "sharklasers.com",
  "spam4.me",
  "fakeinbox.com",
  "tempinbox.com",
  "mohmal.com",
  "dispostable.com",
  "test.local"
]);

export function isDisposableEmail(email: string): boolean {
  const at = email.lastIndexOf("@");
  if (at < 0) return false;
  const domain = email.slice(at + 1).toLowerCase().trim();
  return DISPOSABLE_DOMAINS.has(domain);
}
