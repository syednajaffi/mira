import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { env } from "@/lib/env";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Mira — daily research, weekly food scans, monthly dinners",
    template: "%s · Mira"
  },
  description:
    "Mira helps people living with chronic conditions live well between doctor visits. The morning research brief, the food fit scanner, and local dinners — all on one verified profile.",
  applicationName: "Mira",
  keywords: [
    "chronic illness",
    "type 2 diabetes",
    "hypertension",
    "asthma",
    "patient community",
    "medical research",
    "nutrition",
    "food scanner"
  ],
  authors: [{ name: "Mira" }],
  openGraph: {
    title: "Mira — for everyone living with a chronic condition",
    description:
      "Daily research, weekly food scans, monthly dinners. One verified life. Free at launch; pay-what-fits MBegum tier.",
    type: "website",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "Mira",
    description: "Daily research, weekly food scans, monthly dinners — for chronic patients."
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F4" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1112" }
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
