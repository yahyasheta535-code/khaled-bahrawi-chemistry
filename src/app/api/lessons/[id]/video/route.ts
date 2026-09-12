import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_CHUNK_SIZE = 2 * 1024 * 1024;

type VideoChunk = {
  videoMimeType: string | null;
  total: number | string | bigint | null;
  data: Buffer | Uint8Array | null;
};

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const range = request.headers.get("range");
  const requested = /^bytes=(\d*)-(\d*)$/.exec(range ?? "");

  // Read only the requested byte window. This prevents an hour-long video from
  // being copied into memory on every request.
  const probe = await prisma.$queryRawUnsafe<VideoChunk[]>(
    "SELECT videoMimeType, OCTET_LENGTH(videoData) AS total, SUBSTRING(videoData, 1, 1) AS data FROM lessons WHERE id = ? LIMIT 1",
    id,
  );
  const first = probe[0];
  if (!first || first.total == null) {
    return NextResponse.json({ message: "الفيديو غير موجود." }, { status: 404 });
  }

  const total = Number(first.total);
  let start = 0;
  let end = Math.min(total - 1, DEFAULT_CHUNK_SIZE - 1);

  if (requested) {
    if (requested[1]) {
      start = Number(requested[1]);
      end = requested[2] ? Number(requested[2]) : Math.min(total - 1, start + DEFAULT_CHUNK_SIZE - 1);
    } else if (requested[2]) {
      const suffix = Number(requested[2]);
      start = Math.max(0, total - suffix);
      end = total - 1;
    }
  }

  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= total || end < start) {
    return new NextResponse(null, { status: 416, headers: { "Content-Range": `bytes */${total}` } });
  }

  end = Math.min(end, total - 1);
  const length = end - start + 1;
  const rows = await prisma.$queryRawUnsafe<VideoChunk[]>(
    "SELECT videoMimeType, OCTET_LENGTH(videoData) AS total, SUBSTRING(videoData, ?, ?) AS data FROM lessons WHERE id = ? LIMIT 1",
    start + 1,
    length,
    id,
  );
  const row = rows[0];
  const data = row?.data ? Buffer.from(row.data) : null;
  if (!data) return NextResponse.json({ message: "الفيديو غير موجود." }, { status: 404 });

  const headers = new Headers({
    "Content-Type": row.videoMimeType || first.videoMimeType || "video/mp4",
    "Accept-Ranges": "bytes",
    "Content-Length": String(data.length),
    "Content-Range": `bytes ${start}-${start + data.length - 1}/${total}`,
    "Cache-Control": "public, max-age=3600, immutable",
  });

  return new NextResponse(data, { status: requested ? 206 : 200, headers });
}
