"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { wedding } from "@/data/wedding";
import { Cover } from "./Cover";
import FallingPetals from "./FallingPetals";
import { Invite } from "./Invite";
import ScratchCard from "./ScratchCard";
import { Countdown } from "./Countdown";
import { Venue } from "./Venue";
import { Rsvp } from "./Rsvp";
import { Closing } from "./Closing";
import { StickyBar } from "./StickyBar";
import MusicControl from "./MusicControl";
import { useAutoScroll } from "@/hooks/useAutoScroll";

/**
 * Same flow as Afsa envelope:
 * shared background always → overlay opens → content fades in as overlay exits.
 */
export function InvitationApp() {
  const search = useSearchParams();
  const guest =
    search.get("to")?.trim() ||
    search.get("guest")?.trim() ||
    wedding.cover.defaultGuest;

  const skipCover = search.get("open") === "1";
  const [opened, setOpened] = useState(skipCover);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    document.body.classList.toggle("is-locked", !opened);
    return () => document.body.classList.remove("is-locked");
  }, [opened]);

  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    a.volume = wedding.music.volume;
  }, []);

  const startMusic = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    a.volume = wedding.music.volume;
    a.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, []);

  const restartMusic = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    a.currentTime = 0;
    a.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, []);

  const toggleMusic = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      a.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    } else {
      a.pause();
      setPlaying(false);
    }
  }, []);

  const startOpen = useCallback(() => {
    startMusic();
    window.scrollTo(0, 0);
  }, [startMusic]);

  const finishOpen = useCallback(() => {
    window.scrollTo(0, 0);
    setOpened(true);
  }, []);

  useAutoScroll(opened, { delayMs: 1200, pxPerFrame: 0.5 });

  return (
    <div className="emerald-scene">
      <audio
        ref={audio}
        src={wedding.music.src}
        loop
        preload="auto"
        onEnded={restartMusic}
      />
      <FallingPetals petals={opened ? 12 : 16} sparkles={opened ? 14 : 18} />

      <AnimatePresence>
        {!opened && (
          <motion.div
            key="cover"
            className="fixed inset-0 z-50"
            exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Cover guest={guest} onStart={startOpen} onDone={finishOpen} />
          </motion.div>
        )}
      </AnimatePresence>

      {opened && (
        <motion.div
          className="relative z-10 min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Invite />
          <ScratchCard />
          <Countdown />
          <Venue />
          <Rsvp />
          <Closing />
          <StickyBar />
          <MusicControl playing={playing} onToggle={toggleMusic} />
        </motion.div>
      )}
    </div>
  );
}
