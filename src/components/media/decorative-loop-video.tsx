"use client";

import { useEffect, useRef, useState } from "react";
import { ArtDirectedImage } from "@/components/media/art-directed-image";
import type { ComponentProps } from "react";

interface DecorativeLoopVideoProps {
  src?: string;
  fallback: ComponentProps<typeof ArtDirectedImage>;
}

/** The still stays visible until playback succeeds, including blocked autoplay or media errors. */
export function DecorativeLoopVideo({ src, fallback }: DecorativeLoopVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionAllowed(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const showVideo = Boolean(src) && motionAllowed && !failed;

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!showVideo || !video || !container) return;

    let inView = true;
    const updatePlayback = () => {
      if (paused || !inView || document.hidden) {
        video.pause();
      } else {
        // Blocked autoplay keeps the still visible until playback actually starts.
        void video.play().catch(() => {});
      }
    };
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            inView = entry?.isIntersecting ?? false;
            updatePlayback();
          });
    observer?.observe(container);
    document.addEventListener("visibilitychange", updatePlayback);
    updatePlayback();
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
      video.pause();
    };
  }, [showVideo, paused]);

  return (
    <div
      ref={containerRef}
      data-loop-video
      className="bg-brand-navy relative h-full w-full overflow-hidden"
    >
      <div data-loop-fallback hidden={showVideo && playing} className="h-full w-full">
        <ArtDirectedImage {...fallback} />
      </div>
      {showVideo && (
        <>
          <video
            ref={videoRef}
            src={src}
            poster={fallback.desktopSrc}
            autoPlay={!paused}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            onPlaying={() => setPlaying(true)}
            onError={() => setFailed(true)}
            className={`absolute inset-0 h-full w-full object-cover object-center ${playing ? "opacity-100" : "opacity-0"}`}
          />
          {playing && (
            <button
              type="button"
              className="text-brand-navy pointer-events-none absolute right-4 bottom-4 min-h-11 bg-white px-4 text-sm opacity-0 focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4"
              onClick={() => setPaused((current) => !current)}
            >
              {paused ? "Animation abspielen" : "Animation pausieren"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
