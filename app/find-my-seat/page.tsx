import FindMySeat from "@/components/FindMySeat";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Find my seat" };

export default async function FindMySeatPage() {
  const supabase = await createClient();
  const [{ data: tables }, { data: seats }, { data: guests }] = await Promise.all([
    supabase.from("tables").select("*"),
    supabase.from("seats").select("*"),
    supabase.from("guests").select("id,full_name").order("full_name"),
  ]);

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <header className="text-center mb-10">
        <p className="label">Welcome</p>
        <h1 className="mt-2 text-4xl md:text-5xl">Find your seat</h1>
        <p className="mt-4 text-ink-700/70">
          Type your name to discover your table and chair.
        </p>
      </header>
      <FindMySeat tables={tables ?? []} seats={seats ?? []} guests={guests ?? []} />
    </section>
  );
}
