const notifications = [
  { student: "أحمد علي", status: "لم يشاهد المحاضرة", teacher: "تم إرسال تنبيه", parent: "+966500000000" },
  { student: "سارة محمود", status: "تأخر في الواجب", teacher: "تم إرسال تنبيه", parent: "+966500000001" },
  { student: "يوسف خالد", status: "نتيجة ممتازة", teacher: "لم يتم التنبيه", parent: "+966500000002" },
];

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_25%),linear-gradient(180deg,#050816_0%,#0a1020_100%)] p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Notifications</p>
            <h1 className="mt-3 text-3xl font-black">تنبيهات أولياء الأمور</h1>
          </div>

          <button className="rounded-full bg-gradient-to-r from-emerald-400 to-lime-300 px-5 py-3 text-sm font-black text-slate-950">
            + إرسال تنبيه جماعي
          </button>
        </header>

        <section className="grid gap-5 md:grid-cols-3">
          {[
            { label: "إجمالي التنبيهات", value: "132" },
            { label: "المرسلة عبر واتساب", value: "89" },
            { label: "الغير مرسلة", value: "43" },
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
              <p className="text-sm text-slate-300">{item.label}</p>
              <p className="mt-3 text-3xl font-black">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold">سجل التنبيهات</h2>
            <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">تصدير</button>
          </div>

          <div className="space-y-4">
            {notifications.map((item) => (
              <div key={item.student} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-sky-300">{item.student}</p>
                  <h3 className="mt-1 text-xl font-bold">{item.status}</h3>
                  <p className="mt-1 text-sm text-slate-300">رقم ولي الأمر: {item.parent}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                    {item.teacher}
                  </span>
                  <button className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
                    إرسال واتساب
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
