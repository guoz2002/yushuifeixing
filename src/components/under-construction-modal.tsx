import Link from "next/link";

type UnderConstructionModalProps = {
  sectionLabel: string;
};

export function UnderConstructionModal({ sectionLabel }: UnderConstructionModalProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(27,197,201,0.16),_transparent_52%),radial-gradient(circle_at_bottom,_rgba(255,255,255,0.08),_transparent_48%)]" />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      <section className="relative z-10 mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
        <div className="w-full max-w-xl rounded-3xl border border-white/15 bg-black/70 p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:p-10">
          <p className="text-xs tracking-[0.28em] text-white/55">{sectionLabel.toUpperCase()}</p>
          <h1 className="mt-5 text-3xl font-light tracking-[0.12em] sm:text-4xl">正在设计中</h1>
          <p className="mt-4 text-base text-white/75 sm:text-lg">( ˶ˆᗜˆ˵ ) ♡</p>
          <p className="mt-2 text-sm text-white/55">该页面暂时不可进入，敬请期待。</p>
          <div className="mt-8">
            <Link
              className="inline-flex items-center justify-center rounded-full border border-cyan-200/45 px-6 py-2.5 text-sm tracking-[0.14em] text-cyan-100 transition hover:bg-cyan-200/15"
              href="/"
            >
              返回首页
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
