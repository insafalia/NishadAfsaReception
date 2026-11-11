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
    // Keep scroll locked through gate + zoom so mobile doesn't drop/jump
    document.body.classList.toggle("is-locked", showCover || revealing);
    return () => document.body.classList.remove("is-locked");
  }, [showCover, revealing]);

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
    window.setTimeout(() => {
      setRevealing(false);
      window.scrollTo(0, 0);
    }, 400);
  }, []);

  useAutoScroll(opened, { delayMs: 1400, pxPerFrame: 0.5 });

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
          <>
            {/* Fixed layers stay outside scale — avoids mobile "drop" */}
            <FallingPetals petals={14} sparkles={16} />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Invite />
              <ScratchCard />
              <Countdown />
              <Venue />
              <Rsvp />
              <Closing />
            </motion.div>

            {opened && <StickyBar />}
          </>
        )}
      </main>

      {opened && <MusicControl playing={playing} onToggle={toggleMusic} />}

      <AnimatePresence>
        {showCover && (
          <motion.div
            key="cover"
            className="fixed inset-0 z-50"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Cover guest={guest} onStart={startOpen} onDone={finishOpen} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
