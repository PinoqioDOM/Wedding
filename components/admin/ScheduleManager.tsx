"use client";

import { useState } from "react";
import type { Activity, DBTables } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

const ICONS = ["glass", "rings", "plate", "music", "star"];
const ICON_LABEL: Record<string, string> = {
  glass: "🥂 სასმელი",
  rings: "💍 ცერემონია",
  plate: "🍽 ვახშამი",
  music: "♪ მუსიკა",
  star: "✦ სხვა",
};
const byTime = (a: Activity, b: Activity) => a.starts_at.localeCompare(b.starts_at);

export default function ScheduleManager({ initial }: { initial: Activity[] }) {
  const supabase = createClient();
  const [items, setItems] = useState<Activity[]>(initial);
  const [editing, setEditing] = useState<Partial<Activity> | null>(null);

  async function save(a: Partial<Activity>) {
    if (!a.title?.trim() || !a.starts_at) {
      alert("სახელი და დრო სავალდებულოა");
      return;
    }

    if (a.id) {
      const id = a.id;
      const update: DBTables["activities"]["Update"] = {
        title: a.title,
        starts_at: a.starts_at,
        description: a.description ?? null,
        location: a.location ?? null,
        icon: a.icon ?? null,
        sort_order: a.sort_order ?? 0,
      };
      const { data, error } = await supabase
        .from("activities")
        .update(update as never)
        .eq("id", id)
        .select()
        .single();
      if (error) return alert(error.message);
      if (data) {
        const row = data as Activity;
        setItems((prev) => prev.map((x) => (x.id === row.id ? row : x)).sort(byTime));
      }
    } else {
      const insert: DBTables["activities"]["Insert"] = {
        title: a.title,
        starts_at: a.starts_at,
        description: a.description ?? null,
        location: a.location ?? null,
        icon: a.icon ?? null,
        sort_order: a.sort_order ?? 0,
      };
      const { data, error } = await supabase
        .from("activities")
        .insert(insert as never)
        .select()
        .single();
      if (error) return alert(error.message);
      if (data) {
        const row = data as Activity;
        setItems((prev) => [...prev, row].sort(byTime));
      }
    }
    setEditing(null);
  }

  async function remove(id: string) {
    if (!confirm("წავშალოთ ეს მოვლენა?")) return;
    const { error } = await supabase.from("activities").delete().eq("id", id);
    if (error) return alert(error.message);
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div className="card p-6">
      <header className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl">განრიგი</h2>
        <button className="btn-primary" onClick={() => setEditing({})}>+ მოვლენის დამატება</button>
      </header>

      <ol className="divide-y divide-cream-200">
        {items.map((a) => (
          <li key={a.id} className="grid grid-cols-[6rem_1fr_auto] gap-4 items-center py-3">
            <time className="font-display text-xl">
              {new Date(a.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
            </time>
            <div>
              <p className="font-medium">{a.title}</p>
              {a.description && <p className="text-sm text-ink-700/70">{a.description}</p>}
            </div>
            <div className="flex gap-3 text-sm">
              <button className="text-gold-600 hover:underline" onClick={() => setEditing(a)}>რედაქტირება</button>
              <button className="text-blush-500 hover:underline" onClick={() => remove(a.id)}>წაშლა</button>
            </div>
          </li>
        ))}
        {items.length === 0 && <p className="text-center text-ink-700/50 py-10">მოვლენები ჯერ არ დამატებულა.</p>}
      </ol>

      {editing && <ActivityModal value={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function ActivityModal({
  value, onClose, onSave,
}: {
  value: Partial<Activity>;
  onClose: () => void;
  onSave: (a: Partial<Activity>) => void;
}) {
  const [a, setA] = useState<Partial<Activity>>(value);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/30 backdrop-blur-sm p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => { e.preventDefault(); onSave(a); }}
        className="card p-6 w-full max-w-lg space-y-3"
      >
        <h3 className="font-display text-2xl">{a.id ? "მოვლენის რედაქტირება" : "მოვლენის დამატება"}</h3>
        <input className="input" placeholder="სახელი (მაგ. ცერემონია)" required
          value={a.title ?? ""} onChange={(e) => setA({ ...a, title: e.target.value })} />
        <input className="input" type="datetime-local" required
          value={a.starts_at ? toLocal(a.starts_at) : ""}
          onChange={(e) => setA({ ...a, starts_at: new Date(e.target.value).toISOString() })} />
        <input className="input" placeholder="ადგილი"
          value={a.location ?? ""} onChange={(e) => setA({ ...a, location: e.target.value || null })} />
        <textarea className="input rounded-2xl py-3" rows={2} placeholder="აღწერა"
          value={a.description ?? ""} onChange={(e) => setA({ ...a, description: e.target.value || null })} />
        <select className="input" value={a.icon ?? "star"}
          onChange={(e) => setA({ ...a, icon: e.target.value })}>
          {ICONS.map((i) => <option key={i} value={i}>{ICON_LABEL[i]}</option>)}
        </select>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>გაუქმება</button>
          <button type="submit" className="btn-primary">შენახვა</button>
        </div>
      </form>
    </div>
  );
}

function toLocal(iso: string) {
  const d = new Date(iso);
  const tz = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 16);
}