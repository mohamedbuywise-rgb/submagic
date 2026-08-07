import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'ClipGenie — ترجمة تلقائية وخلفيات بالذكاء الاصطناعي',
  description:
    'ارفع الفيديو بتاعك واحصل على ترجمة احترافية. ارفع صورة المنتج واحصل على خلفية استوديو. من غير خبرة تصميم.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // lang/dir start in Arabic and are kept in sync client-side by LanguageProvider
  // (see lib/i18n.tsx) whenever the user switches language.
  return (
    <html lang="ar" dir="rtl">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
