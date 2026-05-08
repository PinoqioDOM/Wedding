import ScheduleManager from "@/components/admin/ScheduleManager";
import { createClient } from "@/lib/supabase/server";

export default async function AdminSchedulePage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("activities")
    .select("*")
    .order("starts_at");
  return <ScheduleManager initial={data ?? []} />;
}
