import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-paper/80 border-b border-paper-line">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="group inline-flex items-baseline gap-1 no-underline">
          <span className="font-serif text-2xl font-semibold tracking-tight text-ink">
            mira
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-amber transition-transform duration-200 group-hover:translate-y-[-2px]" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/today" className="text-ink-soft hover:text-ink no-underline">
            Today
          </Link>
          <Link href="/scan" className="text-ink-soft hover:text-ink no-underline">
            Scan
          </Link>
          <Link href="/together" className="text-ink-soft hover:text-ink no-underline">
            Together
          </Link>
          <Link href="/about" className="text-ink-soft hover:text-ink no-underline">
            About
          </Link>
        </nav>

        <Link
          href="/#waitlist"
          className="inline-flex h-9 items-center rounded-md bg-teal px-4 text-sm font-medium text-paper no-underline transition-colors hover:bg-teal-deep"
        >
          Join the waitlist
        </Link>
      </div>
    </header>
  );
}
