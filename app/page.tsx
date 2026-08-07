'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-cream overflow-x-hidden">
      {/* NAV */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg text-stone-850">
          <span className="text-xl">✨</span> SubMagic
        </Link>
        <div className="hidden md:flex gap-7 text-sm text-stone-750">
          <Link href="#pricing" className="hover:text-accent transition-colors">Pricing</Link>
          <Link href="#features" className="hover:text-accent transition-colors">Features</Link>
          <Link href="/dashboard" className="hover:text-accent transition-colors">Dashboard</Link>
        </div>
        <Link
          href="/dashboard"
          className="bg-accent text-white px-5 py-2 rounded-organic-sm text-sm font-semibold hover:bg-accent-dark transition-colors shadow-lg shadow-accent/20"
        >
          Get Started
        </Link>
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
            ✨
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-stone-850 leading-tight tracking-tight mb-4">
            Auto Subtitles<br />
            & <span className="text-accent relative inline-block">
              AI Backgrounds
              <span className="absolute bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-accent-soft to-yellow-200 rounded-full -z-10 opacity-70" />
            </span>
          </h1>

          <p className="text-stone-750 text-lg max-w-md mx-auto mb-8 leading-relaxed">
            Upload your video. Get perfect subtitles in Arabic & 99 languages.
            Upload your product. Get studio backgrounds in seconds.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/dashboard"
              className="bg-gradient-to-br from-accent to-accent-dark text-white px-7 py-3 rounded-organic-sm font-semibold text-sm hover:shadow-xl hover:shadow-accent/30 transition-all hover:-translate-y-0.5"
            >
              Try Subtitles Free →
            </Link>
            <Link
              href="/dashboard"
              className="bg-white text-accent border-2 border-accent-soft px-7 py-3 rounded-organic-sm font-semibold text-sm hover:bg-accent-wash transition-all hover:-translate-y-0.5"
            >
              Generate Backgrounds
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES — Scattered, no cards */}
      <section id="features" className="px-6 py-20 max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-850 mb-2">What you get</h2>
          <p className="text-stone-750 text-sm">No templates. No cards. Just clean, flowing design.</p>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex gap-5 items-start p-6 bg-white/70 backdrop-blur-sm rounded-organic border border-stone-650/50 hover:-translate-y-1 transition-transform mr-0 md:mr-12">
            <div className="w-[50px] h-[50px] bg-gradient-to-br from-accent-soft to-orange-100 rounded-[16px_20px_18px_22px] flex items-center justify-center text-2xl shrink-0 -rotate-[5deg]">
              🎬
            </div>
            <div>
              <h4 className="font-bold text-stone-850 mb-1">Auto Subtitles</h4>
              <p className="text-stone-750 text-sm leading-relaxed">
                AI listens to your video and writes every word. Arabic dialects included.
                Download as SRT, VTT, or burn directly into the video.
              </p>
            </div>
          </div>

          <div className="flex gap-5 items-start p-6 bg-white/70 backdrop-blur-sm rounded-organic border border-stone-650/50 hover:-translate-y-1 transition-transform ml-0 md:ml-12">
            <div className="w-[50px] h-[50px] bg-gradient-to-br from-yellow-200 to-yellow-100 rounded-[16px_20px_18px_22px] flex items-center justify-center text-2xl shrink-0 rotate-[3deg]">
              🖼️
            </div>
            <div>
              <h4 className="font-bold text-stone-850 mb-1">Background Generator</h4>
              <p className="text-stone-750 text-sm leading-relaxed">
                Remove any background from your product photo. Replace with white, gradient,
                or AI-generated lifestyle scenes.
              </p>
            </div>
          </div>

          <div className="flex gap-5 items-start p-6 bg-white/70 backdrop-blur-sm rounded-organic border border-stone-650/50 hover:-translate-y-1 transition-transform mr-0 md:mr-8">
            <div className="w-[50px] h-[50px] bg-gradient-to-br from-green-200 to-green-100 rounded-[16px_20px_18px_22px] flex items-center justify-center text-2xl shrink-0 -rotate-[2deg]">
              ⚡
            </div>
            <div>
              <h4 className="font-bold text-stone-850 mb-1">Lightning Fast</h4>
              <p className="text-stone-750 text-sm leading-relaxed">
                10-minute video processed in under 2 minutes. No queues, no waiting hours.
                Your time matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UPLOAD PREVIEW */}
      <section className="px-6 py-16 max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-stone-850 mb-2">Upload anything</h2>
          <p className="text-stone-750 text-sm">Drag, drop, done. No complicated forms.</p>
        </div>

        <div className="relative bg-gradient-to-br from-accent-wash to-orange-100 border-2 border-dashed border-accent-soft rounded-organic-lg p-12 text-center">
          <div className="absolute -top-3 right-8 w-16 h-16 bg-[radial-gradient(circle,#fbbf24_2px,transparent_2px)] bg-[length:12px_12px] opacity-50 rounded-full" />
          <div className="text-5xl mb-4 animate-float inline-block">📤</div>
          <h4 className="font-bold text-stone-850 mb-1">Drop your file here</h4>
          <p className="text-stone-750 text-sm">
            Video (MP4, MOV) or Image (PNG, JPG)<br />
            Up to 500MB
          </p>
        </div>

        {/* File list preview */}
        <div className="mt-8 space-y-0">
          {[
            { emoji: '🎬', name: 'tutorial_arabic.mp4', meta: '10:24 • 45MB', status: 'Done', statusColor: 'bg-green-100 text-green-800' },
            { emoji: '🖼️', name: 'product_shoe.png', meta: '2.4MB', status: 'Processing', statusColor: 'bg-orange-100 text-orange-800' },
            { emoji: '🎬', name: 'podcast_ep12.mp4', meta: '45:00 • 120MB', status: 'Done', statusColor: 'bg-green-100 text-green-800' },
          ].map((file, i) => (
            <div key={i} className="flex items-center justify-between py-3.5 border-b border-stone-650/50 hover:pl-2 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-xl">{file.emoji}</span>
                <div>
                  <div className="font-medium text-sm text-stone-850">{file.name}</div>
                  <div className="text-xs text-stone-750">{file.meta}</div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${file.statusColor}`}>
                {file.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING — Floating pills */}
      <section id="pricing" className="px-6 py-20 max-w-lg mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-stone-850 mb-2">Simple pricing</h2>
          <p className="text-stone-750 text-sm">Pay for what you use. No hidden fees.</p>
        </div>

        <div className="flex flex-col gap-4">
          {[
            { name: 'Free', desc: '10 min video + 5 images', price: '$0', popular: false },
            { name: 'Basic', desc: '60 min + 50 images / month', price: '$5', popular: true },
            { name: 'Pro', desc: '300 min + 200 images / month', price: '$15', popular: false },
          ].map((plan, i) => (
            <div
              key={i}
              className={`flex justify-between items-center p-6 bg-white rounded-organic border transition-all hover:shadow-lg hover:border-accent-soft ${
                plan.popular
                  ? 'border-accent-soft bg-gradient-to-r from-accent-wash to-orange-50 relative'
                  : 'border-stone-650/50'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 right-5 bg-accent text-white px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                  ★ Popular
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
          <h2 className="text-2xl font-bold text-stone-850 mb-3">Ready to try?</h2>
          <p className="text-stone-750 text-sm mb-6">
            Start free. No credit card required. Cancel anytime.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-gradient-to-br from-accent to-accent-dark text-white px-8 py-3 rounded-organic-sm font-semibold text-sm hover:shadow-xl hover:shadow-accent/30 transition-all hover:-translate-y-0.5"
          >
            Start Free →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 text-stone-750 text-sm">
        <p className="mb-2">Made with ✨ by SubMagic Team</p>
        <div className="flex gap-6 justify-center">
          <Link href="#" className="hover:text-accent transition-colors">Pricing</Link>
          <Link href="#" className="hover:text-accent transition-colors">API Docs</Link>
          <Link href="#" className="hover:text-accent transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-accent transition-colors">Contact</Link>
        </div>
      </footer>
    </main>
  )
}