"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Status = "idle" | "sending" | "sent";

type RsvpData = {
  name: string;
  attending: "yes" | "no";
  guests: number;
  message: string;
};

type Props = {
  deadline?: string;
  onSubmit?: (data: RsvpData) => Promise<void> | void;
};

const GOLD = "#b08d57";
const INK = "#3b2f2a";
const SAGE = "#7d8f69";

// ველები: თეთრი ფონი, შესამჩნევი ჩარჩო, ჩრდილი და ოქროსფერი focus-რგოლი
const fieldCls =
  "w-full rounded-xl border-2 bg-white px-4 py-3.5 text-base shadow-sm outline-none transition " +
  "placeholder:opacity-50 hover:border-[#b08d57] focus:border-[#b08d57] focus:ring-4 focus:ring-[#b08d57]/20";
const fieldBorder = `${GOLD}99`;
const labelCls = "mb-2 block text-xs uppercase tracking-[0.2em] font-semibold opacity-80";

function Ornament() {
  return (
    <div className="my-5 flex items-center justify-center gap-3" aria-hidden>
      <span className="h-px w-16" style={{ background: GOLD }} />
      <svg width="22" height="22" viewBox="0 0 24 24" fill={GOLD}>
        <path d="M12 21s-7.5-4.6-9.5-9.2C1 8.2 3.2 5 6.4 5c2 0 3.6 1.1 5.6 3.2C14 6.1 15.6 5 17.6 5c3.2 0 5.4 3.2 3.900 6.800C19.5 16.400 12 21 12 21z" />
      </svg>
      <span className="h-px w-16" style={{ background: GOLD }} />
    </div>
  );
}

export default function Attendance({
  deadline = "11 სექტემბრამდე",
  onSubmit,
}: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<RsvpData>({
    name: "",
    attending: "yes",
    guests: 1,
    message: "",
  });

  const handle = async (e: FormEvent) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("sending");
    try {
      await onSubmit?.(data);
      if (!onSubmit) await new Promise((r) => setTimeout(r, 1200));
      setStatus("sent");
    } catch {
      setStatus("idle");
    }
  };

  return (
    <section
      className="font-serif"
      style={{ background: "#faf6f0", color: INK }}
    >
      <div className="mx-auto w-full max-w-lg px-6 py-20">
        <div className="text-center">
          <h2 className="mt-4 text-4xl font-light italic">
            დაადასტურეთ დასწრება
          </h2>
          <Ornament />
          <p className="text-sm opacity-70">
            გთხოვთ, დაგვიდასტუროთ არაუგვიანეს {deadline}
          </p>
        </div>

        <form onSubmit={handle} className="mt-12 space-y-8">
          <div>
            <label className={labelCls}>სახელი, გვარი</label>
            <input
              required
              className={fieldCls}
              style={{ borderColor: fieldBorder }}
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>

          <div>
            <label className={labelCls}>დაესწრები?</label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {(
                [
                  ["yes", "დიახ, დავესწრები"],
                  ["no", "სამწუხაროდ, ვერ"],
                ] as const
              ).map(([value, label]) => {
                const active = data.attending === value;
                return (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setData({ ...data, attending: value })}
                    className="rounded-full border-2 px-4 py-3 text-sm shadow-sm transition"
                    style={{
                      borderColor: GOLD,
                      background: active ? GOLD : "#fff",
                      color: active ? "#fff" : INK,
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelCls}>სტუმრების რაოდენობა</label>
            <input
              type="number"
              min={1}
              max={10}
              className={fieldCls}
              style={{ borderColor: fieldBorder }}
              value={data.guests}
              onChange={(e) =>
                setData({
                  ...data,
                  guests: Math.max(1, Number(e.target.value)),
                })
              }
            />
          </div>

          <div>
            <label className={labelCls}>შეტყობინება წყვილისთვის</label>
            <textarea
              rows={5}
              placeholder="დაწერეთ რამდენიმე თბილი სიტყვა..."
              className={`${fieldCls} resize-none`}
              style={{ borderColor: fieldBorder }}
              value={data.message}
              onChange={(e) => setData({ ...data, message: e.target.value })}
            />
          </div>

          <motion.button
            type="submit"
            disabled={status !== "idle"}
            whileHover={status === "idle" ? { scale: 1.02 } : undefined}
            whileTap={status === "idle" ? { scale: 0.97 } : undefined}
            animate={{ backgroundColor: status === "sent" ? SAGE : GOLD }}
            className="flex h-14 w-full items-center justify-center overflow-hidden rounded-full text-sm uppercase tracking-[0.2em] text-white shadow-lg"
            style={{ boxShadow: `0 10px 30px -10px ${GOLD}` }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {status === "idle" && (
                <motion.span
                  key="idle"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                >
                  გაგზავნა
                </motion.span>
              )}
              {status === "sending" && (
                <motion.span
                  key="sending"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 1.25, 1], opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 0.9 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                    <path d="M12 21s-7.5-4.6-9.5-9.2C1 8.2 3.2 5 6.4 5c2 0 3.6 1.1 5.6 3.2C14 6.1 15.6 5 17.6 5c3.2 0 5.4 3.2 3.900 6.800C19.5 16.400 12 21 12 21z" />
                  </svg>
                </motion.span>
              )}
              {status === "sent" && (
                <motion.span
                  key="sent"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <motion.path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    />
                  </svg>
                  გაიგზავნა
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </form>
      </div>
    </section>
  );
}