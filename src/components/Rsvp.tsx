"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { wedding } from "@/data/wedding";

export function Rsvp() {
  const { rsvp, couple } = wedding;
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("1");
  const [note, setNote] = useState("");

  const href = useMemo(() => {
    const lines = [
      `Assalamu Alaikum,`,
      ``,
      `I'd love to attend the Wedding Reception of ${couple.shortGroom} & ${couple.shortBride}.`,
      ``,
      `Name: ${name.trim() || "—"}`,
      `Guests: ${guests}`,
      note.trim() ? `Note: ${note.trim()}` : null,
      ``,
      `Looking forward to it, Insha Allah.`,
    ]
      .filter((l) => l !== null)
      .join("\n");

    return `https://wa.me/${rsvp.whatsapp}?text=${encodeURIComponent(lines)}`;
  }, [name, guests, note, couple.shortGroom, couple.shortBride, rsvp.whatsapp]);

  if (!rsvp.enabled) return null;

  return (
    <section id="rsvp" className="relative z-10 px-5 py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55 }}
        className="glass-panel mx-auto max-w-md rounded-[2rem] px-6 py-10 sm:px-8"
      >
        <p className="text-center text-[11px] uppercase tracking-[0.3em] text-soft/70">
          {rsvp.eyebrow}
        </p>
        <h2 className="mt-3 text-center font-display text-3xl text-ivory sm:text-4xl">
          {rsvp.title}
        </h2>
        <p className="mt-3 text-center text-sm text-ivory/55">
          Confirm on WhatsApp — it only takes a moment.
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            window.open(href, "_blank", "noopener,noreferrer");
          }}
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-soft/60">
              Your name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="field-dark"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-soft/60">
              Number of guests
            </span>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="field-dark"
            >
              {["1", "2", "3", "4", "5", "6+"].map((n) => (
                <option key={n} value={n} className="bg-forest-deep text-ivory">
                  {n}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-soft/60">
              Message (optional)
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="A short dua or note…"
              className="field-dark py-3"
            />
          </label>

          <button
            type="submit"
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(37,211,102,0.3)] transition hover:brightness-105"
          >
            <MessageCircle className="h-4 w-4" />
            Send via WhatsApp
          </button>
        </form>
      </motion.div>
    </section>
  );
}
