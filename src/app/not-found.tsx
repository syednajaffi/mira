import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-prose py-24 text-center">
      <p className="label">Not found</p>
      <h1 className="mt-3 font-serif text-headline text-ink">This page is somewhere else.</h1>
      <p className="mt-4 reading">
        The page you were looking for has moved or never existed. Try the home page or the morning brief.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-md bg-teal px-5 text-sm font-medium text-paper no-underline hover:bg-teal-deep"
        >
          Home
        </Link>
        <Link
          href="/today"
          className="inline-flex h-10 items-center rounded-md border border-paper-line bg-paper px-5 text-sm font-medium text-ink no-underline hover:bg-paper-soft"
        >
          Today's research
        </Link>
      </div>
    </div>
  );
}
