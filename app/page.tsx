'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'
import LanguageToggle from '@/components/LanguageToggle'

export default function Home() {
  const { t, brand } = useLanguage()

  return (
    <main className="min-h-screen bg-cream overflow-x-hidden">
      {/* NAV */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-5xl mx-auto gap-4">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg text-stone-850 shrink-0">
          <span className="text-xl">🪄</span> {brand}
        </Link>
        <div className="hidden md:flex gap-7 text-sm text-stone-750">
          <Link href="#pricing" className="hover:text-accent transition-colors">{t.nav.pricing}</Link>
          <Link href="#features" className="hover:text-accent transition-colors">{t.nav.features}</Link>
          <Link href="/dashboard" className="hover:text-accent transition-colors">{t.nav.dashboard}</Link>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle className="hidden sm:flex" />
          <Link
            href="/dashboard"
            className="bg-accent text-white px-5 py-2 rounded-organic-sm text-sm font-semibold hover:bg-accent-dark transition-colors shadow-lg shadow-accent/20 whitespace-nowrap"
          >
            {t.nav.getStarted}
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative px-6 pt-16 pb-24 text-center">
        {/* Organic blobs */}
        <div className="absolute top-[-40px] right-[-60px] w-[280px] h-[280px] bg-gradient-radial from-accent-soft to-transparent rounded-[60%_40%_50%_50%] opacity-60 animate-blob pointer-events-none" />
        <div className="absolute bottom-[-30px] left-[-40px] w-[220px] h-[220px] bg-gradient-radial from-yellow-200 to-transparent rounded-[50%_50%_40%_60%] opacity-40 animate-blob pointer-events-none" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-accent-wash to-transparent rounded-[45%_55%_55%_45%] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Logo mark */}
          <div className="w-[90px] h-[90px] mx-auto mb-6 bg-gradient-to-br from-accent to-yellow-400 rounded-[28px_40px_32px_36px] flex items-center justify-center text-4xl shadow-xl shadow-accent/25 -rotate-3">
            🪄
          </div>

          <div className="sm:hidden mb-6 flex justify-center">
            <LanguageToggle />
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-stone-850 leading-tight tracking-tight mb-4">
            {t.hero.title1}<br />
            {t.hero.titleAnd} <span className="text-accent relative inline-block">
              {t.hero.titleAccent}
              <span className="absolute bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-accent-soft to-yellow-200 rounded-full -z-10 opacity-70" />
            </span>
          </h1>

          <p className="text-stone-750 text-lg max-w-md mx-auto mb-8 leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/dashboard"
              className="bg-gradient-to-br from-accent to-accent-dark text-white px-7 py-3 rounded-organic-sm font-semibold text-sm hover:shadow-xl hover:shadow-accent/30 transition-all hover:-translate-y-0.5"
            >
              {t.hero.ctaSubtitles}
            </Link>
            <Link
              href="/dashboard"
              className="bg-white text-accent border-2 border-accent-soft px-7 py-3 rounded-organic-sm font-semibold text-sm hover:bg-accent-wash transition-all hover:-translate-y-0.5"
            >
              {t.hero.ctaBackgrounds}
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES — Scattered, no cards */}
      <section id="features" className="px-6 py-20 max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-850 mb-2">{t.features.heading}</h2>
          <p className="text-stone-750 text-sm">{t.features.sub}</p>
        </div>

        <div className="flex flex-col gap-8">
          {[
            { emoji: '🎬', bg: 'from-accent-soft to-orange-100', rotate: '-rotate-[5deg]', offset: 'rtl:ml-0 rtl:mr-12 mr-0 md:mr-12 rtl:md:mr-0 rtl:md:ml-12' },
            { emoji: '🖼️', bg: 'from-yellow-200 to-yellow-100', rotate: 'rotate-[3deg]', offset: 'ml-0 md:ml-12 rtl:md:ml-0 rtl:md:mr-12' },
            { emoji: '⚡', bg: 'from-green-200 to-green-100', rotate: '-rotate-[2deg]', offset: 'mr-0 md:mr-8 rtl:md:mr-0 rtl:md:ml-8' },
          ].map((style, i) => (
            <div
              key={i}
              className={`flex gap-5 items-start p-6 bg-white/70 backdrop-blur-sm rounded-organic border border-stone-650/50 hover:-translate-y-1 transition-transform ${style.offset}`}
            >
              <div className={`w-[50px] h-[50px] bg-gradient-to-br ${style.bg} rounded-[16px_20px_18px_22px] flex items-center justify-center text-2xl shrink-0 ${style.rotate}`}>
                {style.emoji}
              </div>
              <div>
                <h4 className="font-bold text-stone-850 mb-1">{t.features.items[i].title}</h4>
                <p className="text-stone-750 text-sm leading-relaxed">
                  {t.features.items[i].desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* UPLOAD PREVIEW */}
      <section className="px-6 py-16 max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-stone-850 mb-2">{t.upload.heading}</h2>
          <p className="text-stone-750 text-sm">{t.upload.sub}</p>
        </div>

        <div className="relative bg-gradient-to-br from-accent-wash to-orange-100 border-2 border-dashed border-accent-soft rounded-organic-lg p-12 text-center">
          <div className="absolute -top-3 right-8 rtl:right-auto rtl:left-8 w-16 h-16 bg-[radial-gradient(circle,#fbbf24_2px,transparent_2px)] bg-[length:12px_12px] opacity-50 rounded-full" />
          <div className="text-5xl mb-4 animate-float inline-block">📤</div>
          <h4 className="font-bold text-stone-850 mb-1">{t.upload.dropTitle}</h4>
          <p className="text-stone-750 text-sm">
            {t.upload.videoOrImage}<br />
            {t.upload.upTo} 500MB
          </p>
        </div>

        {/* File list preview */}
        <div className="mt-8 space-y-0">
          {[
            { emoji: '🎬', file: t.sampleFiles.f1, status: 'Done' as const, statusColor: 'bg-green-100 text-green-800' },
            { emoji: '🖼️', file: t.sampleFiles.f2, status: 'Processing' as const, statusColor: 'bg-orange-100 text-orange-800' },
            { emoji: '🎬', file: t.sampleFiles.f3, status: 'Done' as const, statusColor: 'bg-green-100 text-green-800' },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between py-3.5 border-b border-stone-650/50 hover:px-2 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-xl">{row.emoji}</span>
                <div>
                  <div className="font-medium text-sm text-stone-850">{row.file.name}</div>
                  <div className="text-xs text-stone-750">{row.file.meta}</div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${row.statusColor}`}>
                {t.fileStatus[row.status]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING — Floating pills */}
      <section id="pricing" className="px-6 py-20 max-w-lg mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-stone-850 mb-2">{t.pricing.heading}</h2>
          <p className="text-stone-750 text-sm">{t.pricing.sub}</p>
        </div>

        <div className="flex flex-col gap-4">
          {t.pricing.plans.map((plan, i) => (
            <div
              key={i}
              className={`flex justify-between items-center p-6 bg-white rounded-organic border transition-all hover:shadow-lg hover:border-accent-soft ${
                i === 1
                  ? 'border-accent-soft bg-gradient-to-r from-accent-wash to-orange-50 relative'
                  : 'border-stone-650/50'
              }`}
            >
              {i === 1 && (
                <span className="absolute -top-2.5 right-5 rtl:right-auto rtl:left-5 bg-accent text-white px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                  {t.pricing.popular}
                </span>
              )}
              <div>
                <div className="font-bold text-stone-850">{plan.name}</div>
                <div className="text-xs text-stone-750 mt-0.5">{plan.desc}</div>
              </div>
              <div className="text-2xl font-extrabold text-accent">{plan.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 text-center">
        <div className="max-w-md mx-auto bg-gradient-to-br from-accent-wash to-orange-100 rounded-organic p-10 border border-accent-soft">
          <h2 className="text-2xl font-bold text-stone-850 mb-3">{t.cta.heading}</h2>
          <p className="text-stone-750 text-sm mb-6">
            {t.cta.sub}
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-gradient-to-br from-accent to-accent-dark text-white px-8 py-3 rounded-organic-sm font-semibold text-sm hover:shadow-xl hover:shadow-accent/30 transition-all hover:-translate-y-0.5"
          >
            {t.cta.button}
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 text-stone-750 text-sm">
        <p className="mb-2">{t.footer.madeWith}</p>
        <div className="flex gap-6 justify-center">
          <Link href="#" className="hover:text-accent transition-colors">{t.footer.pricing}</Link>
          <Link href="#" className="hover:text-accent transition-colors">{t.footer.apiDocs}</Link>
          <Link href="#" className="hover:text-accent transition-colors">{t.footer.privacy}</Link>
          <Link href="#" className="hover:text-accent transition-colors">{t.footer.contact}</Link>
        </div>
      </footer>
    </main>
  )
}
