import SeatingAdmin from "@/components/admin/SeatingAdmin";
import { createClient } from "@/lib/supabase/server";

export default async function AdminSeatingPage() {
  const supabase = await createClient();
  const [{ data: tables }, { data: seats }, { data: guests }] = await Promise.all([
    supabase.from("tables").select("*").order("label"),
    supabase.from("seats").select("*"),
    supabase.from("guests").select("id,full_name").order("full_name"),
  ]);
  return (
    <SeatingAdmin
      tables={tables ?? []}
      seats={seats ?? []}
      guests={guests ?? []}
    />
  );
}
