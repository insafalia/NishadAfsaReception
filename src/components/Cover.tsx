"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { wedding } from "@/data/wedding";

type Props = {
  guest: string;
  onStart: () => void;
  onDone: () => void;
};

const ease = [0.22, 1, 0.36, 1] as const;

const ORBS = [
  { className: "left-[-10%] top-[18%] h-56 w-56 bg-champagne/25", dur: 9, x: [0, 30, 0], y: [0, 22, 0] },
  { className: "right-[-8%] top-[28%] h-64 w-64 bg-teal/30", dur: 11, x: [0, -24, 0], y: [0, 18, 0] },
  { className: "left-[18%] bottom-[12%] h-48 w-48 bg-soft/20", dur: 10, x: [0, 18, 0], y: [0, -20, 0] },
  { className: "right-[12%] bottom-[20%] h-52 w-52 bg-teal/20", dur: 12, x: [0, -16, 0], y: [0, -14, 0] },
];

const SPARKS = [
  { left: "18%", top: "22%", delay: 0 },
  { left: "78%", top: "18%", delay: 0.6 },
  { left: "12%", top: "58%", delay: 1.2 },
  { left: "86%", top: "52%", delay: 0.3 },
  { left: "28%", top: "78%", delay: 1.8 },
  { left: "70%", top: "72%", delay: 1.1 },
  { left: "48%", top: "14%", delay: 0.9 },
  { left: "55%", top: "84%", delay: 1.5 },
];

