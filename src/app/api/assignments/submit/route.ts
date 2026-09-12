import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

const submitSchema = z.object({
  assignmentId: z.string().min(1),
  answers: z.array(z.object({
    questionId: z.string().min(1),
    selectedOption: z.enum(["A", "B", "C", "D"]),
  })).min(1).max(50),
});

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "STUDENT") {
      return NextResponse.json({ success: false, message: "غير مسجل دخول كطالب" }, { status: 401 });
    }

    const parsed = submitSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "إجابات الواجب غير صحيحة." }, { status: 400 });
    }

    const { assignmentId, answers } = parsed.data;
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { questions: true },
    });
    if (!assignment) return NextResponse.json({ success: false, message: "الواجب غير موجود." }, { status: 404 });
    if (assignment.status !== "OPEN") return NextResponse.json({ success: false, message: "هذا الواجب مغلق." }, { status: 400 });
    if (!assignment.questions.length) return NextResponse.json({ success: false, message: "الواجب لا يحتوي على أسئلة بعد." }, { status: 400 });

    const submitted = new Map(answers.map((answer) => [answer.questionId, answer.selectedOption]));
    const missing = assignment.questions.filter((question) => !submitted.has(question.id));
    if (missing.length) return NextResponse.json({ success: false, message: `من فضلك أجب عن كل الأسئلة قبل الإرسال. المتبقي: ${missing.length}` }, { status: 400 });
    const validAnswers = assignment.questions.map((question) => ({
      questionId: question.id,
      selectedOption: submitted.get(question.id)!,
    }));
    const score = assignment.questions.reduce(
      (total, question) => total + (submitted.get(question.id) === question.correctAnswer ? 1 : 0),
      0,
    );
    const total = assignment.questions.length;
    const percentage = Math.round((score / total) * 10000) / 100;

    const result = await prisma.$transaction(async (tx) => {
      await tx.studentAnswer.deleteMany({
        where: { userId: session.userId, questionId: { in: assignment.questions.map((question) => question.id) } },
      });
      await tx.studentAnswer.createMany({ data: validAnswers.map((answer) => ({ ...answer, userId: session.userId })) });
      return tx.assignmentResult.upsert({
        where: { userId_assignmentId: { userId: session.userId, assignmentId } },
        update: { score, total, percentage, submittedAt: new Date() },
        create: { userId: session.userId, assignmentId, score, total, percentage },
      });
    });

    return NextResponse.json({ success: true, message: "تم إرسال الواجب وحفظ النتيجة.", result: { id: result.id, score, total, percentage } });
  } catch (error) {
    console.error("ASSIGNMENT_SUBMIT_ERROR", error);
    return NextResponse.json({ success: false, message: "حدث خطأ أثناء إرسال الواجب." }, { status: 500 });
  }
}
