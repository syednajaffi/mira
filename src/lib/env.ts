import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url().optional(),
  GOOGLE_AI_API_KEY: z.string().min(10).optional(),
  NCBI_API_KEY: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  ADMIN_TOKEN: z.string().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional()
});

const parsed = schema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,
  NCBI_API_KEY: process.env.NCBI_API_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  ADMIN_TOKEN: process.env.ADMIN_TOKEN,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY
});

if (!parsed.success) {
  // Log but don't crash — Vercel preview builds without all env vars should still render landing.
  console.warn("[mira] Environment variables incomplete:", parsed.error.flatten().fieldErrors);
}

export const env = parsed.success
  ? parsed.data
  : {
      DATABASE_URL: process.env.DATABASE_URL,
      GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,
      NCBI_API_KEY: process.env.NCBI_API_KEY,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      ADMIN_TOKEN: process.env.ADMIN_TOKEN,
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY
    };

export const hasDatabase = Boolean(env.DATABASE_URL);
export const hasGemini = Boolean(env.GOOGLE_AI_API_KEY);
export const hasTurnstile = Boolean(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY);
