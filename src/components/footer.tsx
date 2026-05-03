import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-paper-line bg-paper-soft/40">
      <div className="container-page py-12 grid gap-10 md:grid-cols-4 text-sm">
        <div>
          <div className="inline-flex items-baseline gap-1">
            <span className="font-serif text-xl font-semibold text-ink">mira</span>
            <span className="h-1 w-1 rounded-full bg-amber" />
          </div>
          <p className="mt-3 text-ink-muted leading-relaxed max-w-xs">
            Daily research, weekly food scans, monthly dinners. For everyone living with a chronic condition.
          </p>
        </div>

        <div>
          <p className="label mb-3">Product</p>
          <ul className="space-y-2 text-ink-soft">
            <li><Link href="/today" className="no-underline hover:text-ink">Today</Link></li>
            <li><Link href="/scan" className="no-underline hover:text-ink">Scan</Link></li>
            <li><Link href="/together" className="no-underline hover:text-ink">Together</Link></li>
          </ul>
        </div>

        <div>
          <p className="label mb-3">Company</p>
          <ul className="space-y-2 text-ink-soft">
            <li><Link href="/about" className="no-underline hover:text-ink">About</Link></li>
            <li><Link href="/about#mbegum" className="no-underline hover:text-ink">The MBegum tier</Link></li>
            <li>
              <Link href="mailto:hello@mira.health" className="no-underline hover:text-ink">
                hello@mira.health
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="label mb-3">Trust</p>
          <ul className="space-y-2 text-ink-soft">
            <li><Link href="/legal/privacy" className="no-underline hover:text-ink">Privacy</Link></li>
            <li><Link href="/legal/terms" className="no-underline hover:text-ink">Terms</Link></li>
            <li><Link href="/legal/medical-disclaimer" className="no-underline hover:text-ink">Medical disclaimer</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper-line">
        <div className="container-page py-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center text-xs text-ink-muted">
          <p>© {new Date().getFullYear()} Mira. Informational only — never a substitute for medical advice.</p>
          <p>Made with care · for every patient and every parent who cares for one.</p>
        </div>
      </div>
    </footer>
  );
}
