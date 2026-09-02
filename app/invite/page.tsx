import type { Metadata } from "next";
import EnvelopeInvitation from "@/components/Envelopeinvitation";

export const metadata: Metadata = {
  title: "მოსაწვევი — თორნიკე & ქრისტინა",
};

export default function InvitePage({
  searchParams,
}: {
  searchParams: { to?: string };
}) {
  // ?to=ზუკა და ანი -> "ზუკა და ანი"
  const guestName = searchParams.to?.trim() || undefined;

  return (
    <section className="mx-auto max-w-3xl px-6 py-20 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <p className="label mb-2">ჩვენი დღე</p>
      <h1 className="font-display text-3xl md:text-4xl text-ink-900 mb-10">
        გაქვთ მოსაწვევი
      </h1>
      <EnvelopeInvitation guestName={guestName} href="/invitation" />
    </section>
  );
}