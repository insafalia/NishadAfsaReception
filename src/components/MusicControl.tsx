"use client";

import { motion } from "framer-motion";
import { Music2, VolumeX } from "lucide-react";

export default function MusicControl({
  playing,
  onToggle,
}: {
  playing: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[5.5rem] z-40 mx-auto flex max-w-[480px] justify-end px-5 sm:bottom-6">
      <motion.button
        type="button"
        onClick={onToggle}
        aria-label={playing ? "Pause music" : "Play music"}
        aria-pressed={playing}
        className="pointer-events-auto relative grid h-12 w-12 place-items-center rounded-full text-forest-deep shadow-[0_10px_24px_-6px_rgba(6,40,32,0.65)]"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #E2C98A 0%, #C4A35A 55%, #8A6E2F 100%)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 18 }}
      >
        <span aria-hidden className="absolute inset-[3px] rounded-full border border-[#062820]/30" />
        {playing && (
          <span
            aria-hidden
            className="absolute inset-0 animate-ping rounded-full border border-soft/70 [animation-duration:2.4s]"
          />
        )}
        <motion.span
          animate={playing ? { rotate: 360 } : { rotate: 0 }}
          transition={
            playing
              ? { duration: 6, repeat: Infinity, ease: "linear" }
              : { duration: 0.3 }
          }
        >
          {playing ? <Music2 size={19} /> : <VolumeX size={19} />}
        </motion.span>
      </motion.button>
    </div>
  );
}
