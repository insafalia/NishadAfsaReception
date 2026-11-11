"use client";

import { useEffect, useRef } from "react";

const isInteractive = (el: EventTarget | null) => {
  if (!(el instanceof Element)) return false;
  return Boolean(
    el.closest(
      "a, button, input, select, textarea, label, summary, [role='button'], [contenteditable='true'], canvas, .invite-card-frame",
    ),
  );
};

const isInScratchOrBelow = (el: EventTarget | null) => {
  if (!(el instanceof Element)) return false;
  return Boolean(el.closest("[data-auto-scroll-stop], #venue, #rsvp"));
};

/**
 * Slow auto-scroll after open.
 * - Clicks on empty areas of the top invite (before scratch) do NOT stop it
 * - Clicks on real controls, scratch card, or sections below DO stop it
 * - Wheel / touch-drag / keys stop it permanently
 */
export function useAutoScroll(enabled: boolean, opts?: { delayMs?: number; pxPerFrame?: number }) {
  const delayMs = opts?.delayMs ?? 900;
  const pxPerFrame = opts?.pxPerFrame ?? 0.55;
  const stopped = useRef(false);
  const raf = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    stopped.current = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const stop = () => {
      if (stopped.current) return;
      stopped.current = true;
      cancelAnimationFrame(raf.current);
    };

    const onPointer = (e: Event) => {
      const t = e.target;
      // Empty taps on the top invite keep auto-scroll going
      if (!isInteractive(t) && !isInScratchOrBelow(t)) return;
      stop();
    };

    const onForceStop = () => stop();

    // Touch-drag = user scrolling — stop. Plain tap on empty top = keep going.
    let touchY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? null;
      onPointer(e);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY == null) return;
      const y = e.touches[0]?.clientY ?? touchY;
      if (Math.abs(y - touchY) > 8) stop();
    };

    window.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("wheel", onForceStop, { passive: true });
    window.addEventListener("keydown", onForceStop);

    const tick = () => {
      if (stopped.current) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY >= max - 2) {
        stop();
        return;
      }
      window.scrollBy(0, pxPerFrame);
      raf.current = requestAnimationFrame(tick);
    };

    const timer = window.setTimeout(() => {
      if (stopped.current) return;
      raf.current = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf.current);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("wheel", onForceStop);
      window.removeEventListener("keydown", onForceStop);
    };
  }, [enabled, delayMs, pxPerFrame]);
}
