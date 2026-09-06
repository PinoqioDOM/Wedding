"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import WeddingEnvelope from "@/components/WeddingEnvelope";

function InvitationContent() {
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") ?? undefined;

  return <WeddingEnvelope guestName={guestName} />;
}

export default function InvitationPage() {
  return (
    <Suspense fallback={null}>
      <InvitationContent />
    </Suspense>
  );
}