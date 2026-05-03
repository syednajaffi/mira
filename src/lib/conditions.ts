export type ConditionId = "t2d" | "htn" | "asthma";

export interface Condition {
  id: ConditionId;
  name: string;
  shortName: string;
  meshTerms: string[];
  pubmedQuery: string;
  prevalenceLine: string;
  dietaryGuidelines: { source: string; key: string; range: string }[];
  scanRules: ScanRule[];
}

export interface ScanRule {
  nutrient: "sodium" | "sugars" | "saturatedFat" | "carbohydrates" | "fiber" | "potassium";
  cautionPer100g?: number;
  cautionPerServing?: number;
  rationale: string;
  source: string;
}

export const CONDITIONS: Record<ConditionId, Condition> = {
  t2d: {
    id: "t2d",
    name: "Type 2 Diabetes",
    shortName: "T2D",
    meshTerms: ["Diabetes Mellitus, Type 2", "Hyperglycemia", "Insulin Resistance"],
    pubmedQuery: '("Diabetes Mellitus, Type 2"[MeSH] OR "type 2 diabetes"[Title/Abstract])',
    prevalenceLine: "537 million adults globally · ~80M in India · ~37M in the US",
    dietaryGuidelines: [
      { source: "ADA 2024", key: "Added sugars", range: "<10% daily energy" },
      { source: "ICMR", key: "Carbohydrates", range: "50–55% of energy, low glycemic preferred" },
      { source: "WHO", key: "Free sugars", range: "<25g/day" }
    ],
    scanRules: [
      {
        nutrient: "sugars",
        cautionPer100g: 12.5,
        rationale: "High in free sugars. May spike post-meal glucose.",
        source: "WHO 2015 — free sugars guideline"
      },
      {
        nutrient: "carbohydrates",
        cautionPer100g: 45,
        rationale: "High carbohydrate density. Consider portion size.",
        source: "ICMR Dietary Guidelines for Indians 2024"
      },
      {
        nutrient: "saturatedFat",
        cautionPer100g: 5,
        rationale: "Saturated fat above guideline. Insulin sensitivity consideration.",
        source: "ADA Standards of Care 2024"
      }
    ]
  },
  htn: {
    id: "htn",
    name: "Hypertension",
    shortName: "HTN",
    meshTerms: ["Hypertension", "Blood Pressure"],
    pubmedQuery: '("Hypertension"[MeSH] OR "high blood pressure"[Title/Abstract])',
    prevalenceLine: "1.28 billion adults globally · ~220M in India · ~120M in the US",
    dietaryGuidelines: [
      { source: "WHO", key: "Sodium", range: "<2,000 mg/day" },
      { source: "DASH (NHLBI)", key: "Sodium (intensive)", range: "<1,500 mg/day" },
      { source: "ICMR", key: "Salt", range: "<5g/day" }
    ],
    scanRules: [
      {
        nutrient: "sodium",
        cautionPer100g: 600,
        rationale: "High sodium per 100g. A small serving can use a large share of the daily limit.",
        source: "WHO 2012 — sodium guideline"
      },
      {
        nutrient: "saturatedFat",
        cautionPer100g: 5,
        rationale: "Saturated fat is associated with cardiovascular risk.",
        source: "AHA 2021"
      }
    ]
  },
  asthma: {
    id: "asthma",
    name: "Asthma",
    shortName: "Asthma",
    meshTerms: ["Asthma", "Bronchial Hyperreactivity"],
    pubmedQuery: '("Asthma"[MeSH] OR "asthma"[Title/Abstract])',
    prevalenceLine: "262 million globally · ~35M in India · ~25M in the US",
    dietaryGuidelines: [
      { source: "GINA 2024", key: "Sulfites", range: "Identify trigger foods individually" },
      { source: "BSACI", key: "Common allergens", range: "Discuss any flagged allergens with clinician" }
    ],
    scanRules: [
      {
        nutrient: "sodium",
        cautionPer100g: 800,
        rationale: "Very high sodium. Some studies suggest correlation with airway reactivity.",
        source: "Cochrane Review — dietary sodium and asthma"
      }
    ]
  }
};

export const CONDITION_LIST = Object.values(CONDITIONS);

export const isConditionId = (x: string): x is ConditionId =>
  x === "t2d" || x === "htn" || x === "asthma";