export function Cover({ guest, onStart, onDone }: Props) {
  const { couple, cover } = wedding;
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
    onStart();
    window.setTimeout(onDone, 2200);
  };

  return (
    <section className="fixed inset-0 z-50 overflow-hidden bg-transparent">
      {/* Base vignette */}
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

      {/* Drifting gradient light orbs */}
      {!reduced &&
        ORBS.map((orb, i) => (
          <motion.div
            key={i}
            aria-hidden
            className={`pointer-events-none absolute rounded-full blur-3xl ${orb.className}`}
            animate={
              opening
                ? { opacity: 0, scale: 1.4 }
                : { opacity: [0.35, 0.7, 0.35], x: orb.x, y: orb.y, scale: [1, 1.12, 1] }
            }
            transition={
              opening
                ? { duration: 0.8 }
                : { duration: orb.dur, repeat: Infinity, ease: "easeInOut" }
            }
          />
        ))}

      {/* Sweeping champagne light beam */}
      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[45%] skew-x-[-18deg]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(226,201,138,0.08) 40%, rgba(255,251,245,0.14) 50%, rgba(226,201,138,0.08) 60%, transparent 100%)",
          }}
          animate={
            opening
              ? { opacity: 0 }
              : { x: ["-60%", "160%"], opacity: [0, 0.85, 0.85, 0] }
          }
          transition={
            opening
              ? { duration: 0.4 }
              : { duration: 5.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.8 }
          }
        />
      )}

      {/* Soft teal cross-sweep */}
      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[30%] skew-x-[12deg]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(20,145,155,0.12), transparent)",
          }}
          animate={
            opening
              ? { opacity: 0 }
              : { x: ["120%", "-80%"], opacity: [0, 0.7, 0] }
          }
          transition={
            opening
              ? { duration: 0.4 }
              : { duration: 7, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.4, delay: 2 }
          }
        />
      )}

      {/* Center bloom behind seal */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(226,201,138,0.3) 0%, rgba(20,145,155,0.16) 35%, transparent 70%)",
        }}
        animate={
          opening
            ? { opacity: 0.75, scale: 1.25 }
            : reduced
              ? { opacity: 0.4, scale: 0.95 }
              : { opacity: [0.28, 0.55, 0.28], scale: [0.88, 1.05, 0.88] }
        }
        transition={
          opening
            ? { duration: 1.2, ease }
            : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* Twinkling sparkles */}
      {!reduced &&
        SPARKS.map((s, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-soft"
            style={{
              left: s.left,
              top: s.top,
              boxShadow: "0 0 10px 2px rgba(226,201,138,0.55)",
            }}
            animate={
              opening
                ? { opacity: 0, scale: 0 }
                : { opacity: [0, 1, 0], scale: [0.4, 1.3, 0.4] }
            }
            transition={
              opening
                ? { duration: 0.3 }
                : { duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: s.delay }
            }
          />
        ))}

      {/* Intro copy */}
      <motion.div
        className="absolute inset-x-0 top-[max(1.5rem,env(safe-area-inset-top))] z-20 px-6 text-center"
        initial={{ opacity: 0, y: -12 }}
        animate={opening ? { opacity: 0, y: -24 } : { opacity: 1, y: 0 }}
        transition={{ duration: opening ? 0.4 : 0.9, ease }}
      >
        <motion.p
          className="text-[11px] font-medium uppercase tracking-[0.38em] text-soft/90"
          animate={reduced || opening ? undefined : { opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {cover.eyebrow}
        </motion.p>
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
        <motion.div
          className="gold-line mt-5"
          animate={reduced || opening ? undefined : { opacity: [0.4, 1, 0.4], scaleX: [0.85, 1, 0.85] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />
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
          {!reduced && (
            <motion.div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(120deg, transparent 30%, rgba(226,201,138,0.12) 48%, transparent 62%)",
              }}
              animate={opening ? { opacity: 0 } : { x: ["-40%", "60%"], opacity: [0.2, 0.55, 0.2] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <div className="absolute inset-y-[12%] right-[12%] left-[18%] rounded-l-[2.5rem] border border-champagne/25 bg-gradient-to-br from-white/[0.07] to-transparent" />
          <div className="absolute inset-y-[18%] right-[20%] left-[26%] rounded-l-[2rem] border border-dashed border-soft/20" />
          <div className="absolute right-[18%] top-[22%] h-28 w-20 rounded-t-full border-2 border-champagne/35 bg-teal/10" />
          <div className="absolute bottom-[18%] right-[22%] left-[28%] h-px bg-gradient-to-r from-transparent via-champagne/50 to-transparent" />
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
          {!reduced && (
            <motion.div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(240deg, transparent 30%, rgba(20,145,155,0.14) 50%, transparent 65%)",
              }}
              animate={opening ? { opacity: 0 } : { x: ["40%", "-50%"], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          )}
          <div className="absolute inset-y-[12%] left-[12%] right-[18%] rounded-r-[2.5rem] border border-champagne/25 bg-gradient-to-bl from-white/[0.07] to-transparent" />
          <div className="absolute inset-y-[18%] left-[20%] right-[26%] rounded-r-[2rem] border border-dashed border-soft/20" />
          <div className="absolute left-[18%] top-[22%] h-28 w-20 rounded-t-full border-2 border-champagne/35 bg-teal/10" />
          <div className="absolute bottom-[18%] left-[22%] right-[28%] h-px bg-gradient-to-r from-transparent via-champagne/50 to-transparent" />
        </motion.div>
      </div>

      {/* Seal */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6">
        {/* Soft rays behind seal */}
        {!reduced && !opening && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 h-32 w-[2px] origin-bottom -translate-x-1/2 -translate-y-full rounded-full bg-gradient-to-t from-champagne/40 to-transparent"
                style={{ transform: `translateX(-50%) translateY(-100%) rotate(${i * 45}deg)` }}
              />
            ))}
          </motion.div>
        )}

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
              animation: opening || reduced ? undefined : "seal-pulse 2.4s ease-out infinite",
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

        <motion.p
          className="mt-6 text-center text-sm text-ivory/65"
          animate={opening ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {cover.greeting} <span className="font-medium text-soft">{guest}</span>
        </motion.p>
      </div>
    </section>
  );
}
