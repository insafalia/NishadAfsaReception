"use client";
import { useEffect, useState } from "react";

export type CountdownState = "loading" | "future" | "today" | "past";

export function useCountdown(target: Date, dayEnd: Date) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, state: "loading" as CountdownState };
  }

  const diff = Math.max(0, target.getTime() - now);
  const t = Math.floor(diff / 1000);
  const state: CountdownState =
    diff > 0
      ? sameVenueDay(now, target)
        ? "today"
        : "future"
      : now <= dayEnd.getTime()
        ? "today"
        : "past";

  return {
    days: Math.floor(t / 86400),
    hours: Math.floor((t % 86400) / 3600),
    minutes: Math.floor((t % 3600) / 60),
    seconds: t % 60,
    state,
  };
}

const IST = 5.5 * 3600e3;
const sameVenueDay = (a: number, b: Date) =>
  Math.floor((a + IST) / 86400e3) === Math.floor((b.getTime() + IST) / 86400e3);
