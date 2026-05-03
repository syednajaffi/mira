import type { ConditionId } from "./conditions";

export interface SeedEvent {
  slug: string;
  title: string;
  condition: ConditionId;
  city: string;
  country: "IN" | "US";
  venue: string;
  venueNote: string;
  startsAt: string; // ISO
  capacity: number;
  reservations: number;
  coHostOrg: string | null;
  description: string;
}

// Seed events for the demo. In production these are curated weekly by the team
// and stored in Postgres; here we ship a compelling default set so /together
// is alive on first deploy.
export const SEED_EVENTS: SeedEvent[] = [
  {
    slug: "mumbai-t2d-dinner-bandra",
    title: "Type 2 Diabetes Dinner — Bandra",
    condition: "t2d",
    city: "Mumbai",
    country: "IN",
    venue: "Salt Water Cafe, Bandra West",
    venueNote: "Menu pre-marked with low-glycemic options. Brown rice and millet substitutes available.",
    startsAt: nextSaturday(19.5).toISOString(),
    capacity: 6,
    reservations: 4,
    coHostOrg: "Diabetes India (Mumbai chapter)",
    description:
      "Six people, one dinner, one shared chapter of life. Hosted with Diabetes India. Mix of newly diagnosed and long-time patients. ₹100 commitment hold, refunded when you arrive."
  },
  {
    slug: "bangalore-htn-walk-cubbon",
    title: "Hypertension Morning Walk — Cubbon Park",
    condition: "htn",
    city: "Bangalore",
    country: "IN",
    venue: "Cubbon Park, Queen's Statue Gate",
    venueNote: "Easy 3 km loop, benches every 500 m. Coffee after at Matteo Coffea.",
    startsAt: nextSunday(7).toISOString(),
    capacity: 12,
    reservations: 7,
    coHostOrg: "Indian Heart Association",
    description:
      "A gentle 3 km walk and conversation. No pressure to keep pace. We finish at a coffee place across the road for whoever wants to stay."
  },
  {
    slug: "delhi-asthma-meetup-lodi",
    title: "Asthma Meetup — Lodi Garden",
    condition: "asthma",
    city: "Delhi",
    country: "IN",
    venue: "Lodi Garden, Gate 1",
    venueNote: "We monitor AQI 24h before. Cancel and refund if AQI > 200.",
    startsAt: nextSaturday(8).toISOString(),
    capacity: 10,
    reservations: 5,
    coHostOrg: "Lung Care Foundation",
    description:
      "A morning of fresh air, slow conversation, and shared experience. Indoor backup at India Habitat Centre if AQI is poor."
  },
  {
    slug: "nyc-t2d-dinner-east-village",
    title: "Type 2 Diabetes Dinner — East Village",
    condition: "t2d",
    city: "New York",
    country: "US",
    venue: "Hearth, East 12th Street",
    venueNote: "Chef-curated low-glycemic tasting menu, allergen-aware.",
    startsAt: nextFriday(19).toISOString(),
    capacity: 6,
    reservations: 3,
    coHostOrg: "Beyond Type 2",
    description:
      "Six diners, one table. We share what worked, what didn't, and what we wish we'd known. $20 commitment hold, refunded at the table."
  },
  {
    slug: "sf-htn-walk-presidio",
    title: "Hypertension Sunday Walk — The Presidio",
    condition: "htn",
    city: "San Francisco",
    country: "US",
    venue: "Lover's Lane Trailhead, Presidio",
    venueNote: "Flat, paved, ~4 km. Bring a water bottle.",
    startsAt: nextSunday(9).toISOString(),
    capacity: 15,
    reservations: 9,
    coHostOrg: "American Heart Association (SF chapter)",
    description:
      "Sunday morning walk through the Presidio. Clinically guided pacing tips. Coffee at Warming Hut after."
  }
];

function nextDayAtHour(targetDow: number, hour: number) {
  const now = new Date();
  const d = new Date(now);
  d.setHours(Math.floor(hour), Math.round((hour % 1) * 60), 0, 0);
  const delta = (targetDow - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + delta);
  return d;
}
function nextSaturday(hour: number) { return nextDayAtHour(6, hour); }
function nextSunday(hour: number) { return nextDayAtHour(0, hour); }
function nextFriday(hour: number) { return nextDayAtHour(5, hour); }

export const CITIES = [
  { name: "Mumbai", country: "IN" as const },
  { name: "Bangalore", country: "IN" as const },
  { name: "Delhi", country: "IN" as const },
  { name: "New York", country: "US" as const },
  { name: "San Francisco", country: "US" as const }
];
