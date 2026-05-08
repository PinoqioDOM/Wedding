// Auto-generate this with `supabase gen types typescript` for full safety.
// Hand-written stub kept short here so the project compiles out of the box.

export type RsvpStatus = "pending" | "accepted" | "declined";

export interface Guest {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  group_name: string | null;
  rsvp_status: RsvpStatus;
  dietary_notes: string | null;
  plus_one_of: string | null;
  created_at: string;
}

export interface Activity {
  id: string;
  starts_at: string;
  title: string;
  description: string | null;
  location: string | null;
  icon: string | null;
  sort_order: number;
  created_at: string;
}

export interface TableRow {
  id: string;
  label: string;
  position_x: number;
  position_y: number;
  shape: "round" | "rect";
  created_at: string;
}

export interface Seat {
  id: string;
  table_id: string;
  seat_index: number;
  guest_id: string | null;
}

export type Database = {
  public: {
    Tables: {
      guests: { Row: Guest; Insert: Partial<Guest>; Update: Partial<Guest> };
      activities: { Row: Activity; Insert: Partial<Activity>; Update: Partial<Activity> };
      tables: { Row: TableRow; Insert: Partial<TableRow>; Update: Partial<TableRow> };
      seats: { Row: Seat; Insert: Partial<Seat>; Update: Partial<Seat> };
    };
  };
};
