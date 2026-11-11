"use client";

import { MapPin, Navigation } from "lucide-react";
import { wedding } from "@/data/wedding";

export function StickyBar() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 sm:hidden">
      <div className="glass-panel mx-auto flex max-w-md gap-2 rounded-full p-2">
        <a
          href="#venue"
          className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full text-sm font-semibold text-soft"
        >
          <MapPin className="h-4 w-4" />
          Venue
        </a>
        <a
          href={wedding.venue.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold flex-1 !min-h-[44px] !px-4 text-sm"
        >
          <Navigation className="h-4 w-4" />
          Directions
        </a>
      </div>
    </nav>
  );
}
