import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  const couple = process.env.NEXT_PUBLIC_COUPLE_NAMES || "ქრისტინა & თორნიკე";
  const venue = process.env.NEXT_PUBLIC_VENUE || "ვილა სააკაძე";
  const [first, second] = couple.split("&").map((s) => s.trim());

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Photo */}
          <figure className="relative">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-cream-100 shadow-soft border border-cream-200 relative">
              <Image
                src="/Wedding.jpeg"
                alt="ქრისტინა და თორნიკე"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full border border-gold-400/50" />
            <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-blush-200/70" />
          </figure>

          {/* Title */}
          <div>
            <p className="label">ჩვენ ვქორწინდებით</p>
            <h1 className="mt-4 leading-[0.95] text-[clamp(3rem,8vw,6rem)]">
              <span className="block font-extrabold italic">{first || "ქრისტინა"}</span>
              <span className="block font-script text-gold-500 text-[0.7em] -my-3">&amp;</span>
              <span className="block font-extrabold italic">{second || "თორნიკე"}</span>
            </h1>

            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              <div className="text-center">
                <p className="label">თარიღი</p>
                <p className="font-display text-2xl mt-1">24·09·26</p>
              </div>
              <div className="text-center border-x border-cream-200">
                <p className="label">სად</p>
                <p className="font-display text-lg mt-1">ვილა სააკაძე</p>
              </div>
              <div className="text-center">
                <p className="label">დრო</p>
                <p className="font-display text-2xl mt-1">18:00</p>
              </div>
            </div>

            <p className="mt-6 max-w-md text-ink-700/80 leading-relaxed">
              {venue}. შემოგვიერთდით საზეიმო ცერემონიაზე, საუცხოო ვახშამზე
              და ცეკვებით სავსე ღამეზე ვარსკვლავების ქვეშ.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/invitation" className="btn-primary">მოსაწვევის ნახვა</Link>
              <Link href="/find-my-seat" className="btn-ghost">ჩემი ადგილი</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}