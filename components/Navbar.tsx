"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/#story", label: "ჩვენი ისტორია" },
  { href: "/#schedule", label: "განრიგი" },
  { href: "/invitation", label: "მოსაწვევი" },
  { href: "/seating", label: "დარბაზი" },
  { href: "/find-my-seat", label: "ჩემი ადგილი" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-cream-200/70 bg-cream-50/70 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-extrabold text-2xl text-ink-900 leading-none">
          ქ <span className="text-gold-500">&amp;</span> თ
        </Link>
        <ul className="hidden md:flex items-center gap-8 text-sm tracking-wide">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-ink-800/80 hover:text-ink-900 transition">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/admin" className="hidden md:inline-flex btn-ghost">ადმინი</Link>

        <button
          aria-label="მენიუს გახსნა"
          className="md:hidden text-ink-900"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-cream-200 bg-cream-50">
          <ul className="flex flex-col px-6 py-4 gap-3 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block py-1" onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/admin" className="block py-1 text-gold-600">ადმინი</Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}