"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AdminDashboardData = {
  admin: { displayName: string };
  metrics: {
    totalStudents: number;
    passwordRequests: number;
    lessonCount: number;
    assignmentCount: number;
  };
  students: Array<{
    id: string;
    name: string;
    username: string;
    className: string;
    status: string;
  }>;
  lessons: Array<{
    id: string;
    title: string;
    classLevel: string;
    lessonNumber: number;
    status: string;
    duration: string | null;
  }>;
  assignments: Array<{
    id: string;
    title: string;
    classLevel: string;
    status: string;
    questionCount: number;
  }>;
};

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      const response = await fetch("/api/admin/dashboard", { cache: "no-store" });

      if (!response.ok) {
        router.push("/login");
        return;
      }

      const payload = await response.json();
      setData(payload);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (loading || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_25%),linear-gradient(180deg,#071512_0%,#0b1f1a_100%)] text-white">
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 px-8 py-5 text-lg font-semibold">
          جاري تحميل لوحة الإدارة...
        </div>
      </main>
    );
  }

  const overview = [
    { label: "إجمالي الطلاب", value: String(data.metrics.totalStudents) },
    { label: "طلبات تغيير كلمة المرور", value: String(data.metrics.passwordRequests) },
    { label: "المحاضرات", value: String(data.metrics.lessonCount) },
    { label: "الواجبات", value: String(data.metrics.assignmentCount) },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_25%),linear-gradient(180deg,#071512_0%,#0b1f1a_100%)] p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Admin Portal</p>
            <h1 className="mt-2 text-3xl font-black">لوحة الإدارة</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">
              {data.admin.displayName}
            </div>
            <button
              onClick={handleLogout}
              className="rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200"
            >
              تسجيل خروج
            </button>
          </div>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-4">
          {overview.map((card) => (
            <div key={card.label} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.35)]">
              <p className="text-sm text-slate-300">{card.label}</p>
              <p className="mt-3 text-3xl font-black">{card.value}</p>
            </div>
          ))}
        </section>

        <section className="mb-8 rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold">قائمة الطلاب</h2>
            <button className="rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 px-5 py-2.5 text-sm font-bold text-slate-950">
              + طالب جديد
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-300">
                  <th className="px-4 py-3">اسم الطالب</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">الصف</th>
                  <th className="px-4 py-3">الحالة</th>
                  <th className="px-4 py-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {data.students.length ? data.students.map((student) => (
                  <tr key={student.id} className="border-b border-white/10">
                    <td className="px-4 py-4">{student.name}</td>
                    <td className="px-4 py-4 text-emerald-300">{student.username}</td>
                    <td className="px-4 py-4">{student.className}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                        {student.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-200 hover:bg-emerald-500/20">
                        عرض
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-300">
                      لا توجد بيانات طلاب حالياً.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">المحاضرات</h2>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                {data.lessons.length}
              </span>
            </div>

            <div className="space-y-3">
              {data.lessons.length ? data.lessons.map((lesson) => (
                <div key={lesson.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold">{lesson.title}</p>
                      <p className="mt-1 text-sm text-slate-300">{lesson.classLevel} • المحاضرة {lesson.lessonNumber}</p>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                      {lesson.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">المدة: {lesson.duration ?? "غير محددة"}</p>
                </div>
              )) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-slate-300">
                  لا توجد محاضرات مسجلة حاليًا.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">الواجبات</h2>
              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-200">
                {data.assignments.length}
              </span>
            </div>

            <div className="space-y-3">
              {data.assignments.length ? data.assignments.map((assignment) => (
                <div key={assignment.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold">{assignment.title}</p>
                      <p className="mt-1 text-sm text-slate-300">{assignment.classLevel} • {assignment.questionCount} سؤال</p>
                    </div>
                    <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-200">
                      {assignment.status}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-slate-300">
                  لا توجد واجبات مسجلة حاليًا.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
