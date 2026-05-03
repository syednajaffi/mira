import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env, hasDatabase } from "./env";
import * as schema from "@/db/schema";

let _client: ReturnType<typeof postgres> | null = null;
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!hasDatabase || !env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured. Add it to .env.local (Neon free tier).");
  }
  if (!_client) {
    _client = postgres(env.DATABASE_URL, {
      ssl: "require",
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10
    });
    _db = drizzle(_client, { schema });
  }
  return _db!;
}

export { schema };
