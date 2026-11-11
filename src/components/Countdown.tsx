"use client";

import { motion } from "framer-motion";
import { eventEnd, eventStart, wedding } from "@/data/wedding";
import { useCountdown } from "@/hooks/useCountdown";

export function Countdown() {
  const { countdown } = wedding;
  const c = useCountdown(eventStart(), eventEnd());

  const units = [
    { label: "Days", value: c.days },
    { label: "Hours", value: c.hours },
    { label: "Mins", value: c.minutes },
    { label: "Secs", value: c.seconds },
  ];

  return (
    <section className="relative z-10 px-5 py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55 }}
        className="glass-panel mx-auto max-w-2xl rounded-[2rem] px-5 py-10 text-center sm:px-10"
      >
        <p className="text-[11px] uppercase tracking-[0.3em] text-soft/70">{countdown.eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl text-ivory sm:text-4xl">{countdown.title}</h2>

        {c.state === "today" ? (
          <p className="mt-8 font-display text-xl text-soft">{countdown.today}</p>
        ) : c.state === "past" ? (
          <p className="mt-8 font-display text-xl text-soft">{countdown.past}</p>
        ) : (
          <div className="mt-10 grid grid-cols-4 gap-2.5 sm:gap-4">
            {units.map((u, i) => (
              <motion.div
                key={u.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass-soft rounded-2xl px-1.5 py-5"
              >
                <p className="font-display text-3xl tabular-nums text-champagne sm:text-4xl">
                  {String(u.value).padStart(2, "0")}
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-ivory/50">
                  {u.label}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
