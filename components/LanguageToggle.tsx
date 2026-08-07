'use client'

import { useLanguage } from '@/lib/i18n'

export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, toggleLang } = useLanguage()

  return (
    <button
      onClick={toggleLang}
      className={`flex items-center gap-1.5 bg-white border border-stone-650/50 px-3 py-1.5 rounded-full text-xs font-bold text-stone-750 hover:border-accent hover:text-accent transition-colors ${className}`}
      aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <span className="text-sm">🌐</span>
      {lang === 'ar' ? 'English' : 'العربية'}
    </button>
  )
}
