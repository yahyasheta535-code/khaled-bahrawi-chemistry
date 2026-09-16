"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { PLATFORM_BRAND } from "@/lib/branding";

const classOptions = [
  { value: "THIRD_PREP", label: "الصف الثالث الإعدادي" },
  { value: "FIRST_SECONDARY", label: "الصف الأول الثانوي" },
  { value: "SECONDARY_2", label: "الصف الثاني الثانوي" },
  { value: "THIRD_SECONDARY", label: "الصف الثالث الثانوي" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
    nationalId: "",
    studentPhone: "",
    parentPhone: "",
    classLevel: "THIRD_PREP",
    displayName: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordStrength = useMemo(() => {
    const value = form.password;
    if (!value) return { label: "ضعيفة", color: "bg-red-500/20 text-red-300", progress: 15 };
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[a-z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;

    if (score <= 2) return { label: "ضعيفة", color: "bg-red-500/20 text-red-300", progress: 25 };
    if (score === 3) return { label: "متوسطة", color: "bg-yellow-500/20 text-yellow-300", progress: 55 };
    if (score === 4) return { label: "قوية", color: "bg-blue-500/20 text-blue-300", progress: 80 };
    return { label: "قوية جدًا", color: "bg-emerald-500/20 text-emerald-300", progress: 100 };
  }, [form.password]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMessage(data.message || "تمت العملية.");

      if (res.ok) {
        router.push("/login");
      }
    } catch (error) {
      setMessage("حدث خطأ أثناء إنشاء الحساب.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_30%),linear-gradient(180deg,#050816_0%,#0a1020_100%)] p-6 text-white">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_120px_rgba(15,23,42,0.6)] md:p-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">{PLATFORM_BRAND.fullName}</p>
          <h1 className="mt-3 text-3xl font-black">إنشاء حساب طالب</h1>
          <p className="mt-2 text-slate-300">سجّل بياناتك للانضمام إلى محاضرات الأحياء والواجبات والمتابعة.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">اسم المستخدم</label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              disabled={loading}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
              placeholder="مثل: ahmed2001"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">اسم الطالب</label>
            <input
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              disabled={loading}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
              placeholder="اسم الطالب بالكامل"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">كلمة المرور</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              disabled={loading}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
              placeholder="********"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">الرقم القومي</label>
            <input
              value={form.nationalId}
              onChange={(e) => setForm({ ...form, nationalId: e.target.value })}
              disabled={loading}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
              placeholder="12345678901234"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">رقم هاتف الطالب</label>
            <input
              value={form.studentPhone}
              onChange={(e) => setForm({ ...form, studentPhone: e.target.value })}
              disabled={loading}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
              placeholder="01000000000"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">رقم هاتف ولي الأمر</label>
            <input
              value={form.parentPhone}
              onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
              disabled={loading}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
              placeholder="01000000000"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-slate-300">الصف الدراسي</label>
            <select
              value={form.classLevel}
              onChange={(e) => setForm({ ...form, classLevel: e.target.value })}
              disabled={loading}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
            >
              {classOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-300">قوة كلمة المرور</span>
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${passwordStrength.color}`}>
                {passwordStrength.label}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 via-blue-500 to-emerald-400 transition-all"
                style={{ width: `${passwordStrength.progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              تنويه: يُرجى التأكد من أن رقم هاتفك ورقم هاتف ولي الأمر يعملان على WhatsApp.
            </p>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-5 py-3.5 text-base font-black text-slate-950 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-80"
            >
              {loading ? (
                <>
                  <span className="absolute inset-x-0 bottom-0 h-1 animate-pulse bg-white/70" />
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" aria-hidden="true" />
                  <span>جاري تجهيز حسابك...</span>
                </>
              ) : "إنشاء الحساب"}
            </button>
            {loading ? (
              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-sky-200/80" role="status" aria-live="polite">
                <span className="inline-flex gap-1" aria-hidden="true">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-300 [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-300 [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-300" />
                </span>
                نحفظ بياناتك بأمان، لا تغلق الصفحة
              </div>
            ) : null}
          </div>

          {message ? (
            <div className="md:col-span-2 rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
              {message}
            </div>
          ) : null}
          <div className="md:col-span-2 flex items-center justify-between gap-3 text-sm">
            <a href="/login" className="text-sky-300 hover:text-sky-200">لديك حساب؟ تسجيل الدخول</a>
            <BackButton />
          </div>
        </form>
      </div>
    </main>
  );
}
