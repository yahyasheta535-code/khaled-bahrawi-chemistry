import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getCurrentSession();

    if (!session || session.role !== "STUDENT") {
      return NextResponse.json({ success: false, message: "غير مسجل دخول" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        studentProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "المستخدم غير موجود" }, { status: 404 });
    }

    const userResults = await prisma.assignmentResult.findMany({
      where: { userId: user.id },
      orderBy: { submittedAt: "desc" },
    });

    const lessons = await prisma.lesson.findMany({
      where: {
        classLevel: user.classLevel ?? "THIRD_SECONDARY",
        status: "PUBLISHED",
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      orderBy: { lessonNumber: "asc" },
      take: 5,
    });

    const assignmentResults = await prisma.assignmentResult.findMany({
      where: { userId: user.id },
      include: { assignment: { include: { lesson: true } } },
    });

    const progressByLesson = new Map<string, number[]>();
    assignmentResults.forEach((result) => {
      const lessonId = result.assignment?.lessonId;
      if (!lessonId) {
        return;
      }

      if (!progressByLesson.has(lessonId)) {
        progressByLesson.set(lessonId, []);
      }
      progressByLesson.get(lessonId)?.push(result.percentage);
    });

    const lessonProgress = lessons.map((lesson) => {
      const values = progressByLesson.get(lesson.id) ?? [];
      const progress = values.length
        ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
        : 0;

      return {
        id: lesson.id,
        title: lesson.title,
        lessonNumber: lesson.lessonNumber,
        description: lesson.description,
        status: lesson.status,
        videoUrl: lesson.videoUrl,
        videoProvider: lesson.videoProvider,
        youtubeVideoId: lesson.youtubeVideoId,
        duration: lesson.duration,
        fileSize: lesson.fileSize,
        progress,
      };
    });

    const assignments: any[] = await prisma.assignment.findMany({
      include: {
        questions: true,
        results: { where: { userId: user.id } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    } as any);

    const filteredAssignments = (assignments ?? []).filter((assignment) => {
      if (!user.classLevel) {
        return true;
      }
      return assignment.classLevel === user.classLevel;
    });

    const assignmentProgress = filteredAssignments.slice(0, 5).map((assignment) => ({
      id: assignment.id,
      title: assignment.title,
      status: assignment.status,
      questionCount: Array.isArray(assignment.questions) ? assignment.questions.length : 0,
      questions: Array.isArray(assignment.questions)
        ? assignment.questions.map((question: any) => ({
            id: question.id,
            text: question.text,
            optionA: question.optionA,
            optionB: question.optionB,
            optionC: question.optionC,
            optionD: question.optionD,
            imageUrl: question.imageUrl,
          }))
        : [],
      result: Array.isArray(assignment.results) && assignment.results[0]
        ? {
            score: assignment.results[0].score,
            total: assignment.results[0].total,
            percentage: assignment.results[0].percentage,
          }
        : null,
    }));

    const resultPercentages = userResults.map((result) => result.percentage);
    const averageProgress = resultPercentages.length
      ? Math.round(resultPercentages.reduce((sum, value) => sum + value, 0) / resultPercentages.length)
      : 0;

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.studentProfile?.displayName ?? user.username,
        role: user.role,
        classLevel: user.classLevel,
        nationalId: user.nationalId,
        studentPhone: user.studentPhone,
        parentPhone: user.parentPhone,
        theme: user.theme,
        stats: {
          lessons: lessons.length,
          assignments: assignmentProgress.length,
          results: userResults.length,
          progress: averageProgress,
        },
        lessons: lessonProgress,
        assignments: assignmentProgress,
      },
    });
  } catch (error) {
    console.error("STUDENT_PROFILE_ERROR", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "حدث خطأ أثناء جلب بيانات الطالب.",
    }, { status: 500 });
  }
}
