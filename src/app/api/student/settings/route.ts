import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, hashPassword } from "@/lib/auth";
import { getCurrentSession } from "@/lib/session";

const settingsSchema = z.object({
  currentPassword: z.string().min(8).optional(),
  newPassword: z.string().min(8).optional(),
  studentPhone: z.string().min(8).max(20).optional(),
  theme: z.enum(["default", "violet", "emerald", "gold"]).optional(),
});

export async function PATCH(request: Request) {
  try {
    const session = await getCurrentSession();

    if (!session || session.role !== "STUDENT") {
      return NextResponse.json({ success: false, message: "غير مسجل دخول" }, { status: 401 });
    }

    const body = await request.json();
    const normalizedBody = {
      currentPassword: typeof body?.currentPassword === "string" && body.currentPassword.trim() ? body.currentPassword.trim() : undefined,
      newPassword: typeof body?.newPassword === "string" && body.newPassword.trim() ? body.newPassword.trim() : undefined,
      studentPhone: typeof body?.studentPhone === "string" && body.studentPhone.trim() ? body.studentPhone.trim() : undefined,
      theme: typeof body?.theme === "string" && body.theme.trim() ? body.theme.trim() : undefined,
    };

    const parsed = settingsSchema.safeParse(normalizedBody);

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "بيانات الإعدادات غير صحيحة." }, { status: 400 });
    }

    const { currentPassword, newPassword, studentPhone, theme } = parsed.data;
    const user = await prisma.user.findUnique({ where: { id: session.userId } });

    if (!user) {
      return NextResponse.json({ success: false, message: "المستخدم غير موجود." }, { status: 404 });
    }

    if (studentPhone && studentPhone !== user.studentPhone) {
      const existing = await prisma.user.findFirst({
        where: { studentPhone, NOT: { id: user.id } },
      });

      if (existing) {
        return NextResponse.json({
          success: false,
          message: "رقم الطالب مستخدم بالفعل من حساب آخر.",
        }, { status: 409 });
      }
    }

    if (newPassword || currentPassword) {
      if (!currentPassword || !newPassword) {
        return NextResponse.json({
          success: false,
          message: "يجب إدخال كلمة المرور الحالية والجديدة معًا.",
        }, { status: 400 });
      }

      if (!verifyPassword(currentPassword, user.passwordHash)) {
        return NextResponse.json({ success: false, message: "كلمة المرور الحالية غير صحيحة." }, { status: 400 });
      }
    }

    const updateData: {
      studentPhone?: string | null;
      passwordHash?: string;
    } = {
      studentPhone: studentPhone ?? user.studentPhone,
      passwordHash: newPassword ? hashPassword(newPassword) : user.passwordHash,
    };

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    if (theme) {
      await prisma.$executeRaw`UPDATE users SET theme = ${theme} WHERE id = ${user.id}`;
    }

    return NextResponse.json({
      success: true,
      message: studentPhone || theme ? "تم تحديث بيانات الطالب بنجاح." : "تم تحديث كلمة المرور بنجاح.",
    });
  } catch (error) {
    console.error("STUDENT_SETTINGS_ERROR", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "حدث خطأ أثناء تحديث إعدادات الطالب.",
    }, { status: 500 });
  }
}
