'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Lang, translations, BRAND } from './translations'

interface LanguageContextType {
  lang: Lang
  t: (typeof translations)[Lang]
  brand: string
  setLang: (lang: Lang) => void
  toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'clipgenie-lang'

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default to Arabic — the primary audience for this product.
  const [lang, setLangState] = useState<Lang>('ar')

  // Pick up a saved preference (or the browser's language) after mount.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'ar' || saved === 'en') {
      setLangState(saved)
    } else if (navigator.language && !navigator.language.toLowerCase().startsWith('ar')) {
      setLangState('en')
    }
  }, [])

  // Keep <html lang/dir> and localStorage in sync with the chosen language.
  useEffect(() => {
    document.documentElement.lang = lang === 'ar' ? 'ar' : 'en'
    document.documentElement.dir = translations[lang].dir
    window.localStorage.setItem(STORAGE_KEY, lang)
  }, [lang])

  const setLang = (l: Lang) => setLangState(l)
  const toggleLang = () => setLangState((prev) => (prev === 'ar' ? 'en' : 'ar'))

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], brand: BRAND[lang], setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}
