'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'
import LanguageToggle from '@/components/LanguageToggle'

export default function Home() {
  const { t, brand } = useLanguage()

  return (
    <main className="min-h-screen scene overflow-x-hidden">
      {/* NAV */}
      <nav className="relative z-10 flex justify-between items-center px-5 sm:px-6 py-4 max-w-5xl mx-auto gap-3">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg text-text-hi shrink-0">
          <span className="text-xl" aria-hidden="true">🪄</span> {brand}
        </Link>
        <div className="hidden md:flex gap-7 text-sm text-text-lo">
          <Link href="#pricing" className="hover:text-gold transition-colors">{t.nav.pricing}</Link>
          <Link href="#features" className="hover:text-gold transition-colors">{t.nav.features}</Link>
          <Link href="/dashboard" className="hover:text-gold transition-colors">{t.nav.dashboard}</Link>
        </div>
        <div className="flex items-center gap-2.5">
          <LanguageToggle />
          <Link
            href="/dashboard"
            className="bg-gradient-to-b from-gold to-gold-dim text-white px-4 sm:px-5 py-2 rounded-pill text-sm font-bold hover:shadow-gold transition-shadow whitespace-nowrap"
          >
            {t.nav.getStarted}
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 px-5 sm:px-6 pt-14 sm:pt-20 pb-20 text-center">
        <div className="relative max-w-2xl mx-auto">
          {/* Logo mark — clapperboard slate, ties directly to the product */}
          <div className="w-16 h-16 mx-auto mb-7 bg-panel border border-line rounded-2xl flex items-center justify-center text-3xl shadow-panel">
            🪄
          </div>

          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-pill border border-line bg-panel/60 text-text-lo text-xs font-mono-num tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-teal" />
            {t.hero.subtitle.length > 0 ? brand.toUpperCase() : ''} · AI TOOLKIT
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold text-text-hi leading-[1.08] tracking-tight mb-5">
            {t.hero.title1}<br />
            {t.hero.titleAnd} <span className="text-gold">{t.hero.titleAccent}</span>
          </h1>

          <p className="text-text-lo text-base md:text-lg max-w-md mx-auto mb-9 leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/dashboard"
              className="bg-gradient-to-b from-gold to-gold-dim text-white px-6 py-3 rounded-pill font-bold text-sm hover:shadow-gold transition-shadow"
            >
              {t.hero.ctaSubtitles}
            </Link>
            <Link
              href="/dashboard"
              className="bg-panel text-text-hi border border-line px-6 py-3 rounded-pill font-semibold text-sm hover:border-teal hover:text-teal transition-colors"
            >
              {t.hero.ctaBackgrounds}
            </Link>
          </div>
        </div>
      </section>

      <div className="sprocket-rule max-w-5xl mx-auto" />

      {/* FEATURES */}
      <section id="features" className="relative z-10 px-5 sm:px-6 py-16 sm:py-20 max-w-3xl mx-auto">
        <div className="mb-12 max-w-md">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-hi mb-2">{t.features.heading}</h2>
          <p className="text-text-lo text-sm">{t.features.sub}</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { emoji: '🎬', tint: 'text-gold', wash: 'bg-gold-wash' },
            { emoji: '🖼️', tint: 'text-teal', wash: 'bg-teal-wash' },
            { emoji: '⚡', tint: 'text-gold', wash: 'bg-gold-wash' },
          ].map((style, i) => (
            <div
              key={i}
              className="flex sm:flex-col gap-4 items-start p-5 bg-panel/60 border border-line rounded-card hover:border-gold-dim transition-colors"
            >
              <div className={`w-11 h-11 shrink-0 ${style.wash} rounded-xl flex items-center justify-center text-xl`}>
                {style.emoji}
              </div>
              <div>
                <h4 className={`font-display font-semibold text-text-hi mb-1`}>{t.features.items[i].title}</h4>
                <p className="text-text-lo text-sm leading-relaxed">
                  {t.features.items[i].desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* UPLOAD PREVIEW — echoes the real drop zone in the dashboard */}
      <section className="relative z-10 px-5 sm:px-6 py-16 max-w-xl mx-auto">
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold text-text-hi mb-2">{t.upload.heading}</h2>
          <p className="text-text-lo text-sm">{t.upload.sub}</p>
        </div>

        <Link href="/dashboard" className="viewfinder block bg-panel border border-line rounded-card p-10 sm:p-12 text-center hover:border-gold-dim transition-colors">
          <span className="vf-tl" /><span className="vf-tr" /><span className="vf-bl" /><span className="vf-br" />
          <div className="text-4xl mb-4 animate-float inline-block">📤</div>
          <h4 className="font-semibold text-text-hi mb-1">{t.upload.dropTitle}</h4>
          <p className="text-text-lo text-sm">
            {t.upload.videoOrImage}<br />
            {t.upload.upTo} 500MB
          </p>
        </Link>

        <div className="mt-8">
          {[
            { emoji: '🎬', file: t.sampleFiles.f1, status: 'Done' as const, bar: 'bg-teal' },
            { emoji: '🖼️', file: t.sampleFiles.f2, status: 'Processing' as const, bar: 'bg-gold' },
            { emoji: '🎬', file: t.sampleFiles.f3, status: 'Done' as const, bar: 'bg-teal' },
          ].map((row, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b border-line last:border-0">
              <span className={`w-1 self-stretch rounded-full ${row.bar}`} />
              <span className="text-lg">{row.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-text-hi truncate">{row.file.name}</div>
                <div className="text-xs text-text-lo font-mono-num">{row.file.meta}</div>
              </div>
              <span className={`px-2.5 py-1 rounded-pill text-xs font-semibold ${row.status === 'Done' ? 'text-teal bg-teal-wash' : 'text-gold bg-gold-wash'}`}>
                {t.fileStatus[row.status]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="relative z-10 px-5 sm:px-6 py-16 sm:py-20 max-w-lg mx-auto">
        <div className="mb-10">
          <h2 className="font-display text-2xl font-bold text-text-hi mb-2">{t.pricing.heading}</h2>
          <p className="text-text-lo text-sm">{t.pricing.sub}</p>
        </div>

        <div className="flex flex-col gap-3">
          {t.pricing.plans.map((plan, i) => (
            <div
              key={i}
              className={`relative flex justify-between items-center p-5 rounded-card border transition-colors ${
                i === 1 ? 'border-gold bg-gold-wash' : 'border-line bg-panel/60 hover:border-line'
              }`}
            >
              {i === 1 && (
                <span className="absolute -top-2.5 right-5 rtl:right-auto rtl:left-5 bg-gold text-white px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                  {t.pricing.popular}
                </span>
              )}
              <div>
                <div className="font-display font-semibold text-text-hi">{plan.name}</div>
                <div className="text-xs text-text-lo mt-0.5">{plan.desc}</div>
              </div>
              <div className="font-mono-num text-xl font-bold text-gold">{plan.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-5 sm:px-6 py-16 text-center">
        <div className="max-w-md mx-auto bg-panel rounded-card p-9 sm:p-10 border border-line">
          <h2 className="font-display text-2xl font-bold text-text-hi mb-3">{t.cta.heading}</h2>
          <p className="text-text-lo text-sm mb-6">
            {t.cta.sub}
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-gradient-to-b from-gold to-gold-dim text-white px-7 py-3 rounded-pill font-bold text-sm hover:shadow-gold transition-shadow"
          >
            {t.cta.button}
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 text-center py-10 text-text-lo text-sm px-5">
        <p className="mb-3">{t.footer.madeWith}</p>
        <div className="flex gap-6 justify-center flex-wrap">
          <Link href="#" className="hover:text-gold transition-colors">{t.footer.pricing}</Link>
          <Link href="#" className="hover:text-gold transition-colors">{t.footer.apiDocs}</Link>
          <Link href="#" className="hover:text-gold transition-colors">{t.footer.privacy}</Link>
          <Link href="#" className="hover:text-gold transition-colors">{t.footer.contact}</Link>
        </div>
      </footer>
    </main>
  )
}
