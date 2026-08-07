'use client'

import { useLanguage } from '@/lib/i18n'

export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, toggleLang } = useLanguage()

  return (
    <button
      onClick={toggleLang}
      className={`flex items-center gap-1.5 bg-panel-raised border border-line px-3 py-1.5 rounded-pill text-xs font-semibold text-text-lo hover:border-gold hover:text-gold transition-colors ${className}`}
      aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <span aria-hidden="true">🌐</span>
      {lang === 'ar' ? 'EN' : 'AR'}
    </button>
  )
}
