import InvitationCard from "@/components/InvitationCard";
import InvitationGate from "@/components/InvitationGate";

export const metadata = { title: "მოსაწვევი — თორნიკე & ქრისტინა" };

export default function InvitationPage({
  searchParams,
}: {
  searchParams: { to?: string };
}) {
  const guestName = searchParams.to?.trim() || undefined;

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      {guestName ? <InvitationGate guestName={guestName} /> : <InvitationCard />}
    </section>
  );
}