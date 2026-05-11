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
export interface Photo {
  id: string;
  url: string;
  uploader: string | null;
  caption: string | null;
  owner_token: string | null;
  created_at: string;
}

type PhotoInsert = {
  id?: string;
  url: string;
  uploader?: string | null;
  caption?: string | null;
  owner_token?: string | null;
  created_at?: string;
};


type GuestInsert = {
  id?: string;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  group_name?: string | null;
  rsvp_status?: RsvpStatus;
  dietary_notes?: string | null;
  plus_one_of?: string | null;
  created_at?: string;
};

type ActivityInsert = {
  id?: string;
  starts_at: string;
  title: string;
  description?: string | null;
  location?: string | null;
  icon?: string | null;
  sort_order?: number;
  created_at?: string;
};

type TableInsert = {
  id?: string;
  label: string;
  position_x?: number;
  position_y?: number;
  shape?: "round" | "rect";
  created_at?: string;
};

type SeatInsert = {
  id?: string;
  table_id: string;
  seat_index: number;
  guest_id?: string | null;
};

export type Database = {
  public: {
    Tables: {
      guests: {
        Row: Guest;
        Insert: GuestInsert;
        Update: Partial<GuestInsert>;
        Relationships: [];
      };
      activities: {
        Row: Activity;
        Insert: ActivityInsert;
        Update: Partial<ActivityInsert>;
        Relationships: [];
      };
      tables: {
        Row: TableRow;
        Insert: TableInsert;
        Update: Partial<TableInsert>;
        Relationships: [];
      };
      seats: {
        Row: Seat;
        Insert: SeatInsert;
        Update: Partial<SeatInsert>;
        Relationships: [];
      };
      photos: {
        Row: Photo;
        Insert: PhotoInsert;
        Update: Partial<PhotoInsert>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type DBTables = Database["public"]["Tables"];