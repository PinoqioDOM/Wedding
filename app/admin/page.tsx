import { createClient } from "@/lib/supabase/server";

export default async function AdminHome() {
  const supabase = await createClient();
  const [{ count: guests }, { count: accepted }, { count: tables }, { count: assigned }] = await Promise.all([
    supabase.from("guests").select("*", { count: "exact", head: true }),
    supabase.from("guests").select("*", { count: "exact", head: true }).eq("rsvp_status", "accepted"),
    supabase.from("tables").select("*", { count: "exact", head: true }),
    supabase.from("seats").select("*", { count: "exact", head: true }).not("guest_id", "is", null),
  ]);

  const stats = [
    { label: "Guests invited", value: guests ?? 0 },
    { label: "Accepted", value: accepted ?? 0 },
    { label: "Tables", value: tables ?? 0 },
    { label: "Seats filled", value: `${assigned ?? 0}/${(tables ?? 0) * 10}` },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="card p-6">
          <p className="label">{s.label}</p>
          <p className="font-display text-4xl mt-2">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
