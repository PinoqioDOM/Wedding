import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const tabs = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/guests", label: "Guests" },
  { href: "/admin/schedule", label: "Schedule" },
  { href: "/admin/seating", label: "Seating" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const role = (user.user_metadata as { role?: string })?.role;
  if (role !== "admin") {
    return (
      <section className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="font-display text-3xl">Not authorised</h1>
        <p className="mt-3 text-ink-700/70">
          Your account is signed in but doesn't have admin permissions.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="label">Hosts only</p>
          <h1 className="font-display text-4xl mt-1">Admin</h1>
        </div>
        <nav className="flex gap-1 rounded-full border border-cream-200 bg-cream-50 p-1 text-sm">
          {tabs.map((t) => (
            <Link key={t.href} href={t.href}
                  className="px-4 py-1.5 rounded-full hover:bg-cream-100 transition">
              {t.label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </section>
  );
}
