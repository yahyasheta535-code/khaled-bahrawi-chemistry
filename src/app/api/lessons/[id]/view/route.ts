import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "STUDENT") {
      return NextResponse.json({ success: false, message: "غير مسجل دخول كطالب" }, { status: 401 });
    }

    const { id: lessonId } = await params;
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, select: { id: true } });
    if (!lesson) return NextResponse.json({ success: false, message: "المحاضرة غير موجودة" }, { status: 404 });

    const view = await prisma.lessonView.upsert({
      where: { userId_lessonId: { userId: session.userId, lessonId } },
      update: { lastWatchedAt: new Date() },
      create: { userId: session.userId, lessonId },
    });

    return NextResponse.json({ success: true, startedAt: view.startedAt.toISOString() });
  } catch (error) {
    console.error("LESSON_VIEW_ERROR", error);
    return NextResponse.json({ success: false, message: "تعذر تسجيل حضور المحاضرة" }, { status: 500 });
  }
}
