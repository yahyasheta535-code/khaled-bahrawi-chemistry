"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

type LessonSummary = {
  id: string;
  title: string;
  lessonNumber: number;
  description: string;
  status: string;
  videoUrl: string;
  duration: string | null;
  progress: number;
};

type AssignmentSummary = {
  id: string;
  title: string;
  status: string;
  questionCount: number;
  result?: { score: number; total: number; percentage: number } | null;
  questions: { id: string; text: string; optionA: string; optionB: string; optionC: string; optionD: string }[];
};

type StudentProfile = {
  id: string;
  username: string;
  displayName: string;
  role: string;
  classLevel: string | null;
  nationalId: string | null;
  studentPhone: string | null;
  parentPhone: string | null;
  theme: string;
  stats: {
    lessons: number;
    assignments: number;
    results: number;
    progress: number;
  };
  lessons: LessonSummary[];
  assignments: AssignmentSummary[];
};

const initialProfile: StudentProfile = {
  id: "",
  username: "",
  displayName: "",
  role: "STUDENT",
  classLevel: null,
  nationalId: null,
  studentPhone: null,
  parentPhone: null,
  theme: "default",
  stats: { lessons: 0, assignments: 0, results: 0, progress: 0 },
  lessons: [],
  assignments: [],
};

const themePresets = {
  default: {
    shell: "radial-gradient(circle at top, rgba(56,189,248,0.18), transparent 25%), linear-gradient(180deg, #050816 0%, #0a1020 100%)",
    accent: "from-sky-400 to-cyan-300",
    soft: "bg-sky-500/10 text-sky-200 border-sky-400/30",
    button: "bg-sky-500/10 border-sky-400/40 text-sky-100",
    chip: "border-sky-400/50 bg-sky-500/10 text-sky-100",
  },
  violet: {
    shell: "radial-gradient(circle at top, rgba(168,85,247,0.18), transparent 25%), linear-gradient(180deg, #0d0718 0%, #160d24 100%)",
    accent: "from-violet-400 to-fuchsia-300",
    soft: "bg-violet-500/10 text-violet-200 border-violet-400/30",
    button: "bg-violet-500/10 border-violet-400/40 text-violet-100",
    chip: "border-violet-400/50 bg-violet-500/10 text-violet-100",
  },
  emerald: {
    shell: "radial-gradient(circle at top, rgba(34,197,94,0.18), transparent 25%), linear-gradient(180deg, #06140d 0%, #0b1d18 100%)",
    accent: "from-emerald-400 to-teal-300",
    soft: "bg-emerald-500/10 text-emerald-200 border-emerald-400/30",
    button: "bg-emerald-500/10 border-emerald-400/40 text-emerald-100",
    chip: "border-emerald-400/50 bg-emerald-500/10 text-emerald-100",
  },
  gold: {
    shell: "radial-gradient(circle at top, rgba(250,204,21,0.15), transparent 25%), linear-gradient(180deg, #161103 0%, #201a08 100%)",
    accent: "from-amber-400 to-yellow-300",
    soft: "bg-amber-500/10 text-amber-200 border-amber-400/30",
    button: "bg-amber-500/10 border-amber-400/40 text-amber-100",
    chip: "border-amber-400/50 bg-amber-500/10 text-amber-100",
  },
} as const;

const classLevelLabels: Record<string, string> = {
  THIRD_PREP: "الثالث الإعدادي",
  FIRST_SECONDARY: "الأول الثانوي",
  SECONDARY_2: "الثاني الثانوي",
  THIRD_SECONDARY: "الثالث الثانوي",
};

