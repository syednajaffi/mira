import type { Config } from "drizzle-kit";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// Drizzle-kit CLI does not auto-load .env.local (Next.js does, at runtime).
// Read it manually so `npm run db:push` works without ceremony.
const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)="?([^"]*)"?$/);
    if (match) {
      const key = match[1]!;
      const value = match[2] ?? "";
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? ""
  },
  strict: true,
  verbose: true
} satisfies Config;
