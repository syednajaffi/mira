import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical disclaimer",
  description: "Mira is informational only and does not provide medical advice."
};

export default function MedicalDisclaimerPage() {
  return (
    <div className="container-prose py-16 md:py-24">
      <p className="label">Legal · Medical disclaimer</p>
      <h1 className="mt-3 font-serif text-headline text-ink leading-tight">
        Informational only.
      </h1>

      <section className="mt-10 reading">
        <p>
          Mira is an educational service. Nothing on this site or in our applications is intended to be — and must
          not be relied on as — medical advice, diagnosis, or treatment.
        </p>
        <p>
          Our research summaries are short, plain-English readings of published academic papers. They are produced
          with the help of an AI model and may contain errors of interpretation, summary, or emphasis. Always read
          the original paper. Always discuss any treatment change with your clinician.
        </p>
        <p>
          Our scanner reports nutrition values from Open Food Facts and contextualizes them against public dietary
          guidelines (WHO, ICMR, NHS, ADA, AHA, GINA). It does not personalize advice to your medical history,
          medications, or laboratory results. Always discuss dietary changes with your clinician or registered
          dietitian.
        </p>
        <p>
          Our events are social gatherings. Mira does not provide medical care, dietary prescription, or
          supervision at events. Attendees participate at their own discretion.
        </p>
        <p>
          If you may be experiencing a medical emergency, contact your local emergency number immediately:
          112 in the EU and India (also 102/108 for ambulance), 911 in the US and Canada, 999 in the UK, 000 in
          Australia, 119 in Japan, 120 in China, 1669 in Thailand.
        </p>
        <p>
          For questions about this disclaimer, write to{" "}
          <a className="text-teal-deep" href="mailto:hello@mira.health">
            hello@mira.health
          </a>
          .
        </p>
      </section>
    </div>
  );
}
