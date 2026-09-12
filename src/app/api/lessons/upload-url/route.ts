import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { storagePresignPut } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "TEACHER")) {
      return NextResponse.json({ success: false, message: "غير مسجل دخول" }, { status: 401 });
    }

    const body = (await request.json()) as { filename?: string; contentType?: string };
    const filename = String(body.filename || "lesson-video").replace(/[^a-zA-Z0-9._-]/g, "_");
    const contentType = String(body.contentType || "application/octet-stream");
    const result = await storagePresignPut(
      `lessons/${session.userId}/${Date.now()}-${filename}`,
      contentType,
    );

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("LESSON_UPLOAD_URL_ERROR", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "تعذر تجهيز رفع الفيديو.",
    }, { status: 500 });
  }
}
