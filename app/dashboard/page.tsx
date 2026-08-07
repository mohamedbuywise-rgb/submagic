'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Session } from '@supabase/supabase-js'
import { useLanguage } from '@/lib/i18n'
import LanguageToggle from '@/components/LanguageToggle'
import { supabase } from '@/lib/supabaseClient'

interface Profile {
  full_name: string | null
  email: string
  credits_minutes: number
  credits_images: number
}

interface RecentJob {
  id: string
  tool: string
  file_name: string | null
  status: string
  result_url: string | null
  created_at: string
}

type ToolTab = 'subtitles' | 'remove-bg' | 'tts' | 'audio' | 'compress' | 'noise' | 'speed' | 'convert'

interface ToolMeta {
  id: ToolTab
  emoji: string
  accept: string
  maxSize: string
  optionValues?: string[]
}

// Static, language-independent config. Display strings (name/desc/option labels)
// come from the translations dictionary via useLanguage() below.
const TOOL_META: ToolMeta[] = [
  { id: 'subtitles', emoji: '🎬', accept: 'video/*', maxSize: '500MB', optionValues: ['srt', 'burn-classic', 'burn-tiktok', 'burn-box', 'burn-glow', 'burn-minimal'] },
  { id: 'remove-bg', emoji: '✂️', accept: 'image/*', maxSize: '50MB' },
  { id: 'tts', emoji: '🔊', accept: 'text/plain', maxSize: '1MB', optionValues: ['ar', 'en', 'fr'] },
  { id: 'audio', emoji: '🎙️', accept: 'video/*,audio/*', maxSize: '500MB' },
  { id: 'compress', emoji: '📦', accept: 'video/*', maxSize: '1GB', optionValues: ['low', 'medium', 'high'] },
  { id: 'noise', emoji: '🔇', accept: 'video/*,audio/*', maxSize: '500MB' },
  { id: 'speed', emoji: '⚡', accept: 'video/*', maxSize: '500MB', optionValues: ['0.5', '0.75', '1.25', '1.5', '2.0'] },
  { id: 'convert', emoji: '🔄', accept: 'video/*,image/*', maxSize: '1GB', optionValues: ['mp4', 'mov', 'avi', 'webm', 'gif', 'mkv'] },
]

// Maps each tool to the real API route wired up in app/api/*, and to the
// extra form fields that route expects (see each route.ts for the contract).
const TOOL_ENDPOINTS: Record<
  ToolTab,
  {
    url: string
    needsFile: boolean
    fields: (ctx: { option: string; lang: string }) => Record<string, string>
  }
> = {
  subtitles: {
    url: '/api/transcribe',
    needsFile: true,
    fields: ({ option, lang }) =>
      option.startsWith('burn-')
        ? { format: 'burn', style: option.slice(5), language: lang }
        : { format: option || 'srt', style: 'classic', language: lang },
  },
  'remove-bg': { url: '/api/remove-bg', needsFile: true, fields: () => ({}) },
  tts: { url: '/api/tts', needsFile: false, fields: ({ option }) => ({ language: option || 'ar' }) },
  audio: { url: '/api/audio-enhance', needsFile: true, fields: () => ({}) },
  compress: { url: '/api/compress', needsFile: true, fields: ({ option }) => ({ quality: option || 'medium' }) },
  noise: { url: '/api/noise-removal', needsFile: true, fields: () => ({}) },
  speed: { url: '/api/speed', needsFile: true, fields: ({ option }) => ({ speed: option || '1.0' }) },
  convert: { url: '/api/convert', needsFile: true, fields: ({ option }) => ({ format: option || 'mp4' }) },
}

type JobStatus = 'idle' | 'uploading' | 'queued' | 'processing' | 'done' | 'failed'

interface JobState {
  status: JobStatus
  jobId?: string
  result?: Record<string, unknown>
  error?: string
}

function parseSizeToBytes(label: string): number {
  const match = label.match(/^([\d.]+)\s*(KB|MB|GB)$/i)
  if (!match) return Infinity
  const value = parseFloat(match[1])
  const unit = match[2].toUpperCase()
  const mult = unit === 'GB' ? 1024 ** 3 : unit === 'MB' ? 1024 ** 2 : 1024
  return value * mult
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GB`
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024).toFixed(0)} KB`
}

function acceptMatches(accept: string, file: File): boolean {
  if (!file.type) return true // some mobile browsers omit MIME type — don't block on it
  return accept.split(',').some((pattern) => {
    const p = pattern.trim()
    if (p.endsWith('/*')) return file.type.startsWith(p.slice(0, -1))
    return file.type === p
  })
}

