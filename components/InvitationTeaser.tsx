import Link from "next/link";

export default function InvitationTeaser() {
  return (
    <section id="story" className="mx-auto max-w-5xl px-6 py-24 text-center">
      <p className="label">A little note</p>
      <h2 className="mt-3 text-4xl md:text-5xl">
        Together with our families
      </h2>
      <p className="mt-6 mx-auto max-w-2xl text-ink-700/80 text-lg leading-relaxed">
        We would be honoured to share with you our most special day.
        Open your invitation to find ceremony details, dress code and a map to the venue —
        and feel free to share it with your plus-one.
      </p>
      <div className="mt-10 flex justify-center gap-3">
        <Link href="/invitation" className="btn-gold">Open invitation</Link>
      </div>
    </section>
  );
}