export default function StudentDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentProfile>(initialProfile);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentSummary | null>(null);
  const [answers, setAnswers] = useState<Record<string, "A" | "B" | "C" | "D">>({});
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  const [message, setMessage] = useState("");
  const [settingsForm, setSettingsForm] = useState({
    studentPhone: "",
    theme: "default",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [activeSettingsSection, setActiveSettingsSection] = useState<"profile" | "theme" | "password">("profile");

  const activeTheme = themePresets[(student.theme as keyof typeof themePresets) || "default"];

  const infoBlocks = useMemo(
    () => [
      { label: "رقم الهوية", value: student.nationalId || "غير موجود" },
      { label: "رقم الطالب", value: student.studentPhone || "غير موجود" },
      { label: "رقم ولي الأمر", value: student.parentPhone || "غير موجود" },
    ],
    [student]
  );

  async function loadStudent() {
    try {
      setLoading(true);
      const response = await fetch("/api/student/profile", { cache: "no-store", credentials: "same-origin" });

      if (!response.ok) {
        router.push("/login");
        return;
      }

      const data = await response.json();
      const profile = data.user ?? initialProfile;
      setStudent(profile);
      setSettingsForm({
        studentPhone: profile.studentPhone ?? "",
        theme: profile.theme ?? "default",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudent();
  }, []);

  useEffect(() => {
    document.body.style.background = activeTheme.shell;
    document.body.style.backgroundAttachment = "fixed";
    return () => {
      document.body.style.background = "";
      document.body.style.backgroundAttachment = "";
    };
  }, [activeTheme.shell]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    router.push("/login");
    router.refresh();
  }

  async function handleSettingsSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (settingsForm.newPassword && settingsForm.newPassword !== settingsForm.confirmPassword) {
      setMessage("كلمة المرور الجديدة وتأكيدها غير متطابقتين.");
      return;
    }

    const response = await fetch("/api/student/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        studentPhone: settingsForm.studentPhone,
        theme: settingsForm.theme,
        currentPassword: settingsForm.currentPassword || undefined,
        newPassword: settingsForm.newPassword || undefined,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "حدث خطأ أثناء حفظ الإعدادات.");
      return;
    }

    setMessage(data.message || "تم حفظ الإعدادات بنجاح.");
    setStudent((current) => ({
      ...current,
      theme: settingsForm.theme,
    }));
    await loadStudent();
    router.refresh();
    setShowSettings(false);
  }

  async function handleAssignmentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAssignment || submittingAssignment) return;
    setSubmittingAssignment(true);
    setMessage("");
    try {
      const response = await fetch("/api/assignments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          assignmentId: selectedAssignment.id,
          answers: selectedAssignment.questions.map((question) => ({ questionId: question.id, selectedOption: answers[question.id] ?? "A" })),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "تعذر إرسال الواجب.");
        return;
      }
      setMessage(`تم الإرسال: ${data.result.score}/${data.result.total} (${data.result.percentage}%).`);
      setSelectedAssignment(null);
      setAnswers({});
      await loadStudent();
    } catch {
      setMessage("حدث خطأ أثناء إرسال الواجب.");
    } finally {
      setSubmittingAssignment(false);
    }
  }

  function openAssignment(assignment: AssignmentSummary) {
    setMessage("");
    setAnswers({});
    setSelectedAssignment(assignment);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_25%),linear-gradient(180deg,#050816_0%,#0a1020_100%)] text-white">
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 px-8 py-5 text-lg font-semibold">
          جاري تحميل بيانات الطالب...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 text-white" style={{ background: activeTheme.shell }}>
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Student Portal</p>
            <h1 className="mt-3 text-3xl font-black">لوحة الطالب</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <BackButton />
            <button
              onClick={() => setShowSettings(true)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${activeTheme.soft}`}
            >
              إعدادات الطالب
            </button>
            <button
              onClick={handleLogout}
              className="rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200"
            >
              تسجيل خروج
            </button>
          </div>
        </header>

        <section className="mb-8 rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-300">مرحباً،</p>
              <h2 className="mt-2 text-3xl font-black">{student.displayName}</h2>
              <p className="mt-2 text-slate-300">
                {student.username} • {student.classLevel ? "الصف " + (classLevelLabels[student.classLevel] ?? student.classLevel) : "بدون صف"}
              </p>
            </div>

            <div className="grid w-full max-w-xl gap-3 sm:grid-cols-3">
              {infoBlocks.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.3)]">
                  <p className="mb-2 text-slate-300">{item.label}</p>
                  <p className="break-words text-base font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-4">
          {[
            { label: "المحاضرات", value: String(student.stats.lessons) },
            { label: "الواجبات", value: String(student.stats.assignments) },
            { label: "النتائج", value: String(student.stats.results) },
            { label: "نسبة الإنجاز", value: `${student.stats.progress}%` },
          ].map((card) => (
            <div key={card.label} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
              <p className="text-sm text-slate-300">{card.label}</p>
              <p className="mt-3 text-3xl font-black">{card.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">المحاضرات</h2>
            </div>

            <div className="space-y-4">
              {student.lessons.length ? student.lessons.map((lesson) => (
                <div key={lesson.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-sky-300">المحاضرة {lesson.lessonNumber}</p>
                      <h3 className="mt-1 text-xl font-bold">{lesson.title}</h3>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${lesson.status === "PUBLISHED" ? "bg-emerald-500/15 text-emerald-300" : "bg-sky-500/15 text-sky-300"}`}>
                      {lesson.status === "PUBLISHED" ? "متاحة" : "مسودة"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-300">{lesson.description}</p>

                  {lesson.videoUrl ? (
                    <div className="mt-4 space-y-3 rounded-2xl border border-sky-400/20 bg-sky-500/5 p-3">
                      <p className="text-sm text-sky-200">مدة المحاضرة: {lesson.duration || "غير محددة"}</p>

                      <video
                        controls
                        controlsList="nodownload nofullscreen noremoteplayback"
                        disablePictureInPicture
                        playsInline
                        muted={false}
                        preload="metadata"
                        className="w-full rounded-xl border border-white/10 bg-black"
                        src={lesson.videoUrl}
                        onContextMenu={(event) => event.preventDefault()}
                      />
                    </div>
                  ) : null}

                  <div className="mt-4">
                    <div className="mb-2 flex justify-between text-xs text-slate-300">
                      <span>التقدم</span>
                      <span>{lesson.progress}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300"
                        style={{ width: `${lesson.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-slate-300">
                  لا توجد محاضرات متاحة حالياً.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
            <h2 className="mb-5 text-2xl font-bold">الواجبات</h2>
            <div className="space-y-4">
              {student.assignments.length ? student.assignments.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openAssignment(item)}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-sky-400/50 bg-sky-500/10 text-xl text-sky-200 shadow-lg shadow-sky-500/10 transition hover:scale-[1.02]"
                        aria-label={`فتح الواجب ${item.title}`}
                      >
                        👤
                      </button>
                      <div>
                        <p className="text-lg font-bold">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-300">{item.questionCount} سؤال</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openAssignment(item)}
                      className={`rounded-full bg-gradient-to-r ${activeTheme.accent} px-4 py-2 text-sm font-bold text-slate-950`}
                    >
                      {item.result ? "عرض النتيجة" : "ابدأ"}
                    </button>
                  </div>

                  {item.result ? (
                    <p className="mt-2 text-sm text-emerald-300">
                      النتيجة: {item.result.percentage}% ({item.result.score}/{item.result.total})
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-amber-300">غير مُنجز بعد</p>
                  )}
                </div>
              )) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-slate-300">
                  لا توجد واجبات متاحة حالياً.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {selectedAssignment ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950 p-6 shadow-[0_30px_120px_rgba(15,23,42,0.75)]">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-2xl font-black text-white">{selectedAssignment.title}</h3>
              <button
                type="button"
                onClick={() => setSelectedAssignment(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-right">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200">
                <p className="text-sm text-slate-300">عدد الأسئلة</p>
                <p className="mt-2 text-xl font-bold text-white">{selectedAssignment.questionCount}</p>
              </div>

              {selectedAssignment.result ? (
                <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-emerald-200">
                  <p className="text-sm">النتيجة الحالية</p>
                  <p className="mt-2 text-2xl font-black">{selectedAssignment.result.percentage}%</p>
                  <p className="mt-1 text-sm">({selectedAssignment.result.score}/{selectedAssignment.result.total})</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-amber-200">
                  <p className="text-sm">الحالة</p>
                  <p className="mt-2 text-lg font-bold">غير مُنجز بعد</p>
                </div>
              )}
            </div>

            {!selectedAssignment.result ? (
              <form onSubmit={handleAssignmentSubmit} className="mt-6 space-y-5 text-right">
                {selectedAssignment.questions.map((question, index) => (
                  <fieldset key={question.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <legend className="px-2 font-bold text-white">{index + 1}. {question.text}</legend>
                    {(["A", "B", "C", "D"] as const).map((option) => {
                      const key = `option${option}` as "optionA" | "optionB" | "optionC" | "optionD";
                      return (
                        <label key={option} className="mt-3 flex cursor-pointer gap-3 rounded-xl border border-white/10 p-3 text-slate-200 hover:bg-white/10">
                          <input type="radio" name={question.id} checked={(answers[question.id] ?? "") === option} onChange={() => setAnswers((current) => ({ ...current, [question.id]: option }))} />
                          <span>{option}. {question[key]}</span>
                        </label>
                      );
                    })}
                  </fieldset>
                ))}
                {message ? <p className="rounded-xl bg-sky-500/10 p-3 text-sky-200">{message}</p> : null}
                <button type="submit" disabled={submittingAssignment} className={`w-full rounded-full bg-gradient-to-r ${activeTheme.accent} px-5 py-3 text-base font-bold text-slate-950 disabled:opacity-60`}>
                  {submittingAssignment ? "جارٍ إرسال الواجب..." : "إرسال الواجب"}
                </button>
              </form>
            ) : (
              <button type="button" onClick={() => setSelectedAssignment(null)} className={`mt-6 w-full rounded-full bg-gradient-to-r ${activeTheme.accent} px-5 py-3 text-base font-bold text-slate-950`}>إغلاق</button>
            )}
          </div>
        </div>
      ) : null}

      {showSettings ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:p-4">
          <div className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-[0_30px_120px_rgba(15,23,42,0.75)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h3 className="text-2xl font-black text-white">إعدادات الطالب</h3>
              <button onClick={() => setShowSettings(false)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-slate-300 transition hover:bg-white/10">
                ✕
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-5">
              <div className="mb-4 grid grid-cols-2 gap-2">
                {[
                  { key: "profile", label: "الحساب", icon: "👤" },
                  { key: "password", label: "كلمة المرور", icon: "🔒" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveSettingsSection(item.key as "profile" | "password")}
                    className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-center transition ${
                      activeSettingsSection === item.key
                        ? "border-sky-400/50 bg-sky-500/10 text-sky-100"
                        : "border-white/10 bg-slate-900/70 text-slate-300"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSettingsSave} className="space-y-4">
                {activeSettingsSection === "profile" ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-3 flex items-center gap-2 text-white">
                      <span className="text-xl">👤</span>
                      <h4 className="text-base font-bold">تغيير بيانات الحساب</h4>
                    </div>
                    <label className="mb-2 block text-sm text-slate-300">رقم الطالب</label>
                    <input
                      value={settingsForm.studentPhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, studentPhone: e.target.value })}
                      className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-400"
                    />
                  </div>
                ) : null}

                {activeSettingsSection === "password" ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-3 flex items-center gap-2 text-white">
                      <span className="text-xl">🔒</span>
                      <h4 className="text-base font-bold">تحديث كلمة المرور</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="mb-2 block text-sm text-slate-300">كلمة المرور الحالية</label>
                        <input
                          type="password"
                          value={settingsForm.currentPassword}
                          onChange={(e) => setSettingsForm({ ...settingsForm, currentPassword: e.target.value })}
                          className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-400"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-slate-300">كلمة المرور الجديدة</label>
                        <input
                          type="password"
                          value={settingsForm.newPassword}
                          onChange={(e) => setSettingsForm({ ...settingsForm, newPassword: e.target.value })}
                          className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-400"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-slate-300">تأكيد كلمة المرور الجديدة</label>
                        <input
                          type="password"
                          value={settingsForm.confirmPassword}
                          onChange={(e) => setSettingsForm({ ...settingsForm, confirmPassword: e.target.value })}
                          className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-400"
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                {message ? (
                  <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
                    {message}
                  </div>
                ) : null}

                <button type="submit" className={`w-full rounded-full bg-gradient-to-r ${activeTheme.accent} px-5 py-3 text-base font-bold text-slate-950 shadow-lg shadow-sky-500/20`}>
                  حفظ الإعدادات
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
