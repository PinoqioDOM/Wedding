"use client";

import { useMemo, useState } from "react";
import type { Guest, Seat, TableRow } from "@/lib/types";

type Props = {
  tables: TableRow[];
  seats: Seat[];
  guests: Pick<Guest, "id" | "full_name">[];
};

export default function FindMySeat({ tables, seats, guests }: Props) {
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<string | null>(null);

  const matches = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return guests
      .filter((g) => g.full_name.toLowerCase().includes(term))
      .slice(0, 8);
  }, [q, guests]);

  const result = useMemo(() => {
    if (!picked) return null;
    const seat = seats.find((s) => s.guest_id === picked);
    if (!seat) return { found: false as const };
    const table = tables.find((t) => t.id === seat.table_id);
    return { found: true as const, seat, table };
  }, [picked, seats, tables]);

  return (
    <div className="card p-6 md:p-10">
      <input
        className="input"
        placeholder="Start typing your name…"
        value={q}
        onChange={(e) => { setQ(e.target.value); setPicked(null); }}
      />

      {!picked && matches.length > 0 && (
        <ul className="mt-3 divide-y divide-cream-200 rounded-2xl border border-cream-200 overflow-hidden">
          {matches.map((g) => (
            <li key={g.id}>
              <button
                className="w-full text-left px-4 py-3 hover:bg-cream-100"
                onClick={() => setPicked(g.id)}
              >
                {g.full_name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {result && result.found && (
        <div className="mt-8 text-center">
          <p className="label">You're seated at</p>
          <p className="font-display text-5xl mt-2">{result.table?.label}</p>
          <p className="font-script text-gold-500 text-3xl mt-2">chair n° {result.seat.seat_index}</p>
          <p className="mt-6 text-ink-700/70">
            See you on the dance floor.
          </p>
        </div>
      )}

      {result && !result.found && (
        <div className="mt-8 text-center text-ink-700/70">
          We don't have a seat assigned yet — please ask one of the hosts.
        </div>
      )}
    </div>
  );
}
