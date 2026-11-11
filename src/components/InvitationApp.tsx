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

export function InvitationApp() {
  const search = useSearchParams();
  const guest =
    search.get("to")?.trim() ||
    search.get("guest")?.trim() ||
    wedding.cover.defaultGuest;

  const [opened, setOpened] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (search.get("open") === "1") setOpened(true);
  }, [search]);

  const showContent = revealing || opened;
  const showCover = !opened;

  useEffect(() => {
    document.body.classList.toggle("is-locked", showCover);
    return () => document.body.classList.remove("is-locked");
  }, [showCover]);

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
    setRevealing(true);
    startMusic();
    window.scrollTo(0, 0);
  }, [startMusic]);

  const finishOpen = useCallback(() => {
    setOpened(true);
    setRevealing(false);
    window.scrollTo(0, 0);
  }, []);

  // Slow auto-scroll after open; any touch/scroll/key turns it off for good
  useAutoScroll(opened, { delayMs: 1100, pxPerFrame: 0.5 });

  return (
    <div className="emerald-scene">
      <audio ref={audio} src={wedding.music.src} loop preload="auto" />

      <main
        className={
          showContent
            ? "relative z-10 min-h-screen"
            : "pointer-events-none invisible absolute inset-0 min-h-screen"
        }
        aria-hidden={!showContent}
      >
        {showContent && (
          <motion.div
            initial={{ opacity: 1, scale: 0.78 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "50% 18%" }}
          >
            <FallingPetals petals={14} sparkles={16} />
            <Invite />
            <ScratchCard />
            <Countdown />
            <Venue />
            <Rsvp />
            <Closing />
            {opened && <StickyBar />}
          </motion.div>
        )}
      </main>

      {opened && <MusicControl playing={playing} onToggle={toggleMusic} />}

      <AnimatePresence>
        {showCover && (
          <motion.div
            key="cover"
            className="fixed inset-0 z-50"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Cover guest={guest} onStart={startOpen} onDone={finishOpen} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
