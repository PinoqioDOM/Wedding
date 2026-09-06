"use client";

import { useSearchParams } from "next/navigation";
import WeddingEnvelope from "@/components/WeddingEnvelope"; 

export default function InvitationPage() {
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") ?? undefined;

  return <WeddingEnvelope guestName={guestName} />;
}