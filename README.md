# Mira

> Daily research, weekly food scans, monthly dinners. For everyone living with a chronic condition.

[Mira](https://mira.vercel.app) — a quiet companion for the time between doctor visits.

- **Today** — A morning brief of recent clinical research for your condition, summarized in plain English with full citations. Sourced from PubMed.
- **Scan** — Type or photograph a barcode; get a fit verdict against the public dietary guideline for your condition. Sourced from Open Food Facts.
- **Together** — Once a month, in your city, with people who share your diagnosis. Single-condition tables. Co-hosted with charity partners.

This repo runs on a $0 stack and deploys to Vercel in one click.

---

## What's inside

| | |
|---|---|
| **Framework** | Next.js 14 (App Router, RSC) |
| **Styling** | Tailwind CSS with a custom design system (Inter + Source Serif 4) |
| **Database** | Postgres via Drizzle ORM (Neon free tier) |
| **AI summaries** | Google Gemini 1.5 Flash (free 1,500 req/day) |
| **Research source** | PubMed E-utilities (free, no key needed) |
| **Food data** | Open Food Facts API (free, no key) |
| **Hosting** | Vercel (free Hobby tier) |
| **Cost to launch** | **$0** |

---

## Local development

### Prerequisites

- **Node.js 20+** — install from [nodejs.org](https://nodejs.org/) (pick the LTS).
- **Git** — install from [git-scm.com](https://git-scm.com/).
- **A Google account** for the Gemini API key.
- **A free Neon account** for the Postgres database (optional — site renders without it; only the waitlist write is gated).

### Setup

```powershell
# 1. From the project folder
cd C:\Users\najaf\mira

# 2. Install dependencies
npm install

# 3. Copy env template
copy .env.example .env.local

# 4. Open .env.local in any editor and fill in:
#    - GOOGLE_AI_API_KEY  → from https://aistudio.google.com/apikey  (free)
#    - DATABASE_URL       → from https://console.neon.tech            (free)

# 5. (Once DATABASE_URL is set) push schema to Neon
npm run db:push

# 6. Run the dev server
npm run dev
```

Open <http://localhost:3000>.

### Things you can try without any environment variables

- The full landing page renders.
- Navigation, design system, and waitlist UI work end-to-end.
- The `/today` page tells you it needs `GOOGLE_AI_API_KEY` to summarize.
- The `/scan` page can lookup barcodes (Open Food Facts is keyless) and shows raw nutrition; verdicts need the Gemini key.
- The `/together` page renders all 5 seed events.

---

## Deploy to Vercel (free tier, ~10 minutes)

### One-time accounts to create (all free, no credit card)

1. **GitHub** — <https://github.com/signup>
2. **Vercel** — <https://vercel.com/signup> (sign in with GitHub)
3. **Neon** — <https://console.neon.tech> (sign in with GitHub)
4. **Google AI Studio** — <https://aistudio.google.com/apikey> (sign in with Google → "Create API key")

### Push to GitHub

```powershell
cd C:\Users\najaf\mira
git init
git add .
git commit -m "Initial commit: Mira V1"
# Create a new empty repo on github.com (e.g. "mira"), then:
git remote add origin https://github.com/<your-username>/mira.git
git branch -M main
git push -u origin main
```

### Deploy on Vercel

1. Go to <https://vercel.com/new>.
2. Pick the `mira` repo from GitHub. Click **Import**.
3. Framework preset will auto-detect as **Next.js**. Leave defaults.
4. Expand **Environment Variables** and add:
   - `DATABASE_URL` — paste from Neon (the "Connection string" with `?sslmode=require`)
   - `GOOGLE_AI_API_KEY` — paste from Google AI Studio
   - `NEXT_PUBLIC_SITE_URL` — `https://mira-<your-username>.vercel.app` (you'll know after first deploy; you can also leave default and update)
5. Click **Deploy**.

Wait ~2 minutes. Your site will be live at `https://<project-name>.vercel.app`.

### Push the database schema once

After the first deploy, run **once** locally with the Neon URL set in `.env.local`:

```powershell
npm run db:push
```

This creates the `waitlist`, `papers`, `scans`, `events`, `event_interest` tables.

### Custom domain (optional, $0 if you use a free subdomain)

- The default `mira-<name>.vercel.app` is free forever.
- If you want a real domain (e.g. `mira.health`), buy it from Porkbun or Namecheap (~$12–40/yr) and add it under Vercel → Settings → Domains.

---

## Project structure

```
mira/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, metadata, fonts
│   │   ├── globals.css             # Tailwind + design tokens
│   │   ├── page.tsx                # Landing
│   │   ├── about/page.tsx          # About + MBegum tier story
│   │   ├── today/page.tsx          # Daily research brief (RSC, 6h cache)
│   │   ├── today/loading.tsx       # Skeleton
│   │   ├── scan/page.tsx           # Food fit scanner (client)
│   │   ├── together/page.tsx       # Local events
│   │   ├── legal/                  # Privacy, terms, medical disclaimer
│   │   ├── not-found.tsx
│   │   └── api/
│   │       ├── waitlist/route.ts   # Waitlist signup
│   │       ├── papers/route.ts     # PubMed → Gemini summary
│   │       └── scan/route.ts       # OFF lookup → Gemini verdict
│   ├── components/
│   │   ├── nav.tsx
│   │   ├── footer.tsx
│   │   ├── waitlist-form.tsx
│   │   └── ui/button.tsx
│   ├── lib/
│   │   ├── env.ts                  # Zod-validated env
│   │   ├── db.ts                   # Drizzle/Postgres client
│   │   ├── conditions.ts           # T2D, HTN, Asthma definitions
│   │   ├── pubmed.ts               # PubMed E-utilities client
│   │   ├── gemini.ts               # Gemini summary + verdict + image recognition
│   │   ├── openfoodfacts.ts        # Barcode lookup
│   │   ├── events-data.ts          # Seed events for /together
│   │   └── utils.ts
│   └── db/
│       └── schema.ts               # Drizzle schema
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
├── postcss.config.mjs
├── drizzle.config.ts
├── .env.example
└── README.md
```

---

## Adding a new condition

1. Add a row to `src/lib/conditions.ts` with the name, MeSH terms, PubMed query, prevalence line, dietary guidelines, and scan rules.
2. Add the literal id to `conditionEnum` in `src/db/schema.ts` and run `npm run db:push`.
3. Update the `condition` Zod enums in `src/app/api/waitlist/route.ts` and `src/app/api/scan/route.ts`.
4. Optional: add seed events for the new condition to `src/lib/events-data.ts`.

---

## What's deliberately *not* in V1

These are reserved for V2+ to keep V1 focused and shippable in 13 weeks. They live in the Vault doc, not in code.

- Patient identity verification (Persona / clinician sign-off)
- E2EE community chat (Signal Protocol)
- Telehealth / drug interaction module / insurance affiliate / dating
- Native mobile (Wave 2 — Expo)
- Any storage of PHI (we are explicitly not collecting it)

---

## Compliance posture

Mira is positioned as a **general wellness / informational platform**, not a medical device.

- **Research feed**: summarizes published academic research, always with DOI. Never editorializes beyond the paper. Never gives individualized advice.
- **Food scanner**: surfaces public nutrition data (Open Food Facts) and contextualizes against public dietary guidelines (WHO, ICMR, NHS, ADA, AHA). Verdict words are normative-neutral ("fits", "moderate", "caution") never directive ("don't eat", "avoid").
- **Events**: social gatherings co-hosted with established condition charities. ToS clarifies attendee discretion; venues handle dietary disclosure.
- **No PHI stored**: waitlist captures email + country/city + condition tag (which is self-disclosed and not linked to medical records).
- **Disclaimers**: footer of every page; dedicated medical disclaimer page.
- **Data minimization**: schema collects only what's needed.

This posture is consistent with Yuka, MyFitnessPal, Examine.com, Substack, and similar consumer information products operating across US and India.

---

## License

All rights reserved (for now). Reach out if you'd like to contribute or fork — `hello@mira.health`.
