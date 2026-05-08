import GuestManager from "@/components/admin/GuestManager";
import { createClient } from "@/lib/supabase/server";

export default async function AdminGuestsPage() {
  const supabase = await createClient();
  const { data: guests } = await supabase
    .from("guests")
    .select("*")
    .order("full_name");
  return <GuestManager initial={guests ?? []} />;
}
