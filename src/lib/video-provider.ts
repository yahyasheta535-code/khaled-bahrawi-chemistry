export type VideoProvider = "STORAGE" | "YOUTUBE";

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function parseYouTubeVideoId(value: string): string | null {
  const input = value.trim();
  if (!input) return null;

  if (YOUTUBE_ID_PATTERN.test(input)) return input;

  try {
    const url = new URL(input);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

    if (hostname === "youtu.be") {
      const candidate = url.pathname.split("/").filter(Boolean)[0] ?? "";
      return YOUTUBE_ID_PATTERN.test(candidate) ? candidate : null;
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com" || hostname === "youtube-nocookie.com") {
      const watchId = url.searchParams.get("v");
      if (watchId && YOUTUBE_ID_PATTERN.test(watchId)) return watchId;

      const parts = url.pathname.split("/").filter(Boolean);
      const markerIndex = parts.findIndex((part) => part === "embed" || part === "shorts" || part === "live");
      const candidate = markerIndex >= 0 ? parts[markerIndex + 1] ?? "" : "";
      return YOUTUBE_ID_PATTERN.test(candidate) ? candidate : null;
    }
  } catch {
    return null;
  }

  return null;
}

export function youtubeEmbedUrl(videoId: string): string {
  if (!YOUTUBE_ID_PATTERN.test(videoId)) throw new Error("Invalid YouTube video id");
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
}

export function isValidYouTubeVideoId(value: string): boolean {
  return YOUTUBE_ID_PATTERN.test(value);
}
