const features = [
  { number: "01", title: "شرح بسيط ومفهوم", text: "نحوّل أصعب أفكار الكيمياء إلى خطوات واضحة تقدر تفهمها وتفتكرها." },
  { number: "02", title: "فيديوهات برسومات توضيحية", text: "محاضرات مرتبة بصريًا تساعدك تشوف الفكرة وتفهمها بدل ما تحفظها فقط." },
  { number: "03", title: "تمارين تفاعلية على الدروس", text: "طبّق بعد كل محاضرة واعرف مستواك ونتيجتك فورًا مع واجبات منظمة." },
  { number: "04", title: "مرونة كاملة في المذاكرة", text: "ذاكر وقت ما يناسبك ومن أي جهاز، وتابع تقدمك خطوة بخطوة." },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#060b16] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-70 [background:radial-gradient(circle_at_12%_8%,rgba(34,211,238,.18),transparent_26%),radial-gradient(circle_at_90%_24%,rgba(168,85,247,.14),transparent_25%),linear-gradient(180deg,#081324_0%,#060b16_65%,#030610_100%)]" />
      <div className="relative mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between border-b border-white/10 py-6">
          <a href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-violet-400 text-lg font-black text-slate-950 shadow-[0_0_30px_rgba(34,211,238,.28)]">K</span>
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.32em] text-cyan-300">Khaled Al-Bahrawi</span>
              <span className="block text-sm font-black text-white">Chemistry Academy</span>
            </span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#why" className="transition hover:text-cyan-300">ليه تشترك؟</a>
            <a href="#journey" className="transition hover:text-cyan-300">رحلتك</a>
            <a href="#contact" className="transition hover:text-cyan-300">تواصل معنا</a>
          </nav>
          <a href="/login" className="rounded-full border border-cyan-300/40 bg-cyan-400/10 px-5 py-2.5 text-sm font-bold text-cyan-100 transition hover:bg-cyan-400/20">دخول الطلاب</a>
        </header>

        <section className="grid min-h-[650px] items-center gap-14 py-20 lg:grid-cols-[1.1fr_.9fr] lg:py-28">
          <div className="text-right">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold text-cyan-200">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9]" /> بيتك الثاني لفهم الكيمياء
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
              منصتك الأولى لتعلم
              <span className="block bg-gradient-to-l from-cyan-200 via-sky-300 to-violet-300 bg-clip-text text-transparent">وفهم الكيمياء</span>
              <span className="block text-white">بأسلوب بسيط وممتع</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-9 text-slate-300 sm:text-xl">أهلاً بيك في بيتك التاني! سواء كنت في أولى، تانية، أو تالتة ثانوي، هنا هتلاقي كل اللي تحتاجه علشان تتفوق في الكيمياء، وتفهمها صح، وتطبقها بسهولة.</p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:justify-start">
              <a href="/register" className="rounded-2xl bg-gradient-to-l from-cyan-300 to-sky-400 px-7 py-4 text-center font-black text-slate-950 shadow-[0_12px_40px_rgba(34,211,238,.25)] transition hover:-translate-y-1">ابدأ رحلتك الآن</a>
              <a href="#why" className="rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-center font-bold text-slate-100 transition hover:border-cyan-300/50 hover:bg-cyan-300/10">اكتشف المنصة</a>
            </div>
          </div>

          <div id="journey" className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-cyan-400/20 via-violet-500/10 to-transparent blur-3xl" />
            <div className="relative rounded-[2.5rem] border border-white/15 bg-[#0d1829]/90 p-5 shadow-[0_30px_100px_rgba(0,0,0,.45)] backdrop-blur-xl">
              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[.09] to-white/[.02] p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-[11px] font-bold text-emerald-200">رحلة مستمرة</span>
                  <span className="text-3xl">⚗</span>
                </div>
                <h2 className="mt-10 text-3xl font-black leading-tight">افهمها، طبّقها،<br /><span className="text-cyan-300">واتفوّق فيها</span></h2>
                <p className="mt-4 leading-8 text-slate-300">كل محاضرة مصممة لتوصلك من أول الفكرة لحد التطبيق بثقة ووضوح.</p>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4"><p className="text-2xl font-black text-cyan-200">24/7</p><p className="mt-1 text-xs text-slate-300">مرونة في المذاكرة</p></div>
                  <div className="rounded-2xl border border-violet-300/20 bg-violet-300/10 p-4"><p className="text-2xl font-black text-violet-200">100%</p><p className="mt-1 text-xs text-slate-300">متابعة لتقدمك</p></div>
                </div>
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"><span className="text-2xl">🧠</span><div><p className="font-bold">تعلّم بذكاء</p><p className="text-xs text-slate-400">مش حفظ وخلاص</p></div></div>
              </div>
            </div>
          </div>
        </section>

        <section id="why" className="border-t border-white/10 py-20">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-sm font-bold uppercase tracking-[.3em] text-cyan-300">Why join us?</p><h2 className="mt-3 text-4xl font-black sm:text-5xl">ليه تشترك معانا؟</h2></div><p className="max-w-md leading-8 text-slate-400">تعليم الكيمياء مش لازم يكون معقد. إحنا بنخليه أقرب، أوضح، وأمتع.</p></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => <article key={feature.number} className="group rounded-[1.8rem] border border-white/10 bg-white/[.045] p-6 transition duration-300 hover:-translate-y-2 hover:border-cyan-300/30 hover:bg-cyan-300/[.07]"><span className="text-sm font-black text-cyan-300">{feature.number}</span><h3 className="mt-14 text-xl font-black">{feature.title}</h3><p className="mt-3 text-sm leading-7 text-slate-400">{feature.text}</p></article>)}
          </div>
        </section>

        <section id="contact" className="rounded-[2.5rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-violet-400/[.07] to-transparent p-8 text-center sm:p-14">
          <p className="text-sm font-bold uppercase tracking-[.3em] text-cyan-300">Khaled Al-Bahrawi</p><h2 className="mt-4 text-3xl font-black sm:text-5xl">جاهز تبدأ تفهم الكيمياء صح؟</h2><p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-300">انضم لرحلتنا التعليمية وخلي كل درس خطوة جديدة ناحية التفوق.</p><a href="/register" className="mt-8 inline-block rounded-2xl bg-white px-8 py-4 font-black text-slate-950 transition hover:-translate-y-1">أنشئ حسابك الآن</a>
        </section>
        <footer className="flex flex-col gap-3 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>Khaled Al-Bahrawi Chemistry Academy</span><span>تعليم أوضح. فهم أعمق. نتيجة أفضل.</span></footer>
      </div>
    </main>
  );
}
