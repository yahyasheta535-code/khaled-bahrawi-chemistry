"use client";

import { useEffect, useRef, useState } from "react";

type YouTubePlayerProps = {
  videoId: string;
  onStarted?: () => void;
};

type YouTubeApi = {
  Player: new (element: HTMLElement, options: { videoId: string; host: string; playerVars: Record<string, number | string>; events: { onStateChange: (event: { data: number }) => void } }) => { destroy: () => void };
  PlayerState: { PLAYING: number };
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export default function YouTubePlayer({ videoId, onStarted }: YouTubePlayerProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const onStartedRef = useRef(onStarted);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    onStartedRef.current = onStarted;
  }, [onStarted]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(document.fullscreenElement === shellRef.current);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    let player: { destroy: () => void } | null = null;
    let cancelled = false;

    const mountPlayer = () => {
      if (cancelled || !containerRef.current || !window.YT) return;
      player = new window.YT.Player(containerRef.current, {
        videoId,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          controls: 1,
          fs: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          iv_load_policy: 3,
          origin: window.location.origin,
        },
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT?.PlayerState.PLAYING && !startedRef.current) {
              startedRef.current = true;
              onStartedRef.current?.();
            }
          },
        },
      });
    };

    if (window.YT) {
      mountPlayer();
    } else {
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        mountPlayer();
      };
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      player?.destroy();
    };
  }, [videoId]);

  async function toggleFullscreen() {
    if (!shellRef.current) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await shellRef.current.requestFullscreen();
  }

  return (
    <div ref={shellRef} className="video-player-shell relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black">
      <div ref={containerRef} className="h-full w-full" aria-label="مشغل المحاضرة" />
      <button
        type="button"
        onClick={() => void toggleFullscreen()}
        className="absolute bottom-3 left-3 z-10 rounded-lg border border-white/20 bg-slate-950/80 px-3 py-2 text-xs font-bold text-white shadow-lg backdrop-blur transition hover:bg-slate-800"
        aria-label={isFullscreen ? "الخروج من ملء الشاشة" : "تكبير الفيديو إلى ملء الشاشة"}
      >
        {isFullscreen ? "⤢ خروج" : "⛶ ملء الشاشة"}
      </button>
    </div>
  );
}
