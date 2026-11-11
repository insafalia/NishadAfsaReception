"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { longDate, wedding } from "@/data/wedding";

type Props = {
  guest: string;
  onStart: () => void;
  onDone: () => void;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function Cover({ guest, onStart, onDone }: Props) {
  const { couple, cover, venue, timingText } = wedding;
  const [phase, setPhase] = useState<"idle" | "opening">("idle");
  const [reduced, setReduced] = useState(false);
  const opening = phase === "opening";

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const start = () => {
    if (phase !== "idle") return;
    if (reduced) {
      onStart();
      onDone();
      return;
    }
    setPhase("opening");
    onStart(); // mount invitation behind gates immediately — no blank gap
    window.setTimeout(onDone, 2200);
  };

  return (
    <section className="fixed inset-0 z-50 overflow-hidden bg-transparent">
      {/* Soft ambient only — keep center clear so the page shows through opening doors */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(6,40,32,0.55), transparent 55%), radial-gradient(ellipse 70% 40% at 50% 100%, rgba(6,40,32,0.65), transparent 50%)",
        }}
        animate={opening ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 1.1, ease }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(226,201,138,0.28) 0%, rgba(20,145,155,0.15) 35%, transparent 70%)",
        }}
        initial={{ opacity: 0.3, scale: 0.8 }}
        animate={opening ? { opacity: 0.7, scale: 1.2 } : { opacity: 0.35, scale: 0.9 }}
        transition={{ duration: 1.4, ease }}
      />

      {/* Intro copy */}
      <motion.div
        className="absolute inset-x-0 top-[max(1.5rem,env(safe-area-inset-top))] z-20 px-6 text-center"
        initial={{ opacity: 0, y: -12 }}
        animate={opening ? { opacity: 0, y: -24 } : { opacity: 1, y: 0 }}
        transition={{ duration: opening ? 0.4 : 0.8, ease }}
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-soft/90">
          {cover.eyebrow}
        </p>
        <p className="mt-3 font-arabic text-lg text-soft/90 sm:text-xl" dir="rtl">
          {couple.groomArabic} · {couple.brideArabic}
        </p>
        <h1 className="mt-2 font-script text-[2.6rem] leading-[1.05] text-ivory sm:text-5xl">
          {couple.shortGroom}
          <span className="mx-2 font-display text-xl font-light text-champagne sm:text-2xl">
            &amp;
          </span>
          {couple.shortBride}
        </h1>
        <p className="mt-2 font-display text-sm text-soft/80 sm:text-base">{longDate}</p>
      </motion.div>

      {/* Palace gates */}
      <div className="absolute inset-0 z-10 flex items-stretch justify-center [perspective:1400px]">
        <motion.div
          className="relative h-full w-1/2 origin-left overflow-hidden"
          style={{ transformStyle: "preserve-3d" }}
          animate={opening ? { rotateY: -108, x: "-10%" } : { rotateY: 0, x: 0 }}
          transition={{ duration: 1.7, delay: 0.2, ease }}
        >
          <div
            className="absolute inset-0 border-r border-champagne/25"
            style={{
              background:
                "linear-gradient(110deg, #062820 0%, #0F5C4C 40%, #0A3D34 70%, #08352D 100%)",
              boxShadow: "inset -18px 0 40px rgba(0,0,0,0.35)",
            }}
          />
          <div className="absolute inset-y-[12%] right-[12%] left-[18%] rounded-l-[2.5rem] border border-champagne/25 bg-gradient-to-br from-white/[0.07] to-transparent" />
          <div className="absolute inset-y-[18%] right-[20%] left-[26%] rounded-l-[2rem] border border-dashed border-soft/20" />
          <div className="absolute right-[18%] top-[22%] h-28 w-20 rounded-t-full border-2 border-champagne/35 bg-teal/10" />
          <div className="absolute bottom-[18%] right-[22%] left-[28%] h-px bg-gradient-to-r from-transparent via-champagne/50 to-transparent" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(1.2px 1.2px at 30% 40%, rgba(226,201,138,0.5), transparent), radial-gradient(1px 1px at 60% 70%, rgba(255,251,245,0.25), transparent)",
              backgroundSize: "120px 120px, 160px 160px",
            }}
          />
        </motion.div>

        <motion.div
          className="relative h-full w-1/2 origin-right overflow-hidden"
          style={{ transformStyle: "preserve-3d" }}
          animate={opening ? { rotateY: 108, x: "10%" } : { rotateY: 0, x: 0 }}
          transition={{ duration: 1.7, delay: 0.2, ease }}
        >
          <div
            className="absolute inset-0 border-l border-champagne/25"
            style={{
              background:
                "linear-gradient(250deg, #062820 0%, #0F5C4C 40%, #0A3D34 70%, #08352D 100%)",
              boxShadow: "inset 18px 0 40px rgba(0,0,0,0.35)",
            }}
          />
          <div className="absolute inset-y-[12%] left-[12%] right-[18%] rounded-r-[2.5rem] border border-champagne/25 bg-gradient-to-bl from-white/[0.07] to-transparent" />
          <div className="absolute inset-y-[18%] left-[20%] right-[26%] rounded-r-[2rem] border border-dashed border-soft/20" />
          <div className="absolute left-[18%] top-[22%] h-28 w-20 rounded-t-full border-2 border-champagne/35 bg-teal/10" />
          <div className="absolute bottom-[18%] left-[22%] right-[28%] h-px bg-gradient-to-r from-transparent via-champagne/50 to-transparent" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(1.2px 1.2px at 40% 35%, rgba(226,201,138,0.5), transparent), radial-gradient(1px 1px at 70% 65%, rgba(255,251,245,0.25), transparent)",
              backgroundSize: "120px 120px, 160px 160px",
            }}
          />
        </motion.div>
      </div>

      {/* Seal */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6">
        <motion.button
          type="button"
          onClick={start}
          disabled={opening}
          aria-label={cover.cta}
          className="group relative flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
          animate={
            opening
              ? { scale: 0.5, opacity: 0 }
              : { scale: 1, opacity: 1, y: [0, -6, 0] }
          }
          transition={
            opening
              ? { duration: 0.4, ease }
              : { y: { duration: 3.6, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.6 } }
          }
        >
          <span
            className="relative grid h-[96px] w-[96px] place-items-center rounded-full transition group-hover:scale-105"
            style={{
              background:
                "radial-gradient(circle at 35% 28%, #E2C98A 0%, #C4A35A 45%, #8A6E2F 100%)",
              animation: opening ? undefined : "seal-pulse 2.4s ease-out infinite",
            }}
          >
            <span className="absolute inset-[5px] rounded-full border border-[#062820]/35" />
            <span className="absolute inset-[10px] rounded-full border border-dashed border-[#062820]/25" />
            <span className="font-display text-xl font-semibold tracking-widest text-forest-deep">
              {couple.monogram[0]}
              <span className="mx-0.5 text-sm opacity-70">·</span>
              {couple.monogram[1]}
            </span>
          </span>
        </motion.button>

        <motion.div
          className="mt-6 text-center"
          animate={opening ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm text-ivory/65">
            {cover.greeting} <span className="font-medium text-soft">{guest}</span>
          </p>
          <p className="mt-1 text-xs text-ivory/45">
            {timingText} · {venue.name}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
