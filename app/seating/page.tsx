import SeatingChart from "@/components/SeatingChart";
import FindMySeat from "@/components/FindMySeat";
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
      {/* Find my seat — top */}
      <header className="text-center mb-10">
        <p className="label">მოგესალმებით</p>
        <h1 className="mt-2 text-4xl md:text-5xl">იპოვეთ თქვენი ადგილი</h1>
        <p className="mt-4 text-ink-700/70">
          ჩაწერეთ თქვენი სახელი და ნახეთ თქვენი მაგიდა და სკამი.
        </p>
      </header>

      <div className="max-w-2xl mx-auto mb-20">
        <FindMySeat tables={tables ?? []} seats={seats ?? []} guests={guests ?? []} />
      </div>

      {/* Full seating chart */}
      <header className="text-center mb-10">
        <div className="divider-orn mb-8"><span>✦</span></div>
        <p className="label">დარბაზი</p>
        <h2 className="mt-2 text-3xl md:text-4xl">მაგიდების განლაგება</h2>
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