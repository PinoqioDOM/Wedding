export default function Loading() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-2xl border border-cream-200 bg-cream-50 p-10 flex flex-col items-center gap-4">
        <div className="h-6 w-32 bg-cream-200 rounded animate-pulse" />
        <div className="h-12 w-64 bg-cream-200 rounded animate-pulse" />
        <div className="h-4 w-48 bg-cream-200 rounded animate-pulse mt-2" />
        <div className="h-4 w-40 bg-cream-200 rounded animate-pulse" />
        <div className="h-10 w-32 bg-cream-200 rounded-full animate-pulse mt-4" />
      </div>
    </section>
  );
}