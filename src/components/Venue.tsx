"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { wedding } from "@/data/wedding";

export function Venue() {
  const { venue } = wedding;

  return (
    <section id="venue" className="relative z-10 px-5 py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55 }}
        className="glass-panel mx-auto max-w-2xl overflow-hidden rounded-[2rem]"
      >
        <div className="px-6 pb-4 pt-10 text-center sm:px-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-soft/70">Venue</p>
          <h2 className="mt-3 font-display text-3xl text-ivory sm:text-4xl">{venue.name}</h2>
          <p className="mt-2 text-ivory/60">{venue.addressLines.join(", ")}</p>
        </div>

        <div className="mx-4 overflow-hidden rounded-2xl ring-1 ring-soft/15 sm:mx-6">
          <iframe
            title="Venue map"
            src={venue.embedUrl}
            className="h-64 w-full border-0 sm:h-80"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <div className="flex flex-col items-center gap-6 px-6 py-8 sm:flex-row sm:justify-between sm:px-10">
          <a
            href={venue.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold w-full sm:w-auto"
          >
            <Navigation className="h-4 w-4" />
            Open in Google Maps
          </a>

          <div className="flex flex-col items-center gap-2">
            <div className="rounded-2xl bg-ivory p-3 shadow-lg">
              <QRCodeSVG value={venue.mapsUrl} size={96} level="M" includeMargin={false} />
            </div>
            <p className="flex items-center gap-1 text-xs text-soft/70">
              <MapPin className="h-3 w-3" />
              {venue.qrLabel}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
