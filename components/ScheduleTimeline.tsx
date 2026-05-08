import type { Activity } from "@/lib/types";

const ICONS: Record<string, string> = {
  glass: "🥂",
  rings: "💍",
  plate: "🍽",
  music: "♪",
  star: "✦",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ScheduleTimeline({ activities }: { activities: Activity[] }) {
  if (!activities.length) {
    return (
      <p className="text-center text-ink-700/60">
        Schedule will appear here once added.
      </p>
    );
  }

  return (
    <ol className="relative">
      <span className="absolute left-[5.25rem] md:left-[7rem] top-2 bottom-2 w-px bg-gold-400/40" aria-hidden />
      {activities.map((a) => (
        <li key={a.id} className="relative grid grid-cols-[5rem_auto_1fr] md:grid-cols-[7rem_auto_1fr] gap-4 md:gap-6 py-5">
          <time className="font-display text-2xl md:text-3xl text-ink-900 text-right pt-0.5">
            {fmt(a.starts_at)}
          </time>
          <span className="relative grid place-items-center">
            <span className="w-10 h-10 rounded-full bg-cream-50 border border-gold-400/60 grid place-items-center text-base">
              {ICONS[a.icon ?? "star"] ?? "✦"}
            </span>
          </span>
          <div className="pt-1">
            <h3 className="font-display text-2xl">{a.title}</h3>
            {a.description && (
              <p className="text-ink-700/80 mt-0.5">{a.description}</p>
            )}
            {a.location && (
              <p className="text-xs uppercase tracking-[0.2em] text-gold-600 mt-1">{a.location}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
