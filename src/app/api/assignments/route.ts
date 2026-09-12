import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

const questionSchema = z.object({
  text: z.string().min(2).max(500),
  optionA: z.string().min(1).max(200),
  optionB: z.string().min(1).max(200),
  optionC: z.string().min(1).max(200),
  optionD: z.string().min(1).max(200),
  correctAnswer: z.enum(["A", "B", "C", "D"]),
});

const assignmentSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(800).optional().default(""),
  classLevel: z.enum(["THIRD_PREP", "FIRST_SECONDARY", "SECONDARY_2", "THIRD_SECONDARY"]),
  status: z.enum(["OPEN", "CLOSED", "GRADED"]).optional().default("OPEN"),
  questions: z.array(questionSchema).min(1).max(50),
});

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || !["ADMIN", "TEACHER", "STUDENT"].includes(session.role)) {
      return NextResponse.json({ success: false, message: "غير مسجل دخول" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { classLevel: true } });
    const where = session.role === "STUDENT" ? { classLevel: user?.classLevel ?? "THIRD_SECONDARY" as const } : {};
    const assignments = await prisma.assignment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { questions: true },
    });

    return NextResponse.json({
      success: true,
      assignments: assignments.map((assignment) => ({
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        classLevel: assignment.classLevel,
        status: assignment.status,
        questionCount: assignment.questions.length,
        questions: assignment.questions.map((question) => ({
          id: question.id,
          text: question.text,
          optionA: question.optionA,
          optionB: question.optionB,
          optionC: question.optionC,
          optionD: question.optionD,
          ...(session.role === "STUDENT" ? {} : { correctAnswer: question.correctAnswer }),
        })),
      })),
    });
  } catch (error) {
    console.error("ASSIGNMENT_GET_ERROR", error);
    return NextResponse.json({ success: false, message: "حدث خطأ أثناء جلب الواجبات." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session || !["ADMIN", "TEACHER"].includes(session.role)) {
      return NextResponse.json({ success: false, message: "غير مسجل دخول" }, { status: 401 });
    }

    const parsed = assignmentSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "بيانات الواجب غير صحيحة." }, { status: 400 });
    }

    const { title, description, classLevel, status, questions } = parsed.data;
    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        classLevel,
        status,
        questions: { create: questions },
      },
      include: { questions: true },
    });

    return NextResponse.json({
      success: true,
      message: "تم إنشاء الواجب بنجاح.",
      assignment: { id: assignment.id, title: assignment.title, classLevel: assignment.classLevel, questionCount: assignment.questions.length },
    });
  } catch (error) {
    console.error("ASSIGNMENT_CREATE_ERROR", error);
    return NextResponse.json({ success: false, message: "حدث خطأ أثناء إنشاء الواجب." }, { status: 500 });
  }
}
