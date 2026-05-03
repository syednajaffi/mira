export default function Loading() {
  return (
    <div className="container-page py-12 md:py-20">
      <div className="max-w-readable">
        <div className="h-3 w-24 bg-paper-soft rounded animate-pulse" />
        <div className="mt-4 h-12 w-3/4 bg-paper-soft rounded animate-pulse" />
        <div className="mt-3 h-12 w-1/2 bg-paper-soft rounded animate-pulse" />
        <div className="mt-7 h-5 w-full bg-paper-soft rounded animate-pulse" />
        <div className="mt-2 h-5 w-2/3 bg-paper-soft rounded animate-pulse" />
      </div>

      <div className="mt-10 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-9 w-32 bg-paper-soft rounded-full animate-pulse" />
        ))}
      </div>

      <div className="mt-12 grid gap-7 max-w-readable">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="surface p-7 md:p-8">
            <div className="flex gap-2">
              <div className="h-6 w-24 bg-paper-soft rounded-full animate-pulse" />
              <div className="h-6 w-32 bg-paper-soft rounded-full animate-pulse" />
            </div>
            <div className="mt-4 h-7 w-full bg-paper-soft rounded animate-pulse" />
            <div className="mt-2 h-7 w-2/3 bg-paper-soft rounded animate-pulse" />
            <div className="mt-6 space-y-3">
              <div className="h-4 w-full bg-paper-soft rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-paper-soft rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-paper-soft rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
