export default function Loading() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <header className="text-center mb-12">
        <div className="h-4 w-24 bg-cream-200 rounded animate-pulse mx-auto" />
        <div className="h-10 w-48 bg-cream-200 rounded animate-pulse mx-auto mt-3" />
      </header>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square bg-cream-200 rounded-lg animate-pulse" />
        ))}
      </div>
    </section>
  );
}