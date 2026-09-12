import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth";

async function ensureUserWithPassword({
  username,
  role,
  password,
  displayName,
  extraData,
}: {
  username: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  password: string;
  displayName: string;
  extraData?: Record<string, unknown>;
}) {
  const existing = await prisma.user.findUnique({ where: { username } });

  if (existing) {
    const matchesCurrentPassword = verifyPassword(password, existing.passwordHash);

    if (!matchesCurrentPassword) {
      await prisma.user.update({
        where: { username },
        data: { passwordHash: hashPassword(password) },
      });
    }

    return existing;
  }

  return prisma.user.create({
    data: {
      username,
      passwordHash: hashPassword(password),
      role,
      ...extraData,
      ...(role === "ADMIN" || role === "TEACHER"
        ? {
            teacherProfile: {
              create: { displayName },
            },
          }
        : {
            studentProfile: {
              create: { displayName },
            },
          }),
    },
  });
}

export async function ensureAdminUser() {
  return ensureUserWithPassword({
    username: "admin",
    role: "ADMIN",
    password: "Teacher@123",
    displayName: "مدير النظام",
  });
}

export async function ensureStudentDemoUser() {
  return ensureUserWithPassword({
    username: "yahya1",
    role: "STUDENT",
    password: "Student@123",
    displayName: "يحيى محمد",
    extraData: {
      nationalId: "1234567890",
      studentPhone: "0500000000",
      parentPhone: "0550000000",
      classLevel: "THIRD_SECONDARY",
    },
  });
}

export async function ensureTeacherDemoUser() {
  return ensureUserWithPassword({
    username: "teacher",
    role: "TEACHER",
    password: "Teacher@123",
    displayName: "المدرس الرئيسي",
    extraData: {
      studentPhone: "0550000000",
    },
  });
}
