"use client";

import { useState } from "react";
import type { Guest, Seat, TableRow } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import SeatingChart from "@/components/SeatingChart";

export default function SeatingAdmin({
  tables: initialTables, seats: initialSeats, guests,
}: {
  tables: TableRow[]; seats: Seat[]; guests: Pick<Guest, "id" | "full_name">[];
}) {
  const supabase = createClient();
  const [tables, setTables] = useState(initialTables);
  const [seats] = useState(initialSeats);
  const [label, setLabel] = useState("");

  async function addTable() {
    if (!label.trim()) return;
    const { data } = await supabase.from("tables").insert({ label }).select().single();
    if (data) {
      setTables((prev) => [...prev, data]);
      // seats are created by DB trigger; reload to fetch them in real apps.
    }
    setLabel("");
  }
  async function removeTable(id: string) {
    if (!confirm("Remove this table and its seats?")) return;
    await supabase.from("tables").delete().eq("id", id);
    setTables((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="card p-5 flex flex-wrap gap-3 items-center">
        <input className="input flex-1 min-w-[180px]" placeholder='New table label, e.g. "Table 12"'
               value={label} onChange={(e) => setLabel(e.target.value)} />
        <button className="btn-primary" onClick={addTable}>+ Add table</button>
        <ul className="basis-full text-sm text-ink-700/70 flex flex-wrap gap-x-4 gap-y-1 mt-2">
          {tables.map((t) => (
            <li key={t.id}>
              {t.label}
              <button className="ml-1 text-blush-500 hover:underline" onClick={() => removeTable(t.id)}>×</button>
            </li>
          ))}
        </ul>
      </div>

      <SeatingChart tables={tables} seats={seats} guests={guests} />
    </div>
  );
}
