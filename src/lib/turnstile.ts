import { env, hasTurnstile } from "./env";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface TurnstileVerifyResult {
  ok: boolean;
  reason?: string;
}

/**
 * Verify a Cloudflare Turnstile token server-side.
 * Returns ok=true if Turnstile is not configured (fail-open), so the rest of
 * the app keeps working in dev / preview deploys without keys.
 */
export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<TurnstileVerifyResult> {
  if (!hasTurnstile) return { ok: true, reason: "turnstile-disabled" };
  if (!token) return { ok: false, reason: "missing-token" };
  if (!env.TURNSTILE_SECRET_KEY) return { ok: true, reason: "no-secret" };

  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      cache: "no-store"
    });
    const json = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (json.success) return { ok: true };
    return { ok: false, reason: (json["error-codes"] ?? ["verify-failed"]).join(",") };
  } catch (err) {
    console.error("[turnstile] verify error", err);
    // Fail open on Cloudflare outage so we don't lock out real users.
    return { ok: true, reason: "verify-error" };
  }
}
