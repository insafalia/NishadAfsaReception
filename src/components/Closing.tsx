"use client";

import { motion } from "framer-motion";
import { Share2 } from "lucide-react";
import { wedding } from "@/data/wedding";

export function Closing() {
  const { closing, couple, sharedBy, shareMessage } = wedding;

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: wedding.seo.title,
          text: shareMessage,
          url: window.location.href,
        });
        return;
      }
    } catch {
      /* cancelled */
    }
    try {
      await navigator.clipboard.writeText(`${shareMessage}\n\n${window.location.href}`);
      alert("Invite link copied");
    } catch {
      /* ignore */
    }
  };

  return (
    <section className="relative z-10 px-5 pb-28 pt-10 sm:pb-16 sm:pt-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55 }}
        className="glass-panel mx-auto max-w-xl rounded-[2rem] px-6 py-12 text-center sm:px-10"
      >
        <p className="font-arabic text-xl leading-relaxed text-soft sm:text-2xl" dir="rtl">
          {closing.dua}
        </p>
        <p className="mt-4 text-sm text-ivory/55">{closing.duaMeaning}</p>

        <div className="gold-line my-10" />

        <p className="font-display text-2xl text-soft">{closing.thanks}</p>
        <h2 className="mt-3 font-script text-4xl text-ivory sm:text-5xl">
          {couple.shortGroom} &amp; {couple.shortBride}
        </h2>
        <p className="mt-4 text-sm text-ivory/50">{closing.signoff}</p>

        <p className="mt-10 text-[11px] uppercase tracking-[0.25em] text-soft/55">
          {sharedBy.label}
        </p>
        <p className="mt-2 text-sm text-ivory/70">{sharedBy.names}</p>
        <p className="text-sm text-ivory/50">{sharedBy.place}</p>

        <button type="button" onClick={share} className="btn-ghost mt-10">
          <Share2 className="h-4 w-4" />
          Share invitation
        </button>
      </motion.div>
    </section>
  );
}
