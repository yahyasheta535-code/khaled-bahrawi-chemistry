const features = [
  { number: "01", title: "شرح يمشي معاك", text: "نبدأ من الفكرة الأساسية، ونبني عليها خطوة خطوة لحد ما الصورة تكمل." },
  { number: "02", title: "محاضرات مرتبة", text: "محتوى واضح تقدر ترجع له وقت ما تحتاج، من غير زحمة أو تشتّت." },
  { number: "03", title: "تدريب بعد كل درس", text: "حلّ، راجع إجابتك، واعرف النقطة التي تحتاج منك تركيزاً أكثر." },
  { number: "04", title: "متابعة حقيقية", text: "تقدّمك ونتائجك في مكان واحد حتى تعرف أنت وصلت لفين والخطوة الجاية إيه." },
];

const classLevels = ["أولى ثانوي", "تانية ثانوي", "تالتة ثانوي"];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0e1726] text-[#edf4f7]">
      <div className="pointer-events-none fixed inset-0 [background:radial-gradient(circle_at_5%_5%,rgba(64,160,174,.14),transparent_30%),radial-gradient(circle_at_95%_35%,rgba(48,93,128,.16),transparent_32%),linear-gradient(180deg,#101c2c_0%,#0e1726_58%,#0b1320_100%)]" />
      <div className="relative mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between border-b border-[#d4e3e6]/10 py-5">
          <a href="/" className="flex items-center gap-3" aria-label="الصفحة الرئيسية">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#8fd0d2]/30 bg-[#1b3442] text-lg font-black text-[#a8e3df] shadow-[0_8px_25px_rgba(0,0,0,.18)]">K</span>
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-[#a8d9d8]">Khaled Al-Bahrawi</span>
              <span className="block text-sm font-bold text-[#f4f8f8]">Chemistry Academy</span>
            </span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-[#b9cbd0] md:flex">
            <a href="#about" className="hover:text-[#a8e3df]">عن المنصة</a>
            <a href="#method" className="hover:text-[#a8e3df]">طريقة المذاكرة</a>
            <a href="#contact" className="hover:text-[#a8e3df]">تواصل معنا</a>
          </nav>
          <a href="/login" className="rounded-xl border border-[#8fd0d2]/35 bg-[#17313d] px-5 py-2.5 text-sm font-bold text-[#d4f1ef] hover:bg-[#214653]">دخول الطلاب</a>
        </header>

        <section className="grid items-center gap-14 py-20 lg:min-h-[650px] lg:grid-cols-[1.1fr_.9fr] lg:py-24">
          <div className="text-right">
            <div className="mb-7 inline-flex items-center gap-2 rounded-lg border border-[#8fd0d2]/20 bg-[#17313d]/70 px-4 py-2 text-xs font-bold text-[#b9e8e3]">
              <span className="h-2 w-2 rounded-full bg-[#8fd0d2]" /> الكيمياء على مهل... وبفهم
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-[1.16] tracking-tight sm:text-6xl lg:text-[4.5rem]">
              الكيمياء أبسط
              <span className="block text-[#9fe0dc]">مما تتخيل</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-9 text-[#c2d2d6] sm:text-xl">مع خالد البحراوي، هتفهم الفكرة قبل ما تحفظها، وتعرف تستخدمها في السؤال بثقة. محاضرات مرتبة، تدريب مستمر، ومتابعة تخليك عارف مستواك دائماً.</p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:justify-start">
              <a href="/register" className="rounded-xl bg-[#9fe0dc] px-7 py-4 text-center font-black text-[#10232d] shadow-[0_12px_35px_rgba(96,186,182,.16)] hover:-translate-y-0.5 hover:bg-[#b5ebe7]">ابدأ المذاكرة</a>
              <a href="#method" className="rounded-xl border border-[#d4e3e6]/15 bg-[#152437] px-7 py-4 text-center font-bold text-[#e2edef] hover:border-[#8fd0d2]/45 hover:bg-[#1a3041]">اعرف نظامنا</a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm text-[#a9bdc2]">
              <span>✓ شرح واضح</span><span>✓ واجبات بعد المحاضرة</span><span>✓ متابعة للتقدم</span>
            </div>
          </div>

          <div id="about" className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-[#4d9ca1]/10 blur-3xl" />
            <div className="relative rounded-[2rem] border border-[#d4e3e6]/12 bg-[#152437]/95 p-5 shadow-[0_30px_90px_rgba(0,0,0,.28)]">
              <div className="rounded-[1.5rem] border border-[#d4e3e6]/10 bg-[#192c40] p-6">
                <div className="flex items-center justify-between border-b border-[#d4e3e6]/10 pb-5"><span className="text-sm font-bold text-[#b9e8e3]">خطة المذاكرة</span><span className="text-2xl text-[#9fe0dc]">◌</span></div>
                <p className="mt-7 text-sm text-[#a9bdc2]">درس اليوم</p>
                <h2 className="mt-2 text-3xl font-black leading-tight text-[#f3f8f8]">افهم الفكرة،<br /><span className="text-[#9fe0dc]">ثم حلّ بإيدك</span></h2>
                <p className="mt-4 leading-8 text-[#b8cbd0]">كل جزء له وقته، وكل سؤال فرصة تعرف بها مستوى فهمك.</p>
                <div className="mt-7 space-y-3">
                  <div className="flex items-center gap-3 rounded-xl border border-[#8fd0d2]/15 bg-[#20384a] p-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#315c68] text-[#b8eee8]">1</span><span className="text-sm font-bold">شاهد المحاضرة</span><span className="mr-auto text-xs text-[#9fb4ba]">شرح</span></div>
                  <div className="flex items-center gap-3 rounded-xl border border-[#d4e3e6]/10 bg-[#142536] p-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#304254] text-[#c7d7da]">2</span><span className="text-sm font-bold">جرّب الواجب</span><span className="mr-auto text-xs text-[#9fb4ba]">تطبيق</span></div>
                  <div className="flex items-center gap-3 rounded-xl border border-[#d4e3e6]/10 bg-[#142536] p-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#304254] text-[#c7d7da]">3</span><span className="text-sm font-bold">راجع نتيجتك</span><span className="mr-auto text-xs text-[#9fb4ba]">تقدّم</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="method" className="border-t border-[#d4e3e6]/10 py-20">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-sm font-bold tracking-[.25em] text-[#9fe0dc]">طريقة بسيطة للنتيجة</p><h2 className="mt-3 text-4xl font-black sm:text-5xl">تذاكر صح من أول مرة</h2></div><p className="max-w-md leading-8 text-[#a9bdc2]">مش هدفنا إنك تخلص فيديوهات. هدفنا إنك تخرج من كل درس فاهم وتقدر تحل.</p></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map((feature) => <article key={feature.number} className="group rounded-2xl border border-[#d4e3e6]/10 bg-[#142536]/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#8fd0d2]/35 hover:bg-[#193244]"><span className="text-sm font-black text-[#8fd0d2]">{feature.number}</span><h3 className="mt-14 text-xl font-black text-[#edf4f7]">{feature.title}</h3><p className="mt-3 text-sm leading-7 text-[#a9bdc2]">{feature.text}</p></article>)}</div>
        </section>

        <section className="grid gap-5 border-t border-[#d4e3e6]/10 py-16 md:grid-cols-[.8fr_1.2fr] md:items-center">
          <div><p className="text-sm font-bold text-[#9fe0dc]">مناسب لطلاب الثانوي</p><h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">اختار صفك وابدأ<br />من مكانك</h2></div>
          <div className="grid gap-3 sm:grid-cols-3">{classLevels.map((level, index) => <div key={level} className="rounded-2xl border border-[#d4e3e6]/10 bg-[#142536]/70 p-5"><span className="text-xs text-[#8da5ab]">الصف {index + 1}</span><p className="mt-3 font-black text-[#e7f1f2]">{level}</p><p className="mt-2 text-xs leading-6 text-[#9fb4ba]">محاضرات وواجبات مناسبة لمنهجك</p></div>)}</div>
        </section>

        <section id="contact" className="rounded-3xl border border-[#8fd0d2]/20 bg-[#17313d]/75 p-8 text-center sm:p-14"><p className="text-sm font-bold tracking-[.25em] text-[#b9e8e3]">Khaled Al-Bahrawi</p><h2 className="mt-4 text-3xl font-black sm:text-5xl">جاهز تبدأ؟ خلّي أول خطوة النهارده</h2><p className="mx-auto mt-4 max-w-2xl leading-8 text-[#c2d2d6]">سجّل حسابك، اختار صفك، وابدأ أول محاضرة. كل درس تخلصه بيقرّبك من الدرجة اللي بتتمناها.</p><a href="/register" className="mt-8 inline-block rounded-xl bg-[#9fe0dc] px-8 py-4 font-black text-[#10232d] hover:-translate-y-0.5 hover:bg-[#b5ebe7]">إنشاء حساب جديد</a></section>
        <footer className="flex flex-col gap-3 py-8 text-sm text-[#849ba2] sm:flex-row sm:items-center sm:justify-between"><span>Khaled Al-Bahrawi Chemistry Academy</span><span>افهم أكثر. حلّ أفضل. نتيجة تفرحك.</span></footer>
      </div>
    </main>
  );
}
