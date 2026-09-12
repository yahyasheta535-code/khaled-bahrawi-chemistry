import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getCurrentSession();

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "غير مسجل دخول كمدير" }, { status: 401 });
    }

    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      include: { studentProfile: true },
      orderBy: { createdAt: "desc" },
    });

    const passwordRequests = await prisma.passwordResetRequest.count({
      where: { status: "PENDING" },
    });

    const lessonCount = await prisma.lesson.count();
    const assignmentCount = await prisma.assignment.count();

    const lessons = await prisma.lesson.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const assignments = await prisma.assignment.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { questions: true },
    });

    const adminUser = await prisma.user.findUnique({
      where: { username: "admin" },
      include: { teacherProfile: true },
    });

    const metrics = {
      totalStudents: students.length,
      passwordRequests,
      lessonCount,
      assignmentCount,
    };

    const rows = students.map((student) => ({
      id: student.id,
      name: student.studentProfile?.displayName ?? student.username,
      username: student.username,
      className: student.classLevel ?? "غير محدد",
      status: "نشط",
    }));

    return NextResponse.json({
      success: true,
      admin: {
        displayName: adminUser?.teacherProfile?.displayName ?? "مدير النظام",
      },
      metrics,
      students: rows,
      lessons: lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        classLevel: lesson.classLevel,
        lessonNumber: lesson.lessonNumber,
        status: lesson.status,
        duration: lesson.duration,
      })),
      assignments: assignments.map((assignment) => ({
        id: assignment.id,
        title: assignment.title,
        classLevel: assignment.classLevel,
        status: assignment.status,
        questionCount: assignment.questions.length,
      })),
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "حدث خطأ أثناء جلب بيانات الإدارة." }, { status: 500 });
  }
}
