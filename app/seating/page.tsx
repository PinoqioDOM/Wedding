import SeatingChart from "@/components/SeatingChart";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "დარბაზი — ქრისტინა & თორნიკე" };
export const revalidate = 30;

export default async function SeatingPage() {
  const supabase = await createClient();
  const [{ data: tables }, { data: seats }, { data: guests }] = await Promise.all([
    supabase.from("tables").select("*").order("label"),
    supabase.from("seats").select("*"),
    supabase.from("guests").select("id,full_name").order("full_name"),
  ]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <header className="text-center mb-10">
        <p className="label">დარბაზი</p>
        <h1 className="mt-2 text-4xl md:text-5xl">მაგიდების განლაგება</h1>
        <p className="mt-4 text-ink-700/70 max-w-xl mx-auto">
          დააჭირეთ ნებისმიერ ადგილს რომ ნახოთ ვინ ზის იქ. ეძებთ თქვენს ადგილს?
          <a href="/find-my-seat" className="text-gold-600 underline-offset-4 hover:underline ml-1">სახელით ძებნა</a>.
        </p>
      </header>

      <SeatingChart
        tables={tables ?? []}
        seats={seats ?? []}
        guests={guests ?? []}
        readOnly
      />
    </section>
  );
}