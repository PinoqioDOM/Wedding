"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import WeddingEnvelope from "./WeddingEnvelope";

function GateInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") ?? undefined;

  if (guestName) {
    return (
      <div className="fixed inset-0 z-[999] bg-cream-50">
        <WeddingEnvelope guestName={guestName} />
      </div>
    );
  }

  return <>{children}</>;
}

export default function InvitationGate({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <GateInner>{children}</GateInner>
    </Suspense>
  );
}