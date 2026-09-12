import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    select: { videoData: true, videoMimeType: true },
  });
  if (!lesson?.videoData) return NextResponse.json({ message: "الفيديو غير موجود." }, { status: 404 });

  const data = Buffer.from(lesson.videoData);
  const mime = lesson.videoMimeType || "video/mp4";
  const range = request.headers.get("range");
  const headers = new Headers({
    "Content-Type": mime,
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=3600",
  });

  if (!range) {
    headers.set("Content-Length", String(data.length));
    return new NextResponse(data, { status: 200, headers });
  }

  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match) return new NextResponse(null, { status: 416, headers: { "Content-Range": `bytes */${data.length}` } });
  const start = match[1] ? Number(match[1]) : Math.max(0, data.length - Number(match[2] || 0));
  const end = match[2] ? Number(match[2]) : data.length - 1;
  if (start < 0 || start >= data.length || end < start) {
    return new NextResponse(null, { status: 416, headers: { "Content-Range": `bytes */${data.length}` } });
  }
  const safeEnd = Math.min(end, data.length - 1);
  headers.set("Content-Length", String(safeEnd - start + 1));
  headers.set("Content-Range", `bytes ${start}-${safeEnd}/${data.length}`);
  return new NextResponse(data.subarray(start, safeEnd + 1), { status: 206, headers });
}
