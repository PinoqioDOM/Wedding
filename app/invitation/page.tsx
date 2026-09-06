import WeddingEnvelope from "@/components/WeddingEnvelope";

export const metadata = { title: "მოსაწვევი — თორნიკე & ქრისტინა" };

export default function InvitationPage({
  searchParams,
}: {
  searchParams: { to?: string };
}) {
  const guestName = searchParams.to?.trim() || undefined;

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <WeddingEnvelope guestName={guestName} />
    </section>
  );
}