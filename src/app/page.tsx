const pillars = [
  {
    title: "محاضرات تفاعلية",
    text: "تقسيم واضح للمحاضرات، شرح منظم، ومتابعة مستمرة لتقدم الطالب في كل وحدة دراسية.",
  },
  {
    title: "واجبات ذكية",
    text: "اختبارات دورية، متابعة الأداء، وتنظيم المهام لتقوية الفهم بشكل مستمر وتقييم فعلي.",
  },
  {
    title: "إدارة احترافية",
    text: "لوحة تحكم للمدرس تسمح بإدارة الصفوف، متابعة الطلاب، وتنظيم المحتوى داخل منصة واحدة.",
  },
];

const reasons = [
  "صفوف مخصصة بحسب المستوى الدراسي",
  "لوحة تحكم واضحة للمدرس",
  "متابعة مشاهدة المحاضرات",
  "إدارة الواجبات والنتائج",
  "تصميم متجاوب على الهاتف والجهاز اللوحي",
  "واجهة احترافية جاهزة للنشر",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_30%),linear-gradient(180deg,#050816_0%,#0a1020_100%)] text-white">
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-6 sm:px-8 lg:px-10">
        <header className="mb-16 flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-md shadow-[0_0_40px_rgba(96,165,250,0.15)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-cyan-300 to-emerald-300 text-lg font-black text-slate-950 shadow-lg shadow-cyan-500/30">
              K
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Khaled</p>
              <h1 className="text-lg font-bold tracking-wide">Al-Bahrawi</h1>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-slate-200 md:flex">
            <a href="#about" className="transition hover:text-sky-300">من نحن</a>
            <a href="#features" className="transition hover:text-sky-300">المميزات</a>
            <a href="#system" className="transition hover:text-sky-300">النظام</a>
            <a href="#contact" className="transition hover:text-sky-300">تواصل</a>
          </nav>

          <a
            href="/login"
            className="rounded-full border border-sky-400/40 bg-sky-500/10 px-5 py-2.5 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/20"
          >
            دخول الطلاب
          </a>
        </header>

        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-200">
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              منصة تعليمية متكاملة في الكيمياء
            </div>

            <h2 className="max-w-xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Khaled Al-Bahrawi
              <span className="mt-3 block bg-gradient-to-r from-sky-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
                Chemistry Academy
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
              منصة احترافية لتعليم الكيمياء تجمع بين المحاضرات، الواجبات، متابعة المشاهدة، وتحليل الأداء
              بشكل يرفع جودة التعليم ويمنح كل طالب تجربة مميزة وسريعة وواضحة.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="/register"
                className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-7 py-3.5 text-base font-bold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:scale-[1.02]"
              >
                ابدأ رحلتك الآن
              </a>
              <a
                href="/student"
                className="rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-base font-semibold text-slate-100 transition hover:border-sky-400/40 hover:bg-sky-500/10"
              >
                استعرض المنصة
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-sky-500/20 via-transparent to-emerald-400/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-5 shadow-[0_30px_120px_rgba(14,165,233,0.25)] backdrop-blur-xl">
              <div className="space-y-4 rounded-[1.7rem] border border-white/10 bg-white/5 p-4">
                <div className="rounded-[1.4rem] border border-sky-400/20 bg-gradient-to-r from-sky-500/10 to-cyan-500/5 p-5">
                  <div className="mb-3 flex items-center justify-between text-sm text-sky-100">
                    <span>رحلة تعليمية متكاملة</span>
                    <span className="rounded-full border border-sky-300/30 bg-sky-500/10 px-2 py-1 text-[10px] text-sky-200">LIVE</span>
                  </div>
                  <h3 className="text-2xl font-black text-white">تعلم بوضوح، خطوة بخطوة</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    شرح منظم، واجبات ذكية، ومتابعة مستمرة تجعل كل درس تجربة تعليمية سلسة ومميزة.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-center">
                    <div className="mb-2 text-2xl">🎓</div>
                    <p className="text-sm font-semibold text-white">محاضرات</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-center">
                    <div className="mb-2 text-2xl">🧠</div>
                    <p className="text-sm font-semibold text-emerald-100">واجبات</p>
                  </div>
                  <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4 text-center">
                    <div className="mb-2 text-2xl">📘</div>
                    <p className="text-sm font-semibold text-violet-100">متابعة</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-200">
                  <div className="mb-2 flex items-center gap-2 text-sky-200">
                    <span className="text-lg">✨</span>
                    <span className="font-semibold">محتوى مصمم بعناية</span>
                  </div>
                  <p className="leading-7 text-slate-300">
                    تصميم أنيق، واجهة نظيفة، وتجربة تعليمية تركز على الفهم والسهولة والاحترافية.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(15,23,42,0.35)]">
            <div className="mb-4 text-3xl">🎯</div>
            <p className="text-xl font-black text-white">محاور تعليمية واضحة</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">ترتيب متقن ومحتوى يساعد الطالب على الفهم بسرعة وثقة.</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(15,23,42,0.35)]">
            <div className="mb-4 text-3xl">💡</div>
            <p className="text-xl font-black text-white">تجربة مرنة ومميزة</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">واجهة أنيقة، سهلة الاستخدام، ومصممة لتناسب كل مرحلة من التعلم.</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(15,23,42,0.35)]">
            <div className="mb-4 text-3xl">🤝</div>
            <p className="text-xl font-black text-white">دعم مستمر</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">مساندة متواصلة للطالب والمعلم لتوفير بيئة تعليمية إيجابية.</p>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.35em] text-sky-300">Why us</p>
          <h3 className="text-3xl font-black text-white sm:text-4xl">مميزات المنصة</h3>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {pillars.map((item, index) => (
            <div key={item.title} className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-7 shadow-[0_20px_70px_rgba(15,23,42,0.45)]">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-300 text-lg font-bold text-slate-950">
                {index + 1}
              </div>
              <h4 className="text-2xl font-bold text-white">{item.title}</h4>
              <p className="mt-4 text-base leading-8 text-slate-300">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="system" className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300">System</p>
            <h3 className="mt-3 text-3xl font-black text-white">نظام متكامل من البداية إلى النهاية</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {reasons.map((reason) => (
              <div key={reason} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-200">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-emerald-300 text-xs font-bold text-slate-950">
                  ✓
                </span>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-sky-500/10 to-transparent p-6">
            <div className="flex h-28 w-28 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-sky-400 via-cyan-300 to-emerald-300 text-4xl font-black text-slate-950 shadow-lg shadow-sky-500/30">
              KB
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300">About</p>
            <h3 className="mt-4 text-3xl font-black text-white">منصة مخصصة لتعليم الكيمياء بذكاء واحترافية</h3>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              تم تصميم هذه المنصة لتجميع كل عناصر التعلم في واجهة واحدة: محاضرات، واجبات، درجات، متابعة
              مشاهدة الطلاب، ونظام تواصل مع أولياء الأمور. كل جزء تم تصميمه ليمنح المعلم و الطالب تجربة
              سلسة، احترافية، وسريعة.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-5 pb-24 pt-8 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] border border-sky-400/20 bg-gradient-to-r from-sky-500/15 to-cyan-500/10 p-8 text-center shadow-[0_0_60px_rgba(56,189,248,0.15)]">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Ready</p>
          <h3 className="mt-4 text-3xl font-black text-white sm:text-4xl">منصة خالد البحراوي</h3>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-200">
            واجهة جاهزة، ونظام متكامل لإدارة الصفوف، المحاضرات، والواجبات داخل منصة تعليمية احترافية.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a href="/register" className="rounded-full bg-white px-8 py-3.5 text-base font-bold text-slate-950 transition hover:scale-[1.02]">
              إنشاء حساب جديد
            </a>
            <a href="/login" className="rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-base font-bold text-white transition hover:border-sky-400/40 hover:bg-sky-500/10">
              تسجيل الدخول
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
