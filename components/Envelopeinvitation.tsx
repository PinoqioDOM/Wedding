"use client";

import { useState } from "react";
import Link from "next/link";

type EnvelopeInvitationProps = {
  guestName?: string;
  href?: string;
};

export default function EnvelopeInvitation({
  guestName,
  href = "/invitation",
}: EnvelopeInvitationProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-5">
      <button
        type="button"
        aria-label={open ? "მოსაწვევი გახსნილია" : "დააჭირეთ მოსაწვევის გასახსნელად"}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        disabled={open}
        className="group relative block w-full max-w-sm aspect-[3/2] rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-4 focus-visible:ring-offset-cream-50 disabled:cursor-default"
      >
        {/* კონვერტის ზურგი */}
        <span className="absolute inset-0 rounded-sm bg-cream-200 border border-gold-400/30 shadow-[0_18px_40px_-20px_rgba(90,70,30,0.45)] transition-shadow duration-500 group-hover:shadow-[0_22px_48px_-18px_rgba(90,70,30,0.55)]" />

        {/* ქვედა ჯიბე */}
        <span
          className="absolute inset-x-0 bottom-0 h-[58%] bg-cream-300/70 border-t border-gold-400/20"
          style={{ clipPath: "polygon(0% 100%, 100% 100%, 50% 22%)" }}
        />

        {/* წერილი — მოთავსებულია შიგნით, იხსნება ზემოთ */}
        <span
          className={[
            "absolute left-1/2 top-[10%] -translate-x-1/2 w-[82%]",
            "bg-cream-50 border border-gold-400/30 rounded-[2px]",
            "shadow-[0_10px_24px_-14px_rgba(90,70,30,0.5)]",
            "flex flex-col items-center px-5 py-7 text-center",
            "transition-transform duration-700 ease-out motion-reduce:transition-none",
            open ? "translate-y-[-58%]" : "translate-y-[20%]",
          ].join(" ")}
          style={{ zIndex: 20 }}
        >
          <p className="text-[0.65rem] tracking-[0.25em] uppercase text-gold-600">
            მოსაწვევი
          </p>
          <p className="mt-3 font-display text-xl md:text-2xl text-ink-900 leading-snug">
            {guestName ?? "ძვირფასო სტუმარო"}
          </p>
          <p className="mt-3 text-sm text-ink-700/80 leading-relaxed max-w-[22ch]">
            დაპატიჟებული ხართ თორნიკესა და ქრისტინას ქორწილში — 24 სექტემბერს,
            ვილა სააკაძეში.
          </p>
          <Link
            href={href}
            tabIndex={open ? 0 : -1}
            aria-hidden={!open}
            className={[
              "mt-5 inline-flex items-center gap-1.5 text-sm text-gold-600 hover:text-ink-900",
              "underline underline-offset-4 decoration-gold-400/50",
              "transition-opacity duration-500 delay-[650ms] motion-reduce:delay-0",
              open ? "opacity-100" : "opacity-0 pointer-events-none",
            ].join(" ")}
          >
            სრული მოსაწვევის ნახვა →
          </Link>
        </span>

        {/* თავსახური, იხსნება ზემოთ */}
        <span
          className="absolute inset-x-0 top-0 h-[62%] bg-cream-200 border-b border-gold-400/30 origin-top transition-transform duration-700 ease-in-out motion-reduce:transition-none"
          style={{
            clipPath: "polygon(0 0, 100% 0, 50% 78%)",
            transform: open ? "rotateX(-165deg)" : "rotateX(0deg)",
            transformStyle: "preserve-3d",
            zIndex: open ? 5 : 30,
          }}
        />

        {/* ცვილის ბეჭედი */}
        <span
          className={[
            "absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2",
            "w-11 h-11 rounded-full bg-gold-500 text-cream-50 grid place-items-center",
            "font-display text-sm shadow-[0_2px_6px_rgba(0,0,0,0.25)]",
            "transition-opacity duration-300",
            open ? "opacity-0" : "opacity-100 group-hover:scale-105",
          ].join(" ")}
          style={{ zIndex: 35 }}
        >
          თ&ქ
        </span>
      </button>

      {!open && (
        <p className="text-xs uppercase tracking-[0.25em] text-ink-700/50">
          დააჭირეთ გასახსნელად
        </p>
      )}
    </div>
  );
}