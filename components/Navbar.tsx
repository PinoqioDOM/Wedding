"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/#story", label: "ჩვენი ისტორია" },
  { href: "/#schedule", label: "განრიგი" },
  { href: "/gallery", label: "გალერეა" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-cream-200/70 bg-cream-50/90 backdrop-blur">
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="relative z-10 font-display font-extrabold text-4xl leading-none">
          თ <span className="text-gold-500">&</span> ქ
        </Link>
        <ul className="hidden lg:flex items-center gap-8 text-sm tracking-wide relative z-10">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-ink-800/80 font-display text-xl font-extrabold hover:text-ink-900 transition cursor-pointer">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          aria-label="მენიუს გახსნა"
          className="lg:hidden text-ink-900 relative z-10"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-cream-200 bg-cream-50">
          <ul className="flex flex-col px-6 py-4 gap-3 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block font-display text-xl py-1" onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}