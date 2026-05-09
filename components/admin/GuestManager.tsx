"use client";

import { useMemo, useState, useTransition } from "react";
import type { Guest, RsvpStatus, DBTables } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

const RSVP: RsvpStatus[] = ["pending", "accepted", "declined"];

const RSVP_LABEL: Record<RsvpStatus | "all", string> = {
  all: "ყველა",
  pending: "მოლოდინში",
  accepted: "დადასტურებული",
  declined: "უარი",
};

export default function GuestManager({ initial }: { initial: Guest[] }) {
  const supabase = createClient();
  const [guests, setGuests] = useState<Guest[]>(initial);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<RsvpStatus | "all">("all");
  const [editing, setEditing] = useState<Partial<Guest> | null>(null);
  const [, start] = useTransition();

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return guests.filter((g) => {
      if (filter !== "all" && g.rsvp_status !== filter) return false;
      if (!term) return true;
      return [g.full_name, g.email, g.group_name].some((v) =>
        v?.toLowerCase().includes(term),
      );
    });
  }, [guests, q, filter]);

  async function save(g: Partial<Guest>) {
    if (!g.full_name?.trim()) {
      alert("სახელი და გვარი სავალდებულოა");
      return;
    }

    if (g.id) {
      const id = g.id;
      const update: DBTables["guests"]["Update"] = {
        full_name: g.full_name,
        email: g.email ?? null,
        phone: g.phone ?? null,
        group_name: g.group_name ?? null,
        rsvp_status: g.rsvp_status,
        dietary_notes: g.dietary_notes ?? null,
        plus_one_of: g.plus_one_of ?? null,
      };
      const { data, error } = await supabase
        .from("guests")
        .update(update as never)
        .eq("id", id)
        .select()
        .single();
      if (error) return alert(error.message);
      if (data) {
        const row = data as Guest;
        setGuests((prev) => prev.map((x) => (x.id === row.id ? row : x)));
      }
    } else {
      const insert: DBTables["guests"]["Insert"] = {
        full_name: g.full_name,
        email: g.email ?? null,
        phone: g.phone ?? null,
        group_name: g.group_name ?? null,
        rsvp_status: g.rsvp_status ?? "pending",
        dietary_notes: g.dietary_notes ?? null,
        plus_one_of: g.plus_one_of ?? null,
      };
      const { data, error } = await supabase
        .from("guests")
        .insert(insert as never)
        .select()
        .single();
      if (error) return alert(error.message);
      if (data) {
        const row = data as Guest;
        setGuests((prev) => [row, ...prev]);
      }
    }
    setEditing(null);
  }

  async function remove(id: string) {
    if (!confirm("წავშალოთ ეს სტუმარი?")) return;
    start(async () => {
      const { error } = await supabase.from("guests").delete().eq("id", id);
      if (error) return alert(error.message);
      setGuests((prev) => prev.filter((g) => g.id !== id));
    });
  }

  const counts = useMemo(
    () => ({
      all: guests.length,
      pending: guests.filter((g) => g.rsvp_status === "pending").length,
      accepted: guests.filter((g) => g.rsvp_status === "accepted").length,
      declined: guests.filter((g) => g.rsvp_status === "declined").length,
    }),
    [guests],
  );

  return (
    <div className="card p-6">
      <header className="flex flex-wrap gap-3 items-center justify-between mb-5">
        <h2 className="font-display text-2xl">სტუმრების სია</h2>
        <button className="btn-primary" onClick={() => setEditing({})}>+ სტუმრის დამატება</button>
      </header>

      <div className="flex flex-wrap gap-3 mb-5">
        <input
          className="input flex-1 min-w-[220px]"
          placeholder="ძებნა სახელით, ელფოსტით ან ჯგუფით…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="flex gap-1 rounded-full border border-cream-200 bg-cream-50 p-1 text-sm">
          {(["all", ...RSVP] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3 py-1.5 rounded-full transition ${
                filter === k ? "bg-ink-900 text-cream-50" : "hover:bg-cream-100"
              }`}
            >
              {RSVP_LABEL[k]} <span className="text-xs opacity-60">({counts[k]})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-[0.18em] text-ink-700/60">
            <tr>
              <th className="px-2 py-2 font-medium">სახელი</th>
              <th className="px-2 py-2 font-medium">ჯგუფი</th>
              <th className="px-2 py-2 font-medium">ელფოსტა</th>
              <th className="px-2 py-2 font-medium">სტატუსი</th>
              <th className="px-2 py-2 font-medium">კვება</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => (
              <tr key={g.id} className="border-t border-cream-200 hover:bg-cream-100/40">
                <td className="px-2 py-2 font-medium text-ink-900">{g.full_name}</td>
                <td className="px-2 py-2 text-ink-700/80">{g.group_name ?? "—"}</td>
                <td className="px-2 py-2 text-ink-700/80">{g.email ?? "—"}</td>
                <td className="px-2 py-2"><RsvpPill s={g.rsvp_status} /></td>
                <td className="px-2 py-2 text-ink-700/70">{g.dietary_notes ?? "—"}</td>
                <td className="px-2 py-2 text-right whitespace-nowrap">
                  <button className="text-gold-600 hover:underline" onClick={() => setEditing(g)}>რედაქტირება</button>
                  <span className="mx-2 text-ink-700/30">·</span>
                  <button className="text-blush-500 hover:underline" onClick={() => remove(g.id)}>წაშლა</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-2 py-10 text-center text-ink-700/50">სტუმრები ვერ მოიძებნა.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && <GuestModal value={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function RsvpPill({ s }: { s: RsvpStatus }) {
  const map: Record<RsvpStatus, string> = {
    pending: "bg-cream-100 text-ink-700/80 border-cream-200",
    accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    declined: "bg-blush-100 text-blush-500 border-blush-200",
  };
  const label: Record<RsvpStatus, string> = {
    pending: "მოლოდინში",
    accepted: "დადასტურებული",
    declined: "უარი",
  };
  return (
    <span className={`inline-block text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${map[s]}`}>
      {label[s]}
    </span>
  );
}

function GuestModal({
  value, onClose, onSave,
}: {
  value: Partial<Guest>;
  onClose: () => void;
  onSave: (g: Partial<Guest>) => void;
}) {
  const [g, setG] = useState<Partial<Guest>>(value);
  const rsvpLabel: Record<RsvpStatus, string> = {
    pending: "მოლოდინში",
    accepted: "დადასტურებული",
    declined: "უარი",
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/30 backdrop-blur-sm p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => { e.preventDefault(); onSave(g); }}
        className="card p-6 w-full max-w-lg space-y-3"
      >
        <h3 className="font-display text-2xl">{g.id ? "სტუმრის რედაქტირება" : "სტუმრის დამატება"}</h3>
        <input className="input" placeholder="სახელი და გვარი" required
          value={g.full_name ?? ""} onChange={(e) => setG({ ...g, full_name: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <input className="input" placeholder="ელფოსტა" type="email"
            value={g.email ?? ""} onChange={(e) => setG({ ...g, email: e.target.value || null })} />
          <input className="input" placeholder="ტელეფონი"
            value={g.phone ?? ""} onChange={(e) => setG({ ...g, phone: e.target.value || null })} />
        </div>
        <input className="input" placeholder="ჯგუფი (მაგ. პატარძლის ოჯახი)"
          value={g.group_name ?? ""} onChange={(e) => setG({ ...g, group_name: e.target.value || null })} />
        <select className="input" value={g.rsvp_status ?? "pending"}
          onChange={(e) => setG({ ...g, rsvp_status: e.target.value as RsvpStatus })}>
          {RSVP.map((r) => <option key={r} value={r}>{rsvpLabel[r]}</option>)}
        </select>
        <textarea className="input rounded-2xl py-3" rows={2} placeholder="კვების შენიშვნები"
          value={g.dietary_notes ?? ""} onChange={(e) => setG({ ...g, dietary_notes: e.target.value || null })} />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>გაუქმება</button>
          <button type="submit" className="btn-primary">შენახვა</button>
        </div>
      </form>
    </div>
  );
}