import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, validatePassword } from "@/lib/auth";

const registerSchema = z.object({
  username: z.string().min(3).max(40),
  password: z.string().min(8),
  nationalId: z.string().min(10).max(20),
  studentPhone: z.string().min(8).max(20),
  parentPhone: z.string().min(8).max(20),
  classLevel: z.enum([
    "THIRD_PREP",
    "FIRST_SECONDARY",
    "SECONDARY_2",
    "THIRD_SECONDARY",
  ]),
  displayName: z.string().min(2).max(80),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "البيانات المدخلة غير صحيحة." },
        { status: 400 }
      );
    }

    const { password, nationalId, studentPhone, parentPhone, classLevel, displayName } = parsed.data;
    const normalizedUsername = parsed.data.username.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({ where: { username: normalizedUsername } });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "اسم المستخدم مستخدم بالفعل، من فضلك اختر اسم مستخدم آخر.",
        },
        { status: 409 }
      );
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { success: false, message: passwordCheck.message },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        username: normalizedUsername,
        passwordHash: hashPassword(password),
        role: "STUDENT",
        nationalId,
        studentPhone,
        parentPhone,
        classLevel,
        studentProfile: {
          create: {
            displayName,
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم إنشاء الحساب بنجاح.",
      user: {
        id: user.id,
        username: user.username,
        classLevel: user.classLevel,
        displayName: user.studentProfile?.displayName,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "حدث خطأ أثناء إنشاء الحساب." },
      { status: 500 }
    );
  }
}
