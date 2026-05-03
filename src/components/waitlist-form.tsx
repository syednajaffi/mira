"use client";

import { useState, type FormEvent } from "react";
import { Button } from "./ui/button";
import { CONDITION_LIST } from "@/lib/conditions";

const COUNTRIES = [
  { code: "IN", label: "India" },
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "AE", label: "UAE" },
  { code: "SG", label: "Singapore" },
  { code: "OTHER", label: "Somewhere else" }
];

const ROLES = [
  { value: "patient", label: "I live with a condition" },
  { value: "caregiver", label: "I care for someone" },
  { value: "clinician", label: "I'm a clinician" },
  { value: "other", label: "Something else" }
];

export function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("IN");
  const [city, setCity] = useState("");
  const [condition, setCondition] = useState<string>("");
  const [role, setRole] = useState("patient");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, country, city, condition, role })
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(json.error ?? "Something went wrong. Try again?");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Try again?");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-sage bg-sage-wash p-6">
        <p className="font-serif text-lg text-ink">You're on the list.</p>
        <p className="mt-2 text-sm text-ink-soft leading-relaxed">
          We'll write the day before your city's first event opens. No spam, no upsell. If you replied to this list,
          a real person reads it.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="label block mb-1.5">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full h-11 rounded-md border border-paper-line bg-paper px-3 text-ink placeholder:text-ink-subtle focus:border-teal focus:ring-1 focus:ring-teal outline-none"
        />
      </div>

      {!compact && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="country" className="label block mb-1.5">Country</label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full h-11 rounded-md border border-paper-line bg-paper px-3 text-ink focus:border-teal focus:ring-1 focus:ring-teal outline-none"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="city" className="label block mb-1.5">City</label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai"
                className="w-full h-11 rounded-md border border-paper-line bg-paper px-3 text-ink placeholder:text-ink-subtle focus:border-teal focus:ring-1 focus:ring-teal outline-none"
              />
            </div>
          </div>

          <div>
            <label className="label block mb-1.5">I'm here as</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <button
                  type="button"
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={`h-11 rounded-md border px-3 text-sm text-left transition-colors ${
                    role === r.value
                      ? "border-teal bg-teal-wash text-ink"
                      : "border-paper-line bg-paper text-ink-soft hover:border-teal/40"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label block mb-1.5">Condition I'd be reading about</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCondition("")}
                className={`h-9 rounded-full border px-3.5 text-sm transition-colors ${
                  condition === ""
                    ? "border-teal bg-teal-wash text-ink"
                    : "border-paper-line bg-paper text-ink-soft hover:border-teal/40"
                }`}
              >
                Any / not sure yet
              </button>
              {CONDITION_LIST.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCondition(c.id)}
                  className={`h-9 rounded-full border px-3.5 text-sm transition-colors ${
                    condition === c.id
                      ? "border-teal bg-teal-wash text-ink"
                      : "border-paper-line bg-paper text-ink-soft hover:border-teal/40"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {errorMsg && (
        <p className="text-sm text-clay">{errorMsg}</p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Adding you…" : "Reserve my place on the waitlist"}
      </Button>

      <p className="text-xs text-ink-muted leading-relaxed">
        We never sell data. We never share your email. Mira is informational only and does not provide medical advice.
      </p>
    </form>
  );
}
