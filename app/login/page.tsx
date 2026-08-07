'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'
import LanguageToggle from '@/components/LanguageToggle'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const { t, brand } = useLanguage()
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  // Already logged in? Skip straight to the dashboard.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/dashboard')
    })
  }, [router])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setNotice('')
    setBusy(true)
    try {
      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) {
          setError(signInError.message)
          return
        }
        router.replace('/dashboard')
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        })
        if (signUpError) {
          setError(signUpError.message)
          return
        }
        if (data.session) {
          router.replace('/dashboard')
        } else {
          setNotice(t.auth.checkEmail)
        }
      }
    } catch {
      setError(t.auth.genericError)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen scene flex flex-col">
      <nav className="flex justify-between items-center px-4 sm:px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg text-text-hi">
          <span className="text-xl" aria-hidden="true">🪄</span> <span>{brand}</span>
        </Link>
        <LanguageToggle />
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm bg-panel border border-line rounded-card p-6 sm:p-8 animate-fade-up">
          <h1 className="font-display text-xl font-bold text-text-hi mb-6 text-center">
            {mode === 'login' ? t.auth.loginTitle : t.auth.signupTitle}
          </h1>

          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            {mode === 'signup' && (
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t.auth.fullName}
                className="w-full p-3 bg-panel-raised border border-line rounded-xl text-sm text-text-hi focus:outline-none focus:border-gold"
              />
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.auth.email}
              className="w-full p-3 bg-panel-raised border border-line rounded-xl text-sm text-text-hi focus:outline-none focus:border-gold"
              dir="ltr"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.auth.password}
              className="w-full p-3 bg-panel-raised border border-line rounded-xl text-sm text-text-hi focus:outline-none focus:border-gold"
              dir="ltr"
            />

            {error && (
              <div className="px-4 py-2.5 rounded-xl bg-danger-wash border border-danger/30 text-danger text-sm">
                {error}
              </div>
            )}
            {notice && (
              <div className="px-4 py-2.5 rounded-xl bg-teal-wash border border-teal/30 text-teal text-sm">
                {notice}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-gradient-to-b from-gold to-gold-dim text-white py-3 rounded-pill font-bold text-sm hover:shadow-gold transition-shadow disabled:opacity-60 mt-1"
            >
              {busy ? t.auth.loading : mode === 'login' ? t.auth.loginButton : t.auth.signupButton}
            </button>
          </form>

          <button
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login')
              setError('')
              setNotice('')
            }}
            className="w-full text-center text-sm text-teal hover:underline mt-4"
          >
            {mode === 'login' ? t.auth.switchToSignup : t.auth.switchToLogin}
          </button>
        </div>
      </div>
    </main>
  )
}
