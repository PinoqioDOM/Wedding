import Gallery from "@/components/Gallery";
import { createClient } from "@/lib/supabase/server";
import type { Photo } from "@/lib/types";

export const metadata = { title: "გალერეა — ქრისტინა & თორნიკე" };
export const revalidate = 0;

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <header className="text-center mb-12">
        <p className="label">საერთო მოგონებები</p>
        <h1 className="mt-2 text-4xl md:text-5xl">გალერეა</h1>
        <p className="mt-4 text-ink-700/70 max-w-xl mx-auto">
          ატვირთეთ თქვენი საუკეთესო კადრები, რომ ერთად შევქმნათ ჩვენი დღის სრული მოგონება.
        </p>
      </header>
      <Gallery initial={(data ?? []) as Photo[]} />
    </section>
  );
}