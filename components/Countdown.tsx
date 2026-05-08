"use client";

import { useEffect, useState } from "react";

function diff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms / 3_600_000) % 24);
  const m = Math.floor((ms / 60_000) % 60);
  const s = Math.floor((ms / 1000) % 60);
  return { d, h, m, s };
}

export default function Countdown() {
  const target = new Date(process.env.NEXT_PUBLIC_WEDDING_DATE || "2026-09-12T16:00:00+02:00");
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const cells: { value: number; label: string }[] = [
    { value: t.d, label: "Days" },
    { value: t.h, label: "Hours" },
    { value: t.m, label: "Minutes" },
    { value: t.s, label: "Seconds" },
  ];

  return (
    <section className="mx-auto max-w-4xl px-6 -mt-6">
      <div className="card px-6 md:px-10 py-8">
        <p className="text-center label">Counting the days</p>
        <ul className="mt-5 grid grid-cols-4 gap-3 md:gap-6">
          {cells.map((c) => (
            <li key={c.label} className="text-center">
              <div className="font-display text-4xl md:text-6xl text-ink-900 tabular-nums">
                {String(c.value).padStart(2, "0")}
              </div>
              <div className="mt-1 text-[10px] md:text-xs uppercase tracking-[0.25em] text-ink-700/60">
                {c.label}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
