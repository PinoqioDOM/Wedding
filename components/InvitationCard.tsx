"use client";

import { useState } from "react";

export default function InvitationCard() {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "ქრისტინა & თორნიკე", url }); return; }
      catch { /* fall through */ }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="relative">
      {/* Envelope frame */}
      <div className="card relative px-8 md:px-14 py-14 md:py-20 text-center">
        {/* corner ornaments */}
        {[
          "top-4 left-4", "top-4 right-4 rotate-90",
          "bottom-4 left-4 -rotate-90", "bottom-4 right-4 rotate-180",
        ].map((pos) => (
          <svg key={pos} className={`absolute ${pos} text-gold-500/70`} width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M2 14 C 8 14, 14 8, 14 2" stroke="currentColor" strokeWidth="1" />
            <path d="M2 18 C 10 18, 18 10, 18 2" stroke="currentColor" strokeWidth="0.7" />
            <circle cx="3" cy="3" r="1" fill="currentColor" />
          </svg>
        ))}

        <p className="label">ოჯახთან ერთად</p>

        <h1 className="mt-6 font-display italic font-light text-5xl md:text-7xl leading-[0.95]">
          ქრისტინა <span className="font-script text-gold-500 text-[0.55em] align-middle">&amp;</span> თორნიკე
        </h1>

        <div className="divider-orn mt-8"><span>✦</span></div>

        <p className="mt-8 mx-auto max-w-md text-ink-700/85 leading-relaxed">
          პატივი გვექნება გიმასპინძლოთ ჩვენი ქორწილის ზეიმზე
        </p>

        <div className="mt-10 grid grid-cols-3 gap-2 max-w-lg mx-auto">
          <Cell label="ხუთშაბათი" value="24" sub="რიცხვი" />
          <Cell label="სექტემბერი" value="09" sub="თვე" big />
          <Cell label="ორი ათას ოცდამეექვსე" value="26" sub="წელი" />
        </div>

        <p className="mt-10 font-display text-2xl">ვილა სააკაძე</p>
        <p className="text-sm text-ink-700/70 mt-1">თბილისი, საქართველო</p>

        <p className="mt-8 text-sm text-ink-700/70">
          ცერემონია — <span className="font-medium text-ink-900">18:00 საათზე</span>
          <br /> შემდეგ — ვახშამი და დღესასწაული
        </p>

        <div className="mt-10 inline-flex items-center gap-4 px-5 py-2.5 rounded-full bg-cream-100 border border-cream-200 text-xs uppercase tracking-[0.25em] text-ink-700/70">
          საღამოს ჩაცმულობა · ბაღის ფერები მისასალმებელია
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <button onClick={share} className="btn-primary">
            {copied ? "ბმული დაკოპირდა ✓" : "მოწვევის გაზიარება"}
          </button>
          <a href="/calendar.ics" className="btn-ghost">კალენდარში დამატება</a>
        </div>
      </div>

      {/* wax seal */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-blush-400 text-cream-50 grid place-items-center font-script text-2xl shadow-soft border border-blush-500/40">
        ქთ
      </div>
    </article>
  );
}

function Cell({ label, value, sub, big = false }: { label: string; value: string; sub: string; big?: boolean }) {
  return (
    <div className={`py-4 ${big ? "border-x border-cream-200" : ""}`}>
      <p className="text-[10px] uppercase tracking-[0.25em] text-ink-700/60">{label}</p>
      <p className="font-display text-5xl mt-1">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.25em] text-gold-600 mt-1">{sub}</p>
    </div>
  );
}