"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";

const classLabels: Record<string, string> = {
  THIRD_PREP: "الثالث الإعدادي",
  FIRST_SECONDARY: "الأول الثانوي",
  SECONDARY_2: "الثاني الثانوي",
  THIRD_SECONDARY: "الثالث الثانوي",
};

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAssignments() {
    try {
      const response = await fetch("/api/assignments", { cache: "no-store" });
      const data = await response.json();
      setAssignments(data.assignments ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssignments();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_25%),linear-gradient(180deg,#050816_0%,#0a1020_100%)] text-white">
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 px-8 py-5 text-lg font-semibold">
          جاري تحميل الواجبات...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_25%),linear-gradient(180deg,#050816_0%,#0a1020_100%)] p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Assignments</p>
            <h1 className="mt-3 text-3xl font-black">إدارة الواجبات</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <BackButton fallback="/" />
            <a href="/teacher" className="rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-300 px-5 py-3 text-sm font-black text-slate-950">+ إنشاء واجب جديد</a>
          </div>
        </header>

        <section className="grid gap-5 md:grid-cols-4">
          {Object.entries(classLabels).map(([value, label]) => {
            const count = assignments.filter((item) => item.classLevel === value).length;
            return (
              <div key={value} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                <p className="text-sm text-slate-300">{label}</p>
                <p className="mt-3 text-3xl font-black">{count}</p>
              </div>
            );
          })}
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold">قائمة الواجبات</h2>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">{assignments.length} واجب</span>
          </div>

          <div className="space-y-4">
            {assignments.length ? assignments.map((assignment) => (
              <div key={assignment.id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-violet-300">{classLabels[assignment.classLevel] || assignment.classLevel}</p>
                  <h3 className="mt-1 text-xl font-bold">{assignment.title}</h3>
                  <p className="mt-1 text-sm text-slate-300">{assignment.description || "بدون وصف"}</p>
                  <p className="mt-1 text-sm text-slate-300">الأسئلة: {assignment.questionCount ?? assignment.questions?.length ?? 0}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${assignment.status === "OPEN" ? "bg-emerald-500/15 text-emerald-300" : assignment.status === "GRADED" ? "bg-sky-500/15 text-sky-300" : "bg-amber-500/15 text-amber-300"}`}>
                    {assignment.status === "OPEN" ? "مفتوح" : assignment.status === "GRADED" ? "مصحح" : "مغلق"}
                  </span>
                  <button className="rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
                    تفاصيل
                  </button>
                </div>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-slate-300">
                لا توجد واجبات في قاعدة البيانات بعد.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
