import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getCurrentSession();

    if (!session || session.role !== "TEACHER") {
      return NextResponse.json({ success: false, message: "غير مسجل دخول كمدرس" }, { status: 401 });
    }

    const teacher = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { teacherProfile: true },
    });

    if (!teacher) {
      return NextResponse.json({ success: false, message: "المستخدم غير موجود" }, { status: 404 });
    }

    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      include: { studentProfile: true, results: { include: { assignment: true }, orderBy: { submittedAt: "desc" } }, lessonViews: { include: { lesson: true }, orderBy: { lastWatchedAt: "desc" } } },
      orderBy: { createdAt: "desc" },
    });

    const lessonCount = await prisma.lesson.count();
    const assignmentCount = await prisma.assignment.count();

    const lessons = await prisma.lesson.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const teacherIds = Array.from(new Set(lessons.map((lesson) => lesson.teacherId).filter(Boolean) as string[]));
    const teacherUsers = teacherIds.length
      ? await prisma.user.findMany({
          where: { id: { in: teacherIds } },
          include: { teacherProfile: true },
        })
      : [];

    const teacherMap = new Map(teacherUsers.map((teacherUser) => [teacherUser.id, teacherUser]));
    const latestLesson = lessons[0] ?? null;

    const assignments = await prisma.assignment.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { questions: true },
    });

    const metrics = {
      totalStudents: students.length,
      totalLessons: lessonCount,
      totalAssignments: assignmentCount,
      averageProgress: students.length
        ? Math.round(
            students.reduce((sum, student) => {
              const resultPct = student.results.length
                ? student.results.reduce((acc, item) => acc + item.percentage, 0) /
                  student.results.length
                : 0;
              return sum + resultPct;
            }, 0) / students.length
          )
        : 0,
    };

    const studentRows = students.map((student) => {
      const avgPercentage = student.results.length
        ? Math.round(
            student.results.reduce((sum, result) => sum + result.percentage, 0) / student.results.length
          )
        : 0;

      const lessonLabel = latestLesson ? `${latestLesson.title}` : "لا توجد محاضرة";
      const latestView = student.lessonViews[0];
      const watchedValue = latestView
        ? `بدأ المشاهدة — ${latestView.lesson.title}`
        : lessons.length
          ? "لم يبدأ المشاهدة"
          : lessonLabel;

      return {
        id: student.id,
        name: student.studentProfile?.displayName ?? student.username,
        username: student.username,
        classLevel: student.classLevel ?? "غير محدد",
        watched: watchedValue,
        status: latestView ? "بدأ المحاضرة" : "لم يشاهد المحاضرة",
        parentPhone: student.parentPhone ?? "غير موجود",
        grades: student.results.map((result) => ({
          assignmentTitle: result.assignment.title,
          score: result.score,
          total: result.total,
          percentage: result.percentage,
          submittedAt: result.submittedAt.toISOString(),
        })),
      };
    });

    return NextResponse.json({
      success: true,
      teacher: {
        displayName: teacher.teacherProfile?.displayName ?? teacher.username,
      },
      metrics,
      students: studentRows,
      lessons: lessons.map((lesson) => {
        const teacherUser = lesson.teacherId ? teacherMap.get(lesson.teacherId) : teacher;

        return {
          id: lesson.id,
          title: lesson.title,
          classLevel: lesson.classLevel,
          lessonNumber: lesson.lessonNumber,
          status: lesson.status,
          duration: lesson.duration,
          expiresAt: lesson.expiresAt ? lesson.expiresAt.toISOString() : null,
          teacherName:
            teacherUser?.teacherProfile?.displayName ??
            teacherUser?.username ??
            teacher.teacherProfile?.displayName ??
            teacher.username ??
            "مدرس",
        };
      }),
      assignments: assignments.map((assignment) => ({
        id: assignment.id,
        title: assignment.title,
        classLevel: assignment.classLevel,
        status: assignment.status,
        questionCount: assignment.questions.length,
        description: assignment.description,
        questions: assignment.questions.map((question) => ({
          text: question.text,
          optionA: question.optionA,
          optionB: question.optionB,
          optionC: question.optionC,
          optionD: question.optionD,
          correctAnswer: question.correctAnswer,
          imageUrl: question.imageUrl,
        })),
      })),
    });
  } catch (error) {
    console.error("TEACHER_DASHBOARD_ERROR", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "حدث خطأ أثناء جلب بيانات المدرس.",
      details: error instanceof Error ? error.stack : null,
    }, { status: 500 });
  }
}
