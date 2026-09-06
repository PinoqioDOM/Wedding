"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type Stage = "closed" | "opening" | "open";

const EASE = [0.22, 1, 0.36, 1] as const;
const QUOTE = "გეპატიჟებით ჩვენს ქორწილში";

const TEXT_BG_OPACITY = 0.55;

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

export default function WeddingEnvelope({
  guestName,
  onContinue,
}: {
  guestName?: string;
  onContinue?: () => void;
}) {
  const [stage, setStage] = useState<Stage>("closed");
  const typed = useTypewriter(QUOTE, stage === "open");

  const open = () => {
    setStage("opening");
    setTimeout(() => setStage("open"), 1100);
  };

  const flapOpen = stage !== "closed";
  const letterOpen = stage === "open";

  return (
    <div className="min-h-[100vh] flex flex-col items-center font-extrabold justify-center gap-5 px-4">
      <div
        className="relative w-full max-w-[300px] sm:max-w-[380px] md:max-w-[460px] lg:max-w-[520px] aspect-square overflow-hidden"
        style={{ perspective: 1600 }}
      >
        {/* საერთო ფონის სურათი (კონვერტი) — ქრება წერილის გამოსვლის შემდეგ */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${ENVELOPE_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={false}
          animate={{ opacity: letterOpen ? 0 : 1 }}
          transition={{
            duration: 0.6,
            ease: EASE,
            delay: letterOpen ? 0.55 : 0,
          }}
        />

        {/* wedding.jpg — ჩნდება კონვერტის ადგილას, წერილის მიღმა ფონად */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${WEDDING_BG})`,
            backgroundSize: "160% auto",
            backgroundPosition: "center",
          }}
          initial={false}
          animate={{ opacity: letterOpen ? 1 : 0 }}
          transition={{
            duration: 0.6,
            ease: EASE,
            delay: letterOpen ? 0.55 : 0,
          }}
        />

        {/* წერილი — ამოდის კონვერტიდან და იკავებს მთელ სივრცეს */}
        <motion.div
          className="absolute flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4 px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 text-center z-10 rounded-[2px]"
          style={{
            backgroundColor: letterOpen ? "transparent" : `rgba(251,247,239, ${TEXT_BG_OPACITY})`,
            boxShadow: "none",
          }}
          initial={false}
          animate={{
            inset: letterOpen ? "0%" : "9%",
            opacity: letterOpen ? 1 : 0,
            y: letterOpen ? 0 : 24,
            scale: letterOpen ? 1 : 0.92,
          }}
          transition={{
            inset: { duration: 0.7, ease: EASE, delay: letterOpen ? 0.15 : 0 },
            opacity: { duration: 0.5, ease: EASE, delay: letterOpen ? 0.15 : 0 },
            y: { duration: 0.7, ease: EASE, delay: letterOpen ? 0.15 : 0 },
            scale: { duration: 0.7, ease: EASE, delay: letterOpen ? 0.15 : 0 },
          }}
        >
          <p
            className="font-display text-base sm:text-lg md:text-xl text-ink-900 leading-snug"
            style={{ textShadow: "0 1px 8px rgba(255,255,255,0.9), 0 1px 2px rgba(255,255,255,0.95)" }}
          >
            {guestName?.trim() ? guestName.trim() : "თორნიკე & ქრისტინა"}
          </p>

          <p
            className="font-display italic text-lg sm:text-xl md:text-2xl text-ink-900 leading-snug min-h-[3.2em]"
            style={{ textShadow: "0 1px 8px rgba(255,255,255,0.9), 0 1px 2px rgba(255,255,255,0.95)" }}
          >
            {typed}
            <span className="inline-block w-[2px] h-[1em] bg-gold-500/70 ml-0.5 align-middle animate-pulse" />
          </p>

          <motion.div
            initial={false}
            animate={{ opacity: typed === QUOTE ? 1 : 0, y: typed === QUOTE ? 0 : 6 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ textShadow: "0 1px 8px rgba(255,255,255,0.9), 0 1px 2px rgba(255,255,255,0.95)" }}
          >
            <p className="text-sm sm:text-base text-ink-700/90">ვილა სააკაძე</p>
            <p className="mt-2 text-sm sm:text-base text-ink-900">24 სექტემბერი 18:00</p>
            {onContinue ? (
              <button
                type="button"
                onClick={onContinue}
                className="mt-3 inline-block text-xs sm:text-sm text-gold-600 hover:text-ink-900 underline underline-offset-4 decoration-gold-400/50 transition-colors"
              >
                სრული დეტალები →
              </button>
            ) : (
              <Link
                href="/"
                className="mt-3 inline-block text-xs sm:text-sm text-gold-600 hover:text-ink-900 underline underline-offset-4 decoration-gold-400/50 transition-colors"
              >
                სრული დეტალები →
              </Link>
            )}
          </motion.div>
        </motion.div>

        {/* 4 ფლაპი — თანმიმდევრობით, საათის ისრის მიმართულებით (ზედა → მარჯვენა → ქვედა → მარცხენა) */}
        <Flap edge="top" open={flapOpen} delay={0} />
        <Flap edge="right" open={flapOpen} delay={0.15} />
        <Flap edge="bottom" open={flapOpen} delay={0.3} />
        <Flap edge="left" open={flapOpen} delay={0.45} />

        {/* ბეჭედი */}
        {stage === "closed" && (
          <button
            type="button"
            aria-label="დააჭირეთ მოსაწვევის გასახსნელად"
            onClick={open}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 text-cream-50 grid place-items-center font-display text-sm sm:text-base ring-1 ring-gold-300/60 shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-transform hover:scale-105 z-40"
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

const ENVELOPE_BG = "/cover.jpg";
const WEDDING_BG = "/wedding.jpg";

function Flap({
  edge,
  open,
  delay,
}: {
  edge: "top" | "right" | "bottom" | "left";
  open: boolean;
  delay: number;
}) {
  const axis = AXIS[edge];
  const angle = open ? SIGN[edge] * 165 : 0;

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(rgba(15,12,8,0.35), rgba(15,12,8,0.35)), url(${ENVELOPE_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "0;1;2;3;",
        clipPath: CLIP[edge],
        transformOrigin: ORIGIN[edge],
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        zIndex: open ? 5 : 30,
        boxShadow: "inset 0 0 0 1px rgba(201,163,90,0.55)",
      }}
      animate={{ [axis]: angle }}
      transition={{ duration: 0.6, ease: EASE, delay: open ? delay : 0 }}
    />
  );
}