// Maps a tool id to the emoji shown next to it in the recent-files list.
const TOOL_EMOJI: Record<string, string> = {
  subtitles: '🎬', 'remove-bg': '🖼️', tts: '🔊', audio: '🎙️',
  compress: '📦', noise: '🔇', speed: '⚡', convert: '🔄',
}

export default function Dashboard() {
  const { t, lang, brand } = useLanguage()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ToolTab>('subtitles')
  const [isDragging, setIsDragging] = useState(false)
  const [selectedOption, setSelectedOption] = useState('')
  const [textInput, setTextInput] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fieldError, setFieldError] = useState('')
  const [job, setJob] = useState<JobState>({ status: 'idle' })
  const [elapsedSec, setElapsedSec] = useState(0)

  // Real auth/session state — no signed-in user, no dashboard.
  const [session, setSession] = useState<Session | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Gate the whole dashboard behind a real Supabase session — redirect
  // anonymous visitors to /login instead of showing fake account data.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/login')
        return
      }
      setSession(data.session)
      setCheckingSession(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (!newSession) router.replace('/login')
    })
    return () => sub.subscription.unsubscribe()
  }, [router])

  // Once we have a session, load the real profile (credits) and the
  // user's actual job history — nothing hardcoded, empty until they exist.
  const loadProfileAndJobs = useCallback(async () => {
    if (!session) return
    const { data: profileRow } = await supabase
      .from('profiles')
      .select('full_name, email, credits_minutes, credits_images')
      .eq('id', session.user.id)
      .single()
    if (profileRow) setProfile(profileRow as Profile)

    const { data: jobRows } = await supabase
      .from('jobs')
      .select('id, tool, file_name, status, result_url, created_at')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(10)
    if (jobRows) setRecentJobs(jobRows as RecentJob[])
  }, [session])

  useEffect(() => {
    loadProfileAndJobs()
  }, [loadProfileAndJobs])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  const currentMeta = TOOL_META.find((m) => m.id === activeTab)!
  const currentTool = t.tools[activeTab]
  const endpoint = TOOL_ENDPOINTS[activeTab]
  const isBusy = job.status === 'uploading' || job.status === 'queued' || job.status === 'processing'

  const clearTimers = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current)
    if (tickRef.current) clearInterval(tickRef.current)
    pollRef.current = null
    tickRef.current = null
  }, [])

  useEffect(() => () => clearTimers(), [clearTimers])

  const resetForNewTool = (id: ToolTab) => {
    clearTimers()
    setActiveTab(id)
    setSelectedOption('')
    setTextInput('')
    setSelectedFile(null)
    setFieldError('')
    setJob({ status: 'idle' })
    setElapsedSec(0)
  }

  const validateFile = (file: File): string | null => {
    if (!acceptMatches(currentMeta.accept, file)) return t.alerts.wrongFileType
    if (file.size > parseSizeToBytes(currentMeta.maxSize)) return t.alerts.fileTooLarge
    return null
  }

  const applyFile = (file: File) => {
    const err = validateFile(file)
    if (err) {
      setFieldError(err)
      return
    }
    setFieldError('')
    setSelectedFile(file)
  }

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) applyFile(file)
    },
    [currentMeta]
  )

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) applyFile(file)
    e.target.value = ''
  }

  const pollStatus = (jobId: string) => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/status/${jobId}`)
        const data = await res.json()
        if (data.status === 'done') {
          clearTimers()
          setJob({ status: 'done', jobId, result: data.result })
          loadProfileAndJobs()
        } else if (data.status === 'failed') {
          clearTimers()
          setJob({ status: 'failed', jobId, error: data.error })
        } else {
          setJob((prev) => ({ ...prev, status: 'processing' }))
        }
      } catch {
        // transient network hiccup while polling — keep trying silently
      }
    }, 2500)
  }

  const handleProcess = async () => {
    setFieldError('')

    if (activeTab === 'tts' && !textInput.trim()) {
      setFieldError(t.alerts.enterTextFirst)
      return
    }
    if (endpoint.needsFile && !selectedFile) {
      setFieldError(t.alerts.selectFileFirst)
      return
    }

    try {
      setJob({ status: 'uploading' })
      setElapsedSec(0)
      const startedAt = Date.now()
      tickRef.current = setInterval(() => setElapsedSec(Math.floor((Date.now() - startedAt) / 1000)), 1000)

      const formData = new FormData()
      if (endpoint.needsFile && selectedFile) formData.append('file', selectedFile)
      if (activeTab === 'tts') formData.append('text', textInput.trim())
      const extra = endpoint.fields({ option: selectedOption, lang })
      Object.entries(extra).forEach(([k, v]) => formData.append(k, v))

      const res = await fetch(endpoint.url, {
        method: 'POST',
        headers: session ? { Authorization: `Bearer ${session.access_token}` } : undefined,
        body: formData,
      })
      const data = await res.json()

      if (!res.ok || !data.jobId) {
        clearTimers()
        setJob({ status: 'failed', error: data.error || t.alerts.requestFailed })
        return
      }

      setJob({ status: 'queued', jobId: data.jobId })
      pollStatus(data.jobId)
    } catch {
      clearTimers()
      setJob({ status: 'failed', error: t.alerts.requestFailed })
    }
  }

  const resultLinks = job.result
    ? Object.entries(job.result).filter(
        (entry): entry is [string, string] => entry[0] !== 'type' && typeof entry[1] === 'string' && entry[1].startsWith('http')
      )
    : []
  const resultMeta = job.result
    ? Object.entries(job.result).filter(
        ([k, v]) => k !== 'type' && !(typeof v === 'string' && v.startsWith('http'))
      )
    : []

  const jobStatusLabel: Record<JobStatus, string> = {
    idle: '',
    uploading: t.job.uploading,
    queued: t.job.queued,
    processing: t.job.processing,
    done: t.job.done,
    failed: t.job.failed,
  }

  if (checkingSession) {
    return <main className="min-h-screen scene" />
  }

  return (
    <main className="min-h-screen scene">
      {/* Top Nav */}
      <nav className="sticky top-0 z-20 flex justify-between items-center px-4 sm:px-6 py-3 bg-ink-soft/95 backdrop-blur border-b border-line gap-3">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-base sm:text-lg text-text-hi shrink-0">
          <span className="text-xl" aria-hidden="true">🪄</span> <span>{brand}</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <span className="bg-gold-wash text-gold px-3 py-1.5 rounded-pill text-xs font-bold border border-gold-dim/30 whitespace-nowrap font-mono-num">
            💎 {profile ? profile.credits_minutes : '—'} <span className="font-sans">{t.dashboardNav.credits}</span>
          </span>
          <button
            onClick={handleLogout}
            title={t.dashboardNav.logout}
            className="w-8 h-8 bg-gradient-to-br from-gold to-gold-dim rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
          >
            {(profile?.full_name || profile?.email || session?.user.email || '?').charAt(0).toUpperCase()}
          </button>
        </div>
      </nav>

      {/* Tool filmstrip — sticky horizontal strip on mobile, becomes a sidebar list on desktop */}
      <div className="md:hidden sticky top-[57px] z-10 bg-ink-soft/95 backdrop-blur border-b border-line">
        <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
          {TOOL_META.map((meta) => (
            <button
              key={meta.id}
              onClick={() => resetForNewTool(meta.id)}
              className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-pill text-sm font-medium transition-colors border ${
                activeTab === meta.id
                  ? 'bg-gold text-white border-gold'
                  : 'bg-panel text-text-lo border-line hover:border-gold-dim'
              }`}
            >
              <span aria-hidden="true">{meta.emoji}</span> {t.tools[meta.id].name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex max-w-6xl mx-auto">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex w-64 shrink-0 flex-col p-3 gap-0.5 min-h-[calc(100vh-61px)] border-r border-line rtl:border-r-0 rtl:border-l overflow-y-auto">
          <div className="text-xs font-bold text-text-lo uppercase tracking-wider mb-2 px-3 pt-2">{t.sidebar.allTools}</div>
          {TOOL_META.map((meta) => (
            <button
              key={meta.id}
              onClick={() => resetForNewTool(meta.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left rtl:text-right ${
                activeTab === meta.id ? 'bg-gold-wash text-gold border border-gold-dim/30' : 'text-text-lo hover:bg-panel border border-transparent'
              }`}
            >
              <span className="text-lg" aria-hidden="true">{meta.emoji}</span>
              <div className="leading-tight">
                <div className="text-sm">{t.tools[meta.id].name}</div>
                <div className="text-[11px] opacity-70 font-normal truncate max-w-[150px]">{t.tools[meta.id].desc}</div>
              </div>
            </button>
          ))}

          <div className="text-xs font-bold text-text-lo uppercase tracking-wider mt-6 mb-2 px-3">{t.sidebar.menu}</div>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-lo hover:bg-panel transition-colors text-left rtl:text-right">
            <span aria-hidden="true">📁</span> {t.sidebar.myFiles}
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-lo hover:bg-panel transition-colors text-left rtl:text-right">
            <span aria-hidden="true">⚙️</span> {t.sidebar.settings}
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-lo hover:bg-panel transition-colors text-left rtl:text-right">
            <span aria-hidden="true">💎</span> {t.sidebar.credits}
          </button>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 max-w-2xl">
          {/* Header */}
          <div className="mb-5 animate-fade-up">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-text-hi flex items-center gap-2.5">
              <span className="text-2xl sm:text-3xl" aria-hidden="true">{currentMeta.emoji}</span>
              {currentTool.name}
            </h1>
            <p className="text-text-lo text-sm mt-1">{currentTool.desc}</p>
          </div>

          <div className="bg-panel border border-line rounded-card p-4 sm:p-5">
            {/* Options */}
            {'options' in currentTool && currentTool.options && (
              <div className="mb-4">
                <label className="text-xs font-bold text-text-lo uppercase tracking-wider mb-2 block">{t.panel.options}</label>
                <select
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  disabled={isBusy}
                  className="w-full p-3 bg-panel-raised border border-line rounded-xl text-sm text-text-hi focus:outline-none focus:border-gold disabled:opacity-50"
                >
                  <option value="">{t.panel.selectOption}</option>
                  {currentTool.options.map((label, i) => (
                    <option key={currentMeta.optionValues![i]} value={currentMeta.optionValues![i]}>{label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Text Input for TTS */}
            {activeTab === 'tts' && (
              <div className="mb-4">
                <label className="text-xs font-bold text-text-lo uppercase tracking-wider mb-2 block">{t.panel.enterText}</label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={t.panel.textPlaceholder}
                  disabled={isBusy}
                  className="w-full p-4 bg-panel-raised border border-line rounded-xl text-sm text-text-hi focus:outline-none focus:border-gold min-h-[120px] resize-none disabled:opacity-50"
                />
              </div>
            )}

            {/* Upload Zone */}
            {activeTab !== 'tts' && (
              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={currentMeta.accept}
                  className="hidden"
                  onChange={onFileInputChange}
                  disabled={isBusy}
                />
                {!selectedFile ? (
                  <div
                    onDragOver={isBusy ? undefined : onDragOver}
                    onDragLeave={isBusy ? undefined : onDragLeave}
                    onDrop={isBusy ? undefined : onDrop}
                    onClick={() => !isBusy && fileInputRef.current?.click()}
                    className={`viewfinder bg-panel-raised border border-line rounded-card p-8 sm:p-12 text-center transition-colors mb-2 ${
                      isBusy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gold-dim'
                    } ${isDragging ? 'is-active border-gold' : ''}`}
                  >
                    <span className="vf-tl" /><span className="vf-tr" /><span className="vf-bl" /><span className="vf-br" />
                    <div className="text-4xl sm:text-5xl mb-4 animate-float inline-block" aria-hidden="true">{currentMeta.emoji}</div>
                    <h4 className="font-semibold text-text-hi mb-1">{isDragging ? t.panel.dragActive : t.panel.dropFile}</h4>
                    <p className="text-text-lo text-sm">
                      {currentMeta.accept.includes('video') ? t.panel.video : currentMeta.accept.includes('image') ? t.panel.image : t.panel.file}
                      <br />
                      {t.panel.upTo} {currentMeta.maxSize}
                    </p>
                    <button
                      type="button"
                      className="mt-4 bg-gold text-white px-5 py-2 rounded-pill text-sm font-semibold hover:bg-gold-dim transition-colors"
                    >
                      {t.panel.chooseFile}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-panel-raised border border-line rounded-card p-4 mb-2">
                    <span className="text-2xl shrink-0" aria-hidden="true">{currentMeta.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-text-hi truncate">{selectedFile.name}</div>
                      <div className="text-xs text-text-lo font-mono-num">{formatBytes(selectedFile.size)}</div>
                    </div>
                    {!isBusy && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs font-semibold text-teal hover:underline"
                        >
                          {t.panel.changeFile}
                        </button>
                        <button
                          onClick={() => setSelectedFile(null)}
                          className="text-xs font-semibold text-danger hover:underline"
                        >
                          {t.panel.removeFile}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {fieldError && (
              <div className="mb-4 px-4 py-2.5 rounded-xl bg-danger-wash border border-danger/30 text-danger text-sm">
                {fieldError}
              </div>
            )}

            {/* Process Button / Job status */}
            {job.status === 'idle' || job.status === 'failed' ? (
              <>
                {job.status === 'failed' && job.error && (
                  <div className="mb-3 px-4 py-2.5 rounded-xl bg-danger-wash border border-danger/30 text-danger text-sm">
                    {job.error}
                  </div>
                )}
                <button
                  onClick={handleProcess}
                  className="w-full bg-gradient-to-b from-gold to-gold-dim text-white py-3.5 rounded-pill font-bold text-sm hover:shadow-gold transition-shadow"
                >
                  {activeTab === 'tts' ? t.panel.generateSpeech : `${t.panel.processWith} ${currentTool.name}`}
                </button>
              </>
            ) : isBusy ? (
              <div className="rounded-card bg-panel-raised border border-line p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-2 text-sm font-semibold text-gold">
                    <span className="w-2 h-2 rounded-full bg-gold rec-dot" />
                    {jobStatusLabel[job.status]}
                  </span>
                  <span className="font-mono-num text-xs text-text-lo">
                    {t.job.elapsed} {String(Math.floor(elapsedSec / 60)).padStart(2, '0')}:{String(elapsedSec % 60).padStart(2, '0')}
                  </span>
                </div>
                <div className="relative h-1.5 rounded-full bg-line overflow-hidden">
                  <div className="scrub-bar absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-gold to-transparent" />
                </div>
              </div>
            ) : (
              <div className="rounded-card bg-teal-wash border border-teal/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-teal" />
                  <span className="text-sm font-semibold text-teal">{t.job.done}</span>
                </div>
                {resultLinks.length > 0 ? (
                  <div className="flex flex-col gap-2 mb-3">
                    {resultLinks.map(([key, url]) => (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-panel border border-line rounded-xl px-4 py-2.5 text-sm font-medium text-text-hi hover:border-teal transition-colors"
                      >
                        {t.job.resultNamed(key)}
                        <span className="text-teal">↓</span>
                      </a>
                    ))}
                  </div>
                ) : null}
                {resultMeta.length > 0 && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 font-mono-num text-xs text-text-lo">
                    {resultMeta.map(([k, v]) => (
                      <span key={k}>{k.replace(/_/g, ' ')}: {String(v)}</span>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => resetForNewTool(activeTab)}
                  className="w-full bg-panel border border-line text-text-hi py-2.5 rounded-pill font-semibold text-sm hover:border-gold-dim transition-colors"
                >
                  {t.job.startOver}
                </button>
              </div>
            )}
          </div>

          {/* Recent Files — real job history for this account, empty until they exist */}
          <div className="mt-8">
            <h3 className="text-sm font-bold text-text-lo uppercase tracking-wider mb-3">{t.panel.recentFiles}</h3>
            {recentJobs.length === 0 ? (
              <div className="bg-panel border border-line rounded-card p-6 text-center text-sm text-text-lo">
                {t.panel.noFilesYet}
              </div>
            ) : (
              <div className="bg-panel border border-line rounded-card overflow-hidden">
                {recentJobs.map((rj, i, arr) => {
                  const isDone = rj.status === 'done'
                  return (
                    <div
                      key={rj.id}
                      className={`flex items-center gap-3 px-4 py-3.5 hover:bg-panel-raised transition-colors ${i !== arr.length - 1 ? 'border-b border-line' : ''}`}
                    >
                      <span className={`w-1 self-stretch rounded-full ${isDone ? 'bg-teal' : rj.status === 'failed' ? 'bg-danger' : 'bg-gold'}`} />
                      <span className="text-xl shrink-0" aria-hidden="true">{TOOL_EMOJI[rj.tool] || '📄'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-text-hi truncate">{rj.file_name || rj.tool}</div>
                        <div className="text-xs text-text-lo font-mono-num">{new Date(rj.created_at).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}</div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-pill text-xs font-semibold shrink-0 ${
                          isDone ? 'text-teal bg-teal-wash' : rj.status === 'failed' ? 'text-danger bg-danger-wash' : 'text-gold bg-gold-wash'
                        }`}
                      >
                        {rj.status}
                      </span>
                      {isDone && rj.result_url && (
                        <a href={rj.result_url} target="_blank" rel="noopener noreferrer" className="text-teal hover:underline text-sm font-semibold shrink-0">
                          {t.panel.download}
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
