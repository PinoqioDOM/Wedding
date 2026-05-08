-- ============================================================
--  Wedding site — Supabase schema
--  Run inside Supabase SQL editor (or `supabase db push`).
-- ============================================================

-- 1. Enable required extensions ------------------------------------------------
create extension if not exists "pgcrypto";

-- 2. Helper: who is admin? -----------------------------------------------------
-- Mark admin users by adding `{ "role": "admin" }` to user_metadata
-- when you create them in Supabase Auth.
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- 3. Tables -------------------------------------------------------------------

-- Tables (physical reception tables)
create table if not exists public.tables (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,                -- e.g. "Table 1", "Olive"
  position_x  numeric not null default 0,   -- canvas coords
  position_y  numeric not null default 0,
  shape       text not null default 'round' check (shape in ('round','rect')),
  created_at  timestamptz not null default now()
);

-- Seats (exactly 10 per table — enforced via trigger below)
create table if not exists public.seats (
  id         uuid primary key default gen_random_uuid(),
  table_id   uuid not null references public.tables(id) on delete cascade,
  seat_index smallint not null check (seat_index between 1 and 10),
  guest_id   uuid references public.guests(id) on delete set null,
  unique (table_id, seat_index)
);

-- Guests
create table if not exists public.guests (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  email         text,
  phone         text,
  group_name    text,                          -- e.g. "Bride family", "College friends"
  rsvp_status   text not null default 'pending'
                check (rsvp_status in ('pending','accepted','declined')),
  dietary_notes text,
  plus_one_of   uuid references public.guests(id) on delete set null,
  created_at    timestamptz not null default now()
);

-- Activities / schedule
create table if not exists public.activities (
  id          uuid primary key default gen_random_uuid(),
  starts_at   timestamptz not null,
  title       text not null,
  description text,
  location    text,
  icon        text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- 4. Auto-create 10 seats whenever a new table is inserted --------------------
create or replace function public.create_seats_for_table()
returns trigger
language plpgsql
as $$
begin
  insert into public.seats (table_id, seat_index)
  select new.id, generate_series(1, 10);
  return new;
end;
$$;

drop trigger if exists trg_create_seats on public.tables;
create trigger trg_create_seats
after insert on public.tables
for each row execute function public.create_seats_for_table();

-- 5. Indexes ------------------------------------------------------------------
create index if not exists idx_guests_full_name on public.guests using gin (to_tsvector('simple', full_name));
create index if not exists idx_seats_table_id   on public.seats (table_id);
create index if not exists idx_activities_time  on public.activities (starts_at);

-- 6. Row Level Security -------------------------------------------------------
alter table public.guests     enable row level security;
alter table public.activities enable row level security;
alter table public.tables     enable row level security;
alter table public.seats      enable row level security;

-- Everyone (anon + authenticated) can READ. Only admins can WRITE.
do $$ begin
  -- guests
  drop policy if exists guests_read on public.guests;
  create policy guests_read on public.guests for select using (true);
  drop policy if exists guests_write on public.guests;
  create policy guests_write on public.guests for all using (public.is_admin()) with check (public.is_admin());

  -- activities
  drop policy if exists activities_read on public.activities;
  create policy activities_read on public.activities for select using (true);
  drop policy if exists activities_write on public.activities;
  create policy activities_write on public.activities for all using (public.is_admin()) with check (public.is_admin());

  -- tables
  drop policy if exists tables_read on public.tables;
  create policy tables_read on public.tables for select using (true);
  drop policy if exists tables_write on public.tables;
  create policy tables_write on public.tables for all using (public.is_admin()) with check (public.is_admin());

  -- seats
  drop policy if exists seats_read on public.seats;
  create policy seats_read on public.seats for select using (true);
  drop policy if exists seats_write on public.seats;
  create policy seats_write on public.seats for all using (public.is_admin()) with check (public.is_admin());
end $$;

-- 7. Sample seed (optional — comment out for production) ----------------------
insert into public.activities (starts_at, title, description, location, icon, sort_order)
values
  (timestamptz '2026-09-12 15:30+02', 'Welcome drinks', 'Arrival & sparkling wine in the garden',  'Garden terrace', 'glass', 1),
  (timestamptz '2026-09-12 16:00+02', 'Ceremony',       'Exchange of vows under the cypress arch', 'Lakeside lawn', 'rings', 2),
  (timestamptz '2026-09-12 17:00+02', 'Cocktails',      'Aperitivo, canapés & live string trio',   'Loggia',        'glass', 3),
  (timestamptz '2026-09-12 18:30+02', 'Dinner',         'Five-course tasting menu',                'Grand hall',    'plate', 4),
  (timestamptz '2026-09-12 20:00+02', 'First dance',    'Speeches, cake & opening of the dance floor','Grand hall', 'music', 5),
  (timestamptz '2026-09-12 23:30+02', 'Late night',     'Espresso, gelato cart & DJ set',          'Terrace',       'star',  6)
on conflict do nothing;
