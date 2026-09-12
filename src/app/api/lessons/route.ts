import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

const lessonPayloadSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(800).optional().default(""),
  classLevel: z.enum(["THIRD_PREP", "FIRST_SECONDARY", "SECONDARY_2", "THIRD_SECONDARY"]),
  lessonNumber: z.coerce.number().int().min(1).max(999).optional(),
  duration: z.string().min(1).max(30).optional().default("00:00"),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional().default("DRAFT"),
  expiryHours: z.coerce.number().int().min(1).max(720).optional().default(24),
});

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function cleanupExpiredLessons() {
  return;
}

export async function GET() {
  try {
    const session = await getCurrentSession();

    if (!session || (session.role !== "ADMIN" && session.role !== "TEACHER")) {
      return NextResponse.json({ success: false, message: "غير مسجل دخول" }, { status: 401 });
    }

    await cleanupExpiredLessons();

    const lessons = await prisma.lesson.findMany({
      orderBy: { createdAt: "desc" },
    });

    const teacherIds = Array.from(new Set(lessons.map((lesson) => lesson.teacherId).filter(Boolean) as string[]));
    const teacherUsers = teacherIds.length
      ? await prisma.user.findMany({
          where: { id: { in: teacherIds } },
          include: { teacherProfile: true },
        })
      : [];

    const teacherMap = new Map(teacherUsers.map((teacherUser) => [teacherUser.id, teacherUser]));
    const currentTeacher = session.role === "TEACHER"
      ? await prisma.user.findUnique({
          where: { id: session.userId },
          include: { teacherProfile: true },
        })
      : null;

    return NextResponse.json({
      success: true,
      lessons: lessons.map((lesson) => {
        const teacherUser = lesson.teacherId ? teacherMap.get(lesson.teacherId) : currentTeacher;

        return {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          classLevel: lesson.classLevel,
          lessonNumber: lesson.lessonNumber,
          status: lesson.status,
          videoUrl: lesson.videoUrl,
          duration: lesson.duration,
          fileSize: lesson.fileSize,
          expiresAt: lesson.expiresAt ? lesson.expiresAt.toISOString() : null,
          teacherName:
            teacherUser?.teacherProfile?.displayName ??
            teacherUser?.username ??
            currentTeacher?.teacherProfile?.displayName ??
            currentTeacher?.username ??
            "مدرس",
        };
      }),
    });
  } catch (error) {
    console.error("LESSONS_GET_ERROR", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "حدث خطأ أثناء جلب المحاضرات.",
      details: error instanceof Error ? error.stack : null,
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();

    if (!session || (session.role !== "ADMIN" && session.role !== "TEACHER")) {
      return NextResponse.json({ success: false, message: "غير مسجل دخول" }, { status: 401 });
    }

    const formData = await request.formData();
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const classLevel = String(formData.get("classLevel") ?? "");
    const duration = String(formData.get("duration") ?? "00:00").trim();
    const status = String(formData.get("status") ?? "DRAFT");
    const lessonNumberValue = formData.get("lessonNumber");
    const expiryHoursValue = Number(formData.get("expiryHours") ?? 24);
    const rawFile = formData.get("video");

    const parsed = lessonPayloadSchema.safeParse({
      title,
      description,
      classLevel,
      lessonNumber: lessonNumberValue ?? undefined,
      duration,
      status,
      expiryHours: expiryHoursValue,
    });

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "بيانات المحاضرة غير صحيحة." }, { status: 400 });
    }

    if (!(rawFile instanceof File) || rawFile.size === 0) {
      return NextResponse.json({ success: false, message: "يجب رفع ملف فيديو صحيح." }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await rawFile.arrayBuffer());

    const classLevelValue = parsed.data.classLevel;
    const lessonNumber =
      parsed.data.lessonNumber ??
      ((await prisma.lesson.count({ where: { classLevel: classLevelValue } })) + 1);

    const expiresAt = new Date(Date.now() + parsed.data.expiryHours * 60 * 60 * 1000);

    const lesson = await prisma.lesson.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        classLevel: classLevelValue,
        lessonNumber,
        duration: parsed.data.duration,
        videoUrl: "",
        videoData: fileBuffer,
        videoMimeType: rawFile.type || "video/mp4",
        fileSize: formatFileSize(rawFile.size),
        status: parsed.data.status,
        expiresAt,
        teacherId: session.userId,
      },
    });

    const videoUrl = `/api/lessons/${lesson.id}/video`;
    await prisma.lesson.update({ where: { id: lesson.id }, data: { videoUrl } });

    return NextResponse.json({
      success: true,
      message: "تم إنشاء المحاضرة بنجاح.",
      lesson: {
        id: lesson.id,
        title: lesson.title,
        classLevel: lesson.classLevel,
        lessonNumber: lesson.lessonNumber,
        videoUrl,
        status: lesson.status,
        expiresAt: lesson.expiresAt?.toISOString() ?? null,
      },
    });
  } catch (error) {
    console.error("LESSONS_POST_ERROR", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء المحاضرة.",
      details: error instanceof Error ? error.stack : null,
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getCurrentSession();

    if (!session || (session.role !== "ADMIN" && session.role !== "TEACHER")) {
      return NextResponse.json({ success: false, message: "غير مسجل دخول" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const lessonId = String(body.id ?? "").trim();

    if (!lessonId) {
      return NextResponse.json({ success: false, message: "معرف المحاضرة غير موجود." }, { status: 400 });
    }

    const existingLesson = await prisma.lesson.findUnique({ where: { id: lessonId } });

    if (!existingLesson) {
      return NextResponse.json({ success: false, message: "المحاضرة غير موجودة." }, { status: 404 });
    }

    const isOwner = !existingLesson.teacherId || existingLesson.teacherId === session.userId;

    if (session.role !== "ADMIN" && !isOwner) {
      return NextResponse.json({ success: false, message: "لا تملك صلاحية حذف هذه المحاضرة." }, { status: 403 });
    }

    await prisma.lesson.delete({ where: { id: lessonId } });

    return NextResponse.json({ success: true, message: "تم حذف المحاضرة بنجاح." });
  } catch (error) {
    console.error("LESSONS_DELETE_ERROR", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "حدث خطأ أثناء حذف المحاضرة.",
      details: error instanceof Error ? error.stack : null,
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getCurrentSession();

    if (!session || (session.role !== "ADMIN" && session.role !== "TEACHER")) {
      return NextResponse.json({ success: false, message: "غير مسجل دخول" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const lessonId = String(body.id ?? "").trim();

    if (!lessonId) {
      return NextResponse.json({ success: false, message: "معرف المحاضرة غير موجود." }, { status: 400 });
    }

    const existingLesson = await prisma.lesson.findUnique({ where: { id: lessonId } });

    if (!existingLesson) {
      return NextResponse.json({ success: false, message: "المحاضرة غير موجودة." }, { status: 404 });
    }

    const isOwner = !existingLesson.teacherId || existingLesson.teacherId === session.userId;

    if (session.role !== "ADMIN" && !isOwner) {
      return NextResponse.json({ success: false, message: "لا تملك صلاحية تعديل هذه المحاضرة." }, { status: 403 });
    }

    const parsed = lessonPayloadSchema.partial().safeParse({
      title: body.title,
      description: body.description,
      classLevel: body.classLevel,
      lessonNumber: body.lessonNumber,
      duration: body.duration,
      status: body.status,
      expiryHours: body.expiryHours,
    });

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "بيانات التعديل غير صحيحة." }, { status: 400 });
    }

    const updateData: Record<string, string | number | Date | null> = {};

    if (body.title) updateData.title = String(body.title).trim();
    if (body.description !== undefined) updateData.description = String(body.description).trim();
    if (body.classLevel) updateData.classLevel = String(body.classLevel);
    if (body.lessonNumber) updateData.lessonNumber = Number(body.lessonNumber);
    if (body.duration) updateData.duration = String(body.duration).trim();
    if (body.status) updateData.status = String(body.status);
    if (body.expiryHours) {
      updateData.expiresAt = new Date(Date.now() + Number(body.expiryHours) * 60 * 60 * 1000);
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "تم تعديل المحاضرة بنجاح.",
      lesson: {
        id: updatedLesson.id,
        title: updatedLesson.title,
        classLevel: updatedLesson.classLevel,
        lessonNumber: updatedLesson.lessonNumber,
        duration: updatedLesson.duration,
        status: updatedLesson.status,
        expiresAt: updatedLesson.expiresAt?.toISOString() ?? null,
      },
    });
  } catch (error) {
    console.error("LESSONS_PUT_ERROR", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "حدث خطأ أثناء تعديل المحاضرة.",
      details: error instanceof Error ? error.stack : null,
    }, { status: 500 });
  }
}
