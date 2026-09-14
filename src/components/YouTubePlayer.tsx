"use client";

import { useEffect, useRef } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const onStartedRef = useRef(onStarted);

  useEffect(() => {
    onStartedRef.current = onStarted;
  }, [onStarted]);

  useEffect(() => {
    let player: { destroy: () => void } | null = null;
    let cancelled = false;

    const mountPlayer = () => {
      if (cancelled || !containerRef.current || !window.YT) return;
      player = new window.YT.Player(containerRef.current, {
        videoId,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
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

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black">
      <div ref={containerRef} className="h-full w-full" aria-label="مشغل المحاضرة" />
    </div>
  );
}
