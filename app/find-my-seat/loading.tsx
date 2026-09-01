export default function Loading() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <header className="text-center mb-10">
        <div className="h-4 w-24 bg-cream-200 rounded animate-pulse mx-auto" />
        <div className="h-10 w-64 bg-cream-200 rounded animate-pulse mx-auto mt-3" />
      </header>
      <div className="h-12 bg-cream-200 rounded animate-pulse" />
    </section>
  );
}