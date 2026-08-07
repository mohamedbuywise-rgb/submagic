import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SubMagic — Auto Subtitles & AI Backgrounds',
  description: 'Upload your video, get perfect subtitles. Upload your product, get studio backgrounds. No design skills needed.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}