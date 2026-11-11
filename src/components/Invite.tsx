"use client";

import { motion } from "framer-motion";
import { CalendarPlus, Download } from "lucide-react";
import { longDate, wedding } from "@/data/wedding";
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar";

const fade = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" as const },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

export function Invite() {
  const { couple, card, hosts, venue, timingText, hijri } = wedding;

  return (
    <section className="relative z-10 px-5 pb-2 pt-14 sm:pt-20">
      <div className="mx-auto max-w-2xl">
        <motion.div {...fade} className="glass-panel rounded-[2rem] px-6 py-10 sm:px-12 sm:py-14">
          <p
            className="text-center font-arabic text-xl leading-relaxed text-soft sm:text-2xl"
            dir="rtl"
          >
            {card.bismillah}
          </p>
          <p className="mt-2 text-center text-[11px] uppercase tracking-[0.22em] text-ivory/45">
            {card.bismillahLabel}
          </p>

          <div className="gold-line mt-8" />

          <div className="mt-8 space-y-1 text-center font-display text-base text-ivory/75 sm:text-lg">
            {card.invite.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <h2 className="mt-8 text-center font-script text-5xl leading-[1.45] sm:text-6xl">
            <span className="name-glow">{couple.shortGroom}</span>
          </h2>
          <p className="mt-2 text-center text-sm text-soft/70">{couple.groomLine}</p>

          <p className="my-5 text-center font-display text-2xl text-champagne">&amp;</p>

          <h2 className="text-center font-script text-5xl leading-[1.45] sm:text-6xl">
            <span className="name-glow">{couple.shortBride}</span>
          </h2>
          <p className="mt-2 text-center text-sm text-soft/70">{couple.brideLine}</p>

          <div className="glass-soft mx-auto mt-10 grid max-w-sm gap-4 rounded-2xl px-5 py-6 text-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-soft/60">When</p>
              <p className="mt-1 font-display text-xl text-ivory">{longDate}</p>
              <p className="text-sm text-ivory/60">{timingText}</p>
              {hijri.line1 ? (
                <p className="mt-1 text-xs text-soft/50">{hijri.line1}</p>
              ) : null}
            </div>
            <div className="gold-line" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-soft/60">Where</p>
              <p className="mt-1 font-display text-xl text-ivory">{venue.name}</p>
              <p className="text-sm text-ivory/60">{venue.addressLines.join(", ")}</p>
            </div>
          </div>

          <p className="mt-8 text-center font-display text-lg italic text-champagne">
            {card.inshaAllah}
          </p>
          <p className="mt-2 text-center text-sm text-ivory/55">{card.footer}</p>

          <p className="mt-8 text-center text-[11px] uppercase tracking-[0.22em] text-soft/55">
            Hosted by
          </p>
          <p className="mt-2 text-center font-display text-lg text-ivory">{hosts.names}</p>
          <p className="text-center text-sm text-ivory/55">{hosts.address}</p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={googleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold w-full sm:w-auto"
            >
              <CalendarPlus className="h-4 w-4" />
              Add to Calendar
            </a>
            <button type="button" onClick={() => downloadIcs()} className="btn-ghost w-full sm:w-auto">
              <Download className="h-4 w-4" />
              Save to Phone Calendar
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

