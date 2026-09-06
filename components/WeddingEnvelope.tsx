"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type Stage = "closed" | "opening" | "open";

const EASE = [0.22, 1, 0.36, 1] as const;
const QUOTE = "მოწვეული ხართ ჩვენს ქორწილში";

function useTypewriter(text: string, active: boolean, speed = 45) {
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (!active) return;
    setOutput("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setOutput(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [active, text, speed]);

  return output;
}

export default function WeddingEnvelope({ guestName }: { guestName?: string }) {
  const [stage, setStage] = useState<Stage>("closed");
  const typed = useTypewriter(QUOTE, stage === "open");

  const open = () => {
    setStage("opening");
    setTimeout(() => setStage("open"), 750);
  };

  const flapOpen = stage !== "closed";

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4">
      <div
        className="relative w-full max-w-[300px] aspect-square"
        style={{ perspective: 1600 }}
      >
        {/* წერილი — ფლაპების ქვეშ */}
        <motion.div
          className="absolute inset-[6%] rounded-[2px] bg-cream-50 border border-gold-400/30 shadow-[0_12px_28px_-14px_rgba(90,70,30,0.55)] flex flex-col items-center justify-center gap-3 px-5 py-6 text-center z-0"
          initial={false}
          animate={{ opacity: stage === "open" ? 1 : 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <p className="font-display text-base text-ink-900 leading-snug">
            თორნიკე <span className="font-script text-gold-500">&amp;</span> ქრისტინა
          </p>

          <p className="font-display italic text-lg text-ink-900 leading-snug min-h-[3.2em]">
            {typed}
            <span className="inline-block w-[2px] h-[1em] bg-gold-500/70 ml-0.5 align-middle animate-pulse" />
          </p>

          <motion.div
            initial={false}
            animate={{ opacity: typed === QUOTE ? 1 : 0, y: typed === QUOTE ? 0 : 6 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p className="text-sm text-ink-700/80">ვილა სააკაძე</p>
            <p className="text-xs text-ink-700/60">კახეთი, საქართველო</p>
            <p className="mt-2 text-sm text-ink-900">24 სექტემბერი, 2026</p>
            <p className="text-xs text-ink-700/60">ცერემონია — 18:00 საათზე</p>
            <Link
              href="/"
              className="mt-3 inline-block text-xs text-gold-600 hover:text-ink-900 underline underline-offset-4 decoration-gold-400/50 transition-colors"
            >
              სრული დეტალები →
            </Link>
          </motion.div>
        </motion.div>

        {/* 4 ფლაპი — თითოეული საკუთარ კიდეზე იხსნება */}
        <Flap edge="top" open={flapOpen} />
        <Flap edge="right" open={flapOpen} />
        <Flap edge="bottom" open={flapOpen} />
        <Flap edge="left" open={flapOpen} />

        {/* ბეჭედი */}
        {stage === "closed" && (
          <button
            type="button"
            aria-label="დააჭირეთ მოსაწვევის გასახსნელად"
            onClick={open}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 text-cream-50 grid place-items-center font-display text-sm ring-1 ring-gold-300/60 shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-transform hover:scale-105 z-40"
          >
            თ&ქ
          </button>
        )}
      </div>

      {stage === "closed" && (
        <p className="text-xs uppercase tracking-[0.25em] text-ink-700/50">
          დააჭირეთ გასახსნელად
        </p>
      )}
    </div>
  );
}

const CLIP: Record<string, string> = {
  top: "polygon(0 0, 100% 0, 50% 50%)",
  right: "polygon(100% 0, 100% 100%, 50% 50%)",
  bottom: "polygon(100% 100%, 0 100%, 50% 50%)",
  left: "polygon(0 100%, 0 0, 50% 50%)",
};

const ORIGIN: Record<string, string> = {
  top: "50% 0%",
  right: "100% 50%",
  bottom: "50% 100%",
  left: "0% 50%",
};

const AXIS: Record<string, "rotateX" | "rotateY"> = {
  top: "rotateX",
  bottom: "rotateX",
  left: "rotateY",
  right: "rotateY",
};

const SIGN: Record<string, number> = {
  top: -1,
  bottom: 1,
  left: 1,
  right: -1,
};

function Flap({ edge, open }: { edge: "top" | "right" | "bottom" | "left"; open: boolean }) {
  const axis = AXIS[edge];
  const angle = open ? SIGN[edge] * 165 : 0;

  return (
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-cream-300 to-cream-200 border border-gold-400/20"
      style={{
        clipPath: CLIP[edge],
        transformOrigin: ORIGIN[edge],
        transformStyle: "preserve-3d",
        zIndex: open ? 5 : 30,
      }}
      animate={{ [axis]: angle }}
      transition={{ duration: 0.7, ease: EASE, delay: open ? 0 : 0 }}
    />
  );
}