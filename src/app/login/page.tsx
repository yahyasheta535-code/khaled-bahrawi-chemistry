"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        username: form.username.trim().toLowerCase(),
        password: form.password,
      };

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "حدث خطأ أثناء الدخول.");
        setLoading(false);
        return;
      }

      setMessage(data.message || "تم تسجيل الدخول بنجاح.");
      if (data.redirectTo) {
        await new Promise((resolve) => setTimeout(resolve, 250));
        router.replace(data.redirectTo);
        router.refresh();
        window.location.assign(data.redirectTo);
      }
    } catch (error) {
      setMessage("تعذر الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_30%),linear-gradient(180deg,#050816_0%,#0a1020_100%)] p-6 text-white">
      <div className="w-full max-w-[520px] rounded-[32px] border border-white/10 bg-[#111d2d]/90 p-6 shadow-[0_30px_120px_rgba(15,23,42,0.75)] backdrop-blur-md sm:p-8">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-semibold tracking-[0.25em] text-sky-300">منصة خالد صقر التعليمية</p>
          <h1 className="text-4xl font-black tracking-tight text-white">تسجيل دخول الطالب</h1>
          <p className="mt-3 text-sm text-slate-300">ادخل إلى محاضراتك وواجباتك ونتائجك في مكان واحد.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-right text-lg font-medium text-white/90">اسم المستخدم</label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              autoComplete="username"
              className="w-full rounded-2xl border border-white/10 bg-[#1a2437] px-4 py-4 text-right text-lg text-white placeholder:text-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="mb-2 block text-right text-lg font-medium text-white/90">كلمة المرور</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
              className="w-full rounded-2xl border border-white/10 bg-[#1a2437] px-4 py-4 text-right text-lg text-white placeholder:text-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-sky-400 via-cyan-300 to-cyan-200 px-5 py-4 text-xl font-black text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>

          {message ? (
            <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
              {message}
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3 text-sm">
            <a href="/register" className="text-sky-300 hover:text-sky-200">إنشاء حساب طالب</a>
            <BackButton />
          </div>
        </form>
      </div>
    </main>
  );
}
