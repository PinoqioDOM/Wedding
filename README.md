# Amelia & Julian — Wedding Site

An elegant wedding website built with **Next.js 14 (App Router)**, **Tailwind CSS** and **Supabase**.

## Features

- 🌸 **Hero** with couple photo, names, date and live countdown timer
- 💌 **Invitation card** at `/invitation` — viewable & shareable (Web Share API + clipboard fallback)
- 👥 **Guest list (100–110)** stored in Supabase — admin CRUD + search/filter by name, email, group, RSVP
- 🕰 **Schedule** timeline (16:00 Ceremony, 17:00 Cocktails, 18:30 Dinner, 20:00 First dance…) — admin-editable
- 🪑 **Seating chart** — round tables of 10. Click a chair to assign a guest. Guests can use **/find-my-seat** to look up their own table & chair
- 🔐 **Auth & admin mode** — Supabase Auth password sign-in. Users with `user_metadata.role = "admin"` get edit access; everyone else sees read-only views
- 📱 **Mobile-friendly** — responsive layout, soft cream / blush / gold palette, Cormorant Garamond + Allura + Inter

## Quick start

```bash
# 1. Install
pnpm install   # or npm i / yarn

# 2. Configure Supabase
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (Project Settings → API)

# 3. Create the schema
#    Open Supabase SQL editor and run supabase/schema.sql
#    (or:  supabase db push  if you use the CLI)

# 4. Make yourself admin
#    Auth → Users → invite an email → edit user → user_metadata: { "role": "admin" }

# 5. Run
pnpm dev
```

## Project layout

```
app/
  page.tsx                  ← Hero + countdown + schedule
  invitation/page.tsx       ← Shareable invitation card
  seating/page.tsx          ← Public seating chart (read-only)
  find-my-seat/page.tsx     ← Guest lookup
  login/page.tsx            ← Supabase email/password sign-in
  admin/
    layout.tsx              ← Auth + role guard
    page.tsx                ← Stats overview
    guests/page.tsx
    schedule/page.tsx
    seating/page.tsx
  auth/callback/route.ts
components/
  Hero.tsx  Countdown.tsx  InvitationCard.tsx
  ScheduleTimeline.tsx  SeatingChart.tsx  FindMySeat.tsx
  Navbar.tsx  Footer.tsx
  admin/
    GuestManager.tsx  ScheduleManager.tsx  SeatingAdmin.tsx
lib/
  supabase/{client,server}.ts
  types.ts
supabase/
  schema.sql                ← guests, activities, tables, seats + RLS
middleware.ts
```

## Database

Four tables, all with **Row Level Security**:

| Table        | Notes                                                                     |
| ------------ | ------------------------------------------------------------------------- |
| `guests`     | full_name, email, phone, group_name, rsvp_status, dietary_notes, plus_one |
| `activities` | starts_at, title, description, location, icon, sort_order                 |
| `tables`     | label, position_x/y, shape — *trigger auto-creates 10 seats per table*    |
| `seats`      | table_id, seat_index 1–10, guest_id (nullable)                            |

RLS: `select` open to everyone. `insert / update / delete` only when `auth.jwt().user_metadata.role = 'admin'`.

## Customising

- **Couple, date, venue** — `.env.local` (`NEXT_PUBLIC_COUPLE_NAMES`, `NEXT_PUBLIC_WEDDING_DATE`, `NEXT_PUBLIC_VENUE`)
- **Couple photo** — drop a `couple.jpg` into `public/` and replace the placeholder block in `components/Hero.tsx` with `<Image src="/couple.jpg" … />`
- **Palette & fonts** — `tailwind.config.ts` (cream / blush / gold scales) + `app/globals.css` (Google Fonts import)

## License

Private. Made with love for Amelia & Julian. 💍
