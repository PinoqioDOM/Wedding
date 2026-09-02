"use client";

import { useState } from "react";

export default function InviteLinkGenerator() {
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  const link =
    typeof window !== "undefined" && name.trim()
      ? `${window.location.origin}/invitation?to=${encodeURIComponent(name.trim())}`
      : "";

  const copy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-cream-200 bg-cream-50 p-5 max-w-md">
      <p className="text-sm font-medium text-ink-900 mb-3">
        პერსონალური მოსაწვევის ლინკი
      </p>

      <label className="block text-xs uppercase tracking-[0.15em] text-ink-700/60 mb-1">
        სტუმრის სახელი (ან წყვილი, მაგ. „ზუკა და ანი")
      </label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="ზუკა და ანი"
        className="w-full rounded-md border border-cream-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50"
      />

      {link && (
        <div className="mt-4">
          <p className="text-xs text-ink-700/60 mb-1">გენერირებული ლინკი:</p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={link}
              onFocus={(e) => e.currentTarget.select()}
              className="flex-1 rounded-md border border-cream-200 bg-cream-100 px-3 py-2 text-xs text-ink-700 truncate"
            />
            <button
              type="button"
              onClick={copy}
              className="shrink-0 rounded-md bg-gold-500 hover:bg-gold-600 text-cream-50 text-xs font-medium px-3 py-2 transition-colors"
            >
              {copied ? "დაკოპირდა ✓" : "კოპირება"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}