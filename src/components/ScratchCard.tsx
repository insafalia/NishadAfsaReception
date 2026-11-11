"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Expand, X } from "lucide-react";
import { wedding as w } from "@/data/wedding";

const BRUSH = 34;
const THRESHOLD = 0.28;
const SPARKLE_COLORS = ["#E2C98A", "#C4A35A", "#F0E0B0", "#1A6B55", "#8FBC8F", "#FFFBF5"];

type Bit = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  spin: number;
  color: string;
};

export default function ScratchCard() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const fx = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const done = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const moves = useRef(0);
  const bits = useRef<Bit[]>([]);
  const frame = useRef(0);
  const [revealed, setRevealed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!zoomed) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [zoomed]);

  const paint = useCallback(() => {
    const c = canvas.current;
    const box = wrap.current;
    if (!c || !box || done.current) return;
    const { width, height } = box.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.round(width * dpr);
    c.height = Math.round(height * dpr);
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, "#012116");
    g.addColorStop(0.35, "#0A4A38");
    g.addColorStop(0.65, "#C4A35A");
    g.addColorStop(1, "#012F20");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    // Foil shimmer stripes
    for (let i = -height; i < width + height; i += 18) {
      ctx.strokeStyle = "rgba(255,251,245,0.07)";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();
    }

    // Speckle texture
    for (let i = 0; i < 90; i++) {
      ctx.fillStyle = i % 3 === 0 ? "rgba(226,201,138,0.35)" : "rgba(255,251,245,0.12)";
      ctx.beginPath();
      ctx.arc((i * 53) % width, (i * 37) % height, 1.1 + (i % 3) * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Inner border
    ctx.strokeStyle = "rgba(226,201,138,0.45)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(16, 16, width - 32, height - 32);
    ctx.strokeStyle = "rgba(255,251,245,0.12)";
    ctx.strokeRect(22, 22, width - 44, height - 44);

    // Monogram seal
    const cx = width / 2;
    const cy = height / 2 - 28;
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(6,40,32,0.35)";
    ctx.fill();
    ctx.strokeStyle = "rgba(226,201,138,0.7)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#E2C98A";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "600 15px Georgia, serif";
    ctx.fillText(`${w.couple.monogram[0]} · ${w.couple.monogram[1]}`, cx, cy);

    ctx.fillStyle = "#FFFBF5";
    ctx.font = "600 12px Outfit, system-ui, sans-serif";
    ctx.fillText("A SEALED CARD", cx, height / 2 + 18);
    ctx.fillStyle = "#E2C98A";
    ctx.font = "italic 26px Georgia, serif";
    ctx.fillText(w.scratch.cover, cx, height / 2 + 52);
    ctx.fillStyle = "rgba(255,251,245,0.75)";
    ctx.font = "13px Outfit, system-ui, sans-serif";
    ctx.fillText(w.scratch.hint, cx, height / 2 + 82);
  }, []);

  const tick = useCallback(() => {
    const c = fx.current;
    const box = wrap.current;
    if (!c || !box) return;
    const { width, height } = box.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (c.width !== Math.round(width * dpr)) {
      c.width = Math.round(width * dpr);
      c.height = Math.round(height * dpr);
    }
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    bits.current = bits.current.filter((b) => b.life < b.max);
    for (const b of bits.current) {
      b.life++;
      b.vy += 0.045;
      b.vx *= 0.99;
      b.x += b.vx;
      b.y += b.vy;
      const k = 1 - b.life / b.max;
      ctx.save();
      ctx.globalAlpha = Math.max(0, k);
      ctx.fillStyle = b.color;
      ctx.translate(b.x, b.y);
      ctx.rotate(b.life * b.spin);
      // Petal-like oval
      ctx.beginPath();
      ctx.ellipse(0, 0, b.size * 0.55, b.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    frame.current = bits.current.length ? requestAnimationFrame(tick) : 0;
  }, []);

  const spread = (p: { x: number; y: number }, n: number) => {
    if (reduced) return;
    for (let i = 0; i < n && bits.current.length < 100; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 0.7 + Math.random() * 2.2;
      bits.current.push({
        x: p.x,
        y: p.y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 1.1,
        life: 0,
        max: 24 + Math.random() * 20,
        size: 3.5 + Math.random() * 5,
        spin: (Math.random() - 0.5) * 0.22,
        color: SPARKLE_COLORS[(Math.random() * SPARKLE_COLORS.length) | 0],
      });
    }
    if (!frame.current) frame.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    paint();
    const ro = new ResizeObserver(paint);
    if (wrap.current) ro.observe(wrap.current);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [paint]);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    setRevealed(true);
    setProgress(1);
  };

  const check = () => {
    const c = canvas.current;
    if (!c || done.current) return;
    const data = c.getContext("2d")?.getImageData(0, 0, c.width, c.height).data;
    if (!data) return;
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 64) {
      total++;
      if (data[i] < 128) clear++;
    }
    const ratio = total ? clear / total : 0;
    setProgress(Math.min(1, ratio / THRESHOLD));
    if (ratio > THRESHOLD) finish();
  };

  const scratch = (e: React.PointerEvent) => {
    if (!drawing.current || done.current || !canvas.current) return;
    const r = canvas.current.getBoundingClientRect();
    const p = { x: e.clientX - r.left, y: e.clientY - r.top };
    const ctx = canvas.current.getContext("2d");
    if (!ctx) return;
    const l = last.current ?? p;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = BRUSH;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(l.x, l.y);
    ctx.lineTo(p.x + 0.01, p.y);
    ctx.stroke();
    last.current = p;
    spread(p, 2);
    if (++moves.current % 6 === 0) check();
  };

  return (
    <section
      data-auto-scroll-stop
      aria-label="Scratch to reveal the invitation card"
      className="relative z-10 px-5 py-10 sm:py-14"
    >
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.38em] text-soft/80">
        {w.scratch.eyebrow}
      </p>

      <div
        ref={wrap}
        className="invite-card-frame relative mx-auto mt-5 aspect-[4/3] w-full max-w-[440px] overflow-hidden rounded-[1.75rem]"
      >
        <div className="absolute inset-0 p-2.5 sm:p-3" aria-hidden={!revealed}>
          {revealed ? (
            <button
              type="button"
              onClick={() => setZoomed(true)}
              className="invite-card-shine group relative h-full w-full overflow-hidden rounded-[1.25rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
              aria-label="Open invitation full size"
            >
              <Image
                src={w.printedCard}
                alt="Wedding reception invitation card"
                fill
                sizes="(max-width: 480px) 100vw, 440px"
                className="invite-card-img object-cover transition duration-300 group-hover:scale-[1.02]"
                priority
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/55 to-transparent py-3 text-xs font-semibold tracking-wide text-ivory">
                <Expand className="h-3.5 w-3.5" />
                Tap to enlarge
              </span>
            </button>
          ) : (
            <div className="invite-card-shine relative h-full overflow-hidden rounded-[1.25rem]">
              <Image
                src={w.printedCard}
                alt=""
                fill
                sizes="(max-width: 480px) 100vw, 440px"
                className="invite-card-img object-cover"
                priority
              />
            </div>
          )}
        </div>

        <canvas
          ref={canvas}
          aria-label="Scratch the sealed foil to reveal the invitation"
          className={`absolute inset-0 h-full w-full touch-none transition-opacity duration-700 ${
            revealed ? "pointer-events-none opacity-0" : "cursor-crosshair opacity-100"
          }`}
          style={{ touchAction: "none" }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            drawing.current = true;
            last.current = null;
            scratch(e);
            const r = e.currentTarget.getBoundingClientRect();
            spread({ x: e.clientX - r.left, y: e.clientY - r.top }, 10);
          }}
          onPointerMove={scratch}
          onPointerUp={() => {
            drawing.current = false;
            last.current = null;
            check();
          }}
          onPointerCancel={() => {
            drawing.current = false;
            last.current = null;
          }}
        />
        <canvas ref={fx} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />

        <AnimatePresence>
          {revealed && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: 16 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute h-2.5 w-2.5 rounded-full"
                  style={{
                    left: "50%",
                    top: "48%",
                    background:
                      i % 2 === 0
                        ? "radial-gradient(circle, #E2C98A, transparent)"
                        : "radial-gradient(circle, #1A6B55, transparent)",
                  }}
                  initial={{ x: 0, y: 0, scale: 0.6, opacity: 1 }}
                  animate={{
                    x: Math.cos((i / 16) * Math.PI * 2) * (80 + (i % 4) * 22),
                    y: Math.sin((i / 16) * Math.PI * 2) * (60 + (i % 3) * 20),
                    scale: 0,
                    opacity: 0,
                  }}
                  transition={{ duration: 1.05, ease: "easeOut" }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!revealed && (
        <div
          className="mx-auto mt-5 h-1.5 w-44 overflow-hidden rounded-full bg-white/15"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          aria-label="Scratch progress"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-champagne to-soft transition-[width] duration-200"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}

      {reduced && !revealed && (
        <button type="button" className="btn-ghost mx-auto mt-4 block" onClick={finish}>
          Reveal invitation
        </button>
      )}

      {revealed && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 text-center font-display text-lg text-soft"
        >
          Your invitation is ready — tap to read
        </motion.p>
      )}

      <AnimatePresence>
        {zoomed && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[#041f19]/92 p-3 backdrop-blur-md sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Invitation full view"
            onClick={() => setZoomed(false)}
          >
            <button
              type="button"
              onClick={() => setZoomed(false)}
              className="absolute right-4 top-4 z-10 inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full border border-soft/30 bg-forest/80 px-4 text-sm font-semibold text-soft shadow-lg backdrop-blur-sm transition hover:bg-forest sm:right-6 sm:top-6"
              aria-label="Close invitation"
            >
              <X className="h-5 w-5" />
              Close
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28 }}
              className="relative max-h-[min(92dvh,900px)] w-full max-w-5xl overflow-auto rounded-2xl bg-forest-deep shadow-[0_30px_80px_rgba(0,0,0,0.55)] ring-1 ring-champagne/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={w.printedCard}
                alt="Wedding reception invitation card — full size"
                className="mx-auto h-auto w-full max-w-none object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
