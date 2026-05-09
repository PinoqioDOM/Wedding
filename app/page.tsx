import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import InvitationTeaser from "@/components/InvitationTeaser";
import ScheduleTimeline from "@/components/ScheduleTimeline";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();
  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .order("starts_at", { ascending: true });

  return (
    <>
      <Hero />
      <Countdown />
      <InvitationTeaser />
      <section id="schedule" className="mx-auto max-w-5xl px-6 py-24">
        <header className="text-center mb-14">
          <p className="label">დღის განრიგი</p>
          <h2 className="mt-2 text-4xl md:text-5xl">მოვლენების თანმიმდევრობა</h2>
          <div className="divider-orn mt-6">
            <span className="text-lg">✦</span>
          </div>
        </header>
        <ScheduleTimeline activities={activities ?? []} />
      </section>
    </>
  );
}