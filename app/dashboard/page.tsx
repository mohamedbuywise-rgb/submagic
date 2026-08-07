'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'
import LanguageToggle from '@/components/LanguageToggle'

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

export default function Dashboard() {
  const { t, brand } = useLanguage()
  const [activeTab, setActiveTab] = useState<ToolTab>('subtitles')
  const [isDragging, setIsDragging] = useState(false)
  const [selectedOption, setSelectedOption] = useState('')
  const [textInput, setTextInput] = useState('')

  const files = [
    { id: 1, emoji: '🎬', file: t.sampleFiles.f1, status: 'Done' as const, tool: 'subtitles' },
    { id: 2, emoji: '🖼️', file: t.sampleFiles.f2, status: 'Processing' as const, tool: 'remove-bg' },
    { id: 3, emoji: '🎬', file: t.sampleFiles.f3, status: 'Done' as const, tool: 'audio' },
    { id: 4, emoji: '📦', file: t.sampleFiles.f4, status: 'Done' as const, tool: 'compress' },
  ]

  const currentMeta = TOOL_META.find((m) => m.id === activeTab)!
  const currentTool = t.tools[activeTab]

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    alert(t.alerts.uploadSoon)
  }, [t])

  const handleUpload = () => {
    alert(t.alerts.uploadSoon)
  }

  const handleProcess = () => {
    if (activeTab === 'tts' && !textInput.trim()) {
      alert(t.alerts.enterTextFirst)
      return
    }
    alert(`${t.alerts.processingWith} ${currentTool.name}...`)
  }

  return (
    <main className="min-h-screen bg-cream">
      {/* Top Nav */}
      <nav className="flex justify-between items-center px-6 py-3 bg-white border-b border-stone-650/30 gap-3">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg text-stone-850 shrink-0">
          <span className="text-xl">🪄</span> {brand}
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle className="hidden sm:flex" />
          <span className="bg-accent-wash text-accent-dark px-3 py-1 rounded-full text-xs font-bold border border-accent-soft whitespace-nowrap">
            💎 245 {t.dashboardNav.credits}
          </span>
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
            Y
          </div>
        </div>
      </nav>

      <div className="sm:hidden flex justify-center py-3 bg-white border-b border-stone-650/30">
        <LanguageToggle />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-60 flex-col p-3 gap-0.5 bg-accent-wash/50 min-h-[calc(100vh-60px)] border-r border-stone-650/20 overflow-y-auto rtl:border-r-0 rtl:border-l">
          <div className="text-xs font-bold text-stone-750 uppercase tracking-wider mb-3 px-3 pt-2">{t.sidebar.allTools}</div>
          {TOOL_META.map((meta) => (
            <button
              key={meta.id}
              onClick={() => { setActiveTab(meta.id); setSelectedOption(''); setTextInput('') }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left rtl:text-right ${
                activeTab === meta.id
                  ? 'bg-accent text-white shadow-md shadow-accent/20'
                  : 'text-stone-750 hover:bg-white/60'
              }`}
            >
              <span className="text-lg">{meta.emoji}</span>
              <div className="leading-tight">
                <div className="text-sm">{t.tools[meta.id].name}</div>
                <div className="text-[10px] opacity-70 font-normal truncate max-w-[120px]">{t.tools[meta.id].desc}</div>
              </div>
            </button>
          ))}

          <div className="text-xs font-bold text-stone-750 uppercase tracking-wider mt-6 mb-3 px-3">{t.sidebar.menu}</div>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-750 hover:bg-white/60 transition-all text-left rtl:text-right">
            <span>📁</span> {t.sidebar.myFiles}
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-750 hover:bg-white/60 transition-all text-left rtl:text-right">
            <span>⚙️</span> {t.sidebar.settings}
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-750 hover:bg-white/60 transition-all text-left rtl:text-right">
            <span>💎</span> {t.sidebar.credits}
          </button>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6 max-w-3xl mx-auto">
          {/* Mobile Tabs */}
          <div className="md:hidden flex gap-2 mb-4 overflow-x-auto pb-2">
            {TOOL_META.map((meta) => (
              <button
                key={meta.id}
                onClick={() => { setActiveTab(meta.id); setSelectedOption(''); setTextInput('') }}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === meta.id ? 'bg-accent text-white' : 'bg-white text-stone-750 border border-stone-650/30'
                }`}
              >
                {meta.emoji} {t.tools[meta.id].name}
              </button>
            ))}
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-stone-850 flex items-center gap-3">
              <span className="text-3xl">{currentMeta.emoji}</span>
              {currentTool.name}
            </h1>
            <p className="text-stone-750 text-sm mt-1">{currentTool.desc}</p>
          </div>

          {/* Options */}
          {'options' in currentTool && currentTool.options && (
            <div className="mb-4">
              <label className="text-xs font-bold text-stone-750 uppercase tracking-wider mb-2 block">{t.panel.options}</label>
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-full p-3 bg-white border border-stone-650/40 rounded-xl text-sm text-stone-850 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
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
              <label className="text-xs font-bold text-stone-750 uppercase tracking-wider mb-2 block">{t.panel.enterText}</label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={t.panel.textPlaceholder}
                className="w-full p-4 bg-white border border-stone-650/40 rounded-xl text-sm text-stone-850 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 min-h-[120px] resize-none"
              />
            </div>
          )}

          {/* Upload Zone */}
          {activeTab !== 'tts' && (
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={handleUpload}
              className={`relative bg-gradient-to-br from-accent-wash to-orange-100 border-2 border-dashed rounded-organic-lg p-12 text-center cursor-pointer transition-all hover:shadow-lg mb-4 ${
                isDragging ? 'border-accent bg-accent-wash scale-[1.02]' : 'border-accent-soft'
              }`}
            >
              <div className="absolute -top-3 right-8 rtl:right-auto rtl:left-8 w-16 h-16 bg-[radial-gradient(circle,#fbbf24_2px,transparent_2px)] bg-[length:12px_12px] opacity-50 rounded-full" />
              <div className="text-5xl mb-4 animate-float inline-block">{currentMeta.emoji}</div>
              <h4 className="font-bold text-stone-850 mb-1">{t.panel.dropFile}</h4>
              <p className="text-stone-750 text-sm">
                {currentMeta.accept.includes('video') ? t.panel.video : currentMeta.accept.includes('image') ? t.panel.image : t.panel.file} ({currentMeta.accept})<br />
                {t.panel.upTo} {currentMeta.maxSize}
              </p>
              <button className="mt-4 bg-accent text-white px-5 py-2 rounded-organic-sm text-sm font-semibold hover:bg-accent-dark transition-colors">
                {t.panel.browse}
              </button>
            </div>
          )}

          {/* Process Button */}
          <button
            onClick={handleProcess}
            className="w-full bg-gradient-to-br from-accent to-accent-dark text-white py-3.5 rounded-organic-sm font-semibold text-sm hover:shadow-xl hover:shadow-accent/30 transition-all hover:-translate-y-0.5 mb-8"
          >
            {activeTab === 'tts' ? t.panel.generateSpeech : `${t.panel.processWith} ${currentTool.name}`}
          </button>

          {/* Recent Files */}
          <div>
            <h3 className="text-sm font-bold text-stone-750 uppercase tracking-wider mb-4">{t.panel.recentFiles}</h3>
            <div className="space-y-0">
              {files
                .filter((f) => f.tool === activeTab || activeTab === 'subtitles')
                .map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between py-3.5 border-b border-stone-650/40 hover:px-2 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{file.emoji}</span>
                      <div>
                        <div className="font-medium text-sm text-stone-850">{file.file.name}</div>
                        <div className="text-xs text-stone-750">{file.file.meta}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          file.status === 'Done'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {t.fileStatus[file.status]}
                      </span>
                      {file.status === 'Done' && (
                        <button className="text-accent hover:text-accent-dark text-sm font-semibold">
                          {t.panel.download}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
