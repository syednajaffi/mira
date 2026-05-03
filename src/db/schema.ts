import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  jsonb,
  index,
  uniqueIndex,
  pgEnum,
  integer,
  boolean
} from "drizzle-orm/pg-core";

export const conditionEnum = pgEnum("condition", ["t2d", "htn", "asthma"]);

export const waitlist = pgTable(
  "waitlist",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 320 }).notNull(),
    country: varchar("country", { length: 2 }),
    city: varchar("city", { length: 64 }),
    condition: conditionEnum("condition"),
    role: varchar("role", { length: 16 }),
    referrer: varchar("referrer", { length: 256 }),
    ip: varchar("ip", { length: 64 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => ({
    emailIdx: uniqueIndex("waitlist_email_idx").on(t.email),
    cityIdx: index("waitlist_city_idx").on(t.city),
    conditionIdx: index("waitlist_condition_idx").on(t.condition)
  })
);

export const papers = pgTable(
  "papers",
  {
    id: serial("id").primaryKey(),
    pmid: varchar("pmid", { length: 32 }).notNull(),
    doi: varchar("doi", { length: 256 }),
    title: text("title").notNull(),
    authors: text("authors"),
    journal: varchar("journal", { length: 256 }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    abstract: text("abstract"),
    condition: conditionEnum("condition").notNull(),
    summary: jsonb("summary").$type<{
      finding: string;
      meaning: string;
      evidence: string;
      strength: "preprint" | "small-study" | "peer-reviewed" | "guideline";
      sampleSize: number | null;
    }>(),
    summaryGeneratedAt: timestamp("summary_generated_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => ({
    pmidConditionIdx: uniqueIndex("papers_pmid_condition_idx").on(t.pmid, t.condition),
    conditionPublishedIdx: index("papers_condition_published_idx").on(t.condition, t.publishedAt)
  })
);

export const scans = pgTable(
  "scans",
  {
    id: serial("id").primaryKey(),
    sessionId: varchar("session_id", { length: 64 }).notNull(),
    barcode: varchar("barcode", { length: 32 }),
    productName: varchar("product_name", { length: 256 }),
    condition: conditionEnum("condition").notNull(),
    nutrition: jsonb("nutrition").$type<Record<string, number | string | null>>(),
    fitVerdict: jsonb("fit_verdict").$type<{
      level: "fits" | "moderate" | "caution";
      headline: string;
      reasons: string[];
      guidelines: string[];
    }>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => ({
    sessionIdx: index("scans_session_idx").on(t.sessionId),
    barcodeConditionIdx: index("scans_barcode_condition_idx").on(t.barcode, t.condition)
  })
);

export const events = pgTable(
  "events",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 96 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    condition: conditionEnum("condition").notNull(),
    city: varchar("city", { length: 64 }).notNull(),
    venue: varchar("venue", { length: 200 }).notNull(),
    venueNote: text("venue_note"),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    capacity: integer("capacity").notNull().default(6),
    reservations: integer("reservations").notNull().default(0),
    coHostOrg: varchar("co_host_org", { length: 200 }),
    description: text("description"),
    isOpen: boolean("is_open").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => ({
    slugIdx: uniqueIndex("events_slug_idx").on(t.slug),
    cityConditionIdx: index("events_city_condition_idx").on(t.city, t.condition)
  })
);

export const eventInterest = pgTable(
  "event_interest",
  {
    id: serial("id").primaryKey(),
    eventId: integer("event_id").notNull().references(() => events.id),
    email: varchar("email", { length: 320 }).notNull(),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => ({
    eventEmailIdx: uniqueIndex("event_interest_event_email_idx").on(t.eventId, t.email)
  })
);

export const rateLimits = pgTable(
  "rate_limits",
  {
    key: varchar("key", { length: 200 }).primaryKey(),
    count: integer("count").notNull().default(1),
    windowStart: timestamp("window_start", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  }
);

export type Waitlist = typeof waitlist.$inferSelect;
export type NewWaitlist = typeof waitlist.$inferInsert;
export type Paper = typeof papers.$inferSelect;
export type NewPaper = typeof papers.$inferInsert;
export type Scan = typeof scans.$inferSelect;
export type NewScan = typeof scans.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
