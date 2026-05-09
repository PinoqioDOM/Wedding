import Link from "next/link";

export default function InvitationTeaser() {
  return (
    <section id="story" className="mx-auto max-w-5xl px-6 py-24 text-center">
      <p className="label text-xl">პატარა შენიშვნა</p>
      <p className="mt-6 mx-auto max-w-2xl text-ink-700/80 text-lg leading-relaxed">
        პატივი გვექნება გავიზიაროთ თქვენთან ჩვენი განსაკუთრებული დღე.
        გახსენით მოწვევა, რომ ნახოთ ცერემონიის დეტალები, ჩაცმის სტილი და
        ღონისძიების ადგილის რუკა.
      </p>
      <div className="mt-10 flex justify-center gap-3">
        <Link href="/invitation" className="btn-gold">მოსაწვევის გახსნა</Link>
      </div>
    </section>
  );
}