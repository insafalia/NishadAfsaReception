"use client";

import { useCallback, useEffect, useState } from "react";
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

export function InvitationApp() {
  const search = useSearchParams();
  const guest =
    search.get("to")?.trim() ||
    search.get("guest")?.trim() ||
    wedding.cover.defaultGuest;

  const [opened, setOpened] = useState(false);
  const [revealing, setRevealing] = useState(false);

  useEffect(() => {
    if (search.get("open") === "1") setOpened(true);
  }, [search]);

  const showContent = revealing || opened;
  const showCover = !opened;

  useEffect(() => {
    document.body.classList.toggle("is-locked", showCover);
    return () => document.body.classList.remove("is-locked");
  }, [showCover]);

  const startOpen = useCallback(() => {
    setRevealing(true);
    window.scrollTo(0, 0);
  }, []);

  const finishOpen = useCallback(() => {
    setOpened(true);
    setRevealing(false);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="emerald-scene">
      {/* Invitation sits behind the gates so open never hits a blank frame */}
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
