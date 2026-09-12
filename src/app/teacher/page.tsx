"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

const classOptions = [
  { value: "THIRD_PREP", label: "الثالث الإعدادي" },
  { value: "FIRST_SECONDARY", label: "الأول الثانوي" },
  { value: "SECONDARY_2", label: "الثاني الثانوي" },
  { value: "THIRD_SECONDARY", label: "الثالث الثانوي" },
];

type TeacherSummary = {
  displayName: string;
};

type StudentRow = {
  id: string;
  name: string;
  username: string;
  classLevel: string;
  watched: string;
  status: string;
  parentPhone: string;
};

export default function TeacherDashboard() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<TeacherSummary>({ displayName: "المدرس" });
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [lessons, setLessons] = useState<Array<{
    id: string;
    title: string;
    classLevel: string;
    lessonNumber: number;
    status: string;
    duration: string | null;
    teacherName?: string;
    expiresAt?: string | null;
  }>>([]);
  const [assignments, setAssignments] = useState<Array<{ id: string; title: string; classLevel: string; status: string; questionCount: number }>>([]);
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    totalLessons: 0,
    totalAssignments: 0,
    averageProgress: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showTeacherSettings, setShowTeacherSettings] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [teacherSettingsMessage, setTeacherSettingsMessage] = useState("");
  const [teacherPasswordForm, setTeacherPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    classLevel: "THIRD_SECONDARY",
    lessonNumber: "1",
    duration: "00:00",
    status: "DRAFT",
    expiryHours: "24",
    video: null as File | null,
  });
  const [lessonMessage, setLessonMessage] = useState("");
  const [assignmentMessage, setAssignmentMessage] = useState("");
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    description: "",
    classLevel: "THIRD_SECONDARY",
    status: "OPEN",
    questions: [
      {
        text: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "A",
      },
    ],
  });

  async function loadDashboard() {
    try {
      const response = await fetch("/api/teacher/dashboard", { cache: "no-store" });

      if (!response.ok) {
        router.push("/login");
        return;
      }

      const data = await response.json();
      setTeacher(data.teacher ?? { displayName: "المدرس" });
      setStudents(data.students ?? []);
      setLessons(data.lessons ?? []);
      setAssignments(data.assignments ?? []);
      setMetrics(data.metrics ?? { totalStudents: 0, totalLessons: 0, totalAssignments: 0, averageProgress: 0 });
    } catch (error) {
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

  async function handleTeacherPasswordSave(e: React.FormEvent) {
    e.preventDefault();
    setTeacherSettingsMessage("");

    if (!teacherPasswordForm.currentPassword || !teacherPasswordForm.newPassword) {
      setTeacherSettingsMessage("يجب إدخال كلمة المرور الحالية والجديدة.");
      return;
    }

    if (teacherPasswordForm.newPassword !== teacherPasswordForm.confirmPassword) {
      setTeacherSettingsMessage("كلمة المرور الجديدة وتأكيدها غير متطابقتين.");
      return;
    }

    const response = await fetch("/api/teacher/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: teacherPasswordForm.currentPassword,
        newPassword: teacherPasswordForm.newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setTeacherSettingsMessage(data.message || "حدث خطأ أثناء تحديث كلمة المرور.");
      return;
    }

    setTeacherSettingsMessage(data.message || "تم تحديث كلمة المرور بنجاح.");
    setTeacherPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  }

  function formatVideoDuration(totalSeconds: number) {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);

    const pad = (value: number) => String(value).padStart(2, "0");

    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }

    return `${pad(mins)}:${pad(secs)}`;
  }

  function openNewLessonForm() {
    setEditingLessonId(null);
    setLessonMessage("");
    setLessonForm({
      title: "",
      description: "",
      classLevel: "THIRD_SECONDARY",
      lessonNumber: "1",
      duration: "00:00",
      status: "DRAFT",
      expiryHours: "24",
      video: null,
    });
    setShowLessonForm(true);
  }

  function startEditLesson(lesson: { id: string; title: string; classLevel: string; lessonNumber: number; status: string; duration: string | null; expiresAt?: string | null; }) {
    const expiryHours = lesson.expiresAt
      ? Math.max(1, Math.round((new Date(lesson.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60)))
      : 24;

    setEditingLessonId(lesson.id);
    setLessonMessage("");
    setLessonForm({
      title: lesson.title,
      description: "",
      classLevel: lesson.classLevel,
      lessonNumber: String(lesson.lessonNumber),
      duration: lesson.duration ?? "00:00",
      status: lesson.status,
      expiryHours: String(expiryHours),
      video: null,
    });
    setShowLessonForm(true);
  }

  function handleVideoSelection(file: File | null) {
    setLessonForm((current) => ({ ...current, video: file, duration: "00:00" }));

    if (!file) {
      return;
    }

    const videoUrl = URL.createObjectURL(file);
    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";
    videoElement.src = videoUrl;

    videoElement.onloadedmetadata = () => {
      const duration = Number.isFinite(videoElement.duration) ? videoElement.duration : 0;
      setLessonForm((current) => ({
        ...current,
        video: file,
        duration: formatVideoDuration(duration),
      }));
      URL.revokeObjectURL(videoUrl);
    };

    videoElement.onerror = () => {
      URL.revokeObjectURL(videoUrl);
    };
  }

  async function handleDeleteLesson(lessonId: string) {
    const response = await fetch("/api/lessons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lessonId }),
    });

    const data = await response.json();

    if (!response.ok) {
      setLessonMessage(data.message || "حدث خطأ أثناء حذف المحاضرة.");
      return;
    }

    setLessonMessage(data.message || "تم حذف المحاضرة.");
    await loadDashboard();
  }

  async function handleCreateLesson(e: React.FormEvent) {
    e.preventDefault();
    setLessonMessage("");

    if (!lessonForm.title) {
      setLessonMessage("يجب إدخال عنوان المحاضرة.");
      return;
    }

    setUploading(true);

    try {
      if (editingLessonId) {
        const response = await fetch("/api/lessons", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingLessonId,
            title: lessonForm.title,
            description: lessonForm.description,
            classLevel: lessonForm.classLevel,
            lessonNumber: Number(lessonForm.lessonNumber || 1),
            duration: lessonForm.duration,
            status: lessonForm.status,
            expiryHours: Number(lessonForm.expiryHours || 24),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setLessonMessage(data.message || "حدث خطأ أثناء تعديل المحاضرة.");
          return;
        }

        setLessonMessage(data.message || "تم تعديل المحاضرة بنجاح.");
      } else {
        if (!lessonForm.video) {
          setLessonMessage("يجب رفع ملف فيديو للحفظ.");
          return;
        }

        const formData = new FormData();
        formData.append("title", lessonForm.title);
        formData.append("description", lessonForm.description || "");
        formData.append("classLevel", lessonForm.classLevel);
        formData.append("lessonNumber", lessonForm.lessonNumber);
        formData.append("duration", lessonForm.duration);
        formData.append("status", lessonForm.status);
        formData.append("expiryHours", String(lessonForm.expiryHours || 24));
        formData.append("video", lessonForm.video);

        const response = await fetch("/api/lessons", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          setLessonMessage(data.message || "حدث خطأ أثناء إنشاء المحاضرة.");
          return;
        }

        setLessonMessage(data.message || "تم إنشاء المحاضرة بنجاح.");
      }

      setLessonForm({
        title: "",
        description: "",
        classLevel: "THIRD_SECONDARY",
        lessonNumber: "1",
        duration: "00:00",
        status: "DRAFT",
        expiryHours: "24",
        video: null,
      });
      setEditingLessonId(null);
      setShowLessonForm(false);
      await loadDashboard();
    } catch {
      setLessonMessage(editingLessonId ? "حدث خطأ أثناء تعديل المحاضرة." : "حدث خطأ أثناء رفع الملف.");
    } finally {
      setUploading(false);
    }
  }

  function addAssignmentQuestion() {
    setAssignmentForm((current) => ({
      ...current,
      questions: [
        ...current.questions,
        { text: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A" },
      ],
    }));
  }

  function updateQuestion(index: number, field: string, value: string) {
    setAssignmentForm((current) => ({
      ...current,
      questions: current.questions.map((question, questionIndex) =>
        questionIndex === index ? { ...question, [field]: value } : question
      ),
    }));
  }

  async function handleCreateAssignment(e: React.FormEvent) {
    e.preventDefault();
    setAssignmentMessage("");

    if (!assignmentForm.title.trim()) {
      setAssignmentMessage("يجب كتابة عنوان الواجب.");
      return;
    }

    const hasEmptyQuestion = assignmentForm.questions.some(
      (q) =>
        !q.text.trim() ||
        !q.optionA.trim() ||
        !q.optionB.trim() ||
        !q.optionC.trim() ||
        !q.optionD.trim()
    );

    if (hasEmptyQuestion) {
      setAssignmentMessage("يجب تعبئة كل الأسئلة والخيارات قبل الحفظ.");
      return;
    }

    try {
      const response = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: assignmentForm.title,
          description: assignmentForm.description,
          classLevel: assignmentForm.classLevel,
          status: assignmentForm.status,
          questions: assignmentForm.questions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAssignmentMessage(data.message || "حدث خطأ أثناء إنشاء الواجب.");
        return;
      }

      setAssignmentMessage(data.message || "تم إنشاء الواجب بنجاح.");
      setAssignmentForm({
        title: "",
        description: "",
        classLevel: "THIRD_SECONDARY",
        status: "OPEN",
        questions: [
          { text: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A" },
        ],
      });
      setShowAssignmentForm(false);
      await loadDashboard();
    } catch {
      setAssignmentMessage("حدث خطأ أثناء إنشاء الواجب.");
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_25%),linear-gradient(180deg,#050816_0%,#0a1020_100%)] text-white">
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 px-8 py-5 text-lg font-semibold">
          جاري تحميل لوحة المدرس...
        </div>
      </main>
    );
  }

  const overview = [
    { label: "إجمالي الطلاب", value: String(metrics.totalStudents) },
    { label: "جميع المحاضرات", value: String(metrics.totalLessons) },
    { label: "الواجبات المنشورة", value: String(metrics.totalAssignments) },
    { label: "معدل المشاهدة", value: `${metrics.averageProgress}%` },
  ];

  const hasPublishedLessons = lessons.length > 0;

  const absenceGroups = hasPublishedLessons
    ? students.reduce<Record<string, typeof students>>((acc, student) => {
        const group = student.classLevel || "غير محدد";
        if (!acc[group]) {
          acc[group] = [];
        }
        if (student.status === "لم يشاهد المحاضرة") {
          acc[group].push(student);
        }
        return acc;
      }, {})
    : {};

  const buildWhatsAppLink = (phone: string, studentName: string) => {
    const digits = phone.replace(/\D/g, "").replace(/^0/, "966");
    const text = `السلام عليكم، نود تنبيهكم أن الطالب ${studentName} لم يشاهد المحاضرة خلال 24 ساعة. يرجى متابعة الطالب والتواصل معنا عند الحاجة. شكرًا.`;
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_25%),linear-gradient(180deg,#050816_0%,#0a1020_100%)] p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Teacher Dashboard</p>
            <h1 className="mt-3 text-3xl font-black">لوحة المدرس</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <BackButton />
            <button
              onClick={() => setShowAttendance((current) => !current)}
              className="rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-sm font-black text-amber-100"
            >
              ＋ قسم الغياب
            </button>
            <button
              onClick={openNewLessonForm}
              className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-4 py-2 text-sm font-black text-slate-950"
            >
              + إنشاء محاضرة
            </button>
            <button
              onClick={() => setShowAssignmentForm(true)}
              className="rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-300 px-4 py-2 text-sm font-black text-slate-950"
            >
              + إنشاء واجب
            </button>
            <button
              onClick={() => setShowTeacherSettings(true)}
              className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200"
            >
              إعدادات الحساب
            </button>
            <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">
              {teacher.displayName}
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

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">متابعة مشاهدة المحاضرات</h2>
            <button className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-4 py-2 text-sm font-bold text-slate-950">
              المحاضرة الحالية
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-300">
                  <th className="px-4 py-3">اسم الطالب</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">الصف</th>
                  <th className="px-4 py-3">نسبة المشاهدة</th>
                  <th className="px-4 py-3">الحالة</th>
                  <th className="px-4 py-3">لولي الأمر</th>
                </tr>
              </thead>
              <tbody>
                {students.length ? students.map((student) => (
                  <tr key={student.id} className="border-b border-white/10">
                    <td className="px-4 py-4">{student.name}</td>
                    <td className="px-4 py-4 text-sky-300">{student.username}</td>
                    <td className="px-4 py-4">{student.classLevel}</td>
                    <td className="px-4 py-4">{student.watched}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${student.status === "شاهد المحاضرة" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <a
                        href={buildWhatsAppLink(student.parentPhone || "", student.name)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-sky-200 hover:bg-sky-500/20"
                      >
                        {student.parentPhone}
                      </a>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate-300">
                      لا توجد بيانات طلاب حالياً.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">محاضرات المدرس</h2>
            <button
              onClick={openNewLessonForm}
              className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-4 py-2 text-sm font-black text-slate-950"
            >
              + إضافة محاضرة
            </button>
          </div>

          <div className="grid gap-3">
            {lessons.length ? lessons.map((lesson) => (
              <div key={lesson.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-black text-white">{lesson.title}</p>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-300">
                      <span className="rounded-full border border-white/10 px-2 py-1">{lesson.classLevel}</span>
                      <span className="rounded-full border border-white/10 px-2 py-1">المحاضرة {lesson.lessonNumber}</span>
                      <span className="rounded-full border border-white/10 px-2 py-1">{lesson.status}</span>
                      <span className="rounded-full border border-white/10 px-2 py-1">مدة: {lesson.duration || "00:00"}</span>
                      {lesson.expiresAt ? (
                        <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-1 text-amber-100">
                          يحذف تلقائيًا: {new Date(lesson.expiresAt).toLocaleString("ar-EG")}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEditLesson(lesson)}
                      className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-2 text-xs font-bold text-sky-100"
                    >
                      تعديل
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-100"
                    >
                      حذف
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-300">تمت إضافتها بواسطة: {lesson.teacherName || teacher.displayName}</p>
              </div>
            )) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-5 text-slate-300">
                لا توجد محاضرات حالياً.
              </div>
            )}
          </div>
        </section>

        {showAttendance && hasPublishedLessons ? (
          <section className="mt-8 rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">قسم الغياب</h2>
              <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-200">
                متابعة خلال 24 ساعة
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {Object.entries(absenceGroups).length ? Object.entries(absenceGroups).map(([group, groupStudents]) => (
                <div key={group} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-4 text-lg font-black text-white">{group}</h3>
                  <div className="space-y-3">
                    {groupStudents.map((student) => (
                      <div key={student.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-3">
                        <div>
                          <p className="font-bold text-white">{student.name}</p>
                          <p className="text-xs text-slate-300">{student.username}</p>
                        </div>

                        <a
                          href={buildWhatsAppLink(student.parentPhone || "", student.name)}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white"
                        >
                          واتساب ولي الأمر
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-5 text-slate-300">
                  لا توجد حالات غياب حالياً.
                </div>
              )}
            </div>
          </section>
        ) : null}
      </div>

      {showAssignmentForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950 p-5 shadow-[0_30px_120px_rgba(15,23,42,0.8)]">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-2xl font-black text-white">إنشاء واجب</h3>
              <button
                type="button"
                onClick={() => setShowAssignmentForm(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-slate-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-300">عنوان الواجب</label>
                <input
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">الوصف</label>
                <textarea
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                  className="min-h-20 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-400"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">الصف المستهدف</label>
                  <select
                    value={assignmentForm.classLevel}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, classLevel: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-400"
                  >
                    {classOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">حالة الواجب</label>
                  <select
                    value={assignmentForm.status}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, status: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-400"
                  >
                    <option value="OPEN">مفتوح</option>
                    <option value="CLOSED">مغلق</option>
                    <option value="GRADED">مصحح</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {assignmentForm.questions.map((question, index) => (
                  <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-base font-bold text-white">السؤال {index + 1}</h4>
                      {index > 0 ? (
                        <button
                          type="button"
                          onClick={() => setAssignmentForm((current) => ({
                            ...current,
                            questions: current.questions.filter((_, questionIndex) => questionIndex !== index),
                          }))}
                          className="rounded-full border border-rose-400/30 bg-rose-500/10 px-2 py-1 text-xs text-rose-200"
                        >
                          حذف
                        </button>
                      ) : null}
                    </div>

                    <div className="space-y-3">
                      <input
                        value={question.text}
                        onChange={(e) => updateQuestion(index, "text", e.target.value)}
                        placeholder="نص السؤال"
                        className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-400"
                      />

                      <div className="grid gap-3 sm:grid-cols-2">
                        <input
                          value={question.optionA}
                          onChange={(e) => updateQuestion(index, "optionA", e.target.value)}
                          placeholder="الخيار A"
                          className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-400"
                        />
                        <input
                          value={question.optionB}
                          onChange={(e) => updateQuestion(index, "optionB", e.target.value)}
                          placeholder="الخيار B"
                          className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-400"
                        />
                        <input
                          value={question.optionC}
                          onChange={(e) => updateQuestion(index, "optionC", e.target.value)}
                          placeholder="الخيار C"
                          className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-400"
                        />
                        <input
                          value={question.optionD}
                          onChange={(e) => updateQuestion(index, "optionD", e.target.value)}
                          placeholder="الخيار D"
                          className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-400"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-slate-300">الإجابة الصحيحة</label>
                        <select
                          value={question.correctAnswer}
                          onChange={(e) => updateQuestion(index, "correctAnswer", e.target.value)}
                          className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-400"
                        >
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addAssignmentQuestion}
                className="rounded-full border border-violet-400/40 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-100"
              >
                + إضافة سؤال
              </button>

              {assignmentMessage ? (
                <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 px-4 py-3 text-sm text-violet-100">
                  {assignmentMessage}
                </div>
              ) : null}

              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-300 px-5 py-3 text-base font-bold text-slate-950"
              >
                حفظ الواجب
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {showLessonForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950 p-5 shadow-[0_30px_120px_rgba(15,23,42,0.8)]">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-2xl font-black text-white">إنشاء محاضرة</h3>
              <button
                type="button"
                onClick={() => setShowLessonForm(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-slate-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLesson} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-300">عنوان المحاضرة</label>
                <input
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">الوصف</label>
                <textarea
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  className="min-h-24 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">الصف المستهدف</label>
                  <select
                    value={lessonForm.classLevel}
                    onChange={(e) => setLessonForm({ ...lessonForm, classLevel: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
                  >
                    {classOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">رقم المحاضرة</label>
                  <input
                    type="number"
                    min={1}
                    value={lessonForm.lessonNumber}
                    onChange={(e) => setLessonForm({ ...lessonForm, lessonNumber: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">حالة النشر</label>
                  <select
                    value={lessonForm.status}
                    onChange={(e) => setLessonForm({ ...lessonForm, status: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
                  >
                    <option value="DRAFT">مسودة</option>
                    <option value="PUBLISHED">منشورة</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">مدة الاحتفاظ بالساعات</label>
                  <input
                    type="number"
                    min={1}
                    max={720}
                    value={lessonForm.expiryHours}
                    onChange={(e) => setLessonForm({ ...lessonForm, expiryHours: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              {!editingLessonId ? (
                <div>
                  <label className="mb-2 block text-sm text-slate-300">رفع ملف الفيديو</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleVideoSelection(e.target.files?.[0] ?? null)}
                    className="w-full rounded-2xl border border-dashed border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300 file:mr-3 file:rounded-full file:border-0 file:bg-sky-500/15 file:px-3 file:py-1.5 file:text-sky-200"
                  />
                  {lessonForm.video ? (
                    <div className="mt-3 space-y-1 text-xs text-sky-200">
                      <p>تم اختيار: {lessonForm.video.name}</p>
                      <p>المدة التلقائية: {lessonForm.duration}</p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
                  تم تفعيل تعديل المحاضرة الحالية. لن تحتاج إلى إعادة رفع الفيديو.
                </div>
              )}

              {lessonMessage ? (
                <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
                  {lessonMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={uploading}
                className="w-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-5 py-3 text-base font-bold text-slate-950 shadow-lg shadow-sky-500/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {uploading ? "جارٍ حفظ المحاضرة..." : editingLessonId ? "تحديث المحاضرة" : "حفظ المحاضرة"}
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {showTeacherSettings ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:p-4">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950 p-5 shadow-[0_30px_120px_rgba(15,23,42,0.8)]">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-2xl font-black text-white">تغيير كلمة المرور</h3>
              <button
                type="button"
                onClick={() => setShowTeacherSettings(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-slate-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTeacherPasswordSave} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-300">كلمة المرور الحالية</label>
                <input
                  type="password"
                  value={teacherPasswordForm.currentPassword}
                  onChange={(e) => setTeacherPasswordForm({ ...teacherPasswordForm, currentPassword: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  value={teacherPasswordForm.newPassword}
                  onChange={(e) => setTeacherPasswordForm({ ...teacherPasswordForm, newPassword: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">تأكيد كلمة المرور الجديدة</label>
                <input
                  type="password"
                  value={teacherPasswordForm.confirmPassword}
                  onChange={(e) => setTeacherPasswordForm({ ...teacherPasswordForm, confirmPassword: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
                />
              </div>

              {teacherSettingsMessage ? (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                  {teacherSettingsMessage}
                </div>
              ) : null}

              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 px-5 py-3 text-base font-bold text-slate-950"
              >
                حفظ كلمة المرور
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
