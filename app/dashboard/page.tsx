'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

type ToolTab = 'subtitles' | 'remove-bg' | 'tts' | 'audio' | 'compress' | 'noise' | 'speed' | 'convert'

interface ToolConfig {
  id: ToolTab
  emoji: string
  name: string
  desc: string
  accept: string
  maxSize: string
  options?: { label: string; value: string }[]
}

const TOOLS: ToolConfig[] = [
  {
    id: 'subtitles',
    emoji: '🎬',
    name: 'Auto Subtitles',
    desc: 'Transcribe video to text with professional styling',
    accept: 'video/*',
    maxSize: '500MB',
    options: [
      { label: 'Output: SRT only', value: 'srt' },
      { label: 'Output: Burn-in (Classic)', value: 'burn-classic' },
      { label: 'Output: Burn-in (TikTok)', value: 'burn-tiktok' },
      { label: 'Output: Burn-in (Box)', value: 'burn-box' },
      { label: 'Output: Burn-in (Glow)', value: 'burn-glow' },
      { label: 'Output: Burn-in (Minimal)', value: 'burn-minimal' },
    ],
  },
  {
    id: 'remove-bg',
    emoji: '✂️',
    name: 'Remove Background',
    desc: 'Remove background from product photos',
    accept: 'image/*',
    maxSize: '50MB',
  },
  {
    id: 'tts',
    emoji: '🔊',
    name: 'Text to Speech',
    desc: 'Convert text to natural-sounding voice',
    accept: 'text/plain',
    maxSize: '1MB',
    options: [
      { label: 'Language: Arabic', value: 'ar' },
      { label: 'Language: English', value: 'en' },
      { label: 'Language: French', value: 'fr' },
    ],
  },
  {
    id: 'audio',
    emoji: '🎙️',
    name: 'Audio Enhance',
    desc: 'Remove noise and boost audio quality',
    accept: 'video/*,audio/*',
    maxSize: '500MB',
  },
  {
    id: 'compress',
    emoji: '📦',
    name: 'Compress Video',
    desc: 'Reduce file size while keeping quality',
    accept: 'video/*',
    maxSize: '1GB',
    options: [
      { label: 'Quality: Low (smallest)', value: 'low' },
      { label: 'Quality: Medium (balanced)', value: 'medium' },
      { label: 'Quality: High (best)', value: 'high' },
    ],
  },
  {
    id: 'noise',
    emoji: '🔇',
    name: 'Noise Removal',
    desc: 'Clean background noise from audio/video',
    accept: 'video/*,audio/*',
    maxSize: '500MB',
  },
  {
    id: 'speed',
    emoji: '⚡',
    name: 'Speed Control',
    desc: 'Speed up or slow down your video',
    accept: 'video/*',
    maxSize: '500MB',
    options: [
      { label: '0.5x — Slow motion', value: '0.5' },
      { label: '0.75x — Slightly slow', value: '0.75' },
      { label: '1.25x — Slightly fast', value: '1.25' },
      { label: '1.5x — Fast', value: '1.5' },
      { label: '2.0x — Very fast', value: '2.0' },
    ],
  },
  {
    id: 'convert',
    emoji: '🔄',
    name: 'Convert Format',
    desc: 'Change video/image to any format',
    accept: 'video/*,image/*',
    maxSize: '1GB',
    options: [
      { label: 'Format: MP4', value: 'mp4' },
      { label: 'Format: MOV', value: 'mov' },
      { label: 'Format: AVI', value: 'avi' },
      { label: 'Format: WebM', value: 'webm' },
      { label: 'Format: GIF', value: 'gif' },
      { label: 'Format: MKV', value: 'mkv' },
    ],
  },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<ToolTab>('subtitles')
  const [isDragging, setIsDragging] = useState(false)
  const [selectedOption, setSelectedOption] = useState('')
  const [textInput, setTextInput] = useState('')
  const [files, setFiles] = useState([
    { id: 1, emoji: '🎬', name: 'tutorial_arabic.mp4', meta: '10:24 • 45MB', status: 'Done', tool: 'subtitles' },
    { id: 2, emoji: '🖼️', name: 'product_shoe.png', meta: '2.4MB', status: 'Processing', tool: 'remove-bg' },
    { id: 3, emoji: '🎬', name: 'podcast_ep12.mp4', meta: '45:00 • 120MB', status: 'Done', tool: 'audio' },
    { id: 4, emoji: '📦', name: 'vlog_compressed.mp4', meta: '12MB (was 89MB)', status: 'Done', tool: 'compress' },
  ])

  const currentTool = TOOLS.find((t) => t.id === activeTab)!

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
    alert('Upload coming soon!')
  }, [])

  const handleUpload = () => {
    alert('Upload coming soon!')
  }

  const handleProcess = () => {
    if (activeTab === 'tts' && !textInput.trim()) {
      alert('Please enter text first!')
      return
    }
    alert(`Processing with ${currentTool.name}...`)
  }

  return (
    <main className="min-h-screen bg-cream">
      {/* Top Nav */}
      <nav className="flex justify-between items-center px-6 py-3 bg-white border-b border-stone-650/30">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg text-stone-850">
          <span className="text-xl">✨</span> SubMagic
        </Link>
        <div className="flex items-center gap-4">
          <span className="bg-accent-wash text-accent-dark px-3 py-1 rounded-full text-xs font-bold border border-accent-soft">
            💎 245 Credits
          </span>
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center text-white text-xs font-bold">
            Y
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-60 flex-col p-3 gap-0.5 bg-accent-wash/50 min-h-[calc(100vh-60px)] border-r border-stone-650/20 overflow-y-auto">
          <div className="text-xs font-bold text-stone-750 uppercase tracking-wider mb-3 px-3 pt-2">All Tools</div>
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => { setActiveTab(tool.id); setSelectedOption(''); setTextInput('') }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                activeTab === tool.id
                  ? 'bg-accent text-white shadow-md shadow-accent/20'
                  : 'text-stone-750 hover:bg-white/60'
              }`}
            >
              <span className="text-lg">{tool.emoji}</span>
              <div className="leading-tight">
                <div className="text-sm">{tool.name}</div>
                <div className="text-[10px] opacity-70 font-normal truncate max-w-[120px]">{tool.desc}</div>
              </div>
            </button>
          ))}

          <div className="text-xs font-bold text-stone-750 uppercase tracking-wider mt-6 mb-3 px-3">Menu</div>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-750 hover:bg-white/60 transition-all">
            <span>📁</span> My Files
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-750 hover:bg-white/60 transition-all">
            <span>⚙️</span> Settings
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-750 hover:bg-white/60 transition-all">
            <span>💎</span> Credits
          </button>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6 max-w-3xl mx-auto">
          {/* Mobile Tabs */}
          <div className="md:hidden flex gap-2 mb-4 overflow-x-auto pb-2">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => { setActiveTab(tool.id); setSelectedOption(''); setTextInput('') }}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tool.id ? 'bg-accent text-white' : 'bg-white text-stone-750 border border-stone-650/30'
                }`}
              >
                {tool.emoji} {tool.name}
              </button>
            ))}
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-stone-850 flex items-center gap-3">
              <span className="text-3xl">{currentTool.emoji}</span>
              {currentTool.name}
            </h1>
            <p className="text-stone-750 text-sm mt-1">{currentTool.desc}</p>
          </div>

          {/* Options */}
          {currentTool.options && (
            <div className="mb-4">
              <label className="text-xs font-bold text-stone-750 uppercase tracking-wider mb-2 block">Options</label>
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-full p-3 bg-white border border-stone-650/40 rounded-xl text-sm text-stone-850 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              >
                <option value="">Select option...</option>
                {currentTool.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Text Input for TTS */}
          {activeTab === 'tts' && (
            <div className="mb-4">
              <label className="text-xs font-bold text-stone-750 uppercase tracking-wider mb-2 block">Enter Text</label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="اكتب النص هنا... / Type your text here..."
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
              <div className="absolute -top-3 right-8 w-16 h-16 bg-[radial-gradient(circle,#fbbf24_2px,transparent_2px)] bg-[length:12px_12px] opacity-50 rounded-full" />
              <div className="text-5xl mb-4 animate-float inline-block">{currentTool.emoji}</div>
              <h4 className="font-bold text-stone-850 mb-1">Drop your file here</h4>
              <p className="text-stone-750 text-sm">
                {currentTool.accept.includes('video') ? 'Video' : currentTool.accept.includes('image') ? 'Image' : 'File'} ({currentTool.accept})<br />
                Up to {currentTool.maxSize}
              </p>
              <button className="mt-4 bg-accent text-white px-5 py-2 rounded-organic-sm text-sm font-semibold hover:bg-accent-dark transition-colors">
                Or click to browse
              </button>
            </div>
          )}

          {/* Process Button */}
          <button
            onClick={handleProcess}
            className="w-full bg-gradient-to-br from-accent to-accent-dark text-white py-3.5 rounded-organic-sm font-semibold text-sm hover:shadow-xl hover:shadow-accent/30 transition-all hover:-translate-y-0.5 mb-8"
          >
            {activeTab === 'tts' ? '🔊 Generate Speech' : `⚡ Process with ${currentTool.name}`}
          </button>

          {/* Recent Files */}
          <div>
            <h3 className="text-sm font-bold text-stone-750 uppercase tracking-wider mb-4">Recent Files</h3>
            <div className="space-y-0">
              {files
                .filter((f) => f.tool === activeTab || activeTab === 'subtitles')
                .map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between py-3.5 border-b border-stone-650/40 hover:pl-2 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{file.emoji}</span>
                      <div>
                        <div className="font-medium text-sm text-stone-850">{file.name}</div>
                        <div className="text-xs text-stone-750">{file.meta}</div>
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
                        {file.status}
                      </span>
                      {file.status === 'Done' && (
                        <button className="text-accent hover:text-accent-dark text-sm font-semibold">
                          ↓ Download
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