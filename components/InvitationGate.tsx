"use client";

import { useState } from "react";
import EnvelopeInvitation from "@/components/EnvelopeInvation";
import InvitationCard from "@/components/InvitationCard";

export default function InvitationGate({ guestName }: { guestName?: string }) {
  const [revealed, setRevealed] = useState(false);

  if (revealed) {
    return <InvitationCard />;
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <p className="label mb-2">ჩვენი დღე</p>
      <h1 className="font-display text-3xl md:text-4xl text-ink-900 mb-10">
        გაქვთ მოსაწვევი
      </h1>
      <EnvelopeInvitation guestName={guestName} onContinue={() => setRevealed(true)} />
    </div>
  );
}