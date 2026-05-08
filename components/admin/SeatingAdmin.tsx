"use client";

import { useState } from "react";
import type { Guest, Seat, TableRow, DBTables } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import SeatingChart from "@/components/SeatingChart";

export default function SeatingAdmin({
  tables: initialTables, seats: initialSeats, guests,
}: {
  tables: TableRow[];
  seats: Seat[];
  guests: Pick<Guest, "id" | "full_name">[];
}) {
  const supabase = createClient();
  const [tables, setTables] = useState<TableRow[]>(initialTables);
  const [seats, setSeats] = useState<Seat[]>(initialSeats);
  const [label, setLabel] = useState("");

  async function addTable() {
    if (!label.trim()) return;
    const insert: DBTables["tables"]["Insert"] = { label };
    const { data: newTable, error } = await supabase
      .from("tables")
      .insert(insert as never)
      .select()
      .single();
    if (error) return alert(error.message);
    if (newTable) {
      const row = newTable as TableRow;
      setTables((prev) => [...prev, row]);
      const { data: newSeats } = await supabase
        .from("seats")
        .select("*")
        .eq("table_id", row.id);
      if (newSeats) setSeats((prev) => [...prev, ...(newSeats as Seat[])]);
    }
    setLabel("");
  }

  async function removeTable(id: string) {
    if (!confirm("Remove this table and its seats?")) return;
    const { error } = await supabase.from("tables").delete().eq("id", id);
    if (error) return alert(error.message);
    setTables((prev) => prev.filter((t) => t.id !== id));
    setSeats((prev) => prev.filter((s) => s.table_id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="card p-5 flex flex-wrap gap-3 items-center">
        <input className="input flex-1 min-w-[180px]"
          placeholder='New table label, e.g. "Table 12"'
          value={label} onChange={(e) => setLabel(e.target.value)} />
        <button className="btn-primary" onClick={addTable}>+ Add table</button>
        <ul className="basis-full text-sm text-ink-700/70 flex flex-wrap gap-x-4 gap-y-1 mt-2">
          {tables.map((t) => (
            <li key={t.id}>
              {t.label}
              <button className="ml-1 text-blush-500 hover:underline"
                onClick={() => removeTable(t.id)}>×</button>
            </li>
          ))}
        </ul>
      </div>

      <SeatingChart tables={tables} seats={seats} guests={guests} />
    </div>
  );
}