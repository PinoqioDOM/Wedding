"use client";

import { useMemo, useState } from "react";
import type { Guest, Seat, TableRow } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

type Props = {
  tables: TableRow[];
  seats: Seat[];
  guests: Pick<Guest, "id" | "full_name">[];
  readOnly?: boolean;
  highlightGuestId?: string | null;
};

const TABLE_R = 64;
const CHAIR_R = 100;
const PAD = 24;

export default function SeatingChart({
  tables, seats, guests, readOnly, highlightGuestId,
}: Props) {
  const supabase = createClient();
  const [localSeats, setLocalSeats] = useState<Seat[]>(seats);
  const [picker, setPicker] = useState<{ seat: Seat } | null>(null);
  const [filter, setFilter] = useState("");

  const guestById = useMemo(
    () => new Map(guests.map((g) => [g.id, g.full_name])),
    [guests],
  );

  const seatsByTable = useMemo(() => {
    const m = new Map<string, Seat[]>();
    for (const s of localSeats) {
      const arr = m.get(s.table_id) ?? [];
      arr.push(s);
      m.set(s.table_id, arr);
    }
    for (const arr of m.values()) arr.sort((a, b) => a.seat_index - b.seat_index);
    return m;
  }, [localSeats]);

  async function assign(seat: Seat, guestId: string | null) {
    setLocalSeats((prev) =>
      prev.map((s) => (s.id === seat.id ? { ...s, guest_id: guestId } : s)),
    );
    setPicker(null);
    const update = { guest_id: guestId };
    const { error } = await supabase
      .from("seats")
      .update(update as never)
      .eq("id", seat.id);
    if (error) alert(error.message);
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
        {tables.map((t) => {
          const tableSeats = seatsByTable.get(t.id) ?? [];
          return (
            <article key={t.id} className="card p-4">
              <header className="flex items-center justify-between px-2 mb-2">
                <h3 className="font-display text-xl">{t.label}</h3>
                <span className="text-xs text-ink-700/60">
                  {tableSeats.filter((s) => s.guest_id).length}/10
                </span>
              </header>

              <div className="relative mx-auto"
                style={{ width: 2 * (CHAIR_R + PAD), height: 2 * (CHAIR_R + PAD) }}>
                <div
                  className="absolute rounded-full bg-cream-100 border border-gold-400/60"
                  style={{
                    width: 2 * TABLE_R, height: 2 * TABLE_R,
                    left: "50%", top: "50%",
                    transform: "translate(-50%,-50%)",
                  }}
                >
                  <span className="absolute inset-0 grid place-items-center font-script text-gold-500 text-2xl">
                    {t.label.replace(/^მაგიდა\s*/i, "").replace(/^table\s*/i, "")}
                  </span>
                </div>

                {Array.from({ length: 10 }).map((_, i) => {
                  const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
                  const cx = CHAIR_R + PAD + Math.cos(angle) * CHAIR_R;
                  const cy = CHAIR_R + PAD + Math.sin(angle) * CHAIR_R;
                  const seat: Seat | undefined = tableSeats[i];
                  const name = seat?.guest_id ? guestById.get(seat.guest_id) ?? null : null;
                  const highlight = !!seat?.guest_id && seat.guest_id === highlightGuestId;
                  return (
                    <button
                      key={seat?.id ?? `empty-${t.id}-${i}`}
                      type="button"
                      disabled={!seat}
                      onClick={() => { if (seat && !readOnly) setPicker({ seat }); }}
                      title={name ?? `ადგილი ${i + 1}`}
                      className={[
                        "absolute -translate-x-1/2 -translate-y-1/2 rounded-full",
                        "w-9 h-9 grid place-items-center text-[10px] leading-none",
                        "border transition",
                        highlight
                          ? "bg-gold-500 text-cream-50 border-gold-500 ring-4 ring-gold-400/30"
                          : name
                            ? "bg-blush-200 text-ink-900 border-blush-300"
                            : "bg-cream-50 text-ink-700/60 border-cream-200 hover:border-gold-400",
                        readOnly && !highlight ? "cursor-default" : "cursor-pointer",
                      ].join(" ")}
                      style={{ left: cx, top: cy }}
                    >
                      {name ? initials(name) : i + 1}
                    </button>
                  );
                })}
              </div>

              <ul className="mt-3 px-2 text-sm space-y-0.5">
                {tableSeats.map((s, i) => (
                  <li key={s.id} className="flex justify-between gap-2 py-0.5">
                    <span className="text-ink-700/50 tabular-nums w-5">{i + 1}.</span>
                    <span className={`flex-1 truncate ${s.guest_id ? "text-ink-900" : "text-ink-700/40 italic"}`}>
                      {s.guest_id ? guestById.get(s.guest_id) ?? "—" : "ცარიელი"}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      {picker && !readOnly && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink-900/30 backdrop-blur-sm p-4"
          onClick={() => setPicker(null)}
        >
          <div className="card p-5 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <header className="flex items-center justify-between">
              <h3 className="font-display text-xl">სტუმრის მინიჭება</h3>
              <button className="text-ink-700/60" onClick={() => setPicker(null)}>×</button>
            </header>
            <input
              autoFocus
              className="input mt-3"
              placeholder="სტუმრის ძებნა…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <ul className="mt-3 max-h-72 overflow-y-auto divide-y divide-cream-200">
              <li>
                <button className="w-full text-left py-2 text-ink-700/60 italic"
                  onClick={() => assign(picker.seat, null)}>
                  — ადგილის გასუფთავება —
                </button>
              </li>
              {guests
                .filter((g) => g.full_name.toLowerCase().includes(filter.toLowerCase()))
                .slice(0, 50)
                .map((g) => (
                  <li key={g.id}>
                    <button className="w-full text-left py-2 hover:text-gold-600"
                      onClick={() => assign(picker.seat, g.id)}>
                      {g.full_name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((s) => s[0]?.toUpperCase() ?? "").join("");
}