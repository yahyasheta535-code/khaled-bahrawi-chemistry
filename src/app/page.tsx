const features = [
  { number: "01", title: "افهم جسمك", text: "نحوّل التفاصيل الكثيرة إلى صورة واضحة تربط بين أجهزة الجسم ووظائفها." },
  { number: "02", title: "ذاكر برؤية", text: "رسومات توضيحية ومحاضرات مرتبة تساعدك تشوف المعلومة قبل ما تحفظها." },
  { number: "03", title: "طبّق بعد كل درس", text: "واجبات تفاعلية تقيس فهمك وتكشف لك النقطة التي تحتاج مراجعة." },
  { number: "04", title: "تابع تقدّمك", text: "درجاتك ومشاهدتك في مكان واحد، لتعرف خطوتك القادمة بثقة." },
];

const classLevels = ["أولى ثانوي", "تانية ثانوي", "تالتة ثانوي"];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#081715] text-[#effaf3]">
      <div className="pointer-events-none fixed inset-0 [background:radial-gradient(circle_at_12%_8%,rgba(75,190,143,.18),transparent_28%),radial-gradient(circle_at_88%_20%,rgba(111,92,168,.18),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(230,143,100,.10),transparent_36%),linear-gradient(180deg,#0b211d_0%,#081715_55%,#07110f_100%)]" />
      <div className="relative mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between border-b border-[#d6f1df]/10 py-5">
          <a href="/" className="flex items-center gap-3" aria-label="الصفحة الرئيسية">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#86e0b5]/35 bg-[#173c34] text-lg font-black text-[#b8f3d0] shadow-[0_8px_25px_rgba(0,0,0,.22)]">K</span>
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-[#a6e9c1]">Khaled Saafan</span>
              <span className="block text-sm font-bold text-[#f4fcf6]">Biology Academy</span>
            </span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-[#b7cec1] md:flex">
            <a href="#about" className="hover:text-[#b8f3d0]">عن المنصة</a>
            <a href="#method" className="hover:text-[#b8f3d0]">طريقتنا</a>
            <a href="#contact" className="hover:text-[#b8f3d0]">تواصل معنا</a>
          </nav>
          <a href="/login" className="rounded-xl border border-[#86e0b5]/35 bg-[#12342f] px-5 py-2.5 text-sm font-bold text-[#ddf9e7] hover:bg-[#1b4a40]">دخول الطلاب</a>
        </header>

        <section className="grid items-center gap-14 py-20 lg:min-h-[650px] lg:grid-cols-[1.08fr_.92fr] lg:py-24">
          <div className="text-right">
            <div className="mb-7 inline-flex items-center gap-2 rounded-lg border border-[#86e0b5]/20 bg-[#12342f]/75 px-4 py-2 text-xs font-bold text-[#baf4d1]"><span className="h-2 w-2 rounded-full bg-[#86e0b5]" /> الأحياء ببساطة... وبصورة كاملة</div>
            <h1 className="max-w-3xl text-5xl font-black leading-[1.16] tracking-tight sm:text-6xl lg:text-[4.5rem]">شوف الحياة<br /><span className="text-[#a9edc5]">وافهمها صح</span></h1>
            <p className="mt-7 max-w-2xl text-lg leading-9 text-[#c7ddd0] sm:text-xl">مع خالد سعفان، الأحياء مش حفظ وخلاص. هتفهم جسمك، وتربط كل وظيفة بالصورة الكبيرة، وتدخل الامتحان وأنت واثق من كل إجابة.</p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:justify-start"><a href="/register" className="rounded-xl bg-[#a9edc5] px-7 py-4 text-center font-black text-[#0a2720] shadow-[0_12px_35px_rgba(93,210,155,.16)] hover:-translate-y-0.5 hover:bg-[#c4f7d7]">ابدأ رحلتك</a><a href="#method" className="rounded-xl border border-[#d6f1df]/15 bg-[#102a25] px-7 py-4 text-center font-bold text-[#e4f6ea] hover:border-[#86e0b5]/45 hover:bg-[#173a32]">اكتشف طريقتنا</a></div>
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm text-[#a9c2b4]"><span>✓ شرح بصري</span><span>✓ واجبات تفاعلية</span><span>✓ متابعة مستمرة</span></div>
          </div>

          <div id="about" className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-8 rounded-[3rem] bg-[#55c991]/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-[#d6f1df]/12 bg-[#0d2923]/95 p-5 shadow-[0_30px_90px_rgba(0,0,0,.32)]">
              <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full border-[18px] border-[#6e5ca8]/20" />
              <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full border-[16px] border-[#e58e68]/15" />
              <div className="relative rounded-[1.5rem] border border-[#d6f1df]/10 bg-[#12342c] p-6">
                <div className="flex items-center justify-between border-b border-[#d6f1df]/10 pb-5"><span className="text-sm font-bold text-[#baf4d1]">خطة مذاكرة الأحياء</span><span className="text-2xl text-[#a9edc5]">✦</span></div>
                <p className="mt-7 text-sm text-[#a9c2b4]">درس اليوم</p><h2 className="mt-2 text-3xl font-black leading-tight text-[#f3fbf5]">افهم الصورة،<br /><span className="text-[#a9edc5]">ثم ثبّت المعلومة</span></h2><p className="mt-4 leading-8 text-[#bad1c3]">كل جهاز في جسمك حكاية، وكل سؤال فرصة تربط أجزاء الحكاية ببعضها.</p>
                <div className="mt-7 space-y-3"><div className="flex items-center gap-3 rounded-xl border border-[#86e0b5]/15 bg-[#1b4639] p-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#31745b] text-[#c7f8d9]">1</span><span className="text-sm font-bold">شاهد المحاضرة</span><span className="mr-auto text-xs text-[#a9c2b4]">افهم</span></div><div className="flex items-center gap-3 rounded-xl border border-[#d6f1df]/10 bg-[#0e2923] p-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#385249] text-[#c9dcd0]">2</span><span className="text-sm font-bold">حلّ الواجب</span><span className="mr-auto text-xs text-[#a9c2b4]">طبّق</span></div><div className="flex items-center gap-3 rounded-xl border border-[#d6f1df]/10 bg-[#0e2923] p-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#385249] text-[#c9dcd0]">3</span><span className="text-sm font-bold">راجع نتيجتك</span><span className="mr-auto text-xs text-[#a9c2b4]">تقدّم</span></div></div>
              </div>
            </div>
          </div>
        </section>

        <section id="method" className="border-t border-[#d6f1df]/10 py-20"><div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-sm font-bold tracking-[.25em] text-[#a9edc5]">رحلة فهم متكاملة</p><h2 className="mt-3 text-4xl font-black sm:text-5xl">ذاكر الأحياء بعين مختلفة</h2></div><p className="max-w-md leading-8 text-[#a9c2b4]">مش هدفنا تحفظ أسماء كتير. هدفنا تفهم العلاقة بينهم، وتعرف تستخدمها في كل سؤال.</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map((feature) => <article key={feature.number} className="group rounded-2xl border border-[#d6f1df]/10 bg-[#0e2923]/75 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#86e0b5]/35 hover:bg-[#15382f]"><span className="text-sm font-black text-[#86e0b5]">{feature.number}</span><h3 className="mt-14 text-xl font-black text-[#edf9f0]">{feature.title}</h3><p className="mt-3 text-sm leading-7 text-[#a9c2b4]">{feature.text}</p></article>)}</div></section>

        <section className="grid gap-5 border-t border-[#d6f1df]/10 py-16 md:grid-cols-[.8fr_1.2fr] md:items-center"><div><p className="text-sm font-bold text-[#a9edc5]">محتوى مناسب لمرحلتك</p><h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">اختار صفك وابدأ<br />من أول خلية</h2></div><div className="grid gap-3 sm:grid-cols-3">{classLevels.map((level, index) => <div key={level} className="rounded-2xl border border-[#d6f1df]/10 bg-[#0e2923]/75 p-5"><span className="text-xs text-[#8eaaa0]">الصف {index + 1}</span><p className="mt-3 font-black text-[#e7f6eb]">{level}</p><p className="mt-2 text-xs leading-6 text-[#a9c2b4]">محاضرات وواجبات تناسب منهجك</p></div>)}</div></section>

        <section id="contact" className="rounded-3xl border border-[#86e0b5]/20 bg-[#12342c]/80 p-8 text-center sm:p-14"><p className="text-sm font-bold tracking-[.25em] text-[#baf4d1]">Khaled Saafan Biology Academy</p><h2 className="mt-4 text-3xl font-black sm:text-5xl">جاهز تكتشف الأحياء؟</h2><p className="mx-auto mt-4 max-w-2xl leading-8 text-[#c7ddd0]">سجّل حسابك، اختار صفك، وابدأ أول محاضرة. كل درس هيفتح لك جزء جديد من الصورة.</p><a href="/register" className="mt-8 inline-block rounded-xl bg-[#a9edc5] px-8 py-4 font-black text-[#0a2720] hover:-translate-y-0.5 hover:bg-[#c4f7d7]">إنشاء حساب جديد</a></section>
        <footer className="flex flex-col gap-3 py-8 text-sm text-[#8fa9a0] sm:flex-row sm:items-center sm:justify-between"><span>Khaled Saafan Biology Academy</span><span>افهم أكثر. اربط أفضل. نتيجة تفرحك.</span></footer>
      </div>
    </main>
  );
}
