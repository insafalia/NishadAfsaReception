"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { CalendarPlus, Download } from "lucide-react";
import { longDate, wedding } from "@/data/wedding";
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar";
import ArchFrame from "./ArchFrame";

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.45 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Invite() {
  const { couple, card, hosts, venue, timingText, hijri } = wedding;

  return (
    <section className="relative z-10 px-3 pb-2 pt-10 sm:pt-16">
      <div className="relative mx-auto max-w-[440px]">
        <ArchFrame />

        <motion.div
          variants={list}
          initial="hidden"
          animate="show"
          className="relative z-10 px-5 pb-10 pt-10 text-center sm:px-8 sm:pb-12 sm:pt-12"
        >
          <motion.div
            variants={item}
            className="mx-auto mb-5 w-[78%] max-w-[300px] sm:mb-6"
          >
            <Image
              src="/images/flower-decoration.png"
              alt=""
              width={900}
              height={544}
              priority
              className="h-auto w-full select-none"
            />
          </motion.div>

          <motion.p
            variants={item}
            className="font-arabic text-[clamp(22px,7vw,30px)] leading-relaxed text-soft"
            dir="rtl"
          >
            {card.bismillah}
          </motion.p>
          <motion.p
            variants={item}
            className="mt-2 text-[11px] uppercase tracking-[0.22em] text-ivory/45"
          >
            {card.bismillahLabel}
          </motion.p>

          <motion.div variants={item} className="gold-line mt-6" />

          <motion.div
            variants={item}
            className="mt-7 space-y-1 font-display text-base text-ivory/75 sm:text-lg"
          >
            {card.invite.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </motion.div>

          <motion.h2
            variants={item}
            className="mt-7 font-script text-[clamp(40px,12vw,56px)] leading-[1.45]"
          >
            <span className="name-glow">{couple.groom}</span>
          </motion.h2>
          <motion.p variants={item} className="mt-1 text-sm text-soft/70">
            {couple.groomLine}
          </motion.p>

          <motion.p variants={item} className="my-4 font-display text-2xl text-champagne">
            &amp;
          </motion.p>

          <motion.h2
            variants={item}
            className="font-script text-[clamp(40px,12vw,56px)] leading-[1.45]"
          >
            <span className="name-glow">{couple.bride}</span>
          </motion.h2>
          <motion.p variants={item} className="mt-1 text-sm text-soft/70">
            {couple.brideLine}
          </motion.p>

          <motion.div
            variants={item}
            className="glass-soft mx-auto mt-9 grid max-w-sm gap-4 rounded-2xl px-5 py-6"
          >
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
          </motion.div>

          <motion.p variants={item} className="mt-7 font-display text-lg italic text-champagne">
            {card.inshaAllah}
          </motion.p>
          <motion.p variants={item} className="mt-2 text-sm text-ivory/55">
            {card.footer}
          </motion.p>

          <motion.div variants={item} className="mt-8">
            <p className="text-[11px] uppercase tracking-[0.22em] text-soft/55">Hosted by</p>
            <p className="mt-2 font-display text-lg text-ivory">{hosts.names}</p>
            <p className="text-sm text-ivory/55">{hosts.address}</p>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <a
              href={googleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold w-full sm:w-auto"
            >
              <CalendarPlus className="h-4 w-4" />
              Add to Calendar
            </a>
            <button
              type="button"
              onClick={() => downloadIcs()}
              className="btn-ghost w-full sm:w-auto"
            >
              <Download className="h-4 w-4" />
              Save to Phone Calendar
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
