import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, hashPassword } from "@/lib/auth";
import { getCurrentSession } from "@/lib/session";

const settingsSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export async function PATCH(request: Request) {
  try {
    const session = await getCurrentSession();

    if (!session || session.role !== "TEACHER") {
      return NextResponse.json({ success: false, message: "غير مسجل دخول كمدرس" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "بيانات كلمة المرور غير صحيحة." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } });

    if (!user) {
      return NextResponse.json({ success: false, message: "المستخدم غير موجود." }, { status: 404 });
    }

    if (!verifyPassword(parsed.data.currentPassword, user.passwordHash)) {
      return NextResponse.json({ success: false, message: "كلمة المرور الحالية غير صحيحة." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashPassword(parsed.data.newPassword) },
    });

    return NextResponse.json({ success: true, message: "تم تحديث كلمة المرور بنجاح." });
  } catch (error) {
    return NextResponse.json({ success: false, message: "حدث خطأ أثناء تحديث كلمة المرور." }, { status: 500 });
  }
}